import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Flame, Github, Timer } from 'lucide-react';

const GITHUB_USERNAME = 'gityeop';
const GITHUB_CONTRIBUTIONS_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;
const GITHUB_MONTH_RANGE = 3;
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://158.179.161.109').replace(/\/+$/, '');
const COMMENTS_ENDPOINT = `${API_BASE_URL}/api/comments`;
const VISIT_EVENT_NAME = '[SYSTEM_VISIT_COUNTER]';
const VISITOR_TRACKED_AT_KEY = 'hub_link_visit_tracked_at_v1';
const VISITOR_LOCAL_FALLBACK_KEY = 'hub_link_local_visit_counter_v1';
const VISITOR_TRACK_DEBOUNCE_MS = 1200;
const FOCUS_MODES = [25, 50];

const formatSeconds = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const buildCalendarCells = (baseDate) => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let idx = 0; idx < 42; idx += 1) {
    const dayNumber = idx - firstDay + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      cells.push(null);
      continue;
    }
    cells.push(dayNumber);
  }

  return cells;
};

const toDateKey = (value) => value.toISOString().slice(0, 10);

const asUtcDate = (dateString) => new Date(`${dateString}T00:00:00Z`);

const normalizeContributionDay = (value) => {
  if (!value || typeof value !== 'object') return null;
  if (typeof value.date !== 'string') return null;
  if (typeof value.count !== 'number' || value.count < 0) return null;
  const parsed = asUtcDate(value.date);
  if (Number.isNaN(parsed.getTime())) return null;
  return {
    date: value.date,
    count: value.count
  };
};

const buildContributionLevels = (days) => {
  const counts = days
    .map((day) => day.count)
    .filter((count) => count > 0)
    .sort((a, b) => a - b);

  if (counts.length === 0) return [1, 2, 3];

  const pick = (ratio) => counts[Math.floor((counts.length - 1) * ratio)] || 1;
  return [pick(0.25), pick(0.5), pick(0.75)];
};

const contributionColor = (count, levels) => {
  if (count <= 0) return 'rgba(255, 255, 255, 0.12)';
  if (count <= levels[0]) return '#9be9a8';
  if (count <= levels[1]) return '#40c463';
  if (count <= levels[2]) return '#30a14e';
  return '#216e39';
};

const buildContributionCalendar = (days) => {
  if (!days.length) {
    return [];
  }

  const ordered = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const startKey = ordered[0].date;
  const endKey = ordered[ordered.length - 1].date;
  const contributionMap = new Map(ordered.map((day) => [day.date, day.count]));

  const firstDate = asUtcDate(startKey);
  const lastDate = asUtcDate(endKey);

  const startDate = new Date(firstDate);
  startDate.setUTCDate(startDate.getUTCDate() - startDate.getUTCDay());

  const endDate = new Date(lastDate);
  endDate.setUTCDate(endDate.getUTCDate() + (6 - endDate.getUTCDay()));

  const weeks = [];
  const cursor = new Date(startDate);

  while (cursor <= endDate) {
    const week = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const key = toDateKey(cursor);
      week.push({
        key,
        date: key,
        count: contributionMap.get(key) || 0,
        inRange: key >= startKey && key <= endKey
      });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
};

const selectRecentMonths = (days, months) => {
  if (!days.length) return [];
  const ordered = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const endDate = asUtcDate(ordered[ordered.length - 1].date);
  const startDate = new Date(endDate);
  startDate.setUTCMonth(startDate.getUTCMonth() - months);

  return ordered.filter((day) => asUtcDate(day.date) >= startDate);
};

const isVisitEventComment = (item) => {
  if (!item || typeof item !== 'object') return false;
  return typeof item.name === 'string' && item.name.trim() === VISIT_EVENT_NAME;
};

const trackVisitEvent = async () => {
  const response = await fetch(COMMENTS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: VISIT_EVENT_NAME,
      message: `visit:${new Date().toISOString()}`
    })
  });
  if (!response.ok) {
    throw new Error(`Visit track error: ${response.status}`);
  }
};

