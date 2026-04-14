import React, { useState, useEffect } from 'react';
import { Storage } from '../../utils/storage';
import { getCards } from '../../utils/cards';
import { SRS } from '../../utils/srs';

const buildDeck = (type, level) => {
  const cards = getCards(type, level);
  return cards.map(card => {
    const rec = Storage.getSRS(card.id);
    return { card, rec };
  }).sort((a, b) => a.rec.dueDate - b.rec.dueDate);
};

const Flashcards = ({ navigate, studyContext, setExplainCard, settings }) => {
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [sessionStart, setSessionStart] = useState(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (studyContext) {
      setDeck(buildDeck(studyContext.type, studyContext.level));
      setCurrentIndex(0);
      setIsFlipped(false);
      setSessionCorrect(0);
      setSessionTotal(0);
      setSessionStart(Date.now());
      setComplete(false);
    }
  }, [studyContext]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (complete) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped(true);
      }
      if (isFlipped) {
        if (e.key === '1') rate(0);
        if (e.key === '2') rate(1);
        if (e.key === '3') rate(2);
        if (e.key === '4') rate(3);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [complete, isFlipped, currentIndex, deck]);

  const rate = (rating) => {
    if (!isFlipped) {
      setIsFlipped(true);
      return;
    }

    const current = deck[currentIndex];
    const { card, rec } = current;
    const updatedRec = SRS.review(rec, rating);

    Storage.saveSRS(card.id, updatedRec);
    Storage.recordReview(rating >= 2);
    Storage.incrementProgress();

    if (rating >= 2) setSessionCorrect(prev => prev + 1);
    setSessionTotal(prev => prev + 1);

    const newDeck = [...deck];
    if (rating === 0) {
      const reinsertAt = Math.min(currentIndex + 5, deck.length);
      newDeck.splice(reinsertAt, 0, { card, rec: updatedRec });
      setDeck(newDeck);
    }

    if (currentIndex + 1 >= newDeck.length) {
      setComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const speakWord = (e, text) => {
    if (e) e.stopPropagation();
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop current playing audio
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ja-JP';
    utter.rate = 0.85;
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    if (isFlipped && settings.audioEnabled && deck.length > 0 && deck[currentIndex]) {
      speakWord(null, deck[currentIndex].card.jp);
    }
  }, [isFlipped]);

  if (!studyContext) {
    return (
      <div className="page-container page-container--narrow">
        <button className="back-btn" onClick={() => navigate('dashboard')}>← Back</button>
        <p style={{ marginTop: '16px' }}>Please select a deck from the dashboard to begin.</p>
      </div>
    );
  }

  if (complete) {
    const accuracy = sessionTotal ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;
    const mins = Math.round((Date.now() - sessionStart) / 60000);
    return (
      <div className="page-container page-container--narrow">
        <div className="session-complete">
          <div className="complete-icon">🎉</div>
          <h2>Session complete!</h2>
          <p>You reviewed {sessionTotal} cards with {accuracy}% accuracy in {mins} min.</p>
          <button className="primary-btn" onClick={() => navigate('dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  if (deck.length === 0) return null;

  const current = deck[currentIndex];
  const { card, rec } = current;
  const progressPct = ((currentIndex) / deck.length) * 100;

  return (
    <div className="page-container page-container--narrow">
      <div className="study-header">
        <button className="back-btn" onClick={() => navigate('dashboard')}>← Back</button>
        <span className="deck-name">{studyContext.type.charAt(0).toUpperCase() + studyContext.type.slice(1)} — {studyContext.level}</span>
        <span className="card-counter">Card {currentIndex + 1} / {deck.length}</span>
      </div>
      <div className="study-progress-bar">
        <div className="study-progress-fill" style={{ width: `${progressPct}%` }}></div>
      </div>

      <div className="cue-card-wrapper" onClick={() => setIsFlipped(true)}>
        <div className={`cue-card ${isFlipped ? 'is-flipped' : ''}`}>
          <div className="card-face card-face--front">
            <div className={`card-jp ${card.jp.length > 4 ? 'card-jp--long' : ''}`}>{card.jp}</div>
            <div className={`card-furigana ${!settings.showFurigana ? 'furigana-hidden' : ''}`}>{card.furi}</div>
            <div className="card-pos">{card.pos || ''}</div>
            <div className="card-tap-hint">tap to reveal →</div>
          </div>
          <div className="card-face card-face--back">
            <div className="card-meaning">{card.en}</div>
            <div className="card-reading">{card.romaji}</div>
            <div className="card-example">
              <span>{card.example?.jp || ''}</span>
              <span>{card.example?.en || ''}</span>
            </div>
            <button className="audio-btn" onClick={(e) => speakWord(e, card.jp)} title="Hear pronunciation">▶ Listen</button>
            <button className="explain-btn" onClick={(e) => { e.stopPropagation(); setExplainCard(card); }} title="AI explanation">✦ Explain</button>
          </div>
        </div>
      </div>

      <p className="flip-hint">Tap card to flip · Rate how well you remembered</p>

      <div className="answer-buttons" style={{ display: isFlipped ? 'flex' : 'none' }}>
        <button className="ans-btn ans-btn--again" onClick={(e) => { e.stopPropagation(); rate(0); }}>
          Again
          <span className="ans-interval">{SRS.getIntervalLabel(rec, 0)}</span>
        </button>
        <button className="ans-btn ans-btn--hard" onClick={(e) => { e.stopPropagation(); rate(1); }}>
          Hard
          <span className="ans-interval">{SRS.getIntervalLabel(rec, 1)}</span>
        </button>
        <button className="ans-btn ans-btn--good" onClick={(e) => { e.stopPropagation(); rate(2); }}>
          Good
          <span className="ans-interval">{SRS.getIntervalLabel(rec, 2)}</span>
        </button>
        <button className="ans-btn ans-btn--easy" onClick={(e) => { e.stopPropagation(); rate(3); }}>
          Easy
          <span className="ans-interval">{SRS.getIntervalLabel(rec, 3)}</span>
        </button>
      </div>
    </div>
  );
};

export default Flashcards;