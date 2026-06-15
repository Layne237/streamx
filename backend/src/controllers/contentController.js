import { supabase } from '../config/database.js';
import { paginate, formatContentRow } from '../utils/helpers.js';

export async function getCatalog(req, res) {
  try {
    const { from, to, page, limit } = paginate(req.query.page, req.query.limit);
    const { type, genre, year, search, maturity, sort } = req.query;

    let query = supabase
      .from('content')
      .select('*', { count: 'exact' });

    if (type && (type === 'movie' || type === 'series')) {
      query = query.eq('type', type);
    }

    if (genre) {
      query = query.contains('genres', [genre]);
    }

    if (year) {
      query = query.eq('release_year', parseInt(year, 10));
    }

    if (maturity) {
      query = query.eq('maturity_rating', maturity);
    }

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (sort === 'rating') {
      query = query.order('rating_avg', { ascending: false, nullsFirst: false });
    } else if (sort === 'year') {
      query = query.order('release_year', { ascending: false });
    } else if (sort === 'title') {
      query = query.order('title', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, count, error } = await query.range(from, to);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch catalog', details: error.message });
    }

    res.json({
      data: (data || []).map(formatContentRow),
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

export async function getFeatured(req, res) {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('is_featured', true)
      .eq('status', 'published')
      .order('rating_avg', { ascending: false, nullsFirst: false })
      .limit(10);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch featured', details: error.message });
    }

    res.json({ data: (data || []).map(formatContentRow) });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

export async function getTrending(req, res) {
  try {
    const { from, to, page, limit } = paginate(req.query.page, req.query.limit);

    // Get view counts from watch_history in the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: recentViews } = await supabase
      .from('watch_history')
      .select('content_id')
      .gte('watched_at', sevenDaysAgo);

    // Build a view-count map in JS (Supabase JS client lacks GROUP BY)
    let viewCounts = {};
    if (recentViews) {
      for (const row of recentViews) {
        const key = row.content_id;
        if (key) viewCounts[key] = (viewCounts[key] || 0) + 1;
      }
    }

    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('status', 'published');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch trending', details: error.message });
    }

    // Score = recent views × 2 + rating_avg × 10
    const scored = (data || []).map((item) => {
      const views = viewCounts[item.id] || 0;
      const rating = item.rating_avg ? parseFloat(item.rating_avg) : 0;
      const score = views * 2 + rating * 10;
      return { ...item, _trendingScore: score };
    });

    scored.sort((a, b) => b._trendingScore - a._trendingScore);

    const paginated = scored.slice(from, to + 1);

    res.json({
      data: paginated.map(formatContentRow),
      pagination: { page, limit, total: scored.length, totalPages: Math.ceil(scored.length / limit) },
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

export async function getContentById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);

    const { data: content, error } = await supabase
      .from('content')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    const { data: seasons } = await supabase
      .from('seasons')
      .select('*')
      .eq('content_id', id)
      .order('season_number', { ascending: true });

    let episodes = [];
    if (seasons && seasons.length > 0) {
      const seasonIds = seasons.map((s) => s.id);
      const { data: eps } = await supabase
        .from('episodes')
        .select('*')
        .in('season_id', seasonIds)
        .order('episode_number', { ascending: true });

      episodes = eps || [];
    }

    res.json({
      data: {
        ...formatContentRow(content),
        seasons: (seasons || []).map((s) => ({
          id: s.id,
          seasonNumber: s.season_number,
          title: s.title,
          description: s.description,
          posterUrl: s.poster_url,
          episodes: episodes
            .filter((e) => e.season_id === s.id)
            .map((e) => ({
              id: e.id,
              episodeNumber: e.episode_number,
              title: e.title,
              description: e.description,
              durationMinutes: e.duration_minutes,
              thumbnailUrl: e.thumbnail_url,
              videoUrl: e.video_url,
            })),
        })),
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

export async function getEpisodes(req, res) {
  try {
    const contentId = parseInt(req.params.id, 10);

    const { data: seasons } = await supabase
      .from('seasons')
      .select('id, season_number, title')
      .eq('content_id', contentId)
      .order('season_number', { ascending: true });

    if (!seasons || seasons.length === 0) {
      return res.json({ data: [] });
    }

    const seasonIds = seasons.map((s) => s.id);

    const { data: episodes, error } = await supabase
      .from('episodes')
      .select('*')
      .in('season_id', seasonIds)
      .order('episode_number', { ascending: true });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch episodes', details: error.message });
    }

    const grouped = seasons.map((s) => ({
      id: s.id,
      seasonNumber: s.season_number,
      title: s.title,
      episodes: (episodes || [])
        .filter((e) => e.season_id === s.id)
        .map((e) => ({
          id: e.id,
          episodeNumber: e.episode_number,
          title: e.title,
          description: e.description,
          durationMinutes: e.duration_minutes,
          thumbnailUrl: e.thumbnail_url,
          videoUrl: e.video_url,
          createdAt: e.created_at,
        })),
    }));

    res.json({ data: grouped });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

export async function searchContent(req, res) {
  try {
    const q = req.query.q;
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: 'Search query "q" is required' });
    }

    const { from, to, page, limit } = paginate(req.query.page, req.query.limit);

    const { data, count, error } = await supabase
      .from('content')
      .select('*', { count: 'exact' })
      .or(`title.ilike.%${q}%,description.ilike.%${q}%,original_title.ilike.%${q}%`)
      .eq('status', 'published')
      .range(from, to);

    if (error) {
      return res.status(500).json({ error: 'Search failed', details: error.message });
    }

    res.json({
      data: (data || []).map(formatContentRow),
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
