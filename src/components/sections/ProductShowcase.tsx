import Image from "next/image";
import zflipImg from "@/img/hero/zflip_hero.png";
import watchImg from "@/img/hero/watch_hero.png";
import BespokeAiEjemploImg from "@/img/hero/BespokeAiEjemplo.png";
import bespokeAiLogo from "@/img/hero/BespokeAi.png";

const products = [
  {
    title: "Galaxy Z Flip7",
    description: "Lleva el de 512 GB a precio de 256GB",
    bgImage: zflipImg,
    infoUrl: "#",
    buyUrl: "#",
    text: "text-[#1a2a3a]",
    titleClass: "absolute top-10 right-10 text-right text-3xl font-bold",
    descClass:
      "absolute top-20 right-10 text-right text-base font-medium w-[260px]",
    buttonGroupClass:
      "absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 justify-center w-full",
    infoButtonBg: "bg-white border-2 border-[#183a5a]",
    infoButtonText: "text-[#183a5a]",
    buttonBg: "bg-[#183a5a] border-2 border-[#183a5a]",
    buttonText: "text-white",
    contentClass: "flex flex-col justify-end items-center h-full relative",
    showTitle: true,
    showDesc: true,
    showButtons: true,
  },
  {
    bgImage: watchImg,
    infoUrl: "#",
    buyUrl: "#",
    text: "text-white",
    titleClass: "absolute top-10 right-10 text-right text-3xl font-bold",
    descClass:
      "absolute top-20 right-10 text-right text-base font-medium w-[260px]",
    buttonGroupClass:
      "absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 justify-center w-full",
    infoButtonBg: "bg-white border-2 border-white",
    infoButtonText: "text-[#1a2a3a]",
    buttonBg: "bg-[#183a5a]",
    buttonText: "text-white",
    contentClass: "flex flex-col justify-end items-center h-full relative",
    showTitle: false,
    showDesc: false,
    showButtons: true,
  },
];

export default function ProductShowcase() {
  return (
    <section className="w-full flex flex-col items-center bg-transparent py-10 md:mr-20 md:ml-5">
      <div
        className="flex flex-col md:flex-row gap-6 md:gap-8 w-full mx-auto px-2 md:px-0"
        style={{ maxWidth: "1800px" }}
      >
        {products.map((product) => (
          <div
            key={product.title || "watch"}
            className="relative w-full mx-auto aspect-[4/3] h-auto rounded-2xl shadow-lg p-3 mb-6 md:mb-0 md:aspect-auto md:h-[340px] md:min-h-[340px] md:rounded-3xl md:shadow-xl md:p-0 md:flex-1 flex flex-col justify-between md:mr-10"
          >
            <Image
              src={product.bgImage}
              alt={
                product.title ? product.title : "Galaxy Watch8 | Watch8 Classic"
              }
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl md:rounded-3xl z-0"
              priority
            />
            <div
              className={`relative z-10 ${product.contentClass} h-full`}
              style={{ minHeight: 0 }}
            >
              {/* Título y descripción en la esquina superior derecha */}
              {product.showTitle && (
                <h2
                  className={`${product.text} ${product.titleClass} hidden md:block`}
                >
                  {product.title}
                </h2>
              )}
              {product.showDesc && (
                <p
                  className={`${product.text} ${product.descClass} hidden md:block`}
                >
                  {product.description}
                </p>
              )}
              {/* Botones centrados en la parte inferior */}
              {product.showButtons && (
                <div className={product.buttonGroupClass}>
                  <a
                    href={product.infoUrl}
                    className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${product.infoButtonBg} ${product.infoButtonText} hover:scale-105`}
                    style={{
                      minWidth: 170,
                      textAlign: "center",
                      fontSize: "1.08rem",
                      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
                      borderRadius: "999px",
                      border:
                        product.bgImage === watchImg
                          ? "2px solid #fff"
                          : "2px solid #183a5a",
                      background:
                        product.bgImage === watchImg ? "#fff" : "#fff",
                      color:
                        product.bgImage === watchImg ? "#1a2a3a" : undefined,
                    }}
                  >
                    Más información
                  </a>
                  <a
                    href={product.buyUrl}
                    className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${product.buttonBg} ${product.buttonText} hover:scale-105`}
                    style={{
                      minWidth: 170,
                      textAlign: "center",
                      fontSize: "1.08rem",
                      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
                      borderRadius: "999px",
                      border:
                        product.bgImage === watchImg
                          ? "2px solid #fff"
                          : "2px solid #183a5a",
                      background:
                        product.bgImage === watchImg ? "#fff" : "#183a5a",
                      color:
                        product.bgImage === watchImg ? "#1a2a3a" : undefined,
                    }}
                  >
                    Compra
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Card grande debajo de las otras */}
      <div className="w-full flex flex-col md:flex-row justify-center items-center bg-transparent py-0 px-2 md:px-0">
        <div
          className="relative w-full rounded-2xl shadow-lg p-3 flex flex-col md:flex-row items-center min-h-[340px] md:min-h-[500px] mt-8 md:rounded-[32px] md:shadow-[0_4px_24px_0_rgba(0,0,0,0.08)] md:p-0"
          style={{
            display: "flex",
            alignItems: "center",
            background: "#C4C2C2",
            boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
          }}
        >
          {/* Imágenes alineadas */}
          <div className="flex flex-row items-end gap-0 flex-1 justify-center w-full md:w-auto">
            <div className="flex flex-row items-center justify-center w-full">
              <Image
                src={BespokeAiEjemploImg}
                alt="Bespoke AI Ejemplo"
                width={700}
                height={1200}
                className="object-contain"
                priority
              />
            </div>
          </div>
          {/* Texto y botones a la derecha */}
          <div className="flex flex-col items-center md:items-end justify-center h-full pr-0 md:pr-24 min-w-0 md:min-w-[370px] w-full md:w-auto">
            <div className="mb-8 w-full md:w-auto">
              <p className="hidden md:block text-center md:text-right text-[1.3rem] md:text-[2.3rem] font-bold text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
                Simplifica tu vida,
                <br />
                disfruta tu hogar
              </p>
            </div>
            <div className="mb-6 flex flex-col items-center md:items-end w-full md:w-auto">
              <Image
                src={bespokeAiLogo}
                alt="Bespoke AI Logo"
                width={120}
                height={40}
                className="mb-2 object-contain"
                priority
              />
            </div>
            <div className="flex flex-row md:flex-col gap-3 w-full max-w-[220px] mx-auto justify-center items-center md:items-end md:justify-end">
              <a
                href="#"
                className="px-7 py-2 w-full text-center text-[1.12rem] rounded-full font-semibold transition-all duration-200 bg-gradient-to-r from-[#e2e2e2] to-white text-[#183a5a] border-2 border-[#183a5a] shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] hover:scale-105"
              >
                Más información
              </a>
              <a
                href="#"
                className="px-7 py-2 w-full text-center text-[1.12rem] rounded-full font-semibold transition-all duration-200 bg-gradient-to-r from-[#183a5a] to-[#0a1a2a] text-white border-2 border-[#183a5a] shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] hover:scale-105"
              >
                Compra
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
