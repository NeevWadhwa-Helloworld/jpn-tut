import React, { useState, useEffect } from 'react';
import { Storage } from '../utils/storage';

const ExplainModal = ({ card, onClose }) => {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!card) return;
    
    const fetchExplanation = async () => {
      setLoading(true);
      setError(false);
      setExplanation('');
      
      const settings = Storage.getSettings();
      const srsRec = Storage.getSRS(card.id);
      
      const system = `You are Sensei, a friendly Japanese tutor. Explain Japanese vocabulary/kanji/grammar to a learner.
Be concise (150-200 words), use examples, mention common mistakes, and provide a helpful memory tip.
Use a warm, conversational tone. Include 1-2 emoji for readability. No markdown headers — use plain paragraphs.`;

      const userMsg = `The student is at JLPT ${settings.level} level. They've reviewed this card ${srsRec.repetitions} times and made ${srsRec.lapses} mistakes.

Card details:
- Japanese: ${card.jp}
- Furigana: ${card.furi}
- Romaji: ${card.romaji}
- English: ${card.en}
- Part of speech: ${card.pos}
- Example: ${card.example?.jp} (${card.example?.en})
- Type: ${card.type}

Please explain this in a way that will help them remember it better.`;

      try {
        const resp = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 400,
            system: system,
            messages: [{ role: 'user', content: userMsg }],
          }),
        });
        if (!resp.ok) throw new Error('API error');
        const data = await resp.json();
        setExplanation(data.content.map(b => b.text || '').join(''));
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExplanation();
  }, [card]);

  if (!card) return null;

  return (
    <div className="explain-modal" id="explainModal" onClick={(e) => {
      if (e.target.className === 'explain-modal') onClose();
    }}>
      <div className="explain-modal-box">
        <div className="explain-modal-header">
          <span className="explain-modal-title">✦ Sensei explains</span>
          <button className="explain-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="explain-modal-body">
          {loading && (
            <div className="explain-loading">
              <div className="explain-spinner"></div>
              <p>Sensei is thinking…</p>
            </div>
          )}
          {error && <p className="explain-error">Couldn't load explanation. Please try again.</p>}
          {!loading && !error && (
            <div dangerouslySetInnerHTML={{ __html: `<p class="explain-text">${explanation.replace(/\\n\\n/g, '</p><p class="explain-text">').replace(/\\n/g, '<br>')}</p>` }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplainModal;
