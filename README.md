# React/Typescript/Babel/Webpack/ESLint boilerplate

A small starter package for React apps, including

- Webpack incl. webpack-dev-server for local development
- React with hot module replacement and styled components
- Typescript and Babel
- ESLint/Prettier config

## How to use it

To start the development build:

```
yarn start
```

To create a production build:

```
yarn build
```

Environment specific values can be set in `config/.env[local/production]` and used in code like

```
const { CONFIG_VALUE } = process.env
```
