import React, { useState, useEffect } from 'react';
import { Storage } from '../utils/storage';
import { ALL_CARDS, getCards } from '../utils/cards';

const DECK_CONFIG = [
  { type:'vocab',   label:'Vocabulary', meta:'N5–N3 word list',      jp:'語', color:'vocab'   },
  { type:'kanji',   label:'Kanji',      meta:'Readings & meanings',   jp:'字', color:'kanji'  },
  { type:'grammar', label:'Grammar',    meta:'Patterns & structures', jp:'文', color:'grammar'},
  { type:'phrases', label:'Phrases',    meta:'Daily & JLPT phrases',  jp:'話', color:'phrases'},
];

const Dashboard = ({ navigate, setStudyContext, settings }) => {
  const [stats, setStats] = useState(Storage.getStats());
  const [accuracy, setAccuracy] = useState(Storage.getAccuracy());
  const [due, setDue] = useState(Storage.getDueCount());
  const [progress, setProgress] = useState(Storage.getProgress());
  
  useEffect(() => {
    setStats(Storage.getStats());
    setAccuracy(Storage.getAccuracy());
    setDue(Storage.getDueCount());
    setProgress(Storage.getProgress());
  }, [settings.level]);

  const greetingText = () => {
    const h = new Date().getHours();
    if (h < 5)  return 'お疲れ様！';
    if (h < 12) return 'おはようございます！';
    if (h < 17) return 'こんにちは！';
    return 'こんばんは！';
  };

  const goal = progress.goal || settings.dailyGoal;
  const done = progress.reviewed || 0;
  const pct = Math.min(100, Math.round((done / goal) * 100)) || 0;

  const handleDeckClick = (type) => {
    setStudyContext({ type, level: settings.level });
    navigate('study');
  };

  return (
    <div className="page-container">
      <header className="dashboard-header">
        <div>
          <h1 className="greeting" id="greetingText">{greetingText()}</h1>
          <p className="sub-text" id="greetingSubtext">
            {due > 0 ? `You have ${due} card${due !== 1 ? 's' : ''} due for review. Keep going!` : `All caught up! Great job today.`}
          </p>
        </div>
        <div className="streak-display">
          <span className="streak-fire">🔥</span>
          <span className="streak-num" id="streakNum">{stats.streakDays || 0}</span>
          <span className="streak-label">day streak</span>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number" id="stat-learned">{stats.cardsLearned || ALL_CARDS.length}</div>
          <div className="stat-label">Cards learned</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" id="stat-accuracy">{accuracy}%</div>
          <div className="stat-label">Accuracy</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" id="stat-due">{due}</div>
          <div className="stat-label">Due today</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" id="stat-minutes">{stats.minutesStudied || 0}</div>
          <div className="stat-label">Min studied today</div>
        </div>
      </div>

      <div className="section-block">
        <h2 className="section-title">Today's progress</h2>
        <div className="progress-bar">
          <div className="progress-fill" id="todayProgress" style={{ width: `${pct}%` }}></div>
        </div>
        <p className="progress-text" id="progressText">{done} of {goal} cards reviewed</p>
      </div>

      <h2 className="section-title">Study decks</h2>
      <div className="decks-grid" id="decksGrid">
        {DECK_CONFIG.map(d => {
          const cards = getCards(d.type, settings.level);
          const dueCards = cards.filter(c => {
            const rec = Storage.getSRS(c.id);
            return rec.dueDate <= Date.now();
          }).length;
          return (
            <div key={d.type} className="deck-card" data-type={d.color} onClick={() => handleDeckClick(d.type)}>
              <div className="deck-bg-char">{d.jp}</div>
              <div className="deck-title">{d.label}</div>
              <div className="deck-meta">{d.meta}</div>
              <div className="deck-due" data-count={dueCards}>
                {dueCards > 0 ? `${dueCards} due` : 'All done ✓'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
