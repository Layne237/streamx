import bcrypt from 'bcryptjs';
import { supabase } from '../config/database.js';
import { generateToken } from '../config/auth.js';
import { formatUserRow } from '../utils/helpers.js';

export async function register(req, res) {
  try {
    const { email, password, username } = req.body;

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        username,
        display_name: username,
        role: 'user',
        plan: 'free',
        email_verified: false,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to create user', details: error.message });
    }

    const token = generateToken({ id: user.id, role: user.role });

    res.status(201).json({
      token,
      user: formatUserRow(user),
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken({ id: user.id, role: user.role });

    res.json({
      token,
      user: formatUserRow(user),
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

export async function me(req, res) {
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
