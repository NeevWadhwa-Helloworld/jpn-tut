/**
 * srs.js — SM-2 Spaced Repetition Algorithm
 *
 * Ratings: 0=Again, 1=Hard, 2=Good, 3=Easy
 * Each card stores: { ease, interval, repetitions, dueDate, lapses }
 */

export const SRS = {
  MIN_EASE: 1.3,
  INITIAL_EASE: 2.5,

  /**
   * Create a fresh SRS record for a new card
   */
  newRecord(cardId) {
    return {
      cardId,
      ease: this.INITIAL_EASE,
      interval: 0,        // days until next review
      repetitions: 0,     // successful reviews in a row
      lapses: 0,          // times rated Again after learning
      dueDate: Date.now(), // due immediately
      lastReview: null,
    };
  },

  /**
   * Update SRS record after a review
   * @param {object} record — current SRS record
   * @param {number} rating — 0,1,2,3
   * @returns {object} updated record
   */
  review(record, rating) {
    const r = { ...record, lastReview: Date.now() };

    if (rating === 0) {
      // Again — reset
      r.repetitions = 0;
      r.interval = 1;          // review in 1 minute (in practice)
      r.lapses += 1;
      r.ease = Math.max(this.MIN_EASE, r.ease - 0.2);
    } else if (rating === 1) {
      // Hard — short interval
      r.interval = Math.max(1, Math.round(r.interval * 1.2));
      r.ease = Math.max(this.MIN_EASE, r.ease - 0.15);
    } else if (rating === 2) {
      // Good — standard progression
      if (r.repetitions === 0) r.interval = 1;
      else if (r.repetitions === 1) r.interval = 3;
      else r.interval = Math.round(r.interval * r.ease);
      r.repetitions += 1;
    } else if (rating === 3) {
      // Easy — accelerated
      if (r.repetitions === 0) r.interval = 4;
      else r.interval = Math.round(r.interval * r.ease * 1.3);
      r.ease += 0.15;
      r.repetitions += 1;
    }

    // Cap interval
    r.interval = Math.min(r.interval, 365);
    r.dueDate = Date.now() + r.interval * 24 * 60 * 60 * 1000;

    return r;
  },

  /**
   * Get human-readable next-interval string for UI labels
   */
  getIntervalLabel(record, rating) {
    const testRecord = this.review(record, rating);
    const days = testRecord.interval;
    if (days < 1) return '< 1 min';
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    if (days < 30) return `${Math.round(days / 7)} weeks`;
    return `${Math.round(days / 30)} months`;
  },

  /**
   * Sort cards by due date — overdue first
   */
  sortByDue(records) {
    return [...records].sort((a, b) => a.dueDate - b.dueDate);
  },

  /**
   * Filter to only cards due now
   */
  getDueCards(records) {
    const now = Date.now();
    return records.filter(r => r.dueDate <= now);
  }
};
