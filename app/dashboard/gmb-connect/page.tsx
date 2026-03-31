import { createClient } from "@/lib/supabase/server";
import { getAccounts, getLocations } from "@/lib/gmb";
import Link from "next/link";
import ReconnectGoogleButton from "@/components/ReconnectGoogleButton";

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
      // "no GMB account" is not a real error — just no listings on this Google account
      const msg = e.message ?? "";
      if (!msg.includes("404") && !msg.includes("403")) {
        gmbError = msg;
      }
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
          <ReconnectGoogleButton label="Se connecter avec Google →" />
        </div>
      ) : gmbError ? (
        <div className="bg-white rounded-xl border border-orange-200 shadow-sm p-8 text-center max-w-lg">
          <div className="text-4xl mb-3">🔄</div>
          <p className="font-semibold text-gray-900 mb-1">Session Google expirée</p>
          <p className="text-sm text-gray-500 mb-4">Reconnectez-vous avec Google pour accéder à vos fiches GMB.</p>
          <ReconnectGoogleButton />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <span className="text-green-500 text-xl">✓</span>
            <p className="text-green-700 text-sm font-medium">Compte Google connecté avec accès GMB</p>
          </div>

          {!accounts?.accounts?.length ? (
            <div className="bg-white rounded-xl border border-orange-200 shadow-sm p-6 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="font-semibold text-gray-900 mb-1">Aucune fiche GMB sur ce compte</p>
              <p className="text-sm text-gray-500 mb-4">
                Ce compte Google n'a pas de fiche Google My Business associée.<br/>
                Connectez-vous avec le compte Google lié à votre établissement.
              </p>
              <Link
                href="/login"
                className="inline-block px-5 py-2.5 rounded-full text-white text-sm font-medium"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
              >
                Changer de compte Google →
              </Link>
            </div>
          ) : locations?.locations?.length > 0 ? (
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
