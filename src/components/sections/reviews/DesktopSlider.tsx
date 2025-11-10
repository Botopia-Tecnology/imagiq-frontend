import { NavigationButton } from "./NavigationButton";
import { ReviewCard } from "./ReviewCard";

interface Review {
  author_id: string;
  firstName: string;
  initial: string;
  color: string;
  review_text: string;
  review_link: string;
}

interface DesktopSliderProps {
  visibleCards: Review[];
  onPrev: () => void;
  onNext: () => void;
}

export const DesktopSlider = ({
  visibleCards,
  onPrev,
  onNext,
}: DesktopSliderProps) => {
  return (
    <div className="md:flex items-center justify-center min-h-[370px] w-full hidden gap-4">
      <NavigationButton direction="prev" onClick={onPrev} />

      <div className="flex gap-4 md:gap-6 lg:gap-8 justify-center items-center flex-1 max-w-5xl">
        {visibleCards.map((review, index) => {
          const isActive = index === 1; // Card del medio (activa)
          const isLeft = index === 0;
          const isRight = index === 2;

          let opacity = 1;
          let scale = 1;
          let zIndex = 5;
          let rotateY = 0;
          let translateX = 0;
          let shadow = "0 2px 8px rgba(0,0,0,0.04)";

          if (isActive) {
            scale = 1.08;
            zIndex = 10;
            shadow = "0 8px 32px rgba(0,0,0,0.1)";
          } else if (isLeft) {
            scale = 0.95;
            rotateY = 18; // Girar un poco hacia adentro
            translateX = -40; // Mover ligeramente a la izquierda
            opacity = 0.7;
          } else if (isRight) {
            scale = 0.95;
            rotateY = -18; // Girar hacia adentro desde el otro lado
            translateX = 40; // Mover a la derecha
            opacity = 0.7;
          }
          return (
            <ReviewCard
              key={`${review.author_id}-${index}`}
              review={review}
              isActive={isActive}
              opacity={opacity}
              scale={scale}
              rotateY={rotateY}
              translateX={translateX}
              index={index}
              zIndex={zIndex}
              shadow={shadow}
            />
          );
        })}
      </div>

      <NavigationButton direction="next" onClick={onNext} />
    </div>
  );
};
