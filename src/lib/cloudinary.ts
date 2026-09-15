import { uploadImage as uploadToSupabase } from "./supabase";

/* Cloudinary, for two jobs.
 *
 *   DELIVERY  cldUrl() rewrites a stored URL to ask for a right sized, modern
 *             format rendition. Needed because Supabase image transformations
 *             are NOT available on this project's plan
 *             (`/storage/v1/render/image/...` answers 403 FeatureNotEnabled),
 *             so a 219px thumbnail would otherwise pull a full 1280x800 JPEG.
 *
 *   UPLOAD    uploadCover() posts straight to Cloudinary with an UNSIGNED
 *             preset, which is how the sibling projects already do it.
 *
 * Why unsigned, decided 15/09/2026: the account's API key is refused `create`
 * (403 actions=["create"]), and the preset this uses is ALREADY public in
 * gr8qm's shipped bundle, so the portfolio adds no exposure that is not there
 * already. Yemi's call, on the grounds that nothing here is secret.
 *
 * api/sign-upload.ts is kept, unused, for the day a key with create permission
 * exists. Switching back is a config change, not a rewrite. */

type Fit = { w?: number; h?: number };

/** Adds format, quality and a size ceiling to a Cloudinary URL.
 *
 *  Passes any other URL through UNCHANGED, which is what makes this safe while
 *  the images still live on Supabase, and safe for any URL pasted by hand. */
export function cldUrl<T extends string | null | undefined>(url: T, fit: Fit = {}): T {
  if (!url) return url;
  const marker = "/image/upload/";
  const at = url.indexOf(marker);
  if (at === -1) return url;

  const head = url.slice(0, at + marker.length);
  const tail = url.slice(at + marker.length);

  /* c_limit scales DOWN only. It never upscales and never crops, which matters:
     these are screenshots, and the display deliberately uses object-contain so
     the page stays readable. c_fill here would quietly reintroduce cropping. */
  const parts = ["f_auto", "q_auto"];
  if (fit.w) parts.push(`w_${fit.w}`);
  if (fit.h) parts.push(`h_${fit.h}`);
  if (fit.w || fit.h) parts.push("c_limit");

  return `${head}${parts.join(",")}/${tail}` as T;
}

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
/** Overridable so a restricted, portfolio-only preset can replace the shared
 *  default later without touching code. */
const PRESET = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined) || "ml_default";
const ROOT = "bigyems-portfolio";

/** Uploads a cover and returns its public URL.
 *
 *  Falls back to Supabase storage when no cloud name is configured, so a build
 *  without the env var still has a working admin rather than a broken one. */
export async function uploadCover(file: File, slug: string): Promise<string> {
  if (!CLOUD) {
    console.warn("VITE_CLOUDINARY_CLOUD_NAME is not set; uploading to Supabase storage instead.");
    return uploadToSupabase(file, slug);
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", PRESET);
  form.append("folder", `${ROOT}/${slug}`);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(body.error?.message ?? `Cloudinary rejected the upload (${res.status}).`);
  }
  const json = (await res.json()) as { secure_url?: string };
  if (!json.secure_url) throw new Error("Cloudinary returned no URL.");
  return json.secure_url;
}
