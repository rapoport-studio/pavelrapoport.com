export const locales = ["en", "ru", "ro"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const categories = ["build", "signal", "layers", "notes"] as const;
export type Category = (typeof categories)[number];
