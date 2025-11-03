export function SupportTopBar() {
  return (
    <div className="w-full bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold">Soporte</h3>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <a href="#" className="text-gray-700 hover:underline">
            Encuentre información adicional
          </a>
          <a href="#" className="text-gray-700 hover:underline">
            Contacto Info
          </a>
        </div>
      </div>
    </div>
  );
}
