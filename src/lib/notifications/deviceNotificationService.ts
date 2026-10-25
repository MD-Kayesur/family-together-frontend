 "use client";

import { getBackendUrl } from "@/lib/apiConfig";
import { getAuthToken } from "@/lib/utils/cookieUtils";

/**
 * High-definition audio chime synthesizer using Web Audio API
 * Produces a soft, elegant two-tone chime (880Hz -> 1320Hz)
 * Completely self-contained with 0 external asset network dependencies.
 */
export function playNotificationChime() {
  if (typeof window === "undefined") return;

  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Tone 1: 880Hz (A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2: 1320Hz (E6) - higher chime 90ms later
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1320, now + 0.09);
    gain2.gain.setValueAtTime(0.15, now + 0.09);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.09);
    osc2.stop(now + 0.55);

    // Cleanup audio context after chime ends
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 800);
  } catch (err) {
    console.debug("AudioContext chime muted or prevented by browser policy:", err);
  }
}

/**
 * Checks if the browser supports notifications
 */
export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

/**
 * Returns current browser notification permission
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return "denied";
  return Notification.permission;
}

/**
 * Helper to convert URL-safe base64 string to Uint8Array for VAPID key
 */
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Requests device notification permission and registers push subscription
 */
export async function requestDeviceNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return "denied";

  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      // Register Service Worker for background push
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
          console.log("[Device Notifications] Service Worker registered with scope:", registration.scope);

          // Attempt to register Web Push Subscription with backend VAPID key
          registerPushSubscriptionWithBackend(registration).catch((err) => {
            console.debug("[Device Notifications] Push subscription sync notice:", err?.message);
          });
        } catch (swErr) {
          console.warn("[Device Notifications] SW register failed:", swErr);
        }
      }
    }

    return permission;
  } catch (err) {
    console.error("[Device Notifications] Permission request error:", err);
    return "denied";
  }
}

/**
 * Subscribes to Web Push and sends subscription to NestJS backend
 */
async function registerPushSubscriptionWithBackend(registration: ServiceWorkerRegistration) {
  try {
    const backendUrl = getBackendUrl();
    const token = getAuthToken();

    // 1. Fetch public VAPID key from backend
    const keyRes = await fetch(`${backendUrl}/family/chat/push-key`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!keyRes.ok) return;

    const { publicKey } = await keyRes.json();
    if (!publicKey) return;

    // 2. Subscribe with PushManager
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    // 3. Send subscription to backend
    const subJson = subscription.toJSON();
    if (subJson.endpoint && subJson.keys) {
      await fetch(`${backendUrl}/family/chat/push-subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: subJson.keys,
          userAgent: navigator.userAgent,
        }),
      });
      console.log("[Device Notifications] Successfully synced device push subscription with backend");
    }
  } catch (err: any) {
    console.debug("[Device Notifications] PushManager subscription notice:", err?.message);
  }
}

interface ShowNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  url?: string;
  conversationId?: string;
  playSound?: boolean;
}

/**
 * Triggers a native device notification banner with sound and click redirect
 */
export async function showDeviceNotification({
  title,
  body,
  icon = "/icon.png",
  url = "/user-dashboard?tab=messages",
  conversationId,
  playSound = true,
}: ShowNotificationOptions) {
  if (playSound) {
    playNotificationChime();
  }

  if (!isNotificationSupported() || Notification.permission !== "granted") {
    return;
  }

  try {
    const targetUrl = conversationId ? `${url}&convId=${conversationId}` : url;

    // 1. Try Service Worker showNotification if active
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && "showNotification" in reg) {
        await reg.showNotification(title, {
          body,
          icon,
          badge: "/icon.png",
          vibrate: [100, 50, 100],
          data: { url: targetUrl, conversationId },
          tag: `msg_${conversationId || "chat"}`,
          renotify: true,
        } as any);
        return;
      }
    }

    // 2. Fallback to standard window Notification
    const notif = new Notification(title, {
      body,
      icon,
      badge: "/icon.png",
      tag: `msg_${conversationId || "chat"}`,
    });

    notif.onclick = () => {
      window.focus();
      if (targetUrl) {
        window.location.href = targetUrl;
      }
      notif.close();
    };
  } catch (err) {
    console.warn("[Device Notifications] Error displaying notification:", err);
  }
}
