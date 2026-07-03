// dashboard.js - Page-Specific Logic for Wellness Dashboard (index.html)

// --- Helper to Retrieve User Name ---
function getUserName() {
    let userName = localStorage.getItem('userWellnessName');
    if (!userName) {
        userName = 'Mindful Achiever';
        localStorage.setItem('userWellnessName', userName);
    }
    return userName;
}

// --- Dynamic Greeting Clock Logic ---
function getGreetingKey() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
}

// --- Translation Dictionary ---
const i18n = {
    en: {
        navHome: "Home", navJournal: "Journal Timer", navBreathe: "Breathe", navTracker: "Tracker", navArchive: "Archive", navSettings: "Settings",
        morning: "Good Morning.", afternoon: "Good Afternoon.", evening: "Good Evening.",
        sub: "Welcome back",
        c1Title: "Journal", c1Desc: "15-minute guided reset",
        c2Title: "Breathe", c2Desc: "Quick calming exercises",
        c3Title: "Tracker", c3Desc: "Log your energy today",
        quote: "\"You are exactly where you need to be.\""
    },
    hi: {
        navHome: "मुख्य पृष्ठ", navJournal: "जर्नल टाइमर", navBreathe: "सांस लें", navTracker: "ट्रैकर", navArchive: "संग्रह", navSettings: "सेटिंग्स",
        morning: "सुप्रभात।", afternoon: "शुभ दोपहर।", evening: "शुभ संध्या।",
        sub: "वापसी पर स्वागत है",
        c1Title: "जर्नल", c1Desc: "15-मिनट निर्देशित रीसेट",
        c2Title: "सांस लें", c2Desc: "त्वरित शांत करने वाले व्यायाम",
        c3Title: "ट्रैकर", c3Desc: "आज अपनी ऊर्जा लॉग करें",
        quote: "\"आप बिल्कुल वहीं हैं जहाँ आपको होना चाहिए।\""
    },
    ta: {
        navHome: "முகப்பு", navJournal: "நேரங்காட்டி", navBreathe: "சுவாசி", navTracker: "கண்காணிப்பான்", navArchive: "காப்பகம்", navSettings: "அமைப்புகள்",
        morning: "காலை வணக்கம்.", afternoon: "மதிய வணக்கம்.", evening: "மாலை வணக்கம்.",
        sub: "நல்வரவு",
        c1Title: "ஜர்னல்", c1Desc: "15 நிமிட வழிகாட்டப்பட்ட தியானம்",
        c2Title: "சுவாசி", c2Desc: "விரைவான அமைதி பயிற்சிகள்",
        c3Title: "கண்காணிப்பான்", c3Desc: "உங்கள் ஆற்றலைப் பதிவு செய்யவும்",
        quote: "\"நீங்கள் எங்கு இருக்க வேண்டுமோ அங்குதான் இருக்கிறீர்கள்.\""
    }
};

// --- Language Switcher Execution Engine ---
function changeLanguage() {
    const langSelect = document.getElementById('langSelect');
    const lang = langSelect ? langSelect.value : 'en';
    const t = i18n[lang] || i18n['en'];
    const greetingKey = getGreetingKey();

    // Update Nav Menu Elements safely
    if(document.getElementById('navHome')) document.getElementById('navHome').innerText = t.navHome;
    if(document.getElementById('navJournal')) document.getElementById('navJournal').innerText = t.navJournal;
    if(document.getElementById('navBreathe')) document.getElementById('navBreathe').innerText = t.navBreathe;
    if(document.getElementById('navTracker')) document.getElementById('navTracker').innerText = t.navTracker;
    if(document.getElementById('navArchive')) document.getElementById('navArchive').innerText = t.navArchive;
    if(document.getElementById('navSettings')) document.getElementById('navSettings').innerText = t.navSettings;

    // Update Dashboard Typography Content safely
    if(document.getElementById('greetingText')) document.getElementById('greetingText').innerText = t[greetingKey];
    if(document.getElementById('subGreeting')) {
        document.getElementById('subGreeting').innerHTML = t.sub + '<span class="user-name" id="userName">, ' + getUserName() + '</span>';
    }
    
    if(document.getElementById('card1Title')) document.getElementById('card1Title').innerText = t.c1Title;
    if(document.getElementById('card1Desc')) document.getElementById('card1Desc').innerText = t.c1Desc;
    
    if(document.getElementById('card2Title')) document.getElementById('card2Title').innerText = t.c2Title;
    if(document.getElementById('card2Desc')) document.getElementById('card2Desc').innerText = t.c2Desc;
    
    if(document.getElementById('card3Title')) document.getElementById('card3Title').innerText = t.c3Title;
    if(document.getElementById('card3Desc')) document.getElementById('card3Desc').innerText = t.c3Desc;
    
    if(document.getElementById('quoteBox')) document.getElementById('quoteBox').innerText = t.quote;
}

// Make changeLanguage available globally right away
window.changeLanguage = changeLanguage;

// --- Listen for Global Authentication State Changes ---
window.addEventListener('authStatusChanged', function() {
    changeLanguage();
});

// --- Initialize Components Safely Once DOM is Ready ---
function initDashboard() {
    changeLanguage();

    const audio = document.getElementById('meditationAudio');
    const audioToggle = document.getElementById('audioToggle');
    const volumeSlider = document.getElementById('volumeSlider');
    let isPlaying = false;

    function initAudio() {
        if (!audio || !volumeSlider) return;
        audio.volume = volumeSlider.value / 100;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                updateAudioIcon();
            }).catch(() => {
                console.log('Autoplay blocked initially - waiting for user interaction');
            });
        }
    }

    function updateAudioIcon() {
        if (!audioToggle) return;
        if (isPlaying) {
            audioToggle.innerHTML = `<svg class="audio-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a7 7 0 0 1 0 9.9"></path>
            </svg>`;
        } else {
            audioToggle.innerHTML = `<svg class="audio-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="23" y1="15" x2="17" y2="9"></line>
            </svg>`;
        }
    }

    if (audioToggle) {
        audioToggle.addEventListener('click', () => {
            if (!audio) return;
            if (isPlaying) {
                audio.pause();
                isPlaying = false;
            } else {
                audio.play();
                isPlaying = true;
            }
            updateAudioIcon();
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            if (audio) audio.volume = e.target.value / 100;
        });
    }

    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });

    // GSAP Hover Micro-interactions
    if (typeof gsap !== 'undefined') {
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                gsap.to(this, { duration: 0.3, y: -12, ease: 'power2.out' });
            });
            card.addEventListener('mouseleave', function() {
                gsap.to(this, { duration: 0.3, y: 0, ease: 'power2.out' });
            });
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}