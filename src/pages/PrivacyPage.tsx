// src/pages/PrivacyPage.tsx
// ah, snail! there's the bookworm...

import { motion } from 'framer-motion';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black/50 to-black py-24 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-dela-large text-4xl sm:text-5xl mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Datenschutzerklärung
          </h1>
        </motion.div>

        <div className="space-y-8 text-white/80">
          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Datenschutz auf einen Blick</h2>
            <h3 className="text-xl font-medium mb-2 text-white">Allgemeine Hinweise</h3>
            <p className="mb-4">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
            </p>
            <h3 className="text-xl font-medium mb-2 text-white">Datenerfassung auf dieser Website</h3>
            <p className="mb-4">
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Allgemeine Hinweise und Pflichtinformationen</h2>
            <h3 className="text-xl font-medium mb-2 text-white">Datenschutz</h3>
            <p className="mb-4">
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>
            <p className="mb-4">
              Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen.
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Datenerfassung auf dieser Website</h2>
            <h3 className="text-xl font-medium mb-2 text-white">Cookies</h3>
            <p className="mb-4">
              Diese Website verwendet Cookies. Das sind kleine Textdateien, die Ihr Webbrowser auf Ihrem Endgerät speichert. Cookies helfen uns dabei, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
            </p>
            <p className="mb-4">
              Einige Cookies sind "Session-Cookies". Solche Cookies werden nach Ende Ihrer Browser-Sitzung von selbst gelöscht. Hingegen bleiben andere Cookies auf Ihrem Endgerät bestehen, bis Sie diese selbst löschen. Solche Cookies helfen uns, Sie bei Rückkehr auf unserer Website wiederzuerkennen.
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Kontakt</h2>
            <p className="mb-4">
              Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen Daten, bei Auskünften, Berichtigung, Sperrung oder Löschung von Daten wenden Sie sich bitte an:
            </p>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="font-medium">Schusterjunge</p>
              <p>E-Mail: info@schusterjunge.space</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}