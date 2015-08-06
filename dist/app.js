System.register(['jbellsey/material-decorator'], function (_export) {
  'use strict';

  var enableMDL, App;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_jbellseyMaterialDecorator) {
      enableMDL = _jbellseyMaterialDecorator.enableMDL;
    }],
    execute: function () {
      App = (function () {
        function App() {
          _classCallCheck(this, _App);
        }

        _createClass(App, [{
          key: 'configureRouter',
          value: function configureRouter(config, router) {
            config.title = 'Material Decorator for Aurelia';
            config.map([{
              route: ['', 'blog'],
              name: 'blog',
              moduleId: './samples/blog',
              nav: true,
              title: 'Blog'
            }, {
              route: 'android',
              name: 'android',
              moduleId: './samples/android',
              nav: true,
              title: 'Android'
            }, {
              route: 'dashboard',
              name: 'dashboard',
              moduleId: './samples/dashboard',
              nav: true,
              title: 'Dashboard'
            }, {
              route: 'textonly',
              name: 'textonly',
              moduleId: './samples/textonly',
              nav: true,
              title: 'Text'
            }, {
              route: 'article',
              name: 'article',
              moduleId: './samples/article',
              nav: true,
              title: 'Article'
            }]);

            this.router = router;
          }
        }]);

        var _App = App;
        App = enableMDL(App) || App;
        return App;
      })();

      _export('App', App);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7aUJBR2EsR0FBRzs7Ozs7Ozs7NkNBSFIsU0FBUzs7O0FBR0osU0FBRztpQkFBSCxHQUFHOzs7O3FCQUFILEdBQUc7O2lCQUVDLHlCQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUU7QUFDOUIsa0JBQU0sQ0FBQyxLQUFLLEdBQUcsZ0NBQWdDLENBQUM7QUFDaEQsa0JBQU0sQ0FBQyxHQUFHLENBQUMsQ0FHVDtBQUNFLG1CQUFLLEVBQUssQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDO0FBQ3RCLGtCQUFJLEVBQU8sTUFBTTtBQUNqQixzQkFBUSxFQUFHLGdCQUFnQjtBQUMzQixpQkFBRyxFQUFRLElBQUk7QUFDZixtQkFBSyxFQUFNLE1BQU07YUFDbEIsRUFDRDtBQUNFLG1CQUFLLEVBQU0sU0FBUztBQUNwQixrQkFBSSxFQUFPLFNBQVM7QUFDcEIsc0JBQVEsRUFBRyxtQkFBbUI7QUFDOUIsaUJBQUcsRUFBUSxJQUFJO0FBQ2YsbUJBQUssRUFBTSxTQUFTO2FBQ3JCLEVBQ0Q7QUFDRSxtQkFBSyxFQUFNLFdBQVc7QUFDdEIsa0JBQUksRUFBTyxXQUFXO0FBQ3RCLHNCQUFRLEVBQUcscUJBQXFCO0FBQ2hDLGlCQUFHLEVBQVEsSUFBSTtBQUNmLG1CQUFLLEVBQU0sV0FBVzthQUN2QixFQUNEO0FBQ0UsbUJBQUssRUFBTSxVQUFVO0FBQ3JCLGtCQUFJLEVBQU8sVUFBVTtBQUNyQixzQkFBUSxFQUFHLG9CQUFvQjtBQUMvQixpQkFBRyxFQUFRLElBQUk7QUFDZixtQkFBSyxFQUFNLE1BQU07YUFDbEIsRUFDRDtBQUNFLG1CQUFLLEVBQU0sU0FBUztBQUNwQixrQkFBSSxFQUFPLFNBQVM7QUFDcEIsc0JBQVEsRUFBRyxtQkFBbUI7QUFDOUIsaUJBQUcsRUFBUSxJQUFJO0FBQ2YsbUJBQUssRUFBTSxTQUFTO2FBQ3JCLENBQ0YsQ0FBQyxDQUFDOztBQUVILGdCQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztXQUN0Qjs7O21CQTdDVSxHQUFHO0FBQUgsV0FBRyxHQURmLFNBQVMsQ0FDRyxHQUFHLEtBQUgsR0FBRztlQUFILEdBQUciLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtlbmFibGVNREx9IGZyb20gXCJqYmVsbHNleS9tYXRlcmlhbC1kZWNvcmF0b3JcIjtcblxuQGVuYWJsZU1ETFxuZXhwb3J0IGNsYXNzIEFwcCB7XG5cbiAgY29uZmlndXJlUm91dGVyKGNvbmZpZywgcm91dGVyKSB7XG4gICAgY29uZmlnLnRpdGxlID0gJ01hdGVyaWFsIERlY29yYXRvciBmb3IgQXVyZWxpYSc7XG4gICAgY29uZmlnLm1hcChbXG5cbiAgICAgIC8vLS0tLSBIT01FXG4gICAgICB7XG4gICAgICAgIHJvdXRlOiAgICBbJycsICdibG9nJ10sXG4gICAgICAgIG5hbWU6ICAgICAgJ2Jsb2cnLFxuICAgICAgICBtb2R1bGVJZDogICcuL3NhbXBsZXMvYmxvZycsXG4gICAgICAgIG5hdjogICAgICAgdHJ1ZSxcbiAgICAgICAgdGl0bGU6ICAgICAnQmxvZydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHJvdXRlOiAgICAgJ2FuZHJvaWQnLFxuICAgICAgICBuYW1lOiAgICAgICdhbmRyb2lkJyxcbiAgICAgICAgbW9kdWxlSWQ6ICAnLi9zYW1wbGVzL2FuZHJvaWQnLFxuICAgICAgICBuYXY6ICAgICAgIHRydWUsXG4gICAgICAgIHRpdGxlOiAgICAgJ0FuZHJvaWQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICByb3V0ZTogICAgICdkYXNoYm9hcmQnLFxuICAgICAgICBuYW1lOiAgICAgICdkYXNoYm9hcmQnLFxuICAgICAgICBtb2R1bGVJZDogICcuL3NhbXBsZXMvZGFzaGJvYXJkJyxcbiAgICAgICAgbmF2OiAgICAgICB0cnVlLFxuICAgICAgICB0aXRsZTogICAgICdEYXNoYm9hcmQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICByb3V0ZTogICAgICd0ZXh0b25seScsXG4gICAgICAgIG5hbWU6ICAgICAgJ3RleHRvbmx5JyxcbiAgICAgICAgbW9kdWxlSWQ6ICAnLi9zYW1wbGVzL3RleHRvbmx5JyxcbiAgICAgICAgbmF2OiAgICAgICB0cnVlLFxuICAgICAgICB0aXRsZTogICAgICdUZXh0J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcm91dGU6ICAgICAnYXJ0aWNsZScsXG4gICAgICAgIG5hbWU6ICAgICAgJ2FydGljbGUnLFxuICAgICAgICBtb2R1bGVJZDogICcuL3NhbXBsZXMvYXJ0aWNsZScsXG4gICAgICAgIG5hdjogICAgICAgdHJ1ZSxcbiAgICAgICAgdGl0bGU6ICAgICAnQXJ0aWNsZSdcbiAgICAgIH1cbiAgICBdKTtcblxuICAgIHRoaXMucm91dGVyID0gcm91dGVyO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=