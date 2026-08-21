/**
 * Uploads an image to Cloudinary's free tier using an unsigned upload preset.
 *
 * Setup required (one-time, in your Cloudinary dashboard — free, no card):
 *   1. Sign up at cloudinary.com (Google/GitHub/email, no card needed).
 *   2. Settings → Upload → Upload presets → Add upload preset.
 *      Set "Signing Mode" to "Unsigned". Name it (e.g. "shoppa_uploads").
 *   3. Set these env vars (safe to expose client-side — they're not secrets):
 *      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your cloud name, shown on your dashboard>
 *      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<the preset name from step 2>
 */

export interface CloudinaryUploadResult {
  url: string;
}

export async function uploadImageToCloudinary(file: File, folder: string): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Image uploads are not configured yet. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Cloudinary upload failed:', errorBody);
    throw new Error('Image upload failed. Please try again.');
  }

  const data = await response.json();
  return { url: data.secure_url as string };
}
