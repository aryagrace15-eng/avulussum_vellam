/**
 * Ponjikkara Cuisine - Canvas Physics & Clean Empty Banana Leaf Renderer
 * Features:
 * - Empty Fresh Green Banana Leaf Base (assets/banana_leaf_base.png)
 * - Real Photo Crop Renderer for Kerala Sadhya Dishes (assets/realistic_sadhya.jpg)
 * - Steaming Vapor Physics
 * - Malicious Trajectory Redirect & Splatter Physics Engine
 * - Ponjikkara Keshavan Arm & Ladle Pouring Animation
 */

class FoodPhysicsEngine {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');

    // Load Clean Empty Banana Leaf Base Image
    this.leafBaseImg = new Image();
    this.leafBaseLoaded = false;
    this.leafBaseImg.src = 'assets/banana_leaf_base.png';
    this.leafBaseImg.onload = () => {
      this.leafBaseLoaded = true;
      this.render();
    };

    // Load Realistic Sadhya Image for Real Photo Crops of dishes
    this.realSadhyaImg = new Image();
    this.realSadhyaLoaded = false;
    this.realSadhyaImg.src = 'assets/realistic_sadhya.jpg';
    this.realSadhyaImg.onload = () => {
      this.realSadhyaLoaded = true;
      this.render();
    };

    // Load Ponjikkara Keshavan Character Sprite
    this.serverSprite = new Image();
    this.serverLoaded = false;
    this.serverSprite.src = 'assets/ponjikkara_keshavan.png';
    this.serverSprite.onload = () => {
      this.serverLoaded = true;
      this.render();
    };

    // Placed food items array (Starts 100% EMPTY!)
    this.placedItems = [];

    // Active animation particles (splatters, droplets, trajectories)
    this.animatingParticles = [];
    this.activeTrajectory = null;

    // Steaming Vapor Particles
    this.steamParticles = [];

    // Ponjikkara Keshavan Animation State
    this.serverAnim = {
      visible: false,
      x: 0,
      y: 0,
      armAngle: 0,
      ladleDip: 0,
      pourProgress: 0,
      speechQuote: ""
    };

    // Hover target indicator
    this.hoverPos = null;
    this.animTime = 0;

    this.setupResize();
    this.startContinuousAnimationLoop();
  }

  setupResize() {
    const updateSize = () => {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.width; // 1:1 aspect ratio square canvas
      this.render();
    };
    window.addEventListener('resize', updateSize);
    setTimeout(updateSize, 100);
  }

  startContinuousAnimationLoop() {
    const loop = () => {
      this.animTime += 0.03;
      if (this.placedItems.length > 0) {
        this.updateSteamParticles();
      }
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  updateSteamParticles() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const riceCenterX = w * 0.5;
    const riceCenterY = h * 0.55;

    // Spawn steam vapor particles from hot curries served on the leaf
    if (Math.random() < 0.35) {
      this.steamParticles.push({
        x: riceCenterX + (Math.random() - 0.5) * 120,
        y: riceCenterY + (Math.random() - 0.5) * 90,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.8 - Math.random() * 0.6,
        radius: 8 + Math.random() * 14,
        alpha: 0.35,
        growth: 0.22
      });
    }

    for (let i = this.steamParticles.length - 1; i >= 0; i--) {
      const p = this.steamParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.radius += p.growth;
      p.alpha -= 0.008;

      if (p.alpha <= 0) {
        this.steamParticles.splice(i, 1);
      }
    }
  }

  setHoverPos(pos) {
    this.hoverPos = pos;
  }

  // Trigger Malicious Redirect Animation ("Ponjikkara Logic")
  triggerPlacement(userPos, wrongPosRatio, item, onComplete) {
    const w = this.canvas.width;
    const h = this.canvas.height;

    const startX = userPos.x;
    const startY = userPos.y;

    const targetX = wrongPosRatio.x * w;
    const targetY = wrongPosRatio.y * h;

    const controlX = (startX + targetX) / 2 + (Math.random() > 0.5 ? 160 : -160);
    const controlY = Math.min(startY, targetY) - 110;

    let progress = 0;
    const duration = 48; // ~0.8s fast comedic slide

    // Setup Ponjikkara position near click with quote
    this.serverAnim = {
      visible: true,
      x: startX + 90,
      y: startY - 110,
      armAngle: 0,
      ladleDip: 0,
      pourProgress: 0,
      speechQuote: item.malayalamQuote || "ചേട്ടാ ലേശം കറി!"
    };

    this.activeTrajectory = {
      startX, startY,
      targetX, targetY,
      controlX, controlY,
      item,
      progress: 0
    };

    sadhyaAudio.playRedirectSlideSound();

    const animLoop = () => {
      progress += 1 / duration;
      if (progress < 1) {
        this.activeTrajectory.progress = progress;
        this.serverAnim.pourProgress = progress;

        // Arm ladle dip and swing
        this.serverAnim.armAngle = Math.sin(progress * Math.PI) * 0.45;
        this.serverAnim.ladleDip = Math.sin(progress * Math.PI) * 25;

        // Curve stream head location
        const t = progress;
        const cx = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * targetX;
        const cy = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * targetY;

        // Move server character along with pour stream
        this.serverAnim.x = cx + 80;
        this.serverAnim.y = cy - 100;

        // Trailing droplets
        if (Math.random() < 0.7) {
          this.animatingParticles.push({
            x: cx + (Math.random() - 0.5) * 18,
            y: cy + (Math.random() - 0.5) * 18,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            radius: 3 + Math.random() * 6,
            color: item.color,
            life: 1.0
          });
        }

        requestAnimationFrame(animLoop);
      } else {
        // Animation landed at wrong target!
        this.activeTrajectory = null;
        this.serverAnim.visible = false;

        this.createSplatter(targetX, targetY, item);

        this.placedItems.push({
          x: targetX,
          y: targetY,
          item: item
        });

        if (item.textureType === 'crispy_pappadam') {
          sadhyaAudio.playCrunchSound();
        } else {
          sadhyaAudio.playPourSound();
        }

        if (onComplete) onComplete();
      }
    };

    requestAnimationFrame(animLoop);
  }

  createSplatter(cx, cy, item) {
    const numParticles = item.splatterRadius || 45;
    for (let i = 0; i < numParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 10;
      this.animatingParticles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2.5 + Math.random() * 6,
        color: Math.random() < 0.7 ? item.color : item.secondaryColor,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.03
      });
    }
  }

  render() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.ctx.clearRect(0, 0, w, h);

    // 1. Draw Clean Empty Banana Leaf Base Centerpiece (assets/banana_leaf_base.png)
    this.ctx.save();
    const leafSwayY = Math.sin(this.animTime) * 3;

    if (this.leafBaseLoaded) {
      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      this.ctx.shadowBlur = 24;
      this.ctx.shadowOffsetY = 12;

      const leafMargin = w * 0.03;
      this.ctx.drawImage(this.leafBaseImg, leafMargin, leafMargin + leafSwayY, w - leafMargin * 2, h - leafMargin * 2);
    } else {
      // Vector Banana Leaf Base Fallback
      this.ctx.fillStyle = '#15803D';
      this.ctx.beginPath();
      this.ctx.roundRect(20, 20 + leafSwayY, w - 40, h - 40, 30);
      this.ctx.fill();
    }
    this.ctx.restore();

    // 2. Draw Steaming Vapor Particles (if food is served)
    if (this.placedItems.length > 0) {
      this.ctx.save();
      this.steamParticles.forEach(p => {
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
      });
      this.ctx.restore();
    }

    // 3. Draw Placed Food Items (Dishes served sequentially on the leaf)
    this.placedItems.forEach(placed => {
      this.drawFoodItem(placed.x, placed.y, placed.item);
    });

    // 4. Draw Dynamic Splatter Particles
    for (let i = this.animatingParticles.length - 1; i >= 0; i--) {
      const p = this.animatingParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.92;
      p.vy *= 0.92;
      p.life -= p.decay || 0.02;

      if (p.life <= 0) {
        this.animatingParticles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.life);
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 5. Draw Active Trajectory Curved Arrow & Pouring Stream
    if (this.activeTrajectory) {
      const traj = this.activeTrajectory;
      const t = traj.progress;

      // Draw User Click Marker vs Wrong Target Trajectory Curve
      this.ctx.save();
      this.ctx.strokeStyle = '#EF4444';
      this.ctx.lineWidth = 4;
      this.ctx.setLineDash([8, 6]);
      this.ctx.beginPath();
      this.ctx.moveTo(traj.startX, traj.startY);
      this.ctx.quadraticCurveTo(traj.controlX, traj.controlY, traj.targetX, traj.targetY);
      this.ctx.stroke();

      // Clicked Location Indicator ("User Choice Ignored!")
      this.ctx.strokeStyle = '#22C55E';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(traj.startX, traj.startY, 16, 0, Math.PI * 2);
      this.ctx.stroke();

      const cx = (1 - t) * (1 - t) * traj.startX + 2 * (1 - t) * t * traj.controlX + t * t * traj.targetX;
      const cy = (1 - t) * (1 - t) * traj.startY + 2 * (1 - t) * t * traj.controlY + t * t * traj.targetY;

      // Pouring Stream Glow
      this.ctx.fillStyle = traj.item.color;
      this.ctx.shadowColor = traj.item.color;
      this.ctx.shadowBlur = 20;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = '24px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(traj.item.icon, cx, cy + 8);
      this.ctx.restore();
    }

    // 6. Draw Animated Ponjikkara Keshavan Caricature Character & Ladle Motion
    if (this.serverAnim.visible && this.serverLoaded) {
      this.ctx.save();
      const serverW = 190;
      const serverH = 190;

      const px = this.serverAnim.x;
      const py = this.serverAnim.y;

      this.ctx.translate(px, py);
      this.ctx.rotate(this.serverAnim.armAngle);

      this.ctx.shadowColor = 'rgba(0,0,0,0.6)';
      this.ctx.shadowBlur = 20;
      this.ctx.drawImage(this.serverSprite, -serverW / 2, -serverH / 2 + this.serverAnim.ladleDip, serverW, serverH);

      this.ctx.restore();
    }

    // 7. Draw Hover Pointer
    if (this.hoverPos && !this.activeTrajectory) {
      this.ctx.save();
      this.ctx.strokeStyle = '#FACC15';
      this.ctx.lineWidth = 3;
      this.ctx.setLineDash([6, 6]);
      this.ctx.beginPath();
      this.ctx.arc(this.hoverPos.x, this.hoverPos.y, 30, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.fillStyle = 'rgba(250, 204, 21, 0.25)';
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  // Draw Real Food Photo Crop from realistic_sadhya.jpg or High-Res Texture Fallback
  drawFoodItem(cx, cy, item) {
    this.ctx.save();

    if (this.realSadhyaLoaded && item.crop) {
      const { x, y, w, h } = item.crop;
      const renderSize = (item.splatterRadius || 45) * 2.2;

      this.ctx.shadowColor = 'rgba(0,0,0,0.5)';
      this.ctx.shadowBlur = 14;

      // Draw inside organic circular leaf-blend clipping path
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, renderSize / 2, 0, Math.PI * 2);
      this.ctx.clip();
      this.ctx.drawImage(this.realSadhyaImg, x, y, w, h, cx - renderSize / 2, cy - renderSize / 2, renderSize, renderSize);
      this.ctx.restore();
      return;
    }

    // Fallback vector rendering
    this.ctx.fillStyle = item.color;
    this.ctx.shadowColor = item.secondaryColor;
    this.ctx.shadowBlur = 10;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, item.splatterRadius || 40, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  reset() {
    this.placedItems = [];
    this.animatingParticles = [];
    this.activeTrajectory = null;
    this.serverAnim.visible = false;
    this.render();
  }
}
