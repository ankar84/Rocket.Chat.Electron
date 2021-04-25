import i18next from 'i18next';

import { interpolation } from './interpolation';
import resources, { fallbackLng } from './resources';

const hasTranslationLanguage = (lng: string): lng is keyof typeof resources =>
  lng in resources;

const getTranslationLanguage = (
  locale: string
): keyof typeof resources | undefined => {
  let [languageCode, countryCode] = locale.split(/[-_]/) as [
    string,
    string | undefined
  ];
  if (!languageCode || languageCode.length !== 2) {
    return fallbackLng;
  }

  languageCode = languageCode.toLowerCase();

  if (!countryCode || countryCode.length !== 2) {
    countryCode = undefined;
  } else {
    countryCode = countryCode.toUpperCase();
  }

  const lng = countryCode ? `${languageCode}-${countryCode}` : languageCode;

  if (hasTranslationLanguage(lng)) {
    return lng;
  }

  return undefined;
};

export const initializeI18next = async (locale: string): Promise<void> => {
  const lng = getTranslationLanguage(locale);

  await i18next.init({
    lng,
    fallbackLng,
    resources: {
      ...(lng &&
        lng in resources && {
          [lng]: {
            translation: await resources[lng](),
          },
        }),
      [fallbackLng]: {
        translation: await resources[fallbackLng](),
      },
    },
    interpolation,
    initImmediate: true,
  });
};
