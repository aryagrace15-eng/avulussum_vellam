/**
 * PONJIKKARA'S SADHYA SERVING GAME
 * A Comedic Kerala Onam Sadhya Experience
 * Inspired by Ponjikkara Kesavan (Kalyanaraman) & King Mahabali
 */

// ============================================================================
// 1. WEB AUDIO SOUND SYNTHESIZER (100% Procedural & Self-Contained)
// ============================================================================
class AudioEngine {
  constructor() {
    this.bgmAudio = document.getElementById('bgm-audio');
    this.isSongPlaying = false;
  }

  toggleSong() {
    if (!this.bgmAudio) return false;
    if (this.isSongPlaying) {
      this.pauseSong();
    } else {
      this.playSong();
    }
    return this.isSongPlaying;
  }

  playSong() {
    if (!this.bgmAudio) return;
    this.bgmAudio.play().then(() => {
      this.isSongPlaying = true;
      this.updateSongUI();
    }).catch(err => {
      console.log("Audio playback waiting for user interaction:", err);
    });
  }

  pauseSong() {
    if (!this.bgmAudio) return;
    this.bgmAudio.pause();
    this.isSongPlaying = false;
    this.updateSongUI();
  }

  updateSongUI() {
    const btn = document.getElementById('song-toggle-btn');
    const text = document.getElementById('song-btn-text');
    if (btn && text) {
      btn.classList.toggle('active', this.isSongPlaying);
      text.textContent = this.isSongPlaying ? 'Song: ON' : 'Song: OFF';
    }
  }

  // Sound effects disabled per request ("no need any other audio other than this song")
  playWhoosh() {}
  playSplat() {}
  playCrunch() {}
  playSizzle() {}
  playRejectBuzzer() {}
  speak() {}
}

