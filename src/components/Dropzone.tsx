"use client";
import * as React from "react";

interface DropzoneProps {
  onPickFile: (file: File) => void;
}

export default function Dropzone({ onPickFile }: DropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = React.useState(false);


const onDrop = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);
  const file = e.dataTransfer.files?.[0];
  if (file) onPickFile(file);
};

const onDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
  if (!dragActive) setDragActive(true);
};

const onDragEnter = (e: React.DragEvent) => {
  e.preventDefault();
  if (!dragActive) setDragActive(true);
};

const onDragLeave = (e: React.DragEvent) => {
  // kalau pointer keluar dari area label, matikan state
  if (e.currentTarget === e.target) setDragActive(false);
};

const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  const f = e.target.files?.[0];
  if (f) onPickFile(f);
  e.currentTarget.value = "";
};


  return (
    <label
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      className={[
        "relative block cursor-pointer rounded-2xl border border-dashed p-8 text-center transition shadow-sm",
        dragActive
          ? "border-emerald-500 bg-emerald-50/40"
          : "border-gray-300 bg-white hover:border-gray-400",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInput}
        className="hidden"
      />

      {/* Icon */}
      <div
        className={`mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full
  ${dragActive ? "bg-emerald-100" : "bg-gray-100"}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`h-6 w-6 ${
            dragActive ? "text-emerald-700 animate-pulse" : "text-gray-600"
          }`}
        >
          <path d="M12 16a1 1 0 0 1-1-1V8.41L9.7 9.7a1 1 0 1 1-1.4-1.42l3-3a1 1 0 0 1 1.4 0l3 3a1 1 0 1 1-1.4 1.42L13 8.4V15a1 1 0 0 1-1 1Z" />
          <path d="M5 19a3 3 0 0 1-3-3v-2a1 1 0 1 1 2 0v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2a1 1 0 1 1 2 0v2a3 3 0 0 1-3 3H5Z" />
        </svg>
      </div>

      {/* Teks default / saat drag */}
      {!dragActive ? (
        <>
          <p className="font-medium">Klik untuk unggah atau seret & lepaskan</p>
          <p className="text-xs text-gray-500">PNG/JPG hingga ~10MB</p>
        </>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <p className="font-semibold text-emerald-700">Lepas untuk unggah</p>
          <p className="text-xs text-emerald-700/80">Kami siapkan filternya…</p>
        </div>
      )}
    </label>
  );
}
