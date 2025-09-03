// Effects.ts — grain, vignette, soft glow, grunge overlay & paper folds

export function applyGrain(
  imageData: ImageData,
  amount: number,
  blockSize: number = 1
) {
  const data = imageData.data;
  const w = imageData.width;
  const h = imageData.height;
  const amp = 40 * amount; // max +/- value

  for (let y = 0; y < h; y += blockSize) {
    for (let x = 0; x < w; x += blockSize) {
      const n = (Math.random() * 2 - 1) * amp; // mono grain per block
      for (let by = 0; by < blockSize && y + by < h; by++) {
        for (let bx = 0; bx < blockSize && x + bx < w; bx++) {
          const idx = ((y + by) * w + (x + bx)) * 4;
          data[idx] = clamp255(data[idx] + n);
          data[idx + 1] = clamp255(data[idx + 1] + n);
          data[idx + 2] = clamp255(data[idx + 2] + n);
        }
      }
    }
  }
}

export function applyVignette(
  imageData: ImageData,
  strength: number,
  softness: number
) {
  const data = imageData.data;
  const w = imageData.width;
  const h = imageData.height;
  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.hypot(cx, cy);
  const soft = Math.max(0.001, softness);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const r = Math.hypot(x - cx, y - cy) / maxR; // 0..1
      // smoothstep-like falloff
      const t = Math.min(1, Math.max(0, (r - (1 - soft)) / soft));
      const v = 1 - t * strength; // 1 at center, (1-strength) at edges
      const idx = (y * w + x) * 4;
      data[idx] = clamp255(data[idx] * v);
      data[idx + 1] = clamp255(data[idx + 1] * v);
      data[idx + 2] = clamp255(data[idx + 2] * v);
    }
  }
}

export function applySoftGlow(
  canvas: HTMLCanvasElement,
  blurPx: number,
  strength: number
) {
  const w = canvas.width;
  const h = canvas.height;
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const octx = off.getContext("2d");
  const ctx = canvas.getContext("2d");
  if (!octx || !ctx) return;

  // blur copy
  octx.clearRect(0, 0, w, h);
  octx.filter = `blur(${blurPx}px)`;
  octx.drawImage(canvas, 0, 0, w, h);

  // screen blend
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = strength;
  ctx.drawImage(off, 0, 0);
  ctx.restore();
}

/** Grunge overlay: blotches + speckles + scratches, blended multiply + overlay */
export function applyGrungeOverlay(
  canvas: HTMLCanvasElement,
  amount01: number,
  scale: number
) {
  if (amount01 <= 0) return;
  const amount = Math.max(0, Math.min(1, amount01));
  const w = canvas.width,
    h = canvas.height;
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const ctx = off.getContext("2d");
  const dst = canvas.getContext("2d");
  if (!ctx || !dst) return;

  ctx.clearRect(0, 0, w, h);

  // layer 1: blotches
  const blotchCount = Math.round((w * h) / (90000 / Math.max(0.1, amount)));
  for (let i = 0; i < blotchCount; i++) {
    const bx = Math.random() * w,
      by = Math.random() * h;
    const r =
      (Math.random() * 0.5 + 0.5) *
      (Math.min(w, h) / (18 + (100 - scale) * 0.12));
    const g = ctx.createRadialGradient(bx, by, 0, bx, by, r);
    const shade = Math.floor(180 + Math.random() * 40);
    g.addColorStop(0, `rgba(${shade},${shade},${shade},${0.12 * amount})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // layer 2: speckles
  const speckles = Math.round((w * h) / (12000 / Math.max(0.1, amount)));
  ctx.fillStyle = `rgba(30,30,30,${0.12 * amount})`;
  for (let i = 0; i < speckles; i++) {
    const x = (Math.random() * w) | 0;
    const y = (Math.random() * h) | 0;
    const s = 1 + Math.random() * (scale / 50);
    ctx.fillRect(x, y, s, s);
  }

  // layer 3: scratches
  const scratchCount = Math.round(30 * amount);
  ctx.strokeStyle = `rgba(30,30,30,${0.25 * amount})`;
  ctx.lineWidth = Math.max(0.5, scale / 200);
  for (let i = 0; i < scratchCount; i++) {
    const x1 = Math.random() * w,
      y1 = Math.random() * h;
    const len = (Math.random() * 0.2 + 0.1) * Math.max(w, h);
    const ang = Math.random() * Math.PI * 2;
    const x2 = x1 + Math.cos(ang) * len,
      y2 = y1 + Math.sin(ang) * len;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // slight blur & blend
  ctx.filter = "blur(0.6px)";
  ctx.drawImage(off, 0, 0);
  ctx.filter = "none";

  dst.save();
  dst.globalAlpha = Math.min(0.6, 0.2 + amount * 0.4);
  dst.globalCompositeOperation = "multiply";
  dst.drawImage(off, 0, 0);
  dst.globalCompositeOperation = "overlay";
  dst.globalAlpha = Math.min(0.35, 0.12 + amount * 0.2);
  dst.drawImage(off, 0, 0);
  dst.restore();
}

/** Paper folds / creases: soft highlight + shadow band(s) */
export function applyPaperFolds(
  canvas: HTMLCanvasElement,
  strength01: number,
  direction: "horizontal" | "vertical" | "diagonal",
  count: number = 1
) {
  const strength = Math.max(0, Math.min(1, strength01));
  if (strength <= 0 || count <= 0) return;

  const w = canvas.width,
    h = canvas.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const bandRatio = 0.06;
  const band = Math.max(8, Math.min(w, h) * bandRatio);

  const drawFold = (cx: number, cy: number, dir: "h" | "v" | "d") => {
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const octx = off.getContext("2d");
    if (!octx) return;

    const grad = octx.createLinearGradient(
      dir === "v" ? cx - band : 0,
      dir === "h" ? cy - band : 0,
      dir === "v" ? cx + band : dir === "d" ? w : w,
      dir === "h" ? cy + band : dir === "d" ? h : h
    );

    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(0.45, `rgba(0,0,0,${0.25 * strength})`);
    grad.addColorStop(0.5, `rgba(255,255,255,${0.35 * strength})`);
    grad.addColorStop(0.55, `rgba(0,0,0,${0.25 * strength})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");

    octx.fillStyle = grad;
    octx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalCompositeOperation = "overlay";
    ctx.globalAlpha = Math.min(0.7, 0.25 + strength * 0.5);
    ctx.drawImage(off, 0, 0);
    ctx.restore();
  };

  if (direction === "vertical") {
    const step = w / (count + 1);
    for (let i = 1; i <= count; i++) drawFold(step * i, h / 2, "v");
  } else if (direction === "horizontal") {
    const step = h / (count + 1);
    for (let i = 1; i <= count; i++) drawFold(w / 2, step * i, "h");
  } else {
    for (let i = 0; i < count; i++) drawFold(w / 2, h / 2, "d");
  }
}

function clamp255(v: number) {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}
