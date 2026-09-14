import type { AppId } from "./useWindows";

/** Every shell draws the SAME set of apps in its OWN icon language, including
 *  the container: a macOS squircle with a gradient, a flat Yaru rounded
 *  square, a containerless two-tone Fluent shape. Tinting one glyph set three
 *  ways is what made all three feel like the same desktop. */
export type IconKey = AppId | "globe" | "browser";
export type IconProps = { app: IconKey; size?: number; className?: string };
