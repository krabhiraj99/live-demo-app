const path = require('path');
const fs = require('fs');

const DYNAMIC_ROUTE_REGEX = /^\/([:*])/

const packageJson = require('../package.json');

const isCiCd = process.env.BITBUCKET_BRANCH !== undefined;

const scanDir = (dirName, routes = []) => {
    const folderContents = fs.readdirSync(path.resolve(__dirname, dirName));
    for (const fileName of folderContents) {
        if (fileName.endsWith('.vue')) {
            routes.push(dirName + '/' + fileName);
        }
        else {
            scanDir(dirName + '/' + fileName, routes);
        }
    }
    return routes;
}

const sortRoutes = (routes) => {
    routes.sort((a, b) => {
      if (!a.path.length) {
        return -1
      }
      if (!b.path.length) {
        return 1
      }
      // Order: /static, /index, /:dynamic
      // Match exact route before index: /login before /index/_slug
      if (a.path === '/') {
        return DYNAMIC_ROUTE_REGEX.test(b.path) ? -1 : 1
      }
      if (b.path === '/') {
        return DYNAMIC_ROUTE_REGEX.test(a.path) ? 1 : -1
      }
      let i
      let res = 0
      let y = 0
      let z = 0
      const _a = a.path.split('/')
      const _b = b.path.split('/')
      for (i = 0; i < _a.length; i++) {
        if (res !== 0) {
          break
        }
        y = _a[i] === '*' ? 2 : _a[i].includes(':') ? 1 : 0
        z = _b[i] === '*' ? 2 : _b[i].includes(':') ? 1 : 0
        res = y - z
        // If a.length >= b.length
        if (i === _b.length - 1 && res === 0) {
          // unless * found sort by level, then alphabetically
          res = _a[i] === '*' ? -1 : (
            _a.length === _b.length ? a.path.localeCompare(b.path) : (_a.length - _b.length)
          )
        }
      }
      if (res === 0) {
        // unless * found sort by level, then alphabetically
        res = _a[i - 1] === '*' && _b[i] ? 1 : (
          _a.length === _b.length ? a.path.localeCompare(b.path) : (_a.length - _b.length)
        )
      }
      return res
    })
    routes.forEach((route) => {
      if (route.children) {
        sortRoutes(route.children)
      }
    })
    return routes
  }

const getRoutes = () => {
    const root = isCiCd ? '../dist/' : '../src/';
    const dirs = scanDir(root + 'pages');
    const routes = [];
    const paths = [];
    dirs.forEach(route => {

        const routeDetail = {
            name: packageJson.vinceLiveApp.name,
            component: '', // v3 has `file`, v2 has `component`
            path: ''
        };

        let routeParts = route.replace(root, '').split('/').map(r => r.replace('_', ':'));
        const fileName = routeParts[routeParts.length - 1];
        routeParts = routeParts.filter(r => r !== 'pages');
        if (fileName.endsWith('.vue')) {
            if (fileName === 'index.vue') {
                routeParts.pop();
            } else {
                routeParts[routeParts.length - 1] = fileName.replace('.vue', '');
            }
        }
        routeDetail.name += '_' + routeParts.join('_').replace(/:/g, '');
        routeDetail.path = `/${packageJson.vinceLiveApp.basePath}/${packageJson.vinceLiveApp.name}/${routeParts.join('/')}`;
        // routes need to be based on local vs CI/CD
        routeDetail.component = isCiCd
            ? 'node_modules/' + packageJson.name + '/' + route.replace('../', '') // node_modules/apps-vince-test-app1/dist/xx
            : path.resolve(__dirname, route); // local paths
        routes.push(routeDetail);
        // paths that will be used to include in esbuild
        paths.push(path.resolve(__dirname, route));
    });
    return {routes: sortRoutes(routes), paths};
}

(async () => {
    const { routes } = getRoutes();
    fs.writeFileSync('./routes.json', JSON.stringify(routes));
    console.log('Generated routes:');
    console.table(routes);
})();
