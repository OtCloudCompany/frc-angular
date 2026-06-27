import { TranslateService } from '@ngx-translate/core';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';
import { MetadataValue } from 'src/app/core/shared/metadata.models';

/**
 * Returns a single localized string value for a metadata field based on the user's selected language.
 * Falls back to untagged values or the first value found.
 */
export function getLocalizedMetadata(dso: DSpaceObject, field: string, translate: TranslateService): string {
  if (!dso) {
    return '';
  }
  const currentLang = translate.currentLang;
  return dso.firstMetadataValue(field, { language: currentLang })
    || dso.firstMetadataValue(field)
    || '';
}

/**
 * Returns a list of localized MetadataValue objects for a field (or fields) based on the user's selected language.
 * Falls back to untagged values or the entire list if no matches are found.
 */
export function getLocalizedMetadataList(dso: DSpaceObject, fields: string | string[], translate: TranslateService): MetadataValue[] {
  if (!dso) {
    return [];
  }
  const allValues = dso.allMetadata(fields);
  const currentLang = translate.currentLang;
  const matches = allValues.filter(val => val.language === currentLang);
  if (matches.length > 0) {
    return matches;
  }
  const untagged = allValues.filter(val => !val.language);
  return untagged.length > 0 ? untagged : allValues;
}
