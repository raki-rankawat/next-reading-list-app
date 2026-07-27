interface StarScoreProps {
  score: number;
}

const MAX_SCORE = 5;

export default function StarScore({ score }: StarScoreProps) {
  return (
    <span
      className="inline-flex gap-0.5 text-sm"
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
