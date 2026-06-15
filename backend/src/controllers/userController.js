import { supabase } from '../config/database.js';
import { formatUserRow, formatContentRow } from '../utils/helpers.js';

export async function getProfile(req, res) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: formatUserRow(user) });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

export async function updateProfile(req, res) {
  try {
    const updates = {};
    if (req.body.displayName) updates.display_name = req.body.displayName;
    if (req.body.username) updates.username = req.body.username;
    if (req.body.avatarUrl) updates.avatar_url = req.body.avatarUrl;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update profile', details: error.message });
    }

    res.json({ user: formatUserRow(user) });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

export async function getUserStats(req, res) {
  try {
    const userId = req.user.id;

    const { count: watchlistCount } = await supabase
      .from('watchlist')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { count: historyCount } = await supabase
      .from('watch_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { count: reviewCount } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { count: ratingCount } = await supabase
      .from('ratings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    res.json({
      stats: {
        watchlistCount: watchlistCount || 0,
        historyCount: historyCount || 0,
        reviewCount: reviewCount || 0,
        ratingCount: ratingCount || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

export async function getWatchlist(req, res) {
  try {
    const { data, error } = await supabase
      .from('watchlist')
      .select('id, content_id, added_at')
      .eq('user_id', req.user.id)
      .order('added_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch watchlist', details: error.message });
    }

    const contentIds = (data || []).map((w) => w.content_id);

    let contentMap = {};
    if (contentIds.length > 0) {
      const { data: content } = await supabase
        .from('content')
        .select('*')
        .in('id', contentIds);

      if (content) {
        for (const c of content) {
          contentMap[c.id] = formatContentRow(c);
        }
      }
    }

    const items = (data || []).map((w) => ({
      id: w.id,
      addedAt: w.added_at,
      content: contentMap[w.content_id] || null,
    }));

    res.json({ data: items });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

export async function addToWatchlist(req, res) {
  try {
    const contentId = parseInt(req.body.content_id, 10);
    if (!contentId) {
      return res.status(400).json({ error: 'content_id is required' });
    }

    const { data: existing } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('content_id', contentId)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: 'Already in watchlist' });
    }

    const { data, error } = await supabase
      .from('watchlist')
      .insert({ user_id: req.user.id, content_id: contentId })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to add to watchlist', details: error.message });
    }

    res.status(201).json({ data: { id: data.id, contentId: data.content_id, addedAt: data.added_at } });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

export async function removeFromWatchlist(req, res) {
  try {
    const contentId = parseInt(req.params.contentId, 10);

    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', req.user.id)
      .eq('content_id', contentId);

    if (error) {
      return res.status(500).json({ error: 'Failed to remove from watchlist', details: error.message });
    }

    res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

export async function getHistory(req, res) {
  try {
    const { data, error } = await supabase
      .from('watch_history')
      .select('*')
      .eq('user_id', req.user.id)
      .order('watched_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch history', details: error.message });
    }

    const contentIds = [...new Set((data || []).map((h) => h.content_id).filter(Boolean))];
    let contentMap = {};
    if (contentIds.length > 0) {
      const { data: content } = await supabase
        .from('content')
        .select('id, title, poster_url, type')
        .in('id', contentIds);

      if (content) {
        for (const c of content) {
          contentMap[c.id] = c;
        }
      }
    }

    const items = (data || []).map((h) => ({
      id: h.id,
      contentId: h.content_id,
      episodeId: h.episode_id,
      positionSeconds: h.position_seconds,
      durationWatchedSeconds: h.duration_watched_seconds,
      completed: h.completed,
      qualityWatched: h.quality_watched,
      deviceType: h.device_type,
      watchedAt: h.watched_at,
      content: h.content_id ? contentMap[h.content_id] || null : null,
    }));

    res.json({ data: items });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

export async function updateProgress(req, res) {
  try {
    const contentId = parseInt(req.body.content_id, 10);
    const { position_seconds, duration_watched_seconds, completed, episode_id } = req.body;

    if (!contentId) {
      return res.status(400).json({ error: 'content_id is required' });
    }

    const { data: existing } = await supabase
      .from('watch_history')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('content_id', contentId)
      .maybeSingle();

    const payload = {
      position_seconds,
      duration_watched_seconds,
      completed: completed || false,
      watched_at: new Date().toISOString(),
    };
    if (episode_id) payload.episode_id = episode_id;

    if (existing) {
      const { data, error } = await supabase
        .from('watch_history')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: 'Failed to update progress', details: error.message });
      }

      return res.json({ data });
    }

    const { data, error } = await supabase
      .from('watch_history')
      .insert({ user_id: req.user.id, content_id: contentId, ...payload })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to save progress', details: error.message });
    }

    res.status(201).json({ data });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

export async function clearHistory(req, res) {
  try {
    const { error } = await supabase
      .from('watch_history')
      .delete()
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(500).json({ error: 'Failed to clear history', details: error.message });
    }

    res.json({ message: 'Watch history cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
