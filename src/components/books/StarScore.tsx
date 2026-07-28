interface StarScoreProps {
  score: number;
  size?: "xs" | "sm" | "lg";
  tone?: "light" | "dark";
}

const MAX_SCORE = 5;

// The design sets stars at 13px on a search card, 14px in the table, and 17px
// in the drawer.
const SIZE_CLASSES: Record<NonNullable<StarScoreProps["size"]>, string> = {
  xs: "text-[13px]",
  sm: "text-sm",
  lg: "text-[17px]",
};

// Only the unearned star changes with the surface — the design keeps the amber
// of a filled star the same on both. Its dark value is a literal rather than a
// theme token because nothing outside this component refers to it.
const EMPTY_CLASSES: Record<NonNullable<StarScoreProps["tone"]>, string> = {
  light: "text-stone-300",
  dark: "text-[oklch(0.4_0.01_260)]",
};

export default function StarScore({
  score,
  size = "sm",
  tone = "light",
}: StarScoreProps) {
  return (
    <span
      className={`inline-flex gap-0.5 ${SIZE_CLASSES[size]}`}
      role="img"
      aria-label={`Score: ${score} out of ${MAX_SCORE}`}
    >
      {Array.from({ length: MAX_SCORE }, (_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={index < score ? "text-amber-500" : EMPTY_CLASSES[tone]}
        >
          ★
        </span>
      ))}
    </span>
  );
}
