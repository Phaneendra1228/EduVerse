"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "bot";
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "👋 Hi! I'm EduBot. How can I help you today? Ask me about courses, meetings, career guidance, or anything else!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to state
    const newMessages: Message[] = [...messages, { role: "user", text: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Send history (excluding the first welcome message and the current user message)
      const historyForApi = newMessages.slice(1, -1).map(msg => ({
        role: msg.role === 'bot' ? 'model' : 'user',
        text: msg.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          history: historyForApi
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages(prev => [...prev, { role: "bot", text: data.text }]);
      } else {
        setMessages(prev => [...prev, { role: "bot", text: `⚠️ Error: ${data.error || 'Failed to get a response.'}` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "bot", text: "⚠️ Network error. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      <button 
        className="chatbot-btn" 
        id="chatbotBtn" 
        aria-label="Open chat"
        onClick={() => setIsOpen(true)}
      >
        <i className="fas fa-robot"></i>
      </button>
      
      <div className={`chatbot-panel ${isOpen ? "open" : ""}`} id="chatbotPanel">
        <div className="chatbot-header">
          <h4><i className="fas fa-robot"></i> &nbsp;EduBot</h4>
          <button 
            className="chatbot-close" 
            id="chatbotClose" 
            aria-label="Close chat"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>
        <div className="chatbot-messages" id="chatMessages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-msg ${msg.role}`}>
              {msg.role === 'bot' ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          ))}
          {isLoading && (
            <div className="chat-msg bot typing-indicator">
              <span></span><span></span><span></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="chatbot-input">
          <input 
            type="text" 
            id="chatInput" 
            placeholder="Type a message..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button id="chatSend" onClick={handleSend} disabled={isLoading || !input.trim()}>
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </>
  );
}
