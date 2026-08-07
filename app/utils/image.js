/**
 * MediNova — Image loading utilities.
 */

/** Lazy-load image with error fallback. */
export function setupImage(img, src, fallbackSrc) {
  if (!img) return;
  const onError = () => {
    img.dataset.error = "1";
    if (fallbackSrc) {
      img.onerror = null;
      img.src = fallbackSrc;
    } else {
      img.onerror = null;
      img.src = "";
      img.classList.add("img-missing");
    }
  };
  img.onerror = onError;
  if (src) img.src = src;
  else onError();
}

/** Preload a batch of images and resolve when all settled. */
export function preloadImages(urls) {
  return Promise.allSettled(
    (urls || []).map(
      (u) =>
        new Promise((resolve, reject) => {
          if (!u) return reject(new Error("no url"));
          const img = new Image();
          img.onload = () => resolve(u);
          img.onerror = () => reject(new Error(`failed: ${u}`));
          img.src = u;
        })
    )
  );
}

/** Build an Image element with loading="lazy" + alt fallback. */
export function lazyImage(src, alt = "", className = "", fallbackSrc) {
  const img = document.createElement("img");
  img.className = className || "";
  img.alt = alt || "";
  img.loading = "lazy";
  img.decoding = "async";
  setupImage(img, src, fallbackSrc);
  return img;
}

/** Create an SVG data-uri placeholder with initials. */
export function avatarFallback(name, colors = { bg: "#1a1440", fg: "#a78bfa" }) {
  const ini = (name || "?")
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='200' height='200' rx='40' fill='${colors.bg}'/><text x='50%' y='50%' dy='.38em' text-anchor='middle' font-family='Sora,sans-serif' font-size='64' font-weight='700' fill='${colors.fg}'>${ini}</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

/** File -> data URL (async). */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** File -> object URL. */
export function fileToObjectUrl(file) {
  return URL.createObjectURL(file);
}

/** Check file is an image. */
export function isImageFile(file) {
  return file && /^image\//.test(file.type);
}

/** Compute whether an image URL is likely webp-optimizable. */
export function isWebpUrl(url) {
  return /\.webp(\?|$)/i.test(String(url || ""));
}

/** Resize an image via canvas (for uploads). */
export function resizeImage(file, maxSize = 800, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!isImageFile(file)) return reject(new Error("Not an image"));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Compression failed"))),
        "image/webp",
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image failed to load"));
    };
    img.src = url;
  });
}

export default { setupImage, preloadImages, lazyImage, avatarFallback, fileToDataUrl, fileToObjectUrl, isImageFile, isWebpUrl, resizeImage };
