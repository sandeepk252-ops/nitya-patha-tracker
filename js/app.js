// Master Application Orchestrator for Nitya Patha

import { sacredAudio } from './audio.js';
import { SCRIPTURES, TOTAL_CURRICULUM_SHLOKAS } from './scriptures-data.js';
import { SACRED_LEVELS, SCRIPTURE_MICRO_BADGES, getSacredLevel, getNextSacredLevel } from './badges-data.js';
import { ScheduleEngine } from './schedule-engine.js';
import { FamilyManager } from './family-manager.js';
import { GoogleSheetsSync } from './google-sheets-sync.js';
import { reminderManager } from './reminders.js';

class AppController {
  constructor() {
    this.currentTab = 'dashboard';
    this.selectedCalendarDate = new Date().toISOString().split('T')[0];
    this.activeModalScriptureId = null;

    // Initialize core managers
    this.familyManager = new FamilyManager(() => this.onLocalDataChanged());
    const settings = this.familyManager.getSettings();

    this.scheduleEngine = new ScheduleEngine({
      startDateStr: settings.startDateStr,
      endDateStr: settings.endDateStr,
      mode: settings.mode
    });

    this.cloudSync = new GoogleSheetsSync((cloudData) => {
      this.familyManager.importFromCloud(cloudData);
      this.render();
    });

    this.init();
  }

  init() {
    this.setupTabs();
    this.setupHeaderControls();
    this.setupModals();
    this.setupCalendarControls();
    this.setupSettingsControls();
    this.render();

    // Check time-aware reminders periodically
    setInterval(() => this.updateTimeAwareBanner(), 60000);
  }

  onLocalDataChanged() {
    // Push updates to cloud in background
    if (this.cloudSync) {
      this.cloudSync.pushToCloud(this.familyManager.data);
    }
    this.render();
  }

  setupTabs() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        this.switchTab(target);
      });
    });

    const jumpBtn = document.getElementById('btn-jump-to-scriptures');
    if (jumpBtn) {
      jumpBtn.addEventListener('click', () => this.switchTab('scriptures'));
    }
  }

  switchTab(tabId) {
    this.currentTab = tabId;
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.tab-panel').forEach(p => {
      p.classList.toggle('active', p.id === `tab-${tabId}`);
    });
    this.renderTabSpecifics(tabId);
  }

  setupHeaderControls() {
    // Member dropdown
    const memberSelect = document.getElementById('member-select');
    if (memberSelect) {
      memberSelect.addEventListener('change', (e) => {
        this.familyManager.setActiveMember(e.target.value);
        this.render();
      });
    }

    // Sacred Bell button
    const bellBtn = document.getElementById('bell-btn');
    if (bellBtn) {
      bellBtn.addEventListener('click', () => {
        sacredAudio.playTempleBell();
        this.showToast('🔔 Sacred Chime', 'Temple bell resonance purifying the mind.');
      });
    }

    // Sound toggle button
    const soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const enabled = sacredAudio.toggleSound();
        soundBtn.textContent = enabled ? '🔊' : '🔇';
      });
    }

    // Nudge action button
    const nudgeBtn = document.getElementById('nudge-action-btn');
    if (nudgeBtn) {
      nudgeBtn.addEventListener('click', () => {
        this.switchTab('scriptures');
      });
    }
  }

  setupCalendarControls() {
    const datePicker = document.getElementById('calendar-date-picker');
    if (datePicker) {
      datePicker.value = this.selectedCalendarDate;
      datePicker.addEventListener('change', (e) => {
        if (e.target.value) {
          this.selectedCalendarDate = e.target.value;
          this.renderCalendarDateView();
        }
      });
    }

    const todayBtn = document.getElementById('btn-jump-today');
    if (todayBtn) {
      todayBtn.addEventListener('click', () => {
        this.selectedCalendarDate = new Date().toISOString().split('T')[0];
        if (datePicker) datePicker.value = this.selectedCalendarDate;
        this.renderCalendarDateView();
      });
    }

    const prevBtn = document.getElementById('btn-prev-day');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const d = new Date(this.selectedCalendarDate);
        d.setDate(d.getDate() - 1);
        this.selectedCalendarDate = d.toISOString().split('T')[0];
        if (datePicker) datePicker.value = this.selectedCalendarDate;
        this.renderCalendarDateView();
      });
    }

    const nextBtn = document.getElementById('btn-next-day');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const d = new Date(this.selectedCalendarDate);
        d.setDate(d.getDate() + 1);
        this.selectedCalendarDate = d.toISOString().split('T')[0];
        if (datePicker) datePicker.value = this.selectedCalendarDate;
        this.renderCalendarDateView();
      });
    }
  }

  setupModals() {
    // Advance Shlokas Modal
    const advanceModal = document.getElementById('modal-log-shlokas');
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn && advanceModal) {
      closeBtn.addEventListener('click', () => advanceModal.classList.remove('active'));
    }

    const submitAdvanceBtn = document.getElementById('modal-submit-advance-btn');
    if (submitAdvanceBtn) {
      submitAdvanceBtn.addEventListener('click', () => {
        if (!this.activeModalScriptureId) return;
        const delta = parseInt(document.getElementById('modal-delta-shlokas').value) || 1;
        const duration = parseInt(document.getElementById('modal-duration').value) || 15;
        const notes = document.getElementById('modal-notes').value || '';

        const activeMember = this.familyManager.getActiveMember();
        const current = activeMember.progress[this.activeModalScriptureId] || 0;
        const res = this.familyManager.updateShlokaProgress(this.activeModalScriptureId, current + delta, duration, notes);

        advanceModal.classList.remove('active');
        sacredAudio.playCelebration();
        this.checkMilestoneUnlocks(this.activeModalScriptureId, current + delta);
        this.render();
      });
    }

    // Set Exact Count Modal
    const exactModal = document.getElementById('modal-set-exact');
    const exactCloseBtn = document.getElementById('modal-exact-close-btn');
    if (exactCloseBtn && exactModal) {
      exactCloseBtn.addEventListener('click', () => exactModal.classList.remove('active'));
    }

    const exactSubmitBtn = document.getElementById('modal-exact-submit-btn');
    if (exactSubmitBtn) {
      exactSubmitBtn.addEventListener('click', () => {
        if (!this.activeModalScriptureId) return;
        const count = parseInt(document.getElementById('modal-exact-count').value) || 0;
        this.familyManager.updateShlokaProgress(this.activeModalScriptureId, count, 15, 'Updated exact count');
        exactModal.classList.remove('active');
        sacredAudio.playTempleBell();
        this.checkMilestoneUnlocks(this.activeModalScriptureId, count);
        this.render();
      });
    }

    // Add Family Member Modal
    const addMemberModal = document.getElementById('modal-add-member');
    const openAddMemberBtn = document.getElementById('btn-add-member-modal');
    const closeAddMemberBtn = document.getElementById('modal-member-close-btn');

    if (openAddMemberBtn && addMemberModal) {
      openAddMemberBtn.addEventListener('click', () => addMemberModal.classList.add('active'));
    }
    if (closeAddMemberBtn && addMemberModal) {
      closeAddMemberBtn.addEventListener('click', () => addMemberModal.classList.remove('active'));
    }

    const saveNewMemberBtn = document.getElementById('btn-save-new-member');
    if (saveNewMemberBtn) {
      saveNewMemberBtn.addEventListener('click', () => {
        const name = document.getElementById('new-member-name').value;
        const role = document.getElementById('new-member-role').value;
        const avatar = document.getElementById('new-member-avatar').value;

        if (name && name.trim()) {
          const newMem = this.familyManager.addMember(name.trim(), role, avatar);
          this.familyManager.setActiveMember(newMem.id);
          addMemberModal.classList.remove('active');
          document.getElementById('new-member-name').value = '';
          sacredAudio.playCelebration();
          this.showToast('🌸 Member Added', `${name} has joined our sacred family circle!`);
          this.render();
        }
      });
    }
  }

  setupSettingsControls() {
    // Google Sign-In button
    const googleBtn = document.getElementById('btn-google-signin');
    if (googleBtn) {
      googleBtn.addEventListener('click', () => {
        this.cloudSync.signIn();
      });
    }

    const signoutBtn = document.getElementById('btn-google-signout');
    if (signoutBtn) {
      signoutBtn.addEventListener('click', () => {
        this.cloudSync.signOut();
        this.render();
      });
    }

    // Save Apps Script Webhook URL
    const gasBtn = document.getElementById('btn-save-gas-url');
    const gasInput = document.getElementById('gas-url-input');
    if (gasBtn && gasInput) {
      gasInput.value = this.cloudSync.appsScriptUrl || '';
      gasBtn.addEventListener('click', async () => {
        this.cloudSync.setAppsScriptUrl(gasInput.value);
        const success = await this.cloudSync.pushViaAppsScript(this.familyManager.data);
        if (success) {
          this.showToast('☁️ Sync Connected', 'Google Apps Script Webhook is active and syncing!');
        } else {
          this.showToast('⚠️ Webhook Saved', 'URL saved. Verify Apps Script deployment permissions if needed.');
        }
        this.render();
      });
    }

    // Save timeline start & end dates
    const saveDatesBtn = document.getElementById('btn-save-settings-dates');
    if (saveDatesBtn) {
      saveDatesBtn.addEventListener('click', () => {
        const start = document.getElementById('settings-start-date').value;
        const end = document.getElementById('settings-end-date').value;
        if (start && end) {
          this.familyManager.updateSettings({ startDateStr: start, endDateStr: end });
          this.scheduleEngine.updateDates(start, end);
          this.showToast('📅 Dates Saved', 'Curriculum timeline updated!');
          this.render();
        }
      });
    }
  }

  // Master Render
  render() {
    this.renderHeader();
    this.updateTimeAwareBanner();
    this.renderDashboardStats();
    this.renderScriptureCards();
    this.renderCalendarDateView();
    this.renderCatchUpEstimator();
    this.renderBadgesTab();
    this.renderFamilyCircle();
    this.renderSettingsTab();
  }

  renderHeader() {
    const members = this.familyManager.getMembers();
    const active = this.familyManager.getActiveMember();

    // Populate Member dropdown
    const select = document.getElementById('member-select');
    if (select) {
      select.innerHTML = '';
      members.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = `${m.avatar || '🪔'} ${m.name} (${m.role})`;
        if (m.id === active.id) opt.selected = true;
        select.appendChild(opt);
      });
    }

    const avatarEl = document.getElementById('header-member-avatar');
    if (avatarEl && active) {
      avatarEl.textContent = active.avatar || '🪔';
    }

    const streakBadge = document.getElementById('header-streak-badge');
    if (streakBadge && active) {
      streakBadge.innerHTML = `🔥 ${active.streak || 0} Day Streak`;
    }
  }

  updateTimeAwareBanner() {
    const active = this.familyManager.getActiveMember();
    const evalResult = this.scheduleEngine.evaluateIndividualProgress(active ? active.progress : {});
    const prompt = reminderManager.getHeroPrompt(active, evalResult);

    const iconEl = document.getElementById('nudge-icon');
    const tagEl = document.getElementById('nudge-window-tag');
    const msgEl = document.getElementById('nudge-msg');
    const subEl = document.getElementById('nudge-sub');

    if (iconEl) iconEl.textContent = prompt.icon;
    if (tagEl) tagEl.textContent = prompt.title;
    if (msgEl) msgEl.textContent = prompt.message;
    if (subEl) {
      subEl.textContent = `Today's pace: ${evalResult.requiredDailyPace} shlokas/day (~${evalResult.estimatedDailyMins} mins)`;
    }
  }

  renderDashboardStats() {
    const active = this.familyManager.getActiveMember();
    if (!active) return;

    const total = this.familyManager.getMemberTotalMemorized(active);
    const level = getSacredLevel(total);

    const shlokasEl = document.getElementById('stat-total-shlokas');
    if (shlokasEl) shlokasEl.textContent = `${total} / ${TOTAL_CURRICULUM_SHLOKAS}`;

    const streakEl = document.getElementById('stat-current-streak');
    if (streakEl) streakEl.textContent = `${active.streak || 0} Days`;

    const longestStreakEl = document.getElementById('stat-longest-streak');
    if (longestStreakEl) longestStreakEl.textContent = active.longestStreak || active.streak || 0;

    const levelEl = document.getElementById('stat-sacred-level');
    if (levelEl) levelEl.textContent = `${level.icon} ${level.sanskrit}`;

    const levelDescEl = document.getElementById('stat-sacred-desc');
    if (levelDescEl) levelDescEl.textContent = `Level ${level.level} · ${level.title}`;

    const shieldsEl = document.getElementById('stat-shields-count');
    if (shieldsEl) shieldsEl.textContent = `${active.streakShields || 1} Shield`;

    // Quick catch-up summary card in dashboard
    const evalResult = this.scheduleEngine.evaluateIndividualProgress(active.progress);
    const quickBox = document.getElementById('quick-catchup-summary');
    if (quickBox) {
      const isBehind = evalResult.overallStatus === 'BEHIND';
      const isAhead = evalResult.overallStatus === 'AHEAD';

      quickBox.className = `catchup-card ${isBehind ? 'status-behind' : (isAhead ? 'status-ahead' : '')}`;
      quickBox.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">
              Sadhana Pace Health
            </div>
            <div style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; margin-top: 2px;">
              ${evalResult.healthIcon} ${evalResult.healthLabel}
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
              ${evalResult.healthDesc}
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary);">
              ${evalResult.requiredDailyPace} <span style="font-size: 0.85rem; font-weight: 600;">shlokas / day</span>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">
              ≈ ${evalResult.estimatedDailyMins} mins practice daily
            </div>
          </div>
        </div>
      `;
    }
  }

  renderScriptureCards() {
    const active = this.familyManager.getActiveMember();
    if (!active) return;

    const containers = [
      document.getElementById('dashboard-scriptures-grid'),
      document.getElementById('full-scriptures-grid')
    ];

    containers.forEach(container => {
      if (!container) return;
      container.innerHTML = '';

      SCRIPTURES.forEach(s => {
        const completed = active.progress[s.id] || 0;
        const pct = Math.min(100, Math.round((completed / s.totalShlokas) * 100));

        const card = document.createElement('div');
        card.className = 'scripture-card';
        card.innerHTML = `
          <div>
            <div class="card-top">
              <div class="scripture-avatar" style="background: ${s.color}15; border: 1px solid ${s.color}35;">
                ${s.icon}
              </div>
              <div class="scripture-info">
                <h3>${s.title}</h3>
                <div class="devanagari">${s.titleDevanagari}</div>
                <div class="subtitle">${s.subtitle}</div>
              </div>
            </div>

            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width: ${pct}%; background: ${s.color};"></div>
            </div>

            <div class="progress-meta">
              <span><strong>${completed}</strong> / ${s.totalShlokas} Verses</span>
              <span>${pct}% Memorized</span>
            </div>
          </div>

          <div class="action-row">
            <button class="btn-advance btn-advance-shloka" data-id="${s.id}" data-title="${s.title}">
              ➕ Memorized +1
            </button>
            <button class="btn-edit-count btn-exact-shloka" data-id="${s.id}" data-title="${s.title}" data-max="${s.totalShlokas}" data-curr="${completed}">
              ✏️ Set Exact
            </button>
          </div>
        `;
        container.appendChild(card);
      });
    });

    // Attach button handlers
    document.querySelectorAll('.btn-advance-shloka').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const title = e.currentTarget.getAttribute('data-title');
        this.openAdvanceModal(id, title);
      });
    });

    document.querySelectorAll('.btn-exact-shloka').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const title = e.currentTarget.getAttribute('data-title');
        const max = e.currentTarget.getAttribute('data-max');
        const curr = e.currentTarget.getAttribute('data-curr');
        this.openExactModal(id, title, max, curr);
      });
    });
  }

  openAdvanceModal(scriptureId, title) {
    this.activeModalScriptureId = scriptureId;
    const modal = document.getElementById('modal-log-shlokas');
    const titleEl = document.getElementById('modal-scripture-name');
    if (titleEl) titleEl.textContent = `📖 Log Shlokas: ${title}`;
    if (modal) modal.classList.add('active');
  }

  openExactModal(scriptureId, title, max, current) {
    this.activeModalScriptureId = scriptureId;
    const modal = document.getElementById('modal-set-exact');
    const titleEl = document.getElementById('modal-exact-title');
    const countInput = document.getElementById('modal-exact-count');
    const hint = document.getElementById('modal-exact-max-hint');

    if (titleEl) titleEl.textContent = `✏️ Set Exact: ${title}`;
    if (countInput) {
      countInput.value = current;
      countInput.max = max;
    }
    if (hint) hint.textContent = `Max shlokas: ${max}`;
    if (modal) modal.classList.add('active');
  }

  renderCalendarDateView() {
    const dateStr = this.selectedCalendarDate;
    const active = this.familyManager.getActiveMember();
    if (!active) return;

    const allocation = this.scheduleEngine.getAllocationForDate(dateStr);
    const evalResult = this.scheduleEngine.evaluateIndividualProgress(active.progress, dateStr);

    // Inspector Header
    const headerEl = document.getElementById('date-inspector-header');
    if (headerEl) {
      const isPast = allocation.isPast;
      const isFuture = allocation.isFuture;
      const isToday = allocation.isToday;

      let dateTag = '📅 Target Date';
      if (isToday) dateTag = '📍 Today\'s Active Sadhana';
      else if (isPast) dateTag = '⏪ Past Archive';
      else if (isFuture) dateTag = '⏩ Future Roadmap Target';

      headerEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; background: #fafafa; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px 18px;">
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--primary);">${dateTag}</div>
            <div style="font-family: var(--font-serif); font-size: 1.2rem; font-weight: 700;">
              ${dateStr} · Day ${allocation.dayIndex} of ${allocation.totalDays}
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Expected Cumulative Progress:</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-main);">
              ${allocation.expectedCumulative} / ${TOTAL_CURRICULUM_SHLOKAS} Shlokas
            </div>
          </div>
        </div>
      `;
    }

    // Syllabus list for selected date
    const listEl = document.getElementById('date-syllabus-list');
    if (listEl) {
      listEl.innerHTML = '';
      allocation.scriptureAllocations.forEach(item => {
        const completed = active.progress[item.scriptureId] || 0;
        const diff = completed - item.expectedCumulative;

        let statusBadge = '<span class="status-badge badge-ontrack">On Track</span>';
        if (diff >= 3) statusBadge = `<span class="status-badge badge-ahead">+${diff} Ahead</span>`;
        else if (diff <= -3) statusBadge = `<span class="status-badge badge-behind">${Math.abs(diff)} Behind</span>`;

        const card = document.createElement('div');
        card.className = 'syllabus-item-card';
        card.innerHTML = `
          <div class="syllabus-item-title">
            <span>${item.icon}</span>
            <span>${item.shortTitle}</span>
            <span style="margin-left: auto;">${statusBadge}</span>
          </div>
          <div class="syllabus-item-detail">
            ${item.chapterName ? `${item.chapterName}: ` : ''}${item.verseRangeText}
          </div>
          <div class="syllabus-item-meta" style="margin-top: 6px; display: flex; justify-content: space-between;">
            <span>Expected: ${item.expectedCumulative} / ${item.totalShlokas}</span>
            <span>Achieved: <strong>${completed}</strong></span>
          </div>
        `;
        listEl.appendChild(card);
      });
    }
  }

  renderCatchUpEstimator() {
    const active = this.familyManager.getActiveMember();
    if (!active) return;

    const res = this.scheduleEngine.evaluateIndividualProgress(active.progress);

    const badge = document.getElementById('catchup-status-badge');
    if (badge) {
      badge.className = `status-badge ${res.overallStatus === 'AHEAD' ? 'badge-ahead' : (res.overallStatus === 'BEHIND' ? 'badge-behind' : 'badge-ontrack')}`;
      badge.textContent = res.overallStatus === 'AHEAD' ? `🚀 ${Math.abs(res.overallDelta)} SHLOKAS AHEAD` : (res.overallStatus === 'BEHIND' ? `⏳ ${Math.abs(res.overallDelta)} SHLOKAS BEHIND` : '🎯 ON TRACK');
    }

    const remDays = document.getElementById('metric-remaining-days');
    if (remDays) remDays.textContent = res.remainingDays;

    const remShlokas = document.getElementById('metric-remaining-shlokas');
    if (remShlokas) remShlokas.textContent = TOTAL_CURRICULUM_SHLOKAS - res.totalCompleted;

    const reqPace = document.getElementById('metric-required-pace');
    if (reqPace) reqPace.textContent = res.requiredDailyPace;

    const estMins = document.getElementById('metric-estimated-mins');
    if (estMins) estMins.textContent = `${res.estimatedDailyMins}m`;

    const gaugeBox = document.getElementById('health-gauge-box');
    const gaugeTitle = document.getElementById('health-gauge-title');
    const gaugeDesc = document.getElementById('health-gauge-desc');
    const rebaselineBtn = document.getElementById('btn-rebaseline-open');

    if (gaugeBox) gaugeBox.className = `health-gauge-banner gauge-${res.healthGauge}`;
    if (gaugeTitle) gaugeTitle.innerHTML = `${res.healthIcon} ${res.healthLabel}`;
    if (gaugeDesc) gaugeDesc.textContent = res.healthDesc;

    if (rebaselineBtn) {
      if (res.healthGauge === 'overburdened') {
        rebaselineBtn.style.display = 'block';
        rebaselineBtn.textContent = `Extend Target Date to ${res.realisticEndDate}`;
        rebaselineBtn.onclick = () => {
          this.familyManager.updateSettings({ endDateStr: res.realisticEndDate });
          this.scheduleEngine.updateDates(this.scheduleEngine.startDateStr, res.realisticEndDate);
          this.showToast('✅ Re-baseline Successful', `Target extended to ${res.realisticEndDate} for peaceful chanting!`);
          this.render();
        };
      } else {
        rebaselineBtn.style.display = 'none';
      }
    }

    // Granular Breakdown per Scripture
    const breakdownContainer = document.getElementById('catchup-scriptures-breakdown');
    if (breakdownContainer) {
      breakdownContainer.innerHTML = '';
      Object.values(res.scriptureBreakdown).forEach(item => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.padding = '10px 14px';
        row.style.background = '#f9fafb';
        row.style.borderRadius = '8px';
        row.style.border = '1px solid var(--border-light)';

        row.innerHTML = `
          <div>
            <div style="font-weight: 700; font-size: 0.95rem;">${item.title}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">
              Memorized: ${item.completed} / ${item.total} (Remaining: ${item.remaining})
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 800; color: var(--primary); font-size: 1.1rem;">
              ${item.requiredDailyPace} <span style="font-size: 0.75rem;">verses/day</span>
            </div>
          </div>
        `;
        breakdownContainer.appendChild(row);
      });
    }
  }

  renderBadgesTab() {
    const active = this.familyManager.getActiveMember();
    if (!active) return;

    const total = this.familyManager.getMemberTotalMemorized(active);
    const currentLevel = getSacredLevel(total);
    const nextLevel = getNextSacredLevel(total);

    const iconEl = document.getElementById('badges-level-icon');
    const sansEl = document.getElementById('badges-level-sanskrit');
    const titleEl = document.getElementById('badges-level-title');
    const progEl = document.getElementById('badges-level-progress');

    if (iconEl) iconEl.textContent = currentLevel.icon;
    if (sansEl) sansEl.textContent = currentLevel.sanskrit;
    if (titleEl) titleEl.textContent = `Level ${currentLevel.level} · ${currentLevel.title}`;
    if (progEl) {
      if (nextLevel) {
        progEl.textContent = `${total} of ${nextLevel.minShlokas} verses memorized to unlock Level ${nextLevel.level}: ${nextLevel.sanskrit}`;
      } else {
        progEl.textContent = `🌟 Supreme Master of Memory Achieved! Complete 1,708 Shlokas Mastered!`;
      }
    }

    // Render 20-shloka micro badges
    const grid = document.getElementById('micro-badges-grid');
    if (!grid) return;
    grid.innerHTML = '';

    SCRIPTURES.forEach(s => {
      const scriptureBadges = SCRIPTURE_MICRO_BADGES[s.id] || [];
      const userProgress = active.progress[s.id] || 0;

      scriptureBadges.forEach(b => {
        const isUnlocked = userProgress >= b.shlokas;
        const item = document.createElement('div');
        item.className = `badge-item ${isUnlocked ? 'unlocked' : 'locked'}`;
        item.title = b.desc;
        item.innerHTML = `
          <div class="badge-icon-lg">${b.icon}</div>
          <div class="badge-name">${b.title}</div>
          <div class="badge-sanskrit">${s.shortTitle} · ${b.shlokas}v</div>
          <div class="badge-desc">${isUnlocked ? '✨ UNLOCKED' : `🔒 Memorize ${b.shlokas} verses`}</div>
        `;
        grid.appendChild(item);
      });
    });
  }

  renderFamilyCircle() {
    const stats = this.familyManager.getFamilyCollectiveStats();

    const shlokasEl = document.getElementById('family-total-shlokas');
    if (shlokasEl) shlokasEl.textContent = stats.totalFamilyShlokas;

    const hoursEl = document.getElementById('family-total-hours');
    if (hoursEl) hoursEl.textContent = `${stats.totalFamilyHours}h`;

    const streakEl = document.getElementById('family-max-streak');
    if (streakEl) streakEl.textContent = `${stats.maxActiveStreak} Days`;

    // Render non-judgmental cards
    const container = document.getElementById('family-members-cards-container');
    if (!container) return;
    container.innerHTML = '';

    stats.membersSummary.forEach(m => {
      const card = document.createElement('div');
      card.className = 'family-member-card';
      card.innerHTML = `
        <div class="member-avatar-lg" style="border-color: ${m.color};">
          ${m.avatar}
        </div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--text-main);">${m.name}</h3>
            <span style="font-size: 0.8rem; font-weight: 700; color: #ef4444;">🔥 ${m.streak}d streak</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--primary); font-weight: 600;">
            ${m.levelIcon} ${m.levelSanskrit} (${m.levelTitle})
          </div>
          <div class="progress-bar-container" style="margin: 8px 0 4px 0;">
            <div class="progress-bar-fill" style="width: ${m.percentCompleted}%; background: ${m.color};"></div>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; justify-content: space-between;">
            <span>${m.totalMemorized} shlokas memorized</span>
            <span>${m.percentCompleted}%</span>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  renderSettingsTab() {
    const settings = this.familyManager.getSettings();
    const startInput = document.getElementById('settings-start-date');
    const endInput = document.getElementById('settings-end-date');

    if (startInput) startInput.value = settings.startDateStr || '';
    if (endInput) endInput.value = settings.endDateStr || '';

    const statusEl = document.getElementById('sync-status-indicator');
    const signinBtn = document.getElementById('btn-google-signin');
    const signoutBtn = document.getElementById('btn-google-signout');

    if (statusEl) {
      if (this.cloudSync.accessToken) {
        statusEl.textContent = `🟢 Connected to Google Drive (Sheet ID: ${this.cloudSync.spreadsheetId || 'Provisioning...'})`;
        statusEl.style.color = '#059669';
        if (signinBtn) signinBtn.style.display = 'none';
        if (signoutBtn) signoutBtn.style.display = 'inline-block';
      } else if (this.cloudSync.appsScriptUrl) {
        statusEl.textContent = `🟢 Synced via Apps Script Webhook`;
        statusEl.style.color = '#059669';
      } else {
        statusEl.textContent = `Status: Offline (Local Storage Cache)`;
        statusEl.style.color = 'var(--text-muted)';
        if (signinBtn) signinBtn.style.display = 'inline-block';
        if (signoutBtn) signoutBtn.style.display = 'none';
      }
    }
  }

  renderTabSpecifics(tabId) {
    if (tabId === 'calendar') this.renderCalendarDateView();
    if (tabId === 'catchup') this.renderCatchUpEstimator();
    if (tabId === 'badges') this.renderBadgesTab();
    if (tabId === 'family') this.renderFamilyCircle();
    if (tabId === 'settings') this.renderSettingsTab();
  }

  checkMilestoneUnlocks(scriptureId, newTotal) {
    const badges = SCRIPTURE_MICRO_BADGES[scriptureId] || [];
    const justUnlocked = badges.find(b => b.shlokas === newTotal);

    if (justUnlocked) {
      this.showToast(
        `🏆 Sacred Badge Unlocked!`,
        `${justUnlocked.icon} ${justUnlocked.title} (${justUnlocked.translit})! ${justUnlocked.desc}`
      );
    }
  }

  showToast(title, message) {
    const toast = document.getElementById('celebration-toast');
    const titleEl = document.getElementById('toast-title');
    const msgEl = document.getElementById('toast-message');

    if (toast && titleEl && msgEl) {
      titleEl.textContent = title;
      msgEl.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 5000);
    }
  }
}

// Instantiate application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});
