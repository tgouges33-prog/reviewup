import { createClient } from "@/lib/supabase/server";
import { getAccounts, getLocations } from "@/lib/gmb";
import Link from "next/link";

export default async function GmbConnectPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const providerToken = session?.provider_token;
  const isGoogleConnected = !!providerToken;

  let accounts = null;
  let locations = null;
  let gmbError = "";

  if (providerToken) {
    try {
      accounts = await getAccounts(providerToken);
      if (accounts?.accounts?.[0]?.name) {
        locations = await getLocations(providerToken, accounts.accounts[0].name);
      }
    } catch (e: any) {
      gmbError = e.message;
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Connexion Google My Business</h1>
        <p className="text-gray-500 text-sm mt-1">Connectez vos fiches GMB pour automatiser leur gestion</p>
      </div>

      {!isGoogleConnected ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 max-w-lg text-center">
          <div className="text-5xl mb-4">🔗</div>
          <h2 className="font-semibold text-gray-900 text-lg mb-2">Compte Google non connecté</h2>
          <p className="text-gray-500 text-sm mb-6">
            Connectez-vous avec Google pour accéder à vos fiches GMB et activer l'automatisation.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 rounded-full text-white font-semibold text-sm hover:-translate-y-0.5 transition-all"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
          >
            Se connecter avec Google →
          </Link>
        </div>
      ) : gmbError ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600 text-sm">
          Erreur GMB : {gmbError}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <span className="text-green-500 text-xl">✓</span>
            <p className="text-green-700 text-sm font-medium">Compte Google connecté avec accès GMB</p>
          </div>

          {locations?.locations?.length > 0 ? (
            <div>
              <h2 className="font-semibold text-gray-900 mb-4">Vos fiches détectées</h2>
              <div className="grid gap-4">
                {locations.locations.map((loc: any) => (
                  <div key={loc.name} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{loc.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {loc.storefrontAddress?.addressLines?.[0]}, {loc.storefrontAddress?.locality}
                      </p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">
                      Connectée
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center text-gray-500 text-sm">
              Aucune fiche GMB trouvée sur ce compte Google.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
