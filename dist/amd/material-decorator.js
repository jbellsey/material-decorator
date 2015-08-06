define(['exports', 'google/material-design-lite'], function (exports, _googleMaterialDesignLite) {
    'use strict';

    exports.__esModule = true;
    exports.enableMDL = enableMDL;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _MDL = _interopRequireDefault(_googleMaterialDesignLite);

    function setupMDL() {
        (_MDL['default'].upgradeDom || _MDL['default'].componentHandler.upgradeDom())();
    }

    function enableMDL(viewModelClass) {

        var originalHandler = viewModelClass.prototype.attached;

        if (typeof originalHandler !== 'undefined') {

            viewModelClass.prototype.attached = function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                originalHandler.call.apply(originalHandler, [this].concat(args));
                setupMDL();
            };
        } else viewModelClass.prototype.attached = setupMDL;
    }
});