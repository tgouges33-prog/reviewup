"use client";

import { useState } from "react";
import ReviewsList from "./ReviewsList";
import FeedbacksList from "./FeedbacksList";

const TABS = [
  { key: "google", label: "⭐ Avis Google", desc: "Répondez à vos avis avec l'IA" },
  { key: "feedbacks", label: "🔒 Feedbacks privés", desc: "Avis collectés via votre lien" },
];

export default function ReviewsTabsClient() {
  const [tab, setTab] = useState<"google" | "feedbacks">("google");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Avis & Feedbacks</h1>
        <p className="text-gray-500 text-sm mt-1">
          {tab === "google" ? "Gérez et répondez à vos avis avec l'IA" : "Feedbacks privés collectés via votre lien unique"}
        </p>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as "google" | "feedbacks")}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer -mb-px ${
              tab === t.key
                ? "border-[#667eea] text-[#667eea]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "google" && <ReviewsList />}
      {tab === "feedbacks" && <FeedbacksList />}
    </div>
  );
}
