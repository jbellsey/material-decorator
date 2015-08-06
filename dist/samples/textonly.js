System.register(["jbellsey/material-decorator"], function (_export) {
  "use strict";

  var enableMDL, TextOnly;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [function (_jbellseyMaterialDecorator) {
      enableMDL = _jbellseyMaterialDecorator.enableMDL;
    }],
    execute: function () {
      TextOnly = (function () {
        function TextOnly() {
          _classCallCheck(this, _TextOnly);
        }

        var _TextOnly = TextOnly;
        TextOnly = enableMDL(TextOnly) || TextOnly;
        return TextOnly;
      })();

      _export("TextOnly", TextOnly);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNhbXBsZXMvdGV4dG9ubHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O2lCQUlhLFFBQVE7Ozs7Ozs2Q0FIYixTQUFTOzs7QUFHSixjQUFRO2lCQUFSLFFBQVE7Ozs7d0JBQVIsUUFBUTtBQUFSLGdCQUFRLEdBRHBCLFNBQVMsQ0FDRyxRQUFRLEtBQVIsUUFBUTtlQUFSLFFBQVEiLCJmaWxlIjoic2FtcGxlcy90ZXh0b25seS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHtlbmFibGVNREx9IGZyb20gXCJqYmVsbHNleS9tYXRlcmlhbC1kZWNvcmF0b3JcIjtcblxuQGVuYWJsZU1ETFxuZXhwb3J0IGNsYXNzIFRleHRPbmx5IHtcbiAgLy8gbm8gb3RoZXIgY29kZSBuZWVkZWQgZm9yIHRoaXMgZGVtb1xufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9