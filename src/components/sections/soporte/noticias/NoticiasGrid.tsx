"use client";

import { useState } from "react";

const noticias = [
  {
    id: 1,
    tipo: "Noticias de soporte",
    titulo: "Cómo One UI 6.0 muestra la capacidad de almacenamiento interno",
    descripcion: "Cómo One UI 6.0 muestra la capacidad de almacenamiento interno",
    categoria: "Teléfonos celulares",
    fecha: "2023-11-27",
    isAlert: false
  },
  {
    id: 2,
    tipo: "Alerta de soporte",
    titulo: "Procedimiento de Prueba de Duración de la Batería",
    descripcion: "Procedimiento de Prueba de Duración de la Batería",
    categoria: "Teléfonos celulares",
    fecha: "2023-01-17",
    isAlert: true
  },
  {
    id: 3,
    tipo: "Alerta de soporte",
    titulo: "Precauciones al cargar su Smartphone",
    descripcion: "Precauciones al cargar su Smartphone",
    categoria: "Teléfonos celulares",
    fecha: "2017-09-03",
    isAlert: true
  },
  {
    id: 4,
    tipo: "Noticias de soporte",
    titulo: "Galaxy S6: Aclaraciones sobre la batería y carga",
    descripcion: "Galaxy S6: Aclaraciones sobre la batería y carga",
    categoria: "Teléfonos celulares",
    fecha: "2015-03-20",
    isAlert: false
  },
  {
    id: 5,
    tipo: "Noticias de soporte",
    titulo: "Galaxy S6: Un nuevo nivel en calidad de sonido",
    descripcion: "Galaxy S6: Un nuevo nivel en calidad de sonido",
    categoria: "Teléfonos celulares",
    fecha: "2015-03-20",
    isAlert: false
  },
  {
    id: 6,
    tipo: "Noticias de soporte",
    titulo: "Galaxy S6 y S6 Edge: Estructura y construcción en metal",
    descripcion: "Galaxy S6 y S6 Edge: Estructura y construcción en metal",
    categoria: "Teléfonos celulares",
    fecha: "2015-03-20",
    isAlert: false
  },
  {
    id: 7,
    tipo: "Noticias de soporte",
    titulo: "Aclaraciones sobre el uso del reconocimiento de voz en su Smart TV Samsung",
    descripcion: "Aclaraciones sobre el uso del reconocimiento de voz en su Smart TV Samsung",
    categoria: "Televisión/audio y video",
    fecha: "2015-02-12",
    isAlert: false
  },
  {
    id: 8,
    tipo: "Alerta de soporte",
    titulo: "Nueva actualización de firmware para televisores LED 2014",
    descripcion: "Nueva actualización de firmware para televisores LED 2014",
    categoria: "Televisión/audio y video",
    fecha: "2015-02-04",
    isAlert: true
  }
];

const categorias = [
  "Teléfonos celulares",
  "Cámaras y Videocámaras", 
  "TV & AV",
  "Televisión/audio y video",
  "Informática",
  "Electrodomésticos para el Hogar"
];

export function NoticiasGrid() {
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos");

  const noticiasFiltradas = noticias.filter(noticia => {
    const cumpleTipo = filtroTipo === "todos" || 
      (filtroTipo === "noticias" && !noticia.isAlert) ||
      (filtroTipo === "alertas" && noticia.isAlert);
    
    const cumpleCategoria = filtroCategoria === "todos" || noticia.categoria === filtroCategoria;
    
    return cumpleTipo && cumpleCategoria;
  });

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-8">
          {/* Sidebar con filtros */}
          <div className="w-64 flex-shrink-0">
            <div className="flex items-center gap-4 mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="font-medium">Filtro</span>
              <span className="text-gray-600">{noticiasFiltradas.length}/8 resultados</span>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Tipo</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="tipo"
                      value="todos"
                      checked={filtroTipo === "todos"}
                      onChange={(e) => setFiltroTipo(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Todos</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="tipo"
                      value="noticias"
                      checked={filtroTipo === "noticias"}
                      onChange={(e) => setFiltroTipo(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Noticias de soporte</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="tipo"
                      value="alertas"
                      checked={filtroTipo === "alertas"}
                      onChange={(e) => setFiltroTipo(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Alerta de soporte</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">CATEGORÍA</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="categoria"
                      value="todos"
                      checked={filtroCategoria === "todos"}
                      onChange={(e) => setFiltroCategoria(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Todas las categorías</span>
                  </label>
                  {categorias.map((categoria) => (
                    <label key={categoria} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="categoria"
                        value={categoria}
                        checked={filtroCategoria === categoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{categoria}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            {/* Header con ordenamiento */}
            <div className="flex justify-end items-center mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">ORDENADO POR</span>
                <select className="border border-gray-300 rounded px-3 py-2 text-sm">
                  <option>Más reciente</option>
                  <option>Más antiguo</option>
                  <option>Alfabético</option>
                </select>
              </div>
            </div>

            {/* Grid de noticias */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticiasFiltradas.map((noticia) => (
            <div key={noticia.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="mb-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    noticia.isAlert 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {noticia.tipo}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg mb-3 line-clamp-2">
                  {noticia.titulo}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {noticia.descripcion}
                </p>
                
                <div className="text-xs text-gray-500 mb-4">
                  <div>{noticia.categoria}</div>
                  <div>{noticia.fecha}</div>
                </div>
                
                <button className="w-full bg-black text-white py-2 rounded font-medium text-sm hover:bg-gray-800 transition-colors">
                  VER DETALLES COMPLETOS
                </button>
              </div>
            </div>
          ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}