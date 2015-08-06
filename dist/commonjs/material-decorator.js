'use strict';

exports.__esModule = true;
exports.enableMDL = enableMDL;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _googleMaterialDesignLite = require('google/material-design-lite');

var _googleMaterialDesignLite2 = _interopRequireDefault(_googleMaterialDesignLite);

function setupMDL() {
    (_googleMaterialDesignLite2['default'].upgradeDom || _googleMaterialDesignLite2['default'].componentHandler.upgradeDom)();
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