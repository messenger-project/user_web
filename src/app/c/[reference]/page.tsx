'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
    user: string;
    text: string;
}

let socket: Socket | null = null;

export default function Chat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        // مطمئن شو که آدرس در env تعریف شده
        const socketUrl = process.env.NEXT_PUBLIC_BASE_URL;
        if (!socketUrl) {
            console.error('Socket URL is not defined in NEXT_PUBLIC_BASE_URL');
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
        <div className="container m-auto grid grid-cols-12 gap-2 text">
            <div
                className="col-span-2 border rounded"
            >

            </div>
            <div className="col-span-8">
                <div
                    className="overflow-y-scroll h-96 border rounded p-2 mb-4 bg-[#111827]"
                >
                    {messages.map((m, i) => (
                        <div key={i} className="mb-2 text-gray-50">
                            <strong>{m.user}:</strong> {m.text}
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') sendMessage();
                        }}
                        placeholder="Write..."
                        className="flex-grow p-2 border rounded"
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        ارسال
                    </button>
                </div>
            </div>
            <div
                className="col-span-2"
            ></div>
        </div>
    );
}
