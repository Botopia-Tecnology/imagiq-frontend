// subscribeToChannel.ts
export interface InwebEvent {
  title?: string;
  message?: string;
  [key: string]: unknown;
}


export function subscribeToChannel(
  channelName: string,
  callback: (data: InwebEvent) => void
) {
  const url = `/api/realtime?channel=${encodeURIComponent(channelName)}`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event: MessageEvent) => {
    try {
      console.log("✅ SSE message received:", event.data);
      const data = JSON.parse(event.data) as InwebEvent;
      callback(data);
    } catch (err) {
      console.error("❌ Error parsing SSE data:", err);
    }
  };

  return eventSource;
}
