# Jacky Storyboard — Auto Clip Builder

Browser-only app to fetch news, generate Thai script + shotlist, render kinetic-typography video with PixiJS + GSAP, speak via Web Speech, add beeps, approximate lip-sync, record WebM, and export SRT.

How to run
- Open `index.html` with a local web server (due to module imports). If you have Python:
  - Python 3: `python3 -m http.server 5173` and open http://localhost:5173/
- Or use any static server.

Notes
- Some RSS sources require CORS. The app falls back to `api.allorigins.win`.
- Web Speech audio cannot be routed to MediaRecorder directly; the recorded file includes our synthetic audio envelope and beeps. Subtitles (SRT) are exported for full narration.
- Click “เริ่มระบบเสียง” once to unlock AudioContext on user gesture.