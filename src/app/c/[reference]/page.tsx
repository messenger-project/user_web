'use client'

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import RequestService from "@/services/RequestService";
import Link from "next/link";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    user: string;
    text: string;
}

let socket: Socket | null = null;

export default function Chat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [contacts, setContacts] = useState<{ id: string; email: string }[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const getContacts = async () => {
        const requestService = new RequestService('/user/contacts');
        const result = await requestService.get();
        setContacts(result);
    };

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // useEffect(() => {
    //     getContacts().catch((error) => console.log(error));

    //     const socketUrl = process.env.NEXT_PUBLIC_BASE_URL;
    //     if (!socketUrl) {
    //         console.error('Socket URL is not defined in ' + process.env.NEXT_PUBLIC_BASE_URL);
    //         return;
    //     }

    //     socket = io(socketUrl);

    //     socket.on('connect', () => {
    //         console.log('Connected:', socket?.id);
    //     });

    //     socket.on('message', (msg: Message) => {
    //         setMessages((prev) => [...prev, msg]);
    //     });

    //     return () => {
    //         socket?.disconnect();
    //     };
    // }, []);

    // const sendMessage = () => {
    //     if (!message.trim()) return;
    //     socket?.emit('message', { user: 'کاربر', text: message });
    //     setMessage('');
    // };

        const sendMessage = async () => {
            const text = message.trim();

            if (!text) return;

            console.log('1. Sending message:', text);

            setMessages((prev) => [
                ...prev,
                { user: 'You', text },
            ]);

            setMessage('');

            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }

            const requestService = new RequestService('/v1/chat/completions');

            console.log('2. Request started');

            const result = await requestService.post({
                model: 'qwen/qwen3-8b',
                messages: [
                    {
                        role: 'user',
                        content: text,
                    },
                ],
                stream: false,
            });

            console.log('3. Response received:', result);

            const reply = result?.choices?.[0]?.message?.content;

            if (reply) {
                setMessages((prev) => [
                    ...prev,
                    { user: 'AI', text: reply },
                ]);
            }
        };
    return (
        <div className="h-screen w-screen grid grid-cols-12 md:grid-cols-12 gap-2 p-2 bg-gray-900 text-gray-50">
            {/* Contacts Drawer for mobile */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-2/3 bg-gray-800 transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:hidden `}
            >
                <div className="p-4 flex justify-between items-center bg-gray-700">
                    <h2 className="text-lg font-semibold">Contacts</h2>
                    <button onClick={() => setIsDrawerOpen(false)} className="text-gray-300">X</button>
                </div>
                <div className="px-2 space-y-2">
                    {contacts.map((contact) => (
                        <Link
                            key={contact.id}
                            className="block p-2 rounded hover:bg-gray-600"
                            href={`/c/${contact.id}`}
                        >
                            {contact.email}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Sidebar for desktop */}
            <div className="hidden md:block col-span-3 bg-gray-800 rounded p-2 overflow-y-auto space-y-2">
                {contacts.map((contact) => (
                    <Link
                        key={contact.id}
                        className="block p-2 rounded hover:bg-gray-700"
                        href={`/c/${contact.id}`}
                    >
                        {contact.email}
                    </Link>
                ))}
            </div>

            {/* Main Chat Area */}
            <div className="col-span-12 md:col-span-9 flex flex-col min-h-0 gap-2">
                <div className="flex-1 min-h-0 overflow-y-auto p-2 bg-gray-800 rounded space-y-2">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`w-fit max-w-[85%] min-w-0 p-3 rounded-lg shadow-md ${
                            m.user === 'You'
                                ? 'ml-auto bg-blue-600'
                                : 'mr-auto bg-gray-700'
                        }`}
                    >
                        <div className="mb-2 text-xs font-semibold opacity-70">
                            {m.user}
                        </div>

                        {m.user === 'AI' ? (
                            <div className="prose prose-invert prose-sm max-w-none break-words">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {m.text}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <p className="whitespace-pre-wrap break-words">
                                {m.text}
                            </p>
                        )}
                    </div>
                ))}
                </div>
                <div className="shrink-0 flex items-end gap-2 p-2 bg-gray-800 rounded">
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="md:hidden bg-gray-600 px-4 py-2 rounded hover:bg-gray-500"
                    >
                        ☰
                    </button>
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);

                            e.target.style.height = 'auto';
                            e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        rows={1}
                        placeholder="Write a message..."
                        className="flex-1 min-w-0 resize-none overflow-y-auto
                                max-h-40 rounded-lg bg-gray-700
                                px-3 py-2 text-gray-50 outline-none"
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
