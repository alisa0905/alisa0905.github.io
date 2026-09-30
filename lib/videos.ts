// Screen recordings of the live websites (public/work/video). Each has a poster frame.
export const VIDEOS = {
  "cc-desktop": { src: "/work/video/cc-desktop.mp4", poster: "/work/video/cc-desktop.jpg", w: 1280, h: 800 },
  "cc-mobile": { src: "/work/video/cc-mobile.mp4", poster: "/work/video/cc-mobile.jpg", w: 390, h: 844 },
  "q-desktop": { src: "/work/video/q-desktop.mp4", poster: "/work/video/q-desktop.jpg", w: 1280, h: 800 },
  "q-mobile": { src: "/work/video/q-mobile.mp4", poster: "/work/video/q-mobile.jpg", w: 390, h: 844 },
} as const;

export type VideoName = keyof typeof VIDEOS;
