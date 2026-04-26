// Calculator & product data version — update when specs or formulas change
export const CALCULATOR_VERSION = 'v0.3 — 2026-04-25';

// Static product data - exported from database
export const products = [
  {
    id: 'turntrack',
    name: 'turnTRACK',
    series: 'turnTRACK',
    description_key: 'product_turntrack_desc',
    long_description_key: 'product_turntrack_long_desc',
    feature_keys: ['turntrack_feature_1', 'turntrack_feature_2', 'turntrack_feature_3'],
    application_keys: ['product_turntrack_app1', 'product_turntrack_app2'],
    technical_specs: null,
    image_url: '/images/movingcap-turntrack.jpg',
    gallery_urls: ['/images/movingcap-turntrack.jpg'],
    datasheet_url: 'https://movingcap.de/user/MovingCap-AnwenderDoku/1-MovingCap-KatalogeDatenbl%C3%A4tter/1-Datenbl%C3%A4tter_PDF_2025/MovingCap%20turnTRACK/MovingCap%20turnTRACK_english_2024_print.pdf',
    datasheet_url_de: 'https://movingcap.de/user/MovingCap-AnwenderDoku/1-MovingCap-KatalogeDatenbl%C3%A4tter/1-Datenbl%C3%A4tter_PDF_2025/MovingCap%20turnTRACK/MovingCap%20turnTRACK_deutsch_2024_print.pdf',
    datasheet_url_en: null,
    datasheet_url_it: 'https://movingcap.de/user/MovingCap-AnwenderDoku/1-MovingCap-KatalogeDatenbl%C3%A4tter/1-Datenbl%C3%A4tter_PDF_2025/MovingCap%20turnTRACK/MovingCap%20turnTRACK_english_2024_print.pdf'
  },
  {
    id: 'maxtrack',
    name: 'maxTRACK',
    series: 'maxTRACK',
    description_key: 'product_maxtrack_desc',
    long_description_key: 'product_maxtrack_long_desc',
    feature_keys: ['maxtrack_feature_1', 'maxtrack_feature_2', 'maxtrack_feature_3'],
    application_keys: ['product_maxtrack_app1', 'product_maxtrack_app2'],
    technical_specs: null,
    image_url: '/images/movingcap-maxtrack.jpg',
    gallery_urls: ['/images/movingcap-maxtrack.jpg'],
    datasheet_url: 'https://movingcap.de/user/MovingCap-AnwenderDoku/1-MovingCap-KatalogeDatenbl%C3%A4tter/1-Datenbl%C3%A4tter_PDF_2025/MovingCap%20maxTRACK/MovingCap%20maxTRACK_english_2025_print.pdf',
    datasheet_url_de: 'https://movingcap.de/user/MovingCap-AnwenderDoku/1-MovingCap-KatalogeDatenbl%C3%A4tter/1-Datenbl%C3%A4tter_PDF_2025/MovingCap%20maxTRACK/MovingCap%20maxTRACK_deutsch_2025_print.pdf',
    datasheet_url_en: null,
    datasheet_url_it: 'https://movingcap.de/user/MovingCap-AnwenderDoku/1-MovingCap-KatalogeDatenbl%C3%A4tter/1-Datenbl%C3%A4tter_PDF_2025/MovingCap%20maxTRACK/MovingCap%20maxTRACK_english_2025_print.pdf'
  },
  {
    id: 'flattrack',
    name: 'flatTRACK',
    series: 'flatTRACK',
    description_key: 'product_flattrack_desc',
    long_description_key: 'product_flattrack_long_desc',
    feature_keys: ['flattrack_feature_1', 'flattrack_feature_2', 'flattrack_feature_3'],
    application_keys: ['product_flattrack_app1', 'product_flattrack_app2'],
    technical_specs: {
      max_stroke_mm: 1800,
      max_force_n: 150,
      max_speed_mm_s: 2000,
      moving_mass_g: 600,
      nom_force_n: 35,
      duty_cycle_ED: 50,
      loss_force_n: 5,
      stroke_options_mm: [100, 195, 290, 485, 585, 650, 1325]
    },
    image_url: '/images/movingcap-flattrack.jpg',
    gallery_urls: ['/images/movingcap-flattrack.jpg'],
    datasheet_url: 'https://movingcap.de/user/MovingCap-AnwenderDoku/1-MovingCap-KatalogeDatenbl%C3%A4tter/1-Datenbl%C3%A4tter_PDF_2025/MovingCap%20flatTRACK/MovingCap%20flatTRACK_english_2025_print.pdf',
    datasheet_url_de: 'https://movingcap.de/user/MovingCap-AnwenderDoku/1-MovingCap-KatalogeDatenbl%C3%A4tter/1-Datenbl%C3%A4tter_PDF_2025/MovingCap%20flatTRACK/MovingCap%20flatTRACK_deutsch_2025_print.pdf',
    datasheet_url_en: null,
    datasheet_url_it: 'https://movingcap.de/user/MovingCap-AnwenderDoku/1-MovingCap-KatalogeDatenbl%C3%A4tter/1-Datenbl%C3%A4tter_PDF_2025/MovingCap%20flatTRACK/MovingCap%20flatTRACK_english_2025_print.pdf'
  },
  {
    id: 'fattrack',
    name: 'FATtrack',
    series: 'FATtrack',
    description_key: 'product_fattrack_desc',
    long_description_key: 'product_fattrack_long_desc',
    feature_keys: ['fattrack_feature_1', 'fattrack_feature_2', 'fattrack_feature_3'],
    application_keys: [],
    technical_specs: {
      max_stroke_mm: 200,
      max_force_n: 200,
      max_speed_mm_s: 2000,
      moving_mass_g: 800,
      nom_force_n: 70,
      duty_cycle_ED: 50,
      loss_force_n: 7,
      stroke_options_mm: [200]
    },
    image_url: '/images/movingcap-fattrack.jpg',
    gallery_urls: [],
    datasheet_url: 'https://movingcap.de/user/MovingCap-AnwenderDoku/1-MovingCap-KatalogeDatenbl%C3%A4tter/1-Datenbl%C3%A4tter_PDF_2025/MovingCap%20flatTRACK/MovingCap%20flatTRACK_english_2025_print.pdf',
    datasheet_url_de: 'https://movingcap.de/user/MovingCap-AnwenderDoku/1-MovingCap-KatalogeDatenbl%C3%A4tter/1-Datenbl%C3%A4tter_PDF_2025/MovingCap%20flatTRACK/MovingCap%20flatTRACK_deutsch_2025_print.pdf',
    datasheet_url_en: null,
    datasheet_url_it: 'https://movingcap.de/user/MovingCap-AnwenderDoku/1-MovingCap-KatalogeDatenbl%C3%A4tter/1-Datenbl%C3%A4tter_PDF_2025/MovingCap%20flatTRACK/MovingCap%20flatTRACK_english_2025_print.pdf'
  },
  {
    id: 'shorttrack',
    name: 'shortTRACK',
    series: 'shortTRACK',
    description_key: 'product_shorttrack_desc',
    long_description_key: 'product_shorttrack_long_desc',
    feature_keys: ['shorttrack_feature_1', 'shorttrack_feature_2', 'shorttrack_feature_3'],
    application_keys: ['product_shorttrack_app1', 'product_shorttrack_app2'],
    technical_specs: {
      max_stroke_mm: 46,
      max_force_n: 28,
      max_speed_mm_s: 1800,
      moving_mass_g: 450,
      nom_force_n: 9,
      duty_cycle_ED: 25,
      loss_force_n: 2,
      stroke_options_mm: [46]
    },
    image_url: '/images/movingcap-shorttrack.jpg',
    gallery_urls: ['/images/movingcap-shorttrack.jpg'],
    datasheet_url: 'https://movingcap.de/user/MovingCap-AnwenderDoku/1-MovingCap-KatalogeDatenbl%C3%A4tter/1-Datenbl%C3%A4tter_PDF_2025/MovingCap%20shortTRACK/MovingCap%20shortTRACK_deutsch_2025_print.pdf',
    datasheet_url_de: null,
    datasheet_url_en: null,
    datasheet_url_it: 'https://movingcap.de/user/MovingCap-AnwenderDoku/1-MovingCap-KatalogeDatenbl%C3%A4tter/1-Datenbl%C3%A4tter_PDF_2025/MovingCap%20shortTRACK/MovingCap%20shortTRACK_deutsch_2025_print.pdf'
  },
  {
    id: 'pushtrack',
    name: 'pushTRACK',
    series: 'pushTRACK',
    description_key: 'product_pushtrack_desc',
    long_description_key: 'product_pushtrack_long_desc',
    feature_keys: ['pushtrack_feature_1', 'pushtrack_feature_2', 'pushtrack_feature_3'],
    application_keys: ['product_pushtrack_app1', 'product_pushtrack_app2'],
    technical_specs: null,
    image_url: '/images/movingcap-pushtrack.jpg',
    gallery_urls: ['/images/movingcap-pushtrack.jpg'],
    datasheet_url: 'https://movingcap.de/user/MovingCap-AnwenderDoku/1-MovingCap-KatalogeDatenbl%C3%A4tter/1-Datenbl%C3%A4tter_PDF_2025/MovingCap%20pushTRACK/MovingCap%20pushTRACK_english_2025_print.pdf',
    datasheet_url_de: 'https://movingcap.de/user/MovingCap-AnwenderDoku/1-MovingCap-KatalogeDatenbl%C3%A4tter/1-Datenbl%C3%A4tter_PDF_2025/MovingCap%20pushTRACK/MovingCap%20pushTRACK_deutsch_2025_print.pdf',
    datasheet_url_en: null,
    datasheet_url_it: 'https://movingcap.de/user/MovingCap-AnwenderDoku/1-MovingCap-KatalogeDatenbl%C3%A4tter/1-Datenbl%C3%A4tter_PDF_2025/MovingCap%20pushTRACK/MovingCap%20pushTRACK_english_2025_print.pdf'
  },
  {
    id: 'sidetrack',
    name: 'sideTRACK',
    series: 'sideTRACK',
    description_key: 'sidetrack_desc',
    long_description_key: null,
    feature_keys: ['sidetrack_feature_1', 'sidetrack_feature_2', 'sidetrack_feature_3'],
    application_keys: [],
    technical_specs: null,
    image_url: '/images/movingcap-sidetrack.jpg',
    gallery_urls: [],
    datasheet_url: null,
    datasheet_url_de: null,
    datasheet_url_en: null,
    datasheet_url_it: null
  }
];

// Helper to get product by series
export const getProductBySeries = (series) => {
  return products.find(p => p.series === series);
};

// Helper to get products with calculator support (have technical_specs)
export const getCalculatorProducts = () => {
  const validSeries = ['flatTRACK', 'FATtrack', 'shortTRACK'];
  return products.filter(p => validSeries.includes(p.series) && p.technical_specs);
};