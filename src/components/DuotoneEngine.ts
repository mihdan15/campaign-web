const OPTIMIZED_SHADOW_COLOR = { r: 22, g: 80, b: 39 };
const OPTIMIZED_HIGHLIGHT_COLOR = { r: 249, g: 159, b: 210 };
const CLASSIC_SHADOW_COLOR = { r: 27, g: 96, b: 47 };
const CLASSIC_HIGHLIGHT_COLOR = { r: 247, g: 132, b: 197 };
const MAX_DIMENSION = 3000;

export interface ProcessingResult {
  processedCanvas: HTMLCanvasElement;
  dimensions: { width: number; height: number };
}

const enhanceContrast = (value: number): number => {
  const exponent = 1.8;
  if (value < 0.5) return Math.pow(value * 2, exponent) / 2;
  return 1 - Math.pow((1 - value) * 2, exponent) / 2;
};

export const processDuotoneImage = async (
  file: File,
  canvas: HTMLCanvasElement,
  isReversed = false,
  useClassicColors = false
): Promise<ProcessingResult> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        const result = processImageOnCanvas(
          img,
          canvas,
          isReversed,
          useClassicColors
        );
        resolve(result);
      } catch (e) {
        reject(e);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
};

const processImageOnCanvas = (
  img: HTMLImageElement,
  canvas: HTMLCanvasElement,
  isReversed: boolean,
  useClassicColors: boolean
): ProcessingResult => {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("No canvas context");

  const { width, height } = calculateDimensions(
    img.naturalWidth,
    img.naturalHeight
  );
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  let minLuminance = 255,
    maxLuminance = 0;
  for (let i = 0; i < data.length; i += 4) {
    const l = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    if (l < minLuminance) minLuminance = l;
    if (l > maxLuminance) maxLuminance = l;
  }
  const range = maxLuminance - minLuminance || 1;

  const base = useClassicColors
    ? { shadow: CLASSIC_SHADOW_COLOR, highlight: CLASSIC_HIGHLIGHT_COLOR }
    : { shadow: OPTIMIZED_SHADOW_COLOR, highlight: OPTIMIZED_HIGHLIGHT_COLOR };

  const shadow = isReversed ? base.highlight : base.shadow;
  const highlight = isReversed ? base.shadow : base.highlight;

  for (let i = 0; i < data.length; i += 4) {
    const l = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    let n = Math.max(0, Math.min(1, (l - minLuminance) / range));
    n = enhanceContrast(n);
    data[i] = Math.round(shadow.r + n * (highlight.r - shadow.r));
    data[i + 1] = Math.round(shadow.g + n * (highlight.g - shadow.g));
    data[i + 2] = Math.round(shadow.b + n * (highlight.b - shadow.b));
  }
  ctx.putImageData(imageData, 0, 0);

  return { processedCanvas: canvas, dimensions: { width, height } };
};

const calculateDimensions = (w: number, h: number) => {
  if (w <= MAX_DIMENSION && h <= MAX_DIMENSION) return { width: w, height: h };
  const scale = MAX_DIMENSION / Math.max(w, h);
  return { width: Math.round(w * scale), height: Math.round(h * scale) };
};
