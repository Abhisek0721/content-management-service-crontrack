import * as dotenv from "dotenv";
dotenv.config();

export const DATABASE_NAME = process.env.DB_NAME;

export enum ROLES {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CONTENT_CREATOR = 'content-creator',
  ANALYST = 'analyst',
  VIEWER = 'viewer'
}

export const socialBaseUrl = {
  FACEBOOK: `https://graph.facebook.com`,
  INSTAGRAM: `https://graph.instagram.com`
}

export enum SOCIAL_MEDIA_PLATFORM {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  THREADS = 'threads',
  SNAPCHAT = 'snapchat',
  TIKTOK = 'tiktok',
  PINTEREST = 'pinterest',
  QUORA = 'quora',
  REDDIT = 'reddit',
  YOUTUBE = 'youtube'
}