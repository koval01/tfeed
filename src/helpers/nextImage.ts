export const nextImage = (src: string, size: number) => {
   return `/_next/image?url=${encodeURIComponent(src)}&w=${size}&q=70`;
}
