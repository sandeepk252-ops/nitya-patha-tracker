// Time-Aware Kid-Friendly Reminders, Auspicious Windows & Browser Notifications

export class ReminderManager {
  constructor() {
    this.morningStartHour = 6;
    this.morningEndHour = 8;
    this.eveningStartHour = 15; // 3 PM
    this.eveningEndHour = 22;   // 10 PM
  }

  // Determine current time window
  getCurrentWindow() {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= this.morningStartHour && hour < this.morningEndHour) {
      return 'MORNING';
    } else if (hour >= this.eveningStartHour && hour <= this.eveningEndHour) {
      return 'EVENING';
    } else {
      return 'MIDDAY';
    }
  }

  // Get dynamic, playful kid-friendly prompt tailored for the active member
  getHeroPrompt(activeMember, progressEvaluation) {
    const window = this.getCurrentWindow();
    const name = activeMember ? activeMember.name : 'Hero';
    const isBehind = progressEvaluation && progressEvaluation.overallStatus === 'BEHIND';

    if (isBehind) {
      const behindQuotes = [
        `🎈 Oopsie, missed a day, ${name}? No worries at all! You are our comeback champ — let's chant 2 verses together!`,
        `🛡️ Sadhana Shield is protecting your streak, ${name}! A quick 5-minute chant today gets you right back on track!`,
        `🌟 Come on, Little Veer ${name}! Just 3 extra shlokas today and your score will be super sparkly! ✨`,
        `🏹 Focus like Arjuna, ${name}! Grab your bow and conquer today's target with a big smile! 🎯`
      ];
      return {
        type: 'BEHIND_NUDGE',
        icon: '🛡️',
        title: 'Comeback Power!',
        message: behindQuotes[Math.floor(Math.random() * behindQuotes.length)],
        urgency: 'medium'
      };
    }

    if (window === 'MORNING') {
      const morningQuotes = [
        `🚀 Good morning, Super Shloka Hero ${name}! 🌟 Your Sanskrit superpower is waiting — let's learn today's new verse!`,
        `🦁 Rise and shine, Little Veer ${name}! I missed you! Just 2 fun shlokas before school to charge your brain battery! ⚡`,
        `🏹 Good morning, Little Arjuna! Grab your bow of focus — time for 5 magical minutes of chanting! 🎯`,
        `☀️ Hey ${name}! 🦜 Your shloka companions missed you all night! Let's power up with today's verse!`
      ];
      return {
        type: 'MORNING_SADHANA',
        icon: '🌅',
        title: 'Morning Superpower Window (6 AM – 8 AM)',
        message: morningQuotes[Math.floor(Math.random() * morningQuotes.length)],
        urgency: 'high'
      };
    } else if (window === 'EVENING') {
      const eveningQuotes = [
        `🦚 I'm missing you, Shloka Champion ${name}! 🪔 Homework done? Let's unlock your next shiny badge!`,
        `🐒 Jai Hanuman! 🚩 Jump in for a quick 10-minute chant with ${name} — keep that fire streak blazing! 🔥`,
        `🐘 Lord Ganesha says: You're doing amazing, ${name}! 🌸 A quick 5-minute chant gives you mega wisdom points!`,
        `👑 Knock knock! Who's there? Your next awesome badge! Let's conquer 2 new shlokas before bedtime! 📖`,
        `🌟 Psst ${name}... your streak flame is getting sleepy! Feed it with today's shlokas and keep it burning bright! 🔥`
      ];
      return {
        type: 'EVENING_QUEST',
        icon: '🪔',
        title: 'Evening Quest Window (3 PM – 10 PM)',
        message: eveningQuotes[Math.floor(Math.random() * eveningQuotes.length)],
        urgency: 'high'
      };
    } else {
      return {
        type: 'MIDDAY_PEACE',
        icon: '🌿',
        title: 'Sanctuary of Peace',
        message: `Welcome back, ${name}! Take a peaceful breath. Review your previously learned shlokas or prepare for evening chanting.`,
        urgency: 'low'
      };
    }
  }

  // Request browser notification permission (100% Free)
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      return { supported: false, granted: false };
    }
    if (Notification.permission === 'granted') {
      return { supported: true, granted: true };
    }
    try {
      const permission = await Notification.requestPermission();
      return { supported: true, granted: permission === 'granted' };
    } catch (e) {
      return { supported: true, granted: false };
    }
  }

  // Send local browser notification
  sendNotification(title, body, icon = '🪔') {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return false;
    }
    try {
      new Notification(title, {
        body,
        icon: 'assets/logo.svg',
        tag: 'nitya-patha-reminder',
        renotify: true
      });
      return true;
    } catch (e) {
      console.warn("Notification error:", e);
      return false;
    }
  }
}

export const reminderManager = new ReminderManager();
