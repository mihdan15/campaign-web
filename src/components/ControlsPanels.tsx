"use client";
import * as React from "react";

type Setter<T> = (value: T) => void;

interface ControlsPanelProps {
  // mapping
  isReversed: boolean;
  setIsReversed: Setter<boolean>;
  useClassicColors: boolean;
  setUseClassicColors: Setter<boolean>;

  // effects (existing)
  grainAmt: number;
  setGrainAmt: Setter<number>;
  grainSize: number;
  setGrainSize: Setter<number>;
  vignette: number;
  setVignette: Setter<number>;
  vignetteSoft: number;
  setVignetteSoft: Setter<number>;
  glowAmt: number;
  setGlowAmt: Setter<number>;
  glowBlur: number;
  setGlowBlur: Setter<number>;

  // NEW: grunge & folds
  grungeAmt?: number;
  setGrungeAmt?: Setter<number>;

  // Halftone
  halftoneEnabled?: boolean;
  setHalftoneEnabled?: (v: boolean) => void;
  halftoneSize?: number;
  setHalftoneSize?: (v: number) => void;
  halftoneOpacity?: number;
  setHalftoneOpacity?: (v: number) => void;
  halftoneInvert?: boolean;
  setHalftoneInvert?: (v: boolean) => void;

  // Grunge overlay selector
  grungeTextureCount?: number;
  grungeTextureIndex?: number;
  setGrungeTextureIndex?: (v: number) => void;
  grungeBlendMode?: GlobalCompositeOperation;
  setGrungeBlendMode?: (v: GlobalCompositeOperation) => void;

  // actions
  onDownload: () => void;
  onReset: () => void;
}

