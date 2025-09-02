"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Brave Pink • Hero Green — Web Campaign Component
 * ------------------------------------------------
 * Features
 * - Upload image (drag & drop or click)
 * - Apply filters: Brave Pink, Hero Green, Gradient (Pink→Green), Duotone (Pink/Green)
 * - Strength control (0–100), Blend mode toggle (Overlay / Soft Light / Multiply)
 * - Live preview on <canvas>
 * - Download as PNG
 * - All client-side; no server needed
 *
 * Usage (Next.js App Router):
 *   import CampaignFilter from "@/components/CampaignFilter";
 *   export default function Page(){ return <CampaignFilter/> }
 */

const COLORS = {
  BRAVE_PINK: "#E064A6",
  HERO_GREEN: "#05AB1C",
};
// const COLORS = {
//   BRAVE_PINK: "#FF69B4", // rgb(255,105,180)
//   HERO_GREEN: "#32CD32", // rgb(50,205,50)
// };

type Mode = "pink" | "green" | "gradient" | "duotone";

type Blend = "overlay" | "soft-light" | "multiply";

export default function CampaignFilter() {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("gradient");
  const [blend, setBlend] = useState<Blend>("overlay");
  const [strength, setStrength] = useState<number>(40); // 0–100
  const [downloadName, setDownloadName] = useState<string>(
    "campaign-filter.png"
  );

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const hasImage = !!imageURL;

  const colorPink = useMemo(() => hexToRgb(COLORS.BRAVE_PINK), []);
  const colorGreen = useMemo(() => hexToRgb(COLORS.HERO_GREEN), []);

  useEffect(() => {
    if (!imageURL) return;
    const img = new Image();
    img.crossOrigin = "anonymous"; // allow drawing CORS-safe (for downloads)
    img.onload = () => {
      imgRef.current = img;
      draw();
    };
    img.src = imageURL;
  }, [imageURL]);

  useEffect(() => {
    if (hasImage) draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, blend, strength]);

  function onFileSelected(file: File) {
    const url = URL.createObjectURL(file);
    setImageURL(url);
    const baseName = file.name.replace(/\.[^.]+$/, "");
    setDownloadName(`${baseName}-bravepink-herogreen.png`);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  }

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
  }

  function draw() {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    // Fit canvas to image while keeping reasonable maximum size for memory
    const maxW = 2400;
    const scale = img.width > maxW ? maxW / img.width : 1;
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1) base image
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    // 2) apply selected mode
    const alpha = clamp(strength / 100, 0, 1);

    if (mode === "duotone") {
      applyDuotone(ctx, w, h, colorPink, colorGreen, alpha);
      return;
    }

    // Pink / Green / Gradient overlays via blend modes
    ctx.save();
    ctx.globalCompositeOperation = blend; // overlay | soft-light | multiply
    ctx.globalAlpha = alpha;

    if (mode === "pink") {
      ctx.fillStyle = COLORS.BRAVE_PINK;
      ctx.fillRect(0, 0, w, h);
    } else if (mode === "green") {
      ctx.fillStyle = COLORS.HERO_GREEN;
      ctx.fillRect(0, 0, w, h);
    } else if (mode === "gradient") {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, COLORS.BRAVE_PINK);
      grad.addColorStop(1, COLORS.HERO_GREEN);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.restore();
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = downloadName;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6">
      <header className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Brave Pink • Hero Green Filter
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Upload fotomu, pilih mode, atur intensitas, lalu unduh hasilnya.
          Semuanya berjalan di browser—tanpa server.
        </p>
      </header>

      {/* Upload / Dropzone */}
      {!hasImage && (
        <label
          onDrop={onDrop}
          onDragOver={(e) => (
            e.preventDefault(), (e.dataTransfer.dropEffect = "copy")
          )}
          className="block cursor-pointer rounded-2xl border border-dashed border-gray-300 p-8 text-center hover:border-gray-400 transition shadow-sm bg-white"
        >
          <input
            type="file"
            accept="image/*"
            onChange={onPickFile}
            className="hidden"
          />
          <div className="mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-gray-600"
            >
              <path d="M12 16a1 1 0 0 1-1-1V8.41L9.7 9.7a1 1 0 1 1-1.4-1.42l3-3a1 1 0 0 1 1.4 0l3 3a1 1 0 1 1-1.4 1.42L13 8.4V15a1 1 0 0 1-1 1Z" />
              <path d="M5 19a3 3 0 0 1-3-3v-2a1 1 0 1 1 2 0v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2a1 1 0 1 1 2 0v2a3 3 0 0 1-3 3H5Z" />
            </svg>
          </div>
          <p className="font-medium">Klik untuk unggah atau seret & lepaskan</p>
          <p className="text-xs text-gray-500">PNG/JPG hingga ~10MB</p>
        </label>
      )}

      {/* Controls & Preview */}
      {hasImage && (
        <div className="grid gap-4 md:grid-cols-[320px,1fr] md:gap-6">
          {/* Controls */}
          <aside className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Mode</span>
              <button
                onClick={() => setImageURL(null)}
                className="rounded-full px-3 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200"
                aria-label="Ganti foto"
              >
                Ganti foto
              </button>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode("pink")}
                className={`rounded-xl px-3 py-2 text-sm border ${
                  mode === "pink"
                    ? "border-pink-400 ring-2 ring-pink-200"
                    : "border-gray-200"
                }`}
                style={{ background: COLORS.BRAVE_PINK + "22" }}
              >
                Brave Pink
              </button>
              <button
                onClick={() => setMode("green")}
                className={`rounded-xl px-3 py-2 text-sm border ${
                  mode === "green"
                    ? "border-green-400 ring-2 ring-green-200"
                    : "border-gray-200"
                }`}
                style={{ background: COLORS.HERO_GREEN + "22" }}
              >
                Hero Green
              </button>
              <button
                onClick={() => setMode("gradient")}
                className={`rounded-xl px-3 py-2 text-sm border col-span-2 ${
                  mode === "gradient"
                    ? "border-fuchsia-400 ring-2 ring-fuchsia-200"
                    : "border-gray-200"
                }`}
                style={{
                  background: `linear-gradient(90deg, ${COLORS.BRAVE_PINK}33, ${COLORS.HERO_GREEN}33)`,
                }}
              >
                Gradient Pink→Green
              </button>
              <button
                onClick={() => setMode("duotone")}
                className={`rounded-xl px-3 py-2 text-sm border col-span-2 ${
                  mode === "duotone"
                    ? "border-emerald-400 ring-2 ring-emerald-200"
                    : "border-gray-200"
                }`}
              >
                Duotone (Pink/Green)
              </button>
            </div>

            {mode !== "duotone" && (
              <div className="mt-4">
                <label className="text-sm font-semibold">Blend Mode</label>
                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                  {(["overlay", "soft-light", "multiply"] as Blend[]).map(
                    (b) => (
                      <button
                        key={b}
                        onClick={() => setBlend(b)}
                        className={`rounded-xl border px-3 py-2 capitalize ${
                          blend === b
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-200"
                        }`}
                      >
                        {b.replace("-", " ")}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="mt-4">
              <label htmlFor="strength" className="text-sm font-semibold">
                Strength: {strength}%
              </label>
              <input
                id="strength"
                type="range"
                min={0}
                max={100}
                value={strength}
                onChange={(e) => setStrength(Number(e.target.value))}
                className="mt-2 w-full"
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <button
                onClick={download}
                className="rounded-xl bg-gray-900 px-4 py-2 text-white hover:bg-black"
              >
                Download PNG
              </button>
              <label className="rounded-xl border px-4 py-2 text-center cursor-pointer hover:bg-gray-50">
                Ganti Foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={onPickFile}
                  className="hidden"
                />
              </label>
            </div>

            <p className="mt-3 text-[11px] leading-relaxed text-gray-500">
              Catatan: EXIF (lokasi/waktu) tidak dipertahankan demi privasi.
              Semua proses berjalan lokal di perangkatmu.
            </p>
          </aside>

          {/* Preview Canvas */}
          <section className="rounded-2xl border bg-white p-3 shadow-sm">
            <div className="relative w-full overflow-auto rounded-xl bg-gray-50">
              <canvas ref={canvasRef} className="mx-auto block max-w-full" />
            </div>
          </section>
        </div>
      )}

      {/* Mini palette */}
      <div className="mt-6 flex items-center gap-3 text-sm">
        <span className="inline-flex items-center gap-2">
          <i
            className="h-3 w-3 rounded-full"
            style={{ background: COLORS.BRAVE_PINK }}
          />
          Brave Pink
        </span>
        <span className="inline-flex items-center gap-2">
          <i
            className="h-3 w-3 rounded-full"
            style={{ background: COLORS.HERO_GREEN }}
          />
          Hero Green
        </span>
      </div>
    </div>
  );
}

// ---- Helpers --------------------------------------------------------------

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  const bigint = parseInt(
    m.length === 3
      ? m
          .split("")
          .map((c) => c + c)
          .join("")
      : m,
    16
  );
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

/**
 * Duotone mapping: grayscale luminance → mix(pink, green)
 * alpha drives mix intensity (0..1). Original image kept via overlay blend.
 */
function applyDuotone(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  pink: [number, number, number],
  green: [number, number, number],
  alpha: number
) {
  const img = ctx.getImageData(0, 0, w, h);
  const data = img.data; // RGBA

  // 1) compute luminance & map to duotone color
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; // 0..1

    const cr = Math.round(pink[0] * (1 - lum) + green[0] * lum);
    const cg = Math.round(pink[1] * (1 - lum) + green[1] * lum);
    const cb = Math.round(pink[2] * (1 - lum) + green[2] * lum);

    // blend the duotone toward original according to alpha
    data[i] = Math.round(r * (1 - alpha) + cr * alpha);
    data[i + 1] = Math.round(g * (1 - alpha) + cg * alpha);
    data[i + 2] = Math.round(b * (1 - alpha) + cb * alpha);
    // keep original alpha
  }

  ctx.putImageData(img, 0, 0);
}
