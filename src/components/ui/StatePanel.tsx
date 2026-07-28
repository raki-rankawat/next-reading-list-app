import type { ReactNode } from "react";

import Spinner from "@/components/ui/Spinner";

type PanelTone = "light" | "dark";
type PanelVariant = "card" | "dashed" | "error";

interface PanelStyle {
  surface: string;
  title: string;
  message: string;
}

// The design has no state panels at all — it renders a fixed result set and a
// full table and nothing else — so the shape here is the one feature 02 arrived
// at for the home page: a centred panel at the table's own radius, dashed where
// there is nothing to show yet and filled where something went wrong. The dark
// column is that same geometry in the search view's palette.
//
// Written out per tone and variant rather than composed, since Tailwind only
// matches class names it can read as whole strings.
const STYLES: Record<PanelTone, Record<PanelVariant, PanelStyle>> = {
  light: {
    card: {
      surface: "border-stone-200 bg-white shadow-sm",
      title: "text-stone-900",
      message: "text-stone-500",
    },
    dashed: {
      surface: "border-dashed border-stone-300",
      title: "text-stone-900",
      message: "text-stone-500",
    },
    error: {
      surface: "border-red-200 bg-red-50",
      title: "text-red-900",
      message: "text-red-700",
    },
  },
  dark: {
    card: {
      surface: "border-dark-border bg-dark-card",
      title: "text-dark-ink",
      message: "text-dark-muted",
    },
    dashed: {
      surface: "border-dark-border border-dashed",
      title: "text-dark-ink",
      message: "text-dark-muted",
    },
    error: {
      surface: "border-red-900 bg-red-950/40",
      title: "text-red-100",
      message: "text-red-300",
    },
  },
};

interface StatePanelProps {
  tone: PanelTone;
  variant: PanelVariant;
  title?: string;
  message: string;
  /** Heads the panel with the shared spinner — the two waiting states. */
  busy?: boolean;
  /** An action offered alongside the message — the empty list's Add Book. */
  children?: ReactNode;
}

// The single shell every "there is nothing to render" state on both screens
// goes through: the table's loading/empty/error and the search view's
// idle/loading/no-results/error. Before this each screen carried its own set,
// which is how the two drifted apart on padding and on whether a failure
// announced itself.
export default function StatePanel({
  tone,
  variant,
  title,
  message,
  busy = false,
  children,
}: StatePanelProps) {
  const style = STYLES[tone][variant];

  return (
    <div
      // A failure is the one state the user did not ask to see, so it is the one
      // that announces itself. Applied here rather than per screen, which is
      // where the home page's error came to be the only silent one.
      role={variant === "error" ? "alert" : undefined}
      // Error panels carry a title and one line, so they sit shorter than the
      // states that stand in for a whole table.
      className={`rounded-xl border px-6 text-center ${
        variant === "error" ? "py-16" : "py-24"
      } ${style.surface}`}
    >
      {/* Inside the message's own colour, which is where the spinner picks up
          the tone it draws itself in. */}
      {busy && (
        <p className={`mb-3 ${style.message}`}>
          <Spinner size="md" />
        </p>
      )}
      {title && (
        <p className={`mb-2 text-base font-semibold ${style.title}`}>{title}</p>
      )}
      <p className={`text-sm ${style.message} ${children ? "mb-5" : ""}`}>
        {message}
      </p>
      {children}
    </div>
  );
}
