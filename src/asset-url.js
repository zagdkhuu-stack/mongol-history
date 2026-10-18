// Public assets need the project prefix on GitHub Pages, including URLs built in JS.
export const assetUrl=path=>path.startsWith('/assets/')?`${import.meta.env.BASE_URL}${path.slice(1)}`:path;
