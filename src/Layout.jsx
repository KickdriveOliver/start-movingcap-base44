import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSelector from "./components/LanguageSelector";
import { TranslationProvider, useTranslations } from "./components/useTranslations";
import CookieConsent from "./components/CookieConsent";

const LayoutContent = ({ children, currentPageName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, currentLang, setLanguage } = useTranslations();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Landing")} className="flex items-center">
              <span className="text-xl font-bold text-blue-600">MovingCap</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Link 
                to={createPageUrl("Products")}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {t('products')}
              </Link>
              <Link 
                to={createPageUrl("Documentation")}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {t('documentation')}
              </Link>
              
              {/* Calculator Button - Desktop */}
              <Button 
                asChild
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Link to={createPageUrl("Calculator")}>
                  <Calculator className="w-4 h-4 mr-2" />
                  {t('motion_calculator')}
                </Link>
              </Button>

              <LanguageSelector 
                currentLang={currentLang}
                onLanguageChange={setLanguage}
              />
            </div>

            {/* Mobile buttons */}
            <div className="flex items-center gap-3 md:hidden">
              <Button 
                asChild
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Link to={createPageUrl("Calculator")}>
                  <Calculator className="w-4 h-4" />
                </Link>
              </Button>

              <LanguageSelector 
                currentLang={currentLang}
                onLanguageChange={setLanguage}
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4">
              <div className="flex flex-col gap-2">
                <Link 
                  to={createPageUrl("Products")}
                  className="text-gray-600 hover:text-blue-600 transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('products')}
                </Link>
                <Link 
                  to={createPageUrl("Documentation")}
                  className="text-gray-600 hover:text-blue-600 transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('documentation')}
                </Link>
                <Link 
                  to={createPageUrl("Calculator")}
                  className="text-gray-600 hover:text-blue-600 transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center">
                    <Calculator className="w-4 h-4 mr-2" />
                    {t('motion_calculator')}
                  </span>
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="pt-16 flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">MovingCap</h3>
              <p className="text-sm text-gray-600 mb-2">
                {t('hero_subtitle')}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-3">{t('quick_links')}</h3>
              <div className="flex flex-col gap-2">
                <Link 
                  to={createPageUrl("Products")}
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  {t('products')}
                </Link>
                <Link 
                  to={createPageUrl("Documentation")}
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  {t('documentation')}
                </Link>
                <Link 
                  to={createPageUrl("Calculator")}
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  {t('motion_calculator')}
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-3">{t('legal')}</h3>
              <div className="flex flex-col gap-2">
                <Link 
                  to={createPageUrl("Impressum")}
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  {t('imprint_title')}
                </Link>
                <Link 
                  to={createPageUrl("Datenschutz")}
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  {t('privacy_title')}
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t">
            <div className="text-center text-sm text-gray-600 space-y-2">
              <p>© {new Date().getFullYear()} Fullmo Drives GmbH. {t('footer_rights')}</p>
              <p className="text-xs text-gray-500">
                {t('footer_disclaimer')}{" "}
                <a href="mailto:info@drives.fullmo.de" className="text-blue-600 hover:underline">
                  info@drives.fullmo.de
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
};

export default function Layout({ children, currentPageName }) {
  return (
    <TranslationProvider>
      <LayoutContent children={children} currentPageName={currentPageName} />
    </TranslationProvider>
  );
}