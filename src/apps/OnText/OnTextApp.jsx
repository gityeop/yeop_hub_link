import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ActionPanel from './ActionPanel';

const introPreviewCards = [
    {
        title: 'Inline AI (BYOK)',
        mediaSrc: '/ontext-demo/inline_ai.mp4',
        description: 'Edit or rewrite selected text inline without context switching.'
    },
    {
        title: 'URL Action Search',
        mediaSrc: '/ontext-demo/url_action.mp4',
        description: 'Send selected text to Google, Brave, DuckDuckGo, or YouTube instantly.'
    },
    {
        title: 'Prompt Relay',
        mediaSrc: '/ontext-demo/prompt_panel.mp4',
        description: 'Forward text with preset prompts to ChatGPT, Gemini, or Claude.'
    },
    {
        title: 'Bi-directional Translate',
        mediaSrc: '/ontext-demo/translation.mp4',
        description: 'Translate in both directions and keep source context.'
    },
    {
        title: 'Case Converting',
        mediaSrc: '/ontext-demo/caseConverting.mp4',
        description: 'Convert quickly to camel, pascal, snake, kebab, constant, and dot case.'
    }
];

const OnTextApp = ({ onClose }) => {
    const [selection, setSelection] = useState(null);
    const [panelAnchor, setPanelAnchor] = useState(null);
    const [containerRect, setContainerRect] = useState(null);
    const [result, setResult] = useState(null);
    const [introCardIndex, setIntroCardIndex] = useState(0);
    const containerRef = useRef(null);
    const suppressSelectionCloseRef = useRef(false);

    const actionShortcutMap = {
        q: 'Inline AI (BYOK)',
        w: 'URL Action Search',
        e: 'Prompt Relay',
        r: 'Bi-directional Translate',
        t: 'Case Converting',
        a: 'Shell/AppleScript Workflow',
        s: 'Shortcut Action'
    };

    const showPanelFromSelection = () => {
        const activeSelection = window.getSelection();
        if (activeSelection && activeSelection.toString().length > 0) {
            const range = activeSelection.getRangeAt(0);
            const containerEl = containerRef.current;
            if (containerEl && !containerEl.contains(range.commonAncestorContainer)) {
                return;
            }
            const rect = range.getBoundingClientRect();
            const nextContainerRect = containerEl
                ? containerEl.getBoundingClientRect()
                : null;

            setContainerRect(nextContainerRect);
            setPanelAnchor({
                x: rect.left + (rect.width / 2),
                y: rect.top
            });
            setSelection(activeSelection.toString());
            setResult(null);
        } else {
            setPanelAnchor(null);
            setSelection(null);
        }
    };

    const getActionPreview = (actionLabel) => {
        switch (actionLabel) {
            case 'Inline AI (BYOK)':
                return {
                    mediaType: 'video',
                    mediaSrc: '/ontext-demo/inline_ai.mp4',
                    description: 'Run inline AI with your own API key, without leaving the current context.'
                };
            case 'URL Action Search':
                return {
                    mediaType: 'video',
                    mediaSrc: '/ontext-demo/url_action.mp4',
                    description: 'Trigger URL actions to search instantly in Google, Brave, DuckDuckGo, YouTube, and more.'
                };
            case 'Prompt Relay':
                return {
                    mediaType: 'video',
                    mediaSrc: '/ontext-demo/prompt_panel.mp4',
                    description: 'Send selected text to ChatGPT, Gemini, or Claude with predefined prompts.'
                };
            case 'Bi-directional Translate':
                return {
                    mediaType: 'video',
                    mediaSrc: '/ontext-demo/translation.mp4',
                    description: 'Translate selected text in both directions and compare source and target instantly.'
                };
            case 'Case Converting':
                return {
                    mediaType: 'video',
                    mediaSrc: '/ontext-demo/caseConverting.mp4',
                    description: 'Convert to camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and dot.case.'
                };
            case 'Shell/AppleScript Workflow':
                return {
                    mediaType: 'video',
                    mediaSrc: '/ontext-demo/shell_script.mp4',
                    description: 'Build personal workflows with shell scripts or AppleScript and run them on selected text.'
                };
            case 'Shortcut Action':
                return {
                    mediaType: 'video',
                    mediaSrc: '/ontext-demo/shortcuts.mp4',
                    description: 'Trigger Apple Shortcuts actions directly, so OnText can integrate with your existing automations.'
                };
            default:
                return {
                    mediaType: 'gif',
                    mediaSrc: 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif',
                    description: 'Apply the selected action to the highlighted text.'
                };
        }
    };

    useEffect(() => {
        const handleShortcut = (e) => {
            if (!panelAnchor || e.repeat) return;
            const key = e.key?.toLowerCase();
            if (key && actionShortcutMap[key]) {
                e.preventDefault();
                suppressSelectionCloseRef.current = true;
                setTimeout(() => {
                    suppressSelectionCloseRef.current = false;
                }, 0);
                handleAction(actionShortcutMap[key]);
            }
        };

        const handleKeyDown = (e) => {
            handleShortcut(e);
            if (e.key === 'F3') {
                e.preventDefault();
                showPanelFromSelection();
            }
        };

        const handlerOptions = { capture: true };
        document.addEventListener('keydown', handleKeyDown, handlerOptions);
        window.addEventListener('keydown', handleKeyDown, handlerOptions);
        return () => {
            document.removeEventListener('keydown', handleKeyDown, handlerOptions);
            window.removeEventListener('keydown', handleKeyDown, handlerOptions);
        };
    }, [panelAnchor, selection]);

    useEffect(() => {
        const handleSelectionChange = () => {
            const activeSelection = window.getSelection();
            if (suppressSelectionCloseRef.current) {
                return;
            }
            if (!activeSelection || activeSelection.toString().length === 0) {
                setPanelAnchor(null);
                setSelection(null);
            }
        };

        document.addEventListener('selectionchange', handleSelectionChange);
        return () => document.removeEventListener('selectionchange', handleSelectionChange);
    }, []);

    useEffect(() => {
        const id = setInterval(() => {
            setIntroCardIndex((prev) => (prev + 1) % introPreviewCards.length);
        }, 3200);
        return () => clearInterval(id);
    }, []);

    const handleAction = (actionLabel) => {
        const preview = getActionPreview(actionLabel);
        setResult({
            action: actionLabel,
            text: selection || '',
            ...preview
        });
    };

    return (
        <div
            ref={containerRef}
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                cursor: 'text'
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {}}
        >
            <div style={{
                padding: '16px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f9f9f9'
            }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div data-no-drag onPointerDown={(e) => e.stopPropagation()} onClick={onClose} style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5F56', cursor: 'pointer' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFBD2E' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27C93F' }} />
                </div>
                <div style={{ fontWeight: '600', color: '#333' }}>OnText Demo</div>
                <div style={{ width: '40px' }}></div>
            </div>

            <div style={{
                flex: 1,
                display: 'flex',
                position: 'relative',
                minHeight: 0
            }}>
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px',
                    borderRight: '1px solid #eee',
                    minHeight: 0
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            color: '#333',
                            marginBottom: '20px',
                            cursor: 'text'
                        }}>
                            Select this sentence, then press F3.
                        </p>
                        <p style={{ color: '#888', fontSize: '14px', userSelect: 'none', WebkitUserSelect: 'none', cursor: 'default' }}>
                            Select the text above to see the OnText action panel.
                        </p>
                    </div>
                </div>

                <div style={{
                    width: '420px',
                    backgroundColor: '#fafafa',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: '1px solid #eaeaea',
                    minHeight: 0,
                    overflow: 'hidden'
                }}>
                    {result && (
                        <h3
                            style={{
                                margin: '0 0 16px 0',
                                height: '18px',
                                fontSize: '14px',
                                color: '#555',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Action Preview
                        </h3>
                    )}

                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: '2px' }}
                            >
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Action Preview</div>
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '4px 8px',
                                            backgroundColor: '#007AFF',
                                            color: 'white',
                                            borderRadius: '6px',
                                            fontSize: '11px',
                                            fontWeight: '600'
                                        }}>
                                            {result.action}
                                        </div>
                                    </div>

                                    <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E5E7EB', background: '#F8FAFC', marginBottom: '10px' }}>
                                        {result.mediaType === 'video' ? (
                                            <video
                                                src={result.mediaSrc}
                                                controls
                                                muted
                                                loop
                                                autoPlay
                                                playsInline
                                                style={{ width: '100%', height: '210px', objectFit: 'cover', display: 'block', background: '#111' }}
                                            />
                                        ) : (
                                            <img
                                                src={result.mediaSrc}
                                                alt={`${result.action} preview`}
                                                style={{ width: '100%', height: '210px', objectFit: 'cover', display: 'block' }}
                                            />
                                        )}
                                    </div>

                                    <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.45', marginBottom: '10px' }}>
                                        {result.description}
                                    </div>

                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ flex: 1, color: '#6B7280', fontSize: '13px', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '2px' }}
                            >
                                <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: '266px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mini Demo</div>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            {introPreviewCards.map((_, idx) => (
                                                <div
                                                    key={`dot-${idx}`}
                                                    style={{
                                                        width: '6px',
                                                        height: '6px',
                                                        borderRadius: '999px',
                                                        background: idx === introCardIndex ? '#2563EB' : '#D1D5DB'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={`intro-card-${introCardIndex}`}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.25 }}
                                            style={{ height: '212px' }}
                                        >
                                            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #E5E7EB', background: '#0f172a' }}>
                                                <video
                                                    src={introPreviewCards[introCardIndex].mediaSrc}
                                                    autoPlay
                                                    muted
                                                    loop
                                                    playsInline
                                                    style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }}
                                                />
                                            </div>
                                            <div
                                                style={{
                                                    marginTop: '8px',
                                                    fontWeight: '600',
                                                    color: '#111827',
                                                    height: '20px',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {introPreviewCards[introCardIndex].title}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '12px',
                                                    color: '#6B7280',
                                                    height: '34px',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {introPreviewCards[introCardIndex].description}
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '12px' }}>
                                    <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                                        Quick Start
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                                        {['F3', 'q', 'w', 'e', 'r', 't', 'a', 's'].map((keyLabel) => (
                                            <div
                                                key={keyLabel}
                                                style={{
                                                    minWidth: '26px',
                                                    padding: '4px 8px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #D1D5DB',
                                                    background: '#F9FAFB',
                                                    fontSize: '12px',
                                                    color: '#111827',
                                                    fontWeight: '600',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                {keyLabel}
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#6B7280' }}>
                                        {panelAnchor
                                            ? 'Action panel is open. Press one key to run an action preview.'
                                            : 'Select text, press F3, then press one action key.'}
                                    </div>
                                </div>

                                <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '12px' }}>
                                    <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                                        Integrations
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        {['BYOK', 'DeepL', 'Shortcuts', 'Shell/AppleScript'].map((badge) => (
                                            <div
                                                key={badge}
                                                style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '999px',
                                                    border: '1px solid #D1D5DB',
                                                    background: '#F8FAFC',
                                                    fontSize: '11px',
                                                    color: '#374151',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {badge}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div style={{
                padding: '12px',
                backgroundColor: '#f1f1f1',
                borderTop: '1px solid #e0e0e0',
                textAlign: 'center',
                fontSize: '12px',
                color: '#666'
            }}>
                Visit <a href="https://gityeop.github.io/OnText/" target="_blank" rel="noopener noreferrer" style={{ color: '#007AFF', textDecoration: 'none' }}>gityeop.github.io/OnText</a> for more.
            </div>

            <AnimatePresence>
                {panelAnchor && containerRect && (
                    <ActionPanel
                        anchor={panelAnchor}
                        containerRect={containerRect}
                        onAction={handleAction}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default OnTextApp;
