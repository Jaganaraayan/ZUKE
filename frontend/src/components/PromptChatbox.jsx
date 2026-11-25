import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  RotateCcw,
  Bot,
  User,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Trash2,
  CheckCircle2,
  Layers,
  ArrowRight,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import '../styles/chatbox.css';

const QUICK_IMPROVISATIONS = [
  { label: '🏊 Add Swimming Pool', prompt: 'Add a swimming pool with surrounding stone deck' },
  { label: '🏖️ Add First-Floor Balcony', prompt: 'Add a cantilevered first-floor balcony with glass railings' },
  { label: '🌿 Add Landscaped Garden', prompt: 'Add a landscaped garden with perimeter hedges and stone walkway' },
  { label: '🏠 Change to Flat Roof', prompt: 'Change the roof to a modern flat cantilever roof' },
  { label: '🪵 Switch to Wood Panels', prompt: 'Replace exterior walls with warm architectural wood panels' },
  { label: '🏛️ Add Columns', prompt: 'Add structural architectural columns' },
  { label: '🚗 Add Carport', prompt: 'Add an architectural carport parking bay' },
  { label: '🪟 Large Glass Windows', prompt: 'Add large panoramic glass windows' },
  { label: '⬆️ Increase Building Height', prompt: 'Increase the building height' },
  { label: '🔲 Minimalist White Style', prompt: 'Change the architecture to minimalist with smooth white concrete' }
];

export default function PromptChatbox({
  sceneConfig,
  onApplyModification,
  isModifying,
  lastResult,
  onUndo
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your ZUKE Architectural Copilot. Tell me how you want to improvise, modify, or detail this 3D model in real time.',
      changes: ['Scene loaded in interactive 3D viewport'],
      components: ['3D Geometry Engine'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (textToSend = null) => {
    const prompt = (textToSend || inputText).trim();
    if (!prompt || isModifying) return;

    const userMsgId = `u_${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Trigger 3D modification
    const result = onApplyModification(prompt);

    // Add Assistant response with identified changes & affected components
    setTimeout(() => {
      const assistantMsg = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: result?.changes?.length 
          ? `I've updated the 3D model with your instructions.` 
          : `Refined the architectural model based on "${prompt}".`,
        changes: result?.changes || ['Applied architectural refinements'],
        components: result?.affectedComponents || ['Model Geometry'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    }, 250);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `m_${Date.now()}`,
        sender: 'assistant',
        text: 'Chat history cleared. Tell me how you would like to continue improvising the 3D model.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className={`prompt-chatbox-container ${isOpen ? 'open' : 'collapsed'} ${isExpanded ? 'expanded' : ''}`}>
      {/* Chatbox Header */}
      <div className="chatbox-header" onClick={() => !isExpanded && setIsOpen(!isOpen)}>
        <div className="flex items-center gap-2">
          <div className="chat-bot-avatar">
            <Sparkles size={14} />
          </div>
          <div className="flex flex-col">
            <span className="chatbox-title">AI Architectural Copilot</span>
            <span className="chatbox-subtitle">
              {isModifying ? 'Updating 3D geometry...' : 'Continuous 3D Model Improviser'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            className="chat-header-btn"
            onClick={handleClearChat}
            title="Clear Chat History"
          >
            <Trash2 size={13} />
          </button>
          <button
            className="chat-header-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Restore Size' : 'Expand Chatbox'}
          >
            {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
          <button
            className="chat-header-btn"
            onClick={() => setIsOpen(!isOpen)}
            title={isOpen ? 'Collapse Chat' : 'Open Chat'}
          >
            {isOpen ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          {/* Quick Improvisation Chips Carousel */}
          <div className="chat-chips-bar">
            <span className="chips-label">
              <Lightbulb size={12} className="text-accent" />
              <span>Improvise:</span>
            </span>
            <div className="chips-scroll">
              {QUICK_IMPROVISATIONS.map((chip, idx) => (
                <button
                  key={idx}
                  className="quick-chip"
                  onClick={() => handleSend(chip.prompt)}
                  disabled={isModifying}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Stream */}
          <div className="chat-messages-stream">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble-wrapper ${msg.sender === 'user' ? 'user-msg' : 'assistant-msg'}`}
              >
                <div className="chat-bubble-avatar">
                  {msg.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                </div>

                <div className="chat-bubble-content">
                  <div className="chat-bubble-header">
                    <span className="sender-name">
                      {msg.sender === 'user' ? 'You' : 'ZUKE Copilot'}
                    </span>
                    <span className="msg-time">{msg.timestamp}</span>
                  </div>

                  <p className="msg-text">{msg.text}</p>

                  {/* List of changes applied to 3D scene */}
                  {msg.changes && msg.changes.length > 0 && (
                    <div className="msg-changes-card">
                      <div className="changes-title">
                        <CheckCircle2 size={11} className="text-success" />
                        <span>Changes Applied to 3D Model:</span>
                      </div>
                      <ul className="changes-list">
                        {msg.changes.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>

                      {msg.components && msg.components.length > 0 && (
                        <div className="msg-components-tags">
                          {msg.components.map((comp, idx) => (
                            <span key={idx} className="comp-tag">
                              {comp}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isModifying && (
              <div className="chat-bubble-wrapper assistant-msg">
                <div className="chat-bubble-avatar">
                  <Bot size={12} />
                </div>
                <div className="chat-bubble-content typing-indicator-box">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <span className="text-xs text-muted ml-2">Extruding & updating 3D components...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="chat-input-bar">
            <textarea
              ref={inputRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask to improvise (e.g. 'Add a swimming pool', 'Change roof to flat', 'Add wood panels')..."
              className="chat-textarea"
              disabled={isModifying}
            />
            <button
              className="chat-send-btn"
              onClick={() => handleSend()}
              disabled={isModifying || !inputText.trim()}
              title="Send Prompt (Enter)"
            >
              <Send size={15} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
