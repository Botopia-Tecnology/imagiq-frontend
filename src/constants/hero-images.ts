/**
 * 🖼️ HERO IMAGES - VENTAS CORPORATIVAS
 * Sistema optimizado solo para secciones hero
 */

// Configuración base
const CLOUDINARY_CLOUD_NAME = "dqsdl9bwv"; // ✅ Tu cloud name configurado
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Genera URL optimizada para imágenes hero
 */
export const getHeroImageUrl = (publicId: string): string => {
  // Sin transformaciones para mantener dimensiones originales
  return `${CLOUDINARY_BASE_URL}/${publicId}`;
};

/**
 * IDs de imágenes hero por industria
 */
export const HERO_IMAGES = {
  education: "01_OB_BANNER_LANDING_EPP_PYMES_EDUCACION_DKTP_1366X607_hejdsk",
  retail: "01_OB_BANNER_LANDING_EPP_PYMES_ALIMENTARIA_DKTP_1366X607_1_apzgh2",
  finance: "samsung/finance/hero-banking",
  government: "samsung/government/hero-public",
  hotels: "samsung/hotels/hero-hospitality",
};

/**
 * IDs de imágenes para secciones específicas
 */
export const SECTION_IMAGES = {
  education: {
    hero: "01_OB_BANNER_LANDING_EPP_PYMES_EDUCACION_DKTP_1366X607_hejdsk",
    values: "education_section1_solution1_pc_1440x640_cpf0eg",
  },
  retail: {
    hero: "01_OB_BANNER_LANDING_EPP_PYMES_ALIMENTARIA_DKTP_1366X607_1_apzgh2",
    values: "retail_section3_solution1_pc_1440x640_edadhe",
  },
  finance: {
    hero: "OB_BANNER_LANDING_EPP_PYMES_SERVICIOS_DKTP_1366X607_de3mik",
    values: "finance_section1_solution1_pc_1440x640_d79szd",
    feature: "finance_section2_solution1_pc_1440x640_s4nteh",
  },
  government: {
    hero: "01_BANNER_LANDING_PYMES_SALUD_1366X607_og3irm",
    values: "government_section1_solution2_pc_1440x640_mshfcf",
    feature: "government_section2_solution1_pc_1440x640_mxtfhu",
  },
  hotels: {
    hero: "01_BANNER_LANDING_PYMES_TURISMO_1366X607_l9ir4m",
    values: "BANNER_SECCION_1366x607_qgj1tj",
    feature: "BANNER_BENEFICIOS_1366x607_cpqa36",
  },
};

export default HERO_IMAGES;
