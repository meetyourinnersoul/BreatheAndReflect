/**
 * MeditateYourSoul Unified Cloud & Local Data Engine
 * Chronologically maps tracking metrics, journal text, and audio artifacts by YYYY-MM-DD
 */
const DataStore = {
    // Generates localized ISO baseline key
    getTodayKey() {
        const d = new Date();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${month}-${day}`;
    },

    // Fetches entire calendar-mapped structure
    getAllHistory() {
        const localData = localStorage.getItem('wellness_calendar_data');
        return localData ? JSON.parse(localData) : {};
    },

    // Saves structured entry for a specific day key
    saveDayData(dateKey, section, payload) {
        const history = this.getAllHistory();
        if (!history[dateKey]) history[dateKey] = {};
        
        // Merge or set payload segment
        history[dateKey][section] = {
            ...history[dateKey][section],
            ...payload,
            timestamp: new Date().getTime()
        };

        localStorage.setItem('wellness_calendar_data', JSON.stringify(history));
        
        // Dispatches global notification for live synchronization updating across frames
        window.dispatchEvent(new Event('wellnessDataUpdated'));
        
        // NOTE FOR FUTURE DRIVE HOOK: If authenticated via auth.js, sync string to Google Drive here
        if (window.gapi && gapi.auth2?.getAuthInstance()?.currentUser.get().isSignedIn()) {
            console.log("Cloud-ready entry sync scheduled for Drive storage mapping...");
        }
    },

    // Helper specific updates
    saveTracker(mood, water, sleep) {
        this.saveDayData(this.getTodayKey(), 'tracker', { mood, water, sleep });
    },

    saveTextJournal(prompt, text, duration) {
        this.saveDayData(this.getTodayKey(), 'journal_text', { prompt, text, duration });
    },

    saveVoiceJournal(audioId, prompt, duration) {
        this.saveDayData(this.getTodayKey(), 'journal_voice', { audioId, prompt, duration });
    }
};