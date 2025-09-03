"use client";
import * as React from "react";

interface DropzoneProps {
  onPickFile: (file: File) => void;
}

export default function Dropzone({ onPickFile }: DropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) onPickFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onPickFile(f);
    // penting: reset agar memilih file yang sama tetap memicu onChange
    e.currentTarget.value = "";
  };

  return (
    <label
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="block cursor-pointer rounded-2xl border border-dashed border-gray-300 p-8 text-center hover:border-gray-400 transition shadow-sm bg-white"
    >
      {/* JANGAN pakai onClick di label, biarkan default label→input yang trigger */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInput}
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
  );
}