const readVisitCount = async () => {
  const response = await fetch(COMMENTS_ENDPOINT, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Visit read error: ${response.status}`);
  const payload = await response.json();
  if (!Array.isArray(payload)) throw new Error('Unexpected comments payload');
  return payload.filter(isVisitEventComment).length;
};

const readLocalFallbackCount = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(VISITOR_LOCAL_FALLBACK_KEY);
    const count = Number(raw || '0');
    return Number.isFinite(count) && count > 0 ? count : 0;
  } catch (error) {
    return null;
  }
};

const writeLocalFallbackCount = (nextCount) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(VISITOR_LOCAL_FALLBACK_KEY, String(nextCount));
  } catch (error) {
    // ignore storage errors
  }
};

const DesktopWidgets = () => {
  const [githubData, setGithubData] = useState({
    loading: true,
    error: '',
    levels: [1, 2, 3],
    weeks: []
  });
  const [totalVisits, setTotalVisits] = useState(null);
  const [focusMode, setFocusMode] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const today = useMemo(() => new Date(), []);
  const calendarCells = useMemo(() => buildCalendarCells(today), [today]);
  const monthLabel = today.toLocaleDateString([], { month: 'long', year: 'numeric' });
  const todayNumber = today.getDate();
  const githubPlaceholderWeeks = useMemo(
    () =>
      Array.from({ length: 13 }, (_, weekIndex) =>
        Array.from({ length: 7 }, (_, dayIndex) => ({
          key: `placeholder-${weekIndex}-${dayIndex}`,
          date: '',
          count: 0,
          inRange: true
        }))
      ),
    []
  );

  const shouldShowGithubPlaceholder =
    githubData.loading || Boolean(githubData.error) || githubData.weeks.length === 0;
  const githubWeeks = shouldShowGithubPlaceholder ? githubPlaceholderWeeks : githubData.weeks;

  useEffect(() => {
    setIsTimerRunning(false);
    setSecondsLeft(focusMode * 60);
  }, [focusMode]);

  useEffect(() => {
    if (!isTimerRunning) return undefined;
    const timerId = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isTimerRunning]);

  useEffect(() => {
    let cancelled = false;

    const fetchGithubActivity = async () => {
      try {
        const contributionResponse = await fetch(GITHUB_CONTRIBUTIONS_URL, {
          headers: { Accept: 'application/json' }
        });
        if (!contributionResponse.ok) {
          throw new Error(`GitHub contributions API error: ${contributionResponse.status}`);
        }

        const contributionPayload = await contributionResponse.json();
        const contributionDays = Array.isArray(contributionPayload?.contributions)
          ? contributionPayload.contributions.map(normalizeContributionDay).filter(Boolean)
          : [];
        if (contributionDays.length === 0) {
          throw new Error('Unexpected GitHub contributions payload');
        }

        const recentQuarterDays = selectRecentMonths(contributionDays, GITHUB_MONTH_RANGE);
        const levels = buildContributionLevels(recentQuarterDays);
        const weeks = buildContributionCalendar(recentQuarterDays);
        if (!cancelled) {
          setGithubData({
            loading: false,
            error: '',
            levels,
            weeks
          });
        }
      } catch (error) {
        if (!cancelled) {
          setGithubData((prev) => ({
            ...prev,
            loading: false,
            error: 'GitHub contribution data is unavailable right now.'
          }));
        }
      }
    };

    fetchGithubActivity();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const trackVisitors = async () => {
      let shouldTrackVisit = true;
      try {
        if (typeof window !== 'undefined') {
          try {
            const trackedAtRaw = window.sessionStorage.getItem(VISITOR_TRACKED_AT_KEY) || '0';
            const trackedAt = Number(trackedAtRaw);
            const now = Date.now();

            if (Number.isFinite(trackedAt) && now - trackedAt < VISITOR_TRACK_DEBOUNCE_MS) {
              shouldTrackVisit = false;
            }

            if (shouldTrackVisit) {
              window.sessionStorage.setItem(VISITOR_TRACKED_AT_KEY, String(now));
            }
          } catch (error) {
            shouldTrackVisit = true;
          }
        }

        if (shouldTrackVisit) {
          await trackVisitEvent();
        }

        const visits = await readVisitCount();

        if (!cancelled) {
          setTotalVisits(visits);
        }
      } catch (error) {
        const currentLocalCount = readLocalFallbackCount() || 0;
        const nextLocalCount = shouldTrackVisit ? currentLocalCount + 1 : currentLocalCount;
        if (shouldTrackVisit) writeLocalFallbackCount(nextLocalCount);

        if (!cancelled) {
          setTotalVisits(nextLocalCount || null);
        }
      }
    };

    trackVisitors();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="desktop-widgets-layer" data-no-drag>
      <style>{`
        .desktop-widgets-layer {
          position: fixed;
          top: 18px;
          left: 18px;
          right: 18px;
          z-index: 30;
          pointer-events: none;
        }
        .desktop-widgets-layout {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
        }
        .desktop-widgets-left {
          display: grid;
          grid-template-columns: auto auto;
          gap: 10px;
          width: fit-content;
          align-items: start;
        }
        .desktop-widgets-right {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          width: min(220px, 100%);
        }
        .desktop-widget-card {
          pointer-events: auto;
          border-radius: 18px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.34);
          background: linear-gradient(150deg, rgba(22, 24, 30, 0.56), rgba(45, 55, 72, 0.38));
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          color: #f3f5fb;
          box-shadow: 0 14px 24px rgba(0, 0, 0, 0.25);
        }
        .desktop-widget-github {
          align-self: start;
          justify-self: start;
          width: fit-content;
          max-width: 100%;
        }
        .desktop-widget-calendar {
          width: 220px;
        }
        .desktop-widget-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.03em;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .desktop-widget-metric {
          font-size: 23px;
          line-height: 1.1;
          font-weight: 700;
        }
        .desktop-widget-subtle {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.74);
          line-height: 1.4;
        }
        .desktop-widget-button {
          border: 1px solid rgba(255, 255, 255, 0.26);
          background: rgba(255, 255, 255, 0.12);
          color: #f8fafc;
          border-radius: 10px;
          padding: 7px 10px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .desktop-widget-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }
        .desktop-widget-button.is-primary {
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          border-color: rgba(147, 197, 253, 0.55);
        }
        .desktop-widget-button.is-primary:hover {
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
        }
        .desktop-gh-chart {
          margin-top: 2px;
        }
        .desktop-gh-heatmap {
          display: flex;
          gap: 3px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 2px;
        }
        .desktop-gh-heatmap::-webkit-scrollbar {
          display: none;
        }
        .desktop-gh-week-column {
          width: 8px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .desktop-gh-day {
          width: 8px;
          height: 8px;
          border-radius: 2px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .desktop-gh-day.is-out-of-range {
          background: transparent;
          border-color: transparent;
        }
        .desktop-gh-day.is-placeholder {
          background: rgba(255, 255, 255, 0.12);
        }
        .desktop-calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 4px;
          margin-top: 6px;
        }
        .desktop-calendar-weekday {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.62);
          text-align: center;
          font-weight: 600;
        }
        .desktop-calendar-day {
          font-size: 11px;
          min-height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 7px;
          color: rgba(255, 255, 255, 0.9);
          background: rgba(255, 255, 255, 0.04);
        }
        .desktop-calendar-day.is-today {
          background: linear-gradient(140deg, #2563eb, #3b82f6);
          font-weight: 700;
          color: #f8fafc;
        }
        @media (max-width: 860px) {
          .desktop-widgets-layer {
            left: 14px;
            right: 14px;
            top: 14px;
          }
          .desktop-widgets-layout {
            flex-direction: column;
            align-items: stretch;
          }
          .desktop-widgets-left {
            grid-template-columns: 1fr;
            width: 100%;
          }
          .desktop-widgets-right {
            width: 100%;
          }
          .desktop-widget-calendar, .desktop-widget-github {
            width: auto;
          }
        }
      `}</style>

      <div className="desktop-widgets-layout">
        <div className="desktop-widgets-left">
          <section className="desktop-widget-card desktop-widget-calendar">
            <div className="desktop-widget-title">
              <CalendarDays size={14} />
              {monthLabel}
            </div>

            <div className="desktop-calendar-grid">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                <div key={day} className="desktop-calendar-weekday">
                  {day}
                </div>
              ))}

              {calendarCells.map((day, idx) =>
                day ? (
                  <div
                    key={`${day}-${idx}`}
                    className={`desktop-calendar-day ${day === todayNumber ? 'is-today' : ''}`}
                  >
                    {day}
                  </div>
                ) : (
                  <div key={`empty-${idx}`} />
                )
              )}
            </div>
          </section>

          <section className="desktop-widget-card desktop-widget-github">
            <div className="desktop-widget-title">
              <Github size={14} />
              GitHub Activity
            </div>

            <div className="desktop-gh-chart">
              <div className="desktop-gh-heatmap">
                {githubWeeks.map((week, weekIndex) => (
                  <div key={`week-${weekIndex}`} className="desktop-gh-week-column">
                    {week.map((day) => (
                      <div
                        key={day.key}
                        className={`desktop-gh-day ${day.inRange ? '' : 'is-out-of-range'} ${shouldShowGithubPlaceholder ? 'is-placeholder' : ''}`}
                        style={
                          !shouldShowGithubPlaceholder && day.inRange
                            ? { background: contributionColor(day.count, githubData.levels) }
                            : undefined
                        }
                        title={!shouldShowGithubPlaceholder && day.inRange ? `${day.date}: ${day.count} contributions` : ''}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="desktop-widgets-right">
          <section className="desktop-widget-card">
            <div className="desktop-widget-title">
              <Flame size={14} />
              Visitors
            </div>
            <div className="desktop-widget-metric">{typeof totalVisits === 'number' ? totalVisits : '--'}</div>
            <div className="desktop-widget-subtle">Total visits</div>
          </section>

          <section className="desktop-widget-card">
            <div className="desktop-widget-title">
              <Timer size={14} />
              Focus Timer
            </div>

            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              {FOCUS_MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className="desktop-widget-button"
                  onClick={() => setFocusMode(mode)}
                  style={{
                    flex: 1,
                    background: focusMode === mode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {mode}m
                </button>
              ))}
            </div>

            <div className="desktop-widget-metric" style={{ marginBottom: '10px' }}>
              {formatSeconds(secondsLeft)}
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                className="desktop-widget-button is-primary"
                onClick={() => setIsTimerRunning((prev) => !prev)}
                style={{ flex: 1 }}
              >
                {isTimerRunning ? 'Pause' : 'Start'}
              </button>
              <button
                type="button"
                className="desktop-widget-button"
                onClick={() => {
                  setIsTimerRunning(false);
                  setSecondsLeft(focusMode * 60);
                }}
                style={{ flex: 1 }}
              >
                Reset
              </button>
            </div>
            <div className="desktop-widget-subtle" style={{ marginTop: '8px' }}>
              {secondsLeft === 0 ? 'Session complete. Take a short break.' : 'Choose 25m or 50m focus mode.'}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DesktopWidgets;
