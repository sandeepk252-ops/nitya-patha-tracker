// Sacred Hindu Titles, Progression Levels & 20-Shloka Micro-Badges

export const SACRED_LEVELS = [
  { level: 1, title: 'The Seeker of Wisdom', sanskrit: 'जिज्ञासु', translit: 'Jijñāsu', minShlokas: 1, icon: '🌿', desc: 'Awakened the desire for sacred wisdom with your very first shloka!' },
  { level: 2, title: 'Diligent Practitioner', sanskrit: 'अभ्यासी', translit: 'Abhyāsī', minShlokas: 25, icon: '🪔', desc: 'Consistency rooted in regular practice. 25 sacred verses memorized!' },
  { level: 3, title: 'Dedicated Chanter', sanskrit: 'साधक', translit: 'Sādhaka', minShlokas: 75, icon: '🕉️', desc: 'A committed student of holy vibration with 75 verses memorized!' },
  { level: 4, title: 'Lover of Stotras', sanskrit: 'स्तोत्रप्रिय', translit: 'Stotra Priya', minShlokas: 150, icon: '🌸', desc: 'Deep devotion blooming in the heart with 150 verses memorized!' },
  { level: 5, title: 'Bearer of Inner Light', sanskrit: 'ज्ञानदीपक', translit: 'Jñāna Dīpaka', minShlokas: 350, icon: '🕯️', desc: 'The lamp of sacred wisdom illuminates your mind with 350 verses!' },
  { level: 6, title: 'Master of Sacred Eloquence', sanskrit: 'वाग्मी', translit: 'Vāgmī', minShlokas: 700, icon: '📿', desc: 'Mastery over the sacred sounds of Sanskrit with 700 verses!' },
  { level: 7, title: 'Scholar of Sacred Texts', sanskrit: 'शास्त्रज्ञ', translit: 'Śāstrajña', minShlokas: 1100, icon: '📜', desc: 'Profound learning and sacred memory with 1,100 verses memorized!' },
  { level: 8, title: 'Lion of Vedanta', sanskrit: 'वेदान्तकेसरी', translit: 'Vedānta Kesarī', minShlokas: 1500, icon: '🦁', desc: 'Unshakable spiritual strength and wisdom with 1,500 verses!' },
  { level: 9, title: 'Master of Sacred Memory', sanskrit: 'कण्ठस्थ आचार्य', translit: 'Kaṇṭhastha Ācārya', minShlokas: 1708, icon: '👑', desc: 'Magnificent achievement! Complete memorization of all 1,708 sacred verses!' }
];

export const STREAK_MILESTONES = [
  { days: 3, title: 'आरम्भ (Tridina Aarambha)', icon: '🌱', desc: '3 consecutive days of steady sadhana!' },
  { days: 7, title: 'सप्ताह साधक (Sapthaha Sadhaka)', icon: '🔥', desc: '7 unbroken days of sacred dedication!' },
  { days: 14, title: 'द्विपक्ष नियम (Dvipaksha Niyama)', icon: '⚡', desc: '2 continuous weeks of unwavering devotion!' },
  { days: 21, title: 'एकविंशति अनुष्ठान (21-Day Anushthana)', icon: '🪔', desc: '21 days of consecrated habit formation!' },
  { days: 40, title: 'मण्डल तपस्वी (Mandala Tapasvi)', icon: '🌕', desc: 'Full 40-day sacred mandala completed!' },
  { days: 108, title: 'अष्टोत्तरशत महातपस् (108 Days Mahatapas)', icon: '👑', desc: 'Divine milestone of 108 unbroken days!' }
];

