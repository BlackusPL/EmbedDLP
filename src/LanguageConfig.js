import path from 'node:path';
import i18n from 'i18n';
import "dotenv/config";

i18n.configure({
  locales: ['en', 'pl'],
  directory: path.join(import.meta.dirname, '../locales'),
  defaultLocale: process.env.DEFAULT_LOCALE || 'en',
  objectNotation: true
})

export default i18n;