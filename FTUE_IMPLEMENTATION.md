# First Time User Experience (FTUE) Implementation

## Overview
Sistem FTUE yang komprehensif untuk membimbing pengguna baru melalui semua fitur aplikasi dengan dialog interaktif dari avatar RISA.

## Flow Diagram

```
Login/Register
    ↓
Landing Page (Dialog 1-2)
    ↓
Puberty Quest Page (Dialog 3-5)
    ↓
Article Page (Dialog 6)
    ↓
Siklusku Page (Dialog 7-8)
    ↓
Vaksin HPV Page (Dialog 9-10)
    ↓
Misi Harian Page (Dialog 11)
    ↓
FTUE Complete ✓
```

## Dialog Content

| Step | Page | Dialog | Action |
|------|------|--------|--------|
| 1 | Landing | Intro greeting | Next |
| 2 | Landing | Invite to try | Button: "Coba Sekarang" |
| 3 | Puberty Quest | Congratulations | Next |
| 4 | Puberty Quest | Mini games info | Next |
| 5 | Puberty Quest | Article recommendation | Button: "Baca Artikel" |
| 6 | Article | Siklusku intro | Highlight nav |
| 7 | Siklusku | Feature explanation | Next |
| 8 | Siklusku | Vaksin HPV intro | Highlight nav |
| 9 | Vaksin HPV | Feature explanation | Next |
| 10 | Vaksin HPV | Misi Harian intro | Highlight nav |
| 11 | Misi Harian | Final message | Complete FTUE |

## Key Components

### 1. **useFTUEStore.js**
- Manages FTUE state (currentStep, showDialog, highlightElement)
- Tracks completion status in localStorage

### 2. **guideData.js**
- Contains all 11 dialog messages
- Gen Z style, fun, engaging tone

### 3. **AvatarDialog.js**
- Enhanced component with button support
- Highlight overlay for element focus
- Keyboard typing sound effect

### 4. **FTUE Wrappers**
- `FTUEWrapper.js` - Landing page (Dialog 1-2)
- `PubertyQuestFTUE.js` - Puberty Quest (Dialog 3-5)
- `ArticleFTUE.js` - Article page (Dialog 6)
- `SiklusFTUE.js` - Siklusku page (Dialog 7-8)
- `VaksinFTUE.js` - Vaksin HPV page (Dialog 9-10)
- `MissionsFTUE.js` - Misi Harian page (Dialog 11)

## LocalStorage Keys

- `ftue-complete` - Boolean flag for FTUE completion
- `ftue-step` - Current step number (0-6)
- `puberty-quest-intro-seen` - Puberty Quest intro flag

## Features

✅ Sequential dialog flow
✅ Highlight navigation elements
✅ Button actions with routing
✅ Keyboard typing sound effect
✅ Responsive design (mobile & desktop)
✅ Gen Z friendly tone
✅ Persistent state tracking
✅ Skip-able flow (click to proceed)

## Usage

### For New Users
1. User logs in/registers
2. FTUEWrapper detects first login (no ftue-complete flag)
3. Dialog 1 appears automatically
4. User clicks through dialogs
5. Each dialog advances to next step
6. Navigation highlights guide user to features
7. After Dialog 11, ftue-complete is set to true

### For Returning Users
- FTUE is skipped (ftue-complete = true)
- Normal app experience

## Customization

### Change Dialog Text
Edit `guideData.js`:
```javascript
dialog1: "Your custom message here"
```

### Change Highlight Color
In FTUE components, modify border color:
```javascript
className="border-4 border-yellow-400" // Change to desired color
```

### Change Sound Volume
In `AvatarDialog.js`:
```javascript
audioRef.current.volume = 0.5; // Adjust 0-1
```

## Notes

- All dialogs use keyboard-typing.mp3 sound effect
- Highlight overlay uses yellow-400 color with glow effect
- Each page checks ftue-step in localStorage to determine which dialog to show
- Dialog messages support HTML (use `<br />` for line breaks)
- Mobile menu highlight works on hamburger menu
