import { supabase } from '../config/database.js';
import { stripe, STRIPE_WEBHOOK_SECRET } from '../config/stripe.js';

const PLANS = [
  { id: 'free', name: 'Free', price: 0, features: ['SD quality', '1 device'] },
  { id: 'basic', name: 'Basic', price: 999, priceId: 'price_basic_monthly', features: ['HD quality', '2 devices'] },
  { id: 'premium', name: 'Premium', price: 1499, priceId: 'price_premium_monthly', features: ['4K UHD', '4 devices', 'Dolby Atmos'] },
];

export async function getPlans(req, res) {
  res.json({ data: PLANS });
}

export async function createCheckoutSession(req, res) {
  if (!stripe) {
    return res.status(503).json({ error: 'Payments not configured' });
  }

  try {
    const { planId } = req.body;
    const plan = PLANS.find((p) => p.id === planId);

    if (!plan || plan.price === 0) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const { data: user } = await supabase
      .from('users')
      .select('stripe_customer_id, email')
      .eq('id', req.user.id)
      .single();

    let customerId = user?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user?.email || `user-${req.user.id}@streamx.com`,
        metadata: { userId: String(req.user.id) },
      });
      customerId = customer.id;

      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', req.user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: plan.priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/settings?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/settings?payment=cancel`,
      metadata: { userId: String(req.user.id), planId },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create checkout session', details: err.message });
  }
}

export async function handleWebhook(req, res) {
  if (!stripe) {
    return res.status(503).json({ error: 'Payments not configured' });
  }

  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = parseInt(session.metadata.userId, 10);
        const planId = session.metadata.planId;
        const subscriptionId = session.subscription;

        if (userId && planId) {
          await supabase
            .from('users')
            .update({ plan: planId, subscription_id: subscriptionId })
            .eq('id', userId);

          await supabase.from('subscriptions').upsert({
            user_id: userId,
            stripe_subscription_id: subscriptionId,
            plan: planId,
            status: 'active',
            current_period_start: new Date(session.created * 1000).toISOString(),
          }, { onConflict: 'stripe_subscription_id' });

          await supabase.from('invoices').insert({
            user_id: userId,
            stripe_invoice_id: session.invoice || session.id,
            amount: session.amount_total ? session.amount_total / 100 : 0,
            currency: session.currency || 'usd',
            status: 'paid',
            paid_at: new Date().toISOString(),
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const userId = parseInt(invoice.metadata?.userId || '0', 10) ||
          parseInt(invoice.subscription_details?.metadata?.userId || '0', 10);

        if (userId && invoice.id) {
          await supabase.from('invoices').upsert({
            user_id: userId,
            stripe_invoice_id: invoice.id,
            amount: invoice.amount_paid ? invoice.amount_paid / 100 : 0,
            currency: invoice.currency || 'usd',
            status: 'paid',
            pdf_url: invoice.invoice_pdf || null,
            paid_at: new Date().toISOString(),
          }, { onConflict: 'stripe_invoice_id' });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const failInv = event.data.object;
        const failUserId = parseInt(failInv.metadata?.userId || '0', 10);

        if (failUserId) {
          await supabase.from('payment_failures').insert({
            user_id: failUserId,
            invoice_id: failInv.id,
            amount: failInv.amount_due ? failInv.amount_due / 100 : 0,
            currency: failInv.currency || 'usd',
            failure_code: failInv.last_payment_error?.code || null,
            failure_message: failInv.last_payment_error?.message || null,
          });
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const subUserId = parseInt(sub.metadata?.userId || '0', 10);

        if (subUserId) {
          const status = sub.status === 'active' || sub.status === 'trialing' ? 'active'
            : sub.status === 'past_due' ? 'past_due'
            : sub.status === 'canceled' ? 'canceled'
            : sub.status;

          await supabase
            .from('subscriptions')
            .update({
              status,
              current_period_end: sub.current_period_end
                ? new Date(sub.current_period_end * 1000).toISOString()
                : null,
              cancel_at_period_end: sub.cancel_at_period_end || false,
              canceled_at: sub.canceled_at
                ? new Date(sub.canceled_at * 1000).toISOString()
                : null,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', sub.id);

          if (sub.status === 'canceled' || sub.status === 'incomplete_expired') {
            await supabase
              .from('users')
              .update({ plan: 'free', subscription_id: null })
              .eq('id', subUserId);
          }
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (err) {
    res.status(500).json({ error: 'Webhook handler error', details: err.message });
  }
}

export async function getBillingPortal(req, res) {
  if (!stripe) {
    return res.status(503).json({ error: 'Payments not configured' });
  }

  try {
    const { data: user } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', req.user.id)
      .single();

    if (!user?.stripe_customer_id) {
      return res.status(400).json({ error: 'No billing account found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/settings`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create portal session', details: err.message });
  }
}

export async function cancelSubscription(req, res) {
  if (!stripe) {
    return res.status(503).json({ error: 'Payments not configured' });
  }

  try {
    const { data: user } = await supabase
      .from('users')
      .select('subscription_id')
      .eq('id', req.user.id)
      .single();

    if (!user?.subscription_id) {
      return res.status(400).json({ error: 'No active subscription' });
    }

    await stripe.subscriptions.update(user.subscription_id, {
      cancel_at_period_end: true,
    });

    await supabase
      .from('subscriptions')
      .update({ cancel_at_period_end: true, updated_at: new Date().toISOString() })
      .eq('stripe_subscription_id', user.subscription_id);

    res.json({ message: 'Subscription will be canceled at period end' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel subscription', details: err.message });
  }
}
