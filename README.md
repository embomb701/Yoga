# Yoga with Dylan – Static Website

## Description
A premium, high-conversion marketing site for "Yoga with Dylan". Modern aesthetics, ambient motion, audio micro-interaction, fully responsive, and accessible.

## Project Structure

- `index.html` — Main site
- `styles.css` — Modular, well-commented CSS with custom properties and animation
- `script.js` — Interactive, micro-animations, sound, cursor/magnetic effects, etc.
- `assets/`
    - `images/` — Drop final studio/branding images here
    - `icons/` — SVGs and illustrated assets
    - `audio/` — UI sounds (chime, breath, bell, wood click). Demo .mp3 and .wav included as placeholders
    - `grain.png` — (optional) subtle noise/film overlay
    
## Usage
Open `index.html` directly, or deploy the folder as-is to Netlify, Vercel, Surge, or any static site host.

### Images & Audio
- Replace hero/about/class images (`assets/images/`)
- Drop real UI sounds (keep <1s, subtle; see script.js for how to assign)

## Development Notes
- CSS uses modern custom properties and container queries for responsiveness
- All interactive audio can be toggled via the mute/unmute button (top-right corner)
- Fallback web-safe fonts included; optimize with real licenses as needed

**This codebase is modular, clean, accessible, and designed for easy expansion.**
