import { supabase } from './lib/supabase';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);

  return Uint8Array.from(
    [...rawData].map(char => char.charCodeAt(0))
  );
}

export async function enablePushNotifications(userId) {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Push notifications are not supported by this browser.');
    }

    const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

    if (!publicKey) {
      throw new Error('VAPID public key is missing.');
    }

    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      throw new Error('Notification permission was not granted.');
    }

    const registration = await navigator.serviceWorker.ready;

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });
    }

    const subscriptionJSON = subscription.toJSON();

    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: userId,
        endpoint: subscriptionJSON.endpoint,
        p256dh: subscriptionJSON.keys.p256dh,
        auth: subscriptionJSON.keys.auth,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'endpoint'
      });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Push notification setup failed:', error);
    return { success: false, error: error.message };
  }
}