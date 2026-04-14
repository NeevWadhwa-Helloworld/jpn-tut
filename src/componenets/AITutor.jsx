import React, { useState, useEffect, useRef } from 'react';
import { Storage } from '../utils/storage';
import { ALL_CARDS } from '../utils/cards';

const buildProgressSnapshot = () => {
  const stats = Storage.getStats();
  const settings = Storage.getSettings();
  const progress = Storage.getProgress();
  const allSRS = Storage.getAllSRS();

  const typeStats = { vocab: { total:0, good:0 }, kanji: { total:0, good:0 }, grammar: { total:0, good:0 }, phrases: { total:0, good:0 } };
  ALL_CARDS.forEach(card => {
    const rec = allSRS[card.id];
    if (!rec) return;
    const t = typeStats[card.type];
    if (!t) return;
    t.total++;
    if (rec.repetitions > 0) t.good++;
  });

  const strugglingCards = ALL_CARDS.filter(c => {
    const r = allSRS[c.id];
    return r && r.lapses >= 2;
  }).slice(0, 8).map(c => ({ jp: c.jp, en: c.en, type: c.type, lapses: allSRS[c.id].lapses }));

  const masteredCount = Object.values(allSRS).filter(r => r.repetitions >= 4).length;

  const today = new Date();
  const recentDays = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    recentDays.push({ date: key, reviews: stats.reviewsByDate?.[key] || 0 });
  }

  const avgDailyReviews = recentDays.reduce((s, d) => s + d.reviews, 0) / 7;
  const activeDays = recentDays.filter(d => d.reviews > 0).length;

  return {
    level: settings.level,
    dailyGoal: settings.dailyGoal,
    streakDays: stats.streakDays || 0,
    totalReviews: stats.totalReviews || 0,
    overallAccuracy: Storage.getAccuracy(),
    masteredCount,
    dueCount: Storage.getDueCount(),
    todayProgress: progress.reviewed || 0,
    typeStats,
    strugglingCards,
    recentActivity: { days: recentDays, avgDailyReviews: Math.round(avgDailyReviews), activeDays },
  };
};

