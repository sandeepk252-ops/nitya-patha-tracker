// Dynamic 10-Month Timeline Engine & Individual Catch-up Pace Estimator

import { SCRIPTURES, TOTAL_CURRICULUM_SHLOKAS } from './scriptures-data.js';

export class ScheduleEngine {
  constructor(settings = {}) {
    this.startDateStr = settings.startDateStr || this.getDefaultStartDate();
    this.endDateStr = settings.endDateStr || this.getDefaultEndDate(this.startDateStr, 10);
    this.mode = settings.mode || 'parallel'; // 'parallel' (recommended) or 'sequential'
  }

  getDefaultStartDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  getDefaultEndDate(startDateStr, months = 10) {
    const d = new Date(startDateStr);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().split('T')[0];
  }

  updateDates(startDateStr, endDateStr) {
    this.startDateStr = startDateStr;
    this.endDateStr = endDateStr;
  }

  getTotalDays() {
    const start = new Date(this.startDateStr);
    const end = new Date(this.endDateStr);
    const diffMs = end - start;
    return Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
  }

  // Get Day index (1-based) for any given target date string
  getDayIndexForDate(dateStr) {
    const start = new Date(this.startDateStr);
    const target = new Date(dateStr);
    const diffMs = target - start;
    const day = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return day;
  }

  // Baseline expected shlokas per day across the whole curriculum
  getBaselineDailyPace() {
    const totalDays = this.getTotalDays();
    return Number((TOTAL_CURRICULUM_SHLOKAS / totalDays).toFixed(1));
  }

  // Calculate expected cumulative curriculum shlokas up to a specific date
  getExpectedShlokasUpToDate(dateStr) {
    const totalDays = this.getTotalDays();
    const dayIndex = this.getDayIndexForDate(dateStr);

    if (dayIndex <= 0) return 0;
    if (dayIndex >= totalDays) return TOTAL_CURRICULUM_SHLOKAS;

    const fraction = dayIndex / totalDays;
    return Math.min(TOTAL_CURRICULUM_SHLOKAS, Math.round(fraction * TOTAL_CURRICULUM_SHLOKAS));
  }

  // Calculate expected cumulative shlokas for a single scripture up to a specific date
  getExpectedShlokasForScripture(scriptureId, dateStr) {
    const scripture = SCRIPTURES.find(s => s.id === scriptureId);
    if (!scripture) return 0;

    const totalDays = this.getTotalDays();
    const dayIndex = this.getDayIndexForDate(dateStr);

    if (dayIndex <= 0) return 0;
    if (dayIndex >= totalDays) return scripture.totalShlokas;

    const fraction = dayIndex / totalDays;
    return Math.min(scripture.totalShlokas, Math.round(fraction * scripture.totalShlokas));
  }

  // Detailed syllabus allocation for any specific date
  getAllocationForDate(dateStr) {
    const dayIndex = this.getDayIndexForDate(dateStr);
    const totalDays = this.getTotalDays();
    const isPast = dayIndex < this.getDayIndexForDate(new Date().toISOString().split('T')[0]);
    const isFuture = dayIndex > this.getDayIndexForDate(new Date().toISOString().split('T')[0]);
    const isToday = !isPast && !isFuture;

    const expectedTotal = this.getExpectedShlokasUpToDate(dateStr);
    const prevDateStr = new Date(new Date(dateStr).getTime() - 86400000).toISOString().split('T')[0];
    const prevExpected = this.getExpectedShlokasUpToDate(prevDateStr);
    const dailyTargetShlokas = Math.max(1, expectedTotal - prevExpected);

    // Map targets per scripture for this day
    const scriptureAllocations = SCRIPTURES.map(s => {
      const expToday = this.getExpectedShlokasForScripture(s.id, dateStr);
      const expYesterday = this.getExpectedShlokasForScripture(s.id, prevDateStr);
      const todayCount = Math.max(0, expToday - expYesterday);

      // Locate chapter and verse range
      let currentCh = null;
      let verseInChStart = 1;
      let verseInChEnd = 1;

      if (expToday > 0) {
        for (const ch of s.chapters) {
          if (expToday >= ch.startShloka && expToday <= ch.endShloka) {
            currentCh = ch;
            verseInChEnd = expToday - ch.startShloka + 1;
            verseInChStart = Math.max(1, verseInChEnd - todayCount + 1);
            break;
          }
        }
        if (!currentCh && expToday >= s.totalShlokas) {
          currentCh = s.chapters[s.chapters.length - 1];
          verseInChEnd = currentCh.shlokas;
          verseInChStart = currentCh.shlokas;
        }
      } else {
        currentCh = s.chapters[0];
      }

      return {
        scriptureId: s.id,
        title: s.title,
        shortTitle: s.shortTitle,
        icon: s.icon,
        color: s.color,
        expectedCumulative: expToday,
        totalShlokas: s.totalShlokas,
        todayQuota: todayCount,
        chapterNum: currentCh ? currentCh.num : 1,
        chapterName: currentCh ? currentCh.name : '',
        chapterNameSanskrit: currentCh ? currentCh.nameSanskrit : '',
        verseRangeText: todayCount > 0 ? `Verses ${verseInChStart}–${verseInChEnd}` : `Review & Retention`
      };
    });

    return {
      dateStr,
      dayIndex,
      totalDays,
      isToday,
      isPast,
      isFuture,
      expectedCumulative: expectedTotal,
      dailyTargetShlokas,
      scriptureAllocations
    };
  }

  // Individual Progress Evaluation & Dynamic Catch-Up Rate Calculator
  evaluateIndividualProgress(memberProgress, currentDateStr = null) {
    const todayStr = currentDateStr || new Date().toISOString().split('T')[0];
    const dayIndex = this.getDayIndexForDate(todayStr);
    const totalDays = this.getTotalDays();
    const remainingDays = Math.max(1, totalDays - dayIndex);

    // Compute total shlokas completed by member
    let totalCompleted = 0;
    const scriptureBreakdown = {};

    SCRIPTURES.forEach(s => {
      const completed = parseInt(memberProgress[s.id]) || 0;
      totalCompleted += completed;
      const expectedForScripture = this.getExpectedShlokasForScripture(s.id, todayStr);
      const diff = completed - expectedForScripture;

      let status = 'ON_TRACK';
      if (diff >= 3) status = 'AHEAD';
      else if (diff <= -3) status = 'BEHIND';

      const remainingInScripture = Math.max(0, s.totalShlokas - completed);
      const reqPace = Number((remainingInScripture / remainingDays).toFixed(2));

      scriptureBreakdown[s.id] = {
        scriptureId: s.id,
        title: s.title,
        completed,
        total: s.totalShlokas,
        expected: expectedForScripture,
        delta: diff,
        status,
        remaining: remainingInScripture,
        requiredDailyPace: reqPace
      };
    });

    const expectedTotal = this.getExpectedShlokasUpToDate(todayStr);
    const overallDelta = totalCompleted - expectedTotal;

    let overallStatus = 'ON_TRACK';
    if (overallDelta >= 5) overallStatus = 'AHEAD';
    else if (overallDelta <= -5) overallStatus = 'BEHIND';

    // Dynamic Catch-Up Pace Calculation
    const remainingShlokas = Math.max(0, TOTAL_CURRICULUM_SHLOKAS - totalCompleted);
    const requiredDailyPace = Number((remainingShlokas / remainingDays).toFixed(1));

    // Effort & Time Estimation (Minutes per Day)
    // ~7 minutes per new shloka (pronunciation, meter, repetition) + 15 mins daily retention revision
    const newShlokaMins = Math.round(requiredDailyPace * 7);
    const revisionMins = totalCompleted > 0 ? 15 : 5;
    const estimatedDailyMins = newShlokaMins + revisionMins;

    // Health / Intensity Gauge
    let healthGauge = 'gentle';
    let healthLabel = 'Comfortable & Harmonious';
    let healthIcon = '🟢';
    let healthDesc = 'Steady and enjoyable pace. Perfect for deep retention and peaceful memorization.';

    if (requiredDailyPace > 12) {
      healthGauge = 'overburdened';
      healthLabel = 'Overburdened (High Risk of Burnout)';
      healthIcon = '🔴';
      healthDesc = 'Target requires excessive daily chanting. We recommend using 1-Click Re-baseline to extend your date.';
    } else if (requiredDailyPace > 8) {
      healthGauge = 'intensive';
      healthLabel = 'Intensive Catch-Up';
      healthIcon = '🟠';
      healthDesc = 'Requires strong commitment and extra focus sessions each day.';
    } else if (requiredDailyPace > 5.5) {
      healthGauge = 'brisk';
      healthLabel = 'Brisk Catch-Up';
      healthIcon = '🟡';
      healthDesc = 'A slightly accelerated pace. Easily achievable with focused morning & evening patha.';
    }

    // Recommended date extension for realistic re-baselining if overburdened
    const realisticDaysNeeded = Math.ceil(remainingShlokas / 5.6);
    const realisticEndDate = new Date(Date.now() + realisticDaysNeeded * 86400000).toISOString().split('T')[0];

    return {
      todayStr,
      dayIndex,
      totalDays,
      remainingDays,
      totalCompleted,
      totalCurriculum: TOTAL_CURRICULUM_SHLOKAS,
      expectedTotal,
      overallDelta,
      overallStatus,
      requiredDailyPace,
      estimatedDailyMins,
      healthGauge,
      healthLabel,
      healthIcon,
      healthDesc,
      realisticEndDate,
      scriptureBreakdown
    };
  }
}
