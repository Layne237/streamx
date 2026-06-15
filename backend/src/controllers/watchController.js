import { supabase } from '../config/database.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const STREAM_TOKEN_SECRET = process.env.JWT_SECRET + ':stream';

function generateStreamToken(payload) {
  return jwt.sign(payload, STREAM_TOKEN_SECRET, { expiresIn: '4h' });
}

export async function getWatchToken(req, res) {
  try {
    const contentId = parseInt(req.params.id, 10);
    const episodeId = req.query.episode_id ? parseInt(req.query.episode_id, 10) : null;

    const { data: content, error } = await supabase
      .from('content')
      .select('id, title, type, video_url')
      .eq('id', contentId)
      .single();

    if (error || !content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    let hlsUrl = content.video_url;

    if (episodeId) {
      const { data: episode } = await supabase
        .from('episodes')
        .select('video_url')
        .eq('id', episodeId)
        .single();

      if (episode && episode.video_url) {
        hlsUrl = episode.video_url;
      }
    }

    const { data: stream } = await supabase
      .from('video_streams')
      .select('hls_url, quality')
      .eq('content_id', contentId)
      .eq('encoding_status', 'ready')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (stream && stream.hls_url) {
      hlsUrl = stream.hls_url;
    }

    const streamToken = generateStreamToken({
      userId: req.user.id,
      contentId,
      episodeId,
      iat: Math.floor(Date.now() / 1000),
    });

    await supabase.from('stream_logs').insert({
      user_id: req.user.id,
      content_id: contentId,
      episode_id: episodeId,
      ip: req.ip,
      user_agent: req.headers['user-agent'] || null,
      started_at: new Date().toISOString(),
    });

    res.json({
      token: streamToken,
      url: hlsUrl || null,
      expiresIn: '4h',
      contentId,
      episodeId,
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

export async function reportProgress(req, res) {
  try {
    const contentId = parseInt(req.params.id, 10);
    const { position_seconds, duration_seconds, quality } = req.body;

    if (!position_seconds) {
      return res.status(400).json({ error: 'position_seconds is required' });
    }

    const { data: existing } = await supabase
      .from('watch_history')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('content_id', contentId)
      .maybeSingle();

    const payload = {
      position_seconds,
      duration_watched_seconds: position_seconds,
      completed: duration_seconds ? position_seconds >= duration_seconds : false,
      quality_watched: quality || null,
      watched_at: new Date().toISOString(),
    };

    if (existing) {
      await supabase.from('watch_history').update(payload).eq('id', existing.id);
    } else {
      await supabase.from('watch_history').insert({
        user_id: req.user.id,
        content_id: contentId,
        ...payload,
      });
    }

    res.json({ message: 'Progress updated' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
