System.config({
  "baseURL": "/",
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "es7.classProperties",
      "es7.decorators",
      "runtime"
    ]
  },
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js",
    "dialog/*": "dist/commonjs/*.js"
  }
});

System.config({
  "map": {
    "babel": "npm:babel-core@5.7.4",
    "babel-runtime": "npm:babel-runtime@5.7.0",
    "core-js": "npm:core-js@0.9.18",
    "material-design-lite": "github:google/material-design-lite@1.0.2",
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:babel-runtime@5.7.0": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@0.9.18": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    }
  }
});

