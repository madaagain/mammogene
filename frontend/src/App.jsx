import React, { useState, useRef, useEffect } from "react";
import styles from "./App.module.css";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = {
        role: "assistant",
        content: data.reponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Erreur:", error);
      const errorMessage = {
        role: "error",
        content: `Erreur de connexion: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>🧬 Mammogene</h1>
          <p className={styles.subtitle}>Assistant IA conversationnel</p>
        </div>
      </header>

      {/* Chat Container */}
      <div className={styles.chatContainer}>
        <div className={styles.messagesContainer}>
          {messages.length === 0 && (
            <div className={styles.welcomeMessage}>
              <div className={styles.welcomeIcon}>💬</div>
              <h2 className={styles.welcomeTitle}>Bienvenue sur Mammogene</h2>
              <p className={styles.welcomeText}>
                Posez-moi n'importe quelle question et je vous aiderai !
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.role === "user"
                  ? styles.userMessage
                  : message.role === "error"
                    ? styles.errorMessage
                    : styles.aiMessage
              }`}
            >
              <div className={styles.messageHeader}>
                <span className={styles.messageRole}>
                  {message.role === "user"
                    ? "👤 Vous"
                    : message.role === "error"
                      ? "⚠️ Erreur"
                      : "🤖 Mammogene"}
                </span>
                <span className={styles.messageTime}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <div className={styles.messageContent}>{message.content}</div>
            </div>
          ))}

          {isLoading && (
            <div className={`${styles.message} ${styles.aiMessage}`}>
              <div className={styles.messageHeader}>
                <span className={styles.messageRole}>🤖 Mammogene</span>
              </div>
              <div className={styles.loadingMessage}>
                <div className={styles.loadingDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                Réflexion en cours...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message ici..."
              className={styles.input}
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className={`${styles.sendButton} ${
                !input.trim() || isLoading ? styles.sendButtonDisabled : ""
              }`}
            >
              {isLoading ? "⏳" : "📤"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
