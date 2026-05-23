"use client";

import { useState } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

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
          <div className="chat-msg bot">👋 Hi! I&apos;m EduBot. How can I help you today? Ask me about courses, meetings, career guidance, or anything else!</div>
        </div>
        <div className="chatbot-input">
          <input type="text" id="chatInput" placeholder="Type a message..." />
          <button id="chatSend">Send</button>
        </div>
      </div>
    </>
  );
}
