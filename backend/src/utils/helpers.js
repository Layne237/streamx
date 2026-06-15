export function paginate(page = 1, limit = 20) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const from = (p - 1) * l;
  const to = from + l - 1;
  return { from, to, page: p, limit: l };
}

export function formatContentRow(row) {
  return {
    id: row.id,
    title: row.title,
    originalTitle: row.original_title,
    type: row.type,
    description: row.description,
    releaseYear: row.release_year,
    durationMinutes: row.duration_minutes,
    maturityRating: row.maturity_rating,
    posterUrl: row.poster_url,
    backdropUrl: row.backdrop_url,
    trailerUrl: row.trailer_url,
    ratingAvg: row.rating_avg ? parseFloat(row.rating_avg) : null,
    ratingCount: row.rating_count,
    isFeatured: row.is_featured,
    accessLevel: row.access_level,
    status: row.status,
    genres: row.genres || [],
    videoUrl: row.video_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function formatUserRow(row) {
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    role: row.role,
    plan: row.plan,
    emailVerified: row.email_verified,
    stripeCustomerId: row.stripe_customer_id,
    createdAt: row.created_at,
  };
}
