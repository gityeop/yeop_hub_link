import React, { useEffect, useRef, useState } from 'react';
import { Plus, ChevronLeft, Search, Filter, ArrowUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://158.179.161.109').replace(/\/+$/, '');
const COMMENTS_ENDPOINT = `${API_BASE_URL}/api/comments`;
const CHAT_ID = 1;
const MAX_MESSAGE_LENGTH = 300;

const OWNER_DISPLAY_NAME = 'Lim Sang Yeob';
const OWNER_NAME_TAG = '[OWNER]';
const VISIT_EVENT_NAME = '[SYSTEM_VISIT_COUNTER]';

const VISITOR_NAME_KEY = 'hub_link_visitor_name_v1';
const HIDDEN_IDS_KEY = 'hub_link_hidden_comment_ids_v1';

const CONTACT = {
    id: CHAT_ID,
    name: OWNER_DISPLAY_NAME,
    avatarColor: '#8E8E93'
};

const INTRO_MESSAGES = [
    {
        id: 'intro-1',
        serverId: null,
        text: 'Welcome to my portfolio! 👋',
        isOwner: true,
        senderName: OWNER_DISPLAY_NAME,
        timestamp: new Date()
    },
    {
        id: 'intro-2',
        serverId: null,
        text: 'Feel free to leave a message here.',
        isOwner: true,
        senderName: OWNER_DISPLAY_NAME,
        timestamp: new Date()
    }
];

const loadVisitorName = () => {
    if (typeof window === 'undefined') return 'Visitor';
    try {
        const raw = window.localStorage.getItem(VISITOR_NAME_KEY);
        return raw?.trim() ? raw : 'Visitor';
    } catch (error) {
        return 'Visitor';
    }
};

const loadHiddenIds = () => {
    if (typeof window === 'undefined') return [];
    try {
        const raw = window.localStorage.getItem(HIDDEN_IDS_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        return parsed.filter((item) => typeof item === 'string');
    } catch (error) {
        return [];
    }
};

const sanitizeVisitorName = (value) => {
    const trimmed = (value || '').replaceAll(OWNER_NAME_TAG, '').trim();
    const sliced = trimmed.slice(0, 24);
    return sliced || 'Visitor';
};

const normalizeApiComment = (value) => {
    if (!value || typeof value !== 'object') return null;

    const idRaw = value.id;
    const nameRaw = value.name;
    const messageRaw = value.message ?? value.text;
    const createdAtRaw = value.created_at ?? value.createdAt;

    if ((typeof idRaw !== 'number' && typeof idRaw !== 'string') || typeof nameRaw !== 'string') return null;
    if (typeof messageRaw !== 'string' || typeof createdAtRaw !== 'string') return null;

    const rawName = nameRaw.trim();
    if (rawName === VISIT_EVENT_NAME) return null;

    const isOwner = rawName.startsWith(OWNER_NAME_TAG);
    const displayName = isOwner ? rawName.slice(OWNER_NAME_TAG.length).trim() || OWNER_DISPLAY_NAME : sanitizeVisitorName(rawName);

    return {
        id: String(idRaw),
        name: displayName,
        message: messageRaw.slice(0, MAX_MESSAGE_LENGTH),
        createdAt: createdAtRaw,
        isOwner
    };
};

const toMessage = (comment) => {
    const parsedDate = new Date(comment.createdAt);
    return {
        id: `comment-${comment.id}`,
        serverId: String(comment.id),
        text: comment.message,
        isOwner: comment.isOwner,
        senderName: comment.name,
        timestamp: Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate
    };
};

const getConversationDate = (messages) => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || !lastMessage.timestamp) return 'Now';

    const date = new Date(lastMessage.timestamp);
    if (Number.isNaN(date.getTime())) return 'Now';
    if (new Date().toDateString() === date.toDateString()) return 'Now';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const getPreviewText = (message) => {
    if (!message) return 'Feel free to leave a message here.';
    return message.isOwner ? `You: ${message.text}` : `${message.senderName}: ${message.text}`;
};

const formatHeaderDate = (value) => {
    if (!value) return 'Today';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Today';
    return date.toLocaleDateString();
};

const SidebarItem = ({ name, date, preview, avatarColor, isActive, onClick }) => (
    <div
        onClick={onClick}
        onPointerDown={(event) => event.stopPropagation()}
        style={{
            display: 'flex',
            padding: '12px 14px',
            gap: '10px',
            borderRadius: '12px',
            backgroundColor: isActive ? '#007AFF' : 'transparent',
            color: isActive ? 'white' : 'black',
            cursor: 'default',
            transition: 'background-color 0.2s',
            marginBottom: '4px'
        }}
    >
        <div
            style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: isActive ? '#000000' : avatarColor,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: '600',
                flexShrink: 0,
                border: isActive ? '2px solid white' : 'none'
            }}
        >
            {name[0]}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                <span style={{ fontWeight: '600', fontSize: '14px', color: isActive ? 'white' : '#000' }}>{name}</span>
                <span style={{ fontSize: '12px', color: isActive ? 'rgba(255,255,255,0.8)' : '#8E8E93' }}>{date}</span>
            </div>
            <div
                style={{
                    fontSize: '13px',
                    color: isActive ? 'rgba(255,255,255,0.9)' : '#8E8E93',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}
            >
                {preview}
            </div>
        </div>
    </div>
);

const MessageBubble = ({ text, isOwner, senderName, canDelete, onDelete }) => (
    <motion.div
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => {
            if (canDelete && onDelete) onDelete();
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
            alignSelf: isOwner ? 'flex-end' : 'flex-start',
            maxWidth: '70%',
            margin: '2px 0',
            padding: '8px 14px',
            borderRadius: '18px',
            backgroundColor: isOwner ? '#007AFF' : '#E9E9EB',
            color: isOwner ? 'white' : 'black',
            fontSize: '14px',
            lineHeight: '1.4',
            borderBottomRightRadius: isOwner ? '4px' : '18px',
            borderBottomLeftRadius: isOwner ? '18px' : '4px',
            boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
            position: 'relative',
            cursor: canDelete ? 'pointer' : 'default'
        }}
    >
        {!isOwner && senderName && (
            <div style={{ fontSize: '10px', opacity: 0.65, marginBottom: '2px', fontWeight: 600 }}>
                {senderName}
            </div>
        )}
        {text}
    </motion.div>
);

const IMessageApp = ({ onClose }) => {
    const [activeChat, setActiveChat] = useState(CHAT_ID);
    const [allMessages, setAllMessages] = useState({ [CHAT_ID]: INTRO_MESSAGES });
    const [inputValue, setInputValue] = useState('');
    const [visitorName, setVisitorName] = useState(loadVisitorName);
    const [hiddenCommentIds, setHiddenCommentIds] = useState(loadHiddenIds);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isNameEditorOpen, setIsNameEditorOpen] = useState(false);
    const [nameDraft, setNameDraft] = useState('');
    const messagesEndRef = useRef(null);
    const nameEditorRef = useRef(null);

    const currentMessages = allMessages[activeChat] || [];
    const currentContact = CONTACT;
    const conversation = {
        id: CHAT_ID,
        name: CONTACT.name,
        date: isLoading ? 'Loading' : getConversationDate(currentMessages),
        preview: getPreviewText(currentMessages[currentMessages.length - 1]),
        avatarColor: CONTACT.avatarColor
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(VISITOR_NAME_KEY, visitorName);
        } catch (error) {
            // Ignore localStorage persistence errors.
        }
    }, [visitorName]);

    useEffect(() => {
        setNameDraft(visitorName);
    }, [visitorName]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(HIDDEN_IDS_KEY, JSON.stringify(hiddenCommentIds));
        } catch (error) {
            // Ignore localStorage persistence errors.
        }
    }, [hiddenCommentIds]);

    useEffect(() => {
        let cancelled = false;

        const fetchComments = async () => {
            setIsLoading(true);
            setErrorMessage('');
            try {
                const response = await fetch(COMMENTS_ENDPOINT);
                if (!response.ok) throw new Error(`Failed to fetch comments: ${response.status}`);
                const payload = await response.json();
                if (!Array.isArray(payload)) throw new Error('Invalid comments payload');

                const hiddenSet = new Set(hiddenCommentIds);
                const remoteMessages = payload
                    .map(normalizeApiComment)
                    .filter(Boolean)
                    .filter((comment) => !hiddenSet.has(comment.id))
                    .map((comment) => toMessage(comment));

                if (!cancelled) {
                    setAllMessages({ [CHAT_ID]: [...INTRO_MESSAGES, ...remoteMessages] });
                }
            } catch (error) {
                if (!cancelled) {
                    setAllMessages({ [CHAT_ID]: INTRO_MESSAGES });
                    setErrorMessage('댓글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        fetchComments();

        return () => {
            cancelled = true;
        };
    }, [hiddenCommentIds]);

    useEffect(() => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }, [currentMessages, activeChat]);

    useEffect(() => {
        if (!isNameEditorOpen) return undefined;

        const handleOutsideClick = (event) => {
            if (!nameEditorRef.current) return;
            if (!nameEditorRef.current.contains(event.target)) {
                setIsNameEditorOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isNameEditorOpen]);

    const applyVisitorName = () => {
        setVisitorName(sanitizeVisitorName(nameDraft));
        setIsNameEditorOpen(false);
    };

    const toggleNameEditor = () => {
        setNameDraft(visitorName);
        setIsNameEditorOpen((prev) => !prev);
    };

    const handleSend = async (event) => {
        event.preventDefault();
        if (!inputValue.trim() || isSubmitting) return;

        const entered = window.prompt(
            '주인 메시지는 비밀번호를 입력하세요.\n방문자는 비워두고 확인을 누르세요.',
            ''
        );
        if (entered === null) return;

        const password = entered.trim();
        const isOwnerMessage = password.length > 0;

        const safeVisitorName = sanitizeVisitorName(visitorName);
        const payload = {
            name: isOwnerMessage ? `${OWNER_NAME_TAG}${OWNER_DISPLAY_NAME}` : safeVisitorName,
            message: inputValue.trim().slice(0, MAX_MESSAGE_LENGTH)
        };

        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const response = await fetch(COMMENTS_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(isOwnerMessage ? { 'X-Owner-Password': password } : {})
                },
                body: JSON.stringify(payload)
            });

            if (response.status === 401 || response.status === 403) {
                setErrorMessage('비밀번호가 올바르지 않습니다.');
                return;
            }

            if (!response.ok) throw new Error(`Failed to create comment: ${response.status}`);

            const created = normalizeApiComment(await response.json());
            if (!created) throw new Error('Invalid created comment payload');

            setAllMessages((prev) => ({
                ...prev,
                [CHAT_ID]: [...(prev[CHAT_ID] || []), toMessage(created)]
            }));
            setInputValue('');
        } catch (error) {
            setErrorMessage('댓글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (message) => {
        if (!message.serverId) return;

        const confirmed = window.confirm('이 메시지를 삭제할까요?');
        if (!confirmed) return;

        const entered = window.prompt('삭제 비밀번호를 입력하세요.');
        if (entered === null) return;

        const password = entered.trim();
        if (!password) {
            setErrorMessage('삭제 비밀번호를 입력해 주세요.');
            return;
        }

        setErrorMessage('');
        let serverDeleted = false;

        try {
            const response = await fetch(`${COMMENTS_ENDPOINT}/${message.serverId}`, {
                method: 'DELETE',
                headers: { 'X-Owner-Password': password }
            });

            if (response.ok) {
                serverDeleted = true;
            } else if (response.status === 401 || response.status === 403) {
                setErrorMessage('삭제 비밀번호가 올바르지 않습니다.');
                return;
            } else if (response.status !== 404) {
                throw new Error(`Failed to delete comment: ${response.status}`);
            }
        } catch (error) {
            // Keep local hide behavior below even if request fails.
        }

        setAllMessages((prev) => ({
            ...prev,
            [CHAT_ID]: (prev[CHAT_ID] || []).filter((item) => item.id !== message.id)
        }));
        setHiddenCommentIds((prev) => (prev.includes(message.serverId) ? prev : [...prev, message.serverId]));

        if (!serverDeleted) {
            setErrorMessage('서버 삭제 API가 아직 없어 현재 브라우저에서만 숨김 처리되었습니다.');
        }
    };

    return (
        <div style={{ display: 'flex', height: '100%', background: '#fff', fontSize: '13px', borderRadius: '12px', overflow: 'hidden' }}>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar, .sidebar-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track, .sidebar-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                    border: none;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb, .sidebar-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(0,0,0,0.1);
                    border-radius: 3px;
                    border: none;
                }
                .name-trigger-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background-color: rgb(255, 255, 255);
                    border: 1px solid rgb(229, 229, 234);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #555;
                    cursor: pointer;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    transition: transform 0.14s ease, background-color 0.14s ease, border-color 0.14s ease;
                    transform: translateZ(0);
                }
                .name-trigger-btn:hover {
                    transform: translateY(-1px) scale(1.04);
                    background-color: #F8F9FB;
                    border-color: #D7D8DE;
                }
                .name-trigger-btn:active {
                    transform: scale(0.96);
                }
            `}</style>

            <div
                style={{
                    width: '260px',
                    backgroundColor: 'rgb(255, 255, 255)',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 10,
                    position: 'relative'
                }}
            >
                <div
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 7px',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        overflow: 'hidden'
                    }}
                >
                    <div
                        style={{
                            padding: '16px 16px 10px 16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <div
                            className="window-controls"
                            style={{ display: 'flex', gap: '8px' }}
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
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFBD2E', border: '0.5px solid rgba(0,0,0,0.1)' }} />
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27C93F', border: '0.5px solid rgba(0,0,0,0.1)' }} />
                        </div>

                        <div style={{ color: '#007AFF', cursor: 'pointer' }} onPointerDown={(event) => event.stopPropagation()}>
                            <Filter size={18} />
                        </div>
                    </div>

                    <div style={{ padding: '0 16px 12px 16px' }} onPointerDown={(event) => event.stopPropagation()}>
                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#8E8E93' }} />
                            <input
                                type="text"
                                placeholder="Search"
                                style={{
                                    width: '100%',
                                    padding: '6px 12px 6px 30px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                    fontSize: '13px',
                                    outline: 'none',
                                    textAlign: 'left'
                                }}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="sidebar-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
                        <SidebarItem
                            key={conversation.id}
                            {...conversation}
                            isActive={activeChat === conversation.id}
                            onClick={() => setActiveChat(conversation.id)}
                        />
                    </div>
                </div>
            </div>

            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#fff',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '140px',
                        background: 'rgba(255,255,255,0.85)',
                        backdropFilter: 'blur(10px)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                        zIndex: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        paddingTop: '20px',
                        pointerEvents: 'none'
                    }}
                >
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundColor: currentContact.avatarColor,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            fontWeight: '600',
                            marginBottom: '-16px',
                            zIndex: 22,
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}
                    >
                        {currentContact.name[0]}
                    </div>

                    <div
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            padding: '6px 16px',
                            marginTop: '12px',
                            borderRadius: '20px',
                            boxShadow: 'rgba(0, 0, 0, 0.08) 0px 4px 15px',
                            zIndex: 21,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(0, 0, 0, 0.02)'
                        }}
                    >
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>{currentContact.name}</span>
                        <ChevronLeft size={14} style={{ transform: 'rotate(180deg)', opacity: 0.5 }} />
                    </div>
                </div>

                <div
                    className="custom-scrollbar"
                    style={{
                        flex: 1,
                        padding: '110px 20px 80px 20px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        maskImage: 'linear-gradient(to bottom, black calc(100% - 80px), transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 80px), transparent 100%)'
                    }}
                    onPointerDown={(event) => event.stopPropagation()}
                >
                    <div style={{ textAlign: 'center', color: '#8E8E93', fontSize: '10px', margin: '10px 0' }}>
                        {isLoading ? 'Loading comments...' : `Message • ${formatHeaderDate(currentMessages[0]?.timestamp)}`}
                    </div>
                    {currentMessages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            {...message}
                            canDelete={Boolean(message.serverId)}
                            onDelete={() => handleDelete(message)}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <form
                    onSubmit={handleSend}
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '20px',
                        right: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        zIndex: 25
                    }}
                    onPointerDown={(event) => event.stopPropagation()}
                >
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flexShrink: 0 }} ref={nameEditorRef}>
                            <button
                                type="button"
                                onClick={toggleNameEditor}
                                className="name-trigger-btn"
                                title="방문자 이름 변경"
                            >
                                <Plus
                                    size={20}
                                    color="#333"
                                    strokeWidth={2.5}
                                    style={{
                                        transform: isNameEditorOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.18s ease'
                                    }}
                                />
                            </button>

                            <AnimatePresence>
                                {isNameEditorOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 6 }}
                                        transition={{ duration: 0.16, ease: 'easeOut' }}
                                        style={{
                                            position: 'absolute',
                                            bottom: '46px',
                                            left: '-8px',
                                            width: '220px',
                                            background: '#fff',
                                            borderRadius: '14px',
                                            border: '1px solid rgba(0,0,0,0.08)',
                                            boxShadow: '0 14px 28px rgba(0,0,0,0.18)',
                                            padding: '10px',
                                            zIndex: 40,
                                            willChange: 'transform, opacity',
                                            backfaceVisibility: 'hidden'
                                        }}
                                    >
                                        <div style={{ fontSize: '11px', color: '#6E6E73', marginBottom: '6px', fontWeight: 600 }}>
                                            Visitor name
                                        </div>
                                        <input
                                            type="text"
                                            value={nameDraft}
                                            onChange={(event) => setNameDraft(event.target.value)}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    event.preventDefault();
                                                    applyVisitorName();
                                                }
                                            }}
                                            maxLength={24}
                                            autoFocus
                                            style={{
                                                width: '100%',
                                                border: '1px solid rgba(60,60,67,0.25)',
                                                borderRadius: '9px',
                                                padding: '7px 9px',
                                                fontSize: '13px',
                                                outline: 'none'
                                            }}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '8px' }}>
                                            <button
                                                type="button"
                                                onClick={() => setIsNameEditorOpen(false)}
                                                style={{
                                                    border: 'none',
                                                    background: 'transparent',
                                                    color: '#6E6E73',
                                                    fontSize: '12px',
                                                    cursor: 'pointer',
                                                    padding: '4px 6px'
                                                }}
                                            >
                                                취소
                                            </button>
                                            <button
                                                type="button"
                                                onClick={applyVisitorName}
                                                style={{
                                                    border: 'none',
                                                    background: '#007AFF',
                                                    color: '#fff',
                                                    fontSize: '12px',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    padding: '5px 9px'
                                                }}
                                            >
                                                저장
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div
                            style={{
                                flex: 1,
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                border: '1px solid #E5E5EA',
                                padding: '4px 6px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                            }}
                        >
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(event) => setInputValue(event.target.value)}
                                placeholder={`Message as ${visitorName}`}
                                maxLength={MAX_MESSAGE_LENGTH}
                                style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    border: 'none',
                                    fontSize: '15px',
                                    outline: 'none',
                                    background: 'transparent',
                                    minHeight: '24px'
                                }}
                            />

                            <div style={{ display: 'flex', alignItems: 'center', paddingRight: '6px', gap: '6px' }}>
                                {inputValue ? (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        style={{
                                            background: isSubmitting ? '#9FCBFF' : '#007AFF',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '28px',
                                            height: '28px',
                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '6px'
                                        }}
                                    >
                                        <ArrowUp size={16} strokeWidth={3} />
                                    </button>
                                ) : (
                                    <div style={{ padding: '0 8px', cursor: 'pointer', opacity: 0.5 }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-audio-lines"><path d="M2 10v3" /><path d="M6 6v11" /><path d="M10 3v18" /><path d="M14 8v7" /><path d="M18 5v13" /><path d="M22 10v4" /></svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {errorMessage && (
                        <div style={{ color: '#D64545', fontSize: '12px', textAlign: 'center' }}>
                            {errorMessage}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default IMessageApp;
