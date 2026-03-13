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
