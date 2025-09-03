"use client";

import React, { useEffect, useRef, useState } from "react";
import { processDuotoneImage } from "./DuotoneEngine";
import {
  applyGrain,
  applyVignette,
  applySoftGlow,
  applyGrungeOverlay,
  applyPaperFolds,
} from "./Effects";
import ControlsPanel from "./ControlsPanels";
import Dropzone from "./Dropzone";

export default function CampaignFilter() {
  const [file, setFile] = useState<File | null>(null);
  const [isReversed, setIsReversed] = useState(false);
  const [useClassicColors, setUseClassicColors] = useState(false);
  const [downloadName, setDownloadName] = useState("duotone.png");

  // Efek dasar
  const [grainAmt, setGrainAmt] = useState(20);
  const [grainSize, setGrainSize] = useState(1);
  const [vignette, setVignette] = useState(25);
  const [vignetteSoft, setVignetteSoft] = useState(65);
  const [glowAmt, setGlowAmt] = useState(20);
  const [glowBlur, setGlowBlur] = useState(8);

  // NEW: Grunge & Paper folds
  const [grungeAmt, setGrungeAmt] = useState(30); // 0–100
  const [grungeScale, setGrungeScale] = useState(80); // 10–200
  const [foldsEnabled, setFoldsEnabled] = useState(false);
  const [foldStrength, setFoldStrength] = useState(25); // 0–100
  const [foldDirection, setFoldDirection] = useState<
    "horizontal" | "vertical" | "diagonal"
  >("diagonal");
  const [foldCount, setFoldCount] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!file || !canvasRef.current) return;

    // render setelah canvas commit
    requestAnimationFrame(() => {
      if (!canvasRef.current) return;

      processDuotoneImage(
        file,
        canvasRef.current!,
        isReversed,
        useClassicColors
      )
        .then(({ processedCanvas }) => {
          const ctx = processedCanvas.getContext("2d", {
            willReadFrequently: true,
          });
          if (!ctx) return;

          // pixel-based (grain + vignette)
          if (grainAmt > 0 || vignette > 0) {
            const img = ctx.getImageData(
              0,
              0,
              processedCanvas.width,
              processedCanvas.height
            );
            if (vignette > 0)
              applyVignette(img, vignette / 100, vignetteSoft / 100);
            if (grainAmt > 0) applyGrain(img, grainAmt / 100, grainSize);
            ctx.putImageData(img, 0, 0);
          }

          // soft glow (screen blend)
          if (glowAmt > 0 && glowBlur > 0) {
            applySoftGlow(processedCanvas, glowBlur, glowAmt / 100);
          }

          // NEW overlays (canvas-based): grunge + paper folds
          if (grungeAmt > 0) {
            applyGrungeOverlay(processedCanvas, grungeAmt / 100, grungeScale);
          }
          if (foldsEnabled && foldStrength > 0) {
            applyPaperFolds(
              processedCanvas,
              foldStrength / 100,
              foldDirection,
              Math.max(1, Math.min(6, Math.round(foldCount)))
            );
          }
        })
        .catch(console.error);
    });
  }, [
    file,
    isReversed,
    useClassicColors,
    grainAmt,
    grainSize,
    vignette,
    vignetteSoft,
    glowAmt,
    glowBlur,
    grungeAmt,
    grungeScale,
    foldsEnabled,
    foldStrength,
    foldDirection,
    foldCount,
  ]);

  function onFileSelected(f: File) {
    setFile(f);
    setDownloadName(`${f.name.replace(/\.[^.]+$/, "")}-duotone.png`);
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
    <div id="top" className="relative mx-auto max-w-5xl px-4 py-6 md:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-pink-200 blur-3xl opacity-40 animate-float"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-200 blur-3xl opacity-40 animate-float"
      />

      {/* header */}
      <header className="mb-5">
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-gray-600 bg-white/70 backdrop-blur">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: "#165027" }}
          />
          Hero Green × Brave Pink
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: "#F99FD2" }}
          />
        </div>

        <h1 className="mt-3 text-4xl md:text-5xl font-black tracking-tight">
          <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-pink-500 bg-clip-text text-transparent">
            Warna Perlawanan
          </span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm md:text-base text-gray-600">
          Hijau untuk bayangan, merah muda untuk cahaya—suaramu ada di sini.
        </p>
      </header>

      {!file && (
        <>
          <div className="mb-4 rounded-2xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-700">
              Unggah fotomu, kami terapkan filter duotone otomatis. Pilih{" "}
              <em>Mapping</em>, <em>Palet</em>, dan <em>Preset</em>. Pengaturan
              lanjutan bisa dibuka kapan saja.
            </p>
          </div>

          <Dropzone onPickFile={onFileSelected} />

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-600">
            <span className="inline-flex items-center gap-2">
              🔒 Website ini tidak menyimpan data pengguna, semua proses di
              perangkatmu
            </span>
          </div>
        </>
      )}

      {file && (
        <div className="space-y-4">
          {/* kartu preview + toolbar */}
          <section className="rounded-2xl border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b px-3 py-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="rounded bg-gray-100 px-2 py-0.5 font-medium">
                  Preview
                </span>
                <span className="hidden sm:inline ">
                  Duotone • Hero Green → Brave Pink
                </span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={download}
                  className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-black"
                >
                  Download
                </button>
                <button
                  onClick={() => setFile(null)}
                  className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                >
                  Ganti Foto
                </button>
              </div>
            </div>

            <div className="p-3">
              <div className="relative w-full overflow-auto rounded-xl bg-[linear-gradient(45deg,#f7fafc_25%,#f1f5f9_25%,#f1f5f9_50%,#f7fafc_50%,#f7fafc_75%,#f1f5f9_75%,#f1f5f9_100%)] [background-size:24px_24px]">
                <canvas
                  ref={canvasRef}
                  className="mx-auto block h-auto max-h-[580px] w-full max-w-full"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          </section>

          {/* panel kontrol di bawah preview */}
          <ControlsPanel
            isReversed={isReversed}
            setIsReversed={setIsReversed}
            useClassicColors={useClassicColors}
            setUseClassicColors={setUseClassicColors}
            grainAmt={grainAmt}
            setGrainAmt={setGrainAmt}
            grainSize={grainSize}
            setGrainSize={setGrainSize}
            vignette={vignette}
            setVignette={setVignette}
            vignetteSoft={vignetteSoft}
            setVignetteSoft={setVignetteSoft}
            glowAmt={glowAmt}
            setGlowAmt={setGlowAmt}
            glowBlur={glowBlur}
            setGlowBlur={setGlowBlur}
            grungeAmt={grungeAmt}
            setGrungeAmt={setGrungeAmt}
            grungeScale={grungeScale}
            setGrungeScale={setGrungeScale}
            foldsEnabled={foldsEnabled}
            setFoldsEnabled={setFoldsEnabled}
            foldStrength={foldStrength}
            setFoldStrength={setFoldStrength}
            foldDirection={foldDirection}
            setFoldDirection={setFoldDirection}
            foldCount={foldCount}
            setFoldCount={setFoldCount}
            onDownload={download}
            onReset={() => setFile(null)}
          />

          {/* strip CTA share */}
          <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-700">
              Suka hasilnya? Bagikan dengan tagar{" "}
              <span className="font-medium text-emerald-700">#HeroGreen</span> &{" "}
              <span className="font-medium text-pink-600">#BravePink</span>.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  try {
                    if (navigator.share) {
                      navigator.share({
                        title: "Warna Perlawanan",
                        text: "Aku sudah ikut gerakan ini.",
                        url: location.href,
                      });
                    }
                  } catch {}
                }}
                className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
              >
                Bagikan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* sticky actions (mobile) */}
      {file && (
        <div className="fixed inset-x-0 bottom-3 z-40 mx-auto w-[min(95%,28rem)] rounded-2xl border bg-white/90 p-2 shadow-lg backdrop-blur md:hidden">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={download}
              className="rounded-xl bg-gray-900 px-4 py-2 text-white"
            >
              Download
            </button>
            <button
              onClick={() => setFile(null)}
              className="rounded-xl border px-4 py-2"
            >
              Ganti Foto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
