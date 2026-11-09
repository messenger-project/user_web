"use client";

import { useState, useRef, useEffect } from "react";
import RequestService from "@/services/RequestService";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Menu,
  X,
  Send,
  Paperclip,
  FileText,
  MessageCircle,
  Loader2,
} from "lucide-react";

interface Message {
  user: string;
  text: string;
}

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts] = useState<{ id: string; email: string }[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = message.trim();

    if (!text || isSending) return;

    setIsSending(true);

    setMessages((prev) => [...prev, { user: "You", text }]);
    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const requestService = new RequestService("/v1/chat/completions");

      const result = await requestService.post({
        model: "qwen/qwen3-8b",
        messages: [
          {
            role: "user",
            content: text,
          },
        ],
        stream: false,
      });

      const reply = result?.choices?.[0]?.message?.content;

      if (reply) {
        setMessages((prev) => [
          ...prev,
          { user: "AI", text: reply },
        ]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);

      setMessages((prev) => [
        ...prev,
        {
          user: "AI",
          text: "Unable to get a response. Please try again.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    event.target.value = "";
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#F3F7FA] text-[#02394F]">
      {/* Mobile overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#001C38]/50 md:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col
          bg-[#02394F] text-white transition-transform duration-200
          md:relative md:z-auto md:w-[280px] md:translate-x-0
          ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar header */}
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#008EED]">
              <MessageCircle size={22} />
            </div>

            <div>
              <h1 className="text-base font-semibold">
                Messenger AI
              </h1>
              <p className="text-xs text-white/50">
                Staffgate
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contacts */}
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
          <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
            Contacts
          </div>

          <div className="space-y-1">
            {contacts.map((contact) => (
              <Link
                key={contact.id}
                href={`/c/${contact.id}`}
                onClick={() => setIsDrawerOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                {contact.email}
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar footer */}
        <div className="shrink-0 border-t border-white/10 px-5 py-4">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span className="h-2 w-2 rounded-full bg-[#FD7E27]" />
            Internal workspace
          </div>
        </div>
      </aside>

      {/* Main chat */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Chat header */}
        <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#DFE7EC] bg-white px-4 sm:px-7">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open sidebar"
              className="rounded-lg p-2 text-[#02394F] hover:bg-[#F0F5F8] md:hidden"
            >
              <Menu size={22} />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F3FD]">
              <MessageCircle
                size={21}
                className="text-[#008EED]"
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold sm:text-base">
                AI Assistant
              </h2>
              <p className="text-xs text-[#697C88]">
                Qwen 3 · 8B
              </p>
            </div>
          </div>

          <span className="rounded-full bg-[#E5F3FD] px-3 py-1 text-xs font-medium text-[#008EED]">
            AI
          </span>
        </header>

        {/* Messages */}
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-6 sm:px-6">
          <div className="mx-auto flex min-h-full max-w-[900px] flex-col">
            {messages.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5F3FD]">
                  <MessageCircle
                    size={30}
                    className="text-[#008EED]"
                  />
                </div>

                <h3 className="text-xl font-semibold text-[#02394F]">
                  Messenger AI
                </h3>

                <p className="mt-2 text-sm text-[#7C8D98]">
                  Start a conversation
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((m, i) => {
                  const isUser = m.user === "You";

                  return (
                    <div
                      key={i}
                      className={`flex ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`
                          min-w-0 max-w-[90%] rounded-2xl px-4 py-3
                          text-sm leading-7 shadow-sm sm:max-w-[80%]
                          ${
                            isUser
                              ? "rounded-br-md bg-[#008EED] text-white"
                              : "rounded-bl-md border border-[#E2E9EE] bg-white text-[#243C4A]"
                          }
                        `}
                      >
                        <div
                          className={`mb-1 text-xs font-semibold ${
                            isUser
                              ? "text-white/70"
                              : "text-[#008EED]"
                          }`}
                        >
                          {m.user}
                        </div>

                        {isUser ? (
                          <p className="whitespace-pre-wrap break-words">
                            {m.text}
                          </p>
                        ) : (
                          <div className="prose prose-sm max-w-none break-words text-inherit prose-pre:overflow-x-auto">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {m.text}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isSending && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-2xl border border-[#E2E9EE] bg-white px-4 py-3 text-sm text-[#697C88]">
                      <Loader2
                        size={17}
                        className="animate-spin text-[#008EED]"
                      />
                      Thinking...
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Message composer */}
        <div className="shrink-0 border-t border-[#DFE7EC] bg-white px-3 py-3 sm:px-6 sm:py-4">
          <div className="mx-auto max-w-[900px]">
            {/* Selected file */}
            {selectedFile && (
              <div className="mb-3 flex max-w-sm items-center gap-3 rounded-xl border border-[#DCE7EF] bg-[#F3F8FC] px-3 py-2">
                <FileText
                  size={21}
                  className="shrink-0 text-[#008EED]"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-[#02394F]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-[#81919C]">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <button
                  onClick={removeFile}
                  aria-label="Remove file"
                  className="rounded-lg p-1 text-[#81919C] hover:bg-[#E2EDF4] hover:text-[#02394F]"
                >
                  <X size={17} />
                </button>
              </div>
            )}

            <div className="flex items-end gap-2 rounded-2xl border border-[#DCE5EC] bg-[#F7F9FB] p-2 transition-colors focus-within:border-[#008EED] focus-within:ring-2 focus-within:ring-[#008EED]/10">
              {/* File input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.txt,.doc,.docx,.csv,.xlsx,.png,.jpg,.jpeg"
              />

              {/* Attach file */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach file"
                aria-label="Attach file"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#617887] transition hover:bg-[#E5F3FD] hover:text-[#008EED]"
              >
                <Paperclip size={21} />
              </button>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  event.target.style.height = "auto";
                  event.target.style.height = `${Math.min(
                    event.target.scrollHeight,
                    160
                  )}px`;
                }}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                rows={1}
                placeholder="Write a message..."
                className="max-h-40 min-h-10 min-w-0 flex-1 resize-none overflow-y-auto bg-transparent px-2 py-2.5 text-sm leading-5 text-[#02394F] outline-none placeholder:text-[#93A3AE]"
              />

              {/* Send */}
              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={!message.trim() || isSending}
                title="Send message"
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#008EED] text-white transition hover:bg-[#007ACD] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={19} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}