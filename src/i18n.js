import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'Welcome to React': 'Welcome to React and react-i18next',
    },
  },
  fr: {
    translation: {
      editor: {
        action: {
          run: 'Générer',
        },
        menu: {
          file: {
            title: 'Fichier',
            items: {
              save: 'Sauvegarder',
              createCopy: 'Créer une copie',
            },
          },
          edit: {
            title: 'Edition',
            items: {
              undo: 'Annuler',
              redo: 'Rétablir',
            },
          },
          insert: {
            title: 'Insertion',
            items: {
              text: 'Texte',
            },
          },
          export: {
            title: 'Exporter',
            items: {
              text: 'Texte',
              html: 'HTML',
            },
          },
          help: {
            title: 'Aide',
          },
        },
        sidebar: {
          possibilities: 'possibilités',
        },
      },
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'fr',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
