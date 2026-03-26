const stats = [
  { value: "500+", label: "Entreprises satisfaites" },
  { value: "+45%", label: "Avis en 3 mois (moyenne)" },
  { value: "4.8/5", label: "Notre notation" },
  { value: "24/7", label: "Automatisation active" },
];

export default function Stats() {
  return (
    <section
      className="py-16 px-5 text-white"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-extrabold mb-1">{s.value}</p>
              <p className="text-sm opacity-90">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
