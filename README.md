# 🍃 പൊഞ്ചിക്കര ഓണ സദ്യ സിമുലേറ്റർ | Ponjikkara Onam Sadhya Simulator

> **TinkerHub Useless Projects 3.0 Submission**  
> An interactive, comedic single-page web application featuring a traditional **Kerala Onam Sadhya** serving experience with a chaotic twist based on the famous movie character **Ponjikkara Kesavan** (*Kalyanaraman*).

---

## 📸 Screenshots & Showcase

### 🤖 TinkerHub Useless Projects 3.0 Event
![TinkerHub Useless Projects 3.0](assets/screenshots/tinkerhub_event.jpg)

### 🍽️ Interactive Gameplay Interface
![Gameplay Preview](assets/screenshots/gameplay_preview.png)

### 💻 Codebase & Terminal Workflow
![Code and Terminal](assets/screenshots/code_terminal.jpg)

---

## 🌟 Key Features & Mechanics

1. **Authentic Kerala Visual Aesthetics**:
   - **Realistic Seated King Mahabali**: Positioned at the dining table (`👑 മഹാബലി തമ്പുരാൻ`).
   - **Real Photo Banana Leaf**: Pristine green banana leaf plate cutout (`assets/dishes/user_real_leaf.png`) mounted on a rustic wooden dining board.
   - **16 Photorealistic Sadhya Cutouts**: Authentic culinary items from Parippu & Ghee to Palada Payasam.
   - **Fresh Yellow Kerala Banana**: Custom Poovan Pazham cutout garnish on the leaf.

2. **Core Interactive Mechanic ("Ponjikkara Logic")**:
   - **User Prompt**: *"👉 Click anywhere on the banana leaf"*
   - **The Comedic Twist**: Ponjikkara Kesavan ignores your target completely and launches the dish wherever *he* chooses, disregarding traditional Sadhya etiquette!
   - **Speech & Dialogue System**: Real-time browser Web Speech Synthesis and dynamic comic speech bubbles displaying classic Malayalam & English punchlines.

3. **16 Sequential Sadhya Dishes**:
   1. Parippu Curry & Ghee (`പരിപ്പും നെയ്യും`)
   2. Sambar (`സാമ്പാർ`)
   3. Avial (`അവിയൽ`)
   4. Thoran (`തോരൻ`)
   5. Olan (`ഓലൻ`)
   6. Kalan (`കാളൻ`)
   7. Erissery (`എരിശ്ശേരി`)
   8. Pachadi (`പച്ചടി`)
   9. Khichadi (`കിച്ചടി`)
   10. Inji Puli (`ഇഞ്ചിപ്പുളി`)
   11. Mango Pickle (`മാങ്ങാ അച്ചാർ`)
   12. Naranga Pickle (`നാരങ്ങാ അച്ചാർ`)
   13. Banana Chips / Upperi (`ഉപ്പേരി`)
   14. Sharkara Varatti (`ശർക്കരവരട്ടി`)
   15. Crispy Pappadam (`പപ്പടം`)
   16. Palada Payasam (`പാൽപായസം`) — *Grand Finale*

4. **Official Rubber Stamp Seal Modal**:
   - Upon serving all 16 dishes, a grand celebratory completion modal drops onto the screen with confetti and an official rubber stamp seal: **PONJIKKARA KESAVAN APPROVED VELAMBAL** (*പോഞ്ഞിക്കര കേശവൻ അംഗീകൃത സദ്യ വിളമ്പ്*).

---

## 🚀 Getting Started & Local Development

### 1. Clone Repository
```bash
git clone https://github.com/aryagrace15-eng/avulussum_vellam.git
cd avulussum_vellam
```

### 2. Run Local Web Server
```bash
python3 -m http.server 8099
```

Open your web browser and visit:  
👉 **http://localhost:8099**

*(Alternatively, open `index.html` directly in any web browser!)*

---

## 🌐 Deploying on Vercel

This project is 100% compatible with Vercel for zero-config static hosting:

1. Visit [vercel.com/new](https://vercel.com/new) and log in with GitHub.
2. Import the repository **`aryagrace15-eng/avulussum_vellam`**.
3. Click **Deploy** to get your instant live `.vercel.app` production link!

---

## 🛠️ Tech Stack & Web APIs

- **Core**: HTML5, Vanilla JavaScript (ES6+), Vanilla CSS3
- **Graphics**: HTML5 Canvas 2D Engine (Trajectory flight physics, steam vapor, confetti particles)
- **Audio Context**: Web Audio API & Web Speech API (`SpeechSynthesis`)
- **Typography**: Google Fonts (`Cinzel`, `Noto Serif Malayalam`, `Gayathri`, `Outfit`, `Montserrat`)

---

*Made with ❤️ for Onam & TinkerHub Useless Projects 3.0!*