// 20-Shloka Micro Badges mapped per scripture
export const SCRIPTURE_MICRO_BADGES = {
  bhagavad_gita: [
    { shlokas: 20, title: 'गाण्डीव दीक्षा', translit: 'Gāṇḍīva Dīkṣā', icon: '🏹', desc: 'Awakening the Divine Bow of Focus (Ch 1)' },
    { shlokas: 40, title: 'स्थितप्रज्ञ', translit: 'Sthitaprajña', icon: '🪔', desc: 'Equanimous Mind & Supreme Stillness (Ch 2)' },
    { shlokas: 60, title: 'कर्मयोगिन्', translit: 'Karmayogin', icon: '⚙️', desc: 'Master of Selfless Dedicated Action (Ch 3)' },
    { shlokas: 80, title: 'ज्ञानयज्ञ', translit: 'Jñānayajña', icon: '🔥', desc: 'Fire of Sacred Knowledge (Ch 4)' },
    { shlokas: 100, title: 'शतश्लोकी गीता', translit: 'Gita Śatakam', icon: '🌟', desc: 'Century of Divine Wisdom (Ch 5)' },
    { shlokas: 120, title: 'आत्मसंयम', translit: 'Ātmasamyama', icon: '🧘', desc: 'Master of Meditation & Mind Stillness (Ch 6)' },
    { shlokas: 140, title: 'ज्ञानविज्ञान', translit: 'Jñāna Vijñāna', icon: '☀️', desc: 'Wisdom & Experiential Realization (Ch 7)' },
    { shlokas: 160, title: 'अक्षरब्रह्म', translit: 'Akṣara Brahma', icon: '🌌', desc: 'The Imperishable Omnipresence (Ch 8)' },
    { shlokas: 180, title: 'राजविद्या', translit: 'Rājavidyā', icon: '👑', desc: 'Sovereign Mystery & Royal Science (Ch 9)' },
    { shlokas: 200, title: 'दिव्यविभूति', translit: 'Divya Vibhūti', icon: '🌺', desc: 'Cosmic Divine Glories (Ch 10)' },
    { shlokas: 220, title: 'विश्वरूप', translit: 'Viśvarūpa', icon: '👁️', desc: 'The Cosmic Omniform Vision (Ch 11)' },
    { shlokas: 240, title: 'भक्तियोगी', translit: 'Bhaktiyogī', icon: '🪷', desc: 'Pure Heart of Absolute Devotion (Ch 12)' },
    { shlokas: 260, title: 'क्षेत्रक्षेत्रज्ञ', translit: 'Kṣetrajña', icon: '🌾', desc: 'Knower of the Sacred Field (Ch 13)' },
    { shlokas: 280, title: 'गुणातीत', translit: 'Guṇātīta', icon: '🕊️', desc: 'Transcending the Three Gunas (Ch 14)' },
    { shlokas: 300, title: 'पुरुषोत्तम', translit: 'Puruṣottama', icon: '🌲', desc: 'The Eternal Tree of Being (Ch 15)' },
    { shlokas: 350, title: 'दैवी सम्पद्', translit: 'Daivī Sampad', icon: '🛡️', desc: 'Divine Virtues & Fearlessness (Ch 16)' },
    { shlokas: 400, title: 'श्रद्धावान्', translit: 'Śraddhāvān', icon: '🕯️', desc: 'Threefold Pure Faith (Ch 17)' },
    { shlokas: 450, title: 'त्यागमूर्ति', translit: 'Tyāgamūrti', icon: '🌊', desc: 'The Glory of Renunciation' },
    { shlokas: 500, title: 'पञ्चशत गीता', translit: 'Pañcaśata Gita', icon: '💎', desc: '500 Verses of the Lord Chanted' },
    { shlokas: 550, title: 'ब्रह्मनिर्वाण', translit: 'Brahmanirvāṇa', icon: '✨', desc: 'Supreme Peace of the Absolute' },
    { shlokas: 600, title: 'शरणम्', translit: 'Śaraṇam', icon: '🚩', desc: 'Total Surrender to the Divine' },
    { shlokas: 650, title: 'धनुर्धर', translit: 'Dhanurdhara', icon: '🏹', desc: 'Victory where Krishna and Arjuna Unite' },
    { shlokas: 700, title: 'मोक्षसन्न्यास', translit: 'Mokṣa Sannyāsa', icon: '🏆', desc: 'Complete Master of Bhagavad Gita (700 Verses)!' }
  ],
  soundarya_lahari: [
    { shlokas: 20, title: 'शिवशक्तियुक्ता', translit: 'Śiva-Śakti Spark', icon: '🌸', desc: 'Primordial Balance of Supreme Energy (v. 1-20)' },
    { shlokas: 40, title: 'आनन्दसिन्धु', translit: 'Ānanda Sindhu', icon: '🌊', desc: 'Ocean of Kundalini Bliss (v. 21-40)' },
    { shlokas: 60, title: 'किरीटचन्द्र', translit: 'Kirīṭacandra', icon: '🌙', desc: 'Radiant Moon Diadem of the Mother (v. 41-60)' },
    { shlokas: 80, title: 'त्रिनयना', translit: 'Trinayanā', icon: '👁️', desc: 'The Grace of Divine Vision (v. 61-80)' },
    { shlokas: 100, title: 'सौन्दर्यरत्न', translit: 'Soundarya Ratna', icon: '👑', desc: 'Complete Master of Soundarya Lahari (100 Verses)!' }
  ],
  sivananda_lahari: [
    { shlokas: 20, title: 'पशुपति पद', translit: 'Paśupati Pada', icon: '🔱', desc: 'Refuge at Lord Shiva’s Lotus Feet (v. 1-20)' },
    { shlokas: 40, title: 'विल्वार्चन', translit: 'Bilvārcana', icon: '🌿', desc: 'Fragrant Senses Purified in Devotion (v. 21-40)' },
    { shlokas: 60, title: 'नटराज ध्यान', translit: 'Naṭarāja Dhyāna', icon: '📿', desc: 'The Inner Cosmic Dance of Bliss (v. 41-60)' },
    { shlokas: 80, title: 'सोमशेखर', translit: 'Somaśekhara', icon: '🕯️', desc: 'Bearer of Serene Stillness (v. 61-80)' },
    { shlokas: 100, title: 'शिवानन्द निधि', translit: 'Śivānanda Nidhi', icon: '💎', desc: 'Complete Master of Sivananda Lahari (100 Verses)!' }
  ],
  shatashloki_ramayana: [
    { shlokas: 20, title: 'बाललीला', translit: 'Bāla Līlā', icon: '🏹', desc: 'The Virtuous Prince of Ayodhya (v. 1-20)' },
    { shlokas: 40, title: 'सत्यप्रतिज्ञ', translit: 'Satyapratijña', icon: '🌳', desc: 'Upholder of Truth in the Forest (v. 21-40)' },
    { shlokas: 60, title: 'सुग्रीवसख्य', translit: 'Sugrīva Sakhya', icon: '🤝', desc: 'Sacred Alliance of Dharma (v. 41-60)' },
    { shlokas: 80, title: 'सेतुबन्धन', translit: 'Setu Bandhana', icon: '🌊', desc: 'Bridge of Faith Across the Ocean (v. 61-80)' },
    { shlokas: 100, title: 'रामपट्टाभिषेक', translit: 'Rāma Paṭṭābhiṣeka', icon: '👑', desc: 'Complete Master of Shatashloki Ramayana (100 Verses)!' }
  ],
  vishnu_sahasranama: [
    { shlokas: 20, title: 'पद्मनाभ', translit: 'Padmanābha', icon: '🪷', desc: 'The Divine Origin of Creation (v. 1-20)' },
    { shlokas: 40, title: 'शङ्खचक्रधर', translit: 'Śaṅkha-Cakra-Dhara', icon: '🛡️', desc: 'Protector of Righteousness (v. 21-40)' },
    { shlokas: 60, title: 'पुरुषोत्तम', translit: 'Puruṣottama', icon: '⚡', desc: 'The Highest Transcendental Being (v. 41-60)' },
    { shlokas: 80, title: 'विश्वरूप', translit: 'Viśvarūpa', icon: '🌌', desc: 'Cosmic Radiance of Mahavishnu (v. 61-80)' },
    { shlokas: 100, title: 'शतनामावलि', translit: 'Śatanāmāvali', icon: '📿', desc: '100 Verses of Thousand Holy Names (v. 81-100)' },
    { shlokas: 108, title: 'सर्वपापहर', translit: 'Sarvapāpahara', icon: '🏆', desc: 'Complete Master of Sri Vishnu Sahasranamam (108 Verses)!' }
  ],
  lalita_sahasranama: [
    { shlokas: 20, title: 'श्रीमाता', translit: 'Śrī Mātā', icon: '🌸', desc: 'The Auspicious Mother of the Cosmos (v. 1-20)' },
    { shlokas: 40, title: 'चिदग्निकुण्ड', translit: 'Chidagni Kuṇḍa', icon: '🔥', desc: 'Born of Pure Transcendental Consciousness (v. 21-40)' },
    { shlokas: 60, title: 'भण्डविनाशिनी', translit: 'Bhaṇḍa Vināśinī', icon: '🗡️', desc: 'Dispeller of All Inner Darkness (v. 41-60)' },
    { shlokas: 80, title: 'कुण्डलिनी कला', translit: 'Kuṇḍalinī Kalā', icon: '🌈', desc: 'Mother Awakening in Muladhara (v. 61-80)' },
    { shlokas: 100, title: 'शतनाममणि', translit: 'Śatanāmamaṇi', icon: '💎', desc: '100 Verses of Divine Mother Chanted (v. 81-100)' },
    { shlokas: 120, title: 'कामकला', translit: 'Kāmakalā', icon: '🌺', desc: 'Supreme Source of Divine Harmony (v. 101-120)' },
    { shlokas: 140, title: 'महाशक्ति', translit: 'Mahāśakti', icon: '📿', desc: 'All Powers Emanating from Devi (v. 121-140)' },
    { shlokas: 160, title: 'शान्तस्वरूपा', translit: 'Śāntasvarūpā', icon: '🕊️', desc: 'Embodiment of Supreme Inner Peace (v. 141-160)' },
    { shlokas: 183, title: 'ललितापरमेश्वरी', translit: 'Lalitā Parameśvarī', icon: '👑', desc: 'Complete Master of Sri Lalita Sahasranamam (183 Verses)!' }
  ],
  guru_gita: [
    { shlokas: 20, title: 'गुरुपादुका', translit: 'Guru Pādukā', icon: '🪔', desc: 'Refuge at the Holy Lotus Feet (v. 1-20)' },
    { shlokas: 40, title: 'गुरुप्रकाश', translit: 'Guru Prakāśa', icon: '☀️', desc: 'The Light that Dispels All Ignorance (v. 21-40)' },
    { shlokas: 60, title: 'अखण्डमण्डलाकार', translit: 'Akhaṇḍa Maṇḍalākāra', icon: '🌊', desc: 'Pervader of the Entire Universe (v. 41-60)' },
    { shlokas: 80, title: 'चिन्मय', translit: 'Cinmaya', icon: '🕉️', desc: 'Form of Pure Awareness (v. 61-80)' },
    { shlokas: 100, title: 'गुरुमन्त्र', translit: 'Guru Mantra Siddhi', icon: '💎', desc: '100 Verses of Guru Gita Mastered (v. 81-100)' },
    { shlokas: 120, title: 'मातृकान्यास', translit: 'Mātṛkā Nyāsa', icon: '📿', desc: 'Subtle Energy & Divine Syllables (v. 101-120)' },
    { shlokas: 140, title: 'ब्रह्मज्ञान', translit: 'Brahmajñāna', icon: '🕯️', desc: 'Direct Experience of the Inner Self (v. 121-140)' },
    { shlokas: 160, title: 'मोक्षप्रसाद', translit: 'Mokṣa Prasāda', icon: '🌿', desc: 'The Grace that Liberates (v. 141-160)' },
    { shlokas: 182, title: 'पूर्णगुरुगीता', translit: 'Pūrṇa Guru Gītā', icon: '👑', desc: 'Complete Master of Guru Gita (182 Verses)!' }
  ],
  kavachamanjari: [
    { shlokas: 14, title: 'विघ्नराज कवच', translit: 'Vighnarāja Kavaca', icon: '🐘', desc: 'Ganesha Armor for Protection & Success' },
    { shlokas: 47, title: 'शिवकवच', translit: 'Śiva Kavaca', icon: '🔱', desc: 'Trident Armor of Lord Shiva Mastered' },
    { shlokas: 89, title: 'नारायण वर्म', translit: 'Nārāyaṇa Varma', icon: '🪷', desc: 'Cosmic Armor of Lord Narayana Mastered' },
    { shlokas: 124, title: 'रामरक्षा', translit: 'Rāmarakṣā', icon: '🏹', desc: 'Unshakable Protective Stotra of Sri Rama' },
    { shlokas: 155, title: 'आदित्यहृदय', translit: 'Ādityahṛdaya', icon: '☀️', desc: 'Solar Energy & Victory Over All Obstacles' },
    { shlokas: 211, title: 'दुर्गाकवच', translit: 'Durgā Kavaca', icon: '⚔️', desc: 'Supreme Shield of Devi Chandi' },
    { shlokas: 235, title: 'वज्रपञ्जर मण्डित', translit: 'Vajrapañjara Maṇḍita', icon: '🏆', desc: 'Complete Master of Kavachamanjari (All 7 Kavachas)!' }
  ]
};

// Helper: Get active sacred level based on total memorized shlokas
export function getSacredLevel(totalShlokas) {
  let currentLevel = SACRED_LEVELS[0];
  for (const lvl of SACRED_LEVELS) {
    if (totalShlokas >= lvl.minShlokas) {
      currentLevel = lvl;
    } else {
      break;
    }
  }
  return currentLevel;
}

// Helper: Get next sacred level target
export function getNextSacredLevel(totalShlokas) {
  for (const lvl of SACRED_LEVELS) {
    if (totalShlokas < lvl.minShlokas) {
      return lvl;
    }
  }
  return null; // Top level reached!
}
