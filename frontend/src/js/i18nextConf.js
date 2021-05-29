import i18n from "i18next";
import LngDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const config = require('../../config.json');

import Fetch from "i18next-fetch-backend";

i18n
    .use(LngDetector) //language detector
    .use(Fetch)
    .use(initReactI18next)
    .init({
        backend: {
            loadPath: "/assets/locales/{{lng}}/{{ns}}.json",
            // path to post missing resources
            addPath: "locales/add/{{ns}}",
            // define how to stringify the data when adding missing resources
            stringify: JSON.stringify
        },
        detection: {
            // order and from where user language should be detected
            order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],

            // keys or params to lookup language from
            lookupQuerystring: 'lng',
            lookupCookie: 'lng',
            lookupLocalStorage: 'i18nextLng',
            lookupSessionStorage: 'i18nextLng',
            lookupFromPathIndex: 0,
            lookupFromSubdomainIndex: 0,

            // cache user language on
            caches: ['localStorage', 'cookie'],
            excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

            // optional expire and domain for set cookie
            cookieMinutes: 10,
            cookieDomain: config.domain,

            // optional htmlTag with lang attribute, the default is:
            htmlTag: document.documentElement,

            // optional set cookie options, reference:[MDN Set-Cookie docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
            cookieOptions: { path: '/', sameSite: 'strict' }
        },
        fallbackLng: "en",
        debug: false,
        initImmediate: false,
        react: {
            useSuspense: false
        }
    });

export default i18n;