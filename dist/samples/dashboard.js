System.register(["jbellsey/material-decorator"], function (_export) {
  "use strict";

  var enableMDL, Dashboard;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [function (_jbellseyMaterialDecorator) {
      enableMDL = _jbellseyMaterialDecorator.enableMDL;
    }],
    execute: function () {
      Dashboard = (function () {
        function Dashboard() {
          _classCallCheck(this, _Dashboard);
        }

        var _Dashboard = Dashboard;
        Dashboard = enableMDL(Dashboard) || Dashboard;
        return Dashboard;
      })();

      _export("Dashboard", Dashboard);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNhbXBsZXMvZGFzaGJvYXJkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztpQkFJYSxTQUFTOzs7Ozs7NkNBSGQsU0FBUzs7O0FBR0osZUFBUztpQkFBVCxTQUFTOzs7O3lCQUFULFNBQVM7QUFBVCxpQkFBUyxHQURyQixTQUFTLENBQ0csU0FBUyxLQUFULFNBQVM7ZUFBVCxTQUFTIiwiZmlsZSI6InNhbXBsZXMvZGFzaGJvYXJkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQge2VuYWJsZU1ETH0gZnJvbSBcImpiZWxsc2V5L21hdGVyaWFsLWRlY29yYXRvclwiO1xuXG5AZW5hYmxlTURMXG5leHBvcnQgY2xhc3MgRGFzaGJvYXJkIHtcbiAgLy8gbm8gb3RoZXIgY29kZSBuZWVkZWQgZm9yIHRoaXMgZGVtb1xufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9