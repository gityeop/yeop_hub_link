import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus, Video, Phone, User, ChevronLeft, Search, Filter, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data for Sidebar
const CONVERSATIONS = [
    { id: 1, name: "Lim Sang Yeob", date: "Now", preview: "Welcome to my portfolio!", avatarColor: "#8E8E93" },
    { id: 2, name: "Apple", date: "Yesterday", preview: "Your order has been shipped.", avatarColor: "#000000" },
    { id: 3, name: "Instagram", date: "Friday", preview: "New login detected.", avatarColor: "#E1306C" },
    { id: 4, name: "Coupang", date: "Saturday", preview: "Delivery completed.", avatarColor: "#34C759" },
    { id: 5, name: "Toss", date: "Friday", preview: "Transfer successful.", avatarColor: "#007AFF" }, 
    { id: 6, name: "SKT", date: "Thursday", preview: "Bill payment due.", avatarColor: "#FF9500" },
    { id: 7, name: "Google", date: "Wednesday", preview: "Security alert.", avatarColor: "#4285F4" },
];

const INITIAL_MESSAGES = {
    1: [
        { id: 1, text: "Welcome to my portfolio! 👋", isMe: false, timestamp: new Date() },
        { id: 2, text: "Feel free to leave a message here.", isMe: false, timestamp: new Date() }
    ],
    2: [
        { id: 1, text: "Your order #12345 has been shipped.", isMe: false, timestamp: new Date(Date.now() - 86400000) },
        { id: 2, text: "Track your package at https://apple.com/track", isMe: false, timestamp: new Date(Date.now() - 86000000) }
    ],
    3: [
        { id: 1, text: "New login detected on your account.", isMe: false, timestamp: new Date(Date.now() - 172800000) },
        { id: 2, text: "Was this you? If not, reset your password.", isMe: false, timestamp: new Date(Date.now() - 172000000) }
    ]
};

const SidebarItem = ({ name, date, preview, avatarColor, isActive, onClick }) => (
    <div 
        onClick={onClick}
        onPointerDown={(e) => e.stopPropagation()}
        style={{
            display: 'flex',
            padding: '12px 14px',
            gap: '10px',
            borderRadius: '12px',
            backgroundColor: isActive ? '#007AFF' : 'transparent', // Blue highlight as per latest snippet
            color: isActive ? 'white' : 'black',
            cursor: 'default',
            transition: 'background-color 0.2s',
            marginBottom: '4px'
        }}
    >
        <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: isActive ? '#000000' : avatarColor, // Active: Black bg
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: '600',
            flexShrink: 0,
            border: isActive ? '2px solid white' : 'none' 
        }}>
            {name[0]}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                 <span style={{ fontWeight: '600', fontSize: '14px', color: isActive ? 'white' : '#000' }}>{name}</span>
                 <span style={{ fontSize: '12px', color: isActive ? 'rgba(255,255,255,0.8)' : '#8E8E93' }}>{date}</span>
             </div>
             <div style={{ 
                 fontSize: '13px', 
                 color: isActive ? 'rgba(255,255,255,0.9)' : '#8E8E93', 
                 whiteSpace: 'nowrap', 
                 overflow: 'hidden', 
                 textOverflow: 'ellipsis' 
            }}>
                 {preview}
             </div>
        </div>
    </div>
);

const MessageBubble = ({ text, isMe }) => (
  <motion.div 
    onPointerDown={(e) => e.stopPropagation()}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    style={{
      alignSelf: isMe ? 'flex-end' : 'flex-start',
      maxWidth: '70%',
      margin: '2px 0',
      padding: '8px 14px',
      borderRadius: '18px',
      backgroundColor: isMe ? '#007AFF' : '#E9E9EB', 
      color: isMe ? 'white' : 'black',
      fontSize: '14px',
      lineHeight: '1.4',
      borderBottomRightRadius: isMe ? '4px' : '18px',
      borderBottomLeftRadius: isMe ? '18px' : '4px',
      boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
      position: 'relative'
    }}
  >
    {text}
  </motion.div>
);

// ... (Previous code remains, adding style tag and updating main layout)

const IMessageApp = ({ onClose }) => {
    const [activeChat, setActiveChat] = useState(1);
    const [allMessages, setAllMessages] = useState(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);

    const currentMessages = allMessages[activeChat] || [];
    const currentContact = CONVERSATIONS.find(c => c.id === activeChat);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    useEffect(scrollToBottom, [currentMessages, activeChat]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newMessage = {
            id: Date.now(),
            text: inputValue,
            isMe: true, 
            timestamp: new Date()
        };

        setAllMessages(prev => ({
            ...prev,
            [activeChat]: [...(prev[activeChat] || []), newMessage]
        }));
        
        setInputValue("");
        
        if (activeChat === 1) {
            setTimeout(() => {
                 setAllMessages(prev => ({
                    ...prev,
                    [activeChat]: [...(prev[activeChat] || []), {
                        id: Date.now() + 1,
                        text: "Thanks! I'll read this soon.",
                        isMe: false,
                        timestamp: new Date()
                    }]
                 }));
            }, 1500);
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
            `}</style>

            {/* Sidebar Container */}
            <div style={{ 
                width: '260px', 
                backgroundColor: 'rgb(255, 255, 255)', 
                padding: '8px', 
                display: 'flex',
                flexDirection: 'column',
                zIndex: 10, 
                position: 'relative'
                // Removed box-shadow as requested
            }}>
                {/* Inner Sidebar Card */}
                <div style={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 7px', 
                    border: '1px solid rgba(255, 255, 255, 0.5)', 
                    overflow: 'hidden'
                }}>
                     {/* Window Controls & Filter */}
                    <div style={{ 
                        padding: '16px 16px 10px 16px', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                    }}>
                        {/* Traffic Lights */}
                        <div 
                            className="window-controls" 
                            style={{ display: 'flex', gap: '8px' }} 
                            onPointerDown={(e) => e.stopPropagation()} 
                        >
                            <div onClick={onClose} style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5F56', border: '0.5px solid rgba(0,0,0,0.1)', cursor: 'pointer' }} />
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFBD2E', border: '0.5px solid rgba(0,0,0,0.1)' }} />
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27C93F', border: '0.5px solid rgba(0,0,0,0.1)' }} />
                        </div>

                        {/* Filter Icon */}
                        <div style={{ color: '#007AFF', cursor: 'pointer' }} onPointerDown={(e) => e.stopPropagation()}>
                            <Filter size={18} />
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div style={{ padding: '0 16px 12px 16px' }} onPointerDown={(e) => e.stopPropagation()}>
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
                            />
                        </div>
                    </div>

                    {/* App List - Sidebar Scrollbar */}
                    <div className="sidebar-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
                        {CONVERSATIONS.map(chat => (
                            <SidebarItem 
                                key={chat.id} 
                                {...chat} 
                                isActive={activeChat === chat.id}
                                onClick={() => setActiveChat(chat.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Chat Area (Right Area) */}
            <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                backgroundColor: '#fff', 
                position: 'relative',
                zIndex: 1 // Lower than sidebar
            }}>
                {/* Floating Profile Header with Gradient Blur Mask */}
                <div style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '140px', // Extend height for smoother fade
                    background: 'rgba(255,255,255,0.85)', // Solid base transparency
                    backdropFilter: 'blur(10px)', // Standard blur
                    WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', // Smooth fade out
                    maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                    zIndex: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingTop: '20px',
                    pointerEvents: 'none'
                }}>
                    {/* Avatar */}
                    <div style={{
                         width: '48px', 
                         height: '48px', 
                         borderRadius: '50%', 
                         backgroundColor: currentContact?.avatarColor || '#8E8E93', 
                         color: 'white', 
                         display: 'flex', 
                         alignItems: 'center', 
                         justifyContent: 'center',
                         fontSize: '18px',
                         fontWeight: '600',
                         marginBottom: '-16px', // Overlap pill
                         zIndex: 22,
                         boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>
                        {currentContact?.name[0]}
                    </div>
                    
                    {/* Pill Name Tag (User Provided Style) */}
                    <div style={{
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
                    }}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>{currentContact?.name}</span>
                        <ChevronLeft size={14} style={{ transform: 'rotate(180deg)', opacity: 0.5 }} />
                    </div>
                </div>

                {/* Messages List - Custom Scrollbar */}
                <div className="custom-scrollbar" style={{ 
                    flex: 1, 
                    padding: '110px 20px 80px 20px', 
                    overflowY: 'auto', 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '6px',
                    maskImage: 'linear-gradient(to bottom, black calc(100% - 80px), transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 80px), transparent 100%)' 
                }} onPointerDown={(e) => e.stopPropagation()}>
                    <div style={{ textAlign: 'center', color: '#8E8E93', fontSize: '10px', margin: '10px 0' }}>
                        Message • {currentMessages[0] ? new Date(currentMessages[0].timestamp).toLocaleDateString() : 'Today'}
                    </div>
                    {currentMessages.map(msg => (
                        <MessageBubble key={msg.id} {...msg} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Floating Input Area (Redesigned) */}
                <form onSubmit={handleSend} style={{ 
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    right: '20px',
                    display: 'flex', 
                    gap: '10px',
                    alignItems: 'center',
                    zIndex: 25
                }} onPointerDown={(e) => e.stopPropagation()}>
                    
                    {/* Plus Button - Detached Circle */}
                    <button 
                        type="button"
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: 'rgb(255, 255, 255)', 
                            border: '1px solid rgb(229, 229, 234)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#555',
                            cursor: 'pointer',
                            flexShrink: 0,
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Plus size={20} color="#333" strokeWidth={2.5} />
                    </button>
                    
                    {/* Input Pill */}
                    <div style={{ 
                        flex: 1, 
                        position: 'relative', 
                        display: 'flex', 
                        alignItems: 'center',
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        border: '1px solid #E5E5EA',
                        padding: '4px 6px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                    }}>
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Message" 
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
                        
                        {/* Audio/Send Icon on Right */}
                        <div style={{ display: 'flex', alignItems: 'center', paddingRight: '6px', gap: '6px' }}>
                            {inputValue ? (
                                <button 
                                    type="submit"
                                    style={{
                                        background: '#007AFF',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '28px',
                                        height: '28px',
                                        cursor: 'pointer',
                                        color: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        padding: '6px'
                                    }}
                                >
                                    <ArrowUp size={16} strokeWidth={3} />
                                </button>
                            ) : (
                                <div style={{ padding: '0 8px', cursor: 'pointer', opacity: 0.5 }}>
                                     {/* Audio Wave Icon Placeholder */}
                                     {/* Mocking the wave visual roughly or using a Lucide icon */}
                                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-audio-lines"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v4"/></svg>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default IMessageApp;