const AITutor = () => {
  const [activeTab, setActiveTab] = useState('plan');
  const [plan, setPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [planError, setPlanError] = useState(null);
  
  const [chatHistory, setChatHistory] = useState([]);
  const [inputText, setInputText] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatLogRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'chat' && chatHistory.length === 0) {
      const snapshot = buildProgressSnapshot();
      const greet = `こんにちは！(Hello!) I'm Sensei 👋\n\nI can see you're at ${snapshot.level} level with a ${snapshot.streakDays}-day streak — impressive! You have ${snapshot.dueCount} cards due for review.\n\nAsk me anything about Japanese, your study plan, or a specific word you're struggling with!`;
      setChatHistory([{ role: 'assistant', content: greet }]);
    }
  }, [activeTab]);

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chatHistory, chatLoading]);

  const callClaude = async (messages, systemPrompt, maxTokens = 800) => {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages,
      }),
    });
    if (!resp.ok) throw new Error(`API error ${resp.status}`);
    const data = await resp.json();
    return data.content.map(b => b.text || '').join('');
  };

  const generatePlan = async () => {
    setLoadingPlan(true);
    setPlanError(null);
    try {
      const snapshot = buildProgressSnapshot();
      const system = `You are Sensei, a warm and encouraging Japanese language tutor AI embedded in Nihongo Navi, a spaced-repetition flashcard app. 
You analyze a learner's real study data and produce a concise, actionable, personalized learning plan.
Always be encouraging but honest. Use one or two Japanese words/phrases naturally in your response (with translation).
Format your response as valid JSON only — no markdown fences, no preamble. Return this exact structure:
{
  "summary": "2-3 sentence motivational overview of their progress",
  "strengths": ["strength 1", "strength 2"],
  "focusAreas": ["area 1", "area 2", "area 3"],
  "weeklyPlan": [
    { "day": "Monday", "focus": "deck name", "cards": 15, "tip": "short tip" }
  ],
  "dailyGoalRecommendation": 20,
  "priorityDeck": "vocab|kanji|grammar|phrases",
  "motivationalQuote": { "jp": "Japanese quote", "en": "English translation" }
}`;

      const userMsg = `Here is my current learning data:\n${JSON.stringify(snapshot, null, 2)}\n\nPlease analyze this data and generate a personalized 7-day study plan for me.`;
      const raw = await callClaude([{ role: 'user', content: userMsg }], system, 1200);
      const clean = raw.replace(/```json|```/g, '').trim();
      setPlan(JSON.parse(clean));
    } catch (err) {
      setPlanError(err.message);
    } finally {
      setLoadingPlan(false);
    }
  };

  const sendChatMessage = async (presetText) => {
    const text = presetText || inputText;
    if (!text.trim() || chatLoading) return;

    setInputText('');
    setChatLoading(true);
    
    const newChat = [...chatHistory, { role: 'user', content: text.trim() }];
    setChatHistory(newChat);

    const snapshot = buildProgressSnapshot();
    const system = `You are Sensei, a warm and expert Japanese language tutor built into Nihongo Navi.
You have access to the student's learning data and can answer questions about Japanese language, their progress, study strategies, and cultural context.
Keep responses concise (under 120 words). Use Japanese words naturally with translations. Be encouraging.

Student's current data summary:
- Level: ${snapshot.level}, Streak: ${snapshot.streakDays} days
- Overall accuracy: ${snapshot.overallAccuracy}%
- Cards mastered: ${snapshot.masteredCount}
- Due today: ${snapshot.dueCount}
- Struggling with: ${snapshot.strugglingCards.map(c => c.jp).join(', ') || 'nothing specific'}`;

    try {
      const reply = await callClaude(newChat, system, 300);
      setChatHistory([...newChat, { role: 'assistant', content: reply }]);
    } catch {
      setChatHistory([...newChat, { role: 'assistant', content: 'Sorry, I had trouble connecting. Please try again! 🙏' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="page-container">
      <header className="ai-header">
        <div>
          <h1 className="page-title">✦ Sensei AI</h1>
          <p className="page-subtitle">Your personalized Japanese learning coach powered by AI.</p>
        </div>
      </header>

      <div className="ai-tabs">
        <button className={`ai-tab ${activeTab === 'plan' ? 'active' : ''}`} onClick={() => setActiveTab('plan')}>📋 Learning Plan</button>
        <button className={`ai-tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>💬 Ask Sensei</button>
      </div>

      <div className="ai-tab-panel" style={{ display: activeTab === 'plan' ? 'block' : 'none' }}>
        <div id="aiPlanContent">
          {!plan && !loadingPlan && !planError && (
             <div className="ai-plan-empty">
               <div className="ai-empty-orb">先生</div>
               <h3>Get your personalized study plan</h3>
               <p>Sensei will analyze your SRS data, accuracy, streaks, and struggling cards to create a tailored 7-day plan.</p>
               <button className="primary-btn" onClick={generatePlan}>✦ Generate my plan</button>
             </div>
          )}

          {loadingPlan && (
            <div className="ai-loading">
              <div className="ai-loading-orb"></div>
              <p className="ai-loading-text">Sensei is analyzing your progress…</p>
              <p className="ai-loading-sub">Reviewing your SRS data, accuracy trends, and study patterns</p>
            </div>
          )}

          {planError && (
            <div className="ai-error">
              <div style={{fontSize:'32px', marginBottom:'8px'}}>😔</div>
              <p>Couldn't generate plan: {planError}</p>
              <button className="primary-btn" onClick={generatePlan} style={{marginTop:'16px'}}>Try again</button>
            </div>
          )}

          {plan && !loadingPlan && (
            <div className="ai-plan">
              <div className="ai-summary-card">
                <div className="ai-sensei-avatar">先生</div>
                <p className="ai-summary-text">{plan.summary}</p>
                <div className="ai-quote">
                  <span className="ai-quote-jp">{plan.motivationalQuote?.jp}</span>
                  <span className="ai-quote-en">{plan.motivationalQuote?.en}</span>
                </div>
              </div>

              <div className="ai-two-col">
                <div className="ai-box">
                  <div className="ai-box-title">💪 Strengths</div>
                  <div className="ai-tags">
                    {(plan.strengths || []).map((s, i) => <span key={i} className="ai-tag ai-tag--green">✓ {s}</span>)}
                  </div>
                </div>
                <div className="ai-box">
                  <div className="ai-box-title">🎯 Focus Areas</div>
                  <div className="ai-tags">
                     {(plan.focusAreas || []).map((f, i) => <span key={i} className="ai-tag ai-tag--red">↗ {f}</span>)}
                  </div>
                </div>
              </div>

              <div className="ai-two-col">
                <div className={`ai-metric-card ai-metric-card--${plan.priorityDeck === 'vocab' ? 'red' : 'gold'}`}>
                  <div className="ai-metric-label">Priority Deck</div>
                  <div className="ai-metric-value">{plan.priorityDeck}</div>
                </div>
                <div className="ai-metric-card">
                  <div className="ai-metric-label">Recommended Daily Goal</div>
                  <div className="ai-metric-value">{plan.dailyGoalRecommendation} cards</div>
                </div>
              </div>

              <div className="ai-section-label">7-Day Study Plan</div>
              <div className="weekly-grid">
                {(plan.weeklyPlan || []).map((d, i) => (
                  <div key={i} className="weekly-day">
                    <div className="weekly-day-name">{d.day?.slice(0,3)}</div>
                    <div className="weekly-day-focus">{d.focus}</div>
                    <div className="weekly-day-cards">{d.cards} cards</div>
                    <div className="weekly-day-tip">{d.tip}</div>
                  </div>
                ))}
              </div>

              <button className="ai-refresh-btn" onClick={generatePlan}>↻ Regenerate plan</button>
            </div>
          )}
        </div>
      </div>

      <div className="ai-tab-panel" style={{ display: activeTab === 'chat' ? 'block' : 'none' }}>
        <div className="chat-quick-chips">
          <button className="chat-chip" onClick={() => sendChatMessage("What should I focus on this week?")}>What to focus on this week?</button>
          <button className="chat-chip" onClick={() => sendChatMessage("Explain the difference between は and が")}>は vs が?</button>
          <button className="chat-chip" onClick={() => sendChatMessage("Give me a tip to improve my kanji memory")}>Kanji memory tip</button>
          <button className="chat-chip" onClick={() => sendChatMessage("How do I use て-form in Japanese?")}>て-form usage</button>
        </div>
        <div className="chat-log" ref={chatLogRef}>
          {chatHistory.map((msg, i) => (
            <div key={i} className={`chat-msg chat-msg--${msg.role}`}>
              <div className="chat-bubble" dangerouslySetInnerHTML={{ __html: String(msg.content).replace(/\\n/g, '<br>') }} />
            </div>
          ))}
          {chatLoading && (
            <div className="chat-msg chat-msg--assistant chat-typing">
              <div className="chat-bubble"><span className="typing-dot"></span><span className="typing-dot"></span><span className="typing-dot"></span></div>
            </div>
          )}
        </div>
        <div className="chat-input-row">
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Ask Sensei anything…" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') sendChatMessage(); }}
          />
          <button className="chat-send-btn" onClick={() => sendChatMessage()}>Send ↑</button>
        </div>
      </div>

    </div>
  );
};

export default AITutor;
