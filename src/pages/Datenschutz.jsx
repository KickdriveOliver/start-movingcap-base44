import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "@/components/useTranslations";

const translations = {
  en: {
    title: "Privacy Policy",
    intro: "We take the protection of your personal data very seriously. We treat your personal data confidentially and in accordance with statutory data protection regulations and this privacy policy.",
    
    overview_title: "1. Data Protection at a Glance",
    general_title: "General Information",
    general_text: "The following information provides a simple overview of what happens to your personal data when you visit this website. Personal data is any data by which you can be personally identified.",
    
    collection_title: "Data Collection on this Website",
    responsible_question: "Who is responsible for data collection on this website?",
    responsible_answer: "Data processing on this website is carried out by the website operator. You can find the operator's contact details in the section 'Information about the responsible party' in this privacy policy.",
    
    how_collect_question: "How do we collect your data?",
    how_collect_answer: "Your data is collected when you provide it to us. This may be data that you enter into a contact form, for example. Other data is collected automatically or with your consent by our IT systems when you visit the website. This is mainly technical data (e.g. internet browser, operating system or time of page view). This data is collected automatically as soon as you enter this website.",
    
    purpose_question: "What do we use your data for?",
    purpose_answer: "Some of the data is collected to ensure error-free provision of the website. Other data may be used to analyze your user behavior.",
    
    rights_question: "What rights do you have regarding your data?",
    rights_answer: "You have the right to receive information about the origin, recipient and purpose of your stored personal data free of charge at any time. You also have the right to request the correction or deletion of this data. If you have given your consent to data processing, you can revoke this consent at any time for the future. You also have the right to request the restriction of the processing of your personal data under certain circumstances. Furthermore, you have the right to lodge a complaint with the competent supervisory authority.",
    
    hosting_title: "2. Hosting",
    hosting_text: "This website is hosted on the base44 platform. The provider is Base44, Inc. When you visit this website, the host automatically collects and stores various information in so-called server log files that your browser automatically transmits. For details on the host's data protection practices, please see:",
    
    controller_title: "3. Information about the Responsible Party",
    controller_text: "The responsible party for data processing on this website is:",
    controller_contact: "If you have any questions about data protection, please contact us at:",
    
    data_types_title: "4. Data Collection on this Website",
    cookies_title: "Cookies",
    cookies_text: "Our website uses cookies. Cookies are small text files that are stored on your device and do not cause any damage. They are stored either temporarily for the duration of a session (session cookies) or permanently (permanent cookies) on your device. Session cookies are automatically deleted at the end of your visit. Permanent cookies remain stored on your device until you delete them yourself or until they are automatically deleted by your web browser.",
    
    server_logs_title: "Server Log Files",
    server_logs_text: "The provider of the pages automatically collects and stores information in so-called server log files, which your browser automatically transmits to us. These are:",
    server_logs_items: [
      "Browser type and version",
      "Operating system used",
      "Referrer URL",
      "Host name of the accessing computer",
      "Time of the server request",
      "IP address"
    ],
    server_logs_legal: "This data is not merged with other data sources. The collection of this data is based on Art. 6 para. 1 lit. f GDPR. The website operator has a legitimate interest in the technically error-free presentation and optimization of its website - server log files must be recorded for this purpose.",
    
    contact_title: "Contact Form and Email Contact",
    contact_text: "If you send us inquiries via contact form or email, your data from the inquiry form, including the contact data you provided there, will be stored by us for the purpose of processing the inquiry and in case of follow-up questions. We do not share this data without your consent. The processing of this data is based on Art. 6 para. 1 lit. b GDPR if your request is related to the performance of a contract or is necessary to carry out pre-contractual measures. In all other cases, the processing is based on our legitimate interest in effectively processing the inquiries sent to us (Art. 6 para. 1 lit. f GDPR) or on your consent (Art. 6 para. 1 lit. a GDPR) if this was requested.",
    
    rights_title: "5. Your Rights",
    rights_intro: "You have the following rights with regard to your personal data:",
    right_access: "Right of access: You have the right to receive information about your personal data stored by us.",
    right_rectification: "Right to rectification: You have the right to request the correction of inaccurate personal data and the completion of incomplete personal data.",
    right_erasure: "Right to erasure: You have the right to request the deletion of your personal data under certain conditions.",
    right_restriction: "Right to restriction of processing: You have the right to request the restriction of the processing of your personal data under certain conditions.",
    right_portability: "Right to data portability: You have the right to receive the personal data concerning you in a structured, commonly used and machine-readable format.",
    right_objection: "Right to object: You have the right to object to the processing of your personal data under certain conditions.",
    right_complaint: "Right to lodge a complaint: You have the right to lodge a complaint with a supervisory authority if you believe that the processing of your personal data violates data protection law.",
    
    contact_rights: "To exercise your rights, please contact us at:",
    
    last_updated: "Last updated: February 2026"
  },
  de: {
    title: "Datenschutzerklärung",
    intro: "Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.",
    
    overview_title: "1. Datenschutz auf einen Blick",
    general_title: "Allgemeine Hinweise",
    general_text: "Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.",
    
    collection_title: "Datenerfassung auf dieser Website",
    responsible_question: "Wer ist verantwortlich für die Datenerfassung auf dieser Website?",
    responsible_answer: "Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt 'Hinweis zur verantwortlichen Stelle' in dieser Datenschutzerklärung entnehmen.",
    
    how_collect_question: "Wie erfassen wir Ihre Daten?",
    how_collect_answer: "Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.",
    
    purpose_question: "Wofür nutzen wir Ihre Daten?",
    purpose_answer: "Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.",
    
    rights_question: "Welche Rechte haben Sie bezüglich Ihrer Daten?",
    rights_answer: "Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.",
    
    hosting_title: "2. Hosting",
    hosting_text: "Diese Website wird auf der base44-Plattform gehostet. Anbieter ist Base44, Inc. Beim Besuch dieser Website erfasst und speichert der Host automatisch verschiedene Informationen in sogenannten Server-Log-Dateien, die Ihr Browser automatisch übermittelt. Details zu den Datenschutzpraktiken des Hosts finden Sie unter:",
    
    controller_title: "3. Hinweis zur verantwortlichen Stelle",
    controller_text: "Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:",
    controller_contact: "Bei Fragen zum Datenschutz wenden Sie sich bitte an:",
    
    data_types_title: "4. Datenerfassung auf dieser Website",
    cookies_title: "Cookies",
    cookies_text: "Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden und keinen Schaden anrichten. Sie werden entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert. Session-Cookies werden nach Ende Ihres Besuchs automatisch gelöscht. Permanente Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese selbst löschen oder eine automatische Löschung durch Ihren Webbrowser erfolgt.",
    
    server_logs_title: "Server-Log-Dateien",
    server_logs_text: "Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:",
    server_logs_items: [
      "Browsertyp und Browserversion",
      "Verwendetes Betriebssystem",
      "Referrer URL",
      "Hostname des zugreifenden Rechners",
      "Uhrzeit der Serveranfrage",
      "IP-Adresse"
    ],
    server_logs_legal: "Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Optimierung seiner Website – hierzu müssen die Server-Log-Files erfasst werden.",
    
    contact_title: "Kontaktformular und E-Mail-Kontakt",
    contact_text: "Wenn Sie uns per Kontaktformular oder E-Mail Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), sofern diese abgefragt wurde.",
    
    rights_title: "5. Ihre Rechte",
    rights_intro: "Sie haben bezüglich Ihrer personenbezogenen Daten folgende Rechte:",
    right_access: "Recht auf Auskunft: Sie haben das Recht, Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu erhalten.",
    right_rectification: "Recht auf Berichtigung: Sie haben das Recht, die Berichtigung unrichtiger personenbezogener Daten und die Vervollständigung unvollständiger personenbezogener Daten zu verlangen.",
    right_erasure: "Recht auf Löschung: Sie haben das Recht, die Löschung Ihrer personenbezogenen Daten unter bestimmten Voraussetzungen zu verlangen.",
    right_restriction: "Recht auf Einschränkung der Verarbeitung: Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten unter bestimmten Voraussetzungen zu verlangen.",
    right_portability: "Recht auf Datenübertragbarkeit: Sie haben das Recht, die Sie betreffenden personenbezogenen Daten in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten.",
    right_objection: "Widerspruchsrecht: Sie haben das Recht, der Verarbeitung Ihrer personenbezogenen Daten unter bestimmten Voraussetzungen zu widersprechen.",
    right_complaint: "Recht auf Beschwerde: Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen Datenschutzrecht verstößt.",
    
    contact_rights: "Zur Ausübung Ihrer Rechte wenden Sie sich bitte an:",
    
    last_updated: "Stand: Februar 2026"
  },
  it: {
    title: "Informativa sulla privacy",
    intro: "Prendiamo molto sul serio la protezione dei vostri dati personali. Trattiamo i vostri dati personali in modo confidenziale e in conformità con le normative legali sulla protezione dei dati e con questa informativa sulla privacy.",
    
    overview_title: "1. Protezione dei dati a colpo d'occhio",
    general_title: "Informazioni generali",
    general_text: "Le seguenti informazioni forniscono una semplice panoramica di cosa succede ai vostri dati personali quando visitate questo sito web. I dati personali sono tutti i dati con cui potete essere identificati personalmente.",
    
    collection_title: "Raccolta dati su questo sito web",
    responsible_question: "Chi è responsabile della raccolta dati su questo sito web?",
    responsible_answer: "Il trattamento dei dati su questo sito web è effettuato dal gestore del sito web. I dettagli di contatto del gestore si trovano nella sezione 'Informazioni sul responsabile' di questa informativa sulla privacy.",
    
    how_collect_question: "Come raccogliamo i vostri dati?",
    how_collect_answer: "I vostri dati vengono raccolti quando ce li fornite. Questi possono essere dati che inserite in un modulo di contatto, ad esempio. Altri dati vengono raccolti automaticamente o con il vostro consenso dai nostri sistemi IT quando visitate il sito web. Si tratta principalmente di dati tecnici (ad es. browser internet, sistema operativo o ora di visualizzazione della pagina). Questi dati vengono raccolti automaticamente non appena entrate in questo sito web.",
    
    purpose_question: "Per cosa utilizziamo i vostri dati?",
    purpose_answer: "Alcuni dati vengono raccolti per garantire la fornitura del sito web senza errori. Altri dati possono essere utilizzati per analizzare il vostro comportamento degli utenti.",
    
    rights_question: "Quali diritti avete riguardo ai vostri dati?",
    rights_answer: "Avete il diritto di ricevere gratuitamente informazioni sull'origine, il destinatario e lo scopo dei vostri dati personali memorizzati in qualsiasi momento. Avete anche il diritto di richiedere la correzione o la cancellazione di questi dati. Se avete dato il vostro consenso al trattamento dei dati, potete revocare questo consenso in qualsiasi momento per il futuro. Avete anche il diritto di richiedere la limitazione del trattamento dei vostri dati personali in determinate circostanze. Inoltre, avete il diritto di presentare un reclamo all'autorità di controllo competente.",
    
    hosting_title: "2. Hosting",
    hosting_text: "Questo sito web è ospitato sulla piattaforma base44. Il fornitore è Base44, Inc. Quando visitate questo sito web, l'host raccoglie e memorizza automaticamente varie informazioni nei cosiddetti file di log del server che il vostro browser trasmette automaticamente. Per i dettagli sulle pratiche di protezione dei dati dell'host, consultare:",
    
    controller_title: "3. Informazioni sul responsabile",
    controller_text: "Il responsabile del trattamento dei dati su questo sito web è:",
    controller_contact: "Per domande sulla protezione dei dati, contattateci all'indirizzo:",
    
    data_types_title: "4. Raccolta dati su questo sito web",
    cookies_title: "Cookie",
    cookies_text: "Il nostro sito web utilizza i cookie. I cookie sono piccoli file di testo che vengono memorizzati sul vostro dispositivo e non causano alcun danno. Vengono memorizzati temporaneamente per la durata di una sessione (cookie di sessione) o permanentemente (cookie permanenti) sul vostro dispositivo. I cookie di sessione vengono eliminati automaticamente alla fine della vostra visita. I cookie permanenti rimangono memorizzati sul vostro dispositivo fino a quando non li eliminate voi stessi o fino a quando non vengono eliminati automaticamente dal vostro browser web.",
    
    server_logs_title: "File di log del server",
    server_logs_text: "Il fornitore delle pagine raccoglie e memorizza automaticamente informazioni nei cosiddetti file di log del server, che il vostro browser trasmette automaticamente a noi. Questi sono:",
    server_logs_items: [
      "Tipo e versione del browser",
      "Sistema operativo utilizzato",
      "URL di riferimento",
      "Nome host del computer di accesso",
      "Ora della richiesta del server",
      "Indirizzo IP"
    ],
    server_logs_legal: "Questi dati non vengono uniti ad altre fonti di dati. La raccolta di questi dati si basa sull'art. 6 comma 1 lett. f GDPR. Il gestore del sito web ha un interesse legittimo nella presentazione tecnicamente priva di errori e nell'ottimizzazione del suo sito web - i file di log del server devono essere registrati a tale scopo.",
    
    contact_title: "Modulo di contatto e contatto via email",
    contact_text: "Se ci inviate richieste tramite modulo di contatto o email, i vostri dati dal modulo di richiesta, compresi i dati di contatto che avete fornito, saranno memorizzati da noi allo scopo di elaborare la richiesta e in caso di domande successive. Non condividiamo questi dati senza il vostro consenso. Il trattamento di questi dati si basa sull'art. 6 comma 1 lett. b GDPR se la vostra richiesta è correlata all'esecuzione di un contratto o è necessaria per eseguire misure precontrattuali. In tutti gli altri casi, il trattamento si basa sul nostro interesse legittimo nell'elaborazione efficace delle richieste che ci vengono inviate (art. 6 comma 1 lett. f GDPR) o sul vostro consenso (art. 6 comma 1 lett. a GDPR) se questo è stato richiesto.",
    
    rights_title: "5. I vostri diritti",
    rights_intro: "Avete i seguenti diritti riguardo ai vostri dati personali:",
    right_access: "Diritto di accesso: Avete il diritto di ricevere informazioni sui vostri dati personali da noi memorizzati.",
    right_rectification: "Diritto di rettifica: Avete il diritto di richiedere la correzione di dati personali inesatti e il completamento di dati personali incompleti.",
    right_erasure: "Diritto alla cancellazione: Avete il diritto di richiedere la cancellazione dei vostri dati personali in determinate condizioni.",
    right_restriction: "Diritto alla limitazione del trattamento: Avete il diritto di richiedere la limitazione del trattamento dei vostri dati personali in determinate condizioni.",
    right_portability: "Diritto alla portabilità dei dati: Avete il diritto di ricevere i dati personali che vi riguardano in un formato strutturato, di uso comune e leggibile da dispositivo automatico.",
    right_objection: "Diritto di opposizione: Avete il diritto di opporvi al trattamento dei vostri dati personali in determinate condizioni.",
    right_complaint: "Diritto di reclamo: Avete il diritto di presentare un reclamo a un'autorità di controllo se ritenete che il trattamento dei vostri dati personali violi la legge sulla protezione dei dati.",
    
    contact_rights: "Per esercitare i vostri diritti, contattateci all'indirizzo:",
    
    last_updated: "Ultimo aggiornamento: Febbraio 2026"
  },
  fr: {
    title: "Politique de confidentialité",
    intro: "Nous prenons très au sérieux la protection de vos données personnelles. Nous traitons vos données personnelles de manière confidentielle et conformément à la réglementation légale sur la protection des données et à cette politique de confidentialité.",
    
    overview_title: "1. Protection des données en un coup d'œil",
    general_title: "Informations générales",
    general_text: "Les informations suivantes fournissent un aperçu simple de ce qui arrive à vos données personnelles lorsque vous visitez ce site web. Les données personnelles sont toutes les données permettant de vous identifier personnellement.",
    
    collection_title: "Collecte de données sur ce site web",
    responsible_question: "Qui est responsable de la collecte des données sur ce site web?",
    responsible_answer: "Le traitement des données sur ce site web est effectué par l'exploitant du site web. Vous trouverez les coordonnées de l'exploitant dans la section 'Informations sur le responsable' de cette politique de confidentialité.",
    
    how_collect_question: "Comment collectons-nous vos données?",
    how_collect_answer: "Vos données sont collectées d'une part lorsque vous nous les communiquez. Il peut s'agir par exemple de données que vous saisissez dans un formulaire de contact. D'autres données sont collectées automatiquement ou avec votre consentement par nos systèmes informatiques lorsque vous visitez le site web. Il s'agit principalement de données techniques (par exemple, navigateur internet, système d'exploitation ou heure de consultation de la page). Ces données sont collectées automatiquement dès que vous entrez sur ce site web.",
    
    purpose_question: "À quoi utilisons-nous vos données?",
    purpose_answer: "Une partie des données est collectée pour garantir la fourniture du site web sans erreur. D'autres données peuvent être utilisées pour analyser votre comportement d'utilisateur.",
    
    rights_question: "Quels droits avez-vous concernant vos données?",
    rights_answer: "Vous avez le droit de recevoir gratuitement des informations sur l'origine, le destinataire et la finalité de vos données personnelles stockées à tout moment. Vous avez également le droit de demander la correction ou la suppression de ces données. Si vous avez donné votre consentement au traitement des données, vous pouvez révoquer ce consentement à tout moment pour l'avenir. Vous avez également le droit de demander la limitation du traitement de vos données personnelles dans certaines circonstances. En outre, vous avez le droit de déposer une plainte auprès de l'autorité de contrôle compétente.",
    
    hosting_title: "2. Hébergement",
    hosting_text: "Ce site web est hébergé sur la plateforme base44. Le fournisseur est Base44, Inc. Lorsque vous visitez ce site web, l'hébergeur collecte et stocke automatiquement diverses informations dans des fichiers journaux de serveur que votre navigateur transmet automatiquement. Pour plus de détails sur les pratiques de protection des données de l'hébergeur, veuillez consulter:",
    
    controller_title: "3. Informations sur le responsable",
    controller_text: "Le responsable du traitement des données sur ce site web est:",
    controller_contact: "Pour toute question concernant la protection des données, veuillez nous contacter à:",
    
    data_types_title: "4. Collecte de données sur ce site web",
    cookies_title: "Cookies",
    cookies_text: "Notre site web utilise des cookies. Les cookies sont de petits fichiers texte qui sont stockés sur votre appareil et ne causent aucun dommage. Ils sont stockés temporairement pour la durée d'une session (cookies de session) ou de manière permanente (cookies permanents) sur votre appareil. Les cookies de session sont automatiquement supprimés à la fin de votre visite. Les cookies permanents restent stockés sur votre appareil jusqu'à ce que vous les supprimiez vous-même ou jusqu'à ce qu'ils soient automatiquement supprimés par votre navigateur web.",
    
    server_logs_title: "Fichiers journaux du serveur",
    server_logs_text: "Le fournisseur des pages collecte et stocke automatiquement des informations dans des fichiers journaux de serveur, que votre navigateur nous transmet automatiquement. Il s'agit de:",
    server_logs_items: [
      "Type et version du navigateur",
      "Système d'exploitation utilisé",
      "URL de référence",
      "Nom d'hôte de l'ordinateur accédant",
      "Heure de la demande du serveur",
      "Adresse IP"
    ],
    server_logs_legal: "Ces données ne sont pas fusionnées avec d'autres sources de données. La collecte de ces données est basée sur l'art. 6 al. 1 lit. f RGPD. L'exploitant du site web a un intérêt légitime dans la présentation techniquement sans erreur et l'optimisation de son site web - les fichiers journaux du serveur doivent être enregistrés à cette fin.",
    
    contact_title: "Formulaire de contact et contact par email",
    contact_text: "Si vous nous envoyez des demandes via le formulaire de contact ou par email, vos données du formulaire de demande, y compris les données de contact que vous y avez fournies, seront stockées par nous dans le but de traiter la demande et en cas de questions de suivi. Nous ne partageons pas ces données sans votre consentement. Le traitement de ces données est basé sur l'art. 6 al. 1 lit. b RGPD si votre demande est liée à l'exécution d'un contrat ou est nécessaire pour effectuer des mesures précontractuelles. Dans tous les autres cas, le traitement est basé sur notre intérêt légitime dans le traitement efficace des demandes qui nous sont adressées (art. 6 al. 1 lit. f RGPD) ou sur votre consentement (art. 6 al. 1 lit. a RGPD) si celui-ci a été demandé.",
    
    rights_title: "5. Vos droits",
    rights_intro: "Vous avez les droits suivants concernant vos données personnelles:",
    right_access: "Droit d'accès: Vous avez le droit de recevoir des informations sur vos données personnelles que nous traitons.",
    right_rectification: "Droit de rectification: Vous avez le droit de demander la correction de données personnelles inexactes et la completion de données personnelles incomplètes.",
    right_erasure: "Droit à l'effacement: Vous avez le droit de demander l'effacement de vos données personnelles dans certaines conditions.",
    right_restriction: "Droit à la limitation du traitement: Vous avez le droit de demander la limitation du traitement de vos données personnelles dans certaines conditions.",
    right_portability: "Droit à la portabilité des données: Vous avez le droit de recevoir les données personnelles vous concernant dans un format structuré, couramment utilisé et lisible par machine.",
    right_objection: "Droit d'opposition: Vous avez le droit de vous opposer au traitement de vos données personnelles dans certaines conditions.",
    right_complaint: "Droit de déposer une plainte: Vous avez le droit de déposer une plainte auprès d'une autorité de contrôle si vous estimez que le traitement de vos données personnelles viole la loi sur la protection des données.",
    
    contact_rights: "Pour exercer vos droits, veuillez nous contacter à:",
    
    last_updated: "Dernière mise à jour: Février 2026"
  }
};

