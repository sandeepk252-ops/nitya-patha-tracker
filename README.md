# 🪔 Nitya Patha: Real-Time Sanskrit Memorization Tracker

A complete, 100% free-forever, real-time collaborative web application designed to track individual and family memorization of **9 sacred Sanskrit scriptures** (2,744 shlokas total) within a customizable timeframe (default 10 months).

Backed permanently by **Google Sheets** and hosted on **GitHub Pages**, it requires zero paid databases, zero server costs, and zero subscription fees ($0.00 forever).

---

## 📜 The 9 Canonical Sanskrit Scriptures (2,744 Shlokas Total)

1. **Bhagavad Gita** (श्रीमद्भगवद्गीता) — 18 Chapters · **700 Verses**
2. **Narayaneeyam** (श्रीनारायणीयम्) — 100 Dasakams · **1,036 Shlokas** (Melpathur Narayana Bhattathiri)
3. **Sri Vishnu Sahasranamam** (श्रीविष्णुसहस्रनामस्तोत्रम्) — 108 Stotra Verses · **108 Shlokas**
4. **Sri Lalita Sahasranamam** (श्रीललितासहस्रनामस्तोत्रम्) — 183 Stotra Verses · **183 Shlokas**
5. **Guru Gita** (गुरुगीता) — 3 Adhyayas from Skanda Purana · **182 Shlokas**
6. **Soundaryalahari** (सौन्दर्यलहरी) — Ananda Lahari + Soundarya Lahari by Sri Adi Shankaracharya · **100 Shlokas**
7. **Sivanandalahari** (शिवानन्दलहरी) — 100 Devotional Verses to Lord Shiva by Sri Adi Shankaracharya · **100 Shlokas**
8. **Shatashloki Ramayana** (शतश्लोकी रामायणम्) — Complete Valmiki Ramayana Summary · **100 Shlokas**
9. **Kavachamanjari** (कवचमञ्जरी) — 7 Sacred Protective Armors (Ganesha, Shiva, Narayana, Rama Raksha, Aditya Hridaya, Durga, Skanda) · **235 Shlokas**

---

## 🌟 Key Features

### 1. 100% Individual Sadhana Experience
- All targets (1,708 shlokas) are **individual**. Every member of the family memorizes all scriptures independently.
- Quick 1-tap profile switcher in the header to jump between profiles.

### 2. Dynamic Catch-Up Rate & Realistic Daily Effort Estimator
- If you fall behind your 10-month deadline, the engine automatically recalculates:
  $$\text{Required Daily Pace} = \frac{\text{Remaining Shlokas}}{\text{Days Remaining}}$$
- Converts the required rate into **estimated daily chanting minutes** (new shlokas + retention revision).
- Color-coded **Health Gauge**:
  - 🟢 **Comfortable & Harmonious** (3–5 shlokas/day, ~25 mins)
  - 🟡 **Brisk Catch-Up** (6–8 shlokas/day, ~45 mins)
  - 🟠 **Intensive** (9–12 shlokas/day, ~65 mins)
  - 🔴 **Overburdened (>12 shlokas/day)** with a **1-Click Re-baseline** button to realistically adjust dates without stress.

### 3. Skip-to-Any-Date Calendar Inspector
- Jump to any past, present, or future date.
- Inspect the exact expected daily allocation of chapters/dasakams and shloka numbers.
- View real-time individual status: **Ahead (+N)**, **On Track**, or **Needs Catchup (-N)**.

### 4. Duolingo-Style Gamification & Sacred Hindu Titles
- **🔥 Sadhana Streaks**: Daily consistency counter with flame animations.
- **🛡️ "साधना रक्षा" (Streak Shield)**: 1 weekly freeze protection so busy school days or travel don't break hard-earned streaks.
- **9 Sacred Levels**: From **जिज्ञासु** (*Jijñāsu* - Seeker of Wisdom) up to **कण्ठस्थ आचार्य** (*Kaṇṭhastha Ācārya* - Master of Sacred Memory).
- **🏆 20-Shloka Micro-Badges**: Distinct unlockable sacred badges for every 20 shlokas memorized in each scripture!

### 5. Kid-Friendly Time-Aware Reminders
- Energetic, superhero-themed catchy prompts for elementary kids:
  - 🌅 **Morning (6:00 AM – 8:00 AM)**: *"Good morning, Shloka Hero! 🌟 Charge your Sanskrit superpower before school!"*
  - 🪔 **Evening (3:00 PM – 10:00 PM)**: *"Homework done, Shloka Champ? Let's unlock your next shiny badge before bedtime!"*
- 100% free browser Web Push notifications (zero paid SMS or servers).

### 6. Separate Family Circle Sanctuary
- Kept in its own dedicated navigation tab to protect members from demotivating comparisons or unhealthy competition.
- Highlights collective household milestones (e.g., *"Our Family has recited 2,400 cumulative shlokas!"*).

---

## 🚀 Free Deployment Guide (GitHub Pages)

This project has **zero build steps** and runs directly in any modern browser:

### Step 1: Push Code to GitHub
Run the following commands inside this repository:
```bash
git init
git add .
git commit -m "Initial commit: Nitya Patha Sanskrit Memorization Tracker"
git branch -M main
git remote add origin https://github.com/sandeepk252-ops/nitya-patha-tracker.git
git push -u origin main
```

### Step 2: Activate GitHub Pages (100% Free Forever)
1. Open your repository on GitHub: `https://github.com/sandeepk252-ops/nitya-patha-tracker`
2. Click **Settings** > **Pages** (in the left sidebar).
3. Under **Branch**, select `main` and folder `/ (root)`.
4. Click **Save**.
5. Within 1 minute, your app is live 24/7 at:
   👉 **`https://sandeepk252-ops.github.io/nitya-patha-tracker/`**

---

## ⚙️ Google Sheets Cloud Backend Setup

### Option A: Direct Google OAuth (Google Identity Services)
1. Your Google Client ID is already embedded in the app:
   `412232690127-f121e1ujes9gs5snu93s30ulguvtk8la.apps.googleusercontent.com`
2. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Open your OAuth 2.0 Client ID.
   - Under **Authorized JavaScript origins**, add:
     - `https://sandeepk252-ops.github.io`
     - `http://localhost:8000` (for local development)
3. Open the app and click **"🔑 Sign in with Google"** in Settings.
4. The app automatically creates a sheet named **`Nitya Patha - Sanskrit Progress Tracker`** in your personal Google Drive and syncs bidirectionally!

### Option B: Google Apps Script Webhook (Zero Login for Kids' Tablets)
If kids' tablets or family members do not have Google accounts logged in:
1. Open [Google Drive](https://drive.google.com) > Create a new Google Sheet.
2. Click **Extensions** > **Apps Script**.
3. Copy and paste the entire code from `google-sheets-script.gs`.
4. Click **Deploy** > **New Deployment** > Select type: **Web App**.
5. Set:
   - **Execute as**: *Me*
   - **Who has access**: *Anyone*
6. Click **Deploy**, authorize permissions, and copy the Web App URL (`https://script.google.com/macros/s/.../exec`).
7. Paste this URL into the app under **Settings** > **Method 2: Google Apps Script Webhook**.
8. All family devices now sync automatically with zero manual login!
