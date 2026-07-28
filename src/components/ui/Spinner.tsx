interface SpinnerProps {
  /** `sm` sits inside a button next to its label; `md` heads a state panel. */
  size?: "sm" | "md";
}

const SIZE_CLASSES: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
};

// The design specifies no loading indicator anywhere, so this is the app's own:
// a ring with one quadrant cut away, turning. It takes its colour from
// `currentColor`, which is what lets the same component sit on the light table,
// on the dark search grid, and inside a filled button without a tone prop —
// each parent already sets the text colour the spinner should match.
//
// Always decorative: every place it is used pairs it with visible text that
// says what is happening, so announcing it too would only repeat that.
export default function Spinner({ size = "sm" }: SpinnerProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none ${SIZE_CLASSES[size]}`}
    />
  );
}
