interface StarScoreProps {
  score: number;
  size?: "sm" | "lg";
}

const MAX_SCORE = 5;

// The design sets stars at 14px in the table and 17px in the drawer.
const SIZE_CLASSES: Record<NonNullable<StarScoreProps["size"]>, string> = {
  sm: "text-sm",
  lg: "text-[17px]",
};

export default function StarScore({ score, size = "sm" }: StarScoreProps) {
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
          className={index < score ? "text-amber-500" : "text-stone-300"}
        >
          ★
        </span>
      ))}
    </span>
  );
}
