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
        message: {
          saveNeeded: 'Veuillez sauvegarder le generateur.',
        },
        prompt: {
          generatorTitle: 'Titre du générateur',
          setNodeTitle: 'Titre',
          unsavedChanges:
            '⚠️ Les dernières modifications ne sont pas sauvées !\nÊtes vous sûr de vouloir continuer ?',
        },
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
              text: 'Format texte',
              html: 'Format HTML',
              json: 'Format JSON',
            },
          },
          help: {
            title: 'Aide',
          },
        },
        sidebar: {
          possibilities: 'possibilités',
        },
        contextMenu: {
          insertNode: 'Insérer un bloc',
          addSpace: 'Ajouter un espace',
          deleteEdge: 'Supprimer le câble',
          setTitle: 'Ajouter un titre',
          linkToGenerator: 'Connecter au générateur',
          agreementLink: 'Connection d’accord',
          freeze: 'Geler',
          deleteNode: 'Supprimer',
          createNode: 'Ajouter un bloc',
          centerGraph: 'Ajuster à l’écran',
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
