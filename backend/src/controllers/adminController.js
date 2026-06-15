import { supabase } from '../config/database.js';
import { paginate, formatUserRow } from '../utils/helpers.js';

export async function getDashboard(req, res) {
  try {
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: totalContent } = await supabase
      .from('content')
      .select('*', { count: 'exact', head: true });

    const { count: activeSubscriptions } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: totalReviews } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true });

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { count: newUsers30d } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo);

    res.json({
      data: {
        totalUsers: totalUsers || 0,
        totalContent: totalContent || 0,
        activeSubscriptions: activeSubscriptions || 0,
        totalReviews: totalReviews || 0,
        newUsersLast30Days: newUsers30d || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

export async function getUsers(req, res) {
  try {
    const { from, to, page, limit } = paginate(req.query.page, req.query.limit);
    const search = req.query.search;

    let query = supabase
      .from('users')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`email.ilike.%${search}%,username.ilike.%${search}%,display_name.ilike.%${search}%`);
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch users', details: error.message });
    }

    res.json({
      data: (data || []).map(formatUserRow),
      pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) },
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

export async function updateUser(req, res) {
  try {
    const userId = parseInt(req.params.id, 10);
    const allowed = ['role', 'plan', 'display_name', 'avatar_url', 'email_verified'];
    const updates = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update user', details: error.message });
    }

    res.json({ user: formatUserRow(user) });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = parseInt(req.params.id, 10);

    await supabase.from('watch_history').delete().eq('user_id', userId);
    await supabase.from('watchlist').delete().eq('user_id', userId);
    await supabase.from('reviews').delete().eq('user_id', userId);
    await supabase.from('ratings').delete().eq('user_id', userId);
    await supabase.from('stream_logs').delete().eq('user_id', userId);
    await supabase.from('subscriptions').delete().eq('user_id', userId);
    await supabase.from('payment_methods').delete().eq('user_id', userId);
    await supabase.from('invoices').delete().eq('user_id', userId);
    await supabase.from('payment_failures').delete().eq('user_id', userId);

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete user', details: error.message });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

export async function moderateReview(req, res) {
  try {
    const reviewId = parseInt(req.params.id, 10);
    const { moderated } = req.body;

    if (typeof moderated !== 'boolean') {
      return res.status(400).json({ error: 'moderated must be boolean' });
    }

    const { data, error } = await supabase
      .from('reviews')
      .update({ moderated, updated_at: new Date().toISOString() })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to moderate review', details: error.message });
    }

    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

export async function getDMCA(req, res) {
  try {
    const { from, to, page, limit } = paginate(req.query.page, req.query.limit);

    const { data: reviews, count, error } = await supabase
      .from('reviews')
      .select('id, title, body, user_id, content_id, created_at, moderated', { count: 'exact' })
      .eq('moderated', false)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch reports', details: error.message });
    }

    res.json({
      data: (reviews || []).map((r) => ({
        id: r.id,
        title: r.title,
        body: r.body,
        userId: r.user_id,
        contentId: r.content_id,
        createdAt: r.created_at,
        moderated: r.moderated,
      })),
      pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) },
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
