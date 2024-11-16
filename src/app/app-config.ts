import { CoreConfig } from '@core/types';

/**
 * Default App Config
 *
 * ? TIP:
 *
 * Change app config based on your preferences.
 * You can also change them on each component basis. i.e `app/main/pages/authentication/auth-login-v1/auth-login-v1.component.ts`
 *
 * ! IMPORTANT: If the enableLocalStorage option is true then make sure you clear the browser local storage(https://developers.google.com/web/tools/chrome-devtools/storage/localstorage#delete).
 *  ! Otherwise, it will not take the below config changes and use stored config from local storage.
 *
 */

// prettier-ignore
export const coreConfig: CoreConfig = {
  app: {
    appName: 'Safety Point Academy',
    appTitle: 'Safety Point Academy',
    appLogoImage: 'assets/images/logo/logo1.svg',
    appLanguage: 'en',
  },
  layout: {
    skin: 'semi-dark',
    type: 'vertical',
    animation: 'fadeIn',
    menu: {
      hidden: false,
      collapsed: false,
    },
    navbar: {
      hidden: false,
      type: 'fixed-top',
      background: 'navbar-light',
      customBackgroundColor: true,
      backgroundColor: ''
    },
    footer: {
      hidden: false,
      type: 'footer-sticky',
      background: 'footer-light',
      customBackgroundColor: false,
      backgroundColor: ''
    },
    enableLocalStorage: true,
    customizer: false,
    scrollTop: false,
    buyNow: false
  }
}
