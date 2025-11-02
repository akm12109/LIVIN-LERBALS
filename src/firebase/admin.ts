
import { getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { credential } from "firebase-admin";

export const getAdminApp = (): App => {
  if (getApps().length > 0) {
    return getApp();
  }
  
  // When running in a Google Cloud environment (like Firebase App Hosting),
  // the SDK can automatically detect the project's credentials.
  return initializeApp();
};
