// components.js - Unified Header and Navigation System

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject the Unified CSS Styles directly into the page head
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
        /* --- Unified Header & Navigation Bar Styles --- */
        .header-bar {
            width: 100%;
            max-width: 1200px;
            padding: 20px 40px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            z-index: 100;
            margin: 0 auto;
        }

        .lang-select {
            background: var(--glass-bg, rgba(250, 247, 243, 0.6));
            border: 1px solid var(--glass-border, rgba(180, 160, 140, 0.5));
            padding: 8px 16px;
            border-radius: 20px;
            color: var(--text-dark, #3a3a3a);
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            outline: none;
            transition: all 0.3s ease;
        }

        .lang-select:hover {
            background: rgba(250, 247, 243, 0.9);
            border-color: var(--earth-brown, #8b7355);
        }

        .main-nav {
            background: var(--glass-bg, rgba(250, 247, 243, 0.6));
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border, rgba(180, 160, 140, 0.5));
            padding: 15px 40px;
            border-radius: 40px;
            display: flex;
            gap: 20px;
            align-items: center;
            justify-content: center;
            margin: 0 auto 40px auto;
            max-width: fit-content;
            box-shadow: 0 8px 32px 0 rgba(139, 115, 85, 0.15);
            z-index: 100;
            position: sticky;
            top: 10px;
        }

        .main-nav a {
            text-decoration: none;
            color: var(--text-dark, #3a3a3a);
            font-weight: 600;
            font-size: 0.95rem;
            padding: 8px 16px;
            border-radius: 20px;
            transition: all 0.3s ease;
        }

        .main-nav a:hover, .main-nav a.active {
            background: var(--earth-brown, #8b7355);
            color: #ffffff;
        }

        #userProfileDisplay {
            color: var(--earth-brown, #8b7355);
            font-weight: 600;
            font-size: 0.95rem;
            margin-left: 10px;
        }

        /* Responsiveness Layer */
        @media (max-width: 768px) {
            .main-nav { 
                padding: 15px 25px; 
                gap: 10px; 
                flex-wrap: wrap; 
                border-radius: 20px; 
            }
            .header-bar { 
                padding: 20px; 
                justify-content: center;
            }
        }
    `;
    document.head.appendChild(styleTag);

    // 2. Define the HTML Structure
    // Note: The userProfileDisplay span sits cleanly inside the nav menu right next to the auth button
    const headerHTML = `
        <div class="header-bar">
            <select class="lang-select" id="langSelect" onchange="changeLanguage()">
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
            </select>
        </div>

        <nav class="main-nav">
            <a href="index.html" id="navHome">Home</a>
            <a href="NewLayout.html" id="navJournal">Journal Timer</a>
            <a href="breathe.html" id="navBreathe">Breathe</a>
            <a href="tracker.html" id="navTracker">Tracker</a>
            <a href="archive.html" id="navArchive">Archive</a>
            <a href="settings.html" id="navSettings">Settings</a>
            
            <span id="userProfileDisplay" style="display: none;"></span>
            <div id="googleBtnContainer" style="display: inline-block; align-self: center; margin-left: 5px;"></div>
        </nav>
    `;

    // 3. Inject elements to the top of the <body> block
    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // 4. Automated Active Page Highlighting Routine
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".main-nav a");
    
    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });
});
