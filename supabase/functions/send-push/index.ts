
import { createClient } from 'npm:@supabase/supabase-js@2';
import webpush from 'npm:web-push@3.6.7';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')!;
const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')!;
const vapidSubject = Deno.env.get('VAPID_SUBJECT')!;

const webhookSecret = Deno.env.get('WEBHOOK_SECRET')!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

webpush.setVapidDetails(
  vapidSubject,
  vapidPublicKey,
  vapidPrivateKey
);

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (req.headers.get('x-webhook-secret') !== webhookSecret) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const payload = await req.json();
    const notification = payload.record;

    if (!notification?.user_id) {
      return new Response('Missing notification user_id', {
        status: 400
      });
    }

    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth')
      .eq('user_id', notification.user_id);

    if (error) throw error;

    if (!subscriptions?.length) {
      return Response.json({
        success: true,
        message: 'No push subscriptions found.'
      });
    }

    const message = JSON.stringify({
      title: notification.title || 'READMATE',
      body: notification.body || 'You have a new notification.',
      url: '/'
    });

    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.p256dh,
                auth: subscription.auth
              }
            },
            message
          );
        } catch (error) {
          const statusCode = error?.statusCode;

          if (statusCode === 404 || statusCode === 410) {
            await supabase
              .from('push_subscriptions')
              .delete()
              .eq('id', subscription.id);
          }

          throw error;
        }
      })
    );

    return Response.json({
      success: true,
      sent: results.filter((result) => result.status === 'fulfilled').length,
      failed: results.filter((result) => result.status === 'rejected').length
    });

  } catch (error) {
    console.error('Push notification error:', error);

    return Response.json(
      { error: error.message || 'Push delivery failed.' },
      { status: 500 }
    );
  }
});
