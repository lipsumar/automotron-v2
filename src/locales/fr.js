export default {
  translation: {
    register: {
      title: 'Créer un compte',
      error: {
        invalidEmail: 'L’email n’est pas valide',
        passwordTooShort: 'Le mot de passe est trop court',
        registerFailed: 'Une erreur s’est produite',
        emailAlreadyExist: 'Un compte existe déjà pour cet email',
      },
      button: {
        createAccount: 'Créer un compte',
        login: 'Connexion',
      },
      field: {
        email: 'Email',
        password: 'Mot de passe',
      },
    },
    login: {
      title: 'Connexion',
      error: {
        loginFailed: 'Une erreur s’est produite',
        wrongCredentials: 'Email ou mot de passe invalide',
      },
      button: {
        createAccount: 'Créer un compte',
        login: 'Connexion',
      },
      field: {
        email: 'Email',
        password: 'Mot de passe',
      },
      link: {
        forgotPassword: 'Mot de passe oublié?',
      },
    },
    editor: {
      forkTitlePrepend: 'copie',
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
            fork: 'Créer une copie',
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
            text: 'Bloc',
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
          items: {
            documentation: 'Documentation',
          },
        },
      },
      sidebar: {
        possibility: 'possibilité',
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
        unfreeze: 'Dégeler',
        deleteNode: 'Supprimer',
        createNode: 'Ajouter un bloc',
        centerGraph: 'Ajuster à l’écran',
      },
    },
  },
};
