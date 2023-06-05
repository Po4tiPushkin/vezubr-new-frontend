const list = {
  /*registration: {
		en: {
			...require('./i18n/registration/en.json')
		},
		ru: {
			...require('./i18n/registration/ru.json')
		}
	},
	login: {
		en: {
			...require('./i18n/login/en.json')
		},
		ru: {
			...require('./i18n/login/ru.json')
		}
	},
	errors: {
		en: {
			...require('./i18n/errors/en.json')
		},
		ru: {
			...require('./i18n/errors/ru.json')
		}
	},
	nav: {
		en: {
			...require('./i18n/nav/en.json')
		},
		ru: {
			...require('./i18n/nav/ru.json')
		}
	},
	order: {
		en: {
			...require('./i18n/order/en.json')
		},
		ru: {
			...require('./i18n/order/ru.json')
		}
	},
	buttons: {
		en: {
			...require('./i18n/buttons/en.json')
		},
		ru: {
			...require('./i18n/buttons/ru.json')
		}
	},
	common: {
		en: {
			...require('./i18n/common/en.json')
		},
		ru: {
			...require('./i18n/common/ru.json')
		}
	},
	profile: {
		en: {
			...require('./i18n/profile/en.json')
		},
		ru: {
			...require('./i18n/profile/ru.json')
		}
	},
	bills: {
		en: {
			...require('./i18n/bills/en.json')
		},
		ru: {
			...require('./i18n/bills/ru.json')
		}
	},
	settings: {
		en: {
			...require('./i18n/settings/en.json')
		},
		ru: {
			...require('./i18n/settings/ru.json')
		}
	},
	driver: {
		en: {
			...require('./i18n/driver/en.json')
		},
		ru: {
			...require('./i18n/driver/ru.json')
		}
	},
	loader: {
		en: {
			...require('./i18n/loader/en.json')
		},
		ru: {
			...require('./i18n/loader/ru.json')
		}
	},
<<<<<<< HEAD
	transports:{
		en:{
			...require('./i18n/transports/en.json')
		},
		ru:{
			...require('./i18n/transports/ru.json')
		}
	},
=======
	trailer: {
		en: {
			...require('./i18n/trailer/en.json')
		},
		ru: {
			...require('./i18n/trailer/ru.json')
		}
	},*/
};

const arr = [
  'registration',
  'login',
  'errors',
  'nav',
  'order',
  'cargo',
  'driver',
  'buttons',
  'common',
  'profile',
  'bills',
  'settings',
  'loader',
  'trailer',
  'tractors',
  'transports',
  'registries',
  'map',
  'documents',
  'uiStates',
  'problems',
  'clients',
  'cartulary',
  'address',
  'tariff',
];

for (const a of arr) {
  list[a] = {
    en: {
      ...require(`./i18n/${a}/en.json`),
    },
    ru: {
      ...require(`./i18n/${a}/ru.json`),
    },
  };
}

export default list;
