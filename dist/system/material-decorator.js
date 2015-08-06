System.register(['google/material-design-lite'], function (_export) {
    'use strict';

    var MDL;

    _export('enableMDL', enableMDL);

    function setupMDL() {
        (MDL.upgradeDom || MDL.componentHandler.upgradeDom())();
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

    return {
        setters: [function (_googleMaterialDesignLite) {
            MDL = _googleMaterialDesignLite['default'];
        }],
        execute: function () {}
    };
});