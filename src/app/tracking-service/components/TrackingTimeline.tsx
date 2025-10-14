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
                  isLast ? "bg-blue-600" : "bg-yellow-400"
                } border-2 border-white shadow`}
                style={{ zIndex: 1 }}
              />
              <div
                className={`ml-7 flex-1 ${
                  isLast
                    ? "bg-blue-50 border-blue-600 border-l-4 pl-4 py-3 rounded-xl"
                    : ""
                }`}
              >
                <div
                  className={`font-bold ${
                    isLast
                      ? "text-blue-700 text-lg"
                      : "text-yellow-700 text-base"
                  }`}
                >
                  {step.evento}
                </div>
                <div
                  className={`text-sm ${
                    isLast ? "text-blue-500 font-semibold" : "text-gray-600"
                  } mt-1`}
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
