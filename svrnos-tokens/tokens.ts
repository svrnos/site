/**
 * @svrnos/tokens — TS constants
 *
 * Mirrors tokens.css for code that needs JS-side access (chart palettes,
 * canvas/SVG fills, runtime theming). For CSS, prefer var(--svrnos-*).
 */

export const brand = {
  primary: "#2f5d50",
  hover: "#284f44",
  active: "#22443a",
  ring: "rgba(47, 93, 80, 0.25)",
  disabled: "#779b91",
  diagnostic: "#2f6a4e",
} as const;

export const surface = {
  light: {
    page: "#fafaf9",
    card: "#ffffff",
    hover: "#f2f5f4",
    optionHover: "#f4f6f7",
    selected: "#eef3f1",
    idcard: "#e9eef1",
    idcardHeader: "#dde5ea",
    muted: "#f2f2ee",
    overlay: "rgba(55, 65, 81, 0.6)",
    overlaySolid: "#797c7e",
  },
  dark: {
    page: "#0e1110",
    card: "#15191a",
    hover: "#1c2122",
    selected: "#1f2a26",
    muted: "#161a1a",
    elevated: "#1a1f1f",
  },
} as const;

export const text = {
  light: {
    heading: "#1a1a1a",
    bodyPrimary: "#2c3943",
    bodySecondary: "#61707c",
    label: "#64748b",
    labelAlt: "#8a949b",
    strong: "#111827",
    inverse: "#ffffff",
    navLink: "#6b747b",
    navLinkHover: "#1f2428",
  },
  dark: {
    heading: "#f2f4f3",
    bodyPrimary: "#cfd5d3",
    bodySecondary: "#8a948f",
    label: "#6f7873",
    labelAlt: "#555c58",
    strong: "#ffffff",
    inverse: "#0e1110",
    navLink: "#8a948f",
    navLinkHover: "#f2f4f3",
  },
} as const;

export const border = {
  light: {
    default: "#e6e9ec",
    soft: "#e6eaed",
    subtle: "rgba(0, 0, 0, 0.12)",
    hairline: "rgba(0, 0, 0, 0.05)",
    vertical: "#d4d4d4",
    cardBoard: "rgba(0, 0, 0, 0.08)",
  },
  dark: {
    default: "#262c2c",
    soft: "#1f2424",
    subtle: "rgba(255, 255, 255, 0.10)",
    hairline: "rgba(255, 255, 255, 0.05)",
    vertical: "#2c3232",
  },
} as const;

export const radius = {
  button: 8,
  input: 8,
  card: 6,
  pill: 999,
  none: 0,
} as const;

export const space = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s8: 32,
  s10: 40,
  s12: 48,
  s15: 60,
  s18: 72,
  s30: 120,
} as const;

export const fontFamily = {
  sans: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  serif:
    '"Instrument Serif", "Iowan Old Style", Charter, Georgia, "Times New Roman", serif',
  mono: '"Geist Mono", ui-monospace, "SF Mono", Menlo, Consolas, "JetBrains Mono", monospace',
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const fontScale = {
  display: { size: 32, line: 38, tracking: -0.64, weight: 500 },
  editorial: { size: 56, line: 60, tracking: -1.4, weight: 400 },
  h2: { size: 24, line: 32, tracking: -0.24, weight: 600 },
  size28: { size: 28, line: 36 },
  h3: { size: 18, line: 27 },
  body: { size: 16, line: 26, tightLine: 24 },
  bodySm: { size: 14, line: 21 },
  field: { size: 13, line: 20 },
  label: { size: 11, line: 16, tracking: 1.32, weight: 600 },
} as const;

export const feedback = {
  light: {
    success: "#2f6a4e",
    successSoft: "#e8f3ed",
    warning: "#b07a00",
    warningSoft: "#faf3e0",
    error: "#b23a3a",
    errorSoft: "#f8eaea",
    info: "#2f5d7a",
    infoSoft: "#e9f1f6",
    disabled: "#a9b8b3",
  },
  dark: {
    success: "#6dbf99",
    successSoft: "#18302a",
    warning: "#d9a64a",
    warningSoft: "#2d2516",
    error: "#e07878",
    errorSoft: "#2d1818",
    info: "#6da7c4",
    infoSoft: "#182530",
  },
} as const;

export const motion = {
  fast: 125,
  base: 200,
  slow: 320,
  ease: "cubic-bezier(0.2, 0, 0.13, 1.5)",
} as const;

export const tokens = {
  brand,
  surface,
  text,
  border,
  radius,
  space,
  fontFamily,
  fontWeight,
  fontScale,
  feedback,
  motion,
} as const;

export type SvrnosTokens = typeof tokens;
