import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useTranslations } from "@/components/useTranslations";
import { base44 } from "@/api/base44Client";

export default function Landing() {
  const { t, currentLang } = useTranslations();

  // Define default/fallback datasheet URLs
  const datasheetUrlDE = "https://movingcap.de/MovingCap-AnwenderDoku/#1-datenblatter_pdf";
  const datasheetUrlEN = "https://movingcap.de/MovingCap-AnwenderDoku/#1-datenblatter_pdf"; // Assuming a generic English doc for now, can be updated if specific one exists

  // State to store product datasheet links
  const [dsLinks, setDsLinks] = React.useState({});
  const [productsBySeries, setProductsBySeries] = React.useState({});

  // Effect to load product datasheet links from the API
  React.useEffect(() => {
    const load = async () => {
      try {
        const list = await base44.entities.Product.list();
        const map = {};
        const bySeries = {};
        list.forEach(p => {
          // Fallback logic: specific language URL -> generic datasheet_url -> hardcoded default
          map[p.series] = {
            de: p.datasheet_url_de || p.datasheet_url || datasheetUrlDE,
            en: p.datasheet_url_en || p.datasheet_url || datasheetUrlEN,
            it: p.datasheet_url_it || p.datasheet_url_en || p.datasheet_url || datasheetUrlEN // Fallback to EN if IT not available
          };
          if (p.series) {
            bySeries[p.series] = p;
          }
        });
        setDsLinks(map);
        setProductsBySeries(bySeries);
      } catch (e) {
        console.error("Failed to load product datasheet links:", e); // Log error but allow fallbacks
        // ignore, fallbacks will be used
      }
    };
    load();
  }, []); // Run once on mount

  // Helper to pick localized description per series
  const getSeriesDescription = (series) => {
    const p = productsBySeries[series];
    if (p?.description_key) return t(p.description_key);
    const fallbackMap = {
      turnTRACK: t('turntrack_desc'),
        maxTRACK: t('maxtrack_desc'),
        flatTRACK: t('flattrack_desc'),
        FATtrack: t('product_fattrack_desc'),
        shortTRACK: t('shorttrack_desc'),
        pushTRACK: t('pushtrack_desc'),
        sideTRACK: t('sidetrack_desc')
      };
    return fallbackMap[series] || '';
  };

  // Per-series fallback feature translation keys (ensures at least 3 items)
  const fallbackFeatureKeysBySeries = {
    turnTRACK: ['turntrack_feature_1', 'turntrack_feature_2', 'turntrack_feature_3'],
    maxTRACK: ['maxtrack_feature_1', 'maxtrack_feature_2', 'maxtrack_feature_3'],
    flatTRACK: ['flattrack_feature_1', 'flattrack_feature_2', 'flattrack_feature_3'],
    FATtrack: ['fattrack_feature_1', 'fattrack_feature_2', 'fattrack_feature_3'],
    shortTRACK: ['shorttrack_feature_1', 'shorttrack_feature_2', 'shorttrack_feature_3'],
    pushTRACK: ['pushtrack_feature_1', 'pushtrack_feature_2', 'pushtrack_feature_3'],
    sideTRACK: ['sidetrack_feature_1', 'sidetrack_feature_2', 'sidetrack_feature_3']
    };

  // Build localized features for a series with robust fallbacks (>= 3 items)
  const getSeriesFeatures = (series) => {
    const p = productsBySeries[series];
    const uniqueFeatures = new Set();

    // 1. Add features from feature_keys (translated)
    if (Array.isArray(p?.feature_keys)) {
      p.feature_keys.forEach(k => {
        const translated = t(k);
        if (translated && !uniqueFeatures.has(translated)) {
          uniqueFeatures.add(translated);
        }
      });
    }

    // 2. Add features from fallbackFeatureKeysBySeries (translated) if fewer than 3 unique features
    if (uniqueFeatures.size < 3) {
      const fallbackKeys = fallbackFeatureKeysBySeries[series] || [];
      fallbackKeys.forEach(k => {
        const translated = t(k);
        if (translated && !uniqueFeatures.has(translated)) {
          uniqueFeatures.add(translated);
        }
      });
    }

    // 3. Add plain features if still fewer than 3 unique features
    if (uniqueFeatures.size < 3 && Array.isArray(p?.features)) {
      p.features.forEach(feat => {
        if (feat && typeof feat === 'string' && !uniqueFeatures.has(feat)) {
          uniqueFeatures.add(feat);
        }
      });
    }
    
    return Array.from(uniqueFeatures).slice(0, 3);
  };

  // Helper function to get the correct datasheet URL for a series and current language
  const getDatasheetUrlForSeries = (series) => {
    if (currentLang === 'de') return dsLinks[series]?.de || datasheetUrlDE;
    if (currentLang === 'it') return dsLinks[series]?.it || dsLinks[series]?.en || datasheetUrlEN;
    return dsLinks[series]?.en || datasheetUrlEN; // Default to English or generic fallback
  };

  const seriesData = [
    { 
      series: "turnTRACK", 
      name: "MovingCap turnTRACK", 
      img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/e86935_ani-001.jpg" 
    },
    { 
      series: "maxTRACK", 
      name: "MovingCap maxTRACK", 
      img: "https://fullmo.de/assets/img/moving-cap-001b.jpg"
    },
    { 
      series: "FATtrack", 
      name: "MovingCap FATtrack", 
      img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/680263821ec9d2a88d7e42e5/33c66611d_fattrack_photo-removebg-preview.jpg"
    },
    { 
      series: "flatTRACK", 
      name: "MovingCap flatTRACK", 
      img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/dc47a5_moving-cap-004b.jpg"
    },
    { 
      series: "shortTRACK", 
      name: "MovingCap shortTRACK", 
      img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/343056_moving-cap-005b.jpg"
    },
    { 
      series: "pushTRACK", 
      name: "MovingCap pushTRACK", 
      img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a08b24_moving-cap-002b.jpg"
    },
    { 
      series: "sideTRACK", 
      name: "MovingCap sideTRACK", 
      img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/680263821ec9d2a88d7e42e5/7c23351f9_sideTRACK_product_photo.jpg"
    }
  ];

  // Helper to check if product has datasheet available from the API
  const hasDatasheet = (series) => {
    const p = productsBySeries[series];
    return !!(p?.datasheet_url || p?.datasheet_url_de || p?.datasheet_url_en || p?.datasheet_url_it);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-900 text-white">
        <div className="absolute inset-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-gray-900/80 to-gray-900 z-10"
          />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518124624242-286524c3c3b5?auto=format&fit=crop&w=1740&q=80')] bg-cover bg-center opacity-30" />
        </div>
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t('hero_title')}
              </h1>
              <div className="text-2xl md:text-3xl font-semibold mb-4 text-blue-300">
                {t('hero_subtitle')}
              </div>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                {t('hero_description')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                  asChild
                >
                  <Link to={createPageUrl("Products")}>
                    {t('explore_products')}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-gray-900"
                  asChild
                >
                  <Link to={createPageUrl("Calculator")}>
                    {t('motion_calculator')}
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Series Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            {t('product_series')}
          </h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
            {t('product_series_desc')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {seriesData.map((item, index) => (
              <motion.div
                key={item.series}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden" 
              >
                <div className="p-6 flex flex-col h-full">
                  <h3 className="text-2xl font-semibold mb-4">{item.name}</h3>
                  <div className="aspect-video bg-gray-100 rounded-lg mb-6 overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                  <p className="mb-4 text-gray-600 flex-grow">{getSeriesDescription(item.series)}</p>
                  <ul className="space-y-3 mb-6">
                    {getSeriesFeatures(item.series).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  {hasDatasheet(item.series) ? (
                    <Button className="w-full mt-auto" asChild>
                      <a href={getDatasheetUrlForSeries(item.series)} target="_blank" rel="noopener noreferrer">
                        {t('learn_more')}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </a>
                    </Button>
                  ) : (
                    <div className="w-full mt-auto py-2 px-4 bg-gray-100 text-gray-500 rounded-md text-center font-medium">
                      {t('coming_soon')}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('advanced_features')}
            </h2>
            <p className="text-gray-600">
              {t('tech_description')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: t('integrated_control'),
                image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/dc47a5_moving-cap-004b.jpg",
                features: [
                  t('ethercat_interface'),
                  t('ethernet_tcpip_sockets'),
                  t('canopen_optional'),
                  t('micropython_built_in')                  
                ]
              },
              {
                title: t('precision_engineering'),
                image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/343056_moving-cap-005b.jpg",
                features: [
                  t('absolute_position_no_ref'),
                  t('micrometer_accuracy'),
                  t('precision_guide_rails'),
                  t('easy_maintenance')
                ]
              },
              {
                title: t('flexible_integration'),
                image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a08b24_moving-cap-002b.jpg",
                features: [
                  t('mounting_options'),
                  t('industrial_connectors'),
                  t('compact_design')
                ]
              }
            ].map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-contain p-4"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('ready_to_automate')}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {t('explore_docs')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
                asChild
              >
                <Link to={createPageUrl("Products")}>
                  {t('view_all_products')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                asChild
              >
                <Link to={createPageUrl("Calculator")}>
                  {t('try_calculator')}
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}