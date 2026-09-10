// Family Member Management, Independent Progress & Collective Household Sadhana

import { SCRIPTURES, TOTAL_CURRICULUM_SHLOKAS } from '/js/scriptures-data.js';
import { getSacredLevel } from '/js/badges-data.js';

const STORAGE_KEY = 'nitya_patha_family_v2';

export class FamilyManager {
  constructor(onDataChangeCallback = null) {
    this.onDataChange = onDataChangeCallback;
    this.data = this.loadData();
  }

  loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Error reading family data:", e);
    }
    // Default initial profile
    const initial = {
      activeMemberId: 'member_sandeep',
      members: [
        {
          id: 'member_sandeep',
          name: 'Sandeep',
          role: 'Parent',
          avatar: '🪔',
          color: '#d97706',
          streak: 0,
          longestStreak: 0,
          streakShields: 1,
          lastActiveDate: null,
          progress: {
            bhagavad_gita: 0,
            narayaneeyam: 0,
            vishnu_sahasranama: 0,
            lalita_sahasranama: 0,
            guru_gita: 0,
            soundarya_lahari: 0,
            sivananda_lahari: 0,
            shatashloki_ramayana: 0,
            kavachamanjari: 0
          },
          logs: []
        }
      ],
      settings: {
        startDateStr: new Date().toISOString().split('T')[0],
        endDateStr: new Date(Date.now() + 304 * 86400000).toISOString().split('T')[0],
        mode: 'parallel',
        soundEnabled: true,
        notificationsEnabled: false
      }
    };
    this.saveData(initial);
    return initial;
  }

  saveData(data = this.data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      if (this.onDataChange) {
        this.onDataChange(data);
      }
    } catch (e) {
      console.error("Error saving family data:", e);
    }
  }

  getMembers() {
    return this.data.members || [];
  }

  getActiveMember() {
    const member = this.data.members.find(m => m.id === this.data.activeMemberId);
    return member || this.data.members[0];
  }

  setActiveMember(memberId) {
    if (this.data.members.some(m => m.id === memberId)) {
      this.data.activeMemberId = memberId;
      this.saveData();
      return this.getActiveMember();
    }
    return null;
  }

  addMember(name, role = 'Child', avatar = '🌸', color = '#2563eb') {
    const id = 'member_' + Date.now().toString(36);
    const newMember = {
      id,
      name: name.trim(),
      role,
      avatar,
      color,
      streak: 0,
      longestStreak: 0,
      streakShields: 1,
      lastActiveDate: null,
      progress: {
        bhagavad_gita: 0,
        narayaneeyam: 0,
        vishnu_sahasranama: 0,
        lalita_sahasranama: 0,
        guru_gita: 0,
        soundarya_lahari: 0,
        sivananda_lahari: 0,
        shatashloki_ramayana: 0,
        kavachamanjari: 0
      },
      logs: []
    };
    this.data.members.push(newMember);
    this.saveData();
    return newMember;
  }

  deleteMember(memberId) {
    if (this.data.members.length <= 1) return false; // keep at least 1 member
    this.data.members = this.data.members.filter(m => m.id !== memberId);
    if (this.data.activeMemberId === memberId) {
      this.data.activeMemberId = this.data.members[0].id;
    }
    this.saveData();
    return true;
  }

  getSettings() {
    return this.data.settings || {};
  }

  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.saveData();
  }

  // Update progress for active member
  updateShlokaProgress(scriptureId, newCompletedCount, durationMins = 15, notes = '') {
    const member = this.getActiveMember();
    if (!member) return null;

    const scripture = SCRIPTURES.find(s => s.id === scriptureId);
    if (!scripture) return null;

    const parsedCount = parseInt(newCompletedCount);
    const clampedCount = Math.max(0, Math.min(scripture.totalShlokas, isNaN(parsedCount) ? 0 : parsedCount));
    const previousCount = member.progress[scriptureId] || 0;
    const delta = clampedCount - previousCount;

    // If no new shlokas were added, update value if set directly, but skip log & streak
    if (delta <= 0) {
      member.progress[scriptureId] = clampedCount;
      this.saveData();
      return null;
    }

    member.progress[scriptureId] = clampedCount;

    // Log entry if count increased
    const todayStr = new Date().toISOString().split('T')[0];
    member.logs.unshift({
      id: 'log_' + Date.now(),
      date: todayStr,
      timestamp: new Date().toISOString(),
      scriptureId,
      scriptureTitle: scripture.title,
      deltaShlokas: delta,
      totalNow: clampedCount,
      durationMins: Math.max(0, isNaN(parseInt(durationMins)) ? 0 : parseInt(durationMins)),
      notes: notes || 'Dedicated recitation'
    });

    // Update streak only when new shlokas are memorized
    this.updateMemberStreak(member, todayStr);

    this.saveData();
    return {
      member,
      delta,
      scripture,
      newTotal: clampedCount
    };
  }

  updateMemberStreak(member, activityDateStr) {
    const lastActive = member.lastActiveDate;
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (!lastActive) {
      member.streak = 1;
    } else if (lastActive === todayStr) {
      // already recorded today
    } else if (lastActive === yesterdayStr) {
      member.streak += 1;
    } else {
      // Missed more than 1 day: check if Streak Shield is available!
      if (member.streakShields > 0) {
        member.streakShields -= 1; // Shield preserved streak!
        member.streak += 1;
      } else {
        member.streak = 1;
      }
    }

    member.lastActiveDate = activityDateStr;
    if (member.streak > (member.longestStreak || 0)) {
      member.longestStreak = member.streak;
    }
  }

  // Get total shlokas memorized by a specific member
  getMemberTotalMemorized(member) {
    if (!member || !member.progress) return 0;
    return Object.values(member.progress).reduce((acc, count) => acc + (parseInt(count) || 0), 0);
  }

  // Collective Family Stats for the dedicated Family Sanctuary Tab
  getFamilyCollectiveStats() {
    const members = this.getMembers();
    let totalFamilyShlokas = 0;
    let totalFamilyMinutes = 0;
    let totalSessions = 0;

    members.forEach(m => {
      totalFamilyShlokas += this.getMemberTotalMemorized(m);
      if (m.logs) {
        totalSessions += m.logs.length;
        totalFamilyMinutes += m.logs.reduce((acc, l) => acc + (parseInt(l.durationMins) || 0), 0);
      }
    });

    const activeStreaks = members.map(m => m.streak || 0);
    const maxActiveStreak = activeStreaks.length > 0 ? Math.max(...activeStreaks) : 0;

    return {
      memberCount: members.length,
      totalFamilyShlokas,
      totalFamilyMinutes,
      totalFamilyHours: (totalFamilyMinutes / 60).toFixed(1),
      totalSessions,
      maxActiveStreak,
      membersSummary: members.map(m => {
        const total = this.getMemberTotalMemorized(m);
        const level = getSacredLevel(total);
        const percent = ((total / TOTAL_CURRICULUM_SHLOKAS) * 100).toFixed(1);
        return {
          id: m.id,
          name: m.name,
          role: m.role,
          avatar: m.avatar,
          color: m.color,
          streak: m.streak || 0,
          totalMemorized: total,
          percentCompleted: percent,
          levelTitle: level.title,
          levelSanskrit: level.sanskrit,
          levelIcon: level.icon
        };
      })
    };
  }

  // Replace full dataset from Google Sheets sync
  importFromCloud(cloudData) {
    if (cloudData && Array.isArray(cloudData.members) && cloudData.members.length > 0) {
      this.data = cloudData;
      this.saveData(cloudData);
      return true;
    }
    return false;
  }
}
