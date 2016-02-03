# purescript-pux-boilerplate

Skeleton [Pux](https://github.com/alexmingoia/purescript-pux/) isomorphic
application with hot-reloading (using webpack, babel, and gulp).

See the
[Guide](http://www.alexmingoia.com/purescript-pux/index.html)
for help learning Pux.

## Installation

```sh
git clone git://github.com/alexmingoia/purescript-pux-boilerplate.git example
cd example
npm install
npm start
```

Visit `http://localhost:3000` in your browser, edit `src/purs/View/Layout.purs`
and watch the magic!

## Available tasks

### watch

`npm run watch` will start a development server, which hot-reloads your
application when sources changes.

### serve

Serves your application without watching for changes or hot-reloading. For
production, use `NODE_ENV=production npm run serve`.

### build

`npm run build` bundles and your application. For production, use
`NODE_ENV=production npm run build` to minify and exclude React dev tools.
