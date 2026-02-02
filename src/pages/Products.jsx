import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Check, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "@/components/useTranslations";
import { createPageUrl } from "@/utils";
import { products } from "@/components/data/products";

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const { t, currentLang } = useTranslations();
  const datasheetUrl = currentLang === 'de'
    ? "https://movingcap.de/MovingCap-AnwenderDoku/#1-datenblatter_pdf"
    : "https://movingcap.de/MovingCap-AnwenderDoku/#1-datenblatter_pdf";

  // Helper: choose best datasheet URL per product and language
  const getDatasheetUrl = (product) => {
    const byLang =
      currentLang === 'de'
        ? product?.datasheet_url_de
        : currentLang === 'it'
          ? (product?.datasheet_url_it || product?.datasheet_url_en)
          : product?.datasheet_url_en;
    return byLang || product?.datasheet_url || datasheetUrl;
  };



  const filteredProducts = products.filter(product => 
    (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (product.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Product descriptions mapped by series (fallback if no description_key on product)
  const productDescriptions = {
    turnTRACK: t('turntrack_desc'),
    maxTRACK: t('maxtrack_desc'),
    flatTRACK: t('flattrack_desc'),
    FATtrack: t('product_fattrack_desc'),
    shortTRACK: t('shorttrack_desc'),
    pushTRACK: t('pushtrack_desc')
    };

  // NEW: per-series fallback feature translation keys (to ensure at least 3 items)
  const fallbackFeatureKeysBySeries = {
    turnTRACK: ['turntrack_feature_1', 'turntrack_feature_2', 'turntrack_feature_3'],
    maxTRACK: ['maxtrack_feature_1', 'maxtrack_feature_2', 'maxtrack_feature_3'],
    flatTRACK: ['flattrack_feature_1', 'flattrack_feature_2', 'flattrack_feature_3'],
    FATtrack: ['fattrack_feature_1', 'fattrack_feature_2', 'fattrack_feature_3'],
    shortTRACK: ['shorttrack_feature_1', 'shorttrack_feature_2', 'shorttrack_feature_3'],
    pushTRACK: ['pushtrack_feature_1', 'pushtrack_feature_2', 'pushtrack_feature_3']
    };

  const getDescriptionText = (product) => {
    if (product?.description_key) return t(product.description_key);
    return productDescriptions[product.series] || product.description || '';
  };

  // UPDATED: ensure at least 3 features using translation fallbacks, then plain-text features
  const getFeatureList = (product) => {
    const translatedFromKeys = (product?.feature_keys || []).map(k => t(k)).filter(Boolean);
    let list = [...translatedFromKeys];

    if (list.length < 3) {
      const fallbackKeys = fallbackFeatureKeysBySeries[product.series] || [];
      const pad = fallbackKeys
        .map(k => t(k))
        .filter(Boolean)
        .filter(txt => !list.includes(txt));
      list = [...list, ...pad];
    }

    if (list.length < 3 && Array.isArray(product?.features)) {
      const plain = product.features.filter(Boolean).filter(txt => !list.includes(txt));
      list = [...list, ...plain];
    }

    return list.slice(0, 3);
  };

  // Helper to check if product has datasheet available
  const hasDatasheet = (product) => {
    return !!(product?.datasheet_url || product?.datasheet_url_de || product?.datasheet_url_en || product?.datasheet_url_it);
  };

  const productCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('products_page_title')}</h1>
        <p className="text-lg text-gray-600 mb-2">
          {t('hero_subtitle')}
        </p>
        <p className="text-gray-600">
          {t('products_page_subtitle')}
        </p>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder={t('search_products')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={productCardVariants}
              className="h-full"
            >
              <Card className="border-blue-100 shadow-md h-full flex flex-col">
                <CardHeader className="pb-0">
                  <CardTitle className="text-2xl">
                    <span className="text-blue-600">MovingCap</span> {product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="aspect-video bg-gray-50 rounded-lg mb-4 flex items-center justify-center p-4">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="max-h-full object-contain" 
                    />
                  </div>
                  <p className="text-gray-600 mb-4">{getDescriptionText(product)}</p>
                  
                  {getFeatureList(product).length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">{t('key_features')}:</h3>
                      <ul className="space-y-1">
                        {getFeatureList(product).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link to={createPageUrl(`ProductDetail?series=${product.series}`)}>
                      {t('learn_more')}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
        ))}
      </div>
    </div>
  );
}