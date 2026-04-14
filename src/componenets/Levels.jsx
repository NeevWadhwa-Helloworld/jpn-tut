import React, { useState } from 'react';

const LEVELS = [
  { id:'N5', label:'Beginner',       desc:'Hiragana, basic vocab',     count: 100 },
  { id:'N4', label:'Elementary',     desc:'~500 vocab, basic grammar', count: 300 },
  { id:'N3', label:'Intermediate',   desc:'~650 vocab, sentence patterns', count: 650 },
  { id:'N2', label:'Upper-int.',     desc:'~1000 vocab, complex grammar', count: 1000 },
  { id:'N1', label:'Advanced',       desc:'~2000 vocab, full reading', count: 2000 },
];

const PLACEMENT_QUESTIONS = [
  { jp:'猫', options:['cat','dog','fish','bird'],        ans:0, level:'N5' },
  { jp:'学校', options:['hospital','school','park','bank'], ans:1, level:'N5' },
  { jp:'食べる', options:['to sleep','to run','to eat','to drink'], ans:2, level:'N5' },
  { jp:'気持ち', options:['weather','tool','feeling','money'], ans:2, level:'N4' },
  { jp:'決める', options:['to forget','to decide','to ask','to answer'], ans:1, level:'N4' },
  { jp:'遠慮', options:['distance','reservation/restraint','schedule','effort'], ans:1, level:'N3' },
  { jp:'機会', options:['machine','opportunity','season','opinion'], ans:1, level:'N3' },
];

const Levels = ({ navigate, updateSettings, settings }) => {
  const [quizActive, setQuizActive] = useState(false);
  const [pqi, setPqi] = useState(0);
  const [pScore, setPScore] = useState(0);

  const startPlacement = () => {
    setPqi(0);
    setPScore(0);
    setQuizActive(true);
  };

  const handleOption = (i, ans) => {
    if (i === ans) setPScore(prev => prev + 1);
    setPqi(prev => prev + 1);
  };

  const setLevel = (id) => {
    updateSettings({ ...settings, level: id });
    navigate('dashboard');
  };

  const renderQuiz = () => {
    if (pqi >= PLACEMENT_QUESTIONS.length) {
      const pct = pScore / PLACEMENT_QUESTIONS.length;
      let recommended;
      if (pct >= .85) recommended = 'N2';
      else if (pct >= .65) recommended = 'N3';
      else if (pct >= .45) recommended = 'N4';
      else recommended = 'N5';

      return (
        <div style={{textAlign:'center', padding:'24px'}}>
          <div style={{fontSize:'32px', marginBottom:'8px'}}>🎯</div>
          <h3 style={{fontFamily:'var(--fj)', fontSize:'22px', fontWeight:'400', marginBottom:'6px'}}>
            Recommended: {recommended}
          </h3>
          <p style={{fontSize:'14px', color:'var(--mid)', marginBottom:'20px'}}>
            {pScore} / {PLACEMENT_QUESTIONS.length} correct
          </p>
          <button className="primary-btn" onClick={() => {
            setLevel(recommended);
            setQuizActive(false);
          }}>Set my level to {recommended} →</button>
        </div>
      );
    }

    const q = PLACEMENT_QUESTIONS[pqi];
    return (
      <div className="quiz-card">
        <p className="quiz-direction">Placement Q{pqi + 1} / {PLACEMENT_QUESTIONS.length}</p>
        <div className="quiz-jp">{q.jp}</div>
        <div className="quiz-options">
          {q.options.map((opt, i) => (
            <button key={opt} className="quiz-opt" onClick={() => handleOption(i, q.ans)}>{opt}</button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="page-container page-container--narrow">
      <h1 className="page-title">Your level & placement</h1>
      <p className="page-subtitle">Choose your JLPT level or take a quick quiz to find out.</p>

      <div className="level-grid" id="levelGrid">
        {LEVELS.map(lv => (
          <div key={lv.id} className={`level-card ${settings.level === lv.id ? 'is-current' : ''}`} onClick={() => setLevel(lv.id)}>
            <div className="level-card-name">{lv.id}</div>
            <div className="level-card-label">{lv.label}</div>
            <div className="level-card-count">{lv.desc}</div>
          </div>
        ))}
      </div>

      <div className="placement-section">
        <h2 className="section-title">Not sure? Take a placement quiz</h2>
        <p style={{color:'var(--mid)', fontSize:'14px', marginBottom:'16px'}}>10 questions across vocabulary, reading, and grammar.</p>
        {!quizActive && <button className="primary-btn" onClick={startPlacement}>Start placement test →</button>}
      </div>

      {quizActive && (
        <div className="placement-quiz">
          {renderQuiz()}
        </div>
      )}
    </div>
  );
};

export default Levels;
