// auth.js - Centralized Authentication System for Breathe & Reflect

// 1. Core Global Configuration
const GOOGLE_CLIENT_ID = "265811510977-m0v0ojp05a6i98r7rp35sc47p2j2o7qn.apps.googleusercontent.com";
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";

let tokenClient;
let currentAccessToken = null;

// 2. JWT Token Parser Engine
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('0' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch(e) {
        console.error("JWT Parsing failed:", e);
        return null;
    }
}

// 3. Central Response Handler
function handleCredentialResponse(response) {
    const responsePayload = parseJwt(response.credential);
    if (responsePayload && responsePayload.given_name) {
        // Commit identity globally to browser storage
        localStorage.setItem('userWellnessName', responsePayload.given_name);
        
        // Dispatches a global event across the page
        window.dispatchEvent(new Event('authStatusChanged'));
        
        // Execute the global layout engine immediately if it exists
        if (typeof window.changeLanguage === 'function') {
            window.changeLanguage();
        }
    }
}

// 4. Request Google Drive Access Token
function requestDriveAccess(callback) {
    if (!tokenClient) {
        console.error("Token client not initialized yet.");
        return;
    }
    
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            console.error("GSI Token Error:", resp.error);
            callback(null);
            return;
        }
        currentAccessToken = resp.access_token;
        callback(currentAccessToken);
    };

    // Requests an access token via interactive popup window
    tokenClient.requestAccessToken({ prompt: 'consent' });
}

// 5. Global Self-Initialization Routine on Window Load
window.addEventListener('load', function() {
    // Inject the Google SDK library dynamically if it isn't already declared in the head
    if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        const script = document.createElement('script');
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    }

    // Initialize Identity Client Framework
    setTimeout(() => {
        if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
            google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse
            });

            // Initialize Token Client for API Access (Google Drive Flow)
            if (google.accounts.oauth2) {
                tokenClient = google.accounts.oauth2.initTokenClient({
                    client_id: GOOGLE_CLIENT_ID,
                    scope: DRIVE_SCOPE,
                    callback: '', // Handled dynamically in requestDriveAccess
                });
            }

            // Auto-detect if the current page features an explicit button mounting target element
            const btnTarget = document.getElementById("googleBtnContainer");
            if (btnTarget) {
                google.accounts.id.renderButton(
                    btnTarget,
                    { theme: "outline", size: "medium", shape: "pill" }
                );
            }
        }
    }, 300); // Tiny buffer to guarantee external network script execution stability
});