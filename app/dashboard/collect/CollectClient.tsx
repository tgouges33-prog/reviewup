"use client";

import { useState, useEffect } from "react";

type ReviewLink = {
  id: string;
  slug: string;
  business_name: string;
  google_review_url: string;
  logo_url: string | null;
  primary_color: string | null;
  notification_email: string | null;
};

export default function CollectClient({
  initialLink,
  defaultBusinessName,
}: {
  initialLink: ReviewLink | null;
  defaultBusinessName: string;
}) {
  const [link, setLink] = useState<ReviewLink | null>(initialLink);
  const [businessName, setBusinessName] = useState(initialLink?.business_name ?? defaultBusinessName);
  const [googleUrl, setGoogleUrl] = useState(initialLink?.google_review_url ?? "");
  const [logoUrl, setLogoUrl] = useState(initialLink?.logo_url ?? "");
  const [primaryColor, setPrimaryColor] = useState(initialLink?.primary_color ?? "#667eea");
  const [notificationEmail, setNotificationEmail] = useState(initialLink?.notification_email ?? "");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ views: 0, qr: 0, link: 0, google: 0 });
  const [sendChannel, setSendChannel] = useState<"email" | "sms">("email");
  const [recipient, setRecipient] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ ok?: boolean; error?: string } | null>(null);

  useEffect(() => {
    if (!initialLink) return;
    fetch("/api/track")
      .then((r) => r.json())
      .then((data) => {
        const events = data.events ?? [];
        setStats({
          views: events.filter((e: any) => e.event_type === "view").length,
          qr: events.filter((e: any) => e.event_type === "view" && e.source === "qr").length,
          link: events.filter((e: any) => e.event_type === "view" && e.source === "link").length,
          google: events.filter((e: any) => e.event_type === "google_click").length,
        });
      });
  }, [initialLink]);

  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://reviewup-three.vercel.app";
  const collectUrl = link ? `${appUrl}/r/${link.slug}` : null;
  const qrUrl = collectUrl ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(collectUrl + "?src=qr")}` : null;

  async function handleSend() {
    if (!recipient.trim() || !collectUrl) return;
    setSending(true);
    setSendResult(null);
    const res = await fetch("/api/send-review-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: sendChannel,
        recipient: recipient.trim(),
        link_url: collectUrl,
        business_name: businessName,
      }),
    });
    const data = await res.json();
    setSendResult(data);
    if (data.ok) setRecipient("");
    setSending(false);
  }

  async function handleSave() {
    if (!businessName.trim()) return;
    setSaving(true);
    const res = await fetch("/api/review-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        business_name: businessName,
        google_review_url: googleUrl,
        logo_url: logoUrl || null,
        primary_color: primaryColor,
        notification_email: notificationEmail || null,
      }),
    });
    const data = await res.json();
    if (data.link) setLink(data.link);
    setSaving(false);
  }

  function handleCopy() {
    if (!collectUrl) return;
    navigator.clipboard.writeText(collectUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      {/* Configuration */}
      <div className="space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom de l'établissement</label>
              <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ex : Boulangerie Martin"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Lien Google avis
                <span className="text-gray-400 font-normal ml-1">(pour rediriger les ≥ 4 ★)</span>
              </label>
              <input type="url" value={googleUrl} onChange={(e) => setGoogleUrl(e.target.value)}
                placeholder="https://g.page/r/votre-fiche/review"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition" />
              <p className="text-xs text-gray-400 mt-1">Google Maps → votre fiche → "Demander des avis"</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email de notification
                <span className="text-gray-400 font-normal ml-1">(reçoit les avis négatifs ≤ 3 ★)</span>
              </label>
              <input type="email" value={notificationEmail} onChange={(e) => setNotificationEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition" />
            </div>
          </div>
        </div>

        {/* Marque blanche */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Personnalisation (marque blanche)</h2>
          <p className="text-xs text-gray-400 mb-4">Vos clients verront uniquement votre marque, pas ReviewUp.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">URL de votre logo</label>
              <input type="url" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://votre-site.com/logo.png"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition" />
              <p className="text-xs text-gray-400 mt-1">Hébergez votre logo sur votre site ou un service comme Cloudinary</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Couleur principale</label>
              <div className="flex items-center gap-3">
                <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-12 rounded-xl border border-gray-300 cursor-pointer p-1" />
                <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#667eea] transition" />
                <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: primaryColor }} />
              </div>
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving || !businessName.trim()}
          className="w-full py-3 rounded-full font-semibold text-sm text-white cursor-pointer hover:-translate-y-0.5 transition-all disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
          {saving ? "Enregistrement..." : link ? "Mettre à jour" : "Générer mon lien →"}
        </button>
      </div>

      {/* Lien + QR code + aperçu */}
      <div className="space-y-5">
        {!link ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center text-gray-400">
            <div className="text-5xl mb-4">💌</div>
            <p className="text-sm">Configurez votre établissement pour générer votre lien unique et QR code.</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Votre lien unique</h2>
              <div className="flex items-center gap-3 bg-[#f8f9ff] rounded-xl p-4 border border-[#667eea]/20">
                <p className="flex-1 text-sm text-[#667eea] font-medium truncate">{collectUrl}</p>
                <button onClick={handleCopy}
                  className="px-4 py-2 rounded-full text-sm font-medium text-white flex-shrink-0 cursor-pointer hover:-translate-y-0.5 transition-all"
                  style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
                  {copied ? "✓ Copié !" : "Copier"}
                </button>
              </div>
              <div className="flex gap-3 mt-3">
                <a href={`https://wa.me/?text=${encodeURIComponent(`Laissez-nous un avis : ${collectUrl}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center py-2.5 rounded-full text-sm border border-gray-200 text-gray-600 hover:border-[#667eea] hover:text-[#667eea] transition-all">
                  📲 WhatsApp
                </a>
                <a href={`mailto:?subject=Votre avis compte pour nous&body=Bonjour, merci de nous laisser un avis ici : ${collectUrl}`}
                  className="flex-1 text-center py-2.5 rounded-full text-sm border border-gray-200 text-gray-600 hover:border-[#667eea] hover:text-[#667eea] transition-all">
                  📧 Email
                </a>
              </div>
            </div>

            {/* Envoyer à un client */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Envoyer à un client</h2>
              <div className="flex gap-2 mb-4">
                {(["email", "sms"] as const).map((c) => (
                  <button key={c} onClick={() => { setSendChannel(c); setSendResult(null); }}
                    className={`flex-1 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                      sendChannel === c ? "border-[#667eea] text-[#667eea] bg-[#667eea]/5" : "border-gray-200 text-gray-500 hover:border-[#667eea]"
                    }`}>
                    {c === "email" ? "📧 Email" : "📱 SMS"}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type={sendChannel === "email" ? "email" : "tel"}
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder={sendChannel === "email" ? "client@exemple.com" : "06 12 34 56 78"}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#667eea] transition"
                />
                <button onClick={handleSend} disabled={sending || !recipient.trim()}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-white cursor-pointer hover:-translate-y-0.5 transition-all disabled:opacity-60 flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
                  {sending ? "..." : "Envoyer"}
                </button>
              </div>
              {sendResult?.ok && <p className="text-green-600 text-xs mt-2">✓ Envoyé avec succès !</p>}
              {sendResult?.error && <p className="text-red-500 text-xs mt-2">{sendResult.error}</p>}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
              <h2 className="font-semibold text-gray-900 mb-4">QR Code</h2>
              {qrUrl && <img src={qrUrl} alt="QR Code" className="w-40 h-40 mx-auto rounded-xl border border-gray-100" />}
              <p className="text-xs text-gray-400 mt-3 mb-4">À imprimer en caisse, sur une table ou à la réception</p>
              <a href={qrUrl ?? "#"} download="qr-code-avis.png"
                className="inline-block px-5 py-2.5 rounded-full text-sm font-medium text-white hover:-translate-y-0.5 transition-all"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
                Télécharger le QR code →
              </a>
            </div>

            {/* Stats performances */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Performances</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Visites totales", value: stats.views, icon: "👁️" },
                  { label: "Via QR code", value: stats.qr, icon: "📲" },
                  { label: "Via lien", value: stats.link, icon: "🔗" },
                  { label: "Clics Google", value: stats.google, icon: "⭐",
                    sub: stats.views > 0 ? `${Math.round((stats.google / stats.views) * 100)}% conversion` : null },
                ].map((s) => (
                  <div key={s.label} className="bg-[#f8f9ff] rounded-xl p-4 text-center">
                    <div className="text-xl mb-1">{s.icon}</div>
                    <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    {s.sub && <p className="text-xs text-[#667eea] font-medium mt-0.5">{s.sub}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Aperçu */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Aperçu de la page client</h2>
              <div className="rounded-xl p-6 text-center text-white text-sm font-medium" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}>
                <p className="font-bold text-lg">{businessName}</p>
                <p className="opacity-80 mt-1 text-sm">★ ★ ★ ★ ★</p>
                <p className="opacity-70 text-xs mt-2">Page de collecte d'avis</p>
              </div>
              <a href={collectUrl ?? "#"} target="_blank" rel="noopener noreferrer"
                className="block text-center text-xs text-[#667eea] hover:underline mt-3">
                Voir la page →
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
