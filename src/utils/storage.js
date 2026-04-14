/**
 * storage.js — LocalStorage persistence for Nihongo Navi
 * Stores user progress, SRS records, settings, and stats
 */

import { SRS } from './srs.js';

export const Storage = {
  KEY_PROGRESS: 'nn_progress',
  KEY_SETTINGS: 'nn_settings',
  KEY_STATS:    'nn_stats',
  KEY_SRS:      'nn_srs',

  // ── SETTINGS ─────────────────────────────────────────────
  defaultSettings() {
    return {
      level: 'N4',
      showFurigana: true,
      audioEnabled: true,
      dailyGoal: 20,        // cards per day
      studyOrder: 'srs',    // 'srs' | 'random' | 'new-first'
    };
  },

  getSettings() {
    try {
      const s = localStorage.getItem(this.KEY_SETTINGS);
      return s ? { ...this.defaultSettings(), ...JSON.parse(s) } : this.defaultSettings();
    } catch { return this.defaultSettings(); }
  },

  saveSettings(settings) {
    localStorage.setItem(this.KEY_SETTINGS, JSON.stringify(settings));
  },

  // ── STATS ─────────────────────────────────────────────────
  defaultStats() {
    return {
      totalReviews: 0,
      correctReviews: 0,
      streakDays: 0,
      lastStudyDate: null,
      minutesStudied: 0,
      cardsLearned: 0,       // cards with repetitions > 0
      reviewsByDate: {},     // { 'YYYY-MM-DD': count }
    };
  },

  getStats() {
    try {
      const s = localStorage.getItem(this.KEY_STATS);
      return s ? { ...this.defaultStats(), ...JSON.parse(s) } : this.defaultStats();
    } catch { return this.defaultStats(); }
  },

  saveStats(stats) {
    localStorage.setItem(this.KEY_STATS, JSON.stringify(stats));
  },

  recordReview(correct) {
    const stats = this.getStats();
    stats.totalReviews += 1;
    if (correct) stats.correctReviews += 1;
    const today = new Date().toISOString().split('T')[0];
    stats.reviewsByDate[today] = (stats.reviewsByDate[today] || 0) + 1;
    // Update streak
    if (stats.lastStudyDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      stats.streakDays = stats.lastStudyDate === yesterday ? stats.streakDays + 1 : 1;
      stats.lastStudyDate = today;
    }
    this.saveStats(stats);
    return stats;
  },

  getAccuracy() {
    const stats = this.getStats();
    if (!stats.totalReviews) return 0;
    return Math.round((stats.correctReviews / stats.totalReviews) * 100);
  },

  // ── SRS RECORDS ───────────────────────────────────────────
  getAllSRS() {
    try {
      const s = localStorage.getItem(this.KEY_SRS);
      return s ? JSON.parse(s) : {};
    } catch { return {}; }
  },

  getSRS(cardId) {
    const all = this.getAllSRS();
    return all[cardId] || SRS.newRecord(cardId);
  },

  saveSRS(cardId, record) {
    const all = this.getAllSRS();
    all[cardId] = record;
    localStorage.setItem(this.KEY_SRS, JSON.stringify(all));
  },

  saveSRSBatch(records) {
    const all = this.getAllSRS();
    records.forEach(r => { all[r.cardId] = r; });
    localStorage.setItem(this.KEY_SRS, JSON.stringify(all));
  },

  getDueCount() {
    const all = this.getAllSRS();
    const now = Date.now();
    return Object.values(all).filter(r => r.dueDate <= now).length;
  },

  // ── PROGRESS ──────────────────────────────────────────────
  getProgress() {
    try {
      const p = localStorage.getItem(this.KEY_PROGRESS);
      return p ? JSON.parse(p) : { reviewed: 0, goal: 20 };
    } catch { return { reviewed: 0, goal: 20 }; }
  },

  resetDailyProgress() {
    const settings = this.getSettings();
    localStorage.setItem(this.KEY_PROGRESS, JSON.stringify({
      reviewed: 0,
      goal: settings.dailyGoal,
      date: new Date().toISOString().split('T')[0],
    }));
  },

  incrementProgress() {
    const p = this.getProgress();
    p.reviewed = (p.reviewed || 0) + 1;
    localStorage.setItem(this.KEY_PROGRESS, JSON.stringify(p));
    return p;
  },

  // ── UTILITY ───────────────────────────────────────────────
  clearAll() {
    [this.KEY_PROGRESS, this.KEY_SETTINGS, this.KEY_STATS, this.KEY_SRS]
      .forEach(k => localStorage.removeItem(k));
  }
};
