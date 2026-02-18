import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, MessageSquare, User } from 'lucide-react';
import { motion } from 'framer-motion';

const STORAGE_KEY = 'hub_link_guestbook_comments_v1';
const MAX_COMMENTS = 200;
const MAX_MESSAGE_LENGTH = 300;
const DEFAULT_COMMENTS = [
    {
        id: 'welcome',
        name: 'Lim Sang Yeob',
        text: '방문해주셔서 감사합니다. 아래에 자유롭게 댓글을 남겨주세요.',
        isOwner: true,
        createdAt: new Date().toISOString()
    }
];

const isValidComment = (value) =>
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.text === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.isOwner === 'boolean';

const loadComments = () => {
    if (typeof window === 'undefined') return DEFAULT_COMMENTS;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_COMMENTS;

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return DEFAULT_COMMENTS;

        const sanitized = parsed.filter(isValidComment).slice(-MAX_COMMENTS);
        return sanitized.length > 0 ? sanitized : DEFAULT_COMMENTS;
    } catch (error) {
        return DEFAULT_COMMENTS;
    }
};

const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const CommentBubble = ({ name, text, createdAt, isOwner }) => (
    <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        style={{
            alignSelf: isOwner ? 'flex-start' : 'flex-end',
            maxWidth: '76%',
            borderRadius: '16px',
            padding: '10px 12px',
            backgroundColor: isOwner ? '#ECEEF2' : '#007AFF',
            color: isOwner ? '#1C1C1E' : '#FFFFFF',
            boxShadow: '0 3px 12px rgba(0,0,0,0.08)'
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <strong style={{ fontSize: '12px', fontWeight: 600 }}>{name}</strong>
            <span style={{ fontSize: '11px', opacity: 0.75 }}>{formatTimestamp(createdAt)}</span>
        </div>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>{text}</p>
    </motion.div>
);

const IMessageApp = ({ onClose }) => {
    const [comments, setComments] = useState(DEFAULT_COMMENTS);
    const [nickname, setNickname] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [hasLoaded, setHasLoaded] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        setComments(loadComments());
        setHasLoaded(true);
    }, []);

    useEffect(() => {
        if (!hasLoaded || typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(comments.slice(-MAX_COMMENTS)));
        } catch (error) {
            // Ignore storage write errors and keep in-memory comments.
        }
    }, [comments, hasLoaded]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [comments]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const text = messageInput.trim();
        if (!text) return;

        const newComment = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: (nickname.trim() || 'Visitor').slice(0, 24),
            text: text.slice(0, MAX_MESSAGE_LENGTH),
            isOwner: false,
            createdAt: new Date().toISOString()
        };

        setComments((prev) => [...prev, newComment].slice(-MAX_COMMENTS));
        setMessageInput('');
    };

    return (
        <div
            style={{
                display: 'flex',
                height: '100%',
                background: '#F5F7FB',
                borderRadius: '12px',
                overflow: 'hidden'
            }}
        >
            <style>{`
                .guestbook-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .guestbook-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .guestbook-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(60, 60, 67, 0.2);
                    border-radius: 3px;
                }
            `}</style>

            <aside
                style={{
                    width: '250px',
                    padding: '10px',
                    background: '#FFFFFF',
                    borderRight: '1px solid rgba(60, 60, 67, 0.1)',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div
                    className="window-controls"
                    style={{ display: 'flex', gap: '8px', padding: '10px 8px' }}
                    onPointerDown={(event) => event.stopPropagation()}
                >
                    <div
                        onClick={onClose}
                        style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: '#FF5F56',
                            border: '0.5px solid rgba(0,0,0,0.1)',
                            cursor: 'pointer'
                        }}
                    />
                    <div
                        style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: '#FFBD2E',
                            border: '0.5px solid rgba(0,0,0,0.1)'
                        }}
                    />
                    <div
                        style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: '#27C93F',
                            border: '0.5px solid rgba(0,0,0,0.1)'
                        }}
                    />
                </div>

                <div
                    style={{
                        marginTop: '8px',
                        borderRadius: '14px',
                        background: 'linear-gradient(160deg, #EAF3FF 0%, #F5F8FF 100%)',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        border: '1px solid rgba(0, 122, 255, 0.12)'
                    }}
                >
                    <div
                        style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            backgroundColor: '#007AFF',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <MessageSquare size={18} />
                    </div>

                    <div>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#1C1C1E' }}>Visitor Guestbook</h3>
                        <p style={{ margin: '8px 0 0', color: '#636366', fontSize: '13px', lineHeight: 1.45 }}>
                            기존 더미 대화는 제거되었습니다. 방문자가 댓글을 남길 수 있습니다.
                        </p>
                    </div>

                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            alignSelf: 'flex-start',
                            background: '#FFFFFF',
                            border: '1px solid rgba(60, 60, 67, 0.12)',
                            borderRadius: '999px',
                            padding: '6px 10px',
                            fontSize: '12px',
                            color: '#3A3A3C'
                        }}
                    >
                        Total comments: {comments.length}
                    </div>
                </div>
            </aside>

            <main
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px 18px 20px'
                }}
            >
                <div
                    className="guestbook-scrollbar"
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        paddingRight: '4px',
                        marginBottom: '12px'
                    }}
                    onPointerDown={(event) => event.stopPropagation()}
                >
                    {comments.map((comment) => (
                        <CommentBubble key={comment.id} {...comment} />
                    ))}
                    <div ref={bottomRef} />
                </div>

                <form
                    onSubmit={handleSubmit}
                    style={{
                        borderRadius: '16px',
                        background: '#FFFFFF',
                        border: '1px solid rgba(60, 60, 67, 0.12)',
                        boxShadow: '0 8px 24px rgba(10, 10, 10, 0.06)',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}
                    onPointerDown={(event) => event.stopPropagation()}
                >
                    <label
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: '#F7F7F9',
                            border: '1px solid rgba(60, 60, 67, 0.12)',
                            borderRadius: '10px',
                            padding: '0 10px'
                        }}
                    >
                        <User size={15} color="#6E6E73" />
                        <input
                            type="text"
                            value={nickname}
                            onChange={(event) => setNickname(event.target.value)}
                            placeholder="닉네임 (선택)"
                            maxLength={24}
                            style={{
                                width: '100%',
                                border: 'none',
                                background: 'transparent',
                                outline: 'none',
                                height: '36px',
                                fontSize: '14px'
                            }}
                        />
                    </label>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            gap: '10px'
                        }}
                    >
                        <textarea
                            value={messageInput}
                            onChange={(event) => setMessageInput(event.target.value)}
                            placeholder="댓글을 입력하세요..."
                            maxLength={MAX_MESSAGE_LENGTH}
                            rows={2}
                            style={{
                                flex: 1,
                                resize: 'none',
                                borderRadius: '10px',
                                border: '1px solid rgba(60, 60, 67, 0.2)',
                                outline: 'none',
                                padding: '9px 10px',
                                fontSize: '14px',
                                lineHeight: 1.4
                            }}
                        />

                        <button
                            type="submit"
                            disabled={!messageInput.trim()}
                            style={{
                                width: '36px',
                                height: '36px',
                                border: 'none',
                                borderRadius: '50%',
                                background: messageInput.trim() ? '#007AFF' : '#B0D5FF',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: messageInput.trim() ? 'pointer' : 'not-allowed'
                            }}
                            aria-label="댓글 보내기"
                        >
                            <ArrowUp size={18} strokeWidth={2.8} />
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default IMessageApp;