// ============================================================================
// 2. THE 16 AUTHENTIC REALISTIC ONAM SADHYA DISHES
// ============================================================================
const SADHYA_DISHES = [
  {
    id: 1,
    name: "Parippu Curry & Ghee",
    malayalam: "പരിപ്പും നെയ്യും",
    traditionRule: "Golden dal served directly over center rice mound, followed by hot ghee",
    ponjiRule: '"Who puts parippu in the center? Top-right drop! Catch it if you can!"',
    soundType: "sizzle",
    impactText: "SIZZLE-POUR!",
    imgSrc: "assets/dishes/real_parippu.png",
    targetPos: { top: 22, left: 74, width: 90, height: 90 },
    dialogue: {
      mal: "പരിപ്പ് ചോറിന്റെ മേൽ അല്ല, ആ മൂലയ്ക്കാണ് കിടക്കേണ്ടത്! കഴിക്കെടാ!",
      mang: "Parippu chorinte mel alla, aa moolaykkaanu kidakkendath! Kazhikkeda!",
      eng: "Dal doesn't go on rice! It stays in that corner! Eat it!"
    }
  },
  {
    id: 2,
    name: "Sambar",
    malayalam: "സാമ്പാർ",
    traditionRule: "Poured lavishly on rice after parippu",
    ponjiRule: '"Sambar is an emotion! It flows wherever Kesavan throws it!"',
    soundType: "splat",
    impactText: "SPLAAAT!",
    imgSrc: "assets/dishes/real_sambar.png",
    targetPos: { top: 70, left: 24, width: 110, height: 110 },
    dialogue: {
      mal: "സാമ്പാർ ഒഴിക്കാൻ എന്നെ ആരും പഠിപ്പിക്കണ്ട! ദാ വീണു!",
      mang: "Sambar ozhikkaan enne aarum padippikkanda! Dhaa veenu!",
      eng: "Nobody needs to teach me how to pour Sambar! There it goes!"
    }
  },
  {
    id: 3,
    name: "Avial",
    malayalam: "അവിയൽ",
    traditionRule: "Placed carefully on the upper half of leaf near center",
    ponjiRule: '"Smack on the far left edge! Avial goes where Kesavan dictates!"',
    soundType: "splat",
    impactText: "DUM-THUD!",
    imgSrc: "assets/dishes/real_avial.png",
    targetPos: { top: 32, left: 14, width: 105, height: 105 },
    dialogue: {
      mal: "ദാ കിടക്കുന്നു അവിയൽ... വേണേൽ തിന്ന്! അത്ര തന്നെ!",
      mang: "Dha kidakkunnu Avial... venel thinnu! Athra thanne!",
      eng: "There lies your Avial... eat it if you want! That is that!"
    }
  },
  {
    id: 4,
    name: "Thoran",
    malayalam: "തോരൻ (ക്യാബേജ് & പയർ)",
    traditionRule: "Upper right area of banana leaf",
    ponjiRule: '"Wind-blown thoran right onto the top leaf spine!"',
    soundType: "crunch",
    impactText: "SWOOSH-DROP!",
    imgSrc: "assets/dishes/real_thoran.png",
    targetPos: { top: 18, left: 34, width: 100, height: 85 },
    dialogue: {
      mal: "ഞാൻ ആന കെട്ടിയ തറിയിലാടാ നീ തോരൻ തപ്പുന്നത്!",
      mang: "Njan aana kettiya thariyilaada nee thoran thappunnath!",
      eng: "You are looking for Thoran where I used to tie elephants!"
    }
  },
  {
    id: 5,
    name: "Olan",
    malayalam: "ഓലൻ",
    traditionRule: "Placed gently next to avial on the top leaf section",
    ponjiRule: '"Directly brushing against the hot rice! White river meeting mountain!"',
    soundType: "splat",
    impactText: "SILKY-SPLAT!",
    imgSrc: "assets/dishes/real_olan.png",
    targetPos: { top: 46, left: 30, width: 95, height: 85 },
    dialogue: {
      mal: "ഓലൻ ഇത്ര പാവം ആണെന്ന് കരുതിയോ? ഇതാണ് പോഞ്ഞിക്കര ഓലൻ!",
      mang: "Olan ithra paavam aanennu karuthiyo? Ithaanu Ponjikkara Olan!",
      eng: "Did you think Olan is innocent? Behold Ponjikkara's Olan!"
    }
  },
  {
    id: 6,
    name: "Kalan",
    malayalam: "കാളൻ",
    traditionRule: "Top center-right row of curries",
    ponjiRule: '"Top-left edge right where pickles should be sitting!"',
    soundType: "splat",
    impactText: "THICK-SPLAT!",
    imgSrc: "assets/dishes/real_kalan.png",
    targetPos: { top: 16, left: 16, width: 90, height: 80 },
    dialogue: {
      mal: "കാളൻ കണ്ടിട്ട് കണ്ണു തള്ളിയോ മാവേലീ? ഇതാണ് ഒറിജിനൽ കാളൻ!",
      mang: "Kalan kandittu kannu thalliyo Maveli? Ithaanu original Kalan!",
      eng: "Eyes bulging looking at Kalan, Maveli? This is the real deal!"
    }
  },
  {
    id: 7,
    name: "Erissery",
    malayalam: "എരിശ്ശേരി (മത്തങ്ങ & പയർ)",
    traditionRule: "Upper right edge alongside Kalan and Thoran",
    ponjiRule: '"Directly below the rice! Erissery foundation brick!"',
    soundType: "splat",
    impactText: "ROAST-SLAM!",
    imgSrc: "assets/dishes/real_erissery.png",
    targetPos: { top: 76, left: 66, width: 90, height: 90 },
    dialogue: {
      mal: "പോഞ്ഞിക്കര കേശവന്റെ കൈ കൊണ്ട് ഒരു തവി വീണാൽ പിന്നെ അവിടെ വേറെ ആരും വിളമ്പണ്ട!",
      mang: "Ponjikkara Kesavante kai kondu oru thavi veenal pinne avide vere aarum vilambanda!",
      eng: "Once Kesavan serves a ladle, nobody else dares to touch that spot!"
    }
  },
  {
    id: 8,
    name: "Pachadi (Pineapple)",
    malayalam: "പൈനാപ്പിൾ പച്ചടി",
    traditionRule: "Top center row of the leaf",
    ponjiRule: '"Precise aerial parachute landing on the upper boundary!"',
    soundType: "splat",
    impactText: "SWEET-DROP!",
    imgSrc: "assets/dishes/real_pachadi.png",
    targetPos: { top: 15, left: 52, width: 95, height: 95 },
    dialogue: {
      mal: "ഇതൊക്കെ എന്റെ ഓരോ... സ്റ്റൈൽ ആണ് മോനേ!",
      mang: "Ithokke ente oro... style aanu mone!",
      eng: "This is all part of my signature style, dear boy!"
    }
  },
  {
    id: 9,
    name: "Khichadi (Cucumber)",
    malayalam: "വെള്ളരിക്ക കിച്ചടി",
    traditionRule: "Right alongside Pachadi on the top row",
    ponjiRule: '"Sling-shotted sideways towards the far left leaf tip!"',
    soundType: "splat",
    impactText: "COOL-SPLAT!",
    imgSrc: "assets/dishes/real_khichadi.png",
    targetPos: { top: 26, left: 8, width: 95, height: 95 },
    dialogue: {
      mal: "കിച്ചടി ഇവിടെ ഇരുന്നാൽ എന്താ കുഴപ്പം? ആർക്കെങ്കിലും പരാതി ഉണ്ടോ?",
      mang: "Khichadi ivide irunnal entha kuzhappam? Aarkkengilum paraathi undo?",
      eng: "What is the problem if Khichadi sits here? Anyone got a complaint?!"
    }
  },
  {
    id: 10,
    name: "Inji Puli (Puli Inji)",
    malayalam: "ഇഞ്ചിപ്പുളി (പുളിയിഞ്ചി)",
    traditionRule: "Far top-left corner of the leaf (The 101 Curry Equal)",
    ponjiRule: '"Smack-dab in the center of the leaf! The King of Curries reigns everywhere!"',
    soundType: "splat",
    impactText: "TANGY-DROP!",
    imgSrc: "assets/dishes/real_injipuli.png",
    targetPos: { top: 45, left: 62, width: 75, height: 70 },
    dialogue: {
      mal: "101 കറിക്ക് തുല്യമാണ് പുളിയിഞ്ചി! അത് നടുക്ക് തന്നെ ഇരിക്കും!",
      mang: "101 karikku thulyamaanu Puliyinji! Athu nadukku thanne irikkum!",
      eng: "Puli Inji equals 101 curries! It will sit right in the center!"
    }
  },
  {
    id: 11,
    name: "Mango Pickle",
    malayalam: "കടുമാങ്ങ അച്ചാർ",
    traditionRule: "Top-left edge beside Inji Puli",
    ponjiRule: '"Flinged all the way to the right side next to Payasam territory!"',
    soundType: "splat",
    impactText: "SPICY-SPLAT!",
    imgSrc: "assets/dishes/real_mangopickle.png",
    targetPos: { top: 32, left: 88, width: 80, height: 75 },
    dialogue: {
      mal: "എരിവുള്ള കടുമാങ്ങ ഒടുക്കത്തെ ടേബിളിൽ ഇരുന്നാലേ സദ്യക്ക് ഒരു ഗുമ്മുണ്ടാവൂ!",
      mang: "Erivulla kadumaanga odukkatha table-il irunnale sadhyakku oru gummundaavoo!",
      eng: "Spicy mango pickle must sit on the far side for the Sadhya to have punch!"
    }
  },
  {
    id: 12,
    name: "Naranga Pickle",
    malayalam: "നാരങ്ങ അച്ചാർ",
    traditionRule: "Top-left edge next to Mango Pickle",
    ponjiRule: '"Dropped right by Maveli\'s hand! Enjoy the wild citron zest!"',
    soundType: "splat",
    impactText: "ZEST-DROP!",
    imgSrc: "assets/dishes/real_narangapickle.png",
    targetPos: { top: 60, left: 10, width: 75, height: 70 },
    dialogue: {
      mal: "അങ്ങോട്ട് മാറി ഇരിയെടോ, തവി വന്ന് മൂക്കിൽ കൊള്ളും!",
      mang: "Angottu maari iriyedo, thavi vannu mookkil kollum!",
      eng: "Move aside, man! The ladle will strike right on your nose!"
    }
  },
  {
    id: 13,
    name: "Banana Chips (Upperi)",
    malayalam: "ഉപ്പേരി (കായ വറുത്തത്)",
    traditionRule: "Bottom-left corner of the leaf",
    ponjiRule: '"Dropped from 3,000 feet in the air! Scattered across the top edge!"',
    soundType: "crunch",
    impactText: "CRISPY-CRUNCH!",
    imgSrc: "assets/dishes/real_upperi.png",
    targetPos: { top: 18, left: 65, width: 85, height: 85 },
    dialogue: {
      mal: "ഉപ്പേരി ഇട്ടത് കണ്ടില്ലേ? എയറിൽ നിന്നാണ് ഡ്രോപ്പ് ചെയ്തത്!",
      mang: "Upperi ittathu kandille? Air-il ninnanu drop cheythathu!",
      eng: "Did you see that Upperi drop? Dropped straight from mid-air!"
    }
  },
  {
    id: 14,
    name: "Sharkara Varatti",
    malayalam: "ശർക്കര വരട്ടി",
    traditionRule: "Beside banana chips on the bottom-left leaf corner",
    ponjiRule: '"Parked right next to the hot spicy sambar! Sweet and sour clash!"',
    soundType: "crunch",
    impactText: "JAGGERY-CRUNCH!",
    imgSrc: "assets/dishes/real_sharkara.png",
    targetPos: { top: 76, left: 35, width: 80, height: 80 },
    dialogue: {
      mal: "ശർക്കര വരട്ടി തിന്ന് വായ മധുരിപ്പിക്ക്... എന്നിട്ട് വാദിക്കാം!",
      mang: "Sharkara varatti thinnu vaaya madhurippikku... ennittu vaadhikkaam!",
      eng: "Sweeten your mouth with Sharkara Varatti... then we can argue!"
    }
  },
  {
    id: 15,
    name: "Pappadam",
    malayalam: "പപ്പടം (രണ്ടാമത് ചോദിക്കരുത്!)",
    traditionRule: "Crushed over rice or placed beside banana chips",
    ponjiRule: '"SLAMMED right on top of rice! And DO NOT dare ask for a second one!"',
    soundType: "crunch",
    impactText: "PAP-PA-DAM-CRACK!",
    imgSrc: "assets/dishes/real_pappadam.png",
    targetPos: { top: 55, left: 45, width: 145, height: 135 },
    dialogue: {
      mal: "എടോ... തന്നോടല്ലേ രണ്ടാമത് പപ്പടം ചോദിക്കല്ലേ എന്ന് പറഞ്ഞത്?!",
      mang: "Edo.. thannodalle randaamathu pappadam chodikkallennu paranjathu?!",
      eng: "Didn't I specifically tell you NOT to ask for a second pappadam?!"
    }
  },
  {
    id: 16,
    name: "Palada Payasam",
    malayalam: "പാലട പായസം",
    traditionRule: "Served on the right corner of leaf in clean fold or tumbler after meal",
    ponjiRule: '"DROWN THE ENTIRE RICE MOUND! That\'s how Kesavan delivers sweet perfection!"',
    soundType: "splat",
    impactText: "PAYASAM-AVALANCHE!",
    imgSrc: "assets/dishes/real_payasam.png",
    targetPos: { top: 62, left: 48, width: 175, height: 120 },
    dialogue: {
      mal: "പായസം ചോറിന്റെ മേലെ ഒഴിച്ചാലേ അതിന്റെ ഒറിജിനൽ കിക്ക് കിട്ടൂ! സദ്യ ഫിനിഷ്!",
      mang: "Payasam chorinte mele ozhichale athinte original kick kittoo! Sadhya finish!",
      eng: "Only when Payasam smothers the rice do you get the true kick! Sadhya is complete!"
    }
  }
];

// ============================================================================
// 3. MAVELI REACTION STATES
// ============================================================================
const MAVELI_REACTIONS = [
  { count: 0, text: "Mood: Hungry & Eager 😋" },
  { count: 2, text: "Mood: Confused by the placement 🤨" },
  { count: 5, text: "Mood: Watching Ponjikkara nervously 😟" },
  { count: 9, text: "Mood: Silently protesting the chaos 😨" },
  { count: 12, text: "Mood: Wondering who invited Kesavan 😱" },
  { count: 14, text: "Mood: Desperately wanting a 2nd pappadam 🥺" },
  { count: 16, text: "Mood: Complete surrender to Kesavan! 🙌" }
];

// ============================================================================
// 4. GAME STATE & CONTROLLER
// ============================================================================
class PonjikkaraSadhyaGame {
  constructor() {
    this.audio = new AudioEngine();
    this.currentDishIndex = 0;
    this.isServing = false;

    // DOM Elements
    this.tableArena = document.getElementById('dining-table-arena');
    this.bananaLeaf = document.getElementById('banana-leaf');
    this.dishesContainer = document.getElementById('dishes-container');
    this.clickMarkersContainer = document.getElementById('click-markers-container');
    this.ladleContainer = document.getElementById('ladle-anim-container');
    this.speechBubble = document.getElementById('speech-bubble');
    this.bubbleMal = document.getElementById('bubble-malayalam');
    this.bubbleMang = document.getElementById('bubble-manglish');
    this.bubbleEng = document.getElementById('bubble-english');
    this.ponjiCard = document.getElementById('ponjikkara-card');
    this.maveliCard = document.getElementById('maveli-card');
    this.maveliMood = document.getElementById('maveli-mood');

    // HUD Elements
    this.counterNum = document.getElementById('counter-num');
    this.progressFill = document.getElementById('hud-progress-fill');
    this.currentDishName = document.getElementById('current-dish-name');
    this.currentDishMal = document.getElementById('current-dish-malayalam');

    // Buttons & Modals
    this.songToggleBtn = document.getElementById('song-toggle-btn');
    this.guideBtn = document.getElementById('guide-btn');
    this.resetBtn = document.getElementById('reset-btn');
    this.serveNextBtn = document.getElementById('serve-next-btn');
    this.completionModal = document.getElementById('completion-modal');
    this.modalReplayBtn = document.getElementById('modal-replay-btn');
    this.guideModal = document.getElementById('guide-modal');
    this.guideCloseBtn = document.getElementById('guide-close-btn');

    this.confettiCanvas = document.getElementById('confetti-canvas');
    this.confettiCtx = this.confettiCanvas.getContext('2d');
    this.confettiParticles = [];
    this.confettiAnimId = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateHUD();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  bindEvents() {
    // 1. User clicks anywhere on the dining table or banana leaf in front of Mahabali
    this.tableArena.addEventListener('click', (e) => {
      if (e.target.closest('.ctrl-btn, .action-btn, .modal-content, .placed-dish')) return;
      this.handleUserClick(e);
    });

    // Intro Screen Enter Button
    const introScreen = document.getElementById('intro-screen');
    const startGameBtn = document.getElementById('start-game-btn');
    if (startGameBtn && introScreen) {
      startGameBtn.addEventListener('click', () => {
        if (!this.audio.isSongPlaying) {
          this.audio.playSong();
        }
        introScreen.classList.add('fade-out');
        setTimeout(() => {
          introScreen.style.display = 'none';
        }, 550);
      });
    }

    // Auto start song on first user click
    const autoPlaySongOnInteraction = () => {
      if (!this.audio.isSongPlaying) {
        this.audio.playSong();
      }
      window.removeEventListener('click', autoPlaySongOnInteraction);
    };
    window.addEventListener('click', autoPlaySongOnInteraction);

    // 2. Click serve button in footer
    this.serveNextBtn.addEventListener('click', () => {
      if (this.currentDishIndex < SADHYA_DISHES.length) {
        const leafRect = this.bananaLeaf.getBoundingClientRect();
        this.triggerPonjikkaraServe(leafRect.left + leafRect.width * 0.5, leafRect.top + leafRect.height * 0.5);
      } else {
        this.openCompletionModal();
      }
    });

    // 3. Reset Button
    this.resetBtn.addEventListener('click', () => this.resetGame());
    this.modalReplayBtn.addEventListener('click', () => {
      this.closeCompletionModal();
      this.resetGame();
    });

    // 4. Background Song Toggle
    if (this.songToggleBtn) {
      this.songToggleBtn.addEventListener('click', () => {
        this.audio.toggleSong();
      });
    }

    // 5. Guide Modal
    this.guideBtn.addEventListener('click', () => {
      this.guideModal.classList.add('active');
    });
    this.guideCloseBtn.addEventListener('click', () => {
      this.guideModal.classList.remove('active');
    });
    this.guideModal.addEventListener('click', (e) => {
      if (e.target === this.guideModal) {
        this.guideModal.classList.remove('active');
      }
    });
  }

  handleUserClick(event) {
    if (this.isServing) return;
    if (this.currentDishIndex >= SADHYA_DISHES.length) {
      this.openCompletionModal();
      return;
    }

    this.triggerPonjikkaraServe(event.clientX, event.clientY);
  }

  triggerPonjikkaraServe(clientX, clientY) {
    if (this.isServing) return;
    this.isServing = true;

    const dish = SADHYA_DISHES[this.currentDishIndex];

    // Step 1: Render REJECTED Marker on User's Click Location
    this.renderRejectMarker(clientX, clientY);
    this.audio.playRejectBuzzer();

    // Step 2: Ponjikkara reacts! Speech bubble + Voice + Windup animation
    this.displayDialogue(dish.dialogue);
    this.audio.speak(dish.dialogue.mang);

    this.ponjiCard.classList.remove('ponjikkara-serving-action');
    void this.ponjiCard.offsetWidth; // trigger reflow
    this.ponjiCard.classList.add('ponjikkara-serving-action');

    // Step 3: Ladle Flight Animation across table onto Mahabali's leaf
    this.audio.playWhoosh();
    this.animateLadleFlight(dish.targetPos, () => {
      // Step 4: Realistic dish lands on Mahabali's leaf
      this.placeDishOnLeaf(dish);

      // Step 5: Sound effect according to dish type
      if (dish.soundType === 'splat') {
        this.audio.playSplat();
      } else if (dish.soundType === 'crunch') {
        this.audio.playCrunch();
      } else if (dish.soundType === 'sizzle') {
        this.audio.playSizzle();
      } else {
        this.audio.playSplat();
      }

      // Step 6: Comic Impact Text ("SPLAT!", "DUM!", "CRUNCH!")
      this.renderComicImpactText(dish.targetPos, dish.impactText);

      // Step 7: Update Maveli Reaction right behind the leaf
      this.updateMaveliReaction();

      // Step 8: Increment counter & update HUD
      this.currentDishIndex++;
      this.updateHUD();

      // Step 9: Check completion
      if (this.currentDishIndex >= SADHYA_DISHES.length) {
        setTimeout(() => {
          this.audio.playVictoryFanfare();
          this.startConfetti();
          this.openCompletionModal();
        }, 850);
      }

      this.isServing = false;
    });
  }

  renderRejectMarker(clientX, clientY) {
    const leafRect = this.bananaLeaf.getBoundingClientRect();
    const x = clientX - leafRect.left;
    const y = clientY - leafRect.top;

    const marker = document.createElement('div');
    marker.className = 'click-reject-marker';
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;

    marker.innerHTML = `
      <div class="reject-target-ring"></div>
      <div class="reject-stamp">❌ REJECTED!</div>
    `;

    this.clickMarkersContainer.appendChild(marker);

    setTimeout(() => {
      if (marker.parentNode) {
        marker.parentNode.removeChild(marker);
      }
    }, 1600);
  }

  displayDialogue(dialogue) {
    this.bubbleMal.textContent = `"${dialogue.mal}"`;
    this.bubbleMang.textContent = `"${dialogue.mang}"`;
    this.bubbleEng.textContent = `"${dialogue.eng}"`;

    this.speechBubble.classList.add('show');

    if (this.speechTimeout) clearTimeout(this.speechTimeout);
    this.speechTimeout = setTimeout(() => {
      this.speechBubble.classList.remove('show');
    }, 4500);
  }

  animateLadleFlight(targetPos, onComplete) {
    const leafRect = this.bananaLeaf.getBoundingClientRect();
    const tableRect = this.tableArena.getBoundingClientRect();
    const ponjiRect = this.ponjiCard.getBoundingClientRect();

    // Start position: Originates right from Ponjikkara's avatar hands
    const startX = (ponjiRect.left - tableRect.left) + ponjiRect.width * 0.25;
    const startY = (ponjiRect.top - tableRect.top) + ponjiRect.height * 0.35;

    // Target landing coordinate inside table directly on Mahabali's leaf
    const destX = (leafRect.left - tableRect.left) + (leafRect.width * (targetPos.left / 100));
    const destY = (leafRect.top - tableRect.top) + (leafRect.height * (targetPos.top / 100));

    const ladle = this.ladleContainer;
    ladle.classList.add('active');
    ladle.style.left = `${startX}px`;
    ladle.style.top = `${startY}px`;
    ladle.style.transform = 'scale(0.8) rotate(-45deg)';
    ladle.style.transition = 'none';

    // Force reflow
    void ladle.offsetWidth;

    // High speed curved physics swoop across the dining table
    ladle.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    ladle.style.left = `${destX - 25}px`;
    ladle.style.top = `${destY - 60}px`;
    ladle.style.transform = 'scale(1.15) rotate(22deg)';

    setTimeout(() => {
      // Retract ladle back to Kesavan
      ladle.style.transition = 'all 0.35s ease-out';
      ladle.style.left = `${startX}px`;
      ladle.style.top = `${startY}px`;
      ladle.style.transform = 'scale(0.7) rotate(-35deg)';

      setTimeout(() => {
        ladle.classList.remove('active');
      }, 350);

      if (onComplete) onComplete();
    }, 400);
  }

  placeDishOnLeaf(dish) {
    const dishElem = document.createElement('div');
    dishElem.className = 'placed-dish dish-splat-anim';
    dishElem.id = `dish-item-${dish.id}`;
    dishElem.title = `${dish.name} (${dish.malayalam})`;
    dishElem.style.top = `${dish.targetPos.top}%`;
    dishElem.style.left = `${dish.targetPos.left}%`;
    dishElem.style.width = `${dish.targetPos.width}px`;
    dishElem.style.height = `${dish.targetPos.height}px`;

    dishElem.innerHTML = `<img src="${dish.imgSrc}" alt="${dish.name}" />`;

    // Clicking an already placed dish repeats Ponjikkara's quote!
    dishElem.addEventListener('click', (e) => {
      e.stopPropagation();
      this.displayDialogue(dish.dialogue);
      this.audio.speak(dish.dialogue.mang);
      this.audio.playSplat();
    });

    this.dishesContainer.appendChild(dishElem);
  }

  renderComicImpactText(targetPos, text) {
    const impact = document.createElement('div');
    impact.className = 'comic-impact-text';
    impact.textContent = text;
    impact.style.top = `${Math.max(10, targetPos.top - 8)}%`;
    impact.style.left = `${targetPos.left}%`;

    this.dishesContainer.appendChild(impact);

    setTimeout(() => {
      if (impact.parentNode) {
        impact.parentNode.removeChild(impact);
      }
    }, 850);
  }

  updateMaveliReaction() {
    let reaction = MAVELI_REACTIONS[0];
    for (let r of MAVELI_REACTIONS) {
      if (this.currentDishIndex + 1 >= r.count) {
        reaction = r;
      }
    }

    this.maveliMood.textContent = reaction.text;

    this.maveliCard.classList.remove('maveli-shocked');
    void this.maveliCard.offsetWidth; // trigger reflow
    this.maveliCard.classList.add('maveli-shocked');
  }

  updateHUD() {
    const count = this.currentDishIndex;
    const total = SADHYA_DISHES.length;

    this.counterNum.textContent = count;
    this.progressFill.style.width = `${(count / total) * 100}%`;

    if (count < total) {
      const nextDish = SADHYA_DISHES[count];
      this.currentDishName.textContent = nextDish.name;
      this.currentDishMal.textContent = nextDish.malayalam;
    } else {
      this.currentDishName.textContent = "Sadhya Complete!";
      this.currentDishMal.textContent = "സദ്യ പൂർത്തിയായി!";
    }
  }

  resetGame() {
    this.currentDishIndex = 0;
    this.dishesContainer.innerHTML = '';
    this.clickMarkersContainer.innerHTML = '';
    this.maveliMood.textContent = "Mood: Hungry & Eager 😋";
    this.stopConfetti();
    this.updateHUD();
    this.displayDialogue({
      mal: "തന്നോടല്ലേ രണ്ടാമത് പപ്പടം ചോദിക്കല്ലേ എന്ന് പറഞ്ഞത്!",
      mang: "Thannodalle randaamathu pappadam chodikkallennu paranjathu!",
      eng: "Didn't I tell you not to ask for a second pappadam?!"
    });
    this.audio.speak("Thannodalle randaamathu pappadam chodikkallennu paranjathu!");
  }

  openCompletionModal() {
    this.completionModal.classList.add('active');
  }

  closeCompletionModal() {
    this.completionModal.classList.remove('active');
    this.stopConfetti();
  }

  // ==========================================================================
  // CONFETTI CELEBRATION ENGINE
  // ==========================================================================
  resizeCanvas() {
    this.confettiCanvas.width = window.innerWidth;
    this.confettiCanvas.height = window.innerHeight;
  }

  startConfetti() {
    this.confettiParticles = [];
    const colors = ['#f5b025', '#ffd460', '#d32f2f', '#4caf50', '#ffffff', '#ff9800'];
    const count = 140;

    for (let i = 0; i < count; i++) {
      this.confettiParticles.push({
        x: Math.random() * this.confettiCanvas.width,
        y: Math.random() * -this.confettiCanvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 3 + 2,
        rot: Math.random() * 360,
        rotSpeed: Math.random() * 8 - 4
      });
    }

    if (this.confettiAnimId) cancelAnimationFrame(this.confettiAnimId);
    this.renderConfetti();
  }

  renderConfetti() {
    const ctx = this.confettiCtx;
    ctx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

    for (let p of this.confettiParticles) {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      ctx.restore();

      // Wrap around
      if (p.y > this.confettiCanvas.height) {
        p.y = -20;
        p.x = Math.random() * this.confettiCanvas.width;
      }
    }

    this.confettiAnimId = requestAnimationFrame(() => this.renderConfetti());
  }

  stopConfetti() {
    if (this.confettiAnimId) {
      cancelAnimationFrame(this.confettiAnimId);
      this.confettiAnimId = null;
    }
    this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
  }
}

// Start Game on Page Load
window.addEventListener('DOMContentLoaded', () => {
  window.ponjiGame = new PonjikkaraSadhyaGame();
});
