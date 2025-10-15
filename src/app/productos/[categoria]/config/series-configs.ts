/**
 * 🎯 SERIES FILTER CONFIGURATIONS
 *
 * Configuración centralizada para todos los filtros de series.
 * Para agregar una nueva serie/categoría, simplemente agrega un objeto al array correspondiente.
 *
 * Cada configuración incluye:
 * - id: Identificador único
 * - name: Nombre a mostrar
 * - image: URL o ruta de la imagen
 * - href: URL de navegación (opcional, se genera automáticamente)
 */

export interface SeriesItem {
  readonly id: string;
  readonly name: string;
  readonly image?: string;
}

export interface SeriesFilterConfig {
  readonly title: string;
  readonly breadcrumbCategory: string;
  readonly breadcrumbSection: string;
  readonly series: readonly SeriesItem[];
  readonly navigationLinks: readonly NavigationLink[];
}

export interface NavigationLink {
  readonly label: string;
  readonly href: string;
  readonly sectionId: string;
}

/**
 * 📱 DISPOSITIVOS MÓVILES - SMARTPHONES
 */
export const smartphonesSeriesConfig: SeriesFilterConfig = {
  title: "Todos los teléfonos inteligentes Galaxy",
  breadcrumbCategory: "Dispositivos móviles",
  breadcrumbSection: "Galaxy Smartphone",
  series: [
    {
      id: "Galaxy Z",
      name: "Galaxy Z",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759813917/samsung-galaxy-z-fli_zcqepc.webp",
    },
    {
      id: "Galaxy S",
      name: "Galaxy S",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759818174/galaxy-s25-ultra-plata-titanio-04_paosjl.webp",
    },
    {
      id: "Galaxy A",
      name: "Galaxy A",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759818165/samsung-galaxy-a16-gray-img-2_ktfuit.webp",
    },
    {
      id: "Galaxy Note",
      name: "Galaxy Note",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759817588/Samsung-71282880-co-galaxy-note20-ultra-n985-sm-n985fznucoo-devicebackmysticbronze-274165961-zoom_iktjqi.webp",
    },
    {
      id: "Accesorios para Smartphones",
      name: "Accesorios para Smartphones",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759852921/image-removebg-preview-_14__bnq1pr.webp",
    },
  ],
  navigationLinks: [
    { label: "Galaxy Smartphone", href: "/productos/dispositivos-moviles?seccion=smartphones", sectionId: "smartphones" },
    { label: "Galaxy Tab", href: "/productos/dispositivos-moviles?seccion=tabletas", sectionId: "tabletas" },
    { label: "Galaxy Watch", href: "/productos/dispositivos-moviles?seccion=relojes", sectionId: "relojes" },
    { label: "Galaxy Buds", href: "/productos/dispositivos-moviles?seccion=buds", sectionId: "buds" },
    { label: "Galaxy Accesorios", href: "/productos/dispositivos-moviles?seccion=accesorios", sectionId: "accesorios" },
  ],
} as const;

/**
 * 📱 DISPOSITIVOS MÓVILES - TABLETAS
 */
export const tabletasSeriesConfig: SeriesFilterConfig = {
  title: "Todas las Galaxy Tabs",
  breadcrumbCategory: "Dispositivos móviles",
  breadcrumbSection: "Galaxy Tab",
  series: [
    {
      id: "Galaxy Tab S",
      name: "Galaxy Tab S",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759845245/ChatGPT_Image_7_oct_2025__08_51_49_a.m.-removebg-preview_c5fuar.webp",
    },
    {
      id: "Galaxy Tab A",
      name: "Galaxy Tab A",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759844983/ChatGPT_Image_7_oct_2025__08_47_46_a.m.-removebg-preview_dkig8j.webp",
    },
    {
      id: "Accesorios para la Galaxy Tab",
      name: "Accesorios para la Galaxy Tab",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759853052/Visual_LNB_Tablet-Accessories_mo_nbgkjc.webp",
    },
    {
      id: "Todas las Galaxy Tab",
      name: "Todas las Galaxy Tab",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759853116/Visual-LNB_All-Tablets_mo_difeol.avif",
    },
  ],
  navigationLinks: [
    { label: "Galaxy Smartphone", href: "/productos/dispositivos-moviles?seccion=smartphones", sectionId: "smartphones" },
    { label: "Galaxy Tab", href: "/productos/dispositivos-moviles?seccion=tabletas", sectionId: "tabletas" },
    { label: "Galaxy Watch", href: "/productos/dispositivos-moviles?seccion=relojes", sectionId: "relojes" },
    { label: "Galaxy Buds", href: "/productos/dispositivos-moviles?seccion=buds", sectionId: "buds" },
    { label: "Galaxy Accesorios", href: "/productos/dispositivos-moviles?seccion=accesorios", sectionId: "accesorios" },
  ],
} as const;

/**
 * ⌚ DISPOSITIVOS MÓVILES - RELOJES
 */
export const relojesSeriesConfig: SeriesFilterConfig = {
  title: "Todos los Galaxy Watches",
  breadcrumbCategory: "Dispositivos móviles",
  breadcrumbSection: "Galaxy Watch",
  series: [
    {
      id: "Galaxy Watch Ultra",
      name: "Galaxy Watch Ultra",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759853177/LNB_Galaxy-Watch-Ultra_144x144_soxbgz.avif",
    },
    {
      id: "Galaxy Watch",
      name: "Galaxy Watch",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759853218/LNB_Galaxy-Watch_144x144_oz6t5j.avif",
    },
    {
      id: "Galaxy Watch7",
      name: "Galaxy Watch7",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759853253/144x144_tqyqvj.avif",
    },
    {
      id: "Accesorios para los Galaxy Watch",
      name: "Accesorios para los Galaxy Watch",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759853334/LNB_Galaxy-Watch-Accessories_144x144_d0x8vg.avif",
    },
     {
      id: "Todos los Galaxy Watches",
      name: "Todos los Galaxy Watches",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759853403/LNB_All-Galaxy-Watches_144x144_zhzjlh.avif",
    },
  ],
  navigationLinks: [
    { label: "Galaxy Smartphone", href: "/productos/dispositivos-moviles?seccion=smartphones", sectionId: "smartphones" },
    { label: "Galaxy Tab", href: "/productos/dispositivos-moviles?seccion=tabletas", sectionId: "tabletas" },
    { label: "Galaxy Watch", href: "/productos/dispositivos-moviles?seccion=relojes", sectionId: "relojes" },
    { label: "Galaxy Buds", href: "/productos/dispositivos-moviles?seccion=buds", sectionId: "buds" },
    { label: "Galaxy Accesorios", href: "/productos/dispositivos-moviles?seccion=accesorios", sectionId: "accesorios" },
  ],
} as const;
/**
 * 🧊 ELECTRODOMÉSTICOS - REFRIGERADORES
 */
export const refrigeradoresSeriesConfig: SeriesFilterConfig = {
  title: "Todos los refrigeradores",
  breadcrumbCategory: "Electrodomésticos",
  breadcrumbSection: "Refrigeradores",
  series: [
    {
      id: "French Door",
      name: "French Door",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759854815/01_OB_PRODUCTO_LNB_HA_RF30BB660012CO_144x144_cardmo.webp",
    },
    {
      id: "Side by Side",
      name: "Side by Side",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759854842/02_OB_PRODUCTO_LNB_HA_RS23T5B00S9CO_144x144_yye2lu.webp",
    },
    
    {
      id: "Congelador inferior",
      name: "Congelador inferior",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759854839/03_OB_PRODUCTO_LNB_HA_RB50DG6320S9CO_144x144_a8kjyh.webp",
    },
    {
      id: "Congelador superior",
      name: "Congelador superior",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759854819/04_OB_PRODUCTO_LNB_HA_RT38DG6220S9CO_144x144_qoudqj.webp",
    },
    {
      id: "Accesorios para Neveras",
      name: "Accesorios para Neveras",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759854814/REF_Accessories_removed_a3czsi.avif",
    },
  ],
  navigationLinks: [
    { label: "Refrigeradores", href: "/productos/electrodomesticos?seccion=refrigeradores", sectionId: "refrigeradores" },
    { label: "Lavadoras", href: "/productos/electrodomesticos?seccion=lavadoras", sectionId: "lavadoras" },
    { label: "Lavavajillas", href: "/productos/electrodomesticos?seccion=lavavajillas", sectionId: "lavavajillas" },
    { label: "Microondas", href: "/productos/electrodomesticos?seccion=microondas", sectionId: "microondas" },
    { label: "Aspiradoras", href: "/productos/electrodomesticos?seccion=aspiradoras", sectionId: "aspiradoras" },
    { label: "Aire Acondicionado", href: "/productos/electrodomesticos?seccion=aire-acondicionado", sectionId: "aire-acondicionado" },
    { label: "Hornos", href: "/productos/electrodomesticos?seccion=hornos", sectionId: "hornos" },
  ],
} as const;

/**
 * 🧺 ELECTRODOMÉSTICOS - LAVADORAS
 */
export const lavadorasSeriesConfig: SeriesFilterConfig = {
  title: "Todas las lavadoras y secadoras",
  breadcrumbCategory: "Electrodomésticos",
  breadcrumbSection: "Lavadoras",
  series: [
    {
      id: "Lavadoras",
      name: "Lavadoras",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759857499/07_OB_PRODUCTO_LNB_HA_DVG22C6370PCO_144x144_tvu4sz.webp",
    },
    {
      id: "Combo",
      name: "Combo",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759857490/06_OB_PRODUCTO_LNB_HA_WD26DB8995BZCO_144x144_gm46no.webp",
    },
    {
      id: "Secadoras",
      name: "Secadoras",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759857499/07_OB_PRODUCTO_LNB_HA_DVG22C6370PCO_144x144_tvu4sz.webp",
    },
    {
      id: "Carga Superior",
      name: "Carga Superior",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759857498/08_OB_PRODUCTO_LNB_HA_WA80F15S5BCO_144x144_jxuw4c.webp",
    },
    {
      id: "Accesorios de Lavandería",
      name: "Accesorios de Lavandería",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759857495/Laundry_Accessories_removed_iyv7la.avif",
    },
  ],
  navigationLinks: [
    { label: "Refrigeradores", href: "/productos/electrodomesticos?seccion=refrigeradores", sectionId: "refrigeradores" },
    { label: "Lavadoras", href: "/productos/electrodomesticos?seccion=lavadoras", sectionId: "lavadoras" },
    { label: "Lavavajillas", href: "/productos/electrodomesticos?seccion=lavavajillas", sectionId: "lavavajillas" },
    { label: "Microondas", href: "/productos/electrodomesticos?seccion=microondas", sectionId: "microondas" },
    { label: "Aspiradoras", href: "/productos/electrodomesticos?seccion=aspiradoras", sectionId: "aspiradoras" },
    { label: "Aire Acondicionado", href: "/productos/electrodomesticos?seccion=aire-acondicionado", sectionId: "aire-acondicionado" },
    { label: "Hornos", href: "/productos/electrodomesticos?seccion=hornos", sectionId: "hornos" },
  ],
} as const;

/**
 * 🍽️ ELECTRODOMÉSTICOS - LAVAVAJILLAS
 */
export const lavavajillasSeriesConfig: SeriesFilterConfig = {
  title: "Todos los lavavajillas",
  breadcrumbCategory: "Electrodomésticos",
  breadcrumbSection: "Lavavajillas",
  series: [
    {
      id: "Lavavajillas",
      name: "Lavavajillas",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759855217/13_OB_PRODUCTO_LNB_HA_DW80CG5451SRAA_144x144_dowejx.webp",
    },
    {
      id: "Integrado",
      name: "Integrado",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759855214/14_OB_PRODUCTO_LNB_HA_DW80CG5451MTAA_144x144_l8emtd.webp",
    },
  ],
  navigationLinks: [
    { label: "Refrigeradores", href: "/productos/electrodomesticos?seccion=refrigeradores", sectionId: "refrigeradores" },
    { label: "Lavadoras", href: "/productos/electrodomesticos?seccion=lavadoras", sectionId: "lavadoras" },
    { label: "Lavavajillas", href: "/productos/electrodomesticos?seccion=lavavajillas", sectionId: "lavavajillas" },
    { label: "Microondas", href: "/productos/electrodomesticos?seccion=microondas", sectionId: "microondas" },
    { label: "Aspiradoras", href: "/productos/electrodomesticos?seccion=aspiradoras", sectionId: "aspiradoras" },
    { label: "Aire Acondicionado", href: "/productos/electrodomesticos?seccion=aire-acondicionado", sectionId: "aire-acondicionado" },
    { label: "Hornos", href: "/productos/electrodomesticos?seccion=hornos", sectionId: "hornos" },
  ],
} as const;

/**
 * 🧹 ELECTRODOMÉSTICOS - ASPIRADORAS
 */
export const aspiradorasSeriesConfig: SeriesFilterConfig = {
  title: "Todas las Aspiradoras",
  breadcrumbCategory: "Electrodomésticos",
  breadcrumbSection: "Aspiradoras",
  series: [
    {
      id: "Aspiradoras Robot",
      name: "Aspiradoras Robot",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759855403/09_OB_PRODUCTO_LNB_HA_VR05R5050WKAP_144x144_kxew65.avif",
    },
  ],
  navigationLinks: [
    { label: "Refrigeradores", href: "/productos/electrodomesticos?seccion=refrigeradores", sectionId: "refrigeradores" },
    { label: "Lavadoras", href: "/productos/electrodomesticos?seccion=lavadoras", sectionId: "lavadoras" },
    { label: "Lavavajillas", href: "/productos/electrodomesticos?seccion=lavavajillas", sectionId: "lavavajillas" },
    { label: "Microondas", href: "/productos/electrodomesticos?seccion=microondas", sectionId: "microondas" },
    { label: "Aspiradoras", href: "/productos/electrodomesticos?seccion=aspiradoras", sectionId: "aspiradoras" },
    { label: "Aire Acondicionado", href: "/productos/electrodomesticos?seccion=aire-acondicionado", sectionId: "aire-acondicionado" },
    { label: "Hornos", href: "/productos/electrodomesticos?seccion=hornos", sectionId: "hornos" },
  ],
} as const;

/**
 * 🎧 DISPOSITIVOS MÓVILES - BUDS
 */
export const budsSeriesConfig: SeriesFilterConfig = {
  title: "Todos los Galaxy Buds",
  breadcrumbCategory: "Dispositivos móviles",
  breadcrumbSection: "Galaxy Buds",
  series: [
    {
      id: "Galaxy Buds3 pro",
      name: "Galaxy Buds3 pro",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759853469/LNB_Buds3_Pro_144x144_vstnft.webp",
    },
    {
      id: "Galaxy Buds3",
      name: "Galaxy Buds3",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759853500/LNB_Buds3_144x144_kg00ya.webp",
    },
    {
      id: "Galaxy Buds FE",
      name: "Galaxy Buds FE",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759853543/LNB_Galaxy-Buds-FE_144x144_hfemkc.avif",
    },
    {
      id: "Todos los Galaxy Buds",
      name: "Todos los Galaxy Buds",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759853600/LNB_All-galaxy-Buds_144x144_nsguet.avif",
    },
  ],
  navigationLinks: [
    { label: "Galaxy Smartphone", href: "/productos/dispositivos-moviles?seccion=smartphones", sectionId: "smartphones" },
    { label: "Galaxy Tab", href: "/productos/dispositivos-moviles?seccion=tabletas", sectionId: "tabletas" },
    { label: "Galaxy Watch", href: "/productos/dispositivos-moviles?seccion=relojes", sectionId: "relojes" },
    { label: "Galaxy Buds", href: "/productos/dispositivos-moviles?seccion=buds", sectionId: "buds" },
    { label: "Galaxy Accesorios", href: "/productos/dispositivos-moviles?seccion=accesorios", sectionId: "accesorios" },
  ],
} as const;

/**
 * 🛍️ DISPOSITIVOS MÓVILES - ACCESORIOS
 */
export const accesoriosSeriesConfig: SeriesFilterConfig = {
  title: "Todos los accesorios",
  breadcrumbCategory: "Dispositivos móviles",
  breadcrumbSection: "Galaxy Accesorios",
  series: [
    {
      id: "Accesorios para Smartphones Galaxy",
      name: "Accesorios para Smartphones Galaxy",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759853721/Visual_LNB_Smartphone-Accessories_144x144_wnhqbb.avif",
    },
    {
      id: "Accesorios para la Galaxy Tab",
      name: "Accesorios para la Galaxy Tab",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759853052/Visual_LNB_Tablet-Accessories_mo_nbgkjc.webp",
    },
    {
      id: "Accesorios para los Galaxy Watch",
      name: "Accesorios para los Galaxy Watch",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759853334/LNB_Galaxy-Watch-Accessories_144x144_d0x8vg.avif",
    },
    {
      id: "SmartTag",
      name: "SmartTag",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759853867/LNB_SmartTag_144x144_2_xl4fp0.webp",
    },
    {
      id: "Cargadores",
      name: "Cargadores",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759853862/LNB_Chargers_144x144_ltfrsv.webp",
    },
    {
      id: "Todos los accesorios",
      name: "Todos los accesorios",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759853901/S25U_All-Accessories_Visual_LNB_144x144_y6tevc.avif",
    },
  ],
  navigationLinks: [
    { label: "Galaxy Smartphone", href: "/productos/dispositivos-moviles?seccion=smartphones", sectionId: "smartphones" },
    { label: "Galaxy Tab", href: "/productos/dispositivos-moviles?seccion=tabletas", sectionId: "tabletas" },
    { label: "Galaxy Watch", href: "/productos/dispositivos-moviles?seccion=relojes", sectionId: "relojes" },
    { label: "Galaxy Buds", href: "/productos/dispositivos-moviles?seccion=buds", sectionId: "buds" },
    { label: "Galaxy Accesorios", href: "/productos/dispositivos-moviles?seccion=accesorios", sectionId: "accesorios" },
  ],
} as const;

/**
 * � TELEVISORES - SMART TV
 */
export const smartTvSeriesConfig: SeriesFilterConfig = {
  title: "Todos los Smart TV",
  breadcrumbCategory: "Televisores",
  breadcrumbSection: "Smart TV",
  series: [
    {
      id: "Neo QLED 8k",
      name: "Neo QLED 8k",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759854041/2025-tvs-pcd-f01-visual-lnb-02_dx2bpi.webp",
    },
    {
      id: "OLED",
      name: "OLED",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759854146/2025-tvs-pcd-f01-visual-lnb-03_hh6o67.avif",
    },
    {
      id: "The Frame",
      name: "The Frame",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759854151/2025-tvs-pcd-f01-visual-lnb-08_gwxtd7.png",
    },
    {
      id: "Neo QLED",
      name: "Neo QLED",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759854148/2025-tvs-pcd-f01-visual-lnb-04_vzkep9.avif",
    },
    {
      id: "QLED",
      name: "QLED",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759854144/2025-tvs-pcd-f01-visual-lnb-05_c9x2tv.avif",
    },
    {
      id: "Crystal UHD",
      name: "Crystal UHD",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759854142/2025-tvs-pcd-f01-visual-lnb-06_myl7y7.avif",
    },
    {
      id: "Full HD",
      name: "Full HD",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759854142/2025-tvs-pcd-f01-visual-lnb-06_myl7y7.avif",
    },
    {
      id: "Accesorios para TV",
      name: "Accesorios para TV",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759854041/2025-tvs-pcd-f01-visual-lnb-02_dx2bpi.webp",
    },
  ],
  navigationLinks: [
    { label: "Smart TV", href: "/productos/televisores?seccion=smart-tv", sectionId: "smart-tv" },
    { label: "QLED", href: "/productos/televisores?seccion=qled", sectionId: "qled" },
    { label: "Crystal UHD", href: "/productos/televisores?seccion=crystal-uhd", sectionId: "crystal-uhd" },
  ],
} as const;




/**
 * 🔊 AUDIO - BARRAS DE SONIDO
 */
export const barrasSonidoSeriesConfig: SeriesFilterConfig = {
  title: "Todas las barras de sonido",
  breadcrumbCategory: "Audio",
  breadcrumbSection: "Barras de Sonido",
  series: [
    {
      id: "Q-Series",
      name: "Q-Series",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759850000/barra-sonido-q-series.webp",
    },
    {
      id: "S-Series",
      name: "S-Series",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759850100/barra-sonido-s-series.webp",
    },
    {
      id: "A-Series",
      name: "A-Series",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759850200/barra-sonido-a-series.webp",
    },
    {
      id: "The Premiere",
      name: "The Premiere",
    },
  ],
  navigationLinks: [
    { label: "Barras de Sonido", href: "/productos/audio?seccion=barras-sonido", sectionId: "barras-sonido" },
    { label: "Sistemas de Audio", href: "/productos/audio?seccion=sistemas", sectionId: "sistemas" },
  ],
} as const;

/**
 * 🔊 AUDIO - SISTEMAS DE AUDIO
 */
export const sistemasAudioSeriesConfig: SeriesFilterConfig = {
  title: "Todos los sistemas de audio",
  breadcrumbCategory: "Audio",
  breadcrumbSection: "Sistemas de Audio",
  series: [
    {
      id: "Sound Tower",
      name: "Sound Tower",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759850300/sound-tower.webp",
    },
    {
      id: "Giga Party",
      name: "Giga Party",
      image: "https://res.cloudinary.com/dnglv0zqg/image/upload/v1759850400/giga-party.webp",
    },
    {
      id: "Home Theater",
      name: "Home Theater",
    },
  ],
  navigationLinks: [
    { label: "Barras de Sonido", href: "/productos/audio?seccion=barras-sonido", sectionId: "barras-sonido" },
    { label: "Sistemas de Audio", href: "/productos/audio?seccion=sistemas", sectionId: "sistemas" },
  ],
} as const;

/**
 * �🗂️ MAPA DE CONFIGURACIONES
 * Mapea cada sección con su configuración de series
 */
export const SERIES_CONFIGS: Record<string, SeriesFilterConfig> = {
  // Dispositivos móviles
  smartphones: smartphonesSeriesConfig,
  tabletas: tabletasSeriesConfig,
  relojes: relojesSeriesConfig,
  buds: budsSeriesConfig,
  accesorios: accesoriosSeriesConfig,

  // Electrodomésticos
  refrigeradores: refrigeradoresSeriesConfig,
  lavadoras: lavadorasSeriesConfig,
  lavavajillas: lavavajillasSeriesConfig,
  aspiradoras: aspiradorasSeriesConfig,

  // Televisores
  "smart-tv": smartTvSeriesConfig,
  qled: smartTvSeriesConfig,
  "crystal-uhd": smartTvSeriesConfig,

  // Audio
  "barras-sonido": barrasSonidoSeriesConfig,
  sistemas: sistemasAudioSeriesConfig,
} as const;

/**
 * Helper para obtener configuración por sección
 */
export function getSeriesConfig(seccion: string): SeriesFilterConfig | null {
  return SERIES_CONFIGS[seccion] || null;
}
