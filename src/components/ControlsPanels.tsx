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
  grungeScale?: number;
  setGrungeScale?: Setter<number>;
  foldsEnabled?: boolean;
  setFoldsEnabled?: Setter<boolean>;
  foldStrength?: number;
  setFoldStrength?: Setter<number>;
  foldDirection?: "horizontal" | "vertical" | "diagonal";
  setFoldDirection?: Setter<"horizontal" | "vertical" | "diagonal">;
  foldCount?: number;
  setFoldCount?: Setter<number>;

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
  const grungeScale = defined(p.grungeScale, 80);
  const foldsEnabled = defined(p.foldsEnabled, false);
  const foldStrength = defined(p.foldStrength, 0);
  const foldDirection = defined(p.foldDirection, "diagonal");
  const foldCount = defined(p.foldCount, 1);

  const setGrungeAmt = p.setGrungeAmt ?? (() => {});
  const setGrungeScale = p.setGrungeScale ?? (() => {});
  const setFoldsEnabled = p.setFoldsEnabled ?? (() => {});
  const setFoldStrength = p.setFoldStrength ?? (() => {});
  const setFoldDirection = p.setFoldDirection ?? (() => {});
  const setFoldCount = p.setFoldCount ?? (() => {});

  // presets
  const applyPreset = (
    name: "poster" | "lembut" | "dramatis" | "grungePoster"
  ) => {
    if (name === "poster") {
      p.setGrainAmt(18);
      p.setGrainSize(1);
      p.setVignette(30);
      p.setVignetteSoft(60);
      p.setGlowAmt(12);
      p.setGlowBlur(6);
      setGrungeAmt(0);
      setFoldsEnabled(false);
    } else if (name === "lembut") {
      p.setGrainAmt(8);
      p.setGrainSize(1);
      p.setVignette(18);
      p.setVignetteSoft(80);
      p.setGlowAmt(28);
      p.setGlowBlur(12);
      setGrungeAmt(0);
      setFoldsEnabled(false);
    } else if (name === "dramatis") {
      p.setGrainAmt(26);
      p.setGrainSize(2);
      p.setVignette(42);
      p.setVignetteSoft(50);
      p.setGlowAmt(18);
      p.setGlowBlur(10);
      setGrungeAmt(0.2 * 100);
      setGrungeScale(90);
      setFoldsEnabled(true);
      setFoldStrength(20);
      setFoldDirection("diagonal");
      setFoldCount(1);
    } else {
      // grunge poster
      p.setGrainAmt(20);
      p.setGrainSize(2);
      p.setVignette(24);
      p.setVignetteSoft(65);
      p.setGlowAmt(10);
      p.setGlowBlur(6);
      setGrungeAmt(45);
      setGrungeScale(100);
      setFoldsEnabled(true);
      setFoldStrength(28);
      setFoldDirection("diagonal");
      setFoldCount(1);
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
            hint="Bloom lembut; hati-hati pada area sangat terang"
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
            hint="Bintik, blotch, goresan halus"
          />
          <Slider
            label="Grunge Scale"
            value={grungeScale}
            min={10}
            max={200}
            step={1}
            unit=""
            onChange={(v) => setGrungeScale(v)}
            hint="Ukuran pola tekstur"
          />

          {/* Lipatan kertas */}
          <div className="pt-2">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                Lipatan kertas
              </span>

              {/* Toggle aktif (hijau saat ON) */}
              <button
                type="button"
                onClick={() => setFoldsEnabled(!foldsEnabled)}
                aria-pressed={foldsEnabled}
                className={[
                  "rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer",
                  foldsEnabled
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                ].join(" ")}
                title={foldsEnabled ? "Matikan lipatan" : "Aktifkan lipatan"}
              >
                {foldsEnabled ? "Aktif" : "Nonaktif"}
              </button>
            </div>

            {/* Kekuatan lipatan */}
            <Slider
              label="Kekuatan lipatan"
              value={foldStrength}
              min={0}
              max={100}
              unit="%"
              onChange={(v) => setFoldStrength(v)}
              hint="Atur seberapa jelas highlight & shadow lipatan."
            />

            {/* Arah lipatan */}
            <div className="mt-3">
              <div className="mb-2 text-xs font-medium text-gray-600">
                Arah lipatan
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => setFoldDirection("horizontal")}
                  className={[
                    "rounded-lg border px-2 py-1 transition cursor-pointer",
                    foldDirection === "horizontal"
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "hover:bg-gray-50",
                  ].join(" ")}
                >
                  Horizontal
                </button>
                <button
                  onClick={() => setFoldDirection("vertical")}
                  className={[
                    "rounded-lg border px-2 py-1 transition cursor-pointer",
                    foldDirection === "vertical"
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "hover:bg-gray-50",
                  ].join(" ")}
                >
                  Vertikal
                </button>
                <button
                  onClick={() => setFoldDirection("diagonal")}
                  className={[
                    "rounded-lg border px-2 py-1 transition cursor-pointer",
                    foldDirection === "diagonal"
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "hover:bg-gray-50",
                  ].join(" ")}
                >
                  Diagonal
                </button>
              </div>
            </div>

            {/* Jumlah lipatan (pakai Slider juga) */}
            <div className="mt-3">
              <Slider
                label="Jumlah lipatan"
                value={foldCount}
                min={1}
                max={5}
                step={1}
                unit=""
                onChange={(v) => setFoldCount(v)}
                hint="1–5 lipatan; makin banyak, makin 'poster terlipat'."
              />
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