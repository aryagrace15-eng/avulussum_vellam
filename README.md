# 🍃 പൊഞ്ചിക്കര ഓണ സദ്യ സിമുലേറ്റർ | Ponjikkara Onam Sadhya Simulator

An interactive, single-page web application featuring a traditional **Kerala Onam Sadhya** serving game with a comedic twist based on the movie character **Ponjikkara Kesavan** (*Kalyanaraman*).

---

## 🌟 Key Features

1. **Visual Setup & Scene**:
   - **Backdrop Scene**: Features the iconic Ceylon Bake House poster illustration backdrop with **King Mahabali** (`👑 മഹാബലി തമ്പുരാൻ`) and **Ponjikkara Kesavan** (`👨‍🍳 പൊഞ്ചിക്കര കേശവൻ`) standing side-by-side at the wooden dining table.
   - **Clean Empty Banana Leaf**: Starts with a pristine green banana leaf centerpiece (`assets/banana_leaf_base.png`) mounted on the wooden table.
   - **Real Photo Dishes**: Uses authentic photographic cutouts from `assets/realistic_sadhya.jpg` for the Sadhya items.

2. **Core Interactive Mechanic ("Ponjikkara Logic")**:
   - **User Prompt**: *"Click anywhere on the banana leaf to choose where Ponjikkara should serve your next dish!"*
   - **The Twist**: Clicking anywhere on the leaf or table ignores your target completely. Ponjikkara drops the dish wherever *he* wants, disregarding proper Sadhya etiquette.
   - **Live Voice & Dialogue**: On every serve click, Ponjikkara speaks out loud via browser Web Speech Synthesis and displays dynamic comic speech bubbles over his head.

3. **16 Sequential Sadhya Dishes**:
   1. Parippu Curry & Ghee
   2. Sambar
   3. Avial
   4. Thoran
   5. Olan
   6. Kalan
   7. Erissery
   8. Pachadi (Pineapple/Beetroot)
   9. Khichadi (Cucumber Yogurt)
   10. Inji Puli (Puli Inji)
   11. Mango Pickle
   12. Naranga Pickle
   13. Banana Chips (Upperi)
   14. Sharkara Varatti
   15. Crispy Pappadam
   16. Palada Payasam (The Finale)

4. **Disaster Report Card Modal**:
   - Live dish counter: `Dishes Served: [X / 16]`.
   - Pop-up modal upon completion with Ponjikkara's victory pose and a downloadable **Disaster Report Card (PNG)** with an official rubber stamp seal.

---

## 🚀 Getting Started

Simply open `index.html` in any web browser, or start a local HTTP server:

```bash
python3 -m http.server 8090
```

Then visit `http://localhost:8090` in your browser!

---

## 🛠️ Tech Stack

- **HTML5 Canvas** (Physics, liquid splatters, curved redirection arrows, steam vapor)
- **Vanilla JavaScript (ES6+)**
- **Tailwind CSS** & **Vanilla CSS**
- **Web Audio API** & **Web Speech API**

---

*Made with ❤️ for Onam!*
