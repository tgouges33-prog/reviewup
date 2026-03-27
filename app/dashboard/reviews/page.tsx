import ReviewsList from "./ReviewsList";

export default function ReviewsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Avis Google</h1>
        <p className="text-gray-500 text-sm mt-1">
          Gérez et répondez à vos avis avec l'IA adaptée à votre secteur
        </p>
      </div>
      <ReviewsList />
    </div>
  );
}
