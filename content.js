// ======================================================
//        SUCCESS VIDEO PLAYER (SAFE + STABLE)
// ======================================================

let hasPlayedForThisSubmission = false;

// Safe wrapper for chrome.runtime.getURL() to avoid
// "Extension context invalidated" errors on SPA navigation.
function safeGetURL(path) {
    try {
        return chrome.runtime.getURL(path);
    } catch (e) {
        return null; // Content script context invalid -> ignore
    }
}

function playSuccessVideo() {
    if (document.getElementById("success-overlay")) return;

    const videoURL = safeGetURL("success.mp4");
    if (!videoURL) return;

    const overlay = document.createElement("div");
    overlay.id = "success-overlay";

    // container for video + close button
    const container = document.createElement("div");
    container.id = "success-container";

    const closeBtn = document.createElement("div");
    closeBtn.id = "success-close-btn";
    closeBtn.textContent = "×";

    const video = document.createElement("video");
    video.id = "success-video";
    video.src = videoURL;
    video.autoplay = true;
    video.controls = false;
    video.playsInline = true;
    video.muted = false;

    closeBtn.addEventListener("click", () => overlay.remove());

    video.addEventListener("ended", () => overlay.remove());

    container.appendChild(closeBtn);
    container.appendChild(video);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    setTimeout(() => {
        video.play().catch(() => {
            video.muted = true;
            video.play().then(() => {
                setTimeout(() => (video.muted = false), 200);
            });
        });
    }, 150);
}




// ======================================================
//               LEETCODE ACCEPT DETECTION
// ======================================================
//
// Uses:
// <span data-e2e-locator="submission-result">Accepted</span>
//
// This span ONLY appears for NEW submissions. It is not present
// for old accepted attempts, and disappears when a new submit starts.
// ======================================================

function detectLeetCodeAccepted() {
    const observer = new MutationObserver(() => {

        // This exact span appears for new submissions only
        const statusEl = document.querySelector(
            'span[data-e2e-locator="submission-result"]'
        );

        // When submitting again, the result panel resets
        if (!statusEl) {
            hasPlayedForThisSubmission = false;
            return;
        }

        // Already triggered for this submission?
        if (hasPlayedForThisSubmission) return;

        const result = statusEl.textContent.trim();

        if (result === "Accepted") {
            hasPlayedForThisSubmission = true;
            playSuccessVideo();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}



// ======================================================
//                      GFG DETECTION
// ======================================================

function observeGFG() {
    const observer = new MutationObserver(() => {

        // New GFG Accepted selector based on your HTML snippet
        const successBox = document.querySelector(
            'div.problems_problem_solved_successfully__Zb4yG'
        );

        if (successBox && !hasPlayedForThisSubmission) {
            hasPlayedForThisSubmission = true;
            playSuccessVideo();
        }

        // Reset when success box disappears = new attempt or reset
        if (!successBox) {
            hasPlayedForThisSubmission = false;
        }

    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}




// ======================================================
//                      INIT
// ======================================================

if (location.hostname.includes("leetcode.com")) {
    detectLeetCodeAccepted();
}

if (location.hostname.includes("geeksforgeeks.org")) {
    observeGFG();
}
