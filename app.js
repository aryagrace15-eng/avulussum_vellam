/**
 * Ponjikkara Cuisine - Main Game Logic & Chaos State Orchestrator
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvasElem = document.getElementById('leafCanvas');
  const tableStageContainer = document.getElementById('tableStageContainer');
  const physics = new FoodPhysicsEngine(canvasElem);

  // Intro Screen Elements
  const introScreen = document.getElementById('introScreen');
  const btnStartGame = document.getElementById('btnStartGame');

  // UI Step Progress Elements
  const stepCounterElem = document.getElementById('stepCounter');
  const itemIconElem = document.getElementById('itemIcon');
  const itemNameMlElem = document.getElementById('itemNameMl');
  const itemNameEnElem = document.getElementById('itemNameEn');
  const progressBarElem = document.getElementById('progressBar');
  const promptTextMlElem = document.getElementById('promptTextMl');
  const promptTextEnElem = document.getElementById('promptTextEn');

  // Ponjikkara Speech Bubble Elements
  const ponjikkaraSpeechBubble = document.getElementById('ponjikkaraSpeechBubble');
  const speechBubbleText = document.getElementById('speechBubbleText');

  // Controls & Modal Buttons
  const btnSoundToggle = document.getElementById('btnSoundToggle');
  const btnVoiceToggle = document.getElementById('btnVoiceToggle');
  const btnRestart = document.getElementById('btnRestart');
  const btnRestartFromModal = document.getElementById('btnRestartFromModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const scorecardModal = document.getElementById('scorecardModal');
  const scorecardPreview = document.getElementById('scorecardPreview');
  const btnDownloadScorecard = document.getElementById('btnDownloadScorecard');

  // Game State
  let currentStep = 0;
  let isAnimating = false;
  let gameStarted = false;

  // Intro Start Game Button ("കഴിക്കാം!")
  btnStartGame.addEventListener('click', () => {
    try {
      sadhyaAudio.init();
      sadhyaAudio.playChendaStroke(200, 0.3);
    } catch (e) {
      console.warn("Audio init error:", e);
    }
    introScreen.style.opacity = '0';
    setTimeout(() => {
      introScreen.style.display = 'none';
      introScreen.style.opacity = '1';
    }, 400);

    gameStarted = true;
    updateStepUI();
  });

  // Handle Click Anywhere on Leaf Canvas / Table Stage ("Ponjikkara Logic")
  function handleServingClick(e) {
    if (!gameStarted || isAnimating || currentStep >= SADHYA_ITEMS.length) return;

    sadhyaAudio.init();

    const rect = canvasElem.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const scaleX = canvasElem.width / rect.width;
    const scaleY = canvasElem.height / rect.height;

    // User's clicked location (which will be IGNORED completely by Ponjikkara!)
    const userPos = {
      x: clickX * scaleX,
      y: clickY * scaleY
    };

    const item = SADHYA_ITEMS[currentStep];
    isAnimating = true;

    // Speak Sarcastic Malayalam Quote Out Loud via Web Speech API
    sadhyaAudio.speakText(item.malayalamQuote);

    // Update Ponjikkara Live Speech Bubble
    showSpeechBubble(item.malayalamQuote);

    // Trigger Malicious Redirect Placement Animation with Ponjikkara Keshavan Hand Serving Motion!
    physics.triggerPlacement(userPos, item.wrongTarget, item, () => {
      isAnimating = false;

      // Advance Step
      currentStep++;

      if (currentStep < SADHYA_ITEMS.length) {
        updateStepUI();
      } else {
        // Grand Finale! 16 Items Complete -> Show Disaster Scorecard
        triggerDisasterScorecard();
      }
    });
  }

  tableStageContainer.addEventListener('click', handleServingClick);
  canvasElem.addEventListener('click', (e) => {
    e.stopPropagation();
    handleServingClick(e);
  });

  // Display Ponjikkara Speech Bubble
  function showSpeechBubble(quoteText) {
    speechBubbleText.textContent = `💬 "${quoteText}"`;
    ponjikkaraSpeechBubble.classList.add('scale-105', 'border-amber-400');
    setTimeout(() => {
      ponjikkaraSpeechBubble.classList.remove('scale-105');
    }, 400);
  }

  // Hover Effect Cursor Tracker
  canvasElem.addEventListener('mousemove', (e) => {
    if (!gameStarted) return;
    const rect = canvasElem.getBoundingClientRect();
    const scaleX = canvasElem.width / rect.width;
    const scaleY = canvasElem.height / rect.height;

    physics.setHoverPos({
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    });
  });

  canvasElem.addEventListener('mouseleave', () => {
    physics.setHoverPos(null);
  });

  // Update Progress & Prompt UI
  function updateStepUI() {
    const item = SADHYA_ITEMS[currentStep];
    stepCounterElem.textContent = `Dishes Served: ${currentStep + 1} / 16`;
    itemIconElem.textContent = item.icon;
    itemNameMlElem.textContent = item.nameMl;
    itemNameEnElem.textContent = item.nameEn;

    promptTextMlElem.textContent = `👉 "${item.instructionMl}"`;
    promptTextEnElem.textContent = `Click anywhere on the banana leaf to choose where Ponjikkara should serve ${item.nameEn}!`;

    const progressPct = ((currentStep + 1) / SADHYA_ITEMS.length) * 100;
    progressBarElem.style.width = `${progressPct}%`;
  }

  // Grand Finale Disaster Scorecard Trigger
  async function triggerDisasterScorecard() {
    sadhyaAudio.playChendaVictoryRoll();
    sadhyaAudio.playFailSound();

    promptTextMlElem.textContent = "🏆 സദ്യ റെഡി! പൊഞ്ചിക്കര സ്റ്റൈലിൽ സദ്യ തയ്യാറായി!";
    promptTextEnElem.textContent = "All 16 dishes served Ponjikkara style! View your disaster report card below!";
    showSpeechBubble("സദ്യ റെഡി! പൊഞ്ചിക്കര സ്റ്റൈലിൽ! തമ്പുരാനേ കഴിക്ക്!");

    const scorecardDataUrl = await ScorecardGenerator.generateReportCard(canvasElem, physics.placedItems);

    scorecardPreview.innerHTML = `<img src="${scorecardDataUrl}" alt="Disaster Scorecard" class="max-w-full">`;
    btnDownloadScorecard.href = scorecardDataUrl;
    scorecardModal.classList.remove('hidden');
    scorecardModal.style.display = 'flex';
  }

  // Restart Game Function
  function restartGame() {
    currentStep = 0;
    isAnimating = false;
    physics.reset();

    scorecardModal.classList.add('hidden');
    scorecardModal.style.display = 'none';

    speechBubbleText.textContent = `💬 "ചേട്ടാ ലേശം കറി കോരി ഒഴിക്കട്ടെ?" 🍲`;

    updateStepUI();
  }

  // Control Event Listeners
  btnRestart.addEventListener('click', restartGame);
  btnRestartFromModal.addEventListener('click', restartGame);
  btnCloseModal.addEventListener('click', () => {
    scorecardModal.classList.add('hidden');
    scorecardModal.style.display = 'none';
  });

  btnSoundToggle.addEventListener('click', () => {
    const isMuted = sadhyaAudio.toggleMute();
    document.getElementById('lblSound').textContent = isMuted ? "Sound OFF" : "Sound ON";
    document.getElementById('iconSound').textContent = isMuted ? "🔇" : "🔊";
  });

  btnVoiceToggle.addEventListener('click', () => {
    const isVoiceOn = sadhyaAudio.toggleSpeech();
    document.getElementById('lblVoice').textContent = isVoiceOn ? "Voice ON" : "Voice OFF";
    document.getElementById('iconVoice').textContent = isVoiceOn ? "🗣️" : "🔇";
  });
});
