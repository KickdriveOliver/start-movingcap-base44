import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useTranslations } from "@/components/useTranslations";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const { t } = useTranslations();

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setTimeout(() => {
        setShowBanner(true);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{t('cookie_consent_title')}</h3>
            <p className="text-sm text-gray-600 mb-2">
              {t('cookie_consent_text')}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>{t('cookie_consent_important')}:</strong> {t('cookie_consent_disclaimer')}
            </p>
            <p className="text-xs text-gray-600">
              {t('cookie_consent_platform')}{" "}
              <a href="https://base44.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                base44.com
              </a>{" "}
              {t('cookie_consent_platform_terms')}{" "}
              <a href="https://base44.com/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {t('cookie_consent_terms_link')}
              </a>{" "}
              {t('cookie_consent_and')}{" "}
              <a href="https://base44.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {t('cookie_consent_privacy_link')}
              </a>.
              {" "}{t('cookie_consent_more_info')}{" "}
              <Link 
                to={createPageUrl("Datenschutz")} 
                className="text-blue-600 hover:underline"
              >
                {t('privacy_title')}
              </Link>{" "}
              {t('cookie_consent_and_in')}{" "}
              <Link 
                to={createPageUrl("Impressum")} 
                className="text-blue-600 hover:underline"
              >
                {t('imprint_title')}
              </Link>.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              onClick={handleDecline}
              className="border-gray-300"
            >
              {t('cookie_consent_necessary_only')}
            </Button>
            <Button 
              onClick={handleAccept}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t('cookie_consent_accept_all')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}