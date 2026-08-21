const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Client-side guardrail for image uploads. This is a UX/defense-in-depth
 * layer, not the real security boundary — Firebase Storage rules must also
 * enforce type/size limits server-side, since client checks can be bypassed.
 */
export function validateImageFile(file: File): FileValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Please choose a JPEG, PNG, WebP, or GIF image.' };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { valid: false, error: 'Image must be smaller than 5MB.' };
  }
  return { valid: true };
}