export default function Datenschutz() {
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
            <p className="text-gray-700">{t.intro}</p>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t.overview_title}</h2>
              
              <h3 className="text-xl font-semibold mb-3">{t.general_title}</h3>
              <p className="mb-4">{t.general_text}</p>

              <h3 className="text-xl font-semibold mb-3">{t.collection_title}</h3>
              
              <p className="font-semibold mb-2">{t.responsible_question}</p>
              <p className="mb-4">{t.responsible_answer}</p>

              <p className="font-semibold mb-2">{t.how_collect_question}</p>
              <p className="mb-4">{t.how_collect_answer}</p>

              <p className="font-semibold mb-2">{t.purpose_question}</p>
              <p className="mb-4">{t.purpose_answer}</p>

              <p className="font-semibold mb-2">{t.rights_question}</p>
              <p className="mb-4">{t.rights_answer}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t.hosting_title}</h2>
              <p className="mb-2">{t.hosting_text}</p>
              <p className="mb-2">
                <a href="https://base44.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  https://base44.com/privacy-policy
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t.controller_title}</h2>
              <p className="mb-2">{t.controller_text}</p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p>
                  Fullmo Drives GmbH<br />
                  Robert-Bosch-Straße 5<br />
                  88677 Markdorf<br />
                  Deutschland / Germany
                </p>
              </div>
              <p className="mb-2">{t.controller_contact}</p>
              <p>
                E-Mail: <a href="mailto:info@drives.fullmo.de" className="text-blue-600 hover:text-blue-800">info@drives.fullmo.de</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t.data_types_title}</h2>
              
              <h3 className="text-xl font-semibold mb-3">{t.cookies_title}</h3>
              <p className="mb-4">{t.cookies_text}</p>

              <h3 className="text-xl font-semibold mb-3">{t.server_logs_title}</h3>
              <p className="mb-2">{t.server_logs_text}</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                {t.server_logs_items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <p className="mb-4">{t.server_logs_legal}</p>

              <h3 className="text-xl font-semibold mb-3">{t.contact_title}</h3>
              <p className="mb-4">{t.contact_text}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t.rights_title}</h2>
              <p className="mb-4">{t.rights_intro}</p>
              <ul className="space-y-3 mb-4">
                <li><strong>{t.right_access.split(':')[0]}:</strong> {t.right_access.split(':')[1]}</li>
                <li><strong>{t.right_rectification.split(':')[0]}:</strong> {t.right_rectification.split(':')[1]}</li>
                <li><strong>{t.right_erasure.split(':')[0]}:</strong> {t.right_erasure.split(':')[1]}</li>
                <li><strong>{t.right_restriction.split(':')[0]}:</strong> {t.right_restriction.split(':')[1]}</li>
                <li><strong>{t.right_portability.split(':')[0]}:</strong> {t.right_portability.split(':')[1]}</li>
                <li><strong>{t.right_objection.split(':')[0]}:</strong> {t.right_objection.split(':')[1]}</li>
                <li><strong>{t.right_complaint.split(':')[0]}:</strong> {t.right_complaint.split(':')[1]}</li>
              </ul>
              <p className="mb-2">{t.contact_rights}</p>
              <p>
                E-Mail: <a href="mailto:info@drives.fullmo.de" className="text-blue-600 hover:text-blue-800">info@drives.fullmo.de</a>
              </p>
            </section>

            <div className="mt-8 pt-6 border-t text-sm text-gray-600">
              <p>{t.last_updated}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}