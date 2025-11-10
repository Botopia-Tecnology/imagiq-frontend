import { useRef } from "react";
import { cn } from "@/lib/utils";

interface Review {
  author_id: string;
  firstName: string;
  initial: string;
  color: string;
  review_text: string;
  review_link: string;
}

interface MobileSliderProps {
  reviews: Review[];
}

export const MobileSlider = ({ reviews }: MobileSliderProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="md:hidden w-full overflow-x-hidden p-0 m-0">
      <div
        ref={scrollRef}
        className="flex flex-nowrap gap-20 w-[calc(70vw_*_16)] animate-reviews-infinito-mobile"
        style={{ animationDuration: `${reviews.length * 15}s` }}
        role="list"
        aria-label="Opiniones de clientes"
      >
        {[...reviews, ...reviews, ...reviews, ...reviews].map((review, idx) => (
          <a
            key={idx}
            href={review.review_link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "relative flex flex-col items-center transition-all duration-500 cursor-pointer hover:shadow-xl"
            )}
            style={{
              height: "340px",
              padding: "32px 16px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              opacity: 1,
              zIndex: 10,
              border: "1px solid #E5E7EB",
              transform: "scale(1)",
              transition: "box-shadow 0.3s, transform 0.3s, opacity 0.3s",
            }}
            aria-label={review.firstName}
          >
            {/* Avatar */}
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-3",
                review.color
              )}
              style={{
                fontFamily: "Samsung Sharp Sans, sans-serif",
                fontSize: "1.35rem",
              }}
            >
              {review.initial}
            </div>

            {/* Nombre */}
            <div
              className="font-bold text-gray-800 mb-2 text-center text-lg"
              style={{
                fontFamily: "Samsung Sharp Sans, sans-serif",
                fontSize: "1.15rem",
              }}
            >
              {review.firstName}
            </div>

            {/* Estrellas */}
            <div className="flex justify-center mb-3">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  width="24"
                  height="24"
                  fill="#FFD700"
                  stroke="#FFD700"
                  strokeWidth="1"
                  viewBox="0 0 24 24"
                  className="mx-0.5"
                >
                  <polygon points="12,2 15,8.5 22,9.3 17,14.1 18.5,21 12,17.7 5.5,21 7,14.1 2,9.3 9,8.5" />
                </svg>
              ))}
            </div>

            {/* Texto */}
            <div
              className="text-base text-gray-700 text-center leading-relaxed mt-2 overflow-hidden"
              style={{
                fontFamily: "Samsung Sharp Sans, sans-serif",
                fontSize: "1.08rem",
                marginTop: 8,
                lineHeight: 1.4,
                maxWidth: 260,
                height: "120px",
                display: "-webkit-box",
                WebkitLineClamp: 5,
                WebkitBoxOrient: "vertical",
                textOverflow: "ellipsis",
              }}
            >
              {review.review_text}
            </div>
          </a>
        ))}
      </div>

      {/* Animación */}
      <style jsx>{`
        @keyframes reviews-infinito-mobile {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-reviews-infinito-mobile {
          animation: reviews-infinito-mobile linear infinite;
          width: max-content;
        }
      `}</style>
    </div>
  );
};
