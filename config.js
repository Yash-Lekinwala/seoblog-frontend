import getConfig from "next/config";
const {publicRuntimeConfig} = getConfig();

export const API = publicRuntimeConfig.PRODUCTION ? 'https://website.com' : publicRuntimeConfig.API_DEVELOPMENT;
export const APP_NAME = publicRuntimeConfig.APP_NAME;
export const DOMAIN = publicRuntimeConfig.PRODUCTION ? '' : publicRuntimeConfig.DOMAiN_DEVELOPMENT;
export const DISQUS_SHORTNAME = publicRuntimeConfig.DISQUS_SHORTNAME;
export const GOOGLE_CLIENT_ID = publicRuntimeConfig.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = publicRuntimeConfig.GOOGLE_CLIENT_SECRET;