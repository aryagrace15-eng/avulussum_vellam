/**
 * Ponjikkara Cuisine - Minimal Sadhya Report Card Generator with Animated Slamming Rubber Stamp
 */

class ScorecardGenerator {
  static generateReportCard(leafCanvas, placedItems) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 850;
      canvas.height = 700;
      const ctx = canvas.getContext('2d');

      // 1. Elegant Dark-Gold Gradient Background
      const bgGrad = ctx.createLinearGradient(0, 0, 850, 700);
      bgGrad.addColorStop(0, '#0F172A');
      bgGrad.addColorStop(0.5, '#1E293B');
      bgGrad.addColorStop(1, '#090D16');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 850, 700);

      // Gold Double Border
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, 810, 660);

      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 30, 790, 640);

      // Header Banner - Traditional Noto Serif Malayalam
      ctx.fillStyle = '#FACC15';
      ctx.shadowColor = '#FACC15';
      ctx.shadowBlur = 15;
      ctx.font = 'bold 34px "Noto Serif Malayalam", serif';
      ctx.textAlign = 'center';
      ctx.fillText('പൊഞ്ചിക്കര സദ്യ സിമുലേറ്റർ 🍃', 425, 80);

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 15px "Montserrat", sans-serif';
      ctx.fillText('OFFICIAL KERALA SADHYA DISASTER REPORT CARD', 425, 110);

      // Divider Line
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 130);
      ctx.lineTo(770, 130);
      ctx.stroke();

      // Center Box: Final Cursed Banana Leaf Snapshot
      const snapWidth = 480;
      const snapHeight = 480;
      const snapX = (850 - snapWidth) / 2;
      const snapY = 155;

      ctx.fillStyle = '#020617';
      ctx.fillRect(snapX, snapY, snapWidth, snapHeight);
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 3;
      ctx.strokeRect(snapX, snapY, snapWidth, snapHeight);

      // Draw Leaf Canvas snapshot
      ctx.drawImage(leafCanvas, snapX + 5, snapY + 5, snapWidth - 10, snapHeight - 10);

      // Load & Draw Slamming Ponjikkara Rubber Stamp Seal
      const stampImg = new Image();
      stampImg.src = 'assets/ponjikkara_stamp.png';

      const finishDrawing = () => {
        // Draw Large Animated Stamp Overlay on the Leaf!
        const stampSize = 220;
        const stampX = snapX + snapWidth - 140;
        const stampY = snapY + snapHeight - 140;

        ctx.save();
        ctx.translate(stampX, stampY);
        ctx.rotate(-0.25); // Slanted stamp angle

        ctx.shadowColor = 'rgba(220, 38, 38, 0.8)';
        ctx.shadowBlur = 20;

        if (stampImg.complete && stampImg.naturalWidth > 0) {
          ctx.drawImage(stampImg, -stampSize / 2, -stampSize / 2, stampSize, stampSize);
        } else {
          // Fallback Red Rubber Stamp Circle
          ctx.strokeStyle = '#DC2626';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.arc(0, 0, stampSize / 2, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 16px "Noto Serif Malayalam", serif';
          ctx.textAlign = 'center';
          ctx.fillText('പൊഞ്ചിക്കര അപ്രൂവ്ഡ്', 0, -15);
          ctx.font = 'bold 14px "Montserrat", sans-serif';
          ctx.fillText('PONJIKKARA APPROVED', 0, 15);
        }

        ctx.restore();

        // Footer Malayalam Motto
        ctx.fillStyle = '#FACC15';
        ctx.font = 'bold 16px "Noto Serif Malayalam", serif';
        ctx.textAlign = 'center';
        ctx.fillText('"പൊഞ്ചിക്കര കേശവന്റെ സദ്യ കഴിച്ചാൽ സമാധാനം ഉണ്ടാകും!"', 425, 660);

        resolve(canvas.toDataURL('image/png'));
      };

      stampImg.onload = finishDrawing;
      stampImg.onerror = finishDrawing;

      // Fallback timer if image takes time
      setTimeout(finishDrawing, 300);
    });
  }
}