export default function ControlsPanel(p: ControlsPanelProps) {
  // helper
  const defined = <T,>(v: T | undefined, d: T) => (v === undefined ? d : v);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [activePreset, setActivePreset] = React.useState<string | null>(null);

  const grungeAmt = defined(p.grungeAmt, 0);

  const setGrungeAmt = p.setGrungeAmt ?? (() => {});

  const setHalftoneEnabled = p.setHalftoneEnabled ?? (() => {});
  const setHalftoneSize = p.setHalftoneSize ?? (() => {});
  const setHalftoneOpacity = p.setHalftoneOpacity ?? (() => {});
  const setHalftoneInvert = p.setHalftoneInvert ?? (() => {});
  const setVignette = p.setVignette ?? (() => {});
  const setGlowAmt = p.setGlowAmt ?? (() => {});

  const grungeTextureCount = defined(p.grungeTextureCount, 8); // default 8 kalau tidak dikirim
  const setGrungeTextureIndex = p.setGrungeTextureIndex ?? (() => {});


  // presets
  const applyPreset = (
    name: "poster" | "lembut" | "dramatis" | "grungePoster" | "halftone"
  ) => {
    if (name === "poster") {
      p.setGrainAmt(18);
      p.setGrainSize(1);
      p.setVignette(30);
      p.setVignetteSoft(60);
      p.setGlowAmt(12);
      p.setGlowBlur(6);
      setGrungeAmt(0);

      setHalftoneEnabled(false);
      setHalftoneSize(0); // grid 6px
      setHalftoneOpacity(0); // 50%
      setHalftoneInvert(true);
    } else if (name === "lembut") {
      p.setGrainAmt(8);
      p.setGrainSize(1);
      p.setVignette(18);
      p.setVignetteSoft(80);
      p.setGlowAmt(28);
      p.setGlowBlur(12);
      setGrungeAmt(0);

      setHalftoneEnabled(false);
      setHalftoneSize(0); // grid 6px
      setHalftoneOpacity(0); // 50%
      setHalftoneInvert(true);
    } else if (name === "dramatis") {
      p.setGrainAmt(26);
      p.setGrainSize(2);
      p.setVignette(42);
      p.setVignetteSoft(50);
      p.setGlowAmt(18);
      p.setGlowBlur(10);
      setGrungeAmt(0.2 * 100);

      setHalftoneEnabled(false);
      setHalftoneSize(0); // grid 6px
      setHalftoneOpacity(0); // 50%
      setHalftoneInvert(true);
    } else if (name === "grungePoster") {
      // grunge poster
      p.setGrainAmt(20);
      p.setGrainSize(2);
      p.setVignette(24);
      p.setVignetteSoft(65);
      p.setGlowAmt(10);
      p.setGlowBlur(6);

      // aktifkan grunge overlay dgn tekstur acak
      const count = Math.max(1, grungeTextureCount);
      const rand = Math.floor(Math.random() * count);
      setGrungeTextureIndex(rand);

      setGrungeAmt(45); // opacity overlay (0–100)

      setHalftoneEnabled(false);
      setHalftoneSize(0); // grid 6px
      setHalftoneOpacity(0); // 50%
      setHalftoneInvert(true);
    } else if (name === "halftone") {
      p.setGrainAmt(0);
      setVignette(0);
      setGlowAmt(0);
      setGrungeAmt(0);

      setHalftoneEnabled(true);
      setHalftoneSize(3); // grid 6px
      setHalftoneOpacity(20); // 50%
      setHalftoneInvert(false);
    }
    setActivePreset(name);
  };

  return (
    <aside className="rounded-2xl border bg-white/80 backdrop-blur p-4 shadow-lg ring-1 ring-black/5 transition">
      {/* arah warna */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-gray-700">Inverse warna</div>
        <div className="flex rounded-xl border bg-gray-50 p-1">
          <button
            aria-pressed={!p.isReversed}
            className={[
              "flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all cursor-pointer",
              !p.isReversed
                ? "bg-emerald-700 text-white shadow-sm hover:bg-emerald-700"
                : "text-gray-700 hover:bg-white/70",
              "hover:-translate-y-[1px] active:scale-[.98]",
            ].join(" ")}
            onClick={() => p.setIsReversed(false)}
          >
            Hijau→Bayangan Pink→Sorotan
          </button>
          <button
            aria-pressed={p.isReversed}
            className={[
              "ml-1 flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all cursor-pointer",
              p.isReversed
                ? "bg-emerald-700 text-white shadow-sm hover:bg-emerald-700"
                : "text-gray-700 hover:bg-white/70",
              "hover:-translate-y-[1px] active:scale-[.98]",
            ].join(" ")}
            onClick={() => p.setIsReversed(true)}
          >
            Pink→Bayangan Hijau→Sorotan
          </button>
        </div>
      </div>

      {/* gaya palet */}
      <div className="mt-4 space-y-2">
        <div className="text-sm font-semibold text-gray-700">Gaya palet</div>
        <div className="flex rounded-xl border bg-gray-50 p-1">
          <button
            aria-pressed={!p.useClassicColors}
            className={[
              "flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all cursor-pointer",
              !p.useClassicColors
                ? "bg-emerald-700 text-white shadow-sm hover:bg-emerald-700"
                : "text-gray-700 hover:bg-white/70",
              "hover:-translate-y-[1px] active:scale-[.98]",
            ].join(" ")}
            onClick={() => p.setUseClassicColors(false)}
          >
            Default
          </button>
          <button
            aria-pressed={p.useClassicColors}
            className={[
              "ml-1 flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all cursor-pointer",
              p.useClassicColors
                ? "bg-emerald-700 text-white shadow-sm hover:bg-emerald-700"
                : "text-gray-700 hover:bg-white/70",
              "hover:-translate-y-[1px] active:scale-[.98]",
            ].join(" ")}
            onClick={() => p.setUseClassicColors(true)}
          >
            Klasik
          </button>
        </div>
      </div>

      {/* preset cepat */}
      <div className="mt-5">
        <div className="mb-2 text-sm font-semibold text-gray-700">
          Preset cepat
        </div>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => applyPreset("poster")}
            className={[
              "rounded-xl border px-3 py-2 text-xs font-medium transition cursor-pointer active:scale-[.98]",
              activePreset === "poster"
                ? "bg-emerald-700 text-white shadow-sm hover:bg-emerald-700"
                : "hover:bg-gray-50",
            ].join(" ")}
          >
            Poster
          </button>
          <button
            onClick={() => applyPreset("lembut")}
            className={[
              "rounded-xl border px-3 py-2 text-xs font-medium transition cursor-pointer active:scale-[.98]",
              activePreset === "lembut"
                ? "bg-emerald-700 text-white shadow-sm hover:bg-emerald-700"
                : "hover:bg-gray-50",
            ].join(" ")}
          >
            Lembut
          </button>
          <button
            onClick={() => applyPreset("dramatis")}
            className={[
              "rounded-xl border px-3 py-2 text-xs font-medium transition cursor-pointer active:scale-[.98]",
              activePreset === "dramatis"
                ? "bg-emerald-700 text-white shadow-sm hover:bg-emerald-700"
                : "hover:bg-gray-50",
            ].join(" ")}
          >
            Dramatis
          </button>
          <button
            onClick={() => applyPreset("grungePoster")}
            className={[
              "rounded-xl border px-3 py-2 text-xs font-medium transition cursor-pointer active:scale-[.98]",
              activePreset === "grungePoster"
                ? "bg-emerald-700 text-white shadow-sm hover:bg-emerald-700"
                : "hover:bg-gray-50",
            ].join(" ")}
          >
            Grunge
          </button>

          <button
            className={[
              "rounded-xl border px-3 py-2 text-xs font-medium transition cursor-pointer active:scale-[.98]",
              activePreset === "halftone"
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "hover:bg-gray-50",
            ].join(" ")}
            onClick={() => applyPreset("halftone")}
            title="Dot grid halftone klasik"
          >
            Halftone
          </button>
        </div>
      </div>

      {/* Toggle Advanced Settings */}
      <div className="pt-3">
        <button
          type="button"
          onClick={() => setShowAdvanced((s) => !s)}
          aria-expanded={showAdvanced}
          className="group w-full rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50 active:scale-[.99] transition cursor-pointer flex items-center justify-center gap-2"
        >
          <span className="leading-none">
            {showAdvanced
              ? "Sembunyikan Pengaturan Lanjutan"
              : "Tampilkan Pengaturan Lanjutan"}
          </span>
          <svg
            className={`h-4 w-4 transition-transform duration-300 ${
              showAdvanced ? "rotate-180" : ""
            }`}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {!showAdvanced && (
          <p className="mt-1 text-xs text-gray-500">
            Butuh kontrol halus? Atur grain, vignette, glow, tekstur grunge, dan
            lipatan kertas.
          </p>
        )}
      </div>

      <Divider />

      {/* Advanced area dengan animasi expand/collapse */}
      <div
        className={[
          "grid transition-all duration-300 ease-out",
          showAdvanced
            ? "opacity-100 max-h-[1400px] gap-0"
            : "opacity-0 max-h-0 overflow-hidden",
        ].join(" ")}
      >
        <>
          <Divider />
          {/* existing effects */}
          <Slider
            label="Grain"
            value={p.grainAmt}
            min={0}
            max={100}
            unit="%"
            onChange={p.setGrainAmt}
            hint="Tekstur film; terlalu tinggi bisa noisy"
          />
          <Slider
            label="Grain Size"
            value={p.grainSize}
            min={1}
            max={4}
            step={1}
            unit="px"
            onChange={p.setGrainSize}
            hint="Ukuran butir noise (px blok)"
          />

          <Divider />

          <Slider
            label="Vignette"
            value={p.vignette}
            min={0}
            max={100}
            unit="%"
            onChange={p.setVignette}
            hint="Gelapkan tepi untuk fokus subjek"
          />
          <Slider
            label="Vignette Softness"
            value={p.vignetteSoft}
            min={0}
            max={100}
            unit="%"
            onChange={p.setVignetteSoft}
            hint="Semakin besar, transisi makin halus"
          />

          <Divider />

          <Slider
            label="Soft Glow"
            value={p.glowAmt}
            min={0}
            max={100}
            unit="%"
            onChange={p.setGlowAmt}
            hint="Bloom lembut, hati-hati pada area sangat terang"
          />
          <Slider
            label="Glow Blur"
            value={p.glowBlur}
            min={0}
            max={24}
            step={1}
            unit="px"
            onChange={p.setGlowBlur}
            hint="Lebar area glow"
          />

          {/* NEW: Grunge */}
          <Divider />
          <Slider
            label="Grunge"
            value={grungeAmt}
            min={0}
            max={100}
            unit="%"
            onChange={(v) => setGrungeAmt(v)}
            hint="Intensitas grunge, padukan dengan grain untuk hasil maksimal"
          />
          

          {/* Pilih Tekstur Grunge (aktif = hijau) */}
          <div className="mt-2">
            <div className="mb-2 text-xs font-medium text-gray-600">
              Tekstur grunge
            </div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-6">
              {[0, 1, 2, 3, 4, 5, 6, 7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map((i) => (
                <button
                  key={i}
                  onClick={() => p.setGrungeTextureIndex?.(i)}
                  className={[
                    "relative h-14 w-full overflow-hidden rounded-lg border cursor-pointer transition",
                    p.grungeTextureIndex === i
                      ? "bg-emerald-700 text-white "
                      : "hover:bg-gray-50 ",
                  ].join(" ")}
                  title={`Grunge ${i + 1}`}
                  style={{
                    backgroundImage: `url(/textures/${i + 1}.png)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    
                  }}
                >
                  {/* label kecil pojok */}
                  <span
                    className={`absolute bottom-1 right-1 rounded bg-white/80 px-1 text-[10px] ${
                      p.grungeTextureIndex === i
                        ? "text-emerald-700"
                        : "text-gray-700"
                    }`}
                  >
                    {i + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Blend mode */}
          <div className="mt-2">
            <div className="mb-2 text-xs font-medium text-gray-600">
              Blend mode
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(["multiply", "overlay", "soft-light"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => p.setGrungeBlendMode?.(m)}
                  className={[
                    "rounded-lg border px-2 py-1 cursor-pointer transition",
                    p.grungeBlendMode === m
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "hover:bg-gray-50",
                  ].join(" ")}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Halftone dots */}
          <Divider />
          <div className="pt-1">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                Halftone
              </span>
              <button
                type="button"
                onClick={() =>
                  p.setHalftoneEnabled &&
                  p.setHalftoneEnabled(!p.halftoneEnabled)
                }
                aria-pressed={!!p.halftoneEnabled}
                className={[
                  "rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer",
                  p.halftoneEnabled
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                ].join(" ")}
              >
                {p.halftoneEnabled ? "Aktif" : "Nonaktif"}
              </button>
            </div>

            <Slider
              label="Ukuran grid"
              value={p.halftoneSize ?? 6}
              min={3}
              max={16}
              step={1}
              unit="px"
              onChange={(v) => p.setHalftoneSize?.(v)}
              hint="Semakin kecil, titik makin rapat."
            />
            <Slider
              label="Intensitas"
              value={p.halftoneOpacity ?? 35}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={(v) => p.setHalftoneOpacity?.(v)}
              hint="Atur kekuatan dot (multiply overlay)."
            />

            <div className="mt-2">
              <button
                type="button"
                onClick={() => p.setHalftoneInvert?.(!p.halftoneInvert)}
                className={[
                  "rounded-lg border px-3 py-1.5 text-xs transition cursor-pointer",
                  p.halftoneInvert
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "hover:bg-gray-50",
                ].join(" ")}
                title="Balik perilaku dot: dominan di area terang"
              >
                {p.halftoneInvert ? "Mode Terang" : "Mode Gelap"}
              </button>
            </div>
          </div>
        </>
      </div>
    </aside>
  );
}

function Divider() {
  return <div className="h-px w-full bg-gray-200" />;
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (v: number) => void;
  hint?: string;
}) {
  // % progress untuk styling background track
  const pct = ((value - min) * 100) / (max - min);

  return (
    <div>
      {/* Label + badge nilai */}
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
          {value}
          {unit}
        </span>
      </div>

      {/* Track gradient: Hijau → Pink, dengan progress sesuai nilai */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        title={hint}
        className="w-full cursor-pointer appearance-none rounded-full accent-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
        style={{
          height: 8,
          background: `linear-gradient(to right, #165027 0%, #165027 ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`,
          borderRadius: 9999,
        }}
      />

      {/* Hint kecil */}
      {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
    </div>
  );
}
