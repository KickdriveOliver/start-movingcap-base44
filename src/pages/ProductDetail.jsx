import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, ChevronLeft, Check, Info, Settings, FileText } from "lucide-react";
import { useTranslations } from "@/components/useTranslations";
import { createPageUrl } from "@/utils";
import { products } from "@/components/data/products";

export default function ProductDetail() {
  const { t, currentLang } = useTranslations();
  const navigate = useNavigate();
  
  // Get series from URL query params
  const urlParams = new URLSearchParams(window.location.search);
  const seriesParam = urlParams.get('series');
  
  // Get product from static data (case-insensitive lookup)
  const staticProduct = useMemo(() => {
    if (!seriesParam) return null;
    return products.find(p => p.series.toLowerCase() === seriesParam.toLowerCase());
  }, [seriesParam]);
  const [displayImage, setDisplayImage] = useState(staticProduct?.image_url);

  // NEW: per-series fallback feature keys (same as Products page)
  const fallbackFeatureKeysBySeries = {
    turnTRACK: ['turntrack_feature_1', 'turntrack_feature_2', 'turntrack_feature_3'],
    maxTRACK: ['maxtrack_feature_1', 'maxtrack_feature_2', 'maxtrack_feature_3'],
    flatTRACK: ['flattrack_feature_1', 'flattrack_feature_2', 'flattrack_feature_3'],
    shortTRACK: ['shorttrack_feature_1', 'shorttrack_feature_2', 'shorttrack_feature_3'],
    pushTRACK: ['pushtrack_feature_1', 'pushtrack_feature_2', 'pushtrack_feature_3']
  };

  const getFeatureList = (p) => {
    // Start with features from feature_keys, translated and filtered for truthy values
    const translatedFromKeys = (p?.feature_keys || []).map(k => t(k)).filter(Boolean);
    let list = [...translatedFromKeys];

    // If less than 3 features, try to add from series-specific fallback keys
    if (list.length < 3) {
      const fallbackKeys = fallbackFeatureKeysBySeries[p?.series] || [];
      const pad = fallbackKeys
        .map(k => t(k))
        .filter(Boolean)
        .filter(txt => !list.includes(txt)); // Avoid duplicates
      list = [...list, ...pad];
    }

    // If still less than 3 features, try to add from plain 'features' array
    if (list.length < 3 && Array.isArray(p?.features)) {
      const plain = p.features.filter(Boolean).filter(txt => !list.includes(txt)); // Avoid duplicates
      list = [...list, ...plain];
    }

    // Return up to the first 3 features
    return list.slice(0, 3);
  };

  if (!staticProduct) {
    return (
      <div className="container mx-auto py-16">
        <h1 className="text-2xl font-bold text-center">{t('product_not_found') || "Product not found"}</h1>
      </div>
    );
  }
  
  const product = staticProduct;

  // Helper to check if product has datasheet available
  const hasDatasheet = !!(product?.datasheet_url || product?.datasheet_url_de || product?.datasheet_url_en || product?.datasheet_url_it);

  // Determine if "Coming Soon" message should be shown for datasheet
  const showComingSoonDatasheet = product.series === 'sideTRACK' || !hasDatasheet;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate(createPageUrl("Products"))}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> {t('back_to_products') || "Back to Products"}
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">MovingCap {product.name}</h1>
          <p className="text-gray-600 text-lg">{product.description_key ? t(product.description_key) : product.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gray-50 p-6 flex justify-center">
                <img
                  src={displayImage || product.image_url}
                  alt={product.name}
                  className="max-h-72 object-contain"
                />
              </div>
              
              {product.gallery_urls && product.gallery_urls.length > 0 && (
                <div className="p-4 grid grid-cols-4 gap-2">
                  {product.gallery_urls.map((url, idx) => (
                    <div 
                      key={idx} 
                      className="bg-gray-50 rounded p-2 cursor-pointer hover:bg-blue-50 transition-colors"
                      // Use state setter to trigger re-render instead of mutating object
                      onClick={() => setDisplayImage(url)}
                    >
                      <img
                        src={url}
                        alt={`${product.name} view ${idx + 1}`}
                        className="h-16 w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="p-4 border-t">
                {showComingSoonDatasheet ? (
                  <div className="w-full py-2 px-4 bg-gray-100 text-gray-500 rounded-md text-center font-medium">
                    {t('coming_soon') || "Coming Soon"}
                  </div>
                ) : (
                  <Button className="w-full" asChild>
                    <a 
                      href={
                        currentLang === 'de'
                          ? (product.datasheet_url_de || product.datasheet_url || "https://movingcap.de/MovingCap-AnwenderDoku/#1-datenblatter_pdf")
                          : currentLang === 'it'
                            ? (product.datasheet_url_it || product.datasheet_url_en || product.datasheet_url || "https://movingcap.de/MovingCap-AnwenderDoku/#1-datenblatter_pdf")
                            : (product.datasheet_url_en || product.datasheet_url || "https://movingcap.de/MovingCap-AnwenderDoku/#1-datenblatter_pdf")
                      } 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {t('download_datasheet') || "Download Datasheet"}
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div>
            <Tabs defaultValue="features" className="bg-white rounded-xl shadow-md">
              <TabsList className="grid grid-cols-3 mb-0">
                <TabsTrigger value="features" className="flex items-center gap-1">
                  <Info className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('features') || "Features"}</span>
                </TabsTrigger>
                <TabsTrigger value="specs" className="flex items-center gap-1">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('specifications') || "Specifications"}</span>
                </TabsTrigger>
                <TabsTrigger value="applications" className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('applications') || "Applications"}</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="features" className="p-6">
                <h3 className="text-xl font-bold mb-4">{t('key_features') || "Key Features"}</h3>
                <ul className="space-y-2">
                  {getFeatureList(product).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="specs" className="p-6">
                <h3 className="text-xl font-bold mb-4">{t('technical_specifications') || "Technical Specifications"}</h3>
                
                {product.technical_specs ? (
                  <div className="space-y-3">
                    {product.technical_specs.max_stroke_mm && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{t('calculator_max_stroke') || "Max Stroke"}</span>
                        <span className="font-medium">{product.technical_specs.max_stroke_mm} mm</span>
                      </div>
                    )}
                    {product.technical_specs.max_force_n && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{t('calculator_peak_force') || "Peak Force"}</span>
                        <span className="font-medium">{product.technical_specs.max_force_n} N</span>
                      </div>
                    )}
                    {product.technical_specs.max_speed_mm_s && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{t('calculator_max_speed') || "Max Speed"}</span>
                        <span className="font-medium">{product.technical_specs.max_speed_mm_s} mm/s</span>
                      </div>
                    )}
                    {product.technical_specs.moving_mass_g && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{t('calculator_motor_mass') || "Moving Mass"}</span>
                        <span className="font-medium">{product.technical_specs.moving_mass_g} g</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">{t('see_datasheet_for_specs') || "See datasheet for detailed specifications."}</p>
                )}
              </TabsContent>

              <TabsContent value="applications" className="p-6">
                <h3 className="text-xl font-bold mb-4">{t('typical_applications') || "Typical Applications"}</h3>
                {(product.application_keys?.length ? product.application_keys.map(k => t(k)) : product.applications || []).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(product.application_keys?.length ? product.application_keys.map(k => t(k)) : product.applications).map((application, idx) => (
                      <Card key={idx} className="border-blue-100 bg-blue-50">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{application}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">{t('see_datasheet_for_applications') || "See datasheet for typical applications."}</p>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700" 
                onClick={() => navigate(createPageUrl("Calculator"))}
              >
                {t('motion_calculator') || "Motion Calculator"}
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate(createPageUrl("Documentation"))}
              >
                {t('technical_documentation') || "Technical Documentation"}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}