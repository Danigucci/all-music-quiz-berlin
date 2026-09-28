(function () {
  const COLORS = ['#ff4fa3', '#ff8a3d', '#ffd83e', '#6a4cff'];
  const TEXT_COLORS = ['#ffffff', '#181454', '#181454', '#ffffff'];

  function PrizeWheel(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.items = [];
    this.rotation = 0;
  }

  PrizeWheel.prototype.setItems = function (items) {
    this.items = items;
    this.rotation = 0;
    this.canvas.style.transition = 'none';
    this.canvas.style.transform = 'rotate(0deg)';
    this.draw();
  };

  PrizeWheel.prototype.draw = function () {
    const canvas = this.canvas;
    const ctx = this.ctx;
    const size = canvas.clientWidth || 400;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const n = this.items.length;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 6;

    if (!n) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#2a2470';
      ctx.fill();
      return;
    }

    const seg = (Math.PI * 2) / n;
    const baseFont = Math.max(12, Math.min(24, radius * 0.75 * seg * 0.5));
    const maxTextWidth = radius - 16 - radius * 0.16 - 8;

    for (let i = 0; i < n; i++) {
      const start = -Math.PI / 2 + i * seg;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, start + seg);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(16,13,58,0.55)';
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + seg / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = TEXT_COLORS[i % TEXT_COLORS.length];
      let label = String(this.items[i].label);
      let fontPx = baseFont;
      const setFont = () => { ctx.font = `700 ${fontPx}px 'Baloo 2', 'Manrope', system-ui, sans-serif`; };
      setFont();
      while (ctx.measureText(label).width > maxTextWidth && fontPx > 13) { fontPx -= 1; setFont(); }
      if (ctx.measureText(label).width > maxTextWidth) {
        while (label.length > 1 && ctx.measureText(label + '…').width > maxTextWidth) label = label.slice(0, -1);
        label += '…';
      }
      ctx.fillText(label, radius - 16, 0);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.13, 0, Math.PI * 2);
    ctx.fillStyle = '#181454';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffd83e';
    ctx.stroke();
  };

  // Rotation (deg, clockwise) that puts the centre of segment `index` under the top pointer.
  PrizeWheel.prototype.angleFor = function (index, jitter) {
    const seg = 360 / this.items.length;
    const centre = (index + 0.5) * seg + (jitter || 0);
    return (((360 - centre) % 360) + 360) % 360;
  };

  PrizeWheel.prototype.showStatic = function (index) {
    if (index < 0 || index >= this.items.length) return;
    this.rotation = this.angleFor(index, 0);
    this.canvas.style.transition = 'none';
    this.canvas.style.transform = `rotate(${this.rotation}deg)`;
  };

  PrizeWheel.prototype.spinTo = function (index, duration) {
    const ms = duration || 5500;
    const seg = 360 / this.items.length;
    const jitter = (Math.random() - 0.5) * seg * 0.6;
    const current = this.rotation;
    let next = current - (current % 360) + 5 * 360 + this.angleFor(index, jitter);
    if (next < current + 4 * 360) next += 360;
    this.rotation = next;
    // force a reflow so the transition starts from the current angle
    void this.canvas.offsetWidth;
    this.canvas.style.transition = `transform ${ms}ms cubic-bezier(0.12, 0.6, 0.1, 1)`;
    this.canvas.style.transform = `rotate(${next}deg)`;
    return new Promise((resolve) => setTimeout(resolve, ms + 80));
  };

  window.PrizeWheel = PrizeWheel;
})();
