# VerdictFX

VerdictFX is a Chrome extension that adds simple audiovisual feedback to your coding submissions on LeetCode and GeeksforGeeks.

When your solution is accepted, it plays a short video. When it fails, it plays a sound. The goal is to make the feedback loop a bit more engaging without being distracting.

---

## Features

* Detects accepted submissions
* Detects common failure states (Wrong Answer, Runtime Error, TLE, etc.)
* Plays a video overlay on success
* Plays a sound on failure
* Works with dynamic pages (SPA-based platforms like LeetCode)
* Automatically resets between submissions

---

## Supported Platforms

* LeetCode (leetcode.com)
* GeeksforGeeks (geeksforgeeks.org)

---

## Project Structure

```
VerdictFX/
│── content.js        # Detection logic and media handling
│── inject.css        # Styling for the success overlay
│── manifest.json     # Extension configuration
│── success.mp4       # Played on accepted submissions
│── failure.mp3       # Played on failed submissions
```

---

## Installation

1. Clone or download this repository

```
git clone https://github.com/your-username/verdictfx.git
```

Or download it as a ZIP and extract it.

2. Open Chrome extensions

Go to:

```
chrome://extensions/
```

3. Enable Developer Mode (top right)

4. Click "Load unpacked" and select the project folder

5. Open LeetCode or GeeksforGeeks and submit a solution

---

## How It Works

The extension listens for DOM changes after a submission using `MutationObserver`.
It looks for result text such as:

* "Accepted"
* "Wrong Answer"
* "Runtime Error"
* "Time Limit Exceeded"

Based on the result:

* A video overlay is shown for accepted submissions
* A sound is played for failed ones

---

## Notes

* If media does not play, reload the extension and refresh the page
* Browsers may restrict autoplay; a fallback is included
* If the platforms update their UI, selectors may need adjustment

---

## Possible Improvements

* Optional confetti animation on success
* Subtle visual feedback on failure
* Settings panel (enable/disable sound or video)
* Custom media support

---

## Final Thought

This is a small addition, but it makes the feedback loop a bit more satisfying—especially after a long debugging session.
