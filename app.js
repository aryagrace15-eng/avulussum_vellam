/**
 * Ponjikkara Cuisine - Main Game Logic & Chaos State Orchestrator
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvasElem = document.getElementById('leafCanvas');
  const tableStageContainer = document.getElementById('tableStageContainer');
  const leafTooltip = document.getElementById('leafTooltip');
  const physics = new FoodPhysicsEngine(canvasElem);

  // Intro Screen Elements
  const introScreen = document.getElementById('introScreen');
  const btnStartGame = document.getElementById('btnStartGame');

  // Bottom HUD Elements
  const counterBadge = document.getElementById('counterBadge');
  const itemNameEn = document.getElementById('itemNameEn');
  const itemNameMl = document.getElementById('itemNameMl');
  const properEtiquetteText = document.getElementById('properEtiquetteText');
  const ponjikkaraLogicText = document.getElementById('ponjikkaraLogicText');
  const btnServe = document.getElementById('btnServe');
  const btnRestart = document.getElementById('btnRestart');

  // Ponjikkara Speech Bubble Elements
  const ponjikkaraSpeechBubble = document.getElementById('ponjikkaraSpeechBubble');
  const speechBubbleText = document.getElementById('speechBubbleText');

  // Controls & Modal Buttons
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

  // Handle Serving Trigger (Clicking Leaf Canvas OR clicking "Serve!" button)
  function handleServingClick(e) {
    if (!gameStarted || isAnimating || currentStep >= SADHYA_ITEMS.length) return;

    sadhyaAudio.init();

    let userPos = { x: canvasElem.width * 0.5, y: canvasElem.height * 0.5 };
    if (e && e.clientX) {
      const rect = canvasElem.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const scaleX = canvasElem.width / rect.width;
      const scaleY = canvasElem.height / rect.height;
      userPos = { x: clickX * scaleX, y: clickY * scaleY };
    }

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
  if (btnServe) btnServe.addEventListener('click', handleServingClick);

  // Display Ponjikkara Speech Bubble
  function showSpeechBubble(quoteText) {
    speechBubbleText.textContent = `💬 "${quoteText}"`;
    ponjikkaraSpeechBubble.classList.add('scale-105', 'border-amber-400');
    setTimeout(() => {
      ponjikkaraSpeechBubble.classList.remove('scale-105');
    }, 400);
  }

  // Hover Crosshair Tooltip Follower over Banana Leaf
  tableStageContainer.addEventListener('mousemove', (e) => {
    if (!gameStarted) return;
    const rect = tableStageContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    leafTooltip.style.left = `${x + 12}px`;
    leafTooltip.style.top = `${y - 12}px`;
    leafTooltip.classList.remove('hidden');
    leafTooltip.classList.add('flex');

    const scaleX = canvasElem.width / rect.width;
    const scaleY = canvasElem.height / rect.height;

    physics.setHoverPos({
      x: x * scaleX,
      y: y * scaleY
    });
  });

  tableStageContainer.addEventListener('mouseleave', () => {
    leafTooltip.classList.add('hidden');
    leafTooltip.classList.remove('flex');
    physics.setHoverPos(null);
  });

  // Update Progress & Bottom HUD Info
  function updateStepUI() {
    const item = SADHYA_ITEMS[currentStep];

    counterBadge.textContent = `${currentStep} / 16`;
    itemNameEn.textContent = item.nameEn;
    itemNameMl.textContent = item.nameMl;

    properEtiquetteText.textContent = item.properEtiquette || "Golden dal served directly over center rice mound, followed by hot ghee";
    ponjikkaraLogicText.textContent = item.ponjikkaraLogic || item.englishQuote;
  }

  // Grand Finale Disaster Scorecard Trigger
  async function triggerDisasterScorecard() {
    sadhyaAudio.playChendaVictoryRoll();
    sadhyaAudio.playFailSound();

    counterBadge.textContent = `16 / 16`;
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
  if (btnRestart) btnRestart.addEventListener('click', restartGame);
  if (btnRestartFromModal) btnRestartFromModal.addEventListener('click', restartGame);
  if (btnCloseModal) btnCloseModal.addEventListener('click', () => {
    scorecardModal.classList.add('hidden');
    scorecardModal.style.display = 'none';
  });
});
