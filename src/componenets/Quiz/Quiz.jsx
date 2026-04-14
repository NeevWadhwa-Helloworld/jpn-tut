import React, { useState, useEffect } from 'react';
import { Storage } from '../../utils/storage';
import { getCards, getDistractors } from '../../utils/cards';

const buildQuestions = (type, level, count = 10) => {
  const cards = getCards(type, level);
  const shuffled = cards.sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map(card => {
    const distractors = getDistractors(card, 3);
    const options = [card.en, ...distractors].sort(() => Math.random() - 0.5);
    return { card, options, correctIndex: options.indexOf(card.en) };
  });
};

const Quiz = ({ navigate, settings }) => {
  const [questions, setQuestions] = useState([]);
  const [qi, setQi] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    startQuiz();
  }, [settings.level]);

  const startQuiz = () => {
    setQuestions(buildQuestions('vocab', settings.level));
    setQi(0);
    setCorrect(0);
    setWrong(0);
    setComplete(false);
    setSelectedOption(null);
  };

  const handleAnswer = (i) => {
    if (selectedOption !== null) return;
    setSelectedOption(i);
    
    const isCorrect = i === questions[qi].correctIndex;
    if (isCorrect) {
      setCorrect(prev => prev + 1);
      Storage.recordReview(true);
    } else {
      setWrong(prev => prev + 1);
      Storage.recordReview(false);
    }
    Storage.incrementProgress();

    setTimeout(() => {
      setSelectedOption(null);
      if (qi + 1 >= questions.length) {
        setComplete(true);
      } else {
        setQi(prev => prev + 1);
      }
    }, 1100);
  };

  if (complete) {
    const pct = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    return (
      <div className="page-container page-container--narrow">
        <div className="session-complete" id="quizComplete">
          <div className="complete-icon">🏆</div>
          <h2>Quiz done!</h2>
          <p id="quizFinalScore">{correct} correct out of {questions.length} ({pct}%)</p>
          <div className="complete-actions">
            <button className="primary-btn" onClick={startQuiz}>Try again</button>
            <button className="secondary-btn" onClick={() => navigate('dashboard')}>Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const q = questions[qi];
  let direction = 'What does this mean?';
  if (q.card.type === 'kanji') direction = 'What is the reading / meaning?';
  if (q.card.type === 'grammar') direction = 'What does this pattern mean?';

  return (
    <div className="page-container page-container--narrow">
      <div className="study-header">
        <button className="back-btn" onClick={() => navigate('dashboard')}>← Back</button>
        <span className="deck-name">Quiz Mode</span>
        <span className="card-counter">Q {qi + 1} / {questions.length}</span>
      </div>

      <div className="quiz-card">
        <p className="quiz-direction">{direction}</p>
        <div className="quiz-jp">{q.card.jp}</div>
        <div className={`quiz-furigana ${!settings.showFurigana ? 'furigana-hidden' : ''}`}>{q.card.furi}</div>
        <div className="quiz-options">
          {q.options.map((opt, i) => {
            let className = 'quiz-opt';
            if (selectedOption !== null) {
               if (i === q.correctIndex) className += ' is-correct';
               else if (i === selectedOption) className += ' is-wrong';
            }
            return (
              <button 
                key={i} 
                className={className} 
                onClick={() => handleAnswer(i)}
                disabled={selectedOption !== null}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div className="quiz-scoreboard">
        <div className="quiz-stat"><span>{correct}</span> correct</div>
        <div className="quiz-stat quiz-stat--wrong"><span>{wrong}</span> wrong</div>
      </div>
    </div>
  );
};

export default Quiz;
