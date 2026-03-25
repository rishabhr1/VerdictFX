// ======================================================
//        SUCCESS VIDEO PLAYER (SAFE + STABLE)
// ======================================================

let hasPlayedForThisSubmission = false;

// Safe wrapper for chrome.runtime.getURL()
function safeGetURL(path) {
    try {
        return chrome.runtime.getURL(path);
    } catch (e) {
        return null;
    }
}

// ======================================================
//                 SUCCESS VIDEO
// ======================================================

function playSuccessVideo() {
    if (document.getElementById("success-overlay")) return;

    const videoURL = safeGetURL("success.mp4");
    if (!videoURL) return;

    const overlay = document.createElement("div");
    overlay.id = "success-overlay";

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
//                 FAILURE SOUND
// ======================================================

function playFailureSound() {
    const audioURL = safeGetURL("failure.mp3");
    if (!audioURL) return;

    const audio = new Audio(audioURL);

    audio.play().catch(() => {
        audio.muted = true;
        audio.play().then(() => {
            setTimeout(() => (audio.muted = false), 200);
        });
    });
}

// ======================================================
//               LEETCODE DETECTION
// ======================================================

function detectLeetCode() {
    const observer = new MutationObserver(() => {

        const acceptedEl = document.querySelector(
            'span[data-e2e-locator="submission-result"]'
        );

        // Find any h3 containing failure text
        const wrongEl = Array.from(document.querySelectorAll("h3"))
            .find(el =>
                el.textContent.includes("Wrong Answer") ||
                el.textContent.includes("Runtime Error") ||
                el.textContent.includes("Time Limit Exceeded") ||
                el.textContent.includes("Memory Limit Exceeded") ||
                el.textContent.includes("Compile Error")
            );

        // Reset when submission panel resets
        if (!acceptedEl && !wrongEl) {
            hasPlayedForThisSubmission = false;
            return;
        }

        if (hasPlayedForThisSubmission) return;

        // ✅ Accepted
        if (acceptedEl && acceptedEl.textContent.trim() === "Accepted") {
            hasPlayedForThisSubmission = true;
            playSuccessVideo();
            return;
        }

        // ❌ Failed cases
        if (wrongEl) {
            hasPlayedForThisSubmission = true;
            playFailureSound();
        }

    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// ======================================================
//                      GFG DETECTION
// ======================================================

function observeGFG() {
    const observer = new MutationObserver(() => {

        const successBox = document.querySelector(
            'div.problems_problem_solved_successfully__Zb4yG'
        );

        const wrongEl = Array.from(document.querySelectorAll("h3"))
            .find(el => el.textContent.includes("Wrong Answer"));

        // ✅ Success
        if (successBox && !hasPlayedForThisSubmission) {
            hasPlayedForThisSubmission = true;
            playSuccessVideo();
            return;
        }

        // ❌ Failure
        if (wrongEl && !hasPlayedForThisSubmission) {
            hasPlayedForThisSubmission = true;
            playFailureSound();
            return;
        }

        // Reset
        if (!successBox && !wrongEl) {
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
    detectLeetCode();
}

if (location.hostname.includes("geeksforgeeks.org")) {
    observeGFG();
}