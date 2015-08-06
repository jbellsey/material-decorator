System.register(["jbellsey/material-decorator"], function (_export) {
  "use strict";

  var enableMDL, Article;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [function (_jbellseyMaterialDecorator) {
      enableMDL = _jbellseyMaterialDecorator.enableMDL;
    }],
    execute: function () {
      Article = (function () {
        function Article() {
          _classCallCheck(this, _Article);
        }

        var _Article = Article;
        Article = enableMDL(Article) || Article;
        return Article;
      })();

      _export("Article", Article);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNhbXBsZXMvYXJ0aWNsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7aUJBSWEsT0FBTzs7Ozs7OzZDQUhaLFNBQVM7OztBQUdKLGFBQU87aUJBQVAsT0FBTzs7Ozt1QkFBUCxPQUFPO0FBQVAsZUFBTyxHQURuQixTQUFTLENBQ0csT0FBTyxLQUFQLE9BQU87ZUFBUCxPQUFPIiwiZmlsZSI6InNhbXBsZXMvYXJ0aWNsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHtlbmFibGVNREx9IGZyb20gXCJqYmVsbHNleS9tYXRlcmlhbC1kZWNvcmF0b3JcIjtcblxuQGVuYWJsZU1ETFxuZXhwb3J0IGNsYXNzIEFydGljbGUge1xuICAvLyBubyBvdGhlciBjb2RlIG5lZWRlZCBmb3IgdGhpcyBkZW1vXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=