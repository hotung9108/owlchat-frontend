/**
 * Shared utility for showing browser/desktop notifications
 */
export const showBrowserNotification = (title: string, options?: NotificationOptions) => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(title, options);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, options);
      }
    });
  }
};
