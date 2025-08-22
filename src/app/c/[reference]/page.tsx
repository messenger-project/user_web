'use client';

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
    const [contacts, setContacts] = useState<{id: string, email: string}[]>([]);

    const getContacts = async () => {
        const requestService = new RequestService('/user/contacts');
        const result = await requestService.get();


        setContacts(result)

    }

    useEffect(() => {

        getContacts().catch(error => console.log(error));

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
        <div className="container m-auto grid grid-cols-12 gap-2 text">
            <div
                className="grid grid-rows-10 col-span-3 border rounded bg-[#1F2937]"
            >
                {contacts && contacts.map((contact) => (
                    <Link
                        key={contact.id}
                        className="px-2 row-span-1 hover:bg-[#374151] cursor-pointer"
                        href={`/c/` + contact.id}
                    >
                        {contact.email}
                    </Link>
                ))}
            </div>
            <div className="col-span-7">
                <div
                    className="overflow-y-scroll h-96 border rounded p-2 mb-4 bg-[#111827]"
                >
                    {messages.map((m, i) => (
                        <div key={i} className="mb-2 p-1.5 text-gray-50 w-1/4 rounded-b-md rounded-r-md bg-[#374151]">
                            <strong>{m.user}:</strong> {m.text}
                        </div>
                    ))}
                </div>
                <div className="gap-2">
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
                        Send
                    </button>
                </div>
            </div>
            <div
                className="col-span-2"
            ></div>
        </div>
    );
}
