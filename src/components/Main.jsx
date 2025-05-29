import React, { useState, useRef, useEffect } from 'react';
import { generateHiteshResponse } from '../utils/ai.js';

const Main = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const messageContainerRef = useRef(null);

  // Single useEffect for scrolling
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (content, role) => {
    setMessages(prev => [...prev, { content, role, timestamp: new Date() }]);
  };

  const handleStartCall = async () => {
    setCallActive(true);
    setConnecting(true);
    
    // Simulate connection delay
    setTimeout(() => setConnecting(false), 1000);

    try {
      setIsSpeaking(true);
      const response = await generateHiteshResponse("Say hello and introduce yourself briefly");
      
      // Parse the JSON response if your AI function returns JSON
      let responseText;
      try {
        const parsedResponse = JSON.parse(response);
        responseText = parsedResponse.message || parsedResponse.text || response;
      } catch {
        // If it's not JSON, use as is
        responseText = response;
      }
      
      addMessage(responseText, "assistant");
    } catch (err) {
      console.error("Error in startCall:", err);
      addMessage("Namaskar! Main Hitesh hun! Chai peeke code karte hain aaj? ☕💻 Kya seekhna hai?", "assistant");
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleEndCall = () => {
    setCallActive(false);
    setCallEnded(true);
    addMessage("Dhanyawad! Chai break ke baad milte hain! Keep coding! 🚀", "assistant");
    
    setTimeout(() => {
      // Optional: redirect or reset state here
      // window.location.href = '/profile'; // uncomment if you want to redirect
    }, 3000);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage;
    setInputMessage("");
    addMessage(userMessage, "user");
    setIsLoading(true);
    setIsSpeaking(true);

    try {
      const response = await generateHiteshResponse(userMessage);
      
      // Parse the JSON response if your AI function returns JSON
      let responseText;
      try {
        const parsedResponse = JSON.parse(response);
        responseText = parsedResponse.message || parsedResponse.text || response;
      } catch {
        // If it's not JSON, use as is
        responseText = response;
      }
      
      addMessage(responseText, "assistant");
    } catch (err) {
      console.error("Error generating response:", err);
      addMessage("Arrey yaar, thoda technical issue aa gaya! Chai break ke baad try karte hain! ☕😅", "assistant");
    } finally {
      setIsLoading(false);
      setIsSpeaking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden pb-6 pt-24">
      <div className="glow"></div>
      <div className="container mx-auto px-4 h-full max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-mono">
            <span>Talk To Your Favourite </span>
            <span className="text-primary uppercase">Hitesh Sir!!</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Have a conversation with Hitesh Sir - Your favorite tech educator!
          </p>
        </div>

        <div className="gap-6 mb-8">
          <div className="bg-card/90 backdrop-blur-sm border border-border rounded-xl overflow-hidden relative">
            {/* Top Section - Avatar and Status */}
            <div className="flex flex-col items-center justify-center p-6 relative border-b border-border">
              {/* Speaking Animation */}
              <div className={`absolute inset-0 ${isSpeaking ? "opacity-30" : "opacity-0"} transition-opacity duration-300`}>
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center items-center h-20">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`mx-1 h-16 w-1 bg-primary rounded-full ${isSpeaking ? "animate-pulse" : ""}`}
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        height: isSpeaking ? `${Math.random() * 50 + 20}%` : "5%",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Avatar */}
              <div className="size-32 relative mb-4">
                <div className={`absolute inset-0 bg-primary opacity-0 rounded-full blur-lg ${isSpeaking ? "animate-pulse" : ""}`} />
                <div className="relative w-full h-full rounded-full bg-card flex items-center justify-center border border-border overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 to-amber-100/20" />
                  <img 
                    src="https://github.com/hiteshchoudhary.png" 
                    alt="Hitesh Chaudhary" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold text-foreground">Hitesh Sir</h2>
              <p className="text-sm text-muted-foreground mt-1">Tech Educator & Chai Lover ☕</p>

              {/* Status Indicator */}
              <div className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border ${isSpeaking ? "border-primary" : ""}`}>
                <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'animate-pulse bg-primary' : callActive ? 'bg-green-500' : callEnded ? 'bg-yellow-500' : 'bg-muted'}`} />
                <span className="text-sm">
                  {isSpeaking ? "Hitesh is speaking..." : 
                   callActive ? "Ready to help!" : 
                   callEnded ? 'Session ended - Keep learning!' : 
                   "Ready to start..."}
                </span>
              </div>
            </div>

            {/* Chat Messages Section - Inside the same box */}
            {messages.length > 0 && (
              <div className="h-80 overflow-hidden">
                <div
                  ref={messageContainerRef}
                  className="h-full overflow-y-auto p-4 scroll-smooth"
                >
                  <div className="space-y-3">
                    {messages.map((msg, index) => (
                      <div key={index} className="message-item animate-fadeIn">
                        <div className="font-semibold text-xs text-muted-foreground mb-1">
                          {msg.role === "assistant" ? "Hitesh Sir" : msg.role === "user" ? "You" : "System"}
                        </div>
                        <div className={`p-3 rounded-lg ${
                          msg.role === "user" 
                            ? "bg-primary/10 border border-primary/20 ml-4" 
                            : "bg-muted/50 border border-border mr-4"
                        }`}>
                          <p className="text-foreground whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="message-item animate-fadeIn">
                        <div className="font-semibold text-xs text-muted-foreground mb-1">Hitesh Sir</div>
                        <div className="bg-muted/50 border border-border mr-4 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                            <span className="text-muted-foreground">Hitesh is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input & Send Button */}
        {callActive && (
          <div className="flex gap-2 items-center mb-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Ask Hitesh something... (Chai ke baare mein bhi puch sakte hain! ☕)"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        )}

        {/* Call Control Buttons */}
        <div className="w-full flex justify-center gap-4">
          {!callActive && !callEnded && (
            <button
              onClick={handleStartCall}
              className="w-40 text-xl py-3 rounded-3xl bg-primary hover:bg-primary/90 text-white transition-colors"
              disabled={connecting}
            >
              {connecting ? "Connecting..." : "Start Chat"}
            </button>
          )}

          {callActive && (
            <button
              onClick={handleEndCall}
              className="w-40 text-xl py-3 rounded-3xl bg-destructive hover:bg-destructive/90 text-white transition-colors"
            >
              End Chat
            </button>
          )}

          {callEnded && (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => {
                  setCallEnded(false);
                  setMessages([]);
                }}
                className="w-40 text-xl py-3 rounded-3xl bg-primary hover:bg-primary/90 text-white transition-colors"
              >
                Start New Chat
              </button>
              <p className="text-sm text-muted-foreground">
                Chat ended successfully! ☕ Start a new one anytime!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;