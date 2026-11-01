/**
 * Host de las imágenes en local.
 *
 * Con `ENV=LOCAL` las URLs de `img.gycoding.com` se sirven desde el servidor directo (el DNS de
 * Cloudflare está caído). En cualquier otro entorno no se toca nada. Solo se cambia el origen:
 * la ruta (`/hoc/worlds/icons/alfheim.webp`) se conserva.
 */
export const REMOTE_IMAGE_ORIGIN = "https://img.gycoding.com";
export const LOCAL_IMAGE_ORIGIN = process.env.LOCAL_IMAGE_ORIGIN ?? "http://194.163.133.153:7000";

export const isLocalEnv = (): boolean => process.env.ENV === "LOCAL";

/** Cambia el origen de una URL de imagen si estamos en local; si no, la devuelve igual. */
export function localizeImageUrl<T>(value: T): T {
  if (!isLocalEnv() || typeof value !== "string" || !value.startsWith(REMOTE_IMAGE_ORIGIN)) {
    return value;
  }
  return (LOCAL_IMAGE_ORIGIN + value.slice(REMOTE_IMAGE_ORIGIN.length)) as T;
}

/** Recorre un documento ya serializado y localiza todas sus URLs de imagen (anidadas incluidas). */
export function localizeImageUrls<T>(value: T): T {
  if (!isLocalEnv()) return value;
  if (typeof value === "string") return localizeImageUrl(value);
  if (Array.isArray(value)) return value.map(localizeImageUrls) as T;
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, localizeImageUrls(v)]),
    ) as T;
  }
  return value;
}
