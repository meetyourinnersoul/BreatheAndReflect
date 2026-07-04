// auth.js - Centralized Authentication System for Breathe & Reflect

// 1. Core Global Configuration
const GOOGLE_CLIENT_ID = "265811510977-m0v0ojp05a6i98r7rp35sc47p2j2o7qn.apps.googleusercontent.com";[cite: 6]
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";[cite: 6]

let tokenClient;[cite: 6]
let currentAccessToken = null;[cite: 6]

// 2. JWT Token Parser Engine
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];[cite: 6]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');[cite: 6]
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('0' + c.charCodeAt(0).toString(16)).slice(-2);[cite: 6]
        }).join(''));[cite: 6]
        return JSON.parse(jsonPayload);[cite: 6]
    } catch(e) {
        console.error("JWT Parsing failed:", e);[cite: 6]
        return null;[cite: 6]
    }
}

// 3. Helper to Render Identity Label into Layout Navbar
function updateNavbarProfileName(name) {
    const profileDisplay = document.getElementById("userProfileDisplay");[cite: 5]
    const googleBtn = document.getElementById("googleBtnContainer");[cite: 5]
    
    if (profileDisplay && name) {
        profileDisplay.innerText = `✨ ${name}`;
        profileDisplay.style.display = "inline-block";
        
        // Hide the sign-in button once authenticated to keep the navigation bar clean
        if (googleBtn) {
            googleBtn.style.display = "none";[cite: 5]
        }
    }
}

// 4. Central Response Handler
function handleCredentialResponse(response) {
    const responsePayload = parseJwt(response.credential);[cite: 6]
    if (responsePayload && responsePayload.given_name) {
        // Commit identity globally to browser storage
        localStorage.setItem('userWellnessName', responsePayload.given_name);[cite: 6]
        
        // Render name into navigation bar instantly
        updateNavbarProfileName(responsePayload.given_name);
        
        // Dispatches a global event across the page for index.html dashboard sync
        window.dispatchEvent(new Event('authStatusChanged'));[cite: 6]
        
        // Execute the global layout engine immediately if it exists
        if (typeof window.changeLanguage === 'function') {
            window.changeLanguage();[cite: 6]
        }
    }
}

// 5. Request Google Drive Access Token
function requestDriveAccess(callback) {
    if (!tokenClient) {
        console.error("Token client not initialized yet.");[cite: 6]
        return;[cite: 6]
    }
    
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            console.error("GSI Token Error:", resp.error);[cite: 6]
            callback(null);[cite: 6]
            return;[cite: 6]
        }
        currentAccessToken = resp.access_token;[cite: 6]
        callback(currentAccessToken);[cite: 6]
    };

    // Requests an access token via interactive popup window
    tokenClient.requestAccessToken({ prompt: 'consent' });[cite: 6]
}

// 6. Global Self-Initialization Routine on Window Load
window.addEventListener('load', function() {
    // Inject the Google SDK library dynamically if it isn't already declared
    if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        const script = document.createElement('script');[cite: 6]
        script.src = "https://accounts.google.com/gsi/client";[cite: 6]
        script.async = true;[cite: 6]
        script.defer = true;[cite: 6]
        document.head.appendChild(script);[cite: 6]
    }

    // Clear out any broken frame remnants before starting up the library
    const btnTarget = document.getElementById("googleBtnContainer");[cite: 5, 6]
    if (btnTarget) {
        btnTarget.innerHTML = ""; 
    }

    // Quick-check if user is already logged in from a previous session
    const savedName = localStorage.getItem('userWellnessName');[cite: 8]
    if (savedName && savedName !== 'Mindful Achiever') {[cite: 8]
        updateNavbarProfileName(savedName);
    }

    // Initialize Identity Client Framework
    setTimeout(() => {
        if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {[cite: 6]
            try {
                google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,[cite: 6]
                    callback: handleCredentialResponse,[cite: 6]
                    itp_support: true // Handles third-party privacy block restrictions seamlessly
                });

                // Initialize Token Client for API Access (Google Drive Flow)
                if (google.accounts.oauth2) {[cite: 6]
                    tokenClient = google.accounts.oauth2.initTokenClient({[cite: 6]
                        client_id: GOOGLE_CLIENT_ID,[cite: 6]
                        scope: DRIVE_SCOPE,[cite: 6]
                        callback: '', // Handled dynamically in requestDriveAccess
                    });[cite: 6]
                }

                // Render the button only if there is no active session profile label visible
                if (btnTarget && (!savedName || savedName === 'Mindful Achiever')) {[cite: 6, 8]
                    google.accounts.id.renderButton(
                        btnTarget,[cite: 6]
                        { 
                            theme: "outline", 
                            size: "medium", 
                            shape: "pill",
                            text: "signin_with" 
                        }
                    );
                }
            } catch (err) {
                console.error("Google Identity initialization encountered an execution fault:", err);
            }
        } else {
            console.warn("Google authentication library was blocked or timed out during download.");
        }
    }, 400); // 400ms buffer to guarantee network script execution stability[cite: 6]
});
