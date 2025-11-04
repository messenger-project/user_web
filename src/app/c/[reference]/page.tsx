'use client'

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import RequestService from "@/services/RequestService";
import Link from "next/link";

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

    useEffect(() => {
        getContacts().catch((error) => console.log(error));

        const socketUrl = process.env.NEXT_PUBLIC_BASE_URL;
        if (!socketUrl) {
            console.error('Socket URL is not defined in ' + process.env.NEXT_PUBLIC_BASE_URL);
            return;
        }

        socket = io(socketUrl);

        socket.on('connect', () => {
            console.log('Connected:', socket?.id);
        });

        socket.on('message', (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket?.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (!message.trim()) return;
        socket?.emit('message', { user: 'کاربر', text: message });
        setMessage('');
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
            <div className="col-span-12 md:col-span-9 grid grid-rows-12 gap-2">
                <div className="row-span-11 overflow-y-scroll p-2 bg-gray-800 rounded space-y-2">
                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className="w-fit max-w-xs p-2 bg-gray-600 rounded-b-md rounded-r-md shadow-md"
                        >
                            <strong>{m.user}:</strong> {m.text}
                        </div>
                    ))}
                </div>
                <div className="row-span-1 flex items-center space-x-2 p-2 bg-gray-800 rounded">
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="md:hidden bg-gray-600 px-4 py-2 rounded hover:bg-gray-500"
                    >
                        ☰
                    </button>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') sendMessage();
                        }}
                        placeholder="Write..."
                        className="flex-grow p-2 bg-gray-700 rounded focus:outline-none"
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
