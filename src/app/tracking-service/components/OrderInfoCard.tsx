interface OrderInfoItem {
  label: string;
  value: string;
  highlight?: boolean;
}

interface OrderInfoCardProps {
  title: string;
  items: OrderInfoItem[];
}

export function OrderInfoCard({ title, items }: Readonly<OrderInfoCardProps>) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 w-full max-w-md mb-6">
      <h2 className="text-lg font-semibold text-black mb-4">{title}</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between">
            <span className="text-gray-600">{item.label}</span>
            <span
              className={`font-semibold ${
                item.highlight ? "bg-gray-200 px-2 py-1 rounded" : "text-black"
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
