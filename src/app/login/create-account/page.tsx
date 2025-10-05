import CreateAccountForm from "./CreateAccount";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6eef5] via-white to-[#b3c7db] pt-6 pb-4 sm:pt-8 sm:pb-6 lg:pt-10 lg:pb-10 px-3 sm:px-4 relative overflow-hidden">
      {/* Elementos decorativos flotantes - reducidos en móvil */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-48 h-48 sm:w-72 sm:h-72 bg-[#002142]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-8 w-64 h-64 sm:w-96 sm:h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-8 left-1/3 w-56 h-56 sm:w-80 sm:h-80 bg-indigo-400/8 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-start">
        {/* Contenedor principal flotante */}
        <div className="w-full max-w-2xl mx-auto">
          {/* Card principal con efecto glassmorphism - padding reducido en móvil */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl shadow-[#002142]/10 p-4 sm:p-6 lg:p-8">
            <CreateAccountForm />
          </div>
        </div>
      </div>
    </div>
  );
}
