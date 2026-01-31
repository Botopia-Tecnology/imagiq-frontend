import { EnvioEvento } from "../interfaces/types.d";

interface TrackingTimelineProps {
  events: EnvioEvento[];
}

export function TrackingTimeline({ events }: Readonly<TrackingTimelineProps>) {
  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div
        className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-300"
        style={{ zIndex: 0 }}
      />
      <div className="space-y-5">
        {events.map((step, idx) => {
          const isLast = idx === events.length - 1;
          return (
            <div
              key={step.time_stamp + idx}
              className="relative flex items-start"
            >
              {/* Timeline dot */}
              <span
                className={`absolute left-0 top-2 w-3 h-3 rounded-full ${
                  isLast ? "bg-black" : "bg-black"
                } border-2 border-white shadow`}
                style={{ zIndex: 1 }}
              />
              <div
                className={`ml-7 flex-1 ${
                  isLast
                    ? "bg-gray-50 border-black border-l-4 pl-4 py-3 rounded-xl"
                    : ""
                }`}
              >
                <div
                  className={`font-bold ${
                    isLast
                      ? "text-black text-lg"
                      : "text-black text-base"
                  }`}
                >
                  {step.evento}
                </div>
                <div
                  className={`text-sm mt-1 ${
                    isLast ? "!text-black font-bold" : "text-gray-600"
                  }`}
                >
                  {new Date(step.time_stamp).toLocaleString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
