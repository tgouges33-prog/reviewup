export default function Examples() {
  return (
    <section className="py-20 px-5 bg-white" id="examples">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-5">Voyez le résultat en direct</h2>
            <p className="text-gray-500 mb-4 leading-relaxed">
              Votre fiche Google My Business optimisée automatiquement. ReviewUp travaille
              24/7 pour maximiser votre visibilité locale et augmenter vos avis naturels.
            </p>
            <p className="mb-3">
              <strong>✓ Optimisation automatique du contenu</strong>
              <br />
              <span className="text-gray-500 text-sm">Images, descriptions, horaires synchronisés</span>
            </p>
            <p className="mb-3">
              <strong>✓ Collecte d'avis intelligente</strong>
              <br />
              <span className="text-gray-500 text-sm">Invitation automatique des clients satisfaits</span>
            </p>
            <p>
              <strong>✓ Réponses IA professionnelles</strong>
              <br />
              <span className="text-gray-500 text-sm">Générez des réponses pertinentes en quelques secondes</span>
            </p>
          </div>

          {/* GMB card mockup */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg">
            <div className="flex gap-4 mb-5">
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
              >
                🍕
              </div>
              <div>
                <h3 className="font-bold text-base">La Bella Pizzeria</h3>
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mt-1">
                  <span>★★★★★</span>
                  <span className="text-gray-600">4.9 (127 avis)</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 text-sm text-gray-500 flex-wrap">
              <span>📍 Paris 15e</span>
              <span>📞 01 23 45 67 89</span>
              <span>🌐 Site web</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
