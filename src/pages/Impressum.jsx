import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "@/components/useTranslations";

const translations = {
  en: {
    title: "Imprint",
    company_info: "Company Information",
    contact: "Contact",
    phone: "Phone",
    fax: "Fax",
    email: "Email",
    register: "Commercial Register",
    register_entry: "Entry in the commercial register",
    register_court: "Register court",
    register_number: "Registration number",
    managing_directors: "Managing Directors",
    vat: "VAT Identification Number",
    vat_text: "VAT ID according to §27a VAT Act",
    disclaimer_title: "Liability Disclaimer",
    disclaimer_content: "Despite careful content control, we assume no liability for the content of external links. The operators of the linked pages are solely responsible for their content."
  },
  de: {
    title: "Impressum",
    company_info: "Unternehmensinformationen",
    contact: "Kontakt",
    phone: "Telefon",
    fax: "Fax",
    email: "E-Mail",
    register: "Registereintrag",
    register_entry: "Eintragung im Handelsregister",
    register_court: "Registergericht",
    register_number: "Registernummer",
    managing_directors: "Geschäftsführer",
    vat: "Umsatzsteuer-Identifikationsnummer",
    vat_text: "Umsatzsteuer-ID gemäß §27a Umsatzsteuergesetz",
    disclaimer_title: "Haftungsausschluss",
    disclaimer_content: "Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich."
  },
  it: {
    title: "Impronta",
    company_info: "Informazioni sulla società",
    contact: "Contatto",
    phone: "Telefono",
    fax: "Fax",
    email: "Email",
    register: "Registro commerciale",
    register_entry: "Iscrizione nel registro commerciale",
    register_court: "Tribunale del registro",
    register_number: "Numero di registrazione",
    managing_directors: "Amministratori delegati",
    vat: "Partita IVA",
    vat_text: "Numero di identificazione IVA secondo §27a della legge IVA",
    disclaimer_title: "Esclusione di responsabilità",
    disclaimer_content: "Nonostante l'attento controllo dei contenuti, non ci assumiamo alcuna responsabilità per i contenuti di link esterni. Gli operatori delle pagine collegate sono gli unici responsabili dei loro contenuti."
  },
  fr: {
    title: "Mentions légales",
    company_info: "Informations sur l'entreprise",
    contact: "Contact",
    phone: "Téléphone",
    fax: "Fax",
    email: "Email",
    register: "Registre du commerce",
    register_entry: "Inscription au registre du commerce",
    register_court: "Tribunal d'enregistrement",
    register_number: "Numéro d'enregistrement",
    managing_directors: "Directeurs généraux",
    vat: "Numéro de TVA",
    vat_text: "Numéro de TVA selon §27a de la loi sur la TVA",
    disclaimer_title: "Exclusion de responsabilité",
    disclaimer_content: "Malgré un contrôle minutieux du contenu, nous n'assumons aucune responsabilité pour le contenu des liens externes. Les opérateurs des pages liées sont seuls responsables de leur contenu."
  }
};

export default function Impressum() {
  const { currentLang } = useTranslations();
  const t = translations[currentLang] || translations.en;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">{t.title}</h1>
          
          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">{t.company_info}</h2>
              <p>
                Fullmo Drives GmbH<br />
                Robert-Bosch-Straße 5<br />
                88677 Markdorf<br />
                Germany
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t.contact}</h2>
              <p>
                {t.phone}: +49 7544-307339-0<br />
                {t.fax}: +49 7544-307339-9<br />
                {t.email}: <a href="mailto:info@drives.fullmo.de" className="text-blue-600 hover:text-blue-800">info@drives.fullmo.de</a><br />
                Web: <a href="https://fullmo.de" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">https://fullmo.de</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t.register}</h2>
              <p>
                {t.register_entry}<br />
                {t.register_court}: Amtsgericht Freiburg i. Br.<br />
                {t.register_number}: HRB 703118
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t.disclaimer_title}</h2>
              <p>{t.disclaimer_content}</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}