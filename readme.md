# VEZUBR.

### Setup and Run:

1. install NodeJs and npm `https://nodejs.org/en/`
2. `npm install` Install all dependencies
3. `npm run dev` Bundle application, create virtual server and run. By default app will run on `http://vezubr.local:5001`

### PRODUCTION DEPLOY

1. run command `npm run production`
2. For bundling producer app run command `npm run production-producer`
   It will bundle app on production mode and set `ENV` to production
   All sources will be avialable in `dist` folder for using app you
   should point app to dist folder

### Structure

Main application structure in `src` folder.

- `main.jsx` Application runner/routes definition.
- `Pages` (Each view main controller/component will be here). Each of theme will contain one `assignTransortToOrder.jsx, index.scss`
  _ LoginView
  _ FieldView
- `Reducers` for storing data like ``. Main files are
  _ `defaultStore.jsx`
  _ `assignTransortToOrder.jsx`
- `Services` \* `Api`
- `Components` Re-usable parts which can easy used in other views.
  _ `Map`
  _ `Sidebar`
- `Common` useful thing for application
  _ `axiosWrapper` Wrapper for (axios: HTTP Client `https://github.com/axios/axios`)
  _ `Cooikes`
  _ `Store` Redux Store main constructor
  _ `Utils`

### Technologies:

- NodeJs v.8.5+
- JavaScript (ES6/ES7)
- ReactJs (frontend)
- WebPack (bundling React)
- Redux (React component) index/state handling
