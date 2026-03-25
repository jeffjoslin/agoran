/**
 * Agoran Design Tokens — Liquid Glass Design System
 *
 * Repo location: app/src/styles/design-tokens.ts
 *
 * ⚠️  MANDATORY RULE:
 * All Liquid Glass styling MUST use tokens from this file.
 * NEVER write backdrop-blur, bg-white/*, border-white/*, or shadow classes inline.
 * If a new pattern is needed, add a named token here FIRST, then use it.
 *
 * Usage:
 *   import { GLASS_CARD, GLASS_BUTTON_PRIMARY } from '@/styles/design-tokens';
 *   <div className={GLASS_CARD}>...</div>
 */

// ---------------------------------------------------------------------------
// GLASS SURFACE LAYERS
// Base glass surfaces — use for cards, panels, modals, containers
// ---------------------------------------------------------------------------

/** Primary glass card — main content containers */
export const GLASS_CARD =
  'backdrop-blur-xl bg-white/8 border border-white/12 rounded-2xl shadow-glass';

/** Elevated glass card — hover states, featured content */
export const GLASS_CARD_ELEVATED =
  'backdrop-blur-xl bg-white/12 border border-white/18 rounded-2xl shadow-glass-elevated';

/** Subtle glass panel — sidebars, secondary panels */
export const GLASS_PANEL =
  'backdrop-blur-lg bg-white/5 border border-white/8 rounded-xl shadow-glass-subtle';

/** Deep glass — modal backdrops, overlays */
export const GLASS_MODAL =
  'backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl shadow-glass-deep';

/** Glass overlay scrim — full-screen dimming behind modals */
export const GLASS_SCRIM = 'backdrop-blur-sm bg-black/30';

/** Frosted section divider */
export const GLASS_DIVIDER = 'border-t border-white/10';

// ---------------------------------------------------------------------------
// BUTTONS
// ---------------------------------------------------------------------------

/** Primary CTA button — Buy Now, Publish, Submit */
export const GLASS_BUTTON_PRIMARY =
  'backdrop-blur-md bg-white/15 hover:bg-white/22 active:bg-white/10 ' +
  'border border-white/25 hover:border-white/35 ' +
  'text-white font-semibold ' +
  'rounded-xl px-6 py-3 ' +
  'shadow-glass-button hover:shadow-glass-button-hover ' +
  'transition-all duration-200 ease-out ' +
  'cursor-pointer select-none';

/** Secondary button — Cancel, Back, secondary actions */
export const GLASS_BUTTON_SECONDARY =
  'backdrop-blur-md bg-white/6 hover:bg-white/10 active:bg-white/4 ' +
  'border border-white/12 hover:border-white/20 ' +
  'text-white/70 hover:text-white font-medium ' +
  'rounded-xl px-6 py-3 ' +
  'transition-all duration-200 ease-out ' +
  'cursor-pointer select-none';

/** Destructive button — Delete, Unpublish, Remove */
export const GLASS_BUTTON_DESTRUCTIVE =
  'backdrop-blur-md bg-red-500/15 hover:bg-red-500/25 active:bg-red-500/10 ' +
  'border border-red-400/25 hover:border-red-400/40 ' +
  'text-red-300 hover:text-red-200 font-medium ' +
  'rounded-xl px-6 py-3 ' +
  'transition-all duration-200 ease-out ' +
  'cursor-pointer select-none';

/** Icon button — toolbar icons, action icons */
export const GLASS_BUTTON_ICON =
  'backdrop-blur-md bg-white/8 hover:bg-white/14 active:bg-white/5 ' +
  'border border-white/12 hover:border-white/20 ' +
  'text-white/70 hover:text-white ' +
  'rounded-lg p-2 ' +
  'transition-all duration-200 ease-out ' +
  'cursor-pointer select-none';

/** Selected/active state — for toggle buttons, nav items */
export const GLASS_BUTTON_SELECTED =
  'backdrop-blur-md bg-white/20 ' +
  'border border-white/30 ' +
  'text-white font-semibold ' +
  'rounded-xl px-6 py-3 ' +
  'shadow-glass-inset ' +
  'cursor-pointer select-none';

/** Unselected/inactive state — pair with GLASS_BUTTON_SELECTED */
export const GLASS_BUTTON_UNSELECTED =
  'backdrop-blur-md bg-transparent hover:bg-white/8 ' +
  'border border-white/8 hover:border-white/16 ' +
  'text-white/50 hover:text-white/80 font-medium ' +
  'rounded-xl px-6 py-3 ' +
  'transition-all duration-200 ease-out ' +
  'cursor-pointer select-none';

// ---------------------------------------------------------------------------
// INPUTS & FORMS
// ---------------------------------------------------------------------------

/** Text input field */
export const GLASS_INPUT =
  'backdrop-blur-md bg-white/6 ' +
  'border border-white/12 focus:border-white/28 ' +
  'text-white placeholder:text-white/30 ' +
  'rounded-xl px-4 py-3 ' +
  'outline-none focus:ring-1 focus:ring-white/20 ' +
  'transition-all duration-200 ease-out ' +
  'w-full';

/** Textarea */
export const GLASS_TEXTAREA =
  'backdrop-blur-md bg-white/6 ' +
  'border border-white/12 focus:border-white/28 ' +
  'text-white placeholder:text-white/30 ' +
  'rounded-xl px-4 py-3 ' +
  'outline-none focus:ring-1 focus:ring-white/20 ' +
  'transition-all duration-200 ease-out ' +
  'resize-none w-full';

/** Select / dropdown */
export const GLASS_SELECT =
  'backdrop-blur-md bg-white/6 ' +
  'border border-white/12 focus:border-white/28 ' +
  'text-white ' +
  'rounded-xl px-4 py-3 ' +
  'outline-none focus:ring-1 focus:ring-white/20 ' +
  'transition-all duration-200 ease-out ' +
  'cursor-pointer w-full appearance-none';

/** Form label */
export const GLASS_LABEL = 'text-white/60 text-sm font-medium mb-1.5 block';

/** Input error state */
export const GLASS_INPUT_ERROR =
  'backdrop-blur-md bg-red-500/8 ' +
  'border border-red-400/30 focus:border-red-400/50 ' +
  'text-white placeholder:text-white/30 ' +
  'rounded-xl px-4 py-3 ' +
  'outline-none focus:ring-1 focus:ring-red-400/20 ' +
  'transition-all duration-200 ease-out ' +
  'w-full';

/** Error message text */
export const GLASS_ERROR_TEXT = 'text-red-400 text-sm mt-1';

// ---------------------------------------------------------------------------
// NAVIGATION
// ---------------------------------------------------------------------------

/** Top navigation bar */
export const GLASS_NAVBAR =
  'backdrop-blur-xl bg-black/20 border-b border-white/8 ' +
  'sticky top-0 z-50';

/** Sidebar navigation container */
export const GLASS_SIDEBAR =
  'backdrop-blur-xl bg-black/25 border-r border-white/8 ' +
  'h-full';

/** Nav item — inactive */
export const GLASS_NAV_ITEM =
  'flex items-center gap-3 px-3 py-2.5 rounded-xl ' +
  'text-white/50 hover:text-white/90 hover:bg-white/8 ' +
  'transition-all duration-150 ease-out cursor-pointer';

/** Nav item — active/current page */
export const GLASS_NAV_ITEM_ACTIVE =
  'flex items-center gap-3 px-3 py-2.5 rounded-xl ' +
  'text-white bg-white/12 border border-white/15 ' +
  'shadow-glass-subtle font-medium';

// ---------------------------------------------------------------------------
// BADGES & STATUS INDICATORS
// ---------------------------------------------------------------------------

/** Status badge: Live / Published */
export const GLASS_BADGE_LIVE =
  'backdrop-blur-sm bg-emerald-500/15 border border-emerald-400/30 ' +
  'text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full';

/** Status badge: Draft */
export const GLASS_BADGE_DRAFT =
  'backdrop-blur-sm bg-white/8 border border-white/15 ' +
  'text-white/50 text-xs font-semibold px-2.5 py-1 rounded-full';

/** Status badge: Unpublished / Archived */
export const GLASS_BADGE_ARCHIVED =
  'backdrop-blur-sm bg-red-500/12 border border-red-400/20 ' +
  'text-red-400 text-xs font-semibold px-2.5 py-1 rounded-full';

/** Generic accent badge — sectors, tags */
export const GLASS_BADGE_ACCENT =
  'backdrop-blur-sm bg-violet-500/12 border border-violet-400/20 ' +
  'text-violet-300 text-xs font-medium px-2.5 py-1 rounded-full';

// ---------------------------------------------------------------------------
// NOTIFICATIONS & ALERTS
// ---------------------------------------------------------------------------

/** Success toast / alert */
export const GLASS_ALERT_SUCCESS =
  'backdrop-blur-xl bg-emerald-500/12 border border-emerald-400/25 ' +
  'text-emerald-200 rounded-xl px-4 py-3';

/** Error toast / alert */
export const GLASS_ALERT_ERROR =
  'backdrop-blur-xl bg-red-500/12 border border-red-400/25 ' +
  'text-red-200 rounded-xl px-4 py-3';

/** Warning toast / alert */
export const GLASS_ALERT_WARNING =
  'backdrop-blur-xl bg-amber-500/12 border border-amber-400/25 ' +
  'text-amber-200 rounded-xl px-4 py-3';

/** Info toast / alert */
export const GLASS_ALERT_INFO =
  'backdrop-blur-xl bg-blue-500/10 border border-blue-400/20 ' +
  'text-blue-200 rounded-xl px-4 py-3';

// ---------------------------------------------------------------------------
// DATA DISPLAY
// ---------------------------------------------------------------------------

/** Table container */
export const GLASS_TABLE =
  'backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden';

/** Table header row */
export const GLASS_TABLE_HEADER =
  'bg-white/6 border-b border-white/10 text-white/50 text-xs font-semibold uppercase tracking-wider';

/** Table row — default */
export const GLASS_TABLE_ROW =
  'border-b border-white/6 hover:bg-white/4 transition-colors duration-150';

/** Table cell */
export const GLASS_TABLE_CELL = 'px-4 py-3 text-white/80 text-sm';

/** Stat card — dashboard metrics */
export const GLASS_STAT_CARD =
  'backdrop-blur-xl bg-white/6 border border-white/10 rounded-2xl p-5 ' +
  'hover:bg-white/8 hover:border-white/15 transition-all duration-200';

/** Stat value text */
export const GLASS_STAT_VALUE = 'text-3xl font-bold text-white';

/** Stat label text */
export const GLASS_STAT_LABEL = 'text-white/45 text-sm font-medium mt-1';

// ---------------------------------------------------------------------------
// LAYOUT
// ---------------------------------------------------------------------------

/** Full-page background — use on body or root layout */
export const GLASS_PAGE_BG = 'min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950';

/** Content max-width container */
export const GLASS_CONTAINER = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

/** Section spacing */
export const GLASS_SECTION = 'py-16 md:py-24';

/** Hero section */
export const GLASS_HERO = 'py-24 md:py-36 text-center';

// ---------------------------------------------------------------------------
// TYPOGRAPHY
// ---------------------------------------------------------------------------

export const GLASS_HEADING_1 = 'text-4xl md:text-6xl font-bold text-white tracking-tight';
export const GLASS_HEADING_2 = 'text-3xl md:text-4xl font-bold text-white tracking-tight';
export const GLASS_HEADING_3 = 'text-xl md:text-2xl font-semibold text-white';
export const GLASS_BODY = 'text-white/65 leading-relaxed';
export const GLASS_BODY_SMALL = 'text-white/50 text-sm leading-relaxed';
export const GLASS_CAPTION = 'text-white/35 text-xs';
export const GLASS_PRICE = 'text-2xl font-bold text-white';

// ---------------------------------------------------------------------------
// AURORA / DAZZLING REDESIGN TOKENS (Sprint 9 — Visual Redesign)
// Added 2026-03-25
// ---------------------------------------------------------------------------

// --- Page Background ---
/** Aurora dark page background — replaces GLASS_PAGE_BG for dazzling look */
export const AURORA_PAGE_BG = 'min-h-screen bg-[#050810] relative overflow-x-hidden';

// --- Gradient Text ---
/** Gradient text — violet→cyan, for hero headings and logo */
export const GRADIENT_TEXT =
  'bg-gradient-to-r from-violet-400 via-cyan-400 to-cyan-300 bg-clip-text text-transparent';

/** Gradient text — violet→rose, for secondary accents */
export const GRADIENT_TEXT_ALT =
  'bg-gradient-to-r from-violet-400 via-rose-400 to-pink-300 bg-clip-text text-transparent';

// --- Glowing CTA Buttons ---
/** Glowing primary CTA — pulsing violet→cyan gradient with glow ring */
export const GLOW_BUTTON_PRIMARY =
  'relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white rounded-2xl ' +
  'bg-gradient-to-r from-violet-600 to-cyan-500 ' +
  'shadow-[0_0_24px_rgba(124,58,237,0.5),0_0_48px_rgba(6,182,212,0.25)] ' +
  'hover:shadow-[0_0_32px_rgba(124,58,237,0.7),0_0_64px_rgba(6,182,212,0.4)] ' +
  'hover:scale-105 active:scale-100 ' +
  'transition-all duration-300 ease-out ' +
  'cursor-pointer select-none pulse-glow';

/** Glowing secondary CTA */
export const GLOW_BUTTON_SECONDARY =
  'relative inline-flex items-center justify-center px-6 py-3 font-medium text-white rounded-xl ' +
  'bg-white/8 border border-white/20 backdrop-blur-md ' +
  'hover:bg-white/14 hover:border-violet-400/40 ' +
  'hover:shadow-[0_0_16px_rgba(124,58,237,0.3)] ' +
  'transition-all duration-200 ease-out ' +
  'cursor-pointer select-none';

// --- Aurora Backgrounds (used as inline style objects or CSS classes) ---
/** Aurora mesh background container — add aurora-bg class */
export const AURORA_HERO_BG = 'relative aurora-hero';

// --- Glassmorphism 2.0 ---
/** Deep frosted glass card — Glassmorphism 2.0 with inner glow */
export const GLASS2_CARD =
  'backdrop-blur-2xl bg-white/6 border border-white/12 rounded-2xl ' +
  'shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.10),inset_0_0_0_1px_rgba(255,255,255,0.04)]';

/** Elevated glass 2.0 — on hover */
export const GLASS2_CARD_ELEVATED =
  'backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl ' +
  'shadow-[0_8px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_0_0_1px_rgba(255,255,255,0.06)]';

/** Glass pill — for badges, nav pills */
export const GLASS2_PILL =
  'backdrop-blur-md bg-white/8 border border-white/15 rounded-full ' +
  'px-4 py-1.5 text-sm text-white/80';

/** Glass hero badge */
export const GLASS2_HERO_BADGE =
  'inline-flex items-center gap-2 backdrop-blur-md bg-white/8 border border-white/15 rounded-full ' +
  'px-4 py-2 text-sm text-white/70 font-medium';

// --- Navbar ---
/** Aurora sticky navbar — blur intensifies on scroll via JS class toggle */
export const AURORA_NAVBAR =
  'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ' +
  'border-b border-white/0';

/** Navbar scrolled state — applied via JS */
export const AURORA_NAVBAR_SCROLLED =
  'backdrop-blur-2xl bg-black/40 border-b border-white/8 ' +
  'shadow-[0_4px_24px_rgba(0,0,0,0.3)]';

// --- Sector Color Tokens ---
/** Sector glow shadow: AI (cyan) */
export const SECTOR_GLOW_AI = 'shadow-[0_0_24px_rgba(6,182,212,0.4)]';
/** Sector glow shadow: Finance (emerald) */
export const SECTOR_GLOW_FINANCE = 'shadow-[0_0_24px_rgba(16,185,129,0.4)]';
/** Sector glow shadow: Health (rose) */
export const SECTOR_GLOW_HEALTH = 'shadow-[0_0_24px_rgba(244,63,94,0.4)]';
/** Sector glow shadow: Marketing (violet) */
export const SECTOR_GLOW_MARKETING = 'shadow-[0_0_24px_rgba(124,58,237,0.4)]';
/** Sector glow shadow: Productivity (amber) */
export const SECTOR_GLOW_PRODUCTIVITY = 'shadow-[0_0_24px_rgba(245,158,11,0.4)]';

// --- Animated Border ---
/** Animated gradient border wrapper — apply to parent, use gradient-border class */
export const ANIMATED_BORDER_WRAP = 'gradient-border-wrap';

// --- Noise Overlay ---
/** Grain noise texture overlay */
export const NOISE_OVERLAY = 'noise-overlay';

// --- Typography Upgrades ---
/** Fluid hero heading — clamp-based, giant */
export const AURORA_HEADING_HERO =
  'font-bold tracking-tight leading-[1.05] text-white';

// --- Product Card — Dazzling Version ---
/** Product card with animated gradient border — outer wrapper */
export const DAZZLING_CARD_OUTER = 'dazzling-card-outer group block h-full';

/** Product card inner surface */
export const DAZZLING_CARD_INNER =
  'dazzling-card-inner h-full rounded-2xl p-6 flex flex-col gap-4 ' +
  'backdrop-blur-2xl bg-white/5 border border-white/10 ' +
  'transition-all duration-300 ease-out ' +
  'group-hover:bg-white/9 group-hover:border-white/18 ' +
  'group-hover:-translate-y-2 ' +
  'group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]';

// --- Sector Badge Tokens (sector-colored) ---
export const SECTOR_BADGE: Record<string, string> = {
  ai: 'bg-cyan-500/15 border-cyan-400/30 text-cyan-300',
  finance: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300',
  health: 'bg-rose-500/15 border-rose-400/30 text-rose-300',
  marketing: 'bg-violet-500/15 border-violet-400/30 text-violet-300',
  productivity: 'bg-amber-500/15 border-amber-400/30 text-amber-300',
  default: 'bg-violet-500/12 border-violet-400/20 text-violet-300',
};

export const SECTOR_PRICE_GLOW: Record<string, string> = {
  ai: 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]',
  finance: 'text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]',
  health: 'text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]',
  marketing: 'text-violet-300 drop-shadow-[0_0_8px_rgba(124,58,237,0.6)]',
  productivity: 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]',
  default: 'text-white',
};

// --- Bento Grid ---
/** Bento grid container */
export const BENTO_GRID = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr';

// --- Scroll Reveal ---
/** Applied to elements that should fade up on scroll (JS adds .is-visible) */
export const SCROLL_REVEAL = 'scroll-reveal';

// ---------------------------------------------------------------------------
// TAILWIND CONFIG EXTENSION
// Add these to tailwind.config.ts → theme.extend
// ---------------------------------------------------------------------------
//
// boxShadow: {
//   'glass':              '0 4px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
//   'glass-elevated':     '0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
//   'glass-subtle':       '0 2px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
//   'glass-deep':         '0 20px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
//   'glass-inset':        'inset 0 2px 8px rgba(0, 0, 0, 0.3)',
//   'glass-button':       '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
//   'glass-button-hover': '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
// },
//
// ---------------------------------------------------------------------------
