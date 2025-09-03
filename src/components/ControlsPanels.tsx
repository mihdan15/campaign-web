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
  };

  return (
    <aside className="rounded-2xl border bg-white p-4 shadow-sm space-y-5">
      {/* mapping */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-gray-700">Mapping</div>
        <div className="flex rounded-xl border bg-gray-50 p-1">
          <button
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
              !p.isReversed
                ? "bg-white shadow-sm ring-1 ring-black/5"
                : "text-gray-600 hover:bg-white/60"
            }`}
            onClick={() => p.setIsReversed(false)}
          >
            Green→Shadows / Pink→Highlights
          </button>
          <button
            className={`ml-1 flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
              p.isReversed
                ? "bg-white shadow-sm ring-1 ring-black/5"
                : "text-gray-600 hover:bg-white/60"
            }`}
            onClick={() => p.setIsReversed(true)}
          >
            Pink→Shadows / Green→Highlights
          </button>
        </div>
      </div>

      {/* palette */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-gray-700">Palet Warna</div>
        <div className="flex rounded-xl border bg-gray-50 p-1">
          <button
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
              !p.useClassicColors
                ? "bg-white shadow-sm ring-1 ring-black/5"
                : "text-gray-600 hover:bg-white/60"
            }`}
            onClick={() => p.setUseClassicColors(false)}
          >
            Optimized
          </button>
          <button
            className={`ml-1 flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
              p.useClassicColors
                ? "bg-white shadow-sm ring-1 ring-black/5"
                : "text-gray-600 hover:bg-white/60"
            }`}
            onClick={() => p.setUseClassicColors(true)}
          >
            Classic
          </button>
        </div>
      </div>

      {/* presets */}
      <div>
        <div className="mb-2 text-sm font-semibold text-gray-700">Presets</div>
        <div className="grid grid-cols-4 gap-2">
          <button
            className="rounded-xl border px-3 py-2 text-xs font-medium hover:bg-gray-50"
            onClick={() => applyPreset("poster")}
          >
            Poster
          </button>
          <button
            className="rounded-xl border px-3 py-2 text-xs font-medium hover:bg-gray-50"
            onClick={() => applyPreset("lembut")}
          >
            Lembut
          </button>
          <button
            className="rounded-xl border px-3 py-2 text-xs font-medium hover:bg-gray-50"
            onClick={() => applyPreset("dramatis")}
          >
            Dramatis
          </button>
          <button
            className="rounded-xl border px-3 py-2 text-xs font-medium hover:bg-gray-50"
            onClick={() => applyPreset("grungePoster")}
          >
            Grunge
          </button>
        </div>
      </div>

      {/* Toggle Advanced Settings */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowAdvanced((s) => !s)}
          aria-expanded={showAdvanced}
          className="w-full rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          {showAdvanced
            ? "Sembunyikan Pengaturan Lanjutan"
            : "✨ Tampilkan Pengaturan Lanjutan"}
        </button>
        {!showAdvanced && (
          <p className="mt-1 text-xs text-gray-500">
            Butuh kontrol halus? Buka untuk atur grain, vignette, glow, tekstur
            grunge, dan lipatan kertas.
          </p>
        )}
      </div>

      <Divider />

      {showAdvanced && (
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

          {/* NEW: Paper Folds */}
          <div className="pt-2">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                Paper Fold
              </span>
              <label className="inline-flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={foldsEnabled}
                  onChange={(e) => setFoldsEnabled(e.target.checked)}
                />{" "}
                Aktif
              </label>
            </div>
            <Slider
              label="Fold Strength"
              value={foldStrength}
              min={0}
              max={100}
              unit="%"
              onChange={(v) => setFoldStrength(v)}
            />
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => setFoldDirection("horizontal")}
                className={`rounded border px-2 py-1 ${
                  foldDirection === "horizontal"
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-50"
                }`}
              >
                Horizontal
              </button>
              <button
                onClick={() => setFoldDirection("vertical")}
                className={`rounded border px-2 py-1 ${
                  foldDirection === "vertical"
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-50"
                }`}
              >
                Vertical
              </button>
              <button
                onClick={() => setFoldDirection("diagonal")}
                className={`rounded border px-2 py-1 ${
                  foldDirection === "diagonal"
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-50"
                }`}
              >
                Diagonal
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span>Jumlah lipatan</span>
              <input
                type="range"
                min={1}
                max={5}
                value={foldCount}
                onChange={(e) => setFoldCount(Number(e.target.value))}
              />
              <span className="tabular-nums">{foldCount}</span>
            </div>
          </div>
        </>
      )}


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
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-gray-900"
        title={hint}
      />
      {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
    </div>
  );
}
