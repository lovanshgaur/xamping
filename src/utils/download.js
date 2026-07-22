/** Trigger a client-side file download for the given text payload. */
export function downloadText(filename, contents, mime = "application/json") {
  const blob = new Blob([contents], { type: mime });
  triggerDownload(filename, blob);
}

/** Trigger a client-side file download for a Blob. */
export function triggerDownload(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

/**
 * Serialize an SVG element into a PNG blob.
 * @param {SVGSVGElement} svg
 * @param {{ scale?: number, background?: string }} [opts]
 * @returns {Promise<Blob>}
 */
export function svgToPng(svg, opts = {}) {
  const scale = opts.scale ?? 2;
  const background = opts.background ?? null;

  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);
  const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const rect = svg.getBoundingClientRect();
  const width = Math.max(rect.width, 1);
  const height = Math.max(rect.height, 1);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas 2D unavailable"));
        return;
      }
      if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("PNG encoding failed"));
      }, "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("SVG load failed"));
    };
    img.src = url;
  });
}
