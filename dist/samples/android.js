System.register(["jbellsey/material-decorator"], function (_export) {
  "use strict";

  var enableMDL, Android;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [function (_jbellseyMaterialDecorator) {
      enableMDL = _jbellseyMaterialDecorator.enableMDL;
    }],
    execute: function () {
      Android = (function () {
        function Android() {
          _classCallCheck(this, _Android);
        }

        var _Android = Android;
        Android = enableMDL(Android) || Android;
        return Android;
      })();

      _export("Android", Android);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNhbXBsZXMvYW5kcm9pZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7aUJBSWEsT0FBTzs7Ozs7OzZDQUhaLFNBQVM7OztBQUdKLGFBQU87aUJBQVAsT0FBTzs7Ozt1QkFBUCxPQUFPO0FBQVAsZUFBTyxHQURuQixTQUFTLENBQ0csT0FBTyxLQUFQLE9BQU87ZUFBUCxPQUFPIiwiZmlsZSI6InNhbXBsZXMvYW5kcm9pZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHtlbmFibGVNREx9IGZyb20gXCJqYmVsbHNleS9tYXRlcmlhbC1kZWNvcmF0b3JcIjtcblxuQGVuYWJsZU1ETFxuZXhwb3J0IGNsYXNzIEFuZHJvaWQge1xuICAvLyBubyBvdGhlciBjb2RlIG5lZWRlZCBmb3IgdGhpcyBkZW1vXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=