import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Shield, Globe, Code, Network, Download, ClipboardList } from "lucide-react";
import { useTranslations } from "@/components/useTranslations";
import { products } from "@/components/data/products";

export default function Documentation() {
  const { t, currentLang } = useTranslations();

  // Products loaded from static data - no loading state needed
  const dsLoading = false;

  const getDatasheetUrl = (p) => {
    const fallback = "https://movingcap.de/MovingCap-AnwenderDoku/#1-datenblatter_pdf";
    if (currentLang === "de") return p?.datasheet_url_de || p?.datasheet_url || fallback;
    if (currentLang === "it") return p?.datasheet_url_it || p?.datasheet_url_en || p?.datasheet_url || fallback;
    return p?.datasheet_url_en || p?.datasheet_url || fallback;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{t('documentation')}</h1>
            <p className="text-lg text-gray-600">
              {t('docs_intro_prefix') || "Complete technical documentation is available at"}{" "}
              <a 
                href="https://movingcap.de" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                movingcap.de
              </a>
              . {t('docs_intro_suffix') || "Below you'll find an overview of the key resources for working with MovingCap drives."}
            </p>
          </div>

          <div className="grid gap-6">
            {/* NEW: Datasheets box */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-cyan-600" />
                    <span>{t('datasheets_title') || "Datasheets"}</span>
                  </div>
                  {dsLoading ? (
                    <span className="text-sm text-gray-500">{t('loading') || "Loading..."}</span>
                  ) : null}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-700">
                  {t('datasheets_intro') || "Find the latest technical datasheets for all MovingCap drives, including specifications, dimensions, and electrical characteristics."}
                </p>
                {dsLoading ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                    <span>{t('loading') || "Loading..."}</span>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {products
                      .slice()
                      .sort((a, b) => (a.series || "").localeCompare(b.series || ""))
                      .map((p) => {
                        const url = getDatasheetUrl(p);
                        return (
                          <div key={p.id} className="flex items-center justify-between gap-3 rounded-md border p-3 bg-white">
                            <div className="min-w-0">
                              <div className="font-medium truncate">MovingCap {p.name || p.series}</div>
                            </div>
                            <Button asChild size="sm" className="whitespace-nowrap">
                              <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                {t('open_datasheet') || "Open Datasheet"}
                              </a>
                            </Button>
                          </div>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Machine Assembly and Safety */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  {t('docs_safety_title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  {t('docs_safety_desc')}
                </p>
                <Button asChild>
                  <a 
                    href="https://movingcap.de/MovingCap-AnwenderDoku/#0-montageanleitung-und-einbauerklarung" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    {t('docs_safety_button')}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Ethernet Documentation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  {t('docs_eth_title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  {t('docs_eth_desc')}
                </p>
                <Button asChild>
                  <a 
                    href="https://movingcap.de/webmanuals/eth/index.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    {t('docs_eth_button')}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* IO Control Documentation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    width="20" 
                    height="20" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-orange-600"
                  >
                    <path d="M4 6v12M4 12h3" />
                    <path d="M7 12l2-5V7h10" />
                    <path d="M9 7l2 5h3.5M14.5 12l1 4H20M20 16V4" />
                  </svg>
                  {t('docs_io_title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  {t('docs_io_desc')}
                </p>
                <Button asChild>
                  <a 
                    href="https://movingcap.com/MovingCap-AnwenderDoku/#movingcap-io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    {t('docs_io_button')}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Python capabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-purple-600" />
                  {t('docs_python_title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  {t('docs_python_desc')}
                </p>
                <Button asChild>
                  <a 
                    href="https://movingcap.de/webmanuals/eth/movingcapcode.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    {t('docs_python_button')}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* CANopen Documentation - Moved to bottom */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-blue-600" />
                  {t('docs_can_title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  {t('docs_can_desc')}
                </p>
                <Button asChild>
                  <a 
                    href="https://movingcap.de/user/MovingCap-AnwenderDoku/3-MovingCap_CAN_CANopen/turnTRACK_MC349_CANopen/fullmoBasicSetupMovingCap349_en.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    {t('docs_can_button')}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

        </motion.div>
      </div>
    </div>
  );
}