/**
 * ⚙️ ITEMS PER PAGE SELECTOR
 *
 * Selector para configurar cuántos productos mostrar por página
 */

interface ItemsPerPageSelectorProps {
  itemsPerPage: number;
  onItemsPerPageChange: (items: number) => void;
  className?: string;
}

const ITEMS_PER_PAGE_OPTIONS = [50, 75, 100];

export default function ItemsPerPageSelector({
  itemsPerPage,
  onItemsPerPageChange,
  className,
}: ItemsPerPageSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <label htmlFor="items-per-page" className="text-sm text-gray-700">
        Productos por página:
      </label>
      <select
        id="items-per-page"
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {ITEMS_PER_PAGE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
