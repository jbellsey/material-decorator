System.register(["jbellsey/material-decorator"], function (_export) {
  "use strict";

  var enableMDL, Blog;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [function (_jbellseyMaterialDecorator) {
      enableMDL = _jbellseyMaterialDecorator.enableMDL;
    }],
    execute: function () {
      Blog = (function () {
        function Blog() {
          _classCallCheck(this, _Blog);
        }

        var _Blog = Blog;
        Blog = enableMDL(Blog) || Blog;
        return Blog;
      })();

      _export("Blog", Blog);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNhbXBsZXMvYmxvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7aUJBSWEsSUFBSTs7Ozs7OzZDQUhULFNBQVM7OztBQUdKLFVBQUk7aUJBQUosSUFBSTs7OztvQkFBSixJQUFJO0FBQUosWUFBSSxHQURoQixTQUFTLENBQ0csSUFBSSxLQUFKLElBQUk7ZUFBSixJQUFJIiwiZmlsZSI6InNhbXBsZXMvYmxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHtlbmFibGVNREx9IGZyb20gXCJqYmVsbHNleS9tYXRlcmlhbC1kZWNvcmF0b3JcIjtcblxuQGVuYWJsZU1ETFxuZXhwb3J0IGNsYXNzIEJsb2cge1xuICAvLyBubyBvdGhlciBjb2RlIG5lZWRlZCBmb3IgdGhpcyBkZW1vXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=