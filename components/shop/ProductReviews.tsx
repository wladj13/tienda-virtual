'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: Date;
  user: { name: string | null; email: string };
}

export function ProductReviews({ productId, reviews }: { productId: string; reviews: Review[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayedReviews = showAll ? reviews : reviews.slice(0, 5);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Reseñas de clientes</h2>

      {reviews.length === 0 ? (
        <p className="text-slate-600">Aún no hay reseñas para este producto.</p>
      ) : (
        <div className="space-y-6">
          {displayedReviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">
                  {review.user.name || review.user.email.split('@')[0]}
                </span>
                <span className="text-sm text-slate-500">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: es })}
                </span>
              </div>
              {review.title && <h3 className="font-medium">{review.title}</h3>}
              {review.comment && <p className="mt-1 text-slate-600">{review.comment}</p>}
            </div>
          ))}

          {reviews.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              {showAll ? 'Mostrar menos' : `Ver las ${reviews.length} reseñas`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
