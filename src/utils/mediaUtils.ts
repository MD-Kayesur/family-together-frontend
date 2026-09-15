// Helper utilities for media file handling, video detection, and parsing multiple media items

export function parseMediaUrls(mediaUrl?: string | null): string[] {
  if (!mediaUrl) return [];

  // Case 1: JSON array string e.g. ["data:video/mp4;base64,...", "http://..."]
  if (mediaUrl.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(mediaUrl);
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => typeof item === "string" && item.trim().length > 0);
      }
    } catch {
      // fallback to comma splitting
    }
  }

  // Case 2: Comma separated string or single URL
  return mediaUrl
    .split(",")
    .map((s) => s.trim())
    .filter((s) => Boolean(s) && !s.startsWith("Files ["));
}

export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  if (url.includes("#video") || url.startsWith("data:video/")) return true;
  const cleanUrl = url.toLowerCase().split("?")[0].split("#")[0];
  return (
    cleanUrl.endsWith(".mp4") ||
    cleanUrl.endsWith(".webm") ||
    cleanUrl.endsWith(".mov") ||
    cleanUrl.endsWith(".ogg") ||
    cleanUrl.endsWith(".m4v") ||
    cleanUrl.includes("video")
  );
}

export async function readFilesAsDataURLs(files: File[]): Promise<string[]> {
  const MAX_BASE64_SIZE = 8 * 1024 * 1024; // 8 MB threshold to avoid browser V8 Out-Of-Memory

  return Promise.all(
    files.map((file) => {
      const isVid = file.type.startsWith("video/");

      // For large files (> 8 MB) or videos, use lightweight Object URL with type hash to keep RAM minimal
      if (file.size > MAX_BASE64_SIZE) {
        const objectUrl = URL.createObjectURL(file);
        return Promise.resolve(isVid ? `${objectUrl}#video` : `${objectUrl}#image`);
      }

      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => {
          const objectUrl = URL.createObjectURL(file);
          resolve(isVid ? `${objectUrl}#video` : `${objectUrl}#image`);
        };
        reader.readAsDataURL(file);
      });
    })
  );
}
