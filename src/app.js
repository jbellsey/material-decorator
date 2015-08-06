import {enableMDL} from "jbellsey/material-decorator";

@enableMDL
export class App {

  configureRouter(config, router) {
    config.title = 'Material Decorator for Aurelia';
    config.map([

      {
        route:    ['', 'blog'],
        name:      'blog',
        moduleId:  './samples/blog',
        nav:       true,
        title:     'Blog'
      },
      {
        route:     'android',
        name:      'android',
        moduleId:  './samples/android',
        nav:       true,
        title:     'Android'
      },
      {
        route:     'dashboard',
        name:      'dashboard',
        moduleId:  './samples/dashboard',
        nav:       true,
        title:     'Dashboard'
      },
      {
        route:     'textonly',
        name:      'textonly',
        moduleId:  './samples/textonly',
        nav:       true,
        title:     'Text'
      },
      {
        route:     'article',
        name:      'article',
        moduleId:  './samples/article',
        nav:       true,
        title:     'Article'
      }
    ]);

    this.router = router;
  }
}
