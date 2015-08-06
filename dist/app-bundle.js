"format register";
System.register("github:google/material-design-lite@1.0.2/material", [], false, function(__require, __exports, __module) {
  System.get("@@global-helpers").prepareGlobal(__module.id, []);
  (function() {
    var componentHandler = this["componentHandler"];
    var componentHandler = (function() {
      'use strict';
      var registeredComponents_ = [];
      var createdComponents_ = [];
      var downgradeMethod_ = 'mdlDowngrade_';
      var componentConfigProperty_ = 'mdlComponentConfigInternal_';
      function findRegisteredClass_(name, optReplace) {
        for (var i = 0; i < registeredComponents_.length; i++) {
          if (registeredComponents_[i].className === name) {
            if (optReplace !== undefined) {
              registeredComponents_[i] = optReplace;
            }
            return registeredComponents_[i];
          }
        }
        return false;
      }
      function getUpgradedListOfElement_(element) {
        var dataUpgraded = element.getAttribute('data-upgraded');
        return dataUpgraded === null ? [''] : dataUpgraded.split(',');
      }
      function isElementUpgraded_(element, jsClass) {
        var upgradedList = getUpgradedListOfElement_(element);
        return upgradedList.indexOf(jsClass) !== -1;
      }
      function upgradeDomInternal(optJsClass, optCssClass) {
        if (optJsClass === undefined && optCssClass === undefined) {
          for (var i = 0; i < registeredComponents_.length; i++) {
            upgradeDomInternal(registeredComponents_[i].className, registeredComponents_[i].cssClass);
          }
        } else {
          var jsClass = (optJsClass);
          if (optCssClass === undefined) {
            var registeredClass = findRegisteredClass_(jsClass);
            if (registeredClass) {
              optCssClass = registeredClass.cssClass;
            }
          }
          var elements = document.querySelectorAll('.' + optCssClass);
          for (var n = 0; n < elements.length; n++) {
            upgradeElementInternal(elements[n], jsClass);
          }
        }
      }
      function upgradeElementInternal(element, optJsClass) {
        if (!(typeof element === 'object' && element instanceof Element)) {
          throw new Error('Invalid argument provided to upgrade MDL element.');
        }
        var upgradedList = getUpgradedListOfElement_(element);
        var classesToUpgrade = [];
        if (!optJsClass) {
          var classList = element.classList;
          registeredComponents_.forEach(function(component) {
            if (classList.contains(component.cssClass) && classesToUpgrade.indexOf(component) === -1 && !isElementUpgraded_(element, component.className)) {
              classesToUpgrade.push(component);
            }
          });
        } else if (!isElementUpgraded_(element, optJsClass)) {
          classesToUpgrade.push(findRegisteredClass_(optJsClass));
        }
        for (var i = 0,
            n = classesToUpgrade.length,
            registeredClass; i < n; i++) {
          registeredClass = classesToUpgrade[i];
          if (registeredClass) {
            upgradedList.push(registeredClass.className);
            element.setAttribute('data-upgraded', upgradedList.join(','));
            var instance = new registeredClass.classConstructor(element);
            instance[componentConfigProperty_] = registeredClass;
            createdComponents_.push(instance);
            for (var j = 0,
                m = registeredClass.callbacks.length; j < m; j++) {
              registeredClass.callbacks[j](element);
            }
            if (registeredClass.widget) {
              element[registeredClass.className] = instance;
            }
          } else {
            throw new Error('Unable to find a registered component for the given class.');
          }
          var ev = document.createEvent('Events');
          ev.initEvent('mdl-componentupgraded', true, true);
          element.dispatchEvent(ev);
        }
      }
      function upgradeElementsInternal(elements) {
        if (!Array.isArray(elements)) {
          if (typeof elements.item === 'function') {
            elements = Array.prototype.slice.call(elements);
          } else {
            elements = [elements];
          }
        }
        for (var i = 0,
            n = elements.length,
            element; i < n; i++) {
          element = elements[i];
          if (element instanceof HTMLElement) {
            if (element.children.length > 0) {
              upgradeElementsInternal(element.children);
            }
            upgradeElementInternal(element);
          }
        }
      }
      function registerInternal(config) {
        var newConfig = {
          'classConstructor': config.constructor,
          'className': config.classAsString,
          'cssClass': config.cssClass,
          'widget': config.widget === undefined ? true : config.widget,
          'callbacks': []
        };
        registeredComponents_.forEach(function(item) {
          if (item.cssClass === newConfig.cssClass) {
            throw new Error('The provided cssClass has already been registered.');
          }
          if (item.className === newConfig.className) {
            throw new Error('The provided className has already been registered');
          }
        });
        if (config.constructor.prototype.hasOwnProperty(componentConfigProperty_)) {
          throw new Error('MDL component classes must not have ' + componentConfigProperty_ + ' defined as a property.');
        }
        var found = findRegisteredClass_(config.classAsString, newConfig);
        if (!found) {
          registeredComponents_.push(newConfig);
        }
      }
      function registerUpgradedCallbackInternal(jsClass, callback) {
        var regClass = findRegisteredClass_(jsClass);
        if (regClass) {
          regClass.callbacks.push(callback);
        }
      }
      function upgradeAllRegisteredInternal() {
        for (var n = 0; n < registeredComponents_.length; n++) {
          upgradeDomInternal(registeredComponents_[n].className);
        }
      }
      function findCreatedComponentByNodeInternal(node) {
        for (var n = 0; n < createdComponents_.length; n++) {
          var component = createdComponents_[n];
          if (component.element_ === node) {
            return component;
          }
        }
      }
      function deconstructComponentInternal(component) {
        if (component && component[componentConfigProperty_].classConstructor.prototype.hasOwnProperty(downgradeMethod_)) {
          component[downgradeMethod_]();
          var componentIndex = createdComponents_.indexOf(component);
          createdComponents_.splice(componentIndex, 1);
          var upgrades = component.element_.getAttribute('data-upgraded').split(',');
          var componentPlace = upgrades.indexOf(component[componentConfigProperty_].classAsString);
          upgrades.splice(componentPlace, 1);
          component.element_.setAttribute('data-upgraded', upgrades.join(','));
          var ev = document.createEvent('Events');
          ev.initEvent('mdl-componentdowngraded', true, true);
          component.element_.dispatchEvent(ev);
        }
      }
      function downgradeNodesInternal(nodes) {
        var downgradeNode = function(node) {
          deconstructComponentInternal(findCreatedComponentByNodeInternal(node));
        };
        if (nodes instanceof Array || nodes instanceof NodeList) {
          for (var n = 0; n < nodes.length; n++) {
            downgradeNode(nodes[n]);
          }
        } else if (nodes instanceof Node) {
          downgradeNode(nodes);
        } else {
          throw new Error('Invalid argument provided to downgrade MDL nodes.');
        }
      }
      return {
        upgradeDom: upgradeDomInternal,
        upgradeElement: upgradeElementInternal,
        upgradeElements: upgradeElementsInternal,
        upgradeAllRegistered: upgradeAllRegisteredInternal,
        registerUpgradedCallback: registerUpgradedCallbackInternal,
        register: registerInternal,
        downgradeElements: downgradeNodesInternal
      };
    })();
    window.addEventListener('load', function() {
      'use strict';
      if ('classList' in document.createElement('div') && 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach) {
        document.documentElement.classList.add('mdl-js');
        componentHandler.upgradeAllRegistered();
      } else {
        componentHandler.upgradeElement = componentHandler.register = function() {};
      }
    });
    (function() {
      'use strict';
      if (!Date.now) {
        Date.now = function() {
          return new Date().getTime();
        };
      }
      var vendors = ['webkit', 'moz'];
      for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame']);
      }
      if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
          var now = Date.now();
          var nextTime = Math.max(lastTime + 16, now);
          return setTimeout(function() {
            callback(lastTime = nextTime);
          }, nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
      }
    })();
    function MaterialButton(element) {
      'use strict';
      this.element_ = element;
      this.init();
    }
    MaterialButton.prototype.Constant_ = {};
    MaterialButton.prototype.CssClasses_ = {
      RIPPLE_EFFECT: 'mdl-js-ripple-effect',
      RIPPLE_CONTAINER: 'mdl-button__ripple-container',
      RIPPLE: 'mdl-ripple'
    };
    MaterialButton.prototype.blurHandler = function(event) {
      'use strict';
      if (event) {
        this.element_.blur();
      }
    };
    MaterialButton.prototype.disable = function() {
      'use strict';
      this.element_.disabled = true;
    };
    MaterialButton.prototype.enable = function() {
      'use strict';
      this.element_.disabled = false;
    };
    MaterialButton.prototype.init = function() {
      'use strict';
      if (this.element_) {
        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
          var rippleContainer = document.createElement('span');
          rippleContainer.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
          this.rippleElement_ = document.createElement('span');
          this.rippleElement_.classList.add(this.CssClasses_.RIPPLE);
          rippleContainer.appendChild(this.rippleElement_);
          this.boundRippleBlurHandler = this.blurHandler.bind(this);
          this.rippleElement_.addEventListener('mouseup', this.boundRippleBlurHandler);
          this.element_.appendChild(rippleContainer);
        }
        this.boundButtonBlurHandler = this.blurHandler.bind(this);
        this.element_.addEventListener('mouseup', this.boundButtonBlurHandler);
        this.element_.addEventListener('mouseleave', this.boundButtonBlurHandler);
      }
    };
    MaterialButton.prototype.mdlDowngrade_ = function() {
      'use strict';
      if (this.rippleElement_) {
        this.rippleElement_.removeEventListener('mouseup', this.boundRippleBlurHandler);
      }
      this.element_.removeEventListener('mouseup', this.boundButtonBlurHandler);
      this.element_.removeEventListener('mouseleave', this.boundButtonBlurHandler);
    };
    componentHandler.register({
      constructor: MaterialButton,
      classAsString: 'MaterialButton',
      cssClass: 'mdl-js-button',
      widget: true
    });
    function MaterialCheckbox(element) {
      'use strict';
      this.element_ = element;
      this.init();
    }
    MaterialCheckbox.prototype.Constant_ = {TINY_TIMEOUT: 0.001};
    MaterialCheckbox.prototype.CssClasses_ = {
      INPUT: 'mdl-checkbox__input',
      BOX_OUTLINE: 'mdl-checkbox__box-outline',
      FOCUS_HELPER: 'mdl-checkbox__focus-helper',
      TICK_OUTLINE: 'mdl-checkbox__tick-outline',
      RIPPLE_EFFECT: 'mdl-js-ripple-effect',
      RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
      RIPPLE_CONTAINER: 'mdl-checkbox__ripple-container',
      RIPPLE_CENTER: 'mdl-ripple--center',
      RIPPLE: 'mdl-ripple',
      IS_FOCUSED: 'is-focused',
      IS_DISABLED: 'is-disabled',
      IS_CHECKED: 'is-checked',
      IS_UPGRADED: 'is-upgraded'
    };
    MaterialCheckbox.prototype.onChange_ = function(event) {
      'use strict';
      this.updateClasses_();
    };
    MaterialCheckbox.prototype.onFocus_ = function(event) {
      'use strict';
      this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
    };
    MaterialCheckbox.prototype.onBlur_ = function(event) {
      'use strict';
      this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
    };
    MaterialCheckbox.prototype.onMouseUp_ = function(event) {
      'use strict';
      this.blur_();
    };
    MaterialCheckbox.prototype.updateClasses_ = function() {
      'use strict';
      this.checkDisabled();
      this.checkToggleState();
    };
    MaterialCheckbox.prototype.blur_ = function(event) {
      'use strict';
      window.setTimeout(function() {
        this.inputElement_.blur();
      }.bind(this), this.Constant_.TINY_TIMEOUT);
    };
    MaterialCheckbox.prototype.checkToggleState = function() {
      'use strict';
      if (this.inputElement_.checked) {
        this.element_.classList.add(this.CssClasses_.IS_CHECKED);
      } else {
        this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
      }
    };
    MaterialCheckbox.prototype.checkDisabled = function() {
      'use strict';
      if (this.inputElement_.disabled) {
        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
      } else {
        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
      }
    };
    MaterialCheckbox.prototype.disable = function() {
      'use strict';
      this.inputElement_.disabled = true;
      this.updateClasses_();
    };
    MaterialCheckbox.prototype.enable = function() {
      'use strict';
      this.inputElement_.disabled = false;
      this.updateClasses_();
    };
    MaterialCheckbox.prototype.check = function() {
      'use strict';
      this.inputElement_.checked = true;
      this.updateClasses_();
    };
    MaterialCheckbox.prototype.uncheck = function() {
      'use strict';
      this.inputElement_.checked = false;
      this.updateClasses_();
    };
    MaterialCheckbox.prototype.init = function() {
      'use strict';
      if (this.element_) {
        this.inputElement_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);
        var boxOutline = document.createElement('span');
        boxOutline.classList.add(this.CssClasses_.BOX_OUTLINE);
        var tickContainer = document.createElement('span');
        tickContainer.classList.add(this.CssClasses_.FOCUS_HELPER);
        var tickOutline = document.createElement('span');
        tickOutline.classList.add(this.CssClasses_.TICK_OUTLINE);
        boxOutline.appendChild(tickOutline);
        this.element_.appendChild(tickContainer);
        this.element_.appendChild(boxOutline);
        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
          this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
          this.rippleContainerElement_ = document.createElement('span');
          this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
          this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_EFFECT);
          this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER);
          this.boundRippleMouseUp = this.onMouseUp_.bind(this);
          this.rippleContainerElement_.addEventListener('mouseup', this.boundRippleMouseUp);
          var ripple = document.createElement('span');
          ripple.classList.add(this.CssClasses_.RIPPLE);
          this.rippleContainerElement_.appendChild(ripple);
          this.element_.appendChild(this.rippleContainerElement_);
        }
        this.boundInputOnChange = this.onChange_.bind(this);
        this.boundInputOnFocus = this.onFocus_.bind(this);
        this.boundInputOnBlur = this.onBlur_.bind(this);
        this.boundElementMouseUp = this.onMouseUp_.bind(this);
        this.inputElement_.addEventListener('change', this.boundInputOnChange);
        this.inputElement_.addEventListener('focus', this.boundInputOnFocus);
        this.inputElement_.addEventListener('blur', this.boundInputOnBlur);
        this.element_.addEventListener('mouseup', this.boundElementMouseUp);
        this.updateClasses_();
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
      }
    };
    MaterialCheckbox.prototype.mdlDowngrade_ = function() {
      'use strict';
      if (this.rippleContainerElement_) {
        this.rippleContainerElement_.removeEventListener('mouseup', this.boundRippleMouseUp);
      }
      this.inputElement_.removeEventListener('change', this.boundInputOnChange);
      this.inputElement_.removeEventListener('focus', this.boundInputOnFocus);
      this.inputElement_.removeEventListener('blur', this.boundInputOnBlur);
      this.element_.removeEventListener('mouseup', this.boundElementMouseUp);
    };
    componentHandler.register({
      constructor: MaterialCheckbox,
      classAsString: 'MaterialCheckbox',
      cssClass: 'mdl-js-checkbox',
      widget: true
    });
    function MaterialIconToggle(element) {
      'use strict';
      this.element_ = element;
      this.init();
    }
    MaterialIconToggle.prototype.Constant_ = {TINY_TIMEOUT: 0.001};
    MaterialIconToggle.prototype.CssClasses_ = {
      INPUT: 'mdl-icon-toggle__input',
      JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
      RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
      RIPPLE_CONTAINER: 'mdl-icon-toggle__ripple-container',
      RIPPLE_CENTER: 'mdl-ripple--center',
      RIPPLE: 'mdl-ripple',
      IS_FOCUSED: 'is-focused',
      IS_DISABLED: 'is-disabled',
      IS_CHECKED: 'is-checked'
    };
    MaterialIconToggle.prototype.onChange_ = function(event) {
      'use strict';
      this.updateClasses_();
    };
    MaterialIconToggle.prototype.onFocus_ = function(event) {
      'use strict';
      this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
    };
    MaterialIconToggle.prototype.onBlur_ = function(event) {
      'use strict';
      this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
    };
    MaterialIconToggle.prototype.onMouseUp_ = function(event) {
      'use strict';
      this.blur_();
    };
    MaterialIconToggle.prototype.updateClasses_ = function() {
      'use strict';
      this.checkDisabled();
      this.checkToggleState();
    };
    MaterialIconToggle.prototype.blur_ = function(event) {
      'use strict';
      window.setTimeout(function() {
        this.inputElement_.blur();
      }.bind(this), this.Constant_.TINY_TIMEOUT);
    };
    MaterialIconToggle.prototype.checkToggleState = function() {
      'use strict';
      if (this.inputElement_.checked) {
        this.element_.classList.add(this.CssClasses_.IS_CHECKED);
      } else {
        this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
      }
    };
    MaterialIconToggle.prototype.checkDisabled = function() {
      'use strict';
      if (this.inputElement_.disabled) {
        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
      } else {
        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
      }
    };
    MaterialIconToggle.prototype.disable = function() {
      'use strict';
      this.inputElement_.disabled = true;
      this.updateClasses_();
    };
    MaterialIconToggle.prototype.enable = function() {
      'use strict';
      this.inputElement_.disabled = false;
      this.updateClasses_();
    };
    MaterialIconToggle.prototype.check = function() {
      'use strict';
      this.inputElement_.checked = true;
      this.updateClasses_();
    };
    MaterialIconToggle.prototype.uncheck = function() {
      'use strict';
      this.inputElement_.checked = false;
      this.updateClasses_();
    };
    MaterialIconToggle.prototype.init = function() {
      'use strict';
      if (this.element_) {
        this.inputElement_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);
        if (this.element_.classList.contains(this.CssClasses_.JS_RIPPLE_EFFECT)) {
          this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
          this.rippleContainerElement_ = document.createElement('span');
          this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
          this.rippleContainerElement_.classList.add(this.CssClasses_.JS_RIPPLE_EFFECT);
          this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER);
          this.boundRippleMouseUp = this.onMouseUp_.bind(this);
          this.rippleContainerElement_.addEventListener('mouseup', this.boundRippleMouseUp);
          var ripple = document.createElement('span');
          ripple.classList.add(this.CssClasses_.RIPPLE);
          this.rippleContainerElement_.appendChild(ripple);
          this.element_.appendChild(this.rippleContainerElement_);
        }
        this.boundInputOnChange = this.onChange_.bind(this);
        this.boundInputOnFocus = this.onFocus_.bind(this);
        this.boundInputOnBlur = this.onBlur_.bind(this);
        this.boundElementOnMouseUp = this.onMouseUp_.bind(this);
        this.inputElement_.addEventListener('change', this.boundInputOnChange);
        this.inputElement_.addEventListener('focus', this.boundInputOnFocus);
        this.inputElement_.addEventListener('blur', this.boundInputOnBlur);
        this.element_.addEventListener('mouseup', this.boundElementOnMouseUp);
        this.updateClasses_();
        this.element_.classList.add('is-upgraded');
      }
    };
    MaterialIconToggle.prototype.mdlDowngrade_ = function() {
      'use strict';
      if (this.rippleContainerElement_) {
        this.rippleContainerElement_.removeEventListener('mouseup', this.boundRippleMouseUp);
      }
      this.inputElement_.removeEventListener('change', this.boundInputOnChange);
      this.inputElement_.removeEventListener('focus', this.boundInputOnFocus);
      this.inputElement_.removeEventListener('blur', this.boundInputOnBlur);
      this.element_.removeEventListener('mouseup', this.boundElementOnMouseUp);
    };
    componentHandler.register({
      constructor: MaterialIconToggle,
      classAsString: 'MaterialIconToggle',
      cssClass: 'mdl-js-icon-toggle',
      widget: true
    });
    function MaterialMenu(element) {
      'use strict';
      this.element_ = element;
      this.init();
    }
    MaterialMenu.prototype.Constant_ = {
      TRANSITION_DURATION_SECONDS: 0.3,
      TRANSITION_DURATION_FRACTION: 0.8,
      CLOSE_TIMEOUT: 150
    };
    MaterialMenu.prototype.Keycodes_ = {
      ENTER: 13,
      ESCAPE: 27,
      SPACE: 32,
      UP_ARROW: 38,
      DOWN_ARROW: 40
    };
    MaterialMenu.prototype.CssClasses_ = {
      CONTAINER: 'mdl-menu__container',
      OUTLINE: 'mdl-menu__outline',
      ITEM: 'mdl-menu__item',
      ITEM_RIPPLE_CONTAINER: 'mdl-menu__item-ripple-container',
      RIPPLE_EFFECT: 'mdl-js-ripple-effect',
      RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
      RIPPLE: 'mdl-ripple',
      IS_UPGRADED: 'is-upgraded',
      IS_VISIBLE: 'is-visible',
      IS_ANIMATING: 'is-animating',
      BOTTOM_LEFT: 'mdl-menu--bottom-left',
      BOTTOM_RIGHT: 'mdl-menu--bottom-right',
      TOP_LEFT: 'mdl-menu--top-left',
      TOP_RIGHT: 'mdl-menu--top-right',
      UNALIGNED: 'mdl-menu--unaligned'
    };
    MaterialMenu.prototype.init = function() {
      'use strict';
      if (this.element_) {
        var container = document.createElement('div');
        container.classList.add(this.CssClasses_.CONTAINER);
        this.element_.parentElement.insertBefore(container, this.element_);
        this.element_.parentElement.removeChild(this.element_);
        container.appendChild(this.element_);
        this.container_ = container;
        var outline = document.createElement('div');
        outline.classList.add(this.CssClasses_.OUTLINE);
        this.outline_ = outline;
        container.insertBefore(outline, this.element_);
        var forElId = this.element_.getAttribute('for');
        var forEl = null;
        if (forElId) {
          forEl = document.getElementById(forElId);
          if (forEl) {
            this.forElement_ = forEl;
            forEl.addEventListener('click', this.handleForClick_.bind(this));
            forEl.addEventListener('keydown', this.handleForKeyboardEvent_.bind(this));
          }
        }
        var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
        for (var i = 0; i < items.length; i++) {
          items[i].addEventListener('click', this.handleItemClick_.bind(this));
          items[i].tabIndex = '-1';
          items[i].addEventListener('keydown', this.handleItemKeyboardEvent_.bind(this));
        }
        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
          this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
          for (i = 0; i < items.length; i++) {
            var item = items[i];
            var rippleContainer = document.createElement('span');
            rippleContainer.classList.add(this.CssClasses_.ITEM_RIPPLE_CONTAINER);
            var ripple = document.createElement('span');
            ripple.classList.add(this.CssClasses_.RIPPLE);
            rippleContainer.appendChild(ripple);
            item.appendChild(rippleContainer);
            item.classList.add(this.CssClasses_.RIPPLE_EFFECT);
          }
        }
        if (this.element_.classList.contains(this.CssClasses_.BOTTOM_LEFT)) {
          this.outline_.classList.add(this.CssClasses_.BOTTOM_LEFT);
        }
        if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
          this.outline_.classList.add(this.CssClasses_.BOTTOM_RIGHT);
        }
        if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
          this.outline_.classList.add(this.CssClasses_.TOP_LEFT);
        }
        if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
          this.outline_.classList.add(this.CssClasses_.TOP_RIGHT);
        }
        if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
          this.outline_.classList.add(this.CssClasses_.UNALIGNED);
        }
        container.classList.add(this.CssClasses_.IS_UPGRADED);
      }
    };
    MaterialMenu.prototype.handleForClick_ = function(evt) {
      'use strict';
      if (this.element_ && this.forElement_) {
        var rect = this.forElement_.getBoundingClientRect();
        var forRect = this.forElement_.parentElement.getBoundingClientRect();
        if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {} else if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
          this.container_.style.right = (forRect.right - rect.right) + 'px';
          this.container_.style.top = this.forElement_.offsetTop + this.forElement_.offsetHeight + 'px';
        } else if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
          this.container_.style.left = this.forElement_.offsetLeft + 'px';
          this.container_.style.bottom = (forRect.bottom - rect.top) + 'px';
        } else if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
          this.container_.style.right = (forRect.right - rect.right) + 'px';
          this.container_.style.bottom = (forRect.bottom - rect.top) + 'px';
        } else {
          this.container_.style.left = this.forElement_.offsetLeft + 'px';
          this.container_.style.top = this.forElement_.offsetTop + this.forElement_.offsetHeight + 'px';
        }
      }
      this.toggle(evt);
    };
    MaterialMenu.prototype.handleForKeyboardEvent_ = function(evt) {
      'use strict';
      if (this.element_ && this.container_ && this.forElement_) {
        var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM + ':not([disabled])');
        if (items && items.length > 0 && this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
          if (evt.keyCode === this.Keycodes_.UP_ARROW) {
            evt.preventDefault();
            items[items.length - 1].focus();
          } else if (evt.keyCode === this.Keycodes_.DOWN_ARROW) {
            evt.preventDefault();
            items[0].focus();
          }
        }
      }
    };
    MaterialMenu.prototype.handleItemKeyboardEvent_ = function(evt) {
      'use strict';
      if (this.element_ && this.container_) {
        var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM + ':not([disabled])');
        if (items && items.length > 0 && this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
          var currentIndex = Array.prototype.slice.call(items).indexOf(evt.target);
          if (evt.keyCode === this.Keycodes_.UP_ARROW) {
            evt.preventDefault();
            if (currentIndex > 0) {
              items[currentIndex - 1].focus();
            } else {
              items[items.length - 1].focus();
            }
          } else if (evt.keyCode === this.Keycodes_.DOWN_ARROW) {
            evt.preventDefault();
            if (items.length > currentIndex + 1) {
              items[currentIndex + 1].focus();
            } else {
              items[0].focus();
            }
          } else if (evt.keyCode === this.Keycodes_.SPACE || evt.keyCode === this.Keycodes_.ENTER) {
            evt.preventDefault();
            var e = new MouseEvent('mousedown');
            evt.target.dispatchEvent(e);
            e = new MouseEvent('mouseup');
            evt.target.dispatchEvent(e);
            evt.target.click();
          } else if (evt.keyCode === this.Keycodes_.ESCAPE) {
            evt.preventDefault();
            this.hide();
          }
        }
      }
    };
    MaterialMenu.prototype.handleItemClick_ = function(evt) {
      'use strict';
      if (evt.target.getAttribute('disabled') !== null) {
        evt.stopPropagation();
      } else {
        this.closing_ = true;
        window.setTimeout(function(evt) {
          this.hide();
          this.closing_ = false;
        }.bind(this), this.Constant_.CLOSE_TIMEOUT);
      }
    };
    MaterialMenu.prototype.applyClip_ = function(height, width) {
      'use strict';
      if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
        this.element_.style.clip = null;
      } else if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
        this.element_.style.clip = 'rect(0 ' + width + 'px ' + '0 ' + width + 'px)';
      } else if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
        this.element_.style.clip = 'rect(' + height + 'px 0 ' + height + 'px 0)';
      } else if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
        this.element_.style.clip = 'rect(' + height + 'px ' + width + 'px ' + height + 'px ' + width + 'px)';
      } else {
        this.element_.style.clip = null;
      }
    };
    MaterialMenu.prototype.addAnimationEndListener_ = function() {
      'use strict';
      var cleanup = function() {
        this.element_.removeEventListener('transitionend', cleanup);
        this.element_.removeEventListener('webkitTransitionEnd', cleanup);
        this.element_.classList.remove(this.CssClasses_.IS_ANIMATING);
      }.bind(this);
      this.element_.addEventListener('transitionend', cleanup);
      this.element_.addEventListener('webkitTransitionEnd', cleanup);
    };
    MaterialMenu.prototype.show = function(evt) {
      'use strict';
      if (this.element_ && this.container_ && this.outline_) {
        var height = this.element_.getBoundingClientRect().height;
        var width = this.element_.getBoundingClientRect().width;
        this.container_.style.width = width + 'px';
        this.container_.style.height = height + 'px';
        this.outline_.style.width = width + 'px';
        this.outline_.style.height = height + 'px';
        var transitionDuration = this.Constant_.TRANSITION_DURATION_SECONDS * this.Constant_.TRANSITION_DURATION_FRACTION;
        var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
        for (var i = 0; i < items.length; i++) {
          var itemDelay = null;
          if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT) || this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
            itemDelay = ((height - items[i].offsetTop - items[i].offsetHeight) / height * transitionDuration) + 's';
          } else {
            itemDelay = (items[i].offsetTop / height * transitionDuration) + 's';
          }
          items[i].style.transitionDelay = itemDelay;
        }
        this.applyClip_(height, width);
        window.requestAnimationFrame(function() {
          this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
          this.element_.style.clip = 'rect(0 ' + width + 'px ' + height + 'px 0)';
          this.container_.classList.add(this.CssClasses_.IS_VISIBLE);
        }.bind(this));
        this.addAnimationEndListener_();
        var callback = function(e) {
          if (e !== evt && !this.closing_) {
            document.removeEventListener('click', callback);
            this.hide();
          }
        }.bind(this);
        document.addEventListener('click', callback);
      }
    };
    MaterialMenu.prototype.hide = function() {
      'use strict';
      if (this.element_ && this.container_ && this.outline_) {
        var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
        for (var i = 0; i < items.length; i++) {
          items[i].style.transitionDelay = null;
        }
        var height = this.element_.getBoundingClientRect().height;
        var width = this.element_.getBoundingClientRect().width;
        this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
        this.applyClip_(height, width);
        this.container_.classList.remove(this.CssClasses_.IS_VISIBLE);
        this.addAnimationEndListener_();
      }
    };
    MaterialMenu.prototype.toggle = function(evt) {
      'use strict';
      if (this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
        this.hide();
      } else {
        this.show(evt);
      }
    };
    componentHandler.register({
      constructor: MaterialMenu,
      classAsString: 'MaterialMenu',
      cssClass: 'mdl-js-menu',
      widget: true
    });
    function MaterialProgress(element) {
      'use strict';
      this.element_ = element;
      this.init();
    }
    MaterialProgress.prototype.Constant_ = {};
    MaterialProgress.prototype.CssClasses_ = {INDETERMINATE_CLASS: 'mdl-progress__indeterminate'};
    MaterialProgress.prototype.setProgress = function(p) {
      'use strict';
      if (this.element_.classList.contains(this.CssClasses_.INDETERMINATE_CLASS)) {
        return ;
      }
      this.progressbar_.style.width = p + '%';
    };
    MaterialProgress.prototype.setBuffer = function(p) {
      'use strict';
      this.bufferbar_.style.width = p + '%';
      this.auxbar_.style.width = (100 - p) + '%';
    };
    MaterialProgress.prototype.init = function() {
      'use strict';
      if (this.element_) {
        var el = document.createElement('div');
        el.className = 'progressbar bar bar1';
        this.element_.appendChild(el);
        this.progressbar_ = el;
        el = document.createElement('div');
        el.className = 'bufferbar bar bar2';
        this.element_.appendChild(el);
        this.bufferbar_ = el;
        el = document.createElement('div');
        el.className = 'auxbar bar bar3';
        this.element_.appendChild(el);
        this.auxbar_ = el;
        this.progressbar_.style.width = '0%';
        this.bufferbar_.style.width = '100%';
        this.auxbar_.style.width = '0%';
        this.element_.classList.add('is-upgraded');
      }
    };
    MaterialProgress.prototype.mdlDowngrade_ = function() {
      'use strict';
      while (this.element_.firstChild) {
        this.element_.removeChild(this.element_.firstChild);
      }
    };
    componentHandler.register({
      constructor: MaterialProgress,
      classAsString: 'MaterialProgress',
      cssClass: 'mdl-js-progress',
      widget: true
    });
    function MaterialRadio(element) {
      'use strict';
      this.element_ = element;
      this.init();
    }
    MaterialRadio.prototype.Constant_ = {TINY_TIMEOUT: 0.001};
    MaterialRadio.prototype.CssClasses_ = {
      IS_FOCUSED: 'is-focused',
      IS_DISABLED: 'is-disabled',
      IS_CHECKED: 'is-checked',
      IS_UPGRADED: 'is-upgraded',
      JS_RADIO: 'mdl-js-radio',
      RADIO_BTN: 'mdl-radio__button',
      RADIO_OUTER_CIRCLE: 'mdl-radio__outer-circle',
      RADIO_INNER_CIRCLE: 'mdl-radio__inner-circle',
      RIPPLE_EFFECT: 'mdl-js-ripple-effect',
      RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
      RIPPLE_CONTAINER: 'mdl-radio__ripple-container',
      RIPPLE_CENTER: 'mdl-ripple--center',
      RIPPLE: 'mdl-ripple'
    };
    MaterialRadio.prototype.onChange_ = function(event) {
      'use strict';
      var radios = document.getElementsByClassName(this.CssClasses_.JS_RADIO);
      for (var i = 0; i < radios.length; i++) {
        var button = radios[i].querySelector('.' + this.CssClasses_.RADIO_BTN);
        if (button.getAttribute('name') === this.btnElement_.getAttribute('name')) {
          radios[i].MaterialRadio.updateClasses_();
        }
      }
    };
    MaterialRadio.prototype.onFocus_ = function(event) {
      'use strict';
      this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
    };
    MaterialRadio.prototype.onBlur_ = function(event) {
      'use strict';
      this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
    };
    MaterialRadio.prototype.onMouseup_ = function(event) {
      'use strict';
      this.blur_();
    };
    MaterialRadio.prototype.updateClasses_ = function() {
      'use strict';
      this.checkDisabled();
      this.checkToggleState();
    };
    MaterialRadio.prototype.blur_ = function(event) {
      'use strict';
      window.setTimeout(function() {
        this.btnElement_.blur();
      }.bind(this), this.Constant_.TINY_TIMEOUT);
    };
    MaterialRadio.prototype.checkDisabled = function() {
      'use strict';
      if (this.btnElement_.disabled) {
        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
      } else {
        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
      }
    };
    MaterialRadio.prototype.checkToggleState = function() {
      'use strict';
      if (this.btnElement_.checked) {
        this.element_.classList.add(this.CssClasses_.IS_CHECKED);
      } else {
        this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
      }
    };
    MaterialRadio.prototype.disable = function() {
      'use strict';
      this.btnElement_.disabled = true;
      this.updateClasses_();
    };
    MaterialRadio.prototype.enable = function() {
      'use strict';
      this.btnElement_.disabled = false;
      this.updateClasses_();
    };
    MaterialRadio.prototype.check = function() {
      'use strict';
      this.btnElement_.checked = true;
      this.updateClasses_();
    };
    MaterialRadio.prototype.uncheck = function() {
      'use strict';
      this.btnElement_.checked = false;
      this.updateClasses_();
    };
    MaterialRadio.prototype.init = function() {
      'use strict';
      if (this.element_) {
        this.btnElement_ = this.element_.querySelector('.' + this.CssClasses_.RADIO_BTN);
        var outerCircle = document.createElement('span');
        outerCircle.classList.add(this.CssClasses_.RADIO_OUTER_CIRCLE);
        var innerCircle = document.createElement('span');
        innerCircle.classList.add(this.CssClasses_.RADIO_INNER_CIRCLE);
        this.element_.appendChild(outerCircle);
        this.element_.appendChild(innerCircle);
        var rippleContainer;
        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
          this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
          rippleContainer = document.createElement('span');
          rippleContainer.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
          rippleContainer.classList.add(this.CssClasses_.RIPPLE_EFFECT);
          rippleContainer.classList.add(this.CssClasses_.RIPPLE_CENTER);
          rippleContainer.addEventListener('mouseup', this.onMouseup_.bind(this));
          var ripple = document.createElement('span');
          ripple.classList.add(this.CssClasses_.RIPPLE);
          rippleContainer.appendChild(ripple);
          this.element_.appendChild(rippleContainer);
        }
        this.btnElement_.addEventListener('change', this.onChange_.bind(this));
        this.btnElement_.addEventListener('focus', this.onFocus_.bind(this));
        this.btnElement_.addEventListener('blur', this.onBlur_.bind(this));
        this.element_.addEventListener('mouseup', this.onMouseup_.bind(this));
        this.updateClasses_();
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
      }
    };
    componentHandler.register({
      constructor: MaterialRadio,
      classAsString: 'MaterialRadio',
      cssClass: 'mdl-js-radio',
      widget: true
    });
    function MaterialSlider(element) {
      'use strict';
      this.element_ = element;
      this.isIE_ = window.navigator.msPointerEnabled;
      this.init();
    }
    MaterialSlider.prototype.Constant_ = {};
    MaterialSlider.prototype.CssClasses_ = {
      IE_CONTAINER: 'mdl-slider__ie-container',
      SLIDER_CONTAINER: 'mdl-slider__container',
      BACKGROUND_FLEX: 'mdl-slider__background-flex',
      BACKGROUND_LOWER: 'mdl-slider__background-lower',
      BACKGROUND_UPPER: 'mdl-slider__background-upper',
      IS_LOWEST_VALUE: 'is-lowest-value',
      IS_UPGRADED: 'is-upgraded'
    };
    MaterialSlider.prototype.onInput_ = function(event) {
      'use strict';
      this.updateValueStyles_();
    };
    MaterialSlider.prototype.onChange_ = function(event) {
      'use strict';
      this.updateValueStyles_();
    };
    MaterialSlider.prototype.onMouseUp_ = function(event) {
      'use strict';
      event.target.blur();
    };
    MaterialSlider.prototype.onContainerMouseDown_ = function(event) {
      'use strict';
      if (event.target !== this.element_.parentElement) {
        return ;
      }
      event.preventDefault();
      var newEvent = new MouseEvent('mousedown', {
        target: event.target,
        buttons: event.buttons,
        clientX: event.clientX,
        clientY: this.element_.getBoundingClientRect().y
      });
      this.element_.dispatchEvent(newEvent);
    };
    MaterialSlider.prototype.updateValueStyles_ = function(event) {
      'use strict';
      var fraction = (this.element_.value - this.element_.min) / (this.element_.max - this.element_.min);
      if (fraction === 0) {
        this.element_.classList.add(this.CssClasses_.IS_LOWEST_VALUE);
      } else {
        this.element_.classList.remove(this.CssClasses_.IS_LOWEST_VALUE);
      }
      if (!this.isIE_) {
        this.backgroundLower_.style.flex = fraction;
        this.backgroundLower_.style.webkitFlex = fraction;
        this.backgroundUpper_.style.flex = 1 - fraction;
        this.backgroundUpper_.style.webkitFlex = 1 - fraction;
      }
    };
    MaterialSlider.prototype.disable = function() {
      'use strict';
      this.element_.disabled = true;
    };
    MaterialSlider.prototype.enable = function() {
      'use strict';
      this.element_.disabled = false;
    };
    MaterialSlider.prototype.change = function(value) {
      'use strict';
      if (value) {
        this.element_.value = value;
      }
      this.updateValueStyles_();
    };
    MaterialSlider.prototype.init = function() {
      'use strict';
      if (this.element_) {
        if (this.isIE_) {
          var containerIE = document.createElement('div');
          containerIE.classList.add(this.CssClasses_.IE_CONTAINER);
          this.element_.parentElement.insertBefore(containerIE, this.element_);
          this.element_.parentElement.removeChild(this.element_);
          containerIE.appendChild(this.element_);
        } else {
          var container = document.createElement('div');
          container.classList.add(this.CssClasses_.SLIDER_CONTAINER);
          this.element_.parentElement.insertBefore(container, this.element_);
          this.element_.parentElement.removeChild(this.element_);
          container.appendChild(this.element_);
          var backgroundFlex = document.createElement('div');
          backgroundFlex.classList.add(this.CssClasses_.BACKGROUND_FLEX);
          container.appendChild(backgroundFlex);
          this.backgroundLower_ = document.createElement('div');
          this.backgroundLower_.classList.add(this.CssClasses_.BACKGROUND_LOWER);
          backgroundFlex.appendChild(this.backgroundLower_);
          this.backgroundUpper_ = document.createElement('div');
          this.backgroundUpper_.classList.add(this.CssClasses_.BACKGROUND_UPPER);
          backgroundFlex.appendChild(this.backgroundUpper_);
        }
        this.boundInputHandler = this.onInput_.bind(this);
        this.boundChangeHandler = this.onChange_.bind(this);
        this.boundMouseUpHandler = this.onMouseUp_.bind(this);
        this.boundContainerMouseDownHandler = this.onContainerMouseDown_.bind(this);
        this.element_.addEventListener('input', this.boundInputHandler);
        this.element_.addEventListener('change', this.boundChangeHandler);
        this.element_.addEventListener('mouseup', this.boundMouseUpHandler);
        this.element_.parentElement.addEventListener('mousedown', this.boundContainerMouseDownHandler);
        this.updateValueStyles_();
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
      }
    };
    MaterialSlider.prototype.mdlDowngrade_ = function() {
      'use strict';
      this.element_.removeEventListener('input', this.boundInputHandler);
      this.element_.removeEventListener('change', this.boundChangeHandler);
      this.element_.removeEventListener('mouseup', this.boundMouseUpHandler);
      this.element_.parentElement.removeEventListener('mousedown', this.boundContainerMouseDownHandler);
    };
    componentHandler.register({
      constructor: MaterialSlider,
      classAsString: 'MaterialSlider',
      cssClass: 'mdl-js-slider',
      widget: true
    });
    function MaterialSpinner(element) {
      'use strict';
      this.element_ = element;
      this.init();
    }
    MaterialSpinner.prototype.Constant_ = {MDL_SPINNER_LAYER_COUNT: 4};
    MaterialSpinner.prototype.CssClasses_ = {
      MDL_SPINNER_LAYER: 'mdl-spinner__layer',
      MDL_SPINNER_CIRCLE_CLIPPER: 'mdl-spinner__circle-clipper',
      MDL_SPINNER_CIRCLE: 'mdl-spinner__circle',
      MDL_SPINNER_GAP_PATCH: 'mdl-spinner__gap-patch',
      MDL_SPINNER_LEFT: 'mdl-spinner__left',
      MDL_SPINNER_RIGHT: 'mdl-spinner__right'
    };
    MaterialSpinner.prototype.createLayer = function(index) {
      'use strict';
      var layer = document.createElement('div');
      layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER);
      layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER + '-' + index);
      var leftClipper = document.createElement('div');
      leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER);
      leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_LEFT);
      var gapPatch = document.createElement('div');
      gapPatch.classList.add(this.CssClasses_.MDL_SPINNER_GAP_PATCH);
      var rightClipper = document.createElement('div');
      rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER);
      rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_RIGHT);
      var circleOwners = [leftClipper, gapPatch, rightClipper];
      for (var i = 0; i < circleOwners.length; i++) {
        var circle = document.createElement('div');
        circle.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE);
        circleOwners[i].appendChild(circle);
      }
      layer.appendChild(leftClipper);
      layer.appendChild(gapPatch);
      layer.appendChild(rightClipper);
      this.element_.appendChild(layer);
    };
    MaterialSpinner.prototype.stop = function() {
      'use strict';
      this.element_.classList.remove('is-active');
    };
    MaterialSpinner.prototype.start = function() {
      'use strict';
      this.element_.classList.add('is-active');
    };
    MaterialSpinner.prototype.init = function() {
      'use strict';
      if (this.element_) {
        for (var i = 1; i <= this.Constant_.MDL_SPINNER_LAYER_COUNT; i++) {
          this.createLayer(i);
        }
        this.element_.classList.add('is-upgraded');
      }
    };
    componentHandler.register({
      constructor: MaterialSpinner,
      classAsString: 'MaterialSpinner',
      cssClass: 'mdl-js-spinner',
      widget: true
    });
    function MaterialSwitch(element) {
      'use strict';
      this.element_ = element;
      this.init();
    }
    MaterialSwitch.prototype.Constant_ = {TINY_TIMEOUT: 0.001};
    MaterialSwitch.prototype.CssClasses_ = {
      INPUT: 'mdl-switch__input',
      TRACK: 'mdl-switch__track',
      THUMB: 'mdl-switch__thumb',
      FOCUS_HELPER: 'mdl-switch__focus-helper',
      RIPPLE_EFFECT: 'mdl-js-ripple-effect',
      RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
      RIPPLE_CONTAINER: 'mdl-switch__ripple-container',
      RIPPLE_CENTER: 'mdl-ripple--center',
      RIPPLE: 'mdl-ripple',
      IS_FOCUSED: 'is-focused',
      IS_DISABLED: 'is-disabled',
      IS_CHECKED: 'is-checked'
    };
    MaterialSwitch.prototype.onChange_ = function(event) {
      'use strict';
      this.updateClasses_();
    };
    MaterialSwitch.prototype.onFocus_ = function(event) {
      'use strict';
      this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
    };
    MaterialSwitch.prototype.onBlur_ = function(event) {
      'use strict';
      this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
    };
    MaterialSwitch.prototype.onMouseUp_ = function(event) {
      'use strict';
      this.blur_();
    };
    MaterialSwitch.prototype.updateClasses_ = function() {
      'use strict';
      this.checkDisabled();
      this.checkToggleState();
    };
    MaterialSwitch.prototype.blur_ = function(event) {
      'use strict';
      window.setTimeout(function() {
        this.inputElement_.blur();
      }.bind(this), this.Constant_.TINY_TIMEOUT);
    };
    MaterialSwitch.prototype.checkDisabled = function() {
      'use strict';
      if (this.inputElement_.disabled) {
        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
      } else {
        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
      }
    };
    MaterialSwitch.prototype.checkToggleState = function() {
      'use strict';
      if (this.inputElement_.checked) {
        this.element_.classList.add(this.CssClasses_.IS_CHECKED);
      } else {
        this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
      }
    };
    MaterialSwitch.prototype.disable = function() {
      'use strict';
      this.inputElement_.disabled = true;
      this.updateClasses_();
    };
    MaterialSwitch.prototype.enable = function() {
      'use strict';
      this.inputElement_.disabled = false;
      this.updateClasses_();
    };
    MaterialSwitch.prototype.on = function() {
      'use strict';
      this.inputElement_.checked = true;
      this.updateClasses_();
    };
    MaterialSwitch.prototype.off = function() {
      'use strict';
      this.inputElement_.checked = false;
      this.updateClasses_();
    };
    MaterialSwitch.prototype.init = function() {
      'use strict';
      if (this.element_) {
        this.inputElement_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);
        var track = document.createElement('div');
        track.classList.add(this.CssClasses_.TRACK);
        var thumb = document.createElement('div');
        thumb.classList.add(this.CssClasses_.THUMB);
        var focusHelper = document.createElement('span');
        focusHelper.classList.add(this.CssClasses_.FOCUS_HELPER);
        thumb.appendChild(focusHelper);
        this.element_.appendChild(track);
        this.element_.appendChild(thumb);
        this.boundMouseUpHandler = this.onMouseUp_.bind(this);
        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
          this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
          this.rippleContainerElement_ = document.createElement('span');
          this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
          this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_EFFECT);
          this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER);
          this.rippleContainerElement_.addEventListener('mouseup', this.boundMouseUpHandler);
          var ripple = document.createElement('span');
          ripple.classList.add(this.CssClasses_.RIPPLE);
          this.rippleContainerElement_.appendChild(ripple);
          this.element_.appendChild(this.rippleContainerElement_);
        }
        this.boundChangeHandler = this.onChange_.bind(this);
        this.boundFocusHandler = this.onFocus_.bind(this);
        this.boundBlurHandler = this.onBlur_.bind(this);
        this.inputElement_.addEventListener('change', this.boundChangeHandler);
        this.inputElement_.addEventListener('focus', this.boundFocusHandler);
        this.inputElement_.addEventListener('blur', this.boundBlurHandler);
        this.element_.addEventListener('mouseup', this.boundMouseUpHandler);
        this.updateClasses_();
        this.element_.classList.add('is-upgraded');
      }
    };
    MaterialSwitch.prototype.mdlDowngrade_ = function() {
      'use strict';
      if (this.rippleContainerElement_) {
        this.rippleContainerElement_.removeEventListener('mouseup', this.boundMouseUpHandler);
      }
      this.inputElement_.removeEventListener('change', this.boundChangeHandler);
      this.inputElement_.removeEventListener('focus', this.boundFocusHandler);
      this.inputElement_.removeEventListener('blur', this.boundBlurHandler);
      this.element_.removeEventListener('mouseup', this.boundMouseUpHandler);
    };
    componentHandler.register({
      constructor: MaterialSwitch,
      classAsString: 'MaterialSwitch',
      cssClass: 'mdl-js-switch',
      widget: true
    });
    function MaterialTabs(element) {
      'use strict';
      this.element_ = element;
      this.init();
    }
    MaterialTabs.prototype.Constant_ = {};
    MaterialTabs.prototype.CssClasses_ = {
      TAB_CLASS: 'mdl-tabs__tab',
      PANEL_CLASS: 'mdl-tabs__panel',
      ACTIVE_CLASS: 'is-active',
      UPGRADED_CLASS: 'is-upgraded',
      MDL_JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
      MDL_RIPPLE_CONTAINER: 'mdl-tabs__ripple-container',
      MDL_RIPPLE: 'mdl-ripple',
      MDL_JS_RIPPLE_EFFECT_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events'
    };
    MaterialTabs.prototype.initTabs_ = function(e) {
      'use strict';
      if (this.element_.classList.contains(this.CssClasses_.MDL_JS_RIPPLE_EFFECT)) {
        this.element_.classList.add(this.CssClasses_.MDL_JS_RIPPLE_EFFECT_IGNORE_EVENTS);
      }
      this.tabs_ = this.element_.querySelectorAll('.' + this.CssClasses_.TAB_CLASS);
      this.panels_ = this.element_.querySelectorAll('.' + this.CssClasses_.PANEL_CLASS);
      for (var i = 0; i < this.tabs_.length; i++) {
        new MaterialTab(this.tabs_[i], this);
      }
      this.element_.classList.add(this.CssClasses_.UPGRADED_CLASS);
    };
    MaterialTabs.prototype.resetTabState_ = function() {
      'use strict';
      for (var k = 0; k < this.tabs_.length; k++) {
        this.tabs_[k].classList.remove(this.CssClasses_.ACTIVE_CLASS);
      }
    };
    MaterialTabs.prototype.resetPanelState_ = function() {
      'use strict';
      for (var j = 0; j < this.panels_.length; j++) {
        this.panels_[j].classList.remove(this.CssClasses_.ACTIVE_CLASS);
      }
    };
    MaterialTabs.prototype.init = function() {
      'use strict';
      if (this.element_) {
        this.initTabs_();
      }
    };
    function MaterialTab(tab, ctx) {
      'use strict';
      if (tab) {
        if (ctx.element_.classList.contains(ctx.CssClasses_.MDL_JS_RIPPLE_EFFECT)) {
          var rippleContainer = document.createElement('span');
          rippleContainer.classList.add(ctx.CssClasses_.MDL_RIPPLE_CONTAINER);
          rippleContainer.classList.add(ctx.CssClasses_.MDL_JS_RIPPLE_EFFECT);
          var ripple = document.createElement('span');
          ripple.classList.add(ctx.CssClasses_.MDL_RIPPLE);
          rippleContainer.appendChild(ripple);
          tab.appendChild(rippleContainer);
        }
        tab.addEventListener('click', function(e) {
          e.preventDefault();
          var href = tab.href.split('#')[1];
          var panel = ctx.element_.querySelector('#' + href);
          ctx.resetTabState_();
          ctx.resetPanelState_();
          tab.classList.add(ctx.CssClasses_.ACTIVE_CLASS);
          panel.classList.add(ctx.CssClasses_.ACTIVE_CLASS);
        });
      }
    }
    componentHandler.register({
      constructor: MaterialTabs,
      classAsString: 'MaterialTabs',
      cssClass: 'mdl-js-tabs'
    });
    function MaterialTextfield(element) {
      'use strict';
      this.element_ = element;
      this.maxRows = this.Constant_.NO_MAX_ROWS;
      this.init();
    }
    MaterialTextfield.prototype.Constant_ = {
      NO_MAX_ROWS: -1,
      MAX_ROWS_ATTRIBUTE: 'maxrows'
    };
    MaterialTextfield.prototype.CssClasses_ = {
      LABEL: 'mdl-textfield__label',
      INPUT: 'mdl-textfield__input',
      IS_DIRTY: 'is-dirty',
      IS_FOCUSED: 'is-focused',
      IS_DISABLED: 'is-disabled',
      IS_INVALID: 'is-invalid',
      IS_UPGRADED: 'is-upgraded'
    };
    MaterialTextfield.prototype.onKeyDown_ = function(event) {
      'use strict';
      var currentRowCount = event.target.value.split('\n').length;
      if (event.keyCode === 13) {
        if (currentRowCount >= this.maxRows) {
          event.preventDefault();
        }
      }
    };
    MaterialTextfield.prototype.onFocus_ = function(event) {
      'use strict';
      this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
    };
    MaterialTextfield.prototype.onBlur_ = function(event) {
      'use strict';
      this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
    };
    MaterialTextfield.prototype.updateClasses_ = function() {
      'use strict';
      this.checkDisabled();
      this.checkValidity();
      this.checkDirty();
    };
    MaterialTextfield.prototype.checkDisabled = function() {
      'use strict';
      if (this.input_.disabled) {
        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
      } else {
        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
      }
    };
    MaterialTextfield.prototype.checkValidity = function() {
      'use strict';
      if (this.input_.validity.valid) {
        this.element_.classList.remove(this.CssClasses_.IS_INVALID);
      } else {
        this.element_.classList.add(this.CssClasses_.IS_INVALID);
      }
    };
    MaterialTextfield.prototype.checkDirty = function() {
      'use strict';
      if (this.input_.value && this.input_.value.length > 0) {
        this.element_.classList.add(this.CssClasses_.IS_DIRTY);
      } else {
        this.element_.classList.remove(this.CssClasses_.IS_DIRTY);
      }
    };
    MaterialTextfield.prototype.disable = function() {
      'use strict';
      this.input_.disabled = true;
      this.updateClasses_();
    };
    MaterialTextfield.prototype.enable = function() {
      'use strict';
      this.input_.disabled = false;
      this.updateClasses_();
    };
    MaterialTextfield.prototype.change = function(value) {
      'use strict';
      if (value) {
        this.input_.value = value;
      }
      this.updateClasses_();
    };
    MaterialTextfield.prototype.init = function() {
      'use strict';
      if (this.element_) {
        this.label_ = this.element_.querySelector('.' + this.CssClasses_.LABEL);
        this.input_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);
        if (this.input_) {
          if (this.input_.hasAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE)) {
            this.maxRows = parseInt(this.input_.getAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE), 10);
            if (isNaN(this.maxRows)) {
              this.maxRows = this.Constant_.NO_MAX_ROWS;
            }
          }
          this.boundUpdateClassesHandler = this.updateClasses_.bind(this);
          this.boundFocusHandler = this.onFocus_.bind(this);
          this.boundBlurHandler = this.onBlur_.bind(this);
          this.input_.addEventListener('input', this.boundUpdateClassesHandler);
          this.input_.addEventListener('focus', this.boundFocusHandler);
          this.input_.addEventListener('blur', this.boundBlurHandler);
          if (this.maxRows !== this.Constant_.NO_MAX_ROWS) {
            this.boundKeyDownHandler = this.onKeyDown_.bind(this);
            this.input_.addEventListener('keydown', this.boundKeyDownHandler);
          }
          this.updateClasses_();
          this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
        }
      }
    };
    MaterialTextfield.prototype.mdlDowngrade_ = function() {
      'use strict';
      this.input_.removeEventListener('input', this.boundUpdateClassesHandler);
      this.input_.removeEventListener('focus', this.boundFocusHandler);
      this.input_.removeEventListener('blur', this.boundBlurHandler);
      if (this.boundKeyDownHandler) {
        this.input_.removeEventListener('keydown', this.boundKeyDownHandler);
      }
    };
    componentHandler.register({
      constructor: MaterialTextfield,
      classAsString: 'MaterialTextfield',
      cssClass: 'mdl-js-textfield',
      widget: true
    });
    function MaterialTooltip(element) {
      'use strict';
      this.element_ = element;
      this.init();
    }
    MaterialTooltip.prototype.Constant_ = {};
    MaterialTooltip.prototype.CssClasses_ = {IS_ACTIVE: 'is-active'};
    MaterialTooltip.prototype.handleMouseEnter_ = function(event) {
      'use strict';
      event.stopPropagation();
      var props = event.target.getBoundingClientRect();
      var left = props.left + (props.width / 2);
      var marginLeft = -1 * (this.element_.offsetWidth / 2);
      if (left + marginLeft < 0) {
        this.element_.style.left = 0;
        this.element_.style.marginLeft = 0;
      } else {
        this.element_.style.left = left + 'px';
        this.element_.style.marginLeft = marginLeft + 'px';
      }
      this.element_.style.top = props.top + props.height + 10 + 'px';
      this.element_.classList.add(this.CssClasses_.IS_ACTIVE);
      window.addEventListener('scroll', this.boundMouseLeaveHandler, false);
      window.addEventListener('touchmove', this.boundMouseLeaveHandler, false);
    };
    MaterialTooltip.prototype.handleMouseLeave_ = function(event) {
      'use strict';
      event.stopPropagation();
      this.element_.classList.remove(this.CssClasses_.IS_ACTIVE);
      window.removeEventListener('scroll', this.boundMouseLeaveHandler);
      window.removeEventListener('touchmove', this.boundMouseLeaveHandler, false);
    };
    MaterialTooltip.prototype.init = function() {
      'use strict';
      if (this.element_) {
        var forElId = this.element_.getAttribute('for');
        if (forElId) {
          this.forElement_ = document.getElementById(forElId);
        }
        if (this.forElement_) {
          if (!this.forElement_.getAttribute('tabindex')) {
            this.forElement_.setAttribute('tabindex', '0');
          }
          this.boundMouseEnterHandler = this.handleMouseEnter_.bind(this);
          this.boundMouseLeaveHandler = this.handleMouseLeave_.bind(this);
          this.forElement_.addEventListener('mouseenter', this.boundMouseEnterHandler, false);
          this.forElement_.addEventListener('click', this.boundMouseEnterHandler, false);
          this.forElement_.addEventListener('blur', this.boundMouseLeaveHandler);
          this.forElement_.addEventListener('touchstart', this.boundMouseEnterHandler, false);
          this.forElement_.addEventListener('mouseleave', this.boundMouseLeaveHandler);
        }
      }
    };
    MaterialTooltip.prototype.mdlDowngrade_ = function() {
      'use strict';
      if (this.forElement_) {
        this.forElement_.removeEventListener('mouseenter', this.boundMouseEnterHandler, false);
        this.forElement_.removeEventListener('click', this.boundMouseEnterHandler, false);
        this.forElement_.removeEventListener('touchstart', this.boundMouseEnterHandler, false);
        this.forElement_.removeEventListener('mouseleave', this.boundMouseLeaveHandler);
      }
    };
    componentHandler.register({
      constructor: MaterialTooltip,
      classAsString: 'MaterialTooltip',
      cssClass: 'mdl-tooltip'
    });
    function MaterialLayout(element) {
      'use strict';
      this.element_ = element;
      this.init();
    }
    MaterialLayout.prototype.Constant_ = {
      MAX_WIDTH: '(max-width: 1024px)',
      TAB_SCROLL_PIXELS: 100,
      MENU_ICON: 'menu',
      CHEVRON_LEFT: 'chevron_left',
      CHEVRON_RIGHT: 'chevron_right'
    };
    MaterialLayout.prototype.Mode_ = {
      STANDARD: 0,
      SEAMED: 1,
      WATERFALL: 2,
      SCROLL: 3
    };
    MaterialLayout.prototype.CssClasses_ = {
      CONTAINER: 'mdl-layout__container',
      HEADER: 'mdl-layout__header',
      DRAWER: 'mdl-layout__drawer',
      CONTENT: 'mdl-layout__content',
      DRAWER_BTN: 'mdl-layout__drawer-button',
      ICON: 'material-icons',
      JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
      RIPPLE_CONTAINER: 'mdl-layout__tab-ripple-container',
      RIPPLE: 'mdl-ripple',
      RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
      HEADER_SEAMED: 'mdl-layout__header--seamed',
      HEADER_WATERFALL: 'mdl-layout__header--waterfall',
      HEADER_SCROLL: 'mdl-layout__header--scroll',
      FIXED_HEADER: 'mdl-layout--fixed-header',
      OBFUSCATOR: 'mdl-layout__obfuscator',
      TAB_BAR: 'mdl-layout__tab-bar',
      TAB_CONTAINER: 'mdl-layout__tab-bar-container',
      TAB: 'mdl-layout__tab',
      TAB_BAR_BUTTON: 'mdl-layout__tab-bar-button',
      TAB_BAR_LEFT_BUTTON: 'mdl-layout__tab-bar-left-button',
      TAB_BAR_RIGHT_BUTTON: 'mdl-layout__tab-bar-right-button',
      PANEL: 'mdl-layout__tab-panel',
      HAS_DRAWER: 'has-drawer',
      HAS_TABS: 'has-tabs',
      HAS_SCROLLING_HEADER: 'has-scrolling-header',
      CASTING_SHADOW: 'is-casting-shadow',
      IS_COMPACT: 'is-compact',
      IS_SMALL_SCREEN: 'is-small-screen',
      IS_DRAWER_OPEN: 'is-visible',
      IS_ACTIVE: 'is-active',
      IS_UPGRADED: 'is-upgraded',
      IS_ANIMATING: 'is-animating',
      ON_LARGE_SCREEN: 'mdl-layout--large-screen-only',
      ON_SMALL_SCREEN: 'mdl-layout--small-screen-only'
    };
    MaterialLayout.prototype.contentScrollHandler_ = function() {
      'use strict';
      if (this.header_.classList.contains(this.CssClasses_.IS_ANIMATING)) {
        return ;
      }
      if (this.content_.scrollTop > 0 && !this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
        this.header_.classList.add(this.CssClasses_.CASTING_SHADOW);
        this.header_.classList.add(this.CssClasses_.IS_COMPACT);
        this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
      } else if (this.content_.scrollTop <= 0 && this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
        this.header_.classList.remove(this.CssClasses_.CASTING_SHADOW);
        this.header_.classList.remove(this.CssClasses_.IS_COMPACT);
        this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
      }
    };
    MaterialLayout.prototype.screenSizeHandler_ = function() {
      'use strict';
      if (this.screenSizeMediaQuery_.matches) {
        this.element_.classList.add(this.CssClasses_.IS_SMALL_SCREEN);
      } else {
        this.element_.classList.remove(this.CssClasses_.IS_SMALL_SCREEN);
        if (this.drawer_) {
          this.drawer_.classList.remove(this.CssClasses_.IS_DRAWER_OPEN);
        }
      }
    };
    MaterialLayout.prototype.drawerToggleHandler_ = function() {
      'use strict';
      this.drawer_.classList.toggle(this.CssClasses_.IS_DRAWER_OPEN);
    };
    MaterialLayout.prototype.headerTransitionEndHandler = function() {
      'use strict';
      this.header_.classList.remove(this.CssClasses_.IS_ANIMATING);
    };
    MaterialLayout.prototype.headerClickHandler = function() {
      'use strict';
      if (this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
        this.header_.classList.remove(this.CssClasses_.IS_COMPACT);
        this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
      }
    };
    MaterialLayout.prototype.resetTabState_ = function(tabBar) {
      'use strict';
      for (var k = 0; k < tabBar.length; k++) {
        tabBar[k].classList.remove(this.CssClasses_.IS_ACTIVE);
      }
    };
    MaterialLayout.prototype.resetPanelState_ = function(panels) {
      'use strict';
      for (var j = 0; j < panels.length; j++) {
        panels[j].classList.remove(this.CssClasses_.IS_ACTIVE);
      }
    };
    MaterialLayout.prototype.init = function() {
      'use strict';
      if (this.element_) {
        var container = document.createElement('div');
        container.classList.add(this.CssClasses_.CONTAINER);
        this.element_.parentElement.insertBefore(container, this.element_);
        this.element_.parentElement.removeChild(this.element_);
        container.appendChild(this.element_);
        var directChildren = this.element_.childNodes;
        for (var c = 0; c < directChildren.length; c++) {
          var child = directChildren[c];
          if (child.classList && child.classList.contains(this.CssClasses_.HEADER)) {
            this.header_ = child;
          }
          if (child.classList && child.classList.contains(this.CssClasses_.DRAWER)) {
            this.drawer_ = child;
          }
          if (child.classList && child.classList.contains(this.CssClasses_.CONTENT)) {
            this.content_ = child;
          }
        }
        if (this.header_) {
          this.tabBar_ = this.header_.querySelector('.' + this.CssClasses_.TAB_BAR);
        }
        var mode = this.Mode_.STANDARD;
        this.screenSizeMediaQuery_ = window.matchMedia(this.Constant_.MAX_WIDTH);
        this.screenSizeMediaQuery_.addListener(this.screenSizeHandler_.bind(this));
        this.screenSizeHandler_();
        if (this.header_) {
          if (this.header_.classList.contains(this.CssClasses_.HEADER_SEAMED)) {
            mode = this.Mode_.SEAMED;
          } else if (this.header_.classList.contains(this.CssClasses_.HEADER_WATERFALL)) {
            mode = this.Mode_.WATERFALL;
            this.header_.addEventListener('transitionend', this.headerTransitionEndHandler.bind(this));
            this.header_.addEventListener('click', this.headerClickHandler.bind(this));
          } else if (this.header_.classList.contains(this.CssClasses_.HEADER_SCROLL)) {
            mode = this.Mode_.SCROLL;
            container.classList.add(this.CssClasses_.HAS_SCROLLING_HEADER);
          }
          if (mode === this.Mode_.STANDARD) {
            this.header_.classList.add(this.CssClasses_.CASTING_SHADOW);
            if (this.tabBar_) {
              this.tabBar_.classList.add(this.CssClasses_.CASTING_SHADOW);
            }
          } else if (mode === this.Mode_.SEAMED || mode === this.Mode_.SCROLL) {
            this.header_.classList.remove(this.CssClasses_.CASTING_SHADOW);
            if (this.tabBar_) {
              this.tabBar_.classList.remove(this.CssClasses_.CASTING_SHADOW);
            }
          } else if (mode === this.Mode_.WATERFALL) {
            this.content_.addEventListener('scroll', this.contentScrollHandler_.bind(this));
            this.contentScrollHandler_();
          }
        }
        if (this.drawer_) {
          var drawerButton = document.createElement('div');
          drawerButton.classList.add(this.CssClasses_.DRAWER_BTN);
          if (this.drawer_.classList.contains(this.CssClasses_.ON_LARGE_SCREEN)) {
            drawerButton.classList.add(this.CssClasses_.ON_LARGE_SCREEN);
          } else if (this.drawer_.classList.contains(this.CssClasses_.ON_SMALL_SCREEN)) {
            drawerButton.classList.add(this.CssClasses_.ON_SMALL_SCREEN);
          }
          var drawerButtonIcon = document.createElement('i');
          drawerButtonIcon.classList.add(this.CssClasses_.ICON);
          drawerButtonIcon.textContent = this.Constant_.MENU_ICON;
          drawerButton.appendChild(drawerButtonIcon);
          drawerButton.addEventListener('click', this.drawerToggleHandler_.bind(this));
          this.element_.classList.add(this.CssClasses_.HAS_DRAWER);
          if (this.element_.classList.contains(this.CssClasses_.FIXED_HEADER)) {
            this.header_.insertBefore(drawerButton, this.header_.firstChild);
          } else {
            this.element_.insertBefore(drawerButton, this.content_);
          }
          var obfuscator = document.createElement('div');
          obfuscator.classList.add(this.CssClasses_.OBFUSCATOR);
          this.element_.appendChild(obfuscator);
          obfuscator.addEventListener('click', this.drawerToggleHandler_.bind(this));
        }
        if (this.header_ && this.tabBar_) {
          this.element_.classList.add(this.CssClasses_.HAS_TABS);
          var tabContainer = document.createElement('div');
          tabContainer.classList.add(this.CssClasses_.TAB_CONTAINER);
          this.header_.insertBefore(tabContainer, this.tabBar_);
          this.header_.removeChild(this.tabBar_);
          var leftButton = document.createElement('div');
          leftButton.classList.add(this.CssClasses_.TAB_BAR_BUTTON);
          leftButton.classList.add(this.CssClasses_.TAB_BAR_LEFT_BUTTON);
          var leftButtonIcon = document.createElement('i');
          leftButtonIcon.classList.add(this.CssClasses_.ICON);
          leftButtonIcon.textContent = this.Constant_.CHEVRON_LEFT;
          leftButton.appendChild(leftButtonIcon);
          leftButton.addEventListener('click', function() {
            this.tabBar_.scrollLeft -= this.Constant_.TAB_SCROLL_PIXELS;
          }.bind(this));
          var rightButton = document.createElement('div');
          rightButton.classList.add(this.CssClasses_.TAB_BAR_BUTTON);
          rightButton.classList.add(this.CssClasses_.TAB_BAR_RIGHT_BUTTON);
          var rightButtonIcon = document.createElement('i');
          rightButtonIcon.classList.add(this.CssClasses_.ICON);
          rightButtonIcon.textContent = this.Constant_.CHEVRON_RIGHT;
          rightButton.appendChild(rightButtonIcon);
          rightButton.addEventListener('click', function() {
            this.tabBar_.scrollLeft += this.Constant_.TAB_SCROLL_PIXELS;
          }.bind(this));
          tabContainer.appendChild(leftButton);
          tabContainer.appendChild(this.tabBar_);
          tabContainer.appendChild(rightButton);
          var tabScrollHandler = function() {
            if (this.tabBar_.scrollLeft > 0) {
              leftButton.classList.add(this.CssClasses_.IS_ACTIVE);
            } else {
              leftButton.classList.remove(this.CssClasses_.IS_ACTIVE);
            }
            if (this.tabBar_.scrollLeft < this.tabBar_.scrollWidth - this.tabBar_.offsetWidth) {
              rightButton.classList.add(this.CssClasses_.IS_ACTIVE);
            } else {
              rightButton.classList.remove(this.CssClasses_.IS_ACTIVE);
            }
          }.bind(this);
          this.tabBar_.addEventListener('scroll', tabScrollHandler);
          tabScrollHandler();
          if (this.tabBar_.classList.contains(this.CssClasses_.JS_RIPPLE_EFFECT)) {
            this.tabBar_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
          }
          var tabs = this.tabBar_.querySelectorAll('.' + this.CssClasses_.TAB);
          var panels = this.content_.querySelectorAll('.' + this.CssClasses_.PANEL);
          for (var i = 0; i < tabs.length; i++) {
            new MaterialLayoutTab(tabs[i], tabs, panels, this);
          }
        }
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
      }
    };
    function MaterialLayoutTab(tab, tabs, panels, layout) {
      'use strict';
      if (tab) {
        if (layout.tabBar_.classList.contains(layout.CssClasses_.JS_RIPPLE_EFFECT)) {
          var rippleContainer = document.createElement('span');
          rippleContainer.classList.add(layout.CssClasses_.RIPPLE_CONTAINER);
          rippleContainer.classList.add(layout.CssClasses_.JS_RIPPLE_EFFECT);
          var ripple = document.createElement('span');
          ripple.classList.add(layout.CssClasses_.RIPPLE);
          rippleContainer.appendChild(ripple);
          tab.appendChild(rippleContainer);
        }
        tab.addEventListener('click', function(e) {
          e.preventDefault();
          var href = tab.href.split('#')[1];
          var panel = layout.content_.querySelector('#' + href);
          layout.resetTabState_(tabs);
          layout.resetPanelState_(panels);
          tab.classList.add(layout.CssClasses_.IS_ACTIVE);
          panel.classList.add(layout.CssClasses_.IS_ACTIVE);
        });
      }
    }
    componentHandler.register({
      constructor: MaterialLayout,
      classAsString: 'MaterialLayout',
      cssClass: 'mdl-js-layout'
    });
    function MaterialDataTable(element) {
      'use strict';
      this.element_ = element;
      this.init();
    }
    MaterialDataTable.prototype.Constant_ = {};
    MaterialDataTable.prototype.CssClasses_ = {
      DATA_TABLE: 'mdl-data-table',
      SELECTABLE: 'mdl-data-table--selectable',
      IS_SELECTED: 'is-selected',
      IS_UPGRADED: 'is-upgraded'
    };
    MaterialDataTable.prototype.selectRow_ = function(checkbox, row, rows) {
      'use strict';
      if (row) {
        return function() {
          if (checkbox.checked) {
            row.classList.add(this.CssClasses_.IS_SELECTED);
          } else {
            row.classList.remove(this.CssClasses_.IS_SELECTED);
          }
        }.bind(this);
      }
      if (rows) {
        return function() {
          var i;
          var el;
          if (checkbox.checked) {
            for (i = 0; i < rows.length; i++) {
              el = rows[i].querySelector('td').querySelector('.mdl-checkbox');
              el.MaterialCheckbox.check();
              rows[i].classList.add(this.CssClasses_.IS_SELECTED);
            }
          } else {
            for (i = 0; i < rows.length; i++) {
              el = rows[i].querySelector('td').querySelector('.mdl-checkbox');
              el.MaterialCheckbox.uncheck();
              rows[i].classList.remove(this.CssClasses_.IS_SELECTED);
            }
          }
        }.bind(this);
      }
    };
    MaterialDataTable.prototype.createCheckbox_ = function(row, rows) {
      'use strict';
      var label = document.createElement('label');
      label.classList.add('mdl-checkbox');
      label.classList.add('mdl-js-checkbox');
      label.classList.add('mdl-js-ripple-effect');
      label.classList.add('mdl-data-table__select');
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('mdl-checkbox__input');
      if (row) {
        checkbox.addEventListener('change', this.selectRow_(checkbox, row));
      } else if (rows) {
        checkbox.addEventListener('change', this.selectRow_(checkbox, null, rows));
      }
      label.appendChild(checkbox);
      componentHandler.upgradeElement(label, 'MaterialCheckbox');
      return label;
    };
    MaterialDataTable.prototype.init = function() {
      'use strict';
      if (this.element_) {
        var firstHeader = this.element_.querySelector('th');
        var rows = this.element_.querySelector('tbody').querySelectorAll('tr');
        if (this.element_.classList.contains(this.CssClasses_.SELECTABLE)) {
          var th = document.createElement('th');
          var headerCheckbox = this.createCheckbox_(null, rows);
          th.appendChild(headerCheckbox);
          firstHeader.parentElement.insertBefore(th, firstHeader);
          for (var i = 0; i < rows.length; i++) {
            var firstCell = rows[i].querySelector('td');
            if (firstCell) {
              var td = document.createElement('td');
              var rowCheckbox = this.createCheckbox_(rows[i]);
              td.appendChild(rowCheckbox);
              rows[i].insertBefore(td, firstCell);
            }
          }
        }
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
      }
    };
    componentHandler.register({
      constructor: MaterialDataTable,
      classAsString: 'MaterialDataTable',
      cssClass: 'mdl-js-data-table'
    });
    function MaterialRipple(element) {
      'use strict';
      this.element_ = element;
      this.init();
    }
    MaterialRipple.prototype.Constant_ = {
      INITIAL_SCALE: 'scale(0.0001, 0.0001)',
      INITIAL_SIZE: '1px',
      INITIAL_OPACITY: '0.4',
      FINAL_OPACITY: '0',
      FINAL_SCALE: ''
    };
    MaterialRipple.prototype.CssClasses_ = {
      RIPPLE_CENTER: 'mdl-ripple--center',
      RIPPLE_EFFECT_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
      RIPPLE: 'mdl-ripple',
      IS_ANIMATING: 'is-animating',
      IS_VISIBLE: 'is-visible'
    };
    MaterialRipple.prototype.downHandler_ = function(event) {
      'use strict';
      if (!this.rippleElement_.style.width && !this.rippleElement_.style.height) {
        var rect = this.element_.getBoundingClientRect();
        this.boundHeight = rect.height;
        this.boundWidth = rect.width;
        this.rippleSize_ = Math.sqrt(rect.width * rect.width + rect.height * rect.height) * 2 + 2;
        this.rippleElement_.style.width = this.rippleSize_ + 'px';
        this.rippleElement_.style.height = this.rippleSize_ + 'px';
      }
      this.rippleElement_.classList.add(this.CssClasses_.IS_VISIBLE);
      if (event.type === 'mousedown' && this.ignoringMouseDown_) {
        this.ignoringMouseDown_ = false;
      } else {
        if (event.type === 'touchstart') {
          this.ignoringMouseDown_ = true;
        }
        var frameCount = this.getFrameCount();
        if (frameCount > 0) {
          return ;
        }
        this.setFrameCount(1);
        var bound = event.currentTarget.getBoundingClientRect();
        var x;
        var y;
        if (event.clientX === 0 && event.clientY === 0) {
          x = Math.round(bound.width / 2);
          y = Math.round(bound.height / 2);
        } else {
          var clientX = event.clientX ? event.clientX : event.touches[0].clientX;
          var clientY = event.clientY ? event.clientY : event.touches[0].clientY;
          x = Math.round(clientX - bound.left);
          y = Math.round(clientY - bound.top);
        }
        this.setRippleXY(x, y);
        this.setRippleStyles(true);
        window.requestAnimationFrame(this.animFrameHandler.bind(this));
      }
    };
    MaterialRipple.prototype.upHandler_ = function(event) {
      'use strict';
      if (event && event.detail !== 2) {
        this.rippleElement_.classList.remove(this.CssClasses_.IS_VISIBLE);
      }
    };
    MaterialRipple.prototype.init = function() {
      'use strict';
      if (this.element_) {
        var recentering = this.element_.classList.contains(this.CssClasses_.RIPPLE_CENTER);
        if (!this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT_IGNORE_EVENTS)) {
          this.rippleElement_ = this.element_.querySelector('.' + this.CssClasses_.RIPPLE);
          this.frameCount_ = 0;
          this.rippleSize_ = 0;
          this.x_ = 0;
          this.y_ = 0;
          this.ignoringMouseDown_ = false;
          this.boundDownHandler = this.downHandler_.bind(this);
          this.element_.addEventListener('mousedown', this.boundDownHandler);
          this.element_.addEventListener('touchstart', this.boundDownHandler);
          this.boundUpHandler = this.upHandler_.bind(this);
          this.element_.addEventListener('mouseup', this.boundUpHandler);
          this.element_.addEventListener('mouseleave', this.boundUpHandler);
          this.element_.addEventListener('touchend', this.boundUpHandler);
          this.element_.addEventListener('blur', this.boundUpHandler);
          this.getFrameCount = function() {
            return this.frameCount_;
          };
          this.setFrameCount = function(fC) {
            this.frameCount_ = fC;
          };
          this.getRippleElement = function() {
            return this.rippleElement_;
          };
          this.setRippleXY = function(newX, newY) {
            this.x_ = newX;
            this.y_ = newY;
          };
          this.setRippleStyles = function(start) {
            if (this.rippleElement_ !== null) {
              var transformString;
              var scale;
              var size;
              var offset = 'translate(' + this.x_ + 'px, ' + this.y_ + 'px)';
              if (start) {
                scale = this.Constant_.INITIAL_SCALE;
                size = this.Constant_.INITIAL_SIZE;
              } else {
                scale = this.Constant_.FINAL_SCALE;
                size = this.rippleSize_ + 'px';
                if (recentering) {
                  offset = 'translate(' + this.boundWidth / 2 + 'px, ' + this.boundHeight / 2 + 'px)';
                }
              }
              transformString = 'translate(-50%, -50%) ' + offset + scale;
              this.rippleElement_.style.webkitTransform = transformString;
              this.rippleElement_.style.msTransform = transformString;
              this.rippleElement_.style.transform = transformString;
              if (start) {
                this.rippleElement_.classList.remove(this.CssClasses_.IS_ANIMATING);
              } else {
                this.rippleElement_.classList.add(this.CssClasses_.IS_ANIMATING);
              }
            }
          };
          this.animFrameHandler = function() {
            if (this.frameCount_-- > 0) {
              window.requestAnimationFrame(this.animFrameHandler.bind(this));
            } else {
              this.setRippleStyles(false);
            }
          };
        }
      }
    };
    MaterialRipple.prototype.mdlDowngrade_ = function() {
      'use strict';
      this.element_.removeEventListener('mousedown', this.boundDownHandler);
      this.element_.removeEventListener('touchstart', this.boundDownHandler);
      this.element_.removeEventListener('mouseup', this.boundUpHandler);
      this.element_.removeEventListener('mouseleave', this.boundUpHandler);
      this.element_.removeEventListener('touchend', this.boundUpHandler);
      this.element_.removeEventListener('blur', this.boundUpHandler);
    };
    componentHandler.register({
      constructor: MaterialRipple,
      classAsString: 'MaterialRipple',
      cssClass: 'mdl-js-ripple-effect',
      widget: false
    });
    this["componentHandler"] = componentHandler;
  }).call(System.global);
  return System.get("@@global-helpers").retrieveGlobal(__module.id, false);
});

System.register("github:google/material-design-lite@1.0.2", ["github:google/material-design-lite@1.0.2/material"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("github:google/material-design-lite@1.0.2/material");
  global.define = __define;
  return module.exports;
});

(function() {
function define(){};  define.amd = {};
System.register("github:jbellsey/material-decorator@master/material-decorator", ["github:google/material-design-lite@1.0.2"], false, function(__require, __exports, __module) {
  return (function(exports, _googleMaterialDesignLite) {
    'use strict';
    exports.__esModule = true;
    exports.enableMDL = enableMDL;
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {'default': obj};
    }
    var _MDL = _interopRequireDefault(_googleMaterialDesignLite);
    function setupMDL() {
      (_MDL['default'].upgradeDom || _MDL['default'].componentHandler.upgradeDom())();
    }
    function enableMDL(viewModelClass) {
      var originalHandler = viewModelClass.prototype.attached;
      if (typeof originalHandler !== 'undefined') {
        viewModelClass.prototype.attached = function() {
          for (var _len = arguments.length,
              args = Array(_len),
              _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          originalHandler.call.apply(originalHandler, [this].concat(args));
          setupMDL();
        };
      } else
        viewModelClass.prototype.attached = setupMDL;
    }
  }).call(__exports, __exports, __require('github:google/material-design-lite@1.0.2'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:jbellsey/material-decorator@master", ["github:jbellsey/material-decorator@master/material-decorator"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:jbellsey/material-decorator@master/material-decorator'));
});
})();
System.register("npm:process@0.10.1/browser", [], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var process = module.exports = {};
  var queue = [];
  var draining = false;
  function drainQueue() {
    if (draining) {
      return ;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while (len) {
      currentQueue = queue;
      queue = [];
      var i = -1;
      while (++i < len) {
        currentQueue[i]();
      }
      len = queue.length;
    }
    draining = false;
  }
  process.nextTick = function(fun) {
    queue.push(fun);
    if (!draining) {
      setTimeout(drainQueue, 0);
    }
  };
  process.title = 'browser';
  process.browser = true;
  process.env = {};
  process.argv = [];
  process.version = '';
  process.versions = {};
  function noop() {}
  process.on = noop;
  process.addListener = noop;
  process.once = noop;
  process.off = noop;
  process.removeListener = noop;
  process.removeAllListeners = noop;
  process.emit = noop;
  process.binding = function(name) {
    throw new Error('process.binding is not supported');
  };
  process.cwd = function() {
    return '/';
  };
  process.chdir = function(dir) {
    throw new Error('process.chdir is not supported');
  };
  process.umask = function() {
    return 0;
  };
  global.define = __define;
  return module.exports;
});

(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/history@0.6.1/aurelia-history", [], false, function(__require, __exports, __module) {
  return (function(exports) {
    'use strict';
    exports.__esModule = true;
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var History = (function() {
      function History() {
        _classCallCheck(this, History);
      }
      History.prototype.activate = function activate(options) {
        throw new Error('History must implement activate().');
      };
      History.prototype.deactivate = function deactivate() {
        throw new Error('History must implement deactivate().');
      };
      History.prototype.navigate = function navigate(fragment, options) {
        throw new Error('History must implement navigate().');
      };
      History.prototype.navigateBack = function navigateBack() {
        throw new Error('History must implement navigateBack().');
      };
      return History;
    })();
    exports.History = History;
  }).call(__exports, __exports);
});
})();
System.register("npm:process@0.10.1", ["npm:process@0.10.1/browser"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("npm:process@0.10.1/browser");
  global.define = __define;
  return module.exports;
});

(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/history@0.6.1", ["github:aurelia/history@0.6.1/aurelia-history"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/history@0.6.1/aurelia-history'));
});
})();
System.register("github:jspm/nodelibs-process@0.1.1/index", ["npm:process@0.10.1"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = System._nodeRequire ? process : require("npm:process@0.10.1");
  global.define = __define;
  return module.exports;
});

System.register("github:jspm/nodelibs-process@0.1.1", ["github:jspm/nodelibs-process@0.1.1/index"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("github:jspm/nodelibs-process@0.1.1/index");
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18/client/shim.min", ["github:jspm/nodelibs-process@0.1.1"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "format cjs";
  (function(process) {
    !function(a) {
      "use strict";
      var b = null,
          c = null;
      !function(c) {
        function a(d) {
          if (b[d])
            return b[d].exports;
          var e = b[d] = {
            exports: {},
            id: d,
            loaded: !1
          };
          return c[d].call(e.exports, e, e.exports, a), e.loaded = !0, e.exports;
        }
        var b = {};
        return a.m = c, a.c = b, a.p = "", a(0);
      }([function(b, c, a) {
        a(10), a(20), a(24), a(26), a(28), a(30), a(31), a(32), a(33), a(34), a(35), a(36), a(37), a(38), a(39), a(43), a(44), a(45), a(46), a(48), a(49), a(52), a(53), a(54), a(1), a(56), a(57), a(58), a(59), a(60), a(64), a(67), a(68), a(70), a(71), a(73), a(74), a(75), a(77), a(78), a(79), a(80), a(81), a(83), a(84), a(85), a(86), a(88);
      }, function(f, g, b) {
        var c = b(2),
            e = b(4),
            d = c.toIndex;
        e(e.P, "Array", {copyWithin: function(k, l) {
            var f = Object(c.assertDefined(this)),
                g = c.toLength(f.length),
                b = d(k, g),
                e = d(l, g),
                j = arguments[2],
                m = j === a ? g : d(j, g),
                h = Math.min(m - e, g - b),
                i = 1;
            for (b > e && e + h > b && (i = -1, e = e + h - 1, b = b + h - 1); h-- > 0; )
              e in f ? f[b] = f[e] : delete f[b], b += i, e += i;
            return f;
          }}), b(7)("copyWithin");
      }, function(w, x, v) {
        function e(a) {
          return isNaN(a = +a) ? 0 : (a > 0 ? r : q)(a);
        }
        function h(a, b) {
          return {
            enumerable: !(1 & a),
            configurable: !(2 & a),
            writable: !(4 & a),
            value: b
          };
        }
        function i(a, b, c) {
          return a[b] = c, a;
        }
        function j(a) {
          return k ? function(b, c, d) {
            return g.setDesc(b, c, h(a, d));
          } : i;
        }
        function u(a) {
          return null !== a && ("object" == typeof a || "function" == typeof a);
        }
        function t(a) {
          return "function" == typeof a;
        }
        function m(b) {
          if (b == a)
            throw TypeError("Can't call method on  " + b);
          return b;
        }
        var d = "undefined" != typeof self ? self : Function("return this")(),
            o = {},
            n = Object.defineProperty,
            p = {}.hasOwnProperty,
            q = Math.ceil,
            r = Math.floor,
            s = Math.max,
            l = Math.min,
            k = !!function() {
              try {
                return 2 == n({}, "a", {get: function() {
                    return 2;
                  }}).a;
              } catch (a) {}
            }(),
            f = j(1),
            g = w.exports = v(3)({
              g: d,
              core: o,
              html: d.document && document.documentElement,
              isObject: u,
              isFunction: t,
              that: function() {
                return this;
              },
              toInteger: e,
              toLength: function(a) {
                return a > 0 ? l(e(a), 9007199254740991) : 0;
              },
              toIndex: function(a, b) {
                return a = e(a), 0 > a ? s(a + b, 0) : l(a, b);
              },
              has: function(a, b) {
                return p.call(a, b);
              },
              create: Object.create,
              getProto: Object.getPrototypeOf,
              DESC: k,
              desc: h,
              getDesc: Object.getOwnPropertyDescriptor,
              setDesc: n,
              setDescs: Object.defineProperties,
              getKeys: Object.keys,
              getNames: Object.getOwnPropertyNames,
              getSymbols: Object.getOwnPropertySymbols,
              assertDefined: m,
              ES5Object: Object,
              toObject: function(a) {
                return g.ES5Object(m(a));
              },
              hide: f,
              def: j(0),
              set: d.Symbol ? i : f,
              each: [].forEach
            });
        a !== b && (b = o), a !== c && (c = d);
      }, function(a) {
        a.exports = function(a) {
          return a.FW = !0, a.path = a.g, a;
        };
      }, function(g, j, e) {
        function f(a, b) {
          return function() {
            return a.apply(b, arguments);
          };
        }
        function a(k, l, p) {
          var g,
              m,
              e,
              q,
              o = k & a.G,
              r = k & a.P,
              j = o ? b : k & a.S ? b[l] : (b[l] || {}).prototype,
              n = o ? d : d[l] || (d[l] = {});
          o && (p = l);
          for (g in p)
            m = !(k & a.F) && j && g in j, e = (m ? j : p)[g], q = k & a.B && m ? f(e, b) : r && h(e) ? f(Function.call, e) : e, j && !m && i(j, g, e), n[g] != e && c.hide(n, g, q), r && ((n.prototype || (n.prototype = {}))[g] = e);
        }
        var c = e(2),
            b = c.g,
            d = c.core,
            h = c.isFunction,
            i = e(5);
        b.core = d, a.F = 1, a.G = 2, a.S = 4, a.P = 8, a.B = 16, a.W = 32, g.exports = a;
      }, function(f, h, c) {
        function d(e, c, d, h) {
          if (a.isFunction(d)) {
            var f = e[c];
            a.hide(d, b, f ? f + "" : g.replace(/hasOwnProperty/, c + "")), "name" in d || (d.name = c);
          }
          e === a.g ? e[c] = d : (h || delete e[c], a.hide(e, c, d));
        }
        var a = c(2),
            g = {}.hasOwnProperty + "",
            b = c(6).safe("src"),
            e = Function.toString;
        d(Function.prototype, "toString", function() {
          return a.has(this, b) ? this[b] : e.call(this);
        }), a.core.inspectSource = function(a) {
          return e.call(a);
        }, f.exports = d;
      }, function(c, f, d) {
        function b(b) {
          return "Symbol(".concat(b === a ? "" : b, ")_", (++e + Math.random()).toString(36));
        }
        var e = 0;
        b.safe = d(2).g.Symbol || b, c.exports = b;
      }, function(c, d, b) {
        var a = b(8)("unscopables");
        a in [] || b(2).hide(Array.prototype, a, {}), c.exports = function(b) {
          [][a][b] = !0;
        };
      }, function(d, e, a) {
        var b = a(2).g,
            c = a(9)("wks");
        d.exports = function(d) {
          return c[d] || (c[d] = b.Symbol && b.Symbol[d] || a(6).safe("Symbol." + d));
        };
      }, function(d, f, e) {
        var a = e(2),
            b = "__core-js_shared__",
            c = a.g[b] || (a.g[b] = {});
        d.exports = function(a) {
          return c[a] || (c[a] = {});
        };
      }, function(U, T, d) {
        function F(a, b) {
          return function(g) {
            var c,
                e = t(g),
                f = 0,
                d = [];
            for (c in e)
              c != m && l(e, c) && d.push(c);
            for (; b > f; )
              l(e, c = a[f++]) && (~D(d, c) || d.push(c));
            return d;
          };
        }
        function s() {}
        function C(a) {
          return function(h, d) {
            i.fn(h);
            var c = t(this),
                e = f(c.length),
                b = a ? e - 1 : 0,
                g = a ? -1 : 1;
            if (arguments.length < 2)
              for (; ; ) {
                if (b in c) {
                  d = c[b], b += g;
                  break;
                }
                b += g, i(a ? b >= 0 : e > b, "Reduce of empty array with no initial value");
              }
            for (; a ? b >= 0 : e > b; b += g)
              b in c && (d = h(d, c[b], b, this));
            return d;
          };
        }
        function e(a) {
          return a > 9 ? a : "0" + a;
        }
        var b = d(2),
            A = d(11),
            g = d(12),
            c = d(4),
            O = d(13),
            h = d(14),
            m = d(6).safe("__proto__"),
            i = d(16),
            p = i.obj,
            y = Object.prototype,
            q = b.html,
            v = [],
            j = v.slice,
            P = v.join,
            z = g.classof,
            l = b.has,
            I = b.setDesc,
            Q = b.getDesc,
            u = b.setDescs,
            x = b.isFunction,
            o = b.isObject,
            t = b.toObject,
            f = b.toLength,
            B = b.toIndex,
            r = !1,
            D = d(17)(!1),
            R = h(0),
            J = h(1),
            K = h(2),
            L = h(3),
            M = h(4);
        if (!b.DESC) {
          try {
            r = 8 == I(A("div"), "x", {get: function() {
                return 8;
              }}).x;
          } catch (S) {}
          b.setDesc = function(b, c, a) {
            if (r)
              try {
                return I(b, c, a);
              } catch (d) {}
            if ("get" in a || "set" in a)
              throw TypeError("Accessors not supported!");
            return "value" in a && (p(b)[c] = a.value), b;
          }, b.getDesc = function(c, d) {
            if (r)
              try {
                return Q(c, d);
              } catch (e) {}
            return l(c, d) ? b.desc(!y.propertyIsEnumerable.call(c, d), c[d]) : a;
          }, b.setDescs = u = function(a, c) {
            p(a);
            for (var d,
                e = b.getKeys(c),
                g = e.length,
                f = 0; g > f; )
              b.setDesc(a, d = e[f++], c[d]);
            return a;
          };
        }
        c(c.S + c.F * !b.DESC, "Object", {
          getOwnPropertyDescriptor: b.getDesc,
          defineProperty: b.setDesc,
          defineProperties: u
        });
        var n = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(","),
            G = n.concat("length", "prototype"),
            H = n.length,
            k = function() {
              var a,
                  b = A("iframe"),
                  c = H,
                  d = ">";
              for (b.style.display = "none", q.appendChild(b), b.src = "javascript:", a = b.contentWindow.document, a.open(), a.write("<script>document.F=Object</script" + d), a.close(), k = a.F; c--; )
                delete k.prototype[n[c]];
              return k();
            };
        c(c.S, "Object", {
          getPrototypeOf: b.getProto = b.getProto || function(a) {
            return a = Object(i.def(a)), l(a, m) ? a[m] : x(a.constructor) && a instanceof a.constructor ? a.constructor.prototype : a instanceof Object ? y : null;
          },
          getOwnPropertyNames: b.getNames = b.getNames || F(G, G.length, !0),
          create: b.create = b.create || function(c, d) {
            var b;
            return null !== c ? (s.prototype = p(c), b = new s, s.prototype = null, b[m] = c) : b = k(), d === a ? b : u(b, d);
          },
          keys: b.getKeys = b.getKeys || F(n, H, !1),
          seal: function(a) {
            return a;
          },
          freeze: function(a) {
            return a;
          },
          preventExtensions: function(a) {
            return a;
          },
          isSealed: function(a) {
            return !o(a);
          },
          isFrozen: function(a) {
            return !o(a);
          },
          isExtensible: function(a) {
            return o(a);
          }
        }), c(c.P, "Function", {bind: function(d) {
            function c() {
              var h = e.concat(j.call(arguments)),
                  f = this instanceof c,
                  g = f ? b.create(a.prototype) : d,
                  i = O(a, h, g);
              return f ? g : i;
            }
            var a = i.fn(this),
                e = j.call(arguments, 1);
            return a.prototype && (c.prototype = a.prototype), c;
          }}), 0 in Object("z") && "z" == "z"[0] || (b.ES5Object = function(a) {
          return "String" == g(a) ? a.split("") : Object(a);
        });
        var E = !0;
        try {
          q && j.call(q), E = !1;
        } catch (S) {}
        c(c.P + c.F * E, "Array", {slice: function(h, b) {
            var d = f(this.length),
                i = g(this);
            if (b = b === a ? d : b, "Array" == i)
              return j.call(this, h, b);
            for (var e = B(h, d),
                m = B(b, d),
                k = f(m - e),
                l = Array(k),
                c = 0; k > c; c++)
              l[c] = "String" == i ? this.charAt(e + c) : this[e + c];
            return l;
          }}), c(c.P + c.F * (b.ES5Object != Object), "Array", {join: function() {
            return P.apply(b.ES5Object(this), arguments);
          }}), c(c.S, "Array", {isArray: function(a) {
            return "Array" == g(a);
          }}), c(c.P, "Array", {
          forEach: b.each = b.each || function(a) {
            return R(this, a, arguments[1]);
          },
          map: function(a) {
            return J(this, a, arguments[1]);
          },
          filter: function(a) {
            return K(this, a, arguments[1]);
          },
          some: function(a) {
            return L(this, a, arguments[1]);
          },
          every: function(a) {
            return M(this, a, arguments[1]);
          },
          reduce: C(!1),
          reduceRight: C(!0),
          indexOf: function(a) {
            return D(this, a, arguments[1]);
          },
          lastIndexOf: function(e, g) {
            var c = t(this),
                d = f(c.length),
                a = d - 1;
            for (arguments.length > 1 && (a = Math.min(a, b.toInteger(g))), 0 > a && (a = f(d + a)); a >= 0; a--)
              if (a in c && c[a] === e)
                return a;
            return -1;
          }
        }), c(c.P, "String", {trim: d(18)(/^\s*([\s\S]*\S)?\s*$/, "$1")}), c(c.S, "Date", {now: function() {
            return +new Date;
          }});
        var w = new Date(-5e13 - 1),
            N = !(w.toISOString && "0385-07-25T07:06:39.999Z" == w.toISOString() && d(19)(function() {
              new Date(NaN).toISOString();
            }));
        c(c.P + c.F * N, "Date", {toISOString: function() {
            if (!isFinite(this))
              throw RangeError("Invalid time value");
            var a = this,
                b = a.getUTCFullYear(),
                c = a.getUTCMilliseconds(),
                d = 0 > b ? "-" : b > 9999 ? "+" : "";
            return d + ("00000" + Math.abs(b)).slice(d ? -6 : -4) + "-" + e(a.getUTCMonth() + 1) + "-" + e(a.getUTCDate()) + "T" + e(a.getUTCHours()) + ":" + e(a.getUTCMinutes()) + ":" + e(a.getUTCSeconds()) + "." + (c > 99 ? c : "0" + e(c)) + "Z";
          }}), "Object" == z(function() {
          return arguments;
        }()) && (g.classof = function(a) {
          var b = z(a);
          return "Object" == b && x(a.callee) ? "Arguments" : b;
        });
      }, function(d, g, e) {
        var b = e(2),
            a = b.g.document,
            c = b.isObject,
            f = c(a) && c(a.createElement);
        d.exports = function(b) {
          return f ? a.createElement(b) : {};
        };
      }, function(f, h, d) {
        function b(a) {
          return g.call(a).slice(8, -1);
        }
        var e = d(2),
            c = d(8)("toStringTag"),
            g = {}.toString;
        b.classof = function(d) {
          var e,
              f;
          return d == a ? d === a ? "Undefined" : "Null" : "string" == typeof(f = (e = Object(d))[c]) ? f : b(e);
        }, b.set = function(a, b, d) {
          a && !e.has(a = d ? a : a.prototype, c) && e.hide(a, c, b);
        }, f.exports = b;
      }, function(b) {
        b.exports = function(c, b, d) {
          var e = d === a;
          switch (b.length) {
            case 0:
              return e ? c() : c.call(d);
            case 1:
              return e ? c(b[0]) : c.call(d, b[0]);
            case 2:
              return e ? c(b[0], b[1]) : c.call(d, b[0], b[1]);
            case 3:
              return e ? c(b[0], b[1], b[2]) : c.call(d, b[0], b[1], b[2]);
            case 4:
              return e ? c(b[0], b[1], b[2], b[3]) : c.call(d, b[0], b[1], b[2], b[3]);
            case 5:
              return e ? c(b[0], b[1], b[2], b[3], b[4]) : c.call(d, b[0], b[1], b[2], b[3], b[4]);
          }
          return c.apply(d, b);
        };
      }, function(d, f, c) {
        var b = c(2),
            e = c(15);
        d.exports = function(c) {
          var f = 1 == c,
              h = 2 == c,
              i = 3 == c,
              d = 4 == c,
              g = 6 == c,
              j = 5 == c || g;
          return function(u, s, t) {
            for (var l,
                n,
                q = Object(b.assertDefined(u)),
                o = b.ES5Object(q),
                r = e(s, t, 3),
                p = b.toLength(o.length),
                k = 0,
                m = f ? Array(p) : h ? [] : a; p > k; k++)
              if ((j || k in o) && (l = o[k], n = r(l, k, q), c))
                if (f)
                  m[k] = n;
                else if (n)
                  switch (c) {
                    case 3:
                      return !0;
                    case 5:
                      return l;
                    case 6:
                      return k;
                    case 2:
                      m.push(l);
                  }
                else if (d)
                  return !1;
            return g ? -1 : i || d ? d : m;
          };
        };
      }, function(b, e, c) {
        var d = c(16).fn;
        b.exports = function(b, c, e) {
          if (d(b), ~e && c === a)
            return b;
          switch (e) {
            case 1:
              return function(a) {
                return b.call(c, a);
              };
            case 2:
              return function(a, d) {
                return b.call(c, a, d);
              };
            case 3:
              return function(a, d, e) {
                return b.call(c, a, d, e);
              };
          }
          return function() {
            return b.apply(c, arguments);
          };
        };
      }, function(c, e, d) {
        function a(c, a, b) {
          if (!c)
            throw TypeError(b ? a + b : a);
        }
        var b = d(2);
        a.def = b.assertDefined, a.fn = function(a) {
          if (!b.isFunction(a))
            throw TypeError(a + " is not a function!");
          return a;
        }, a.obj = function(a) {
          if (!b.isObject(a))
            throw TypeError(a + " is not an object!");
          return a;
        }, a.inst = function(a, b, c) {
          if (!(a instanceof b))
            throw TypeError(c + ": use the 'new' operator!");
          return a;
        }, c.exports = a;
      }, function(b, d, c) {
        var a = c(2);
        b.exports = function(b) {
          return function(h, e, i) {
            var f,
                d = a.toObject(h),
                g = a.toLength(d.length),
                c = a.toIndex(i, g);
            if (b && e != e) {
              for (; g > c; )
                if (f = d[c++], f != f)
                  return !0;
            } else
              for (; g > c; c++)
                if ((b || c in d) && d[c] === e)
                  return b || c;
            return !b && -1;
          };
        };
      }, function(a) {
        a.exports = function(b, a, c) {
          var d = a === Object(a) ? function(b) {
            return a[b];
          } : a;
          return function(a) {
            return ((c ? a : this) + "").replace(b, d);
          };
        };
      }, function(a) {
        a.exports = function(a) {
          try {
            return a(), !1;
          } catch (b) {
            return !0;
          }
        };
      }, function(O, N, e) {
        function G(a) {
          var e = i[a] = b.set(k(f.prototype), H, a);
          return w && l && o(j, a, {
            configurable: !0,
            set: function(b) {
              d(this, c) && d(this[c], a) && (this[c][a] = !1), o(this, a, r(1, b));
            }
          }), e;
        }
        function t(a, b, e) {
          return e && d(i, b) ? (e.enumerable ? (d(a, c) && a[c][b] && (a[c][b] = !1), e = k(e, {enumerable: r(0, !1)})) : (d(a, c) || g(a, c, r(1, {})), a[c][b] = !0), o(a, b, e)) : g(a, b, e);
        }
        function q(a, b) {
          J(a);
          for (var c,
              d = K(b = n(b)),
              e = 0,
              f = d.length; f > e; )
            t(a, c = d[e++], b[c]);
          return a;
        }
        function v(b, c) {
          return c === a ? k(b) : q(k(b), c);
        }
        function M(a) {
          var b = I.call(this, a);
          return b || !d(this, a) || !d(i, a) || d(this, c) && this[c][a] ? b : !0;
        }
        function A(a, b) {
          var e = z(a = n(a), b);
          return !e || !d(i, b) || d(a, c) && a[c][b] || (e.enumerable = !0), e;
        }
        function E(g) {
          for (var a,
              b = D(n(g)),
              e = [],
              f = 0; b.length > f; )
            d(i, a = b[f++]) || a == c || e.push(a);
          return e;
        }
        function F(f) {
          for (var a,
              b = D(n(f)),
              c = [],
              e = 0; b.length > e; )
            d(i, a = b[e++]) && c.push(i[a]);
          return c;
        }
        var b = e(2),
            s = e(12).set,
            p = e(6),
            y = e(9),
            h = e(4),
            B = e(5),
            L = e(21),
            K = e(22),
            J = e(16).obj,
            j = Object.prototype,
            w = b.DESC,
            d = b.has,
            k = b.create,
            z = b.getDesc,
            g = b.setDesc,
            r = b.desc,
            C = e(23),
            D = C.get,
            n = b.toObject,
            f = b.g.Symbol,
            l = !1,
            H = p("tag"),
            c = p("hidden"),
            I = {}.propertyIsEnumerable,
            m = y("symbol-registry"),
            i = y("symbols"),
            u = b.isFunction(f),
            o = w ? function() {
              try {
                return k(g({}, c, {get: function() {
                    return g(this, c, {value: !1})[c];
                  }}))[c] || g;
              } catch (a) {
                return function(c, a, d) {
                  var b = z(j, a);
                  b && delete j[a], g(c, a, d), b && c !== j && g(j, a, b);
                };
              }
            }() : g;
        u || (f = function() {
          if (this instanceof f)
            throw TypeError("Symbol is not a constructor");
          return G(p(arguments[0]));
        }, B(f.prototype, "toString", function() {
          return this[H];
        }), b.create = v, b.setDesc = t, b.getDesc = A, b.setDescs = q, b.getNames = C.get = E, b.getSymbols = F, b.DESC && b.FW && B(j, "propertyIsEnumerable", M, !0));
        var x = {
          "for": function(a) {
            return d(m, a += "") ? m[a] : m[a] = f(a);
          },
          keyFor: function(a) {
            return L(m, a);
          },
          useSetter: function() {
            l = !0;
          },
          useSimple: function() {
            l = !1;
          }
        };
        b.each.call("hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), function(a) {
          var b = e(8)(a);
          x[a] = u ? b : G(b);
        }), l = !0, h(h.G + h.W, {Symbol: f}), h(h.S, "Symbol", x), h(h.S + h.F * !u, "Object", {
          create: v,
          defineProperty: t,
          defineProperties: q,
          getOwnPropertyDescriptor: A,
          getOwnPropertyNames: E,
          getOwnPropertySymbols: F
        }), s(f, "Symbol"), s(Math, "Math", !0), s(b.g.JSON, "JSON", !0);
      }, function(b, d, c) {
        var a = c(2);
        b.exports = function(f, g) {
          for (var b,
              c = a.toObject(f),
              d = a.getKeys(c),
              h = d.length,
              e = 0; h > e; )
            if (c[b = d[e++]] === g)
              return b;
        };
      }, function(b, d, c) {
        var a = c(2);
        b.exports = function(b) {
          var c = a.getKeys(b),
              e = a.getDesc,
              d = a.getSymbols;
          return d && a.each.call(d(b), function(a) {
            e(b, a).enumerable && c.push(a);
          }), c;
        };
      }, function(d, h, e) {
        function f(a) {
          try {
            return b(a);
          } catch (d) {
            return c.slice();
          }
        }
        var a = e(2),
            g = {}.toString,
            b = a.getNames,
            c = "object" == typeof window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
        d.exports.get = function(d) {
          return c && "[object Window]" == g.call(d) ? f(d) : b(a.toObject(d));
        };
      }, function(c, d, a) {
        var b = a(4);
        b(b.S, "Object", {assign: a(25)});
      }, function(c, e, a) {
        var b = a(2),
            d = a(22);
        c.exports = Object.assign || function(i) {
          for (var a = Object(b.assertDefined(i)),
              j = arguments.length,
              c = 1; j > c; )
            for (var e,
                f = b.ES5Object(arguments[c++]),
                g = d(f),
                k = g.length,
                h = 0; k > h; )
              a[e = g[h++]] = f[e];
          return a;
        };
      }, function(c, d, a) {
        var b = a(4);
        b(b.S, "Object", {is: a(27)});
      }, function(a) {
        a.exports = Object.is || function(a, b) {
          return a === b ? 0 !== a || 1 / a === 1 / b : a != a && b != b;
        };
      }, function(c, d, a) {
        var b = a(4);
        b(b.S, "Object", {setPrototypeOf: a(29).set});
      }, function(f, g, b) {
        function c(b, a) {
          e.obj(b), e(null === a || d.isObject(a), a, ": can't set as prototype!");
        }
        var d = b(2),
            e = b(16);
        f.exports = {
          set: Object.setPrototypeOf || ("__proto__" in {} ? function(e, a) {
            try {
              a = b(15)(Function.call, d.getDesc(Object.prototype, "__proto__").set, 2), a({}, []);
            } catch (f) {
              e = !0;
            }
            return function(b, d) {
              return c(b, d), e ? b.__proto__ = d : a(b, d), b;
            };
          }() : a),
          check: c
        };
      }, function(d, e, a) {
        var b = a(12),
            c = {};
        c[a(8)("toStringTag")] = "z", a(2).FW && "z" != b(c) && a(5)(Object.prototype, "toString", function() {
          return "[object " + b.classof(this) + "]";
        }, !0);
      }, function(f, g, c) {
        var b = c(2),
            d = c(4),
            a = b.isObject,
            e = b.toObject;
        b.each.call("freeze,seal,preventExtensions,isFrozen,isSealed,isExtensible,getOwnPropertyDescriptor,getPrototypeOf,keys,getOwnPropertyNames".split(","), function(h, g) {
          var f = (b.core.Object || {})[h] || Object[h],
              i = 0,
              j = {};
          j[h] = 0 == g ? function(b) {
            return a(b) ? f(b) : b;
          } : 1 == g ? function(b) {
            return a(b) ? f(b) : b;
          } : 2 == g ? function(b) {
            return a(b) ? f(b) : b;
          } : 3 == g ? function(b) {
            return a(b) ? f(b) : !0;
          } : 4 == g ? function(b) {
            return a(b) ? f(b) : !0;
          } : 5 == g ? function(b) {
            return a(b) ? f(b) : !1;
          } : 6 == g ? function(a, b) {
            return f(e(a), b);
          } : 7 == g ? function(a) {
            return f(Object(b.assertDefined(a)));
          } : 8 == g ? function(a) {
            return f(e(a));
          } : c(23).get;
          try {
            f("z");
          } catch (k) {
            i = 1;
          }
          d(d.S + d.F * i, "Object", j);
        });
      }, function(f, g, e) {
        var a = e(2),
            b = "name",
            c = a.setDesc,
            d = Function.prototype;
        b in d || a.FW && a.DESC && c(d, b, {
          configurable: !0,
          get: function() {
            var d = (this + "").match(/^\s*function ([^ (]*)/),
                e = d ? d[1] : "";
            return a.has(this, b) || c(this, b, a.desc(5, e)), e;
          },
          set: function(d) {
            a.has(this, b) || c(this, b, a.desc(0, d));
          }
        });
      }, function(e, f, b) {
        var a = b(2),
            c = b(8)("hasInstance"),
            d = Function.prototype;
        c in d || a.setDesc(d, c, {value: function(b) {
            if (!a.isFunction(this) || !a.isObject(b))
              return !1;
            if (!a.isObject(this.prototype))
              return b instanceof this;
            for (; b = a.getProto(b); )
              if (this.prototype === b)
                return !0;
            return !1;
          }});
      }, function(l, k, f) {
        function j(a) {
          var b,
              c;
          if (h(b = a.valueOf) && !d(c = b.call(a)))
            return c;
          if (h(b = a.toString) && !d(c = b.call(a)))
            return c;
          throw TypeError("Can't convert object to number");
        }
        function e(a) {
          if (d(a) && (a = j(a)), "string" == typeof a && a.length > 2 && 48 == a.charCodeAt(0)) {
            var b = !1;
            switch (a.charCodeAt(1)) {
              case 66:
              case 98:
                b = !0;
              case 79:
              case 111:
                return parseInt(a.slice(2), b ? 2 : 8);
            }
          }
          return +a;
        }
        var a = f(2),
            d = a.isObject,
            h = a.isFunction,
            i = "Number",
            b = a.g[i],
            c = b,
            g = b.prototype;
        !a.FW || b("0o1") && b("0b1") || (b = function(a) {
          return this instanceof b ? new c(e(a)) : e(a);
        }, a.each.call(a.DESC ? a.getNames(c) : "MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","), function(d) {
          a.has(c, d) && !a.has(b, d) && a.setDesc(b, d, a.getDesc(c, d));
        }), b.prototype = g, g.constructor = b, f(5)(a.g, i, b));
      }, function(i, j, b) {
        function c(a) {
          return !d.isObject(a) && f(a) && h(a) === a;
        }
        var d = b(2),
            e = b(4),
            g = Math.abs,
            h = Math.floor,
            f = d.g.isFinite,
            a = 9007199254740991;
        e(e.S, "Number", {
          EPSILON: Math.pow(2, -52),
          isFinite: function(a) {
            return "number" == typeof a && f(a);
          },
          isInteger: c,
          isNaN: function(a) {
            return a != a;
          },
          isSafeInteger: function(b) {
            return c(b) && g(b) <= a;
          },
          MAX_SAFE_INTEGER: a,
          MIN_SAFE_INTEGER: -a,
          parseFloat: parseFloat,
          parseInt: parseInt
        });
      }, function(u, t, r) {
        function q(a) {
          return a + 1 / k - 1 / k;
        }
        function l(a) {
          return 0 == (a = +a) || a != a ? a : 0 > a ? -1 : 1;
        }
        function n(b) {
          return isFinite(b = +b) && 0 != b ? 0 > b ? -n(-b) : a(b + g(b * b + 1)) : b;
        }
        function d(a) {
          return 0 == (a = +a) ? a : a > -1e-6 && 1e-6 > a ? a + a * a / 2 : b(a) - 1;
        }
        var e = 1 / 0,
            m = r(4),
            j = Math.E,
            c = Math.pow,
            h = Math.abs,
            b = Math.exp,
            a = Math.log,
            g = Math.sqrt,
            p = Math.ceil,
            o = Math.floor,
            k = c(2, -52),
            f = c(2, -23),
            s = c(2, 127) * (2 - f),
            i = c(2, -126);
        m(m.S, "Math", {
          acosh: function(b) {
            return (b = +b) < 1 ? NaN : isFinite(b) ? a(b / j + g(b + 1) * g(b - 1) / j) + 1 : b;
          },
          asinh: n,
          atanh: function(b) {
            return 0 == (b = +b) ? b : a((1 + b) / (1 - b)) / 2;
          },
          cbrt: function(a) {
            return l(a = +a) * c(h(a), 1 / 3);
          },
          clz32: function(b) {
            return (b >>>= 0) ? 31 - o(a(b + .5) * Math.LOG2E) : 32;
          },
          cosh: function(a) {
            return (b(a = +a) + b(-a)) / 2;
          },
          expm1: d,
          fround: function(g) {
            var c,
                a,
                b = h(g),
                d = l(g);
            return i > b ? d * q(b / i / f) * i * f : (c = (1 + f / k) * b, a = c - (c - b), a > s || a != a ? d * e : d * a);
          },
          hypot: function() {
            for (var a,
                b,
                d = 0,
                f = 0,
                i = arguments.length,
                c = 0; i > f; )
              a = h(arguments[f++]), a > c ? (b = c / a, d = d * b * b + 1, c = a) : a > 0 ? (b = a / c, d += b * b) : d += a;
            return c === e ? e : c * g(d);
          },
          imul: function(f, g) {
            var a = 65535,
                b = +f,
                c = +g,
                d = a & b,
                e = a & c;
            return 0 | d * e + ((a & b >>> 16) * e + d * (a & c >>> 16) << 16 >>> 0);
          },
          log1p: function(b) {
            return (b = +b) > -1e-8 && 1e-8 > b ? b - b * b / 2 : a(1 + b);
          },
          log10: function(b) {
            return a(b) / Math.LN10;
          },
          log2: function(b) {
            return a(b) / Math.LN2;
          },
          sign: l,
          sinh: function(a) {
            return h(a = +a) < 1 ? (d(a) - d(-a)) / 2 : (b(a - 1) - b(-a - 1)) * (j / 2);
          },
          tanh: function(a) {
            var c = d(a = +a),
                f = d(-a);
            return c == e ? 1 : f == e ? -1 : (c - f) / (b(a) + b(-a));
          },
          trunc: function(a) {
            return (a > 0 ? o : p)(a);
          }
        });
      }, function(f, g, b) {
        var a = b(4),
            e = b(2).toIndex,
            c = String.fromCharCode,
            d = String.fromCodePoint;
        a(a.S + a.F * (!!d && 1 != d.length), "String", {fromCodePoint: function() {
            for (var a,
                b = [],
                f = arguments.length,
                d = 0; f > d; ) {
              if (a = +arguments[d++], e(a, 1114111) !== a)
                throw RangeError(a + " is not a valid code point");
              b.push(65536 > a ? c(a) : c(((a -= 65536) >> 10) + 55296, a % 1024 + 56320));
            }
            return b.join("");
          }});
      }, function(d, e, a) {
        var b = a(2),
            c = a(4);
        c(c.S, "String", {raw: function(e) {
            for (var d = b.toObject(e.raw),
                f = b.toLength(d.length),
                g = arguments.length,
                c = [],
                a = 0; f > a; )
              c.push(d[a++] + ""), g > a && c.push(arguments[a] + "");
            return c.join("");
          }});
      }, function(g, h, a) {
        var d = a(2).set,
            e = a(40)(!0),
            b = a(6).safe("iter"),
            f = a(41),
            c = f.step;
        a(42)(String, "String", function(a) {
          d(this, b, {
            o: a + "",
            i: 0
          });
        }, function() {
          var a,
              d = this[b],
              f = d.o,
              g = d.i;
          return g >= f.length ? c(1) : (a = e(f, g), d.i += a.length, c(0, a));
        });
      }, function(c, e, d) {
        var b = d(2);
        c.exports = function(c) {
          return function(i, j) {
            var e,
                g,
                f = b.assertDefined(i) + "",
                d = b.toInteger(j),
                h = f.length;
            return 0 > d || d >= h ? c ? "" : a : (e = f.charCodeAt(d), 55296 > e || e > 56319 || d + 1 === h || (g = f.charCodeAt(d + 1)) < 56320 || g > 57343 ? c ? f.charAt(d) : e : c ? f.slice(d, d + 2) : (e - 55296 << 10) + (g - 56320) + 65536);
          };
        };
      }, function(m, n, c) {
        function h(a, c) {
          b.hide(a, f, c), d in [] && b.hide(a, d, c);
        }
        var b = c(2),
            k = c(12),
            g = k.classof,
            i = c(16),
            l = i.obj,
            f = c(8)("iterator"),
            d = "@@iterator",
            e = c(9)("iterators"),
            j = {};
        h(j, b.that), m.exports = {
          BUGGY: "keys" in [] && !("next" in [].keys()),
          Iterators: e,
          step: function(a, b) {
            return {
              value: b,
              done: !!a
            };
          },
          is: function(h) {
            var a = Object(h),
                c = b.g.Symbol;
            return (c && c.iterator || d) in a || f in a || b.has(e, g(a));
          },
          get: function(c) {
            var h,
                j = b.g.Symbol;
            return c != a && (h = c[j && j.iterator || d] || c[f] || e[g(c)]), i(b.isFunction(h), c, " is not iterable!"), l(h.call(c));
          },
          set: h,
          create: function(a, c, d, e) {
            a.prototype = b.create(e || j, {next: b.desc(1, d)}), k.set(a, c + " Iterator");
          }
        };
      }, function(k, m, a) {
        var e = a(4),
            j = a(5),
            b = a(2),
            l = a(12),
            c = a(41),
            i = a(8)("iterator"),
            g = "@@iterator",
            h = "keys",
            d = "values",
            f = c.Iterators;
        k.exports = function(r, o, s, y, m, x, v) {
          function n(b) {
            function a(a) {
              return new s(a, b);
            }
            switch (b) {
              case h:
                return function() {
                  return a(this);
                };
              case d:
                return function() {
                  return a(this);
                };
            }
            return function() {
              return a(this);
            };
          }
          c.create(s, o, y);
          var p,
              q,
              u = o + " Iterator",
              a = r.prototype,
              t = a[i] || a[g] || m && a[m],
              k = t || n(m);
          if (t) {
            var w = b.getProto(k.call(new r));
            l.set(w, u, !0), b.FW && b.has(a, g) && c.set(w, b.that);
          }
          if ((b.FW || v) && c.set(a, k), f[o] = k, f[u] = b.that, m)
            if (p = {
              keys: x ? k : n(h),
              values: m == d ? k : n(d),
              entries: m != d ? k : n("entries")
            }, v)
              for (q in p)
                q in a || j(a, q, p[q]);
            else
              e(e.P + e.F * c.BUGGY, o, p);
        };
      }, function(d, e, a) {
        var b = a(4),
            c = a(40)(!1);
        b(b.P, "String", {codePointAt: function(a) {
            return c(this, a);
          }});
      }, function(g, h, b) {
        var d = b(2),
            f = b(12),
            c = b(4),
            e = d.toLength;
        c(c.P + c.F * !b(19)(function() {
          "q".endsWith(/./);
        }), "String", {endsWith: function(b) {
            if ("RegExp" == f(b))
              throw TypeError();
            var c = d.assertDefined(this) + "",
                g = arguments[1],
                h = e(c.length),
                i = g === a ? h : Math.min(e(g), h);
            return b += "", c.slice(i - b.length, i) === b;
          }});
      }, function(e, f, a) {
        var c = a(2),
            d = a(12),
            b = a(4);
        b(b.P, "String", {includes: function(a) {
            if ("RegExp" == d(a))
              throw TypeError();
            return !!~(c.assertDefined(this) + "").indexOf(a, arguments[1]);
          }});
      }, function(c, d, a) {
        var b = a(4);
        b(b.P, "String", {repeat: a(47)});
      }, function(b, d, c) {
        var a = c(2);
        b.exports = function(e) {
          var c = a.assertDefined(this) + "",
              d = "",
              b = a.toInteger(e);
          if (0 > b || b == 1 / 0)
            throw RangeError("Count can't be negative");
          for (; b > 0; (b >>>= 1) && (c += c))
            1 & b && (d += c);
          return d;
        };
      }, function(e, f, a) {
        var c = a(2),
            d = a(12),
            b = a(4);
        b(b.P + b.F * !a(19)(function() {
          "q".startsWith(/./);
        }), "String", {startsWith: function(a) {
            if ("RegExp" == d(a))
              throw TypeError();
            var b = c.assertDefined(this) + "",
                e = c.toLength(Math.min(arguments[1], b.length));
            return a += "", b.slice(e, e + a.length) === a;
          }});
      }, function(h, i, b) {
        var d = b(2),
            f = b(15),
            c = b(4),
            e = b(41),
            g = b(50);
        c(c.S + c.F * !b(51)(function(a) {
          Array.from(a);
        }), "Array", {from: function(o) {
            var l,
                c,
                i,
                j,
                h = Object(d.assertDefined(o)),
                m = arguments[1],
                k = m !== a,
                n = k ? f(m, arguments[2], 2) : a,
                b = 0;
            if (e.is(h))
              for (j = e.get(h), c = new ("function" == typeof this ? this : Array); !(i = j.next()).done; b++)
                c[b] = k ? g(j, n, [i.value, b], !0) : i.value;
            else
              for (c = new ("function" == typeof this ? this : Array)(l = d.toLength(h.length)); l > b; b++)
                c[b] = k ? n(h[b], b) : h[b];
            return c.length = b, c;
          }});
      }, function(e, g, f) {
        function b(b) {
          var c = b["return"];
          c !== a && d(c.call(b));
        }
        function c(e, c, a, f) {
          try {
            return f ? c(d(a)[0], a[1]) : c(a);
          } catch (g) {
            throw b(e), g;
          }
        }
        var d = f(16).obj;
        c.close = b, e.exports = c;
      }, function(d, f, e) {
        var a = e(8)("iterator"),
            b = !1;
        try {
          var c = [7][a]();
          c["return"] = function() {
            b = !0;
          }, Array.from(c, function() {
            throw 2;
          });
        } catch (g) {}
        d.exports = function(f) {
          if (!b)
            return !1;
          var d = !1;
          try {
            var c = [7],
                e = c[a]();
            e.next = function() {
              d = !0;
            }, c[a] = function() {
              return e;
            }, f(c);
          } catch (g) {}
          return d;
        };
      }, function(c, d, b) {
        var a = b(4);
        a(a.S, "Array", {of: function() {
            for (var a = 0,
                b = arguments.length,
                c = new ("function" == typeof this ? this : Array)(b); b > a; )
              c[a] = arguments[a++];
            return c.length = b, c;
          }});
      }, function(i, j, b) {
        var e = b(2),
            d = b(7),
            f = b(6).safe("iter"),
            g = b(41),
            c = g.step,
            h = g.Iterators;
        b(42)(Array, "Array", function(a, b) {
          e.set(this, f, {
            o: e.toObject(a),
            i: 0,
            k: b
          });
        }, function() {
          var d = this[f],
              e = d.o,
              g = d.k,
              b = d.i++;
          return !e || b >= e.length ? (d.o = a, c(1)) : "keys" == g ? c(0, b) : "values" == g ? c(0, e[b]) : c(0, [b, e[b]]);
        }, "values"), h.Arguments = h.Array, d("keys"), d("values"), d("entries");
      }, function(b, c, a) {
        a(55)(Array);
      }, function(d, e, b) {
        var a = b(2),
            c = b(8)("species");
        d.exports = function(b) {
          !a.DESC || c in b || a.setDesc(b, c, {
            configurable: !0,
            get: a.that
          });
        };
      }, function(f, g, b) {
        var c = b(2),
            d = b(4),
            e = c.toIndex;
        d(d.P, "Array", {fill: function(h) {
            for (var b = Object(c.assertDefined(this)),
                d = c.toLength(b.length),
                f = e(arguments[1], d),
                g = arguments[2],
                i = g === a ? d : e(g, d); i > f; )
              b[f++] = h;
            return b;
          }}), b(7)("fill");
      }, function(f, g, a) {
        var b = "find",
            c = a(4),
            d = !0,
            e = a(14)(5);
        b in [] && Array(1)[b](function() {
          d = !1;
        }), c(c.P + c.F * d, "Array", {find: function(a) {
            return e(this, a, arguments[1]);
          }}), a(7)(b);
      }, function(f, g, a) {
        var b = "findIndex",
            c = a(4),
            d = !0,
            e = a(14)(6);
        b in [] && Array(1)[b](function() {
          d = !1;
        }), c(c.P + c.F * d, "Array", {findIndex: function(a) {
            return e(this, a, arguments[1]);
          }}), a(7)(b);
      }, function(l, k, d) {
        var c = d(2),
            j = d(12),
            b = c.g.RegExp,
            e = b,
            f = b.prototype,
            g = /a/g,
            h = new b(g) !== g,
            i = function() {
              try {
                return "/a/i" == b(g, "i");
              } catch (a) {}
            }();
        c.FW && c.DESC && (h && i || (b = function(c, f) {
          var d = "RegExp" == j(c),
              g = f === a;
          return this instanceof b || !d || !g ? h ? new e(d && !g ? c.source : c, f) : new e(d ? c.source : c, d && g ? c.flags : f) : c;
        }, c.each.call(c.getNames(e), function(a) {
          a in b || c.setDesc(b, a, {
            configurable: !0,
            get: function() {
              return e[a];
            },
            set: function(b) {
              e[a] = b;
            }
          });
        }), f.constructor = b, b.prototype = f, d(5)(c.g, "RegExp", b)), "g" != /./g.flags && c.setDesc(f, "flags", {
          configurable: !0,
          get: d(18)(/^.*\/(\w*)$/, "$1")
        })), d(55)(b);
      }, function(J, I, c) {
        function y(c) {
          var a = new b(function() {});
          return c && (a.constructor = Object), b.resolve(a) === a;
        }
        function H(a) {
          return D(a) && (h ? "Promise" == q.classof(a) : m in a);
        }
        function F(a, c) {
          return e.FW || a !== b || c !== z ? E(a, c) : !0;
        }
        function n(b) {
          var c = o(b)[w];
          return c != a ? c : b;
        }
        function C(b) {
          var a;
          return D(b) && (a = b.then), j(a) ? a : !1;
        }
        function p(a) {
          var b = a.c;
          b.length && r.call(g, function() {
            function f(b) {
              var e,
                  g,
                  f = d ? b.ok : b.fail;
              try {
                f ? (d || (a.h = !0), e = f === !0 ? c : f(c), e === b.P ? b.rej(TypeError("Promise-chain cycle")) : (g = C(e)) ? g.call(e, b.res, b.rej) : b.res(e)) : b.rej(c);
              } catch (h) {
                b.rej(h);
              }
            }
            for (var c = a.v,
                d = 1 == a.s,
                e = 0; b.length > e; )
              f(b[e++]);
            b.length = 0;
          });
        }
        function B(e) {
          var a,
              b = e[m],
              c = b.a || b.c,
              d = 0;
          if (b.h)
            return !1;
          for (; c.length > d; )
            if (a = c[d++], a.fail || !B(a.P))
              return !1;
          return !0;
        }
        function i(c) {
          var d,
              b = this;
          b.d || (b.d = !0, b = b.r || b, b.v = c, b.s = 2, b.a = b.c.slice(), setTimeout(function() {
            r.call(g, function() {
              B(d = b.p) && (G ? k.emit("unhandledRejection", c, d) : g.console && console.error && console.error("Unhandled promise rejection", c)), b.a = a;
            });
          }, 1), p(b));
        }
        function A(b) {
          var c,
              a = this;
          if (!a.d) {
            a.d = !0, a = a.r || a;
            try {
              (c = C(b)) ? r.call(g, function() {
                var d = {
                  r: a,
                  d: !1
                };
                try {
                  c.call(b, l(A, d, 1), l(i, d, 1));
                } catch (e) {
                  i.call(d, e);
                }
              }) : (a.v = b, a.s = 1, p(a));
            } catch (d) {
              i.call({
                r: a,
                d: !1
              }, d);
            }
          }
        }
        var z,
            e = c(2),
            l = c(15),
            q = c(12),
            d = c(4),
            t = c(16),
            x = c(61),
            u = c(29).set,
            E = c(27),
            v = c(55),
            w = c(8)("species"),
            m = c(6).safe("record"),
            f = "Promise",
            g = e.g,
            k = g.process,
            G = "process" == q(k),
            r = k && k.nextTick || c(62).set,
            b = g[f],
            j = e.isFunction,
            D = e.isObject,
            s = t.fn,
            o = t.obj,
            h = function() {
              function a(d) {
                var c = new b(d);
                return u(c, a.prototype), c;
              }
              var c = !1;
              try {
                if (c = j(b) && j(b.resolve) && y(), u(a, b), a.prototype = e.create(b.prototype, {constructor: {value: a}}), a.resolve(5).then(function() {}) instanceof a || (c = !1), c && e.DESC) {
                  var d = !1;
                  b.resolve(e.setDesc({}, "then", {get: function() {
                      d = !0;
                    }})), c = d;
                }
              } catch (f) {
                c = !1;
              }
              return c;
            }();
        h || (b = function(d) {
          s(d);
          var c = {
            p: t.inst(this, b, f),
            c: [],
            a: a,
            s: 0,
            d: !1,
            v: a,
            h: !1
          };
          e.hide(this, m, c);
          try {
            d(l(A, c, 1), l(i, c, 1));
          } catch (g) {
            i.call(c, g);
          }
        }, c(63)(b.prototype, {
          then: function(e, f) {
            var g = o(o(this).constructor)[w],
                c = {
                  ok: j(e) ? e : !0,
                  fail: j(f) ? f : !1
                },
                h = c.P = new (g != a ? g : b)(function(a, b) {
                  c.res = s(a), c.rej = s(b);
                }),
                d = this[m];
            return d.c.push(c), d.a && d.a.push(c), d.s && p(d), h;
          },
          "catch": function(b) {
            return this.then(a, b);
          }
        })), d(d.G + d.W + d.F * !h, {Promise: b}), q.set(b, f), v(b), v(z = e.core[f]), d(d.S + d.F * !h, f, {reject: function(a) {
            return new (n(this))(function(c, b) {
              b(a);
            });
          }}), d(d.S + d.F * (!h || y(!0)), f, {resolve: function(a) {
            return H(a) && F(a.constructor, this) ? a : new this(function(b) {
              b(a);
            });
          }}), d(d.S + d.F * !(h && c(51)(function(a) {
          b.all(a)["catch"](function() {});
        })), f, {
          all: function(c) {
            var b = n(this),
                a = [];
            return new b(function(g, h) {
              x(c, !1, a.push, a);
              var d = a.length,
                  f = Array(d);
              d ? e.each.call(a, function(a, c) {
                b.resolve(a).then(function(a) {
                  f[c] = a, --d || g(f);
                }, h);
              }) : g(f);
            });
          },
          race: function(b) {
            var a = n(this);
            return new a(function(c, d) {
              x(b, !1, function(b) {
                a.resolve(b).then(c, d);
              });
            });
          }
        });
      }, function(c, f, a) {
        var d = a(15),
            e = a(41).get,
            b = a(50);
        c.exports = function(g, c, h, i) {
          for (var f,
              a = e(g),
              j = d(h, i, c ? 2 : 1); !(f = a.next()).done; )
            if (b(a, j, f.value, c) === !1)
              return b.close(a);
        };
      }, function(t, w, d) {
        function f() {
          var a = +this;
          if (g.has(b, a)) {
            var c = b[a];
            delete b[a], c();
          }
        }
        function q(a) {
          f.call(a.data);
        }
        var c,
            l,
            m,
            g = d(2),
            i = d(15),
            u = d(12),
            v = d(13),
            p = d(11),
            a = g.g,
            e = g.isFunction,
            n = g.html,
            o = a.process,
            k = a.setImmediate,
            h = a.clearImmediate,
            r = a.MessageChannel,
            j = 0,
            b = {},
            s = "onreadystatechange";
        e(k) && e(h) || (k = function(a) {
          for (var d = [],
              f = 1; arguments.length > f; )
            d.push(arguments[f++]);
          return b[++j] = function() {
            v(e(a) ? a : Function(a), d);
          }, c(j), j;
        }, h = function(a) {
          delete b[a];
        }, "process" == u(o) ? c = function(a) {
          o.nextTick(i(f, a, 1));
        } : a.addEventListener && e(a.postMessage) && !a.importScripts ? (c = function(b) {
          a.postMessage(b, "*");
        }, a.addEventListener("message", q, !1)) : e(r) ? (l = new r, m = l.port2, l.port1.onmessage = q, c = i(m.postMessage, m, 1)) : c = s in p("script") ? function(a) {
          n.appendChild(p("script"))[s] = function() {
            n.removeChild(this), f.call(a);
          };
        } : function(a) {
          setTimeout(i(f, a, 1), 0);
        }), t.exports = {
          set: k,
          clear: h
        };
      }, function(a, d, b) {
        var c = b(5);
        a.exports = function(a, b) {
          for (var d in b)
            c(a, d, b[d]);
          return a;
        };
      }, function(c, d, b) {
        var a = b(65);
        b(66)("Map", function(a) {
          return function() {
            return a(this, arguments[0]);
          };
        }, {
          get: function(c) {
            var b = a.getEntry(this, c);
            return b && b.v;
          },
          set: function(b, c) {
            return a.def(this, 0 === b ? 0 : b, c);
          }
        }, a, !0);
      }, function(t, x, c) {
        function m(a, b) {
          if (!p(a))
            return "symbol" == typeof a ? a : ("string" == typeof a ? "S" : "P") + a;
          if (!q(a, l)) {
            if (!v(a))
              return "F";
            if (!b)
              return "E";
            u(a, l, ++w);
          }
          return "O" + a[l];
        }
        function k(c, d) {
          var a,
              e = m(d);
          if ("F" !== e)
            return c[h][e];
          for (a = c[b]; a; a = a.n)
            if (a.k == d)
              return a;
        }
        var d = c(2),
            r = c(15),
            e = c(6).safe,
            o = c(16),
            s = c(61),
            j = c(41).step,
            q = d.has,
            g = d.set,
            p = d.isObject,
            u = d.hide,
            v = Object.isExtensible || p,
            l = e("id"),
            h = e("O1"),
            f = e("last"),
            b = e("first"),
            n = e("iter"),
            i = d.DESC ? e("size") : "size",
            w = 0;
        t.exports = {
          getConstructor: function(j, l, m, n) {
            var e = j(function(c, j) {
              o.inst(c, e, l), g(c, h, d.create(null)), g(c, i, 0), g(c, f, a), g(c, b, a), j != a && s(j, m, c[n], c);
            });
            return c(63)(e.prototype, {
              clear: function() {
                for (var d = this,
                    e = d[h],
                    c = d[b]; c; c = c.n)
                  c.r = !0, c.p && (c.p = c.p.n = a), delete e[c.i];
                d[b] = d[f] = a, d[i] = 0;
              },
              "delete": function(g) {
                var c = this,
                    a = k(c, g);
                if (a) {
                  var d = a.n,
                      e = a.p;
                  delete c[h][a.i], a.r = !0, e && (e.n = d), d && (d.p = e), c[b] == a && (c[b] = d), c[f] == a && (c[f] = e), c[i]--;
                }
                return !!a;
              },
              forEach: function(c) {
                for (var a,
                    d = r(c, arguments[1], 3); a = a ? a.n : this[b]; )
                  for (d(a.v, a.k, this); a && a.r; )
                    a = a.p;
              },
              has: function(a) {
                return !!k(this, a);
              }
            }), d.DESC && d.setDesc(e.prototype, "size", {get: function() {
                return o.def(this[i]);
              }}), e;
          },
          def: function(c, e, l) {
            var g,
                j,
                d = k(c, e);
            return d ? d.v = l : (c[f] = d = {
              i: j = m(e, !0),
              k: e,
              v: l,
              p: g = c[f],
              n: a,
              r: !1
            }, c[b] || (c[b] = d), g && (g.n = d), c[i]++, "F" !== j && (c[h][j] = d)), c;
          },
          getEntry: k,
          setIter: function(e, f, d) {
            c(42)(e, f, function(a, b) {
              g(this, n, {
                o: a,
                k: b
              });
            }, function() {
              for (var d = this[n],
                  e = d.k,
                  c = d.l; c && c.r; )
                c = c.p;
              return d.o && (d.l = c = c ? c.n : d.o[b]) ? "keys" == e ? j(0, c.k) : "values" == e ? j(0, c.v) : j(0, [c.k, c.v]) : (d.o = a, j(1));
            }, d ? "entries" : "values", !d, !0);
          }
        };
      }, function(f, j, b) {
        var d = b(2),
            c = b(4),
            g = b(41).BUGGY,
            h = b(61),
            e = b(55),
            i = b(16).inst;
        f.exports = function(j, s, v, u, l, m) {
          function n(a) {
            var c = k[a];
            b(5)(k, a, "delete" == a ? function(a) {
              return c.call(this, 0 === a ? 0 : a);
            } : "has" == a ? function(a) {
              return c.call(this, 0 === a ? 0 : a);
            } : "get" == a ? function(a) {
              return c.call(this, 0 === a ? 0 : a);
            } : "add" == a ? function(a) {
              return c.call(this, 0 === a ? 0 : a), this;
            } : function(a, b) {
              return c.call(this, 0 === a ? 0 : a, b), this;
            });
          }
          var p = d.g[j],
              f = p,
              o = l ? "set" : "add",
              k = f && f.prototype,
              t = {};
          if (d.isFunction(f) && (m || !g && k.forEach && k.entries)) {
            var r,
                q = new f,
                w = q[o](m ? {} : -0, 1);
            b(51)(function(a) {
              new f(a);
            }) || (f = s(function(d, c) {
              i(d, f, j);
              var b = new p;
              return c != a && h(c, l, b[o], b), b;
            }), f.prototype = k, k.constructor = f), m || q.forEach(function(b, a) {
              r = 1 / a === -(1 / 0);
            }), r && (n("delete"), n("has"), l && n("get")), (r || w !== q) && n(o);
          } else
            f = u.getConstructor(s, j, l, o), b(63)(f.prototype, v);
          return b(12).set(f, j), t[j] = f, c(c.G + c.W + c.F * (f != p), t), e(f), e(d.core[j]), m || u.setIter(f, j, l), f;
        };
      }, function(c, d, a) {
        var b = a(65);
        a(66)("Set", function(a) {
          return function() {
            return a(this, arguments[0]);
          };
        }, {add: function(a) {
            return b.def(this, a = 0 === a ? 0 : a, a);
          }}, b);
      }, function(m, l, b) {
        var c = b(2),
            a = b(69),
            f = a.leakStore,
            j = a.ID,
            h = a.WEAK,
            k = c.has,
            d = c.isObject,
            i = Object.isExtensible || d,
            g = {},
            e = b(66)("WeakMap", function(a) {
              return function() {
                return a(this, arguments[0]);
              };
            }, {
              get: function(a) {
                if (d(a)) {
                  if (!i(a))
                    return f(this).get(a);
                  if (k(a, h))
                    return a[h][this[j]];
                }
              },
              set: function(b, c) {
                return a.def(this, b, c);
              }
            }, a, !0, !0);
        7 != (new e).set((Object.freeze || Object)(g), 7).get(g) && c.each.call(["delete", "has", "get", "set"], function(a) {
          var c = e.prototype,
              g = c[a];
          b(5)(c, a, function(b, c) {
            if (d(b) && !i(b)) {
              var e = f(this)[a](b, c);
              return "set" == a ? this : e;
            }
            return g.call(this, b, c);
          });
        });
      }, function(r, u, c) {
        function j(a, b) {
          return p(a.array, function(a) {
            return a[0] === b;
          });
        }
        function f(b) {
          return b[h] || m(b, h, {
            array: [],
            get: function(c) {
              var b = j(this, c);
              return b ? b[1] : a;
            },
            has: function(a) {
              return !!j(this, a);
            },
            set: function(a, b) {
              var c = j(this, a);
              c ? c[1] = b : this.array.push([a, b]);
            },
            "delete": function(b) {
              var a = t(this.array, function(a) {
                return a[0] === b;
              });
              return ~a && this.array.splice(a, 1), !!~a;
            }
          })[h];
        }
        var g = c(2),
            l = c(6).safe,
            n = c(16),
            q = c(61),
            e = g.has,
            i = g.isObject,
            m = g.hide,
            k = Object.isExtensible || i,
            s = 0,
            d = l("id"),
            b = l("weak"),
            h = l("leak"),
            o = c(14),
            p = o(5),
            t = o(6);
        r.exports = {
          getConstructor: function(j, l, m, o) {
            var h = j(function(b, c) {
              g.set(n.inst(b, h, l), d, s++), c != a && q(c, m, b[o], b);
            });
            return c(63)(h.prototype, {
              "delete": function(a) {
                return i(a) ? k(a) ? e(a, b) && e(a[b], this[d]) && delete a[b][this[d]] : f(this)["delete"](a) : !1;
              },
              has: function(a) {
                return i(a) ? k(a) ? e(a, b) && e(a[b], this[d]) : f(this).has(a) : !1;
              }
            }), h;
          },
          def: function(c, a, g) {
            return k(n.obj(a)) ? (e(a, b) || m(a, b, {}), a[b][c[d]] = g) : f(c).set(a, g), c;
          },
          leakStore: f,
          WEAK: b,
          ID: d
        };
      }, function(c, d, a) {
        var b = a(69);
        a(66)("WeakSet", function(a) {
          return function() {
            return a(this, arguments[0]);
          };
        }, {add: function(a) {
            return b.def(this, a, !0);
          }}, b, !1, !0);
      }, function(v, u, d) {
        function l(c) {
          b.set(this, k, {
            o: c,
            k: a,
            i: 0
          });
        }
        var b = d(2),
            e = d(4),
            g = d(29),
            o = d(41),
            s = d(8)("iterator"),
            k = d(6).safe("iter"),
            j = o.step,
            m = d(16),
            f = b.isObject,
            h = b.getProto,
            i = b.g.Reflect,
            q = Function.apply,
            c = m.obj,
            r = Object.isExtensible || f,
            p = Object.preventExtensions,
            t = !(i && i.enumerate && s in i.enumerate({}));
        o.create(l, "Object", function() {
          var d,
              b = this[k],
              c = b.k;
          if (c == a) {
            b.k = c = [];
            for (d in b.o)
              c.push(d);
          }
          do
            if (b.i >= c.length)
              return j(1);
 while (!((d = c[b.i++]) in b.o));
          return j(0, d);
        });
        var n = {
          apply: function(a, b, c) {
            return q.call(a, b, c);
          },
          construct: function(a, g) {
            var c = m.fn(arguments.length < 3 ? a : arguments[2]).prototype,
                d = b.create(f(c) ? c : Object.prototype),
                e = q.call(a, d, g);
            return f(e) ? e : d;
          },
          defineProperty: function(a, d, e) {
            c(a);
            try {
              return b.setDesc(a, d, e), !0;
            } catch (f) {
              return !1;
            }
          },
          deleteProperty: function(a, d) {
            var e = b.getDesc(c(a), d);
            return e && !e.configurable ? !1 : delete a[d];
          },
          get: function w(e, g) {
            var i,
                j = arguments.length < 3 ? e : arguments[2],
                d = b.getDesc(c(e), g);
            return d ? b.has(d, "value") ? d.value : d.get === a ? a : d.get.call(j) : f(i = h(e)) ? w(i, g, j) : a;
          },
          getOwnPropertyDescriptor: function(a, d) {
            return b.getDesc(c(a), d);
          },
          getPrototypeOf: function(a) {
            return h(c(a));
          },
          has: function(a, b) {
            return b in a;
          },
          isExtensible: function(a) {
            return r(c(a));
          },
          ownKeys: d(72),
          preventExtensions: function(a) {
            c(a);
            try {
              return p && p(a), !0;
            } catch (b) {
              return !1;
            }
          },
          set: function x(i, g, j) {
            var k,
                l,
                e = arguments.length < 4 ? i : arguments[3],
                d = b.getDesc(c(i), g);
            if (!d) {
              if (f(l = h(i)))
                return x(l, g, j, e);
              d = b.desc(0);
            }
            return b.has(d, "value") ? d.writable !== !1 && f(e) ? (k = b.getDesc(e, g) || b.desc(0), k.value = j, b.setDesc(e, g, k), !0) : !1 : d.set === a ? !1 : (d.set.call(e, j), !0);
          }
        };
        g && (n.setPrototypeOf = function(a, b) {
          g.check(a, b);
          try {
            return g.set(a, b), !0;
          } catch (c) {
            return !1;
          }
        }), e(e.G, {Reflect: {}}), e(e.S + e.F * t, "Reflect", {enumerate: function(a) {
            return new l(c(a));
          }}), e(e.S, "Reflect", n);
      }, function(c, e, a) {
        var b = a(2),
            d = a(16).obj;
        c.exports = function(a) {
          d(a);
          var c = b.getNames(a),
              e = b.getSymbols;
          return e ? c.concat(e(a)) : c;
        };
      }, function(d, e, a) {
        var b = a(4),
            c = a(17)(!0);
        b(b.P, "Array", {includes: function(a) {
            return c(this, a, arguments[1]);
          }}), a(7)("includes");
      }, function(d, e, a) {
        var b = a(4),
            c = a(40)(!0);
        b(b.P, "String", {at: function(a) {
            return c(this, a);
          }});
      }, function(d, e, a) {
        var b = a(4),
            c = a(76);
        b(b.P, "String", {lpad: function(a) {
            return c(this, a, arguments[1], !0);
          }});
      }, function(d, f, b) {
        var c = b(2),
            e = b(47);
        d.exports = function(k, g, h, i) {
          var f = c.assertDefined(k) + "";
          if (g === a)
            return f;
          var l = c.toInteger(g),
              d = l - f.length;
          if (0 > d || d === 1 / 0)
            throw new RangeError("Cannot satisfy string length " + g + " for string: " + f);
          var j = h === a ? " " : h + "",
              b = e.call(j, Math.ceil(d / j.length));
          return b.length > d && (b = i ? b.slice(b.length - d) : b.slice(0, d)), i ? b.concat(f) : f.concat(b);
        };
      }, function(d, e, a) {
        var b = a(4),
            c = a(76);
        b(b.P, "String", {rpad: function(a) {
            return c(this, a, arguments[1], !1);
          }});
      }, function(c, d, a) {
        var b = a(4);
        b(b.S, "RegExp", {escape: a(18)(/[\\^$*+?.()|[\]{}]/g, "\\$&", !0)});
      }, function(e, f, b) {
        var a = b(2),
            c = b(4),
            d = b(72);
        c(c.S, "Object", {getOwnPropertyDescriptors: function(e) {
            var b = a.toObject(e),
                c = {};
            return a.each.call(d(b), function(d) {
              a.setDesc(c, d, a.desc(0, a.getDesc(b, d)));
            }), c;
          }});
      }, function(e, f, a) {
        function b(a) {
          return function(i) {
            var h,
                d = c.toObject(i),
                e = c.getKeys(d),
                f = e.length,
                b = 0,
                g = Array(f);
            if (a)
              for (; f > b; )
                g[b] = [h = e[b++], d[h]];
            else
              for (; f > b; )
                g[b] = d[e[b++]];
            return g;
          };
        }
        var c = a(2),
            d = a(4);
        d(d.S, "Object", {
          values: b(!1),
          entries: b(!0)
        });
      }, function(b, c, a) {
        a(82)("Map");
      }, function(c, e, a) {
        var b = a(4),
            d = a(61);
        c.exports = function(a) {
          b(b.P, a, {toJSON: function() {
              var a = [];
              return d(this, !1, a.push, a), a;
            }});
        };
      }, function(b, c, a) {
        a(82)("Set");
      }, function(d, e, b) {
        var a = b(4),
            c = b(62);
        a(a.G + a.B, {
          setImmediate: c.set,
          clearImmediate: c.clear
        });
      }, function(k, j, c) {
        c(53);
        var a = c(2),
            d = c(41).Iterators,
            b = c(8)("iterator"),
            e = d.Array,
            f = a.g.NodeList,
            g = a.g.HTMLCollection,
            h = f && f.prototype,
            i = g && g.prototype;
        a.FW && (!f || b in h || a.hide(h, b, e), !g || b in i || a.hide(i, b, e)), d.NodeList = d.HTMLCollection = e;
      }, function(i, j, a) {
        function d(a) {
          return f ? function(c, d) {
            return a(g(h, [].slice.call(arguments, 2), b.isFunction(c) ? c : Function(c)), d);
          } : a;
        }
        var b = a(2),
            c = a(4),
            g = a(13),
            h = a(87),
            e = b.g.navigator,
            f = !!e && /MSIE .\./.test(e.userAgent);
        c(c.G + c.B + c.F * f, {
          setTimeout: d(b.g.setTimeout),
          setInterval: d(b.g.setInterval)
        });
      }, function(c, f, a) {
        var d = a(2),
            b = a(13),
            e = a(16).fn;
        c.exports = function() {
          for (var h = e(this),
              a = arguments.length,
              c = Array(a),
              f = 0,
              i = d.path._,
              g = !1; a > f; )
            (c[f] = arguments[f++]) === i && (g = !0);
          return function() {
            var d,
                j = this,
                k = arguments.length,
                e = 0,
                f = 0;
            if (!g && !k)
              return b(h, c, j);
            if (d = c.slice(), g)
              for (; a > e; e++)
                d[e] === i && (d[e] = arguments[f++]);
            for (; k > f; )
              d.push(arguments[f++]);
            return b(h, d, j);
          };
        };
      }, function(h, i, b) {
        function c(f, c) {
          e.each.call(f.split(","), function(e) {
            c == a && e in g ? d[e] = g[e] : e in [] && (d[e] = b(15)(Function.call, [][e], c));
          });
        }
        var e = b(2),
            f = b(4),
            g = e.core.Array || Array,
            d = {};
        c("pop,reverse,shift,keys,values,entries", 1), c("indexOf,every,some,forEach,map,filter,find,findIndex,includes", 3), c("join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill,turn"), f(f.S, "Array", d);
      }]), "undefined" != typeof module && module.exports ? module.exports = b : "function" == typeof define && define.amd ? define(function() {
        return b;
      }) : c.core = b;
    }();
  })(require("github:jspm/nodelibs-process@0.1.1"));
  global.define = __define;
  return module.exports;
});

System.register("npm:core-js@0.9.18", ["npm:core-js@0.9.18/client/shim.min"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("npm:core-js@0.9.18/client/shim.min");
  global.define = __define;
  return module.exports;
});

(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/history-browser@0.6.2/aurelia-history-browser", ["npm:core-js@0.9.18", "github:aurelia/history@0.6.1"], false, function(__require, __exports, __module) {
  return (function(exports, _coreJs, _aureliaHistory) {
    'use strict';
    exports.__esModule = true;
    exports.configure = configure;
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {'default': obj};
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }});
      if (superClass)
        subClass.__proto__ = superClass;
    }
    var _core = _interopRequireDefault(_coreJs);
    var routeStripper = /^#?\/*|\s+$/g;
    var rootStripper = /^\/+|\/+$/g;
    var isExplorer = /msie [\w.]+/;
    var trailingSlash = /\/$/;
    var absoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;
    function updateHash(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        location.hash = '#' + fragment;
      }
    }
    var BrowserHistory = (function(_History) {
      function BrowserHistory() {
        _classCallCheck(this, BrowserHistory);
        _History.call(this);
        this.interval = 50;
        this.active = false;
        this.previousFragment = '';
        this._checkUrlCallback = this.checkUrl.bind(this);
        if (typeof window !== 'undefined') {
          this.location = window.location;
          this.history = window.history;
        }
      }
      _inherits(BrowserHistory, _History);
      BrowserHistory.prototype.getHash = function getHash(window) {
        var match = (window || this).location.href.match(/#(.*)$/);
        return match ? match[1] : '';
      };
      BrowserHistory.prototype.getFragment = function getFragment(fragment, forcePushState) {
        var root;
        if (!fragment) {
          if (this._hasPushState || !this._wantsHashChange || forcePushState) {
            fragment = this.location.pathname + this.location.search;
            root = this.root.replace(trailingSlash, '');
            if (!fragment.indexOf(root)) {
              fragment = fragment.substr(root.length);
            }
          } else {
            fragment = this.getHash();
          }
        }
        return '/' + fragment.replace(routeStripper, '');
      };
      BrowserHistory.prototype.activate = function activate(options) {
        if (this.active) {
          throw new Error('History has already been activated.');
        }
        this.active = true;
        this.options = Object.assign({}, {root: '/'}, this.options, options);
        this.root = this.options.root;
        this._wantsHashChange = this.options.hashChange !== false;
        this._wantsPushState = !!this.options.pushState;
        this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
        var fragment = this.getFragment();
        this.root = ('/' + this.root + '/').replace(rootStripper, '/');
        if (this._hasPushState) {
          window.onpopstate = this._checkUrlCallback;
        } else if (this._wantsHashChange && 'onhashchange' in window) {
          window.addEventListener('hashchange', this._checkUrlCallback);
        } else if (this._wantsHashChange) {
          this._checkUrlTimer = setTimeout(this._checkUrlCallback, this.interval);
        }
        this.fragment = fragment;
        var loc = this.location;
        var atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;
        if (this._wantsHashChange && this._wantsPushState) {
          if (!this._hasPushState && !atRoot) {
            this.fragment = this.getFragment(null, true);
            this.location.replace(this.root + this.location.search + '#' + this.fragment);
            return true;
          } else if (this._hasPushState && atRoot && loc.hash) {
            this.fragment = this.getHash().replace(routeStripper, '');
            this.history.replaceState({}, document.title, this.root + this.fragment + loc.search);
          }
        }
        if (!this.options.silent) {
          return this.loadUrl();
        }
      };
      BrowserHistory.prototype.deactivate = function deactivate() {
        window.onpopstate = null;
        window.removeEventListener('hashchange', this._checkUrlCallback);
        clearTimeout(this._checkUrlTimer);
        this.active = false;
      };
      BrowserHistory.prototype.checkUrl = function checkUrl() {
        var current = this.getFragment();
        if (this._checkUrlTimer) {
          clearTimeout(this._checkUrlTimer);
          this._checkUrlTimer = setTimeout(this._checkUrlCallback, this.interval);
        }
        if (current === this.fragment && this.iframe) {
          current = this.getFragment(this.getHash(this.iframe));
        }
        if (current === this.fragment) {
          return false;
        }
        if (this.iframe) {
          this.navigate(current, false);
        }
        this.loadUrl();
      };
      BrowserHistory.prototype.loadUrl = function loadUrl(fragmentOverride) {
        var fragment = this.fragment = this.getFragment(fragmentOverride);
        return this.options.routeHandler ? this.options.routeHandler(fragment) : false;
      };
      BrowserHistory.prototype.navigate = function navigate(fragment, options) {
        if (fragment && absoluteUrl.test(fragment)) {
          window.location.href = fragment;
          return true;
        }
        if (!this.active) {
          return false;
        }
        if (options === undefined) {
          options = {trigger: true};
        } else if (typeof options === 'boolean') {
          options = {trigger: options};
        }
        fragment = this.getFragment(fragment || '');
        if (this.fragment === fragment) {
          return ;
        }
        this.fragment = fragment;
        var url = this.root + fragment;
        if (fragment === '' && url !== '/') {
          url = url.slice(0, -1);
        }
        if (this._hasPushState) {
          url = url.replace('//', '/');
          this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);
        } else if (this._wantsHashChange) {
          updateHash(this.location, fragment, options.replace);
          if (this.iframe && fragment !== this.getFragment(this.getHash(this.iframe))) {
            if (!options.replace) {
              this.iframe.document.open().close();
            }
            updateHash(this.iframe.location, fragment, options.replace);
          }
        } else {
          return this.location.assign(url);
        }
        if (options.trigger) {
          return this.loadUrl(fragment);
        } else {
          this.previousFragment = fragment;
        }
      };
      BrowserHistory.prototype.navigateBack = function navigateBack() {
        this.history.back();
      };
      return BrowserHistory;
    })(_aureliaHistory.History);
    exports.BrowserHistory = BrowserHistory;
    function configure(aurelia) {
      aurelia.withSingleton(_aureliaHistory.History, BrowserHistory);
    }
  }).call(__exports, __exports, __require('npm:core-js@0.9.18'), __require('github:aurelia/history@0.6.1'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/history-browser@0.6.2", ["github:aurelia/history-browser@0.6.2/aurelia-history-browser"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/history-browser@0.6.2/aurelia-history-browser'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/path@0.8.1/aurelia-path", [], false, function(__require, __exports, __module) {
  return (function(exports) {
    'use strict';
    exports.__esModule = true;
    exports.relativeToFile = relativeToFile;
    exports.join = join;
    exports.buildQueryString = buildQueryString;
    function trimDots(ary) {
      var i,
          part;
      for (i = 0; i < ary.length; ++i) {
        part = ary[i];
        if (part === '.') {
          ary.splice(i, 1);
          i -= 1;
        } else if (part === '..') {
          if (i === 0 || i == 1 && ary[2] === '..' || ary[i - 1] === '..') {
            continue;
          } else if (i > 0) {
            ary.splice(i - 1, 2);
            i -= 2;
          }
        }
      }
    }
    function relativeToFile(name, file) {
      var lastIndex,
          normalizedBaseParts,
          fileParts = file && file.split('/'),
          nameParts = name.trim().split('/');
      if (nameParts[0].charAt(0) === '.' && fileParts) {
        normalizedBaseParts = fileParts.slice(0, fileParts.length - 1);
        nameParts = normalizedBaseParts.concat(nameParts);
      }
      trimDots(nameParts);
      return nameParts.join('/');
    }
    function join(path1, path2) {
      var url1,
          url2,
          url3,
          i,
          ii,
          urlPrefix,
          trailingSlash;
      if (!path1) {
        return path2;
      }
      if (!path2) {
        return path1;
      }
      urlPrefix = path1.indexOf('//') === 0 ? '//' : path1.indexOf('/') === 0 ? '/' : '';
      trailingSlash = path2.slice(-1) == '/' ? '/' : '';
      url1 = path1.split('/');
      url2 = path2.split('/');
      url3 = [];
      for (i = 0, ii = url1.length; i < ii; ++i) {
        if (url1[i] == '..') {
          url3.pop();
        } else if (url1[i] == '.' || url1[i] == '') {
          continue;
        } else {
          url3.push(url1[i]);
        }
      }
      for (i = 0, ii = url2.length; i < ii; ++i) {
        if (url2[i] == '..') {
          url3.pop();
        } else if (url2[i] == '.' || url2[i] == '') {
          continue;
        } else {
          url3.push(url2[i]);
        }
      }
      return urlPrefix + url3.join('/').replace(/\:\//g, '://') + trailingSlash;
    }
    var r20 = /%20/g,
        rbracket = /\[\]$/,
        class2type = {};
    'Boolean Number String Function Array Date RegExp Object Error'.split(' ').forEach(function(name, i) {
      class2type['[object ' + name + ']'] = name.toLowerCase();
    });
    function type(obj) {
      if (obj == null) {
        return obj + '';
      }
      return typeof obj === 'object' || typeof obj === 'function' ? class2type[toString.call(obj)] || 'object' : typeof obj;
    }
    function buildQueryString(a, traditional) {
      var s = [],
          add = function add(key, value) {
            value = typeof value === 'function' ? value() : value == null ? '' : value;
            s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
          };
      for (var prefix in a) {
        _buildQueryString(prefix, a[prefix], traditional, add);
      }
      return s.join('&').replace(r20, '+');
    }
    function _buildQueryString(prefix, obj, traditional, add) {
      if (Array.isArray(obj)) {
        obj.forEach(function(v, i) {
          if (traditional || rbracket.test(prefix)) {
            add(prefix, v);
          } else {
            _buildQueryString(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, traditional, add);
          }
        });
      } else if (!traditional && type(obj) === 'object') {
        for (var _name in obj) {
          _buildQueryString(prefix + '[' + _name + ']', obj[_name], traditional, add);
        }
      } else {
        add(prefix, obj);
      }
    }
  }).call(__exports, __exports);
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/path@0.8.1", ["github:aurelia/path@0.8.1/aurelia-path"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/path@0.8.1/aurelia-path'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/loader@0.8.3/aurelia-loader", ["npm:core-js@0.9.18", "github:aurelia/path@0.8.1", "github:aurelia/metadata@0.7.1"], false, function(__require, __exports, __module) {
  return (function(exports, _coreJs, _aureliaPath, _aureliaMetadata) {
    'use strict';
    exports.__esModule = true;
    var _createClass = (function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ('value' in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          defineProperties(Constructor, staticProps);
        return Constructor;
      };
    })();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {'default': obj};
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var _core = _interopRequireDefault(_coreJs);
    var TemplateDependency = function TemplateDependency(src, name) {
      _classCallCheck(this, TemplateDependency);
      this.src = src;
      this.name = name;
    };
    exports.TemplateDependency = TemplateDependency;
    var TemplateRegistryEntry = (function() {
      function TemplateRegistryEntry(id) {
        _classCallCheck(this, TemplateRegistryEntry);
        this.id = id;
        this.template = null;
        this.dependencies = null;
        this.resources = null;
        this.factory = null;
      }
      TemplateRegistryEntry.prototype.setTemplate = function setTemplate(template) {
        var id = this.id,
            useResources,
            i,
            ii,
            current,
            src;
        this.template = template;
        useResources = template.content.querySelectorAll('require');
        this.dependencies = new Array(useResources.length);
        if (useResources.length === 0) {
          return ;
        }
        for (i = 0, ii = useResources.length; i < ii; ++i) {
          current = useResources[i];
          src = current.getAttribute('from');
          if (!src) {
            throw new Error('<require> element in ' + this.id + ' has no "from" attribute.');
          }
          this.dependencies[i] = new TemplateDependency(_aureliaPath.relativeToFile(src, id), current.getAttribute('as'));
          if (current.parentNode) {
            current.parentNode.removeChild(current);
          }
        }
      };
      TemplateRegistryEntry.prototype.addDependency = function addDependency(src, name) {
        if (typeof src === 'string') {
          this.dependencies.push(new TemplateDependency(_aureliaPath.relativeToFile(src, this.id), name));
        } else if (typeof src === 'function') {
          var origin = _aureliaMetadata.Origin.get(src);
          this.dependencies.push(new TemplateDependency(origin.moduleId, name));
        }
      };
      TemplateRegistryEntry.prototype.setResources = function setResources(resources) {
        this.resources = resources;
      };
      TemplateRegistryEntry.prototype.setFactory = function setFactory(factory) {
        this.factory = factory;
      };
      _createClass(TemplateRegistryEntry, [{
        key: 'templateIsLoaded',
        get: function get() {
          return this.template !== null;
        }
      }, {
        key: 'isReady',
        get: function get() {
          return this.factory !== null;
        }
      }]);
      return TemplateRegistryEntry;
    })();
    exports.TemplateRegistryEntry = TemplateRegistryEntry;
    var hasTemplateElement = ('content' in document.createElement('template'));
    function importElements(frag, link, callback) {
      if (frag) {
        document.head.appendChild(frag);
      }
      if (window.Polymer && Polymer.whenReady) {
        Polymer.whenReady(callback);
      } else {
        link.addEventListener('load', callback);
      }
    }
    var Loader = (function() {
      function Loader() {
        _classCallCheck(this, Loader);
        this.templateRegistry = {};
        this.needsBundleCheck = true;
      }
      Loader.prototype.loadModule = function loadModule(id) {
        throw new Error('Loaders must implement loadModule(id).');
      };
      Loader.prototype.loadAllModules = function loadAllModules(ids) {
        throw new Error('Loader must implement loadAllModules(ids).');
      };
      Loader.prototype.loadTemplate = function loadTemplate(url) {
        throw new Error('Loader must implement loadTemplate(url).');
      };
      Loader.prototype.loadText = function loadText(url) {
        throw new Error('Loader must implement loadText(url).');
      };
      Loader.prototype.getOrCreateTemplateRegistryEntry = function getOrCreateTemplateRegistryEntry(id) {
        var entry = this.templateRegistry[id];
        if (entry === undefined) {
          this.templateRegistry[id] = entry = new TemplateRegistryEntry(id);
        }
        return entry;
      };
      Loader.prototype.importDocument = function importDocument(url) {
        return new Promise(function(resolve, reject) {
          var frag = document.createDocumentFragment();
          var link = document.createElement('link');
          link.rel = 'import';
          link.href = url;
          frag.appendChild(link);
          importElements(frag, link, function() {
            return resolve(link['import']);
          });
        });
      };
      Loader.prototype.importBundle = function importBundle(link) {
        return new Promise(function(resolve, reject) {
          if (link['import']) {
            if (!hasTemplateElement) {
              HTMLTemplateElement.bootstrap(link['import']);
            }
            resolve(link['import']);
          } else {
            importElements(null, link, function() {
              if (!hasTemplateElement) {
                HTMLTemplateElement.bootstrap(link['import']);
              }
              resolve(link['import']);
            });
          }
        });
      };
      Loader.prototype.importTemplate = function importTemplate(url) {
        var _this = this;
        return this.importDocument(url).then(function(doc) {
          return _this.findTemplate(doc, url);
        });
      };
      Loader.prototype.findTemplate = function findTemplate(doc, url) {
        if (!hasTemplateElement) {
          HTMLTemplateElement.bootstrap(doc);
        }
        var template = doc.getElementsByTagName('template')[0];
        if (!template) {
          throw new Error('There was no template element found in \'' + url + '\'.');
        }
        return template;
      };
      Loader.prototype._tryGetTemplateFromBundle = function _tryGetTemplateFromBundle(name, entry) {
        var found = this.bundle.getElementById(name);
        if (found) {
          entry.setTemplate(found);
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      };
      Loader.prototype.findBundledTemplate = function findBundledTemplate(name, entry) {
        var _this2 = this;
        if (this.bundle) {
          return this._tryGetTemplateFromBundle(name, entry);
        } else if (this.onBundleReady) {
          return this.onBundleReady.then(function() {
            return _this2._tryGetTemplateFromBundle(name, entry);
          });
        } else if (this.needsBundleCheck) {
          var bundleLink = document.querySelector('link[aurelia-view-bundle]');
          this.needsBundleCheck = false;
          if (bundleLink) {
            this.onBundleReady = this.importBundle(bundleLink).then(function(doc) {
              _this2.bundle = doc;
              _this2.onBundleReady = null;
            });
            return this.onBundleReady.then(function() {
              return _this2._tryGetTemplateFromBundle(name, entry);
            });
          }
        }
        return Promise.resolve(false);
      };
      return Loader;
    })();
    exports.Loader = Loader;
  }).call(__exports, __exports, __require('npm:core-js@0.9.18'), __require('github:aurelia/path@0.8.1'), __require('github:aurelia/metadata@0.7.1'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/loader@0.8.3", ["github:aurelia/loader@0.8.3/aurelia-loader"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/loader@0.8.3/aurelia-loader'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/metadata@0.7.1/aurelia-metadata", ["npm:core-js@0.9.18"], false, function(__require, __exports, __module) {
  return (function(exports, _coreJs) {
    'use strict';
    exports.__esModule = true;
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {'default': obj};
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var _core = _interopRequireDefault(_coreJs);
    var theGlobal = (function() {
      if (typeof self !== 'undefined') {
        return self;
      }
      if (typeof global !== 'undefined') {
        return global;
      }
      return new Function('return this')();
    })();
    var emptyMetadata = Object.freeze({});
    var metadataContainerKey = '__metadata__';
    if (typeof theGlobal.System === 'undefined') {
      theGlobal.System = {isFake: true};
    }
    if (typeof theGlobal.System.forEachModule === 'undefined') {
      theGlobal.System.forEachModule = function() {};
    }
    if (typeof theGlobal.Reflect === 'undefined') {
      theGlobal.Reflect = {};
    }
    if (typeof theGlobal.Reflect.getOwnMetadata === 'undefined') {
      Reflect.getOwnMetadata = function(metadataKey, target, targetKey) {
        return ((target[metadataContainerKey] || emptyMetadata)[targetKey] || emptyMetadata)[metadataKey];
      };
    }
    if (typeof theGlobal.Reflect.defineMetadata === 'undefined') {
      Reflect.defineMetadata = function(metadataKey, metadataValue, target, targetKey) {
        var metadataContainer = target[metadataContainerKey] || (target[metadataContainerKey] = {});
        var targetContainer = metadataContainer[targetKey] || (metadataContainer[targetKey] = {});
        targetContainer[metadataKey] = metadataValue;
      };
    }
    if (typeof theGlobal.Reflect.metadata === 'undefined') {
      Reflect.metadata = function(metadataKey, metadataValue) {
        return function(target, targetKey) {
          Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
        };
      };
    }
    function ensureDecorators(target) {
      var applicator;
      if (typeof target.decorators === 'function') {
        applicator = target.decorators();
      } else {
        applicator = target.decorators;
      }
      if (typeof applicator._decorate === 'function') {
        delete target.decorators;
        applicator._decorate(target);
      } else {
        throw new Error('The return value of your decorator\'s method was not valid.');
      }
    }
    var Metadata = {
      global: theGlobal,
      resource: 'aurelia:resource',
      paramTypes: 'design:paramtypes',
      properties: 'design:properties',
      get: function get(metadataKey, target, targetKey) {
        if (!target) {
          return undefined;
        }
        var result = Metadata.getOwn(metadataKey, target, targetKey);
        return result === undefined ? Metadata.get(metadataKey, Object.getPrototypeOf(target), targetKey) : result;
      },
      getOwn: function getOwn(metadataKey, target, targetKey) {
        if (!target) {
          return undefined;
        }
        if (target.hasOwnProperty('decorators')) {
          ensureDecorators(target);
        }
        return Reflect.getOwnMetadata(metadataKey, target, targetKey);
      },
      define: function define(metadataKey, metadataValue, target, targetKey) {
        Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
      },
      getOrCreateOwn: function getOrCreateOwn(metadataKey, Type, target, targetKey) {
        var result = Metadata.getOwn(metadataKey, target, targetKey);
        if (result === undefined) {
          result = new Type();
          Reflect.defineMetadata(metadataKey, result, target, targetKey);
        }
        return result;
      }
    };
    exports.Metadata = Metadata;
    var originStorage = new Map(),
        unknownOrigin = Object.freeze({
          moduleId: undefined,
          moduleMember: undefined
        });
    var Origin = (function() {
      function Origin(moduleId, moduleMember) {
        _classCallCheck(this, Origin);
        this.moduleId = moduleId;
        this.moduleMember = moduleMember;
      }
      Origin.get = function get(fn) {
        var origin = originStorage.get(fn);
        if (origin === undefined) {
          System.forEachModule(function(key, value) {
            for (var name in value) {
              var exp = value[name];
              if (exp === fn) {
                originStorage.set(fn, origin = new Origin(key, name));
                return true;
              }
            }
            if (value === fn) {
              originStorage.set(fn, origin = new Origin(key, 'default'));
              return true;
            }
          });
        }
        return origin || unknownOrigin;
      };
      Origin.set = function set(fn, origin) {
        originStorage.set(fn, origin);
      };
      return Origin;
    })();
    exports.Origin = Origin;
    var DecoratorApplicator = (function() {
      function DecoratorApplicator() {
        _classCallCheck(this, DecoratorApplicator);
        this._first = null;
        this._second = null;
        this._third = null;
        this._rest = null;
      }
      DecoratorApplicator.prototype.decorator = function decorator(_decorator) {
        if (this._first === null) {
          this._first = _decorator;
          return this;
        }
        if (this._second === null) {
          this._second = _decorator;
          return this;
        }
        if (this._third === null) {
          this._third = _decorator;
          return this;
        }
        if (this._rest === null) {
          this._rest = [];
        }
        this._rest.push(_decorator);
        return this;
      };
      DecoratorApplicator.prototype._decorate = function _decorate(target) {
        var i,
            ii,
            rest;
        if (this._first !== null) {
          this._first(target);
        }
        if (this._second !== null) {
          this._second(target);
        }
        if (this._third !== null) {
          this._third(target);
        }
        rest = this._rest;
        if (rest !== null) {
          for (i = 0, ii = rest.length; i < ii; ++i) {
            rest[i](target);
          }
        }
      };
      return DecoratorApplicator;
    })();
    exports.DecoratorApplicator = DecoratorApplicator;
    var Decorators = {configure: {
        parameterizedDecorator: function parameterizedDecorator(name, decorator) {
          Decorators[name] = function() {
            var applicator = new DecoratorApplicator();
            return applicator[name].apply(applicator, arguments);
          };
          DecoratorApplicator.prototype[name] = function() {
            var result = decorator.apply(null, arguments);
            return this.decorator(result);
          };
        },
        simpleDecorator: function simpleDecorator(name, decorator) {
          Decorators[name] = function() {
            return new DecoratorApplicator().decorator(decorator);
          };
          DecoratorApplicator.prototype[name] = function() {
            return this.decorator(decorator);
          };
        }
      }};
    exports.Decorators = Decorators;
  }).call(__exports, __exports, __require('npm:core-js@0.9.18'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/metadata@0.7.1", ["github:aurelia/metadata@0.7.1/aurelia-metadata"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/metadata@0.7.1/aurelia-metadata'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/loader-default@0.9.1/aurelia-loader-default", ["github:aurelia/metadata@0.7.1", "github:aurelia/loader@0.8.3"], false, function(__require, __exports, __module) {
  return (function(exports, _aureliaMetadata, _aureliaLoader) {
    'use strict';
    exports.__esModule = true;
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }});
      if (superClass)
        subClass.__proto__ = superClass;
    }
    var polyfilled = false;
    if (!window.System || !window.System['import']) {
      var sys = window.System = window.System || {};
      sys.polyfilled = polyfilled = true;
      sys.isFake = false;
      sys.map = {};
      sys['import'] = function(moduleId) {
        return new Promise(function(resolve, reject) {
          require([moduleId], resolve, reject);
        });
      };
      sys.normalize = function(url) {
        return Promise.resolve(url);
      };
      if (window.requirejs && requirejs.s && requirejs.s.contexts && requirejs.s.contexts._ && requirejs.s.contexts._.defined) {
        var defined = requirejs.s.contexts._.defined;
        sys.forEachModule = function(callback) {
          for (var key in defined) {
            if (callback(key, defined[key]))
              return ;
          }
        };
      } else {
        sys.forEachModule = function(callback) {};
      }
    } else {
      var modules = System._loader.modules;
      System.isFake = false;
      System.forEachModule = function(callback) {
        for (var key in modules) {
          if (callback(key, modules[key].module))
            return ;
        }
      };
    }
    function ensureOriginOnExports(executed, name) {
      var target = executed,
          key,
          exportedValue;
      if (target.__useDefault) {
        target = target['default'];
      }
      _aureliaMetadata.Origin.set(target, new _aureliaMetadata.Origin(name, 'default'));
      for (key in target) {
        exportedValue = target[key];
        if (typeof exportedValue === 'function') {
          _aureliaMetadata.Origin.set(exportedValue, new _aureliaMetadata.Origin(name, key));
        }
      }
      return executed;
    }
    var DefaultLoader = (function(_Loader) {
      function DefaultLoader() {
        _classCallCheck(this, DefaultLoader);
        _Loader.call(this);
        this.moduleRegistry = {};
        var that = this;
        if (polyfilled) {
          define('view', [], {'load': function load(name, req, onload, config) {
              var entry = that.getOrCreateTemplateRegistryEntry(name),
                  address;
              if (entry.templateIsLoaded) {
                onload(entry);
                return ;
              }
              that.findBundledTemplate(name, entry).then(function(found) {
                if (found) {
                  onload(entry);
                } else {
                  address = req.toUrl(name);
                  that.importTemplate(address).then(function(template) {
                    entry.setTemplate(template);
                    onload(entry);
                  });
                }
              });
            }});
        } else {
          System.set('view', System.newModule({
            'fetch': function fetch(load, _fetch) {
              var id = load.name.substring(0, load.name.indexOf('!'));
              var entry = load.metadata.templateRegistryEntry = that.getOrCreateTemplateRegistryEntry(id);
              if (entry.templateIsLoaded) {
                return '';
              }
              return that.findBundledTemplate(load.name, entry).then(function(found) {
                if (found) {
                  return '';
                }
                return that.importTemplate(load.address).then(function(template) {
                  entry.setTemplate(template);
                  return '';
                });
              });
            },
            'instantiate': function instantiate(load) {
              return load.metadata.templateRegistryEntry;
            }
          }));
        }
      }
      _inherits(DefaultLoader, _Loader);
      DefaultLoader.prototype.loadModule = function loadModule(id) {
        var _this = this;
        return System.normalize(id).then(function(newId) {
          var existing = _this.moduleRegistry[newId];
          if (existing) {
            return existing;
          }
          return System['import'](newId).then(function(m) {
            _this.moduleRegistry[newId] = m;
            return ensureOriginOnExports(m, newId);
          });
        });
      };
      DefaultLoader.prototype.loadAllModules = function loadAllModules(ids) {
        var loads = [];
        for (var i = 0,
            ii = ids.length; i < ii; ++i) {
          loads.push(this.loadModule(ids[i]));
        }
        return Promise.all(loads);
      };
      DefaultLoader.prototype.loadTemplate = function loadTemplate(url) {
        return polyfilled ? System['import']('view!' + url) : System['import'](url + '!view');
      };
      DefaultLoader.prototype.loadText = function loadText(url) {
        return polyfilled ? System['import']('text!' + url) : System['import'](url + '!text');
      };
      return DefaultLoader;
    })(_aureliaLoader.Loader);
    exports.DefaultLoader = DefaultLoader;
    window.AureliaLoader = DefaultLoader;
  }).call(__exports, __exports, __require('github:aurelia/metadata@0.7.1'), __require('github:aurelia/loader@0.8.3'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/loader-default@0.9.1", ["github:aurelia/loader-default@0.9.1/aurelia-loader-default"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/loader-default@0.9.1/aurelia-loader-default'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/logging@0.6.2/aurelia-logging", [], false, function(__require, __exports, __module) {
  return (function(exports) {
    'use strict';
    exports.__esModule = true;
    exports.AggregateError = AggregateError;
    exports.getLogger = getLogger;
    exports.addAppender = addAppender;
    exports.setLevel = setLevel;
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    function AggregateError(msg, inner, skipIfAlreadyAggregate) {
      if (inner) {
        if (inner.innerError && skipIfAlreadyAggregate) {
          return inner;
        }
        if (inner.stack) {
          msg += '\n------------------------------------------------\ninner error: ' + inner.stack;
        }
      }
      var err = new Error(msg);
      if (inner) {
        err.innerError = inner;
      }
      return err;
    }
    var logLevel = {
      none: 0,
      error: 1,
      warn: 2,
      info: 3,
      debug: 4
    };
    exports.logLevel = logLevel;
    var loggers = {},
        currentLevel = logLevel.none,
        appenders = [],
        slice = Array.prototype.slice,
        loggerConstructionKey = {};
    function log(logger, level, args) {
      var i = appenders.length,
          current;
      args = slice.call(args);
      args.unshift(logger);
      while (i--) {
        current = appenders[i];
        current[level].apply(current, args);
      }
    }
    function debug() {
      if (currentLevel < 4) {
        return ;
      }
      log(this, 'debug', arguments);
    }
    function info() {
      if (currentLevel < 3) {
        return ;
      }
      log(this, 'info', arguments);
    }
    function warn() {
      if (currentLevel < 2) {
        return ;
      }
      log(this, 'warn', arguments);
    }
    function error() {
      if (currentLevel < 1) {
        return ;
      }
      log(this, 'error', arguments);
    }
    function connectLogger(logger) {
      logger.debug = debug;
      logger.info = info;
      logger.warn = warn;
      logger.error = error;
    }
    function createLogger(id) {
      var logger = new Logger(id, loggerConstructionKey);
      if (appenders.length) {
        connectLogger(logger);
      }
      return logger;
    }
    function getLogger(id) {
      return loggers[id] || (loggers[id] = createLogger(id));
    }
    function addAppender(appender) {
      appenders.push(appender);
      if (appenders.length === 1) {
        for (var key in loggers) {
          connectLogger(loggers[key]);
        }
      }
    }
    function setLevel(level) {
      currentLevel = level;
    }
    var Logger = (function() {
      function Logger(id, key) {
        _classCallCheck(this, Logger);
        if (key !== loggerConstructionKey) {
          throw new Error('You cannot instantiate "Logger". Use the "getLogger" API instead.');
        }
        this.id = id;
      }
      Logger.prototype.debug = function debug(message) {};
      Logger.prototype.info = function info(message) {};
      Logger.prototype.warn = function warn(message) {};
      Logger.prototype.error = function error(message) {};
      return Logger;
    })();
    exports.Logger = Logger;
  }).call(__exports, __exports);
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/route-recognizer@0.6.1/aurelia-route-recognizer", ["npm:core-js@0.9.18"], false, function(__require, __exports, __module) {
  return (function(exports, _coreJs) {
    'use strict';
    exports.__esModule = true;
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {'default': obj};
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var _core = _interopRequireDefault(_coreJs);
    var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];
    var escapeRegex = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
    var StaticSegment = (function() {
      function StaticSegment(string) {
        _classCallCheck(this, StaticSegment);
        this.string = string;
      }
      StaticSegment.prototype.eachChar = function eachChar(callback) {
        for (var _iterator = this.string,
            _isArray = Array.isArray(_iterator),
            _i = 0,
            _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ; ) {
          var _ref;
          if (_isArray) {
            if (_i >= _iterator.length)
              break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done)
              break;
            _ref = _i.value;
          }
          var ch = _ref;
          callback({validChars: ch});
        }
      };
      StaticSegment.prototype.regex = function regex() {
        return this.string.replace(escapeRegex, '\\$1');
      };
      StaticSegment.prototype.generate = function generate(params, consumed) {
        return this.string;
      };
      return StaticSegment;
    })();
    exports.StaticSegment = StaticSegment;
    var DynamicSegment = (function() {
      function DynamicSegment(name) {
        _classCallCheck(this, DynamicSegment);
        this.name = name;
      }
      DynamicSegment.prototype.eachChar = function eachChar(callback) {
        callback({
          invalidChars: '/',
          repeat: true
        });
      };
      DynamicSegment.prototype.regex = function regex() {
        return '([^/]+)';
      };
      DynamicSegment.prototype.generate = function generate(params, consumed) {
        consumed[this.name] = true;
        return params[this.name];
      };
      return DynamicSegment;
    })();
    exports.DynamicSegment = DynamicSegment;
    var StarSegment = (function() {
      function StarSegment(name) {
        _classCallCheck(this, StarSegment);
        this.name = name;
      }
      StarSegment.prototype.eachChar = function eachChar(callback) {
        callback({
          invalidChars: '',
          repeat: true
        });
      };
      StarSegment.prototype.regex = function regex() {
        return '(.+)';
      };
      StarSegment.prototype.generate = function generate(params, consumed) {
        consumed[this.name] = true;
        return params[this.name];
      };
      return StarSegment;
    })();
    exports.StarSegment = StarSegment;
    var EpsilonSegment = (function() {
      function EpsilonSegment() {
        _classCallCheck(this, EpsilonSegment);
      }
      EpsilonSegment.prototype.eachChar = function eachChar(callback) {};
      EpsilonSegment.prototype.regex = function regex() {
        return '';
      };
      EpsilonSegment.prototype.generate = function generate(params, consumed) {
        return '';
      };
      return EpsilonSegment;
    })();
    exports.EpsilonSegment = EpsilonSegment;
    var State = (function() {
      function State(charSpec) {
        _classCallCheck(this, State);
        this.charSpec = charSpec;
        this.nextStates = [];
      }
      State.prototype.get = function get(charSpec) {
        for (var _iterator2 = this.nextStates,
            _isArray2 = Array.isArray(_iterator2),
            _i2 = 0,
            _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator](); ; ) {
          var _ref2;
          if (_isArray2) {
            if (_i2 >= _iterator2.length)
              break;
            _ref2 = _iterator2[_i2++];
          } else {
            _i2 = _iterator2.next();
            if (_i2.done)
              break;
            _ref2 = _i2.value;
          }
          var child = _ref2;
          var isEqual = child.charSpec.validChars === charSpec.validChars && child.charSpec.invalidChars === charSpec.invalidChars;
          if (isEqual) {
            return child;
          }
        }
      };
      State.prototype.put = function put(charSpec) {
        var state = this.get(charSpec);
        if (state) {
          return state;
        }
        state = new State(charSpec);
        this.nextStates.push(state);
        if (charSpec.repeat) {
          state.nextStates.push(state);
        }
        return state;
      };
      State.prototype.match = function match(ch) {
        var nextStates = this.nextStates,
            results = [],
            child,
            charSpec,
            chars;
        for (var i = 0,
            l = nextStates.length; i < l; i++) {
          child = nextStates[i];
          charSpec = child.charSpec;
          if (typeof(chars = charSpec.validChars) !== 'undefined') {
            if (chars.indexOf(ch) !== -1) {
              results.push(child);
            }
          } else if (typeof(chars = charSpec.invalidChars) !== 'undefined') {
            if (chars.indexOf(ch) === -1) {
              results.push(child);
            }
          }
        }
        return results;
      };
      return State;
    })();
    exports.State = State;
    ;
    var RouteRecognizer = (function() {
      function RouteRecognizer() {
        _classCallCheck(this, RouteRecognizer);
        this.rootState = new State();
        this.names = {};
      }
      RouteRecognizer.prototype.add = function add(route) {
        if (Array.isArray(route)) {
          for (var _iterator3 = route,
              _isArray3 = Array.isArray(_iterator3),
              _i3 = 0,
              _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator](); ; ) {
            var _ref3;
            if (_isArray3) {
              if (_i3 >= _iterator3.length)
                break;
              _ref3 = _iterator3[_i3++];
            } else {
              _i3 = _iterator3.next();
              if (_i3.done)
                break;
              _ref3 = _i3.value;
            }
            var r = _ref3;
            this.add(r);
          }
          return ;
        }
        var currentState = this.rootState,
            regex = '^',
            types = {
              statics: 0,
              dynamics: 0,
              stars: 0
            },
            names = [],
            routeName = route.handler.name,
            isEmpty = true;
        var segments = parse(route.path, names, types);
        for (var _iterator4 = segments,
            _isArray4 = Array.isArray(_iterator4),
            _i4 = 0,
            _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator](); ; ) {
          var _ref4;
          if (_isArray4) {
            if (_i4 >= _iterator4.length)
              break;
            _ref4 = _iterator4[_i4++];
          } else {
            _i4 = _iterator4.next();
            if (_i4.done)
              break;
            _ref4 = _i4.value;
          }
          var segment = _ref4;
          if (segment instanceof EpsilonSegment) {
            continue;
          }
          isEmpty = false;
          currentState = currentState.put({validChars: '/'});
          regex += '/';
          currentState = addSegment(currentState, segment);
          regex += segment.regex();
        }
        if (isEmpty) {
          currentState = currentState.put({validChars: '/'});
          regex += '/';
        }
        var handlers = [{
          handler: route.handler,
          names: names
        }];
        if (routeName) {
          this.names[routeName] = {
            segments: segments,
            handlers: handlers
          };
        }
        currentState.handlers = handlers;
        currentState.regex = new RegExp(regex + '$');
        currentState.types = types;
        return currentState;
      };
      RouteRecognizer.prototype.handlersFor = function handlersFor(name) {
        var route = this.names[name],
            result = [];
        if (!route) {
          throw new Error('There is no route named ' + name);
        }
        for (var i = 0,
            l = route.handlers.length; i < l; i++) {
          result.push(route.handlers[i]);
        }
        return result;
      };
      RouteRecognizer.prototype.hasRoute = function hasRoute(name) {
        return !!this.names[name];
      };
      RouteRecognizer.prototype.generate = function generate(name, params) {
        params = Object.assign({}, params);
        var route = this.names[name],
            consumed = {},
            output = '';
        if (!route) {
          throw new Error('There is no route named ' + name);
        }
        var segments = route.segments;
        for (var i = 0,
            l = segments.length; i < l; i++) {
          var segment = segments[i];
          if (segment instanceof EpsilonSegment) {
            continue;
          }
          output += '/';
          var segmentValue = segment.generate(params, consumed);
          if (segmentValue === null || segmentValue === undefined) {
            throw new Error('A value is required for route parameter \'' + segment.name + '\' in route \'' + name + '\'.');
          }
          output += segmentValue;
        }
        if (output.charAt(0) !== '/') {
          output = '/' + output;
        }
        for (var param in consumed) {
          delete params[param];
        }
        output += this.generateQueryString(params);
        return output;
      };
      RouteRecognizer.prototype.generateQueryString = function generateQueryString(params) {
        var pairs = [],
            keys = [],
            encode = encodeURIComponent,
            encodeKey = function encodeKey(k) {
              return encode(k).replace('%24', '$');
            };
        for (var key in params) {
          if (params.hasOwnProperty(key)) {
            keys.push(key);
          }
        }
        keys.sort();
        for (var i = 0,
            len = keys.length; i < len; i++) {
          key = keys[i];
          var value = params[key];
          if (value === null || value === undefined) {
            continue;
          }
          if (Array.isArray(value)) {
            var arrayKey = encodeKey(key) + '[]';
            for (var j = 0,
                l = value.length; j < l; j++) {
              pairs.push(arrayKey + '=' + encode(value[j]));
            }
          } else {
            pairs.push(encodeKey(key) + '=' + encode(value));
          }
        }
        if (pairs.length === 0) {
          return '';
        }
        return '?' + pairs.join('&');
      };
      RouteRecognizer.prototype.parseQueryString = function parseQueryString(queryString) {
        var queryParams = {};
        if (!queryString || typeof queryString !== 'string') {
          return queryParams;
        }
        if (queryString.charAt(0) === '?') {
          queryString = queryString.substr(1);
        }
        var pairs = queryString.split('&');
        for (var i = 0; i < pairs.length; i++) {
          var pair = pairs[i].split('='),
              key = decodeURIComponent(pair[0]),
              keyLength = key.length,
              isArray = false,
              value;
          if (!key) {
            continue;
          } else if (pair.length === 1) {
            value = true;
          } else {
            if (keyLength > 2 && key.slice(keyLength - 2) === '[]') {
              isArray = true;
              key = key.slice(0, keyLength - 2);
              if (!queryParams[key]) {
                queryParams[key] = [];
              }
            }
            value = pair[1] ? decodeURIComponent(pair[1]) : '';
          }
          if (isArray) {
            queryParams[key].push(value);
          } else {
            queryParams[key] = value;
          }
        }
        return queryParams;
      };
      RouteRecognizer.prototype.recognize = function recognize(path) {
        var states = [this.rootState],
            pathLen,
            i,
            l,
            queryStart,
            queryParams = {},
            isSlashDropped = false;
        queryStart = path.indexOf('?');
        if (queryStart !== -1) {
          var queryString = path.substr(queryStart + 1, path.length);
          path = path.substr(0, queryStart);
          queryParams = this.parseQueryString(queryString);
        }
        path = decodeURI(path);
        if (path.charAt(0) !== '/') {
          path = '/' + path;
        }
        pathLen = path.length;
        if (pathLen > 1 && path.charAt(pathLen - 1) === '/') {
          path = path.substr(0, pathLen - 1);
          isSlashDropped = true;
        }
        for (i = 0, l = path.length; i < l; i++) {
          states = recognizeChar(states, path.charAt(i));
          if (!states.length) {
            break;
          }
        }
        var solutions = [];
        for (i = 0, l = states.length; i < l; i++) {
          if (states[i].handlers) {
            solutions.push(states[i]);
          }
        }
        states = sortSolutions(solutions);
        var state = solutions[0];
        if (state && state.handlers) {
          if (isSlashDropped && state.regex.source.slice(-5) === '(.+)$') {
            path = path + '/';
          }
          return findHandler(state, path, queryParams);
        }
      };
      return RouteRecognizer;
    })();
    exports.RouteRecognizer = RouteRecognizer;
    var RecognizeResults = function RecognizeResults(queryParams) {
      _classCallCheck(this, RecognizeResults);
      this.splice = Array.prototype.splice;
      this.slice = Array.prototype.slice;
      this.push = Array.prototype.push;
      this.length = 0;
      this.queryParams = queryParams || {};
    };
    function parse(route, names, types) {
      if (route.charAt(0) === '/') {
        route = route.substr(1);
      }
      var results = [];
      for (var _iterator5 = route.split('/'),
          _isArray5 = Array.isArray(_iterator5),
          _i5 = 0,
          _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator](); ; ) {
        var _ref5;
        if (_isArray5) {
          if (_i5 >= _iterator5.length)
            break;
          _ref5 = _iterator5[_i5++];
        } else {
          _i5 = _iterator5.next();
          if (_i5.done)
            break;
          _ref5 = _i5.value;
        }
        var segment = _ref5;
        var match = undefined;
        if (match = segment.match(/^:([^\/]+)$/)) {
          results.push(new DynamicSegment(match[1]));
          names.push(match[1]);
          types.dynamics++;
        } else if (match = segment.match(/^\*([^\/]+)$/)) {
          results.push(new StarSegment(match[1]));
          names.push(match[1]);
          types.stars++;
        } else if (segment === '') {
          results.push(new EpsilonSegment());
        } else {
          results.push(new StaticSegment(segment));
          types.statics++;
        }
      }
      return results;
    }
    function sortSolutions(states) {
      return states.sort(function(a, b) {
        if (a.types.stars !== b.types.stars) {
          return a.types.stars - b.types.stars;
        }
        if (a.types.stars) {
          if (a.types.statics !== b.types.statics) {
            return b.types.statics - a.types.statics;
          }
          if (a.types.dynamics !== b.types.dynamics) {
            return b.types.dynamics - a.types.dynamics;
          }
        }
        if (a.types.dynamics !== b.types.dynamics) {
          return a.types.dynamics - b.types.dynamics;
        }
        if (a.types.statics !== b.types.statics) {
          return b.types.statics - a.types.statics;
        }
        return 0;
      });
    }
    function recognizeChar(states, ch) {
      var nextStates = [];
      for (var i = 0,
          l = states.length; i < l; i++) {
        var state = states[i];
        nextStates = nextStates.concat(state.match(ch));
      }
      return nextStates;
    }
    function findHandler(state, path, queryParams) {
      var handlers = state.handlers,
          regex = state.regex;
      var captures = path.match(regex),
          currentCapture = 1;
      var result = new RecognizeResults(queryParams);
      for (var i = 0,
          l = handlers.length; i < l; i++) {
        var handler = handlers[i],
            names = handler.names,
            params = {};
        for (var j = 0,
            m = names.length; j < m; j++) {
          params[names[j]] = captures[currentCapture++];
        }
        result.push({
          handler: handler.handler,
          params: params,
          isDynamic: !!names.length
        });
      }
      return result;
    }
    function addSegment(currentState, segment) {
      segment.eachChar(function(ch) {
        currentState = currentState.put(ch);
      });
      return currentState;
    }
  }).call(__exports, __exports, __require('npm:core-js@0.9.18'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/event-aggregator@0.6.2/aurelia-event-aggregator", ["github:aurelia/logging@0.6.2"], false, function(__require, __exports, __module) {
  return (function(exports, _aureliaLogging) {
    'use strict';
    exports.__esModule = true;
    exports.includeEventsIn = includeEventsIn;
    exports.configure = configure;
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var logger = _aureliaLogging.getLogger('event-aggregator');
    var Handler = (function() {
      function Handler(messageType, callback) {
        _classCallCheck(this, Handler);
        this.messageType = messageType;
        this.callback = callback;
      }
      Handler.prototype.handle = function handle(message) {
        var _this = this;
        if (message instanceof this.messageType) {
          executeHandler(function() {
            return _this.callback.call(null, message);
          });
        }
      };
      return Handler;
    })();
    function executeHandler(handler) {
      try {
        handler();
      } catch (e) {
        logger.error(e);
      }
    }
    var EventAggregator = (function() {
      function EventAggregator() {
        _classCallCheck(this, EventAggregator);
        this.eventLookup = {};
        this.messageHandlers = [];
      }
      EventAggregator.prototype.publish = function publish(event, data) {
        var subscribers,
            i;
        if (typeof event === 'string') {
          subscribers = this.eventLookup[event];
          if (subscribers) {
            subscribers = subscribers.slice();
            i = subscribers.length;
            while (i--) {
              executeHandler(function() {
                return subscribers[i](data, event);
              });
            }
          }
        } else {
          subscribers = this.messageHandlers.slice();
          i = subscribers.length;
          while (i--) {
            subscribers[i].handle(event);
          }
        }
      };
      EventAggregator.prototype.subscribe = function subscribe(event, callback) {
        var subscribers,
            handler;
        if (typeof event === 'string') {
          subscribers = this.eventLookup[event] || (this.eventLookup[event] = []);
          subscribers.push(callback);
          return function() {
            var idx = subscribers.indexOf(callback);
            if (idx != -1) {
              subscribers.splice(idx, 1);
            }
          };
        } else {
          handler = new Handler(event, callback);
          subscribers = this.messageHandlers;
          subscribers.push(handler);
          return function() {
            var idx = subscribers.indexOf(handler);
            if (idx != -1) {
              subscribers.splice(idx, 1);
            }
          };
        }
      };
      EventAggregator.prototype.subscribeOnce = function subscribeOnce(event, callback) {
        var sub = this.subscribe(event, function(data, event) {
          sub();
          return callback(data, event);
        });
        return sub;
      };
      return EventAggregator;
    })();
    exports.EventAggregator = EventAggregator;
    function includeEventsIn(obj) {
      var ea = new EventAggregator();
      obj.subscribeOnce = function(event, callback) {
        return ea.subscribeOnce(event, callback);
      };
      obj.subscribe = function(event, callback) {
        return ea.subscribe(event, callback);
      };
      obj.publish = function(event, data) {
        ea.publish(event, data);
      };
      return ea;
    }
    function configure(aurelia) {
      aurelia.withInstance(EventAggregator, includeEventsIn(aurelia));
    }
  }).call(__exports, __exports, __require('github:aurelia/logging@0.6.2'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/task-queue@0.6.1/aurelia-task-queue", [], false, function(__require, __exports, __module) {
  return (function(exports) {
    'use strict';
    exports.__esModule = true;
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var BrowserMutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var hasSetImmediate = typeof setImmediate === 'function';
    function makeRequestFlushFromMutationObserver(flush) {
      var toggle = 1;
      var observer = new BrowserMutationObserver(flush);
      var node = document.createTextNode('');
      observer.observe(node, {characterData: true});
      return function requestFlush() {
        toggle = -toggle;
        node.data = toggle;
      };
    }
    function makeRequestFlushFromTimer(flush) {
      return function requestFlush() {
        var timeoutHandle = setTimeout(handleFlushTimer, 0);
        var intervalHandle = setInterval(handleFlushTimer, 50);
        function handleFlushTimer() {
          clearTimeout(timeoutHandle);
          clearInterval(intervalHandle);
          flush();
        }
      };
    }
    var TaskQueue = (function() {
      function TaskQueue() {
        var _this = this;
        _classCallCheck(this, TaskQueue);
        this.microTaskQueue = [];
        this.microTaskQueueCapacity = 1024;
        this.taskQueue = [];
        if (typeof BrowserMutationObserver === 'function') {
          this.requestFlushMicroTaskQueue = makeRequestFlushFromMutationObserver(function() {
            return _this.flushMicroTaskQueue();
          });
        } else {
          this.requestFlushMicroTaskQueue = makeRequestFlushFromTimer(function() {
            return _this.flushMicroTaskQueue();
          });
        }
        this.requestFlushTaskQueue = makeRequestFlushFromTimer(function() {
          return _this.flushTaskQueue();
        });
      }
      TaskQueue.prototype.queueMicroTask = function queueMicroTask(task) {
        if (this.microTaskQueue.length < 1) {
          this.requestFlushMicroTaskQueue();
        }
        this.microTaskQueue.push(task);
      };
      TaskQueue.prototype.queueTask = function queueTask(task) {
        if (this.taskQueue.length < 1) {
          this.requestFlushTaskQueue();
        }
        this.taskQueue.push(task);
      };
      TaskQueue.prototype.flushTaskQueue = function flushTaskQueue() {
        var queue = this.taskQueue,
            index = 0,
            task;
        this.taskQueue = [];
        while (index < queue.length) {
          task = queue[index];
          try {
            task.call();
          } catch (error) {
            this.onError(error, task);
          }
          index++;
        }
      };
      TaskQueue.prototype.flushMicroTaskQueue = function flushMicroTaskQueue() {
        var queue = this.microTaskQueue,
            capacity = this.microTaskQueueCapacity,
            index = 0,
            task;
        while (index < queue.length) {
          task = queue[index];
          try {
            task.call();
          } catch (error) {
            this.onError(error, task);
          }
          index++;
          if (index > capacity) {
            for (var scan = 0; scan < index; scan++) {
              queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
          }
        }
        queue.length = 0;
      };
      TaskQueue.prototype.onError = function onError(error, task) {
        if ('onError' in task) {
          task.onError(error);
        } else if (hasSetImmediate) {
          setImmediate(function() {
            throw error;
          });
        } else {
          setTimeout(function() {
            throw error;
          }, 0);
        }
      };
      return TaskQueue;
    })();
    exports.TaskQueue = TaskQueue;
  }).call(__exports, __exports);
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/templating-router@0.14.1/router-view", ["github:aurelia/dependency-injection@0.9.1", "github:aurelia/templating@0.13.13", "github:aurelia/router@0.10.3", "github:aurelia/metadata@0.7.1"], false, function(__require, __exports, __module) {
  return (function(exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaRouter, _aureliaMetadata) {
    'use strict';
    exports.__esModule = true;
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var RouterView = (function() {
      function RouterView(element, container, viewSlot, router) {
        _classCallCheck(this, _RouterView);
        this.element = element;
        this.container = container;
        this.viewSlot = viewSlot;
        this.router = router;
        this.router.registerViewPort(this, this.element.getAttribute('name'));
      }
      var _RouterView = RouterView;
      _RouterView.prototype.bind = function bind(executionContext) {
        this.container.viewModel = executionContext;
      };
      _RouterView.prototype.process = function process(viewPortInstruction, waitToSwap) {
        var _this = this;
        var component = viewPortInstruction.component,
            viewStrategy = component.view,
            childContainer = component.childContainer,
            viewModel = component.executionContext,
            viewModelResource = component.viewModelResource,
            metadata = viewModelResource.metadata;
        if (!viewStrategy && 'getViewStrategy' in viewModel) {
          viewStrategy = viewModel.getViewStrategy();
        }
        if (viewStrategy) {
          viewStrategy = _aureliaTemplating.ViewStrategy.normalize(viewStrategy);
          viewStrategy.makeRelativeTo(_aureliaMetadata.Origin.get(component.router.container.viewModel.constructor).moduleId);
        }
        return metadata.load(childContainer, viewModelResource.value, viewStrategy, true).then(function(viewFactory) {
          viewPortInstruction.behavior = metadata.create(childContainer, {
            executionContext: viewModel,
            viewFactory: viewFactory,
            suppressBind: true,
            host: _this.element
          });
          if (waitToSwap) {
            return ;
          }
          _this.swap(viewPortInstruction);
        });
      };
      _RouterView.prototype.swap = function swap(viewPortInstruction) {
        viewPortInstruction.behavior.view.bind(viewPortInstruction.behavior.executionContext);
        this.viewSlot.swap(viewPortInstruction.behavior.view);
        if (this.view) {
          this.view.unbind();
        }
        this.view = viewPortInstruction.behavior.view;
      };
      RouterView = _aureliaDependencyInjection.inject(Element, _aureliaDependencyInjection.Container, _aureliaTemplating.ViewSlot, _aureliaRouter.Router)(RouterView) || RouterView;
      RouterView = _aureliaTemplating.noView(RouterView) || RouterView;
      RouterView = _aureliaTemplating.customElement('router-view')(RouterView) || RouterView;
      return RouterView;
    })();
    exports.RouterView = RouterView;
  }).call(__exports, __exports, __require('github:aurelia/dependency-injection@0.9.1'), __require('github:aurelia/templating@0.13.13'), __require('github:aurelia/router@0.10.3'), __require('github:aurelia/metadata@0.7.1'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/templating-router@0.14.1/route-href", ["github:aurelia/templating@0.13.13", "github:aurelia/dependency-injection@0.9.1", "github:aurelia/router@0.10.3"], false, function(__require, __exports, __module) {
  return (function(exports, _aureliaTemplating, _aureliaDependencyInjection, _aureliaRouter) {
    'use strict';
    exports.__esModule = true;
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var RouteHref = (function() {
      function RouteHref(router, element) {
        _classCallCheck(this, _RouteHref);
        this.router = router;
        this.element = element;
      }
      var _RouteHref = RouteHref;
      _RouteHref.prototype.bind = function bind() {
        this.processChange();
      };
      _RouteHref.prototype.attributeChanged = function attributeChanged(value, previous) {
        if (previous) {
          this.element.removeAttribute(previous);
        }
        this.processChange();
      };
      _RouteHref.prototype.processChange = function processChange() {
        var href = this.router.generate(this.route, this.params);
        this.element.setAttribute(this.attribute, href);
      };
      RouteHref = _aureliaDependencyInjection.inject(_aureliaRouter.Router, Element)(RouteHref) || RouteHref;
      RouteHref = _aureliaTemplating.bindable({
        name: 'attribute',
        defaultValue: 'href'
      })(RouteHref) || RouteHref;
      RouteHref = _aureliaTemplating.bindable({
        name: 'params',
        changeHandler: 'processChange'
      })(RouteHref) || RouteHref;
      RouteHref = _aureliaTemplating.bindable({
        name: 'route',
        changeHandler: 'processChange'
      })(RouteHref) || RouteHref;
      RouteHref = _aureliaTemplating.customAttribute('route-href')(RouteHref) || RouteHref;
      return RouteHref;
    })();
    exports.RouteHref = RouteHref;
  }).call(__exports, __exports, __require('github:aurelia/templating@0.13.13'), __require('github:aurelia/dependency-injection@0.9.1'), __require('github:aurelia/router@0.10.3'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/logging@0.6.2", ["github:aurelia/logging@0.6.2/aurelia-logging"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/logging@0.6.2/aurelia-logging'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/route-recognizer@0.6.1", ["github:aurelia/route-recognizer@0.6.1/aurelia-route-recognizer"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/route-recognizer@0.6.1/aurelia-route-recognizer'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/event-aggregator@0.6.2", ["github:aurelia/event-aggregator@0.6.2/aurelia-event-aggregator"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/event-aggregator@0.6.2/aurelia-event-aggregator'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/task-queue@0.6.1", ["github:aurelia/task-queue@0.6.1/aurelia-task-queue"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/task-queue@0.6.1/aurelia-task-queue'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/dependency-injection@0.9.1/aurelia-dependency-injection", ["npm:core-js@0.9.18", "github:aurelia/metadata@0.7.1", "github:aurelia/logging@0.6.2"], false, function(__require, __exports, __module) {
  return (function(exports, _coreJs, _aureliaMetadata, _aureliaLogging) {
    'use strict';
    exports.__esModule = true;
    var _createClass = (function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ('value' in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          defineProperties(Constructor, staticProps);
        return Constructor;
      };
    })();
    exports.autoinject = autoinject;
    exports.inject = inject;
    exports.registration = registration;
    exports.transient = transient;
    exports.singleton = singleton;
    exports.instanceActivator = instanceActivator;
    exports.factory = factory;
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {'default': obj};
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }});
      if (superClass)
        subClass.__proto__ = superClass;
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var _core = _interopRequireDefault(_coreJs);
    var TransientRegistration = (function() {
      function TransientRegistration(key) {
        _classCallCheck(this, TransientRegistration);
        this.key = key;
      }
      TransientRegistration.prototype.register = function register(container, key, fn) {
        container.registerTransient(this.key || key, fn);
      };
      return TransientRegistration;
    })();
    exports.TransientRegistration = TransientRegistration;
    var SingletonRegistration = (function() {
      function SingletonRegistration(keyOrRegisterInChild) {
        var registerInChild = arguments[1] === undefined ? false : arguments[1];
        _classCallCheck(this, SingletonRegistration);
        if (typeof keyOrRegisterInChild === 'boolean') {
          this.registerInChild = keyOrRegisterInChild;
        } else {
          this.key = keyOrRegisterInChild;
          this.registerInChild = registerInChild;
        }
      }
      SingletonRegistration.prototype.register = function register(container, key, fn) {
        var destination = this.registerInChild ? container : container.root;
        destination.registerSingleton(this.key || key, fn);
      };
      return SingletonRegistration;
    })();
    exports.SingletonRegistration = SingletonRegistration;
    var Resolver = (function() {
      function Resolver() {
        _classCallCheck(this, Resolver);
      }
      Resolver.prototype.get = function get(container) {
        throw new Error('A custom Resolver must implement get(container) and return the resolved instance(s).');
      };
      return Resolver;
    })();
    exports.Resolver = Resolver;
    var Lazy = (function(_Resolver) {
      function Lazy(key) {
        _classCallCheck(this, Lazy);
        _Resolver.call(this);
        this.key = key;
      }
      _inherits(Lazy, _Resolver);
      Lazy.prototype.get = function get(container) {
        var _this = this;
        return function() {
          return container.get(_this.key);
        };
      };
      Lazy.of = function of(key) {
        return new Lazy(key);
      };
      return Lazy;
    })(Resolver);
    exports.Lazy = Lazy;
    var All = (function(_Resolver2) {
      function All(key) {
        _classCallCheck(this, All);
        _Resolver2.call(this);
        this.key = key;
      }
      _inherits(All, _Resolver2);
      All.prototype.get = function get(container) {
        return container.getAll(this.key);
      };
      All.of = function of(key) {
        return new All(key);
      };
      return All;
    })(Resolver);
    exports.All = All;
    var Optional = (function(_Resolver3) {
      function Optional(key) {
        var checkParent = arguments[1] === undefined ? false : arguments[1];
        _classCallCheck(this, Optional);
        _Resolver3.call(this);
        this.key = key;
        this.checkParent = checkParent;
      }
      _inherits(Optional, _Resolver3);
      Optional.prototype.get = function get(container) {
        if (container.hasHandler(this.key, this.checkParent)) {
          return container.get(this.key);
        }
        return null;
      };
      Optional.of = function of(key) {
        var checkParent = arguments[1] === undefined ? false : arguments[1];
        return new Optional(key, checkParent);
      };
      return Optional;
    })(Resolver);
    exports.Optional = Optional;
    var Parent = (function(_Resolver4) {
      function Parent(key) {
        _classCallCheck(this, Parent);
        _Resolver4.call(this);
        this.key = key;
      }
      _inherits(Parent, _Resolver4);
      Parent.prototype.get = function get(container) {
        return container.parent ? container.parent.get(this.key) : null;
      };
      Parent.of = function of(key) {
        return new Parent(key);
      };
      return Parent;
    })(Resolver);
    exports.Parent = Parent;
    var ClassActivator = (function() {
      function ClassActivator() {
        _classCallCheck(this, ClassActivator);
      }
      ClassActivator.prototype.invoke = function invoke(fn, args) {
        return Reflect.construct(fn, args);
      };
      _createClass(ClassActivator, null, [{
        key: 'instance',
        value: new ClassActivator(),
        enumerable: true
      }]);
      return ClassActivator;
    })();
    exports.ClassActivator = ClassActivator;
    var FactoryActivator = (function() {
      function FactoryActivator() {
        _classCallCheck(this, FactoryActivator);
      }
      FactoryActivator.prototype.invoke = function invoke(fn, args) {
        return fn.apply(undefined, args);
      };
      _createClass(FactoryActivator, null, [{
        key: 'instance',
        value: new FactoryActivator(),
        enumerable: true
      }]);
      return FactoryActivator;
    })();
    exports.FactoryActivator = FactoryActivator;
    var badKeyError = 'key/value cannot be null or undefined. Are you trying to inject/register something that doesn\'t exist with DI?';
    _aureliaMetadata.Metadata.registration = 'aurelia:registration';
    _aureliaMetadata.Metadata.instanceActivator = 'aurelia:instance-activator';
    function test() {}
    if (!test.name) {
      Object.defineProperty(Function.prototype, 'name', {get: function get() {
          var name = this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];
          Object.defineProperty(this, 'name', {value: name});
          return name;
        }});
    }
    var emptyParameters = Object.freeze([]);
    exports.emptyParameters = emptyParameters;
    var Container = (function() {
      function Container(constructionInfo) {
        _classCallCheck(this, Container);
        this.constructionInfo = constructionInfo || new Map();
        this.entries = new Map();
        this.root = this;
      }
      Container.prototype.makeGlobal = function makeGlobal() {
        Container.instance = this;
        return this;
      };
      Container.prototype.registerInstance = function registerInstance(key, instance) {
        this.registerHandler(key, function(x) {
          return instance;
        });
      };
      Container.prototype.registerTransient = function registerTransient(key, fn) {
        fn = fn || key;
        this.registerHandler(key, function(x) {
          return x.invoke(fn);
        });
      };
      Container.prototype.registerSingleton = function registerSingleton(key, fn) {
        var singleton = null;
        fn = fn || key;
        this.registerHandler(key, function(x) {
          return singleton || (singleton = x.invoke(fn));
        });
      };
      Container.prototype.autoRegister = function autoRegister(fn, key) {
        var registration;
        if (fn === null || fn === undefined) {
          throw new Error(badKeyError);
        }
        if (typeof fn === 'function') {
          registration = _aureliaMetadata.Metadata.get(_aureliaMetadata.Metadata.registration, fn);
          if (registration !== undefined) {
            registration.register(this, key || fn, fn);
          } else {
            this.registerSingleton(key || fn, fn);
          }
        } else {
          this.registerInstance(fn, fn);
        }
      };
      Container.prototype.autoRegisterAll = function autoRegisterAll(fns) {
        var i = fns.length;
        while (i--) {
          this.autoRegister(fns[i]);
        }
      };
      Container.prototype.registerHandler = function registerHandler(key, handler) {
        this._getOrCreateEntry(key).push(handler);
      };
      Container.prototype.unregister = function unregister(key) {
        this.entries['delete'](key);
      };
      Container.prototype.get = function get(key) {
        var entry;
        if (key === null || key === undefined) {
          throw new Error(badKeyError);
        }
        if (key === Container) {
          return this;
        }
        if (key instanceof Resolver) {
          return key.get(this);
        }
        entry = this.entries.get(key);
        if (entry !== undefined) {
          return entry[0](this);
        }
        if (this.parent) {
          return this.parent.get(key);
        }
        this.autoRegister(key);
        entry = this.entries.get(key);
        return entry[0](this);
      };
      Container.prototype.getAll = function getAll(key) {
        var _this2 = this;
        var entry;
        if (key === null || key === undefined) {
          throw new Error(badKeyError);
        }
        entry = this.entries.get(key);
        if (entry !== undefined) {
          return entry.map(function(x) {
            return x(_this2);
          });
        }
        if (this.parent) {
          return this.parent.getAll(key);
        }
        return [];
      };
      Container.prototype.hasHandler = function hasHandler(key) {
        var checkParent = arguments[1] === undefined ? false : arguments[1];
        if (key === null || key === undefined) {
          throw new Error(badKeyError);
        }
        return this.entries.has(key) || checkParent && this.parent && this.parent.hasHandler(key, checkParent);
      };
      Container.prototype.createChild = function createChild() {
        var childContainer = new Container(this.constructionInfo);
        childContainer.parent = this;
        childContainer.root = this.root;
        return childContainer;
      };
      Container.prototype.invoke = function invoke(fn, deps) {
        try {
          var info = this._getOrCreateConstructionInfo(fn),
              keys = info.keys,
              args = new Array(keys.length),
              i,
              ii;
          for (i = 0, ii = keys.length; i < ii; ++i) {
            args[i] = this.get(keys[i]);
          }
          if (deps !== undefined) {
            args = args.concat(deps);
          }
          return info.activator.invoke(fn, args);
        } catch (e) {
          var activatingText = info.activator instanceof ClassActivator ? 'instantiating' : 'invoking';
          var message = 'Error ' + activatingText + ' ' + fn.name + '.';
          if (i < ii) {
            message += ' The argument at index ' + i + ' (key:' + keys[i] + ') could not be satisfied.';
          }
          message += ' Check the inner error for details.';
          throw _aureliaLogging.AggregateError(message, e, true);
        }
      };
      Container.prototype._getOrCreateEntry = function _getOrCreateEntry(key) {
        var entry;
        if (key === null || key === undefined) {
          throw new Error('key cannot be null or undefined.  (Are you trying to inject something that doesn\'t exist with DI?)');
        }
        entry = this.entries.get(key);
        if (entry === undefined) {
          entry = [];
          this.entries.set(key, entry);
        }
        return entry;
      };
      Container.prototype._getOrCreateConstructionInfo = function _getOrCreateConstructionInfo(fn) {
        var info = this.constructionInfo.get(fn);
        if (info === undefined) {
          info = this._createConstructionInfo(fn);
          this.constructionInfo.set(fn, info);
        }
        return info;
      };
      Container.prototype._createConstructionInfo = function _createConstructionInfo(fn) {
        var info = {activator: _aureliaMetadata.Metadata.getOwn(_aureliaMetadata.Metadata.instanceActivator, fn) || ClassActivator.instance};
        if (fn.inject !== undefined) {
          if (typeof fn.inject === 'function') {
            info.keys = fn.inject();
          } else {
            info.keys = fn.inject;
          }
          return info;
        }
        info.keys = _aureliaMetadata.Metadata.getOwn(_aureliaMetadata.Metadata.paramTypes, fn) || emptyParameters;
        return info;
      };
      return Container;
    })();
    exports.Container = Container;
    function autoinject(target) {
      var deco = function deco(target) {
        target.inject = _aureliaMetadata.Metadata.getOwn(_aureliaMetadata.Metadata.paramTypes, target) || emptyParameters;
      };
      return target ? deco(target) : deco;
    }
    function inject() {
      for (var _len = arguments.length,
          rest = Array(_len),
          _key = 0; _key < _len; _key++) {
        rest[_key] = arguments[_key];
      }
      return function(target) {
        target.inject = rest;
      };
    }
    function registration(value) {
      return function(target) {
        _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.registration, value, target);
      };
    }
    function transient(key) {
      return registration(new TransientRegistration(key));
    }
    function singleton(keyOrRegisterInChild) {
      var registerInChild = arguments[1] === undefined ? false : arguments[1];
      return registration(new SingletonRegistration(keyOrRegisterInChild, registerInChild));
    }
    function instanceActivator(value) {
      return function(target) {
        _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.instanceActivator, value, target);
      };
    }
    function factory() {
      return instanceActivator(FactoryActivator.instance);
    }
    _aureliaMetadata.Decorators.configure.simpleDecorator('autoinject', autoinject);
    _aureliaMetadata.Decorators.configure.parameterizedDecorator('inject', inject);
    _aureliaMetadata.Decorators.configure.parameterizedDecorator('registration', registration);
    _aureliaMetadata.Decorators.configure.parameterizedDecorator('transient', transient);
    _aureliaMetadata.Decorators.configure.parameterizedDecorator('singleton', singleton);
    _aureliaMetadata.Decorators.configure.parameterizedDecorator('instanceActivator', instanceActivator);
    _aureliaMetadata.Decorators.configure.parameterizedDecorator('factory', factory);
  }).call(__exports, __exports, __require('npm:core-js@0.9.18'), __require('github:aurelia/metadata@0.7.1'), __require('github:aurelia/logging@0.6.2'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/binding@0.8.4/aurelia-binding", ["npm:core-js@0.9.18", "github:aurelia/task-queue@0.6.1", "github:aurelia/dependency-injection@0.9.1", "github:aurelia/metadata@0.7.1"], false, function(__require, __exports, __module) {
  return (function(exports, _coreJs, _aureliaTaskQueue, _aureliaDependencyInjection, _aureliaMetadata) {
    'use strict';
    exports.__esModule = true;
    var _createClass = (function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ('value' in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          defineProperties(Constructor, staticProps);
        return Constructor;
      };
    })();
    exports.calcSplices = calcSplices;
    exports.projectArraySplices = projectArraySplices;
    exports.getChangeRecords = getChangeRecords;
    exports.getArrayObserver = _getArrayObserver;
    exports.getMapObserver = _getMapObserver;
    exports.hasDeclaredDependencies = hasDeclaredDependencies;
    exports.declarePropertyDependencies = declarePropertyDependencies;
    exports.isStandardSvgAttribute = isStandardSvgAttribute;
    exports.valueConverter = valueConverter;
    exports.computedFrom = computedFrom;
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {'default': obj};
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }});
      if (superClass)
        subClass.__proto__ = superClass;
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var _core = _interopRequireDefault(_coreJs);
    var AccessKeyedObserver = (function() {
      function AccessKeyedObserver(objectInfo, keyInfo, observerLocator, evaluate) {
        var _this = this;
        _classCallCheck(this, AccessKeyedObserver);
        this.objectInfo = objectInfo;
        this.keyInfo = keyInfo;
        this.evaluate = evaluate;
        this.observerLocator = observerLocator;
        if (keyInfo.observer) {
          this.disposeKey = keyInfo.observer.subscribe(function(newValue) {
            return _this.objectOrKeyChanged(undefined, newValue);
          });
        }
        if (objectInfo.observer) {
          this.disposeObject = objectInfo.observer.subscribe(function(newValue) {
            return _this.objectOrKeyChanged(newValue);
          });
        }
        this.updatePropertySubscription(objectInfo.value, keyInfo.value);
      }
      AccessKeyedObserver.prototype.updatePropertySubscription = function updatePropertySubscription(object, key) {
        var _this2 = this;
        var callback;
        if (this.disposeProperty) {
          this.disposeProperty();
          this.disposeProperty = null;
        }
        if (object instanceof Object) {
          this.disposeProperty = this.observerLocator.getObserver(object, key).subscribe(function() {
            return _this2.notify();
          });
        }
      };
      AccessKeyedObserver.prototype.objectOrKeyChanged = function objectOrKeyChanged(object, key) {
        var oo,
            ko;
        object = object || ((oo = this.objectInfo.observer) && oo.getValue ? oo.getValue() : this.objectInfo.value);
        key = key || ((ko = this.keyInfo.observer) && ko.getValue ? ko.getValue() : this.keyInfo.value);
        this.updatePropertySubscription(object, key);
        this.notify();
      };
      AccessKeyedObserver.prototype.subscribe = function subscribe(callback) {
        var that = this;
        that.callback = callback;
        return function() {
          that.callback = null;
        };
      };
      AccessKeyedObserver.prototype.notify = function notify() {
        var callback = this.callback;
        if (callback) {
          callback(this.evaluate());
        }
      };
      AccessKeyedObserver.prototype.dispose = function dispose() {
        this.objectInfo = null;
        this.keyInfo = null;
        this.evaluate = null;
        this.observerLocator = null;
        if (this.disposeObject) {
          this.disposeObject();
        }
        if (this.disposeKey) {
          this.disposeKey();
        }
        if (this.disposeProperty) {
          this.disposeProperty();
        }
      };
      return AccessKeyedObserver;
    })();
    exports.AccessKeyedObserver = AccessKeyedObserver;
    function isIndex(s) {
      return +s === s >>> 0;
    }
    function toNumber(s) {
      return +s;
    }
    function newSplice(index, removed, addedCount) {
      return {
        index: index,
        removed: removed,
        addedCount: addedCount
      };
    }
    var EDIT_LEAVE = 0;
    var EDIT_UPDATE = 1;
    var EDIT_ADD = 2;
    var EDIT_DELETE = 3;
    function ArraySplice() {}
    ArraySplice.prototype = {
      calcEditDistances: function calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd) {
        var rowCount = oldEnd - oldStart + 1;
        var columnCount = currentEnd - currentStart + 1;
        var distances = new Array(rowCount);
        var i,
            j,
            north,
            west;
        for (i = 0; i < rowCount; ++i) {
          distances[i] = new Array(columnCount);
          distances[i][0] = i;
        }
        for (j = 0; j < columnCount; ++j) {
          distances[0][j] = j;
        }
        for (i = 1; i < rowCount; ++i) {
          for (j = 1; j < columnCount; ++j) {
            if (this.equals(current[currentStart + j - 1], old[oldStart + i - 1]))
              distances[i][j] = distances[i - 1][j - 1];
            else {
              north = distances[i - 1][j] + 1;
              west = distances[i][j - 1] + 1;
              distances[i][j] = north < west ? north : west;
            }
          }
        }
        return distances;
      },
      spliceOperationsFromEditDistances: function spliceOperationsFromEditDistances(distances) {
        var i = distances.length - 1;
        var j = distances[0].length - 1;
        var current = distances[i][j];
        var edits = [];
        while (i > 0 || j > 0) {
          if (i == 0) {
            edits.push(EDIT_ADD);
            j--;
            continue;
          }
          if (j == 0) {
            edits.push(EDIT_DELETE);
            i--;
            continue;
          }
          var northWest = distances[i - 1][j - 1];
          var west = distances[i - 1][j];
          var north = distances[i][j - 1];
          var min;
          if (west < north)
            min = west < northWest ? west : northWest;
          else
            min = north < northWest ? north : northWest;
          if (min == northWest) {
            if (northWest == current) {
              edits.push(EDIT_LEAVE);
            } else {
              edits.push(EDIT_UPDATE);
              current = northWest;
            }
            i--;
            j--;
          } else if (min == west) {
            edits.push(EDIT_DELETE);
            i--;
            current = west;
          } else {
            edits.push(EDIT_ADD);
            j--;
            current = north;
          }
        }
        edits.reverse();
        return edits;
      },
      calcSplices: function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
        var prefixCount = 0;
        var suffixCount = 0;
        var minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
        if (currentStart == 0 && oldStart == 0)
          prefixCount = this.sharedPrefix(current, old, minLength);
        if (currentEnd == current.length && oldEnd == old.length)
          suffixCount = this.sharedSuffix(current, old, minLength - prefixCount);
        currentStart += prefixCount;
        oldStart += prefixCount;
        currentEnd -= suffixCount;
        oldEnd -= suffixCount;
        if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0)
          return [];
        if (currentStart == currentEnd) {
          var splice = newSplice(currentStart, [], 0);
          while (oldStart < oldEnd)
            splice.removed.push(old[oldStart++]);
          return [splice];
        } else if (oldStart == oldEnd)
          return [newSplice(currentStart, [], currentEnd - currentStart)];
        var ops = this.spliceOperationsFromEditDistances(this.calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd));
        var splice = undefined;
        var splices = [];
        var index = currentStart;
        var oldIndex = oldStart;
        for (var i = 0; i < ops.length; ++i) {
          switch (ops[i]) {
            case EDIT_LEAVE:
              if (splice) {
                splices.push(splice);
                splice = undefined;
              }
              index++;
              oldIndex++;
              break;
            case EDIT_UPDATE:
              if (!splice)
                splice = newSplice(index, [], 0);
              splice.addedCount++;
              index++;
              splice.removed.push(old[oldIndex]);
              oldIndex++;
              break;
            case EDIT_ADD:
              if (!splice)
                splice = newSplice(index, [], 0);
              splice.addedCount++;
              index++;
              break;
            case EDIT_DELETE:
              if (!splice)
                splice = newSplice(index, [], 0);
              splice.removed.push(old[oldIndex]);
              oldIndex++;
              break;
          }
        }
        if (splice) {
          splices.push(splice);
        }
        return splices;
      },
      sharedPrefix: function sharedPrefix(current, old, searchLength) {
        for (var i = 0; i < searchLength; ++i)
          if (!this.equals(current[i], old[i]))
            return i;
        return searchLength;
      },
      sharedSuffix: function sharedSuffix(current, old, searchLength) {
        var index1 = current.length;
        var index2 = old.length;
        var count = 0;
        while (count < searchLength && this.equals(current[--index1], old[--index2]))
          count++;
        return count;
      },
      calculateSplices: function calculateSplices(current, previous) {
        return this.calcSplices(current, 0, current.length, previous, 0, previous.length);
      },
      equals: function equals(currentValue, previousValue) {
        return currentValue === previousValue;
      }
    };
    var arraySplice = new ArraySplice();
    function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
      return arraySplice.calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd);
    }
    function intersect(start1, end1, start2, end2) {
      if (end1 < start2 || end2 < start1)
        return -1;
      if (end1 == start2 || end2 == start1)
        return 0;
      if (start1 < start2) {
        if (end1 < end2)
          return end1 - start2;
        else
          return end2 - start2;
      } else {
        if (end2 < end1)
          return end2 - start1;
        else
          return end1 - start1;
      }
    }
    function mergeSplice(splices, index, removed, addedCount) {
      var splice = newSplice(index, removed, addedCount);
      var inserted = false;
      var insertionOffset = 0;
      for (var i = 0; i < splices.length; i++) {
        var current = splices[i];
        current.index += insertionOffset;
        if (inserted)
          continue;
        var intersectCount = intersect(splice.index, splice.index + splice.removed.length, current.index, current.index + current.addedCount);
        if (intersectCount >= 0) {
          splices.splice(i, 1);
          i--;
          insertionOffset -= current.addedCount - current.removed.length;
          splice.addedCount += current.addedCount - intersectCount;
          var deleteCount = splice.removed.length + current.removed.length - intersectCount;
          if (!splice.addedCount && !deleteCount) {
            inserted = true;
          } else {
            var removed = current.removed;
            if (splice.index < current.index) {
              var prepend = splice.removed.slice(0, current.index - splice.index);
              Array.prototype.push.apply(prepend, removed);
              removed = prepend;
            }
            if (splice.index + splice.removed.length > current.index + current.addedCount) {
              var append = splice.removed.slice(current.index + current.addedCount - splice.index);
              Array.prototype.push.apply(removed, append);
            }
            splice.removed = removed;
            if (current.index < splice.index) {
              splice.index = current.index;
            }
          }
        } else if (splice.index < current.index) {
          inserted = true;
          splices.splice(i, 0, splice);
          i++;
          var offset = splice.addedCount - splice.removed.length;
          current.index += offset;
          insertionOffset += offset;
        }
      }
      if (!inserted)
        splices.push(splice);
    }
    function createInitialSplices(array, changeRecords) {
      var splices = [];
      for (var i = 0; i < changeRecords.length; i++) {
        var record = changeRecords[i];
        switch (record.type) {
          case 'splice':
            mergeSplice(splices, record.index, record.removed.slice(), record.addedCount);
            break;
          case 'add':
          case 'update':
          case 'delete':
            if (!isIndex(record.name))
              continue;
            var index = toNumber(record.name);
            if (index < 0)
              continue;
            mergeSplice(splices, index, [record.oldValue], record.type === 'delete' ? 0 : 1);
            break;
          default:
            console.error('Unexpected record type: ' + JSON.stringify(record));
            break;
        }
      }
      return splices;
    }
    function projectArraySplices(array, changeRecords) {
      var splices = [];
      createInitialSplices(array, changeRecords).forEach(function(splice) {
        if (splice.addedCount == 1 && splice.removed.length == 1) {
          if (splice.removed[0] !== array[splice.index])
            splices.push(splice);
          return ;
        }
        ;
        splices = splices.concat(calcSplices(array, splice.index, splice.index + splice.addedCount, splice.removed, 0, splice.removed.length));
      });
      return splices;
    }
    var hasObjectObserve = (function detectObjectObserve() {
      if (typeof Object.observe !== 'function') {
        return false;
      }
      var records = [];
      function callback(recs) {
        records = recs;
      }
      var test = {};
      Object.observe(test, callback);
      test.id = 1;
      test.id = 2;
      delete test.id;
      Object.deliverChangeRecords(callback);
      if (records.length !== 3)
        return false;
      if (records[0].type != 'add' || records[1].type != 'update' || records[2].type != 'delete') {
        return false;
      }
      Object.unobserve(test, callback);
      return true;
    })();
    exports.hasObjectObserve = hasObjectObserve;
    var hasArrayObserve = (function detectArrayObserve() {
      if (typeof Array.observe !== 'function') {
        return false;
      }
      var records = [];
      function callback(recs) {
        records = recs;
      }
      var arr = [];
      Array.observe(arr, callback);
      arr.push(1, 2);
      arr.length = 0;
      Object.deliverChangeRecords(callback);
      if (records.length !== 2)
        return false;
      if (records[0].type != 'splice' || records[1].type != 'splice') {
        return false;
      }
      Array.unobserve(arr, callback);
      return true;
    })();
    exports.hasArrayObserve = hasArrayObserve;
    function newRecord(type, object, key, oldValue) {
      return {
        type: type,
        object: object,
        key: key,
        oldValue: oldValue
      };
    }
    function getChangeRecords(map) {
      var entries = [];
      for (var _iterator = map.keys(),
          _isArray = Array.isArray(_iterator),
          _i = 0,
          _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ; ) {
        var _ref;
        if (_isArray) {
          if (_i >= _iterator.length)
            break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done)
            break;
          _ref = _i.value;
        }
        var key = _ref;
        entries.push(newRecord('added', map, key));
      }
      return entries;
    }
    var ModifyCollectionObserver = (function() {
      function ModifyCollectionObserver(taskQueue, collection) {
        _classCallCheck(this, ModifyCollectionObserver);
        this.taskQueue = taskQueue;
        this.queued = false;
        this.callbacks = [];
        this.changeRecords = [];
        this.oldCollection = null;
        this.collection = collection;
        this.lengthPropertyName = collection instanceof Map ? 'size' : 'length';
      }
      ModifyCollectionObserver.prototype.subscribe = function subscribe(callback) {
        var callbacks = this.callbacks;
        callbacks.push(callback);
        return function() {
          callbacks.splice(callbacks.indexOf(callback), 1);
        };
      };
      ModifyCollectionObserver.prototype.addChangeRecord = function addChangeRecord(changeRecord) {
        if (this.callbacks.length === 0 && !this.lengthObserver) {
          return ;
        }
        this.changeRecords.push(changeRecord);
        if (!this.queued) {
          this.queued = true;
          this.taskQueue.queueMicroTask(this);
        }
      };
      ModifyCollectionObserver.prototype.reset = function reset(oldCollection) {
        if (!this.callbacks.length) {
          return ;
        }
        this.oldCollection = oldCollection;
        if (!this.queued) {
          this.queued = true;
          this.taskQueue.queueMicroTask(this);
        }
      };
      ModifyCollectionObserver.prototype.getLengthObserver = function getLengthObserver() {
        return this.lengthObserver || (this.lengthObserver = new CollectionLengthObserver(this.collection));
      };
      ModifyCollectionObserver.prototype.call = function call() {
        var callbacks = this.callbacks,
            i = callbacks.length,
            changeRecords = this.changeRecords,
            oldCollection = this.oldCollection,
            records;
        this.queued = false;
        this.changeRecords = [];
        this.oldCollection = null;
        if (i) {
          if (oldCollection) {
            if (this.collection instanceof Map) {
              records = getChangeRecords(oldCollection);
            } else {
              records = calcSplices(this.collection, 0, this.collection.length, oldCollection, 0, oldCollection.length);
            }
          } else {
            if (this.collection instanceof Map) {
              records = changeRecords;
            } else {
              records = projectArraySplices(this.collection, changeRecords);
            }
          }
          while (i--) {
            callbacks[i](records);
          }
        }
        if (this.lengthObserver) {
          this.lengthObserver.call(this.collection[this.lengthPropertyName]);
        }
      };
      return ModifyCollectionObserver;
    })();
    exports.ModifyCollectionObserver = ModifyCollectionObserver;
    var CollectionLengthObserver = (function() {
      function CollectionLengthObserver(collection) {
        _classCallCheck(this, CollectionLengthObserver);
        this.collection = collection;
        this.callbacks = [];
        this.lengthPropertyName = collection instanceof Map ? 'size' : 'length';
        this.currentValue = collection[this.lengthPropertyName];
      }
      CollectionLengthObserver.prototype.getValue = function getValue() {
        return this.collection[this.lengthPropertyName];
      };
      CollectionLengthObserver.prototype.setValue = function setValue(newValue) {
        this.collection[this.lengthPropertyName] = newValue;
      };
      CollectionLengthObserver.prototype.subscribe = function subscribe(callback) {
        var callbacks = this.callbacks;
        callbacks.push(callback);
        return function() {
          callbacks.splice(callbacks.indexOf(callback), 1);
        };
      };
      CollectionLengthObserver.prototype.call = function call(newValue) {
        var callbacks = this.callbacks,
            i = callbacks.length,
            oldValue = this.currentValue;
        while (i--) {
          callbacks[i](newValue, oldValue);
        }
        this.currentValue = newValue;
      };
      return CollectionLengthObserver;
    })();
    exports.CollectionLengthObserver = CollectionLengthObserver;
    var arrayProto = Array.prototype;
    function _getArrayObserver(taskQueue, array) {
      if (hasArrayObserve) {
        return new ArrayObserveObserver(array);
      } else {
        return ModifyArrayObserver.create(taskQueue, array);
      }
    }
    var ModifyArrayObserver = (function(_ModifyCollectionObserver) {
      function ModifyArrayObserver(taskQueue, array) {
        _classCallCheck(this, ModifyArrayObserver);
        _ModifyCollectionObserver.call(this, taskQueue, array);
      }
      _inherits(ModifyArrayObserver, _ModifyCollectionObserver);
      ModifyArrayObserver.create = function create(taskQueue, array) {
        var observer = new ModifyArrayObserver(taskQueue, array);
        array['pop'] = function() {
          var methodCallResult = arrayProto['pop'].apply(array, arguments);
          observer.addChangeRecord({
            type: 'delete',
            object: array,
            name: array.length,
            oldValue: methodCallResult
          });
          return methodCallResult;
        };
        array['push'] = function() {
          var methodCallResult = arrayProto['push'].apply(array, arguments);
          observer.addChangeRecord({
            type: 'splice',
            object: array,
            index: array.length - arguments.length,
            removed: [],
            addedCount: arguments.length
          });
          return methodCallResult;
        };
        array['reverse'] = function() {
          var oldArray = array.slice();
          var methodCallResult = arrayProto['reverse'].apply(array, arguments);
          observer.reset(oldArray);
          return methodCallResult;
        };
        array['shift'] = function() {
          var methodCallResult = arrayProto['shift'].apply(array, arguments);
          observer.addChangeRecord({
            type: 'delete',
            object: array,
            name: 0,
            oldValue: methodCallResult
          });
          return methodCallResult;
        };
        array['sort'] = function() {
          var oldArray = array.slice();
          var methodCallResult = arrayProto['sort'].apply(array, arguments);
          observer.reset(oldArray);
          return methodCallResult;
        };
        array['splice'] = function() {
          var methodCallResult = arrayProto['splice'].apply(array, arguments);
          observer.addChangeRecord({
            type: 'splice',
            object: array,
            index: arguments[0],
            removed: methodCallResult,
            addedCount: arguments.length > 2 ? arguments.length - 2 : 0
          });
          return methodCallResult;
        };
        array['unshift'] = function() {
          var methodCallResult = arrayProto['unshift'].apply(array, arguments);
          observer.addChangeRecord({
            type: 'splice',
            object: array,
            index: 0,
            removed: [],
            addedCount: arguments.length
          });
          return methodCallResult;
        };
        return observer;
      };
      return ModifyArrayObserver;
    })(ModifyCollectionObserver);
    var ArrayObserveObserver = (function() {
      function ArrayObserveObserver(array) {
        _classCallCheck(this, ArrayObserveObserver);
        this.array = array;
        this.callbacks = [];
      }
      ArrayObserveObserver.prototype.subscribe = function subscribe(callback) {
        var _this3 = this;
        var callbacks = this.callbacks;
        if (callbacks.length === 0) {
          this.handler = this.handleChanges.bind(this);
          Array.observe(this.array, this.handler);
        }
        callbacks.push(callback);
        return function() {
          callbacks.splice(callbacks.indexOf(callback), 1);
          if (callbacks.length === 0) {
            Array.unobserve(_this3.array, _this3.handler);
          }
        };
      };
      ArrayObserveObserver.prototype.getLengthObserver = function getLengthObserver() {
        return this.lengthObserver || (this.lengthObserver = new CollectionLengthObserver(this.array));
      };
      ArrayObserveObserver.prototype.handleChanges = function handleChanges(changeRecords) {
        var callbacks = this.callbacks,
            i = callbacks.length,
            splices;
        if (i) {
          splices = projectArraySplices(this.array, changeRecords);
          while (i--) {
            callbacks[i](splices);
          }
        }
        if (this.lengthObserver) {
          this.lengthObserver.call(this.array.length);
        }
      };
      return ArrayObserveObserver;
    })();
    var PathObserver = (function() {
      function PathObserver(leftObserver, getRightObserver, value) {
        var _this4 = this;
        _classCallCheck(this, PathObserver);
        this.leftObserver = leftObserver;
        this.disposeLeft = leftObserver.subscribe(function(newValue) {
          var newRightValue = _this4.updateRight(getRightObserver(newValue));
          _this4.notify(newRightValue);
        });
        this.updateRight(getRightObserver(value));
      }
      PathObserver.prototype.updateRight = function updateRight(observer) {
        var _this5 = this;
        this.rightObserver = observer;
        if (this.disposeRight) {
          this.disposeRight();
        }
        if (!observer) {
          return null;
        }
        this.disposeRight = observer.subscribe(function(newValue) {
          return _this5.notify(newValue);
        });
        return observer.getValue();
      };
      PathObserver.prototype.subscribe = function subscribe(callback) {
        var that = this;
        that.callback = callback;
        return function() {
          that.callback = null;
        };
      };
      PathObserver.prototype.notify = function notify(newValue) {
        var callback = this.callback;
        if (callback) {
          callback(newValue);
        }
      };
      PathObserver.prototype.dispose = function dispose() {
        if (this.disposeLeft) {
          this.disposeLeft();
        }
        if (this.disposeRight) {
          this.disposeRight();
        }
      };
      return PathObserver;
    })();
    exports.PathObserver = PathObserver;
    var CompositeObserver = (function() {
      function CompositeObserver(observers, evaluate) {
        var _this6 = this;
        _classCallCheck(this, CompositeObserver);
        this.subscriptions = new Array(observers.length);
        this.evaluate = evaluate;
        for (var i = 0,
            ii = observers.length; i < ii; i++) {
          this.subscriptions[i] = observers[i].subscribe(function(newValue) {
            _this6.notify(_this6.evaluate());
          });
        }
      }
      CompositeObserver.prototype.subscribe = function subscribe(callback) {
        var that = this;
        that.callback = callback;
        return function() {
          that.callback = null;
        };
      };
      CompositeObserver.prototype.notify = function notify(newValue) {
        var callback = this.callback;
        if (callback) {
          callback(newValue);
        }
      };
      CompositeObserver.prototype.dispose = function dispose() {
        var subscriptions = this.subscriptions;
        var i = subscriptions.length;
        while (i--) {
          subscriptions[i]();
        }
      };
      return CompositeObserver;
    })();
    exports.CompositeObserver = CompositeObserver;
    var Expression = (function() {
      function Expression() {
        _classCallCheck(this, Expression);
        this.isChain = false;
        this.isAssignable = false;
      }
      Expression.prototype.evaluate = function evaluate(scope, valueConverters, args) {
        throw new Error('Cannot evaluate ' + this);
      };
      Expression.prototype.assign = function assign(scope, value, valueConverters) {
        throw new Error('Cannot assign to ' + this);
      };
      Expression.prototype.toString = function toString() {
        return Unparser.unparse(this);
      };
      return Expression;
    })();
    exports.Expression = Expression;
    var Chain = (function(_Expression) {
      function Chain(expressions) {
        _classCallCheck(this, Chain);
        _Expression.call(this);
        this.expressions = expressions;
        this.isChain = true;
      }
      _inherits(Chain, _Expression);
      Chain.prototype.evaluate = function evaluate(scope, valueConverters) {
        var result,
            expressions = this.expressions,
            length = expressions.length,
            i,
            last;
        for (i = 0; i < length; ++i) {
          last = expressions[i].evaluate(scope, valueConverters);
          if (last !== null) {
            result = last;
          }
        }
        return result;
      };
      Chain.prototype.accept = function accept(visitor) {
        visitor.visitChain(this);
      };
      return Chain;
    })(Expression);
    exports.Chain = Chain;
    var ValueConverter = (function(_Expression2) {
      function ValueConverter(expression, name, args, allArgs) {
        _classCallCheck(this, ValueConverter);
        _Expression2.call(this);
        this.expression = expression;
        this.name = name;
        this.args = args;
        this.allArgs = allArgs;
      }
      _inherits(ValueConverter, _Expression2);
      ValueConverter.prototype.evaluate = function evaluate(scope, valueConverters) {
        var converter = valueConverters(this.name);
        if (!converter) {
          throw new Error('No ValueConverter named "' + this.name + '" was found!');
        }
        if ('toView' in converter) {
          return converter.toView.apply(converter, evalList(scope, this.allArgs, valueConverters));
        }
        return this.allArgs[0].evaluate(scope, valueConverters);
      };
      ValueConverter.prototype.assign = function assign(scope, value, valueConverters) {
        var converter = valueConverters(this.name);
        if (!converter) {
          throw new Error('No ValueConverter named "' + this.name + '" was found!');
        }
        if ('fromView' in converter) {
          value = converter.fromView.apply(converter, [value].concat(evalList(scope, this.args, valueConverters)));
        }
        return this.allArgs[0].assign(scope, value, valueConverters);
      };
      ValueConverter.prototype.accept = function accept(visitor) {
        visitor.visitValueConverter(this);
      };
      ValueConverter.prototype.connect = function connect(binding, scope) {
        var _this7 = this;
        var observer,
            childObservers = [],
            i,
            ii,
            exp,
            expInfo;
        for (i = 0, ii = this.allArgs.length; i < ii; ++i) {
          exp = this.allArgs[i];
          expInfo = exp.connect(binding, scope);
          if (expInfo.observer) {
            childObservers.push(expInfo.observer);
          }
        }
        if (childObservers.length) {
          observer = new CompositeObserver(childObservers, function() {
            return _this7.evaluate(scope, binding.valueConverterLookupFunction);
          });
        }
        return {
          value: this.evaluate(scope, binding.valueConverterLookupFunction),
          observer: observer
        };
      };
      return ValueConverter;
    })(Expression);
    exports.ValueConverter = ValueConverter;
    var Assign = (function(_Expression3) {
      function Assign(target, value) {
        _classCallCheck(this, Assign);
        _Expression3.call(this);
        this.target = target;
        this.value = value;
      }
      _inherits(Assign, _Expression3);
      Assign.prototype.evaluate = function evaluate(scope, valueConverters) {
        return this.target.assign(scope, this.value.evaluate(scope, valueConverters));
      };
      Assign.prototype.accept = function accept(vistor) {
        vistor.visitAssign(this);
      };
      Assign.prototype.connect = function connect(binding, scope) {
        return {value: this.evaluate(scope, binding.valueConverterLookupFunction)};
      };
      return Assign;
    })(Expression);
    exports.Assign = Assign;
    var Conditional = (function(_Expression4) {
      function Conditional(condition, yes, no) {
        _classCallCheck(this, Conditional);
        _Expression4.call(this);
        this.condition = condition;
        this.yes = yes;
        this.no = no;
      }
      _inherits(Conditional, _Expression4);
      Conditional.prototype.evaluate = function evaluate(scope, valueConverters) {
        return !!this.condition.evaluate(scope) ? this.yes.evaluate(scope) : this.no.evaluate(scope);
      };
      Conditional.prototype.accept = function accept(visitor) {
        visitor.visitConditional(this);
      };
      Conditional.prototype.connect = function connect(binding, scope) {
        var _this8 = this;
        var conditionInfo = this.condition.connect(binding, scope),
            yesInfo = this.yes.connect(binding, scope),
            noInfo = this.no.connect(binding, scope),
            childObservers = [],
            observer;
        if (conditionInfo.observer) {
          childObservers.push(conditionInfo.observer);
        }
        if (yesInfo.observer) {
          childObservers.push(yesInfo.observer);
        }
        if (noInfo.observer) {
          childObservers.push(noInfo.observer);
        }
        if (childObservers.length) {
          observer = new CompositeObserver(childObservers, function() {
            return _this8.evaluate(scope, binding.valueConverterLookupFunction);
          });
        }
        return {
          value: !!conditionInfo.value ? yesInfo.value : noInfo.value,
          observer: observer
        };
      };
      return Conditional;
    })(Expression);
    exports.Conditional = Conditional;
    var AccessScope = (function(_Expression5) {
      function AccessScope(name) {
        _classCallCheck(this, AccessScope);
        _Expression5.call(this);
        this.name = name;
        this.isAssignable = true;
      }
      _inherits(AccessScope, _Expression5);
      AccessScope.prototype.evaluate = function evaluate(scope, valueConverters) {
        return scope[this.name];
      };
      AccessScope.prototype.assign = function assign(scope, value) {
        return scope[this.name] = value;
      };
      AccessScope.prototype.accept = function accept(visitor) {
        visitor.visitAccessScope(this);
      };
      AccessScope.prototype.connect = function connect(binding, scope) {
        var observer = binding.getObserver(scope, this.name);
        return {
          value: observer.getValue(),
          observer: observer
        };
      };
      return AccessScope;
    })(Expression);
    exports.AccessScope = AccessScope;
    var AccessMember = (function(_Expression6) {
      function AccessMember(object, name) {
        _classCallCheck(this, AccessMember);
        _Expression6.call(this);
        this.object = object;
        this.name = name;
        this.isAssignable = true;
      }
      _inherits(AccessMember, _Expression6);
      AccessMember.prototype.evaluate = function evaluate(scope, valueConverters) {
        var instance = this.object.evaluate(scope, valueConverters);
        return instance === null || instance === undefined ? instance : instance[this.name];
      };
      AccessMember.prototype.assign = function assign(scope, value) {
        var instance = this.object.evaluate(scope);
        if (instance === null || instance === undefined) {
          instance = {};
          this.object.assign(scope, instance);
        }
        return instance[this.name] = value;
      };
      AccessMember.prototype.accept = function accept(visitor) {
        visitor.visitAccessMember(this);
      };
      AccessMember.prototype.connect = function connect(binding, scope) {
        var _this9 = this;
        var info = this.object.connect(binding, scope),
            objectInstance = info.value,
            objectObserver = info.observer,
            observer;
        if (objectObserver) {
          observer = new PathObserver(objectObserver, function(value) {
            if (value == null || value == undefined) {
              return value;
            }
            return binding.getObserver(value, _this9.name);
          }, objectInstance);
        } else {
          observer = binding.getObserver(objectInstance, this.name);
        }
        return {
          value: objectInstance == null ? null : objectInstance[this.name],
          observer: observer
        };
      };
      return AccessMember;
    })(Expression);
    exports.AccessMember = AccessMember;
    var AccessKeyed = (function(_Expression7) {
      function AccessKeyed(object, key) {
        _classCallCheck(this, AccessKeyed);
        _Expression7.call(this);
        this.object = object;
        this.key = key;
        this.isAssignable = true;
      }
      _inherits(AccessKeyed, _Expression7);
      AccessKeyed.prototype.evaluate = function evaluate(scope, valueConverters) {
        var instance = this.object.evaluate(scope, valueConverters);
        var lookup = this.key.evaluate(scope, valueConverters);
        return getKeyed(instance, lookup);
      };
      AccessKeyed.prototype.assign = function assign(scope, value) {
        var instance = this.object.evaluate(scope);
        var lookup = this.key.evaluate(scope);
        return setKeyed(instance, lookup, value);
      };
      AccessKeyed.prototype.accept = function accept(visitor) {
        visitor.visitAccessKeyed(this);
      };
      AccessKeyed.prototype.connect = function connect(binding, scope) {
        var _this10 = this;
        var objectInfo = this.object.connect(binding, scope),
            keyInfo = this.key.connect(binding, scope),
            observer = new AccessKeyedObserver(objectInfo, keyInfo, binding.observerLocator, function() {
              return _this10.evaluate(scope, binding.valueConverterLookupFunction);
            });
        return {
          value: this.evaluate(scope, binding.valueConverterLookupFunction),
          observer: observer
        };
      };
      return AccessKeyed;
    })(Expression);
    exports.AccessKeyed = AccessKeyed;
    var CallScope = (function(_Expression8) {
      function CallScope(name, args) {
        _classCallCheck(this, CallScope);
        _Expression8.call(this);
        this.name = name;
        this.args = args;
      }
      _inherits(CallScope, _Expression8);
      CallScope.prototype.evaluate = function evaluate(scope, valueConverters, args) {
        args = args || evalList(scope, this.args, valueConverters);
        return ensureFunctionFromMap(scope, this.name).apply(scope, args);
      };
      CallScope.prototype.accept = function accept(visitor) {
        visitor.visitCallScope(this);
      };
      CallScope.prototype.connect = function connect(binding, scope) {
        var _this11 = this;
        var observer,
            childObservers = [],
            i,
            ii,
            exp,
            expInfo;
        for (i = 0, ii = this.args.length; i < ii; ++i) {
          exp = this.args[i];
          expInfo = exp.connect(binding, scope);
          if (expInfo.observer) {
            childObservers.push(expInfo.observer);
          }
        }
        if (childObservers.length) {
          observer = new CompositeObserver(childObservers, function() {
            return _this11.evaluate(scope, binding.valueConverterLookupFunction);
          });
        }
        return {
          value: this.evaluate(scope, binding.valueConverterLookupFunction),
          observer: observer
        };
      };
      return CallScope;
    })(Expression);
    exports.CallScope = CallScope;
    var CallMember = (function(_Expression9) {
      function CallMember(object, name, args) {
        _classCallCheck(this, CallMember);
        _Expression9.call(this);
        this.object = object;
        this.name = name;
        this.args = args;
      }
      _inherits(CallMember, _Expression9);
      CallMember.prototype.evaluate = function evaluate(scope, valueConverters, args) {
        var instance = this.object.evaluate(scope, valueConverters);
        args = args || evalList(scope, this.args, valueConverters);
        return ensureFunctionFromMap(instance, this.name).apply(instance, args);
      };
      CallMember.prototype.accept = function accept(visitor) {
        visitor.visitCallMember(this);
      };
      CallMember.prototype.connect = function connect(binding, scope) {
        var _this12 = this;
        var observer,
            objectInfo = this.object.connect(binding, scope),
            childObservers = [],
            i,
            ii,
            exp,
            expInfo;
        if (objectInfo.observer) {
          childObservers.push(objectInfo.observer);
        }
        for (i = 0, ii = this.args.length; i < ii; ++i) {
          exp = this.args[i];
          expInfo = exp.connect(binding, scope);
          if (expInfo.observer) {
            childObservers.push(expInfo.observer);
          }
        }
        if (childObservers.length) {
          observer = new CompositeObserver(childObservers, function() {
            return _this12.evaluate(scope, binding.valueConverterLookupFunction);
          });
        }
        return {
          value: this.evaluate(scope, binding.valueConverterLookupFunction),
          observer: observer
        };
      };
      return CallMember;
    })(Expression);
    exports.CallMember = CallMember;
    var CallFunction = (function(_Expression10) {
      function CallFunction(func, args) {
        _classCallCheck(this, CallFunction);
        _Expression10.call(this);
        this.func = func;
        this.args = args;
      }
      _inherits(CallFunction, _Expression10);
      CallFunction.prototype.evaluate = function evaluate(scope, valueConverters, args) {
        var func = this.func.evaluate(scope, valueConverters);
        if (typeof func !== 'function') {
          throw new Error(this.func + ' is not a function');
        } else {
          return func.apply(null, args || evalList(scope, this.args, valueConverters));
        }
      };
      CallFunction.prototype.accept = function accept(visitor) {
        visitor.visitCallFunction(this);
      };
      CallFunction.prototype.connect = function connect(binding, scope) {
        var _this13 = this;
        var observer,
            funcInfo = this.func.connect(binding, scope),
            childObservers = [],
            i,
            ii,
            exp,
            expInfo;
        if (funcInfo.observer) {
          childObservers.push(funcInfo.observer);
        }
        for (i = 0, ii = this.args.length; i < ii; ++i) {
          exp = this.args[i];
          expInfo = exp.connect(binding, scope);
          if (expInfo.observer) {
            childObservers.push(expInfo.observer);
          }
        }
        if (childObservers.length) {
          observer = new CompositeObserver(childObservers, function() {
            return _this13.evaluate(scope, binding.valueConverterLookupFunction);
          });
        }
        return {
          value: this.evaluate(scope, binding.valueConverterLookupFunction),
          observer: observer
        };
      };
      return CallFunction;
    })(Expression);
    exports.CallFunction = CallFunction;
    var Binary = (function(_Expression11) {
      function Binary(operation, left, right) {
        _classCallCheck(this, Binary);
        _Expression11.call(this);
        this.operation = operation;
        this.left = left;
        this.right = right;
      }
      _inherits(Binary, _Expression11);
      Binary.prototype.evaluate = function evaluate(scope, valueConverters) {
        var left = this.left.evaluate(scope);
        switch (this.operation) {
          case '&&':
            return left && this.right.evaluate(scope);
          case '||':
            return left || this.right.evaluate(scope);
        }
        var right = this.right.evaluate(scope);
        switch (this.operation) {
          case '==':
            return left == right;
          case '===':
            return left === right;
          case '!=':
            return left != right;
          case '!==':
            return left !== right;
        }
        if (left === null || right === null) {
          switch (this.operation) {
            case '+':
              if (left != null)
                return left;
              if (right != null)
                return right;
              return 0;
            case '-':
              if (left != null)
                return left;
              if (right != null)
                return 0 - right;
              return 0;
          }
          return null;
        }
        switch (this.operation) {
          case '+':
            return autoConvertAdd(left, right);
          case '-':
            return left - right;
          case '*':
            return left * right;
          case '/':
            return left / right;
          case '%':
            return left % right;
          case '<':
            return left < right;
          case '>':
            return left > right;
          case '<=':
            return left <= right;
          case '>=':
            return left >= right;
          case '^':
            return left ^ right;
          case '&':
            return left & right;
        }
        throw new Error('Internal error [' + this.operation + '] not handled');
      };
      Binary.prototype.accept = function accept(visitor) {
        visitor.visitBinary(this);
      };
      Binary.prototype.connect = function connect(binding, scope) {
        var _this14 = this;
        var leftInfo = this.left.connect(binding, scope),
            rightInfo = this.right.connect(binding, scope),
            childObservers = [],
            observer;
        if (leftInfo.observer) {
          childObservers.push(leftInfo.observer);
        }
        if (rightInfo.observer) {
          childObservers.push(rightInfo.observer);
        }
        if (childObservers.length) {
          observer = new CompositeObserver(childObservers, function() {
            return _this14.evaluate(scope, binding.valueConverterLookupFunction);
          });
        }
        return {
          value: this.evaluate(scope, binding.valueConverterLookupFunction),
          observer: observer
        };
      };
      return Binary;
    })(Expression);
    exports.Binary = Binary;
    var PrefixNot = (function(_Expression12) {
      function PrefixNot(operation, expression) {
        _classCallCheck(this, PrefixNot);
        _Expression12.call(this);
        this.operation = operation;
        this.expression = expression;
      }
      _inherits(PrefixNot, _Expression12);
      PrefixNot.prototype.evaluate = function evaluate(scope, valueConverters) {
        return !this.expression.evaluate(scope);
      };
      PrefixNot.prototype.accept = function accept(visitor) {
        visitor.visitPrefix(this);
      };
      PrefixNot.prototype.connect = function connect(binding, scope) {
        var _this15 = this;
        var info = this.expression.connect(binding, scope),
            observer;
        if (info.observer) {
          observer = new CompositeObserver([info.observer], function() {
            return _this15.evaluate(scope, binding.valueConverterLookupFunction);
          });
        }
        return {
          value: !info.value,
          observer: observer
        };
      };
      return PrefixNot;
    })(Expression);
    exports.PrefixNot = PrefixNot;
    var LiteralPrimitive = (function(_Expression13) {
      function LiteralPrimitive(value) {
        _classCallCheck(this, LiteralPrimitive);
        _Expression13.call(this);
        this.value = value;
      }
      _inherits(LiteralPrimitive, _Expression13);
      LiteralPrimitive.prototype.evaluate = function evaluate(scope, valueConverters) {
        return this.value;
      };
      LiteralPrimitive.prototype.accept = function accept(visitor) {
        visitor.visitLiteralPrimitive(this);
      };
      LiteralPrimitive.prototype.connect = function connect(binding, scope) {
        return {value: this.value};
      };
      return LiteralPrimitive;
    })(Expression);
    exports.LiteralPrimitive = LiteralPrimitive;
    var LiteralString = (function(_Expression14) {
      function LiteralString(value) {
        _classCallCheck(this, LiteralString);
        _Expression14.call(this);
        this.value = value;
      }
      _inherits(LiteralString, _Expression14);
      LiteralString.prototype.evaluate = function evaluate(scope, valueConverters) {
        return this.value;
      };
      LiteralString.prototype.accept = function accept(visitor) {
        visitor.visitLiteralString(this);
      };
      LiteralString.prototype.connect = function connect(binding, scope) {
        return {value: this.value};
      };
      return LiteralString;
    })(Expression);
    exports.LiteralString = LiteralString;
    var LiteralArray = (function(_Expression15) {
      function LiteralArray(elements) {
        _classCallCheck(this, LiteralArray);
        _Expression15.call(this);
        this.elements = elements;
      }
      _inherits(LiteralArray, _Expression15);
      LiteralArray.prototype.evaluate = function evaluate(scope, valueConverters) {
        var elements = this.elements,
            length = elements.length,
            result = [],
            i;
        for (i = 0; i < length; ++i) {
          result[i] = elements[i].evaluate(scope, valueConverters);
        }
        return result;
      };
      LiteralArray.prototype.accept = function accept(visitor) {
        visitor.visitLiteralArray(this);
      };
      LiteralArray.prototype.connect = function connect(binding, scope) {
        var _this16 = this;
        var observer,
            childObservers = [],
            results = [],
            i,
            ii,
            exp,
            expInfo;
        for (i = 0, ii = this.elements.length; i < ii; ++i) {
          exp = this.elements[i];
          expInfo = exp.connect(binding, scope);
          if (expInfo.observer) {
            childObservers.push(expInfo.observer);
          }
          results[i] = expInfo.value;
        }
        if (childObservers.length) {
          observer = new CompositeObserver(childObservers, function() {
            return _this16.evaluate(scope, binding.valueConverterLookupFunction);
          });
        }
        return {
          value: results,
          observer: observer
        };
      };
      return LiteralArray;
    })(Expression);
    exports.LiteralArray = LiteralArray;
    var LiteralObject = (function(_Expression16) {
      function LiteralObject(keys, values) {
        _classCallCheck(this, LiteralObject);
        _Expression16.call(this);
        this.keys = keys;
        this.values = values;
      }
      _inherits(LiteralObject, _Expression16);
      LiteralObject.prototype.evaluate = function evaluate(scope, valueConverters) {
        var instance = {},
            keys = this.keys,
            values = this.values,
            length = keys.length,
            i;
        for (i = 0; i < length; ++i) {
          instance[keys[i]] = values[i].evaluate(scope, valueConverters);
        }
        return instance;
      };
      LiteralObject.prototype.accept = function accept(visitor) {
        visitor.visitLiteralObject(this);
      };
      LiteralObject.prototype.connect = function connect(binding, scope) {
        var _this17 = this;
        var observer,
            childObservers = [],
            instance = {},
            keys = this.keys,
            values = this.values,
            length = keys.length,
            i,
            valueInfo;
        for (i = 0; i < length; ++i) {
          valueInfo = values[i].connect(binding, scope);
          if (valueInfo.observer) {
            childObservers.push(valueInfo.observer);
          }
          instance[keys[i]] = valueInfo.value;
        }
        if (childObservers.length) {
          observer = new CompositeObserver(childObservers, function() {
            return _this17.evaluate(scope, binding.valueConverterLookupFunction);
          });
        }
        return {
          value: instance,
          observer: observer
        };
      };
      return LiteralObject;
    })(Expression);
    exports.LiteralObject = LiteralObject;
    var Unparser = (function() {
      function Unparser(buffer) {
        _classCallCheck(this, Unparser);
        this.buffer = buffer;
      }
      Unparser.unparse = function unparse(expression) {
        var buffer = [],
            visitor = new Unparser(buffer);
        expression.accept(visitor);
        return buffer.join('');
      };
      Unparser.prototype.write = function write(text) {
        this.buffer.push(text);
      };
      Unparser.prototype.writeArgs = function writeArgs(args) {
        var i,
            length;
        this.write('(');
        for (i = 0, length = args.length; i < length; ++i) {
          if (i !== 0) {
            this.write(',');
          }
          args[i].accept(this);
        }
        this.write(')');
      };
      Unparser.prototype.visitChain = function visitChain(chain) {
        var expressions = chain.expressions,
            length = expressions.length,
            i;
        for (i = 0; i < length; ++i) {
          if (i !== 0) {
            this.write(';');
          }
          expressions[i].accept(this);
        }
      };
      Unparser.prototype.visitValueConverter = function visitValueConverter(converter) {
        var args = converter.args,
            length = args.length,
            i;
        this.write('(');
        converter.expression.accept(this);
        this.write('|' + converter.name);
        for (i = 0; i < length; ++i) {
          this.write(' :');
          args[i].accept(this);
        }
        this.write(')');
      };
      Unparser.prototype.visitAssign = function visitAssign(assign) {
        assign.target.accept(this);
        this.write('=');
        assign.value.accept(this);
      };
      Unparser.prototype.visitConditional = function visitConditional(conditional) {
        conditional.condition.accept(this);
        this.write('?');
        conditional.yes.accept(this);
        this.write(':');
        conditional.no.accept(this);
      };
      Unparser.prototype.visitAccessScope = function visitAccessScope(access) {
        this.write(access.name);
      };
      Unparser.prototype.visitAccessMember = function visitAccessMember(access) {
        access.object.accept(this);
        this.write('.' + access.name);
      };
      Unparser.prototype.visitAccessKeyed = function visitAccessKeyed(access) {
        access.object.accept(this);
        this.write('[');
        access.key.accept(this);
        this.write(']');
      };
      Unparser.prototype.visitCallScope = function visitCallScope(call) {
        this.write(call.name);
        this.writeArgs(call.args);
      };
      Unparser.prototype.visitCallFunction = function visitCallFunction(call) {
        call.func.accept(this);
        this.writeArgs(call.args);
      };
      Unparser.prototype.visitCallMember = function visitCallMember(call) {
        call.object.accept(this);
        this.write('.' + call.name);
        this.writeArgs(call.args);
      };
      Unparser.prototype.visitPrefix = function visitPrefix(prefix) {
        this.write('(' + prefix.operation);
        prefix.expression.accept(this);
        this.write(')');
      };
      Unparser.prototype.visitBinary = function visitBinary(binary) {
        this.write('(');
        binary.left.accept(this);
        this.write(binary.operation);
        binary.right.accept(this);
        this.write(')');
      };
      Unparser.prototype.visitLiteralPrimitive = function visitLiteralPrimitive(literal) {
        this.write('' + literal.value);
      };
      Unparser.prototype.visitLiteralArray = function visitLiteralArray(literal) {
        var elements = literal.elements,
            length = elements.length,
            i;
        this.write('[');
        for (i = 0; i < length; ++i) {
          if (i !== 0) {
            this.write(',');
          }
          elements[i].accept(this);
        }
        this.write(']');
      };
      Unparser.prototype.visitLiteralObject = function visitLiteralObject(literal) {
        var keys = literal.keys,
            values = literal.values,
            length = keys.length,
            i;
        this.write('{');
        for (i = 0; i < length; ++i) {
          if (i !== 0) {
            this.write(',');
          }
          this.write('\'' + keys[i] + '\':');
          values[i].accept(this);
        }
        this.write('}');
      };
      Unparser.prototype.visitLiteralString = function visitLiteralString(literal) {
        var escaped = literal.value.replace(/'/g, '\'');
        this.write('\'' + escaped + '\'');
      };
      return Unparser;
    })();
    exports.Unparser = Unparser;
    var evalListCache = [[], [0], [0, 0], [0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0, 0]];
    function evalList(scope, list, valueConverters) {
      var length = list.length,
          cacheLength,
          i;
      for (cacheLength = evalListCache.length; cacheLength <= length; ++cacheLength) {
        evalListCache.push([]);
      }
      var result = evalListCache[length];
      for (i = 0; i < length; ++i) {
        result[i] = list[i].evaluate(scope, valueConverters);
      }
      return result;
    }
    function autoConvertAdd(a, b) {
      if (a != null && b != null) {
        if (typeof a == 'string' && typeof b != 'string') {
          return a + b.toString();
        }
        if (typeof a != 'string' && typeof b == 'string') {
          return a.toString() + b;
        }
        return a + b;
      }
      if (a != null) {
        return a;
      }
      if (b != null) {
        return b;
      }
      return 0;
    }
    function ensureFunctionFromMap(obj, name) {
      var func = obj[name];
      if (typeof func === 'function') {
        return func;
      }
      if (func === null) {
        throw new Error('Undefined function ' + name);
      } else {
        throw new Error(name + ' is not a function');
      }
    }
    function getKeyed(obj, key) {
      if (Array.isArray(obj)) {
        return obj[parseInt(key)];
      } else if (obj) {
        return obj[key];
      } else if (obj === null) {
        throw new Error('Accessing null object');
      } else {
        return obj[key];
      }
    }
    function setKeyed(obj, key, value) {
      if (Array.isArray(obj)) {
        var index = parseInt(key);
        if (obj.length <= index) {
          obj.length = index + 1;
        }
        obj[index] = value;
      } else {
        obj[key] = value;
      }
      return value;
    }
    var bindingMode = {
      oneTime: 0,
      oneWay: 1,
      twoWay: 2
    };
    exports.bindingMode = bindingMode;
    var Token = (function() {
      function Token(index, text) {
        _classCallCheck(this, Token);
        this.index = index;
        this.text = text;
      }
      Token.prototype.withOp = function withOp(op) {
        this.opKey = op;
        return this;
      };
      Token.prototype.withGetterSetter = function withGetterSetter(key) {
        this.key = key;
        return this;
      };
      Token.prototype.withValue = function withValue(value) {
        this.value = value;
        return this;
      };
      Token.prototype.toString = function toString() {
        return 'Token(' + this.text + ')';
      };
      return Token;
    })();
    exports.Token = Token;
    var Lexer = (function() {
      function Lexer() {
        _classCallCheck(this, Lexer);
      }
      Lexer.prototype.lex = function lex(text) {
        var scanner = new Scanner(text);
        var tokens = [];
        var token = scanner.scanToken();
        while (token) {
          tokens.push(token);
          token = scanner.scanToken();
        }
        return tokens;
      };
      return Lexer;
    })();
    exports.Lexer = Lexer;
    var Scanner = (function() {
      function Scanner(input) {
        _classCallCheck(this, Scanner);
        this.input = input;
        this.length = input.length;
        this.peek = 0;
        this.index = -1;
        this.advance();
      }
      Scanner.prototype.scanToken = function scanToken() {
        while (this.peek <= $SPACE) {
          if (++this.index >= this.length) {
            this.peek = $EOF;
            return null;
          } else {
            this.peek = this.input.charCodeAt(this.index);
          }
        }
        if (isIdentifierStart(this.peek)) {
          return this.scanIdentifier();
        }
        if (isDigit(this.peek)) {
          return this.scanNumber(this.index);
        }
        var start = this.index;
        switch (this.peek) {
          case $PERIOD:
            this.advance();
            return isDigit(this.peek) ? this.scanNumber(start) : new Token(start, '.');
          case $LPAREN:
          case $RPAREN:
          case $LBRACE:
          case $RBRACE:
          case $LBRACKET:
          case $RBRACKET:
          case $COMMA:
          case $COLON:
          case $SEMICOLON:
            return this.scanCharacter(start, String.fromCharCode(this.peek));
          case $SQ:
          case $DQ:
            return this.scanString();
          case $PLUS:
          case $MINUS:
          case $STAR:
          case $SLASH:
          case $PERCENT:
          case $CARET:
          case $QUESTION:
            return this.scanOperator(start, String.fromCharCode(this.peek));
          case $LT:
          case $GT:
          case $BANG:
          case $EQ:
            return this.scanComplexOperator(start, $EQ, String.fromCharCode(this.peek), '=');
          case $AMPERSAND:
            return this.scanComplexOperator(start, $AMPERSAND, '&', '&');
          case $BAR:
            return this.scanComplexOperator(start, $BAR, '|', '|');
          case $NBSP:
            while (isWhitespace(this.peek)) {
              this.advance();
            }
            return this.scanToken();
        }
        var character = String.fromCharCode(this.peek);
        this.error('Unexpected character [' + character + ']');
        return null;
      };
      Scanner.prototype.scanCharacter = function scanCharacter(start, text) {
        assert(this.peek === text.charCodeAt(0));
        this.advance();
        return new Token(start, text);
      };
      Scanner.prototype.scanOperator = function scanOperator(start, text) {
        assert(this.peek === text.charCodeAt(0));
        assert(OPERATORS.indexOf(text) !== -1);
        this.advance();
        return new Token(start, text).withOp(text);
      };
      Scanner.prototype.scanComplexOperator = function scanComplexOperator(start, code, one, two) {
        assert(this.peek === one.charCodeAt(0));
        this.advance();
        var text = one;
        if (this.peek === code) {
          this.advance();
          text += two;
        }
        if (this.peek === code) {
          this.advance();
          text += two;
        }
        assert(OPERATORS.indexOf(text) != -1);
        return new Token(start, text).withOp(text);
      };
      Scanner.prototype.scanIdentifier = function scanIdentifier() {
        assert(isIdentifierStart(this.peek));
        var start = this.index;
        this.advance();
        while (isIdentifierPart(this.peek)) {
          this.advance();
        }
        var text = this.input.substring(start, this.index);
        var result = new Token(start, text);
        if (OPERATORS.indexOf(text) !== -1) {
          result.withOp(text);
        } else {
          result.withGetterSetter(text);
        }
        return result;
      };
      Scanner.prototype.scanNumber = function scanNumber(start) {
        assert(isDigit(this.peek));
        var simple = this.index === start;
        this.advance();
        while (true) {
          if (isDigit(this.peek)) {} else if (this.peek === $PERIOD) {
            simple = false;
          } else if (isExponentStart(this.peek)) {
            this.advance();
            if (isExponentSign(this.peek)) {
              this.advance();
            }
            if (!isDigit(this.peek)) {
              this.error('Invalid exponent', -1);
            }
            simple = false;
          } else {
            break;
          }
          this.advance();
        }
        var text = this.input.substring(start, this.index);
        var value = simple ? parseInt(text) : parseFloat(text);
        return new Token(start, text).withValue(value);
      };
      Scanner.prototype.scanString = function scanString() {
        assert(this.peek === $SQ || this.peek === $DQ);
        var start = this.index;
        var quote = this.peek;
        this.advance();
        var buffer;
        var marker = this.index;
        while (this.peek !== quote) {
          if (this.peek === $BACKSLASH) {
            if (buffer === null) {
              buffer = [];
            }
            buffer.push(this.input.substring(marker, this.index));
            this.advance();
            var unescaped;
            if (this.peek === $u) {
              var hex = this.input.substring(this.index + 1, this.index + 5);
              if (!/[A-Z0-9]{4}/.test(hex)) {
                this.error('Invalid unicode escape [\\u' + hex + ']');
              }
              unescaped = parseInt(hex, 16);
              for (var i = 0; i < 5; ++i) {
                this.advance();
              }
            } else {
              unescaped = decodeURIComponent(this.peek);
              this.advance();
            }
            buffer.push(String.fromCharCode(unescaped));
            marker = this.index;
          } else if (this.peek === $EOF) {
            this.error('Unterminated quote');
          } else {
            this.advance();
          }
        }
        var last = this.input.substring(marker, this.index);
        this.advance();
        var text = this.input.substring(start, this.index);
        var unescaped = last;
        if (buffer != null) {
          buffer.push(last);
          unescaped = buffer.join('');
        }
        return new Token(start, text).withValue(unescaped);
      };
      Scanner.prototype.advance = function advance() {
        if (++this.index >= this.length) {
          this.peek = $EOF;
        } else {
          this.peek = this.input.charCodeAt(this.index);
        }
      };
      Scanner.prototype.error = function error(message) {
        var offset = arguments[1] === undefined ? 0 : arguments[1];
        var position = this.index + offset;
        throw new Error('Lexer Error: ' + message + ' at column ' + position + ' in expression [' + this.input + ']');
      };
      return Scanner;
    })();
    exports.Scanner = Scanner;
    var OPERATORS = ['undefined', 'null', 'true', 'false', '+', '-', '*', '/', '%', '^', '=', '==', '===', '!=', '!==', '<', '>', '<=', '>=', '&&', '||', '&', '|', '!', '?'];
    var $EOF = 0;
    var $TAB = 9;
    var $LF = 10;
    var $VTAB = 11;
    var $FF = 12;
    var $CR = 13;
    var $SPACE = 32;
    var $BANG = 33;
    var $DQ = 34;
    var $$ = 36;
    var $PERCENT = 37;
    var $AMPERSAND = 38;
    var $SQ = 39;
    var $LPAREN = 40;
    var $RPAREN = 41;
    var $STAR = 42;
    var $PLUS = 43;
    var $COMMA = 44;
    var $MINUS = 45;
    var $PERIOD = 46;
    var $SLASH = 47;
    var $COLON = 58;
    var $SEMICOLON = 59;
    var $LT = 60;
    var $EQ = 61;
    var $GT = 62;
    var $QUESTION = 63;
    var $0 = 48;
    var $9 = 57;
    var $A = 65;
    var $E = 69;
    var $Z = 90;
    var $LBRACKET = 91;
    var $BACKSLASH = 92;
    var $RBRACKET = 93;
    var $CARET = 94;
    var $_ = 95;
    var $a = 97;
    var $e = 101;
    var $f = 102;
    var $n = 110;
    var $r = 114;
    var $t = 116;
    var $u = 117;
    var $v = 118;
    var $z = 122;
    var $LBRACE = 123;
    var $BAR = 124;
    var $RBRACE = 125;
    var $NBSP = 160;
    function isWhitespace(code) {
      return code >= $TAB && code <= $SPACE || code === $NBSP;
    }
    function isIdentifierStart(code) {
      return $a <= code && code <= $z || $A <= code && code <= $Z || code === $_ || code === $$;
    }
    function isIdentifierPart(code) {
      return $a <= code && code <= $z || $A <= code && code <= $Z || $0 <= code && code <= $9 || code === $_ || code === $$;
    }
    function isDigit(code) {
      return $0 <= code && code <= $9;
    }
    function isExponentStart(code) {
      return code === $e || code === $E;
    }
    function isExponentSign(code) {
      return code === $MINUS || code === $PLUS;
    }
    function unescape(code) {
      switch (code) {
        case $n:
          return $LF;
        case $f:
          return $FF;
        case $r:
          return $CR;
        case $t:
          return $TAB;
        case $v:
          return $VTAB;
        default:
          return code;
      }
    }
    function assert(condition, message) {
      if (!condition) {
        throw message || 'Assertion failed';
      }
    }
    var EOF = new Token(-1, null);
    var Parser = (function() {
      function Parser() {
        _classCallCheck(this, Parser);
        this.cache = {};
        this.lexer = new Lexer();
      }
      Parser.prototype.parse = function parse(input) {
        input = input || '';
        return this.cache[input] || (this.cache[input] = new ParserImplementation(this.lexer, input).parseChain());
      };
      return Parser;
    })();
    exports.Parser = Parser;
    var ParserImplementation = (function() {
      function ParserImplementation(lexer, input) {
        _classCallCheck(this, ParserImplementation);
        this.index = 0;
        this.input = input;
        this.tokens = lexer.lex(input);
      }
      ParserImplementation.prototype.parseChain = function parseChain() {
        var isChain = false,
            expressions = [];
        while (this.optional(';')) {
          isChain = true;
        }
        while (this.index < this.tokens.length) {
          if (this.peek.text === ')' || this.peek.text === '}' || this.peek.text === ']') {
            this.error('Unconsumed token ' + this.peek.text);
          }
          var expr = this.parseValueConverter();
          expressions.push(expr);
          while (this.optional(';')) {
            isChain = true;
          }
          if (isChain && expr instanceof ValueConverter) {
            this.error('cannot have a value converter in a chain');
          }
        }
        return expressions.length === 1 ? expressions[0] : new Chain(expressions);
      };
      ParserImplementation.prototype.parseValueConverter = function parseValueConverter() {
        var result = this.parseExpression();
        while (this.optional('|')) {
          var name = this.peek.text,
              args = [];
          this.advance();
          while (this.optional(':')) {
            args.push(this.parseExpression());
          }
          result = new ValueConverter(result, name, args, [result].concat(args));
        }
        return result;
      };
      ParserImplementation.prototype.parseExpression = function parseExpression() {
        var start = this.peek.index,
            result = this.parseConditional();
        while (this.peek.text === '=') {
          if (!result.isAssignable) {
            var end = this.index < this.tokens.length ? this.peek.index : this.input.length;
            var expression = this.input.substring(start, end);
            this.error('Expression ' + expression + ' is not assignable');
          }
          this.expect('=');
          result = new Assign(result, this.parseConditional());
        }
        return result;
      };
      ParserImplementation.prototype.parseConditional = function parseConditional() {
        var start = this.peek.index,
            result = this.parseLogicalOr();
        if (this.optional('?')) {
          var yes = this.parseExpression();
          if (!this.optional(':')) {
            var end = this.index < this.tokens.length ? this.peek.index : this.input.length;
            var expression = this.input.substring(start, end);
            this.error('Conditional expression ' + expression + ' requires all 3 expressions');
          }
          var no = this.parseExpression();
          result = new Conditional(result, yes, no);
        }
        return result;
      };
      ParserImplementation.prototype.parseLogicalOr = function parseLogicalOr() {
        var result = this.parseLogicalAnd();
        while (this.optional('||')) {
          result = new Binary('||', result, this.parseLogicalAnd());
        }
        return result;
      };
      ParserImplementation.prototype.parseLogicalAnd = function parseLogicalAnd() {
        var result = this.parseEquality();
        while (this.optional('&&')) {
          result = new Binary('&&', result, this.parseEquality());
        }
        return result;
      };
      ParserImplementation.prototype.parseEquality = function parseEquality() {
        var result = this.parseRelational();
        while (true) {
          if (this.optional('==')) {
            result = new Binary('==', result, this.parseRelational());
          } else if (this.optional('!=')) {
            result = new Binary('!=', result, this.parseRelational());
          } else if (this.optional('===')) {
            result = new Binary('===', result, this.parseRelational());
          } else if (this.optional('!==')) {
            result = new Binary('!==', result, this.parseRelational());
          } else {
            return result;
          }
        }
      };
      ParserImplementation.prototype.parseRelational = function parseRelational() {
        var result = this.parseAdditive();
        while (true) {
          if (this.optional('<')) {
            result = new Binary('<', result, this.parseAdditive());
          } else if (this.optional('>')) {
            result = new Binary('>', result, this.parseAdditive());
          } else if (this.optional('<=')) {
            result = new Binary('<=', result, this.parseAdditive());
          } else if (this.optional('>=')) {
            result = new Binary('>=', result, this.parseAdditive());
          } else {
            return result;
          }
        }
      };
      ParserImplementation.prototype.parseAdditive = function parseAdditive() {
        var result = this.parseMultiplicative();
        while (true) {
          if (this.optional('+')) {
            result = new Binary('+', result, this.parseMultiplicative());
          } else if (this.optional('-')) {
            result = new Binary('-', result, this.parseMultiplicative());
          } else {
            return result;
          }
        }
      };
      ParserImplementation.prototype.parseMultiplicative = function parseMultiplicative() {
        var result = this.parsePrefix();
        while (true) {
          if (this.optional('*')) {
            result = new Binary('*', result, this.parsePrefix());
          } else if (this.optional('%')) {
            result = new Binary('%', result, this.parsePrefix());
          } else if (this.optional('/')) {
            result = new Binary('/', result, this.parsePrefix());
          } else {
            return result;
          }
        }
      };
      ParserImplementation.prototype.parsePrefix = function parsePrefix() {
        if (this.optional('+')) {
          return this.parsePrefix();
        } else if (this.optional('-')) {
          return new Binary('-', new LiteralPrimitive(0), this.parsePrefix());
        } else if (this.optional('!')) {
          return new PrefixNot('!', this.parsePrefix());
        } else {
          return this.parseAccessOrCallMember();
        }
      };
      ParserImplementation.prototype.parseAccessOrCallMember = function parseAccessOrCallMember() {
        var result = this.parsePrimary();
        while (true) {
          if (this.optional('.')) {
            var name = this.peek.text;
            this.advance();
            if (this.optional('(')) {
              var args = this.parseExpressionList(')');
              this.expect(')');
              result = new CallMember(result, name, args);
            } else {
              result = new AccessMember(result, name);
            }
          } else if (this.optional('[')) {
            var key = this.parseExpression();
            this.expect(']');
            result = new AccessKeyed(result, key);
          } else if (this.optional('(')) {
            var args = this.parseExpressionList(')');
            this.expect(')');
            result = new CallFunction(result, args);
          } else {
            return result;
          }
        }
      };
      ParserImplementation.prototype.parsePrimary = function parsePrimary() {
        if (this.optional('(')) {
          var result = this.parseExpression();
          this.expect(')');
          return result;
        } else if (this.optional('null') || this.optional('undefined')) {
          return new LiteralPrimitive(null);
        } else if (this.optional('true')) {
          return new LiteralPrimitive(true);
        } else if (this.optional('false')) {
          return new LiteralPrimitive(false);
        } else if (this.optional('[')) {
          var elements = this.parseExpressionList(']');
          this.expect(']');
          return new LiteralArray(elements);
        } else if (this.peek.text == '{') {
          return this.parseObject();
        } else if (this.peek.key != null) {
          return this.parseAccessOrCallScope();
        } else if (this.peek.value != null) {
          var value = this.peek.value;
          this.advance();
          return isNaN(value) ? new LiteralString(value) : new LiteralPrimitive(value);
        } else if (this.index >= this.tokens.length) {
          throw new Error('Unexpected end of expression: ' + this.input);
        } else {
          this.error('Unexpected token ' + this.peek.text);
        }
      };
      ParserImplementation.prototype.parseAccessOrCallScope = function parseAccessOrCallScope() {
        var name = this.peek.key;
        this.advance();
        if (!this.optional('(')) {
          return new AccessScope(name);
        }
        var args = this.parseExpressionList(')');
        this.expect(')');
        return new CallScope(name, args);
      };
      ParserImplementation.prototype.parseObject = function parseObject() {
        var keys = [],
            values = [];
        this.expect('{');
        if (this.peek.text !== '}') {
          do {
            var value = this.peek.value;
            keys.push(typeof value === 'string' ? value : this.peek.text);
            this.advance();
            this.expect(':');
            values.push(this.parseExpression());
          } while (this.optional(','));
        }
        this.expect('}');
        return new LiteralObject(keys, values);
      };
      ParserImplementation.prototype.parseExpressionList = function parseExpressionList(terminator) {
        var result = [];
        if (this.peek.text != terminator) {
          do {
            result.push(this.parseExpression());
          } while (this.optional(','));
        }
        return result;
      };
      ParserImplementation.prototype.optional = function optional(text) {
        if (this.peek.text === text) {
          this.advance();
          return true;
        }
        return false;
      };
      ParserImplementation.prototype.expect = function expect(text) {
        if (this.peek.text === text) {
          this.advance();
        } else {
          this.error('Missing expected ' + text);
        }
      };
      ParserImplementation.prototype.advance = function advance() {
        this.index++;
      };
      ParserImplementation.prototype.error = function error(message) {
        var location = this.index < this.tokens.length ? 'at column ' + (this.tokens[this.index].index + 1) + ' in' : 'at the end of the expression';
        throw new Error('Parser Error: ' + message + ' ' + location + ' [' + this.input + ']');
      };
      _createClass(ParserImplementation, [{
        key: 'peek',
        get: function get() {
          return this.index < this.tokens.length ? this.tokens[this.index] : EOF;
        }
      }]);
      return ParserImplementation;
    })();
    exports.ParserImplementation = ParserImplementation;
    var mapProto = Map.prototype;
    function _getMapObserver(taskQueue, map) {
      return ModifyMapObserver.create(taskQueue, map);
    }
    var ModifyMapObserver = (function(_ModifyCollectionObserver2) {
      function ModifyMapObserver(taskQueue, map) {
        _classCallCheck(this, ModifyMapObserver);
        _ModifyCollectionObserver2.call(this, taskQueue, map);
      }
      _inherits(ModifyMapObserver, _ModifyCollectionObserver2);
      ModifyMapObserver.create = function create(taskQueue, map) {
        var observer = new ModifyMapObserver(taskQueue, map);
        map['set'] = function() {
          var oldValue = map.get(arguments[0]);
          var type = oldValue ? 'update' : 'add';
          var methodCallResult = mapProto['set'].apply(map, arguments);
          observer.addChangeRecord({
            type: type,
            object: map,
            key: arguments[0],
            oldValue: oldValue
          });
          return methodCallResult;
        };
        map['delete'] = function() {
          var oldValue = map.get(arguments[0]);
          var methodCallResult = mapProto['delete'].apply(map, arguments);
          observer.addChangeRecord({
            type: 'delete',
            object: map,
            key: arguments[0],
            oldValue: oldValue
          });
          return methodCallResult;
        };
        map['clear'] = function() {
          var methodCallResult = mapProto['clear'].apply(map, arguments);
          observer.addChangeRecord({
            type: 'clear',
            object: map
          });
          return methodCallResult;
        };
        return observer;
      };
      return ModifyMapObserver;
    })(ModifyCollectionObserver);
    function handleDelegatedEvent(event) {
      event = event || window.event;
      var target = event.target || event.srcElement,
          callback;
      while (target && !callback) {
        if (target.delegatedCallbacks) {
          callback = target.delegatedCallbacks[event.type];
        }
        if (!callback) {
          target = target.parentNode;
        }
      }
      if (callback) {
        event.stopPropagation();
        callback(event);
      }
    }
    var DelegateHandlerEntry = (function() {
      function DelegateHandlerEntry(boundary, eventName) {
        _classCallCheck(this, DelegateHandlerEntry);
        this.boundary = boundary;
        this.eventName = eventName;
        this.count = 0;
      }
      DelegateHandlerEntry.prototype.increment = function increment() {
        this.count++;
        if (this.count === 1) {
          this.boundary.addEventListener(this.eventName, handleDelegatedEvent, false);
        }
      };
      DelegateHandlerEntry.prototype.decrement = function decrement() {
        this.count--;
        if (this.count === 0) {
          this.boundary.removeEventListener(this.eventName, handleDelegatedEvent);
        }
      };
      return DelegateHandlerEntry;
    })();
    var DefaultEventStrategy = (function() {
      function DefaultEventStrategy() {
        _classCallCheck(this, DefaultEventStrategy);
      }
      DefaultEventStrategy.prototype.subscribe = function subscribe(target, targetEvent, callback, delegate) {
        if (delegate) {
          var _ret = (function() {
            var boundary = target.domBoundary || document,
                delegatedHandlers = boundary.delegatedHandlers || (boundary.delegatedHandlers = {}),
                handlerEntry = delegatedHandlers[targetEvent] || (delegatedHandlers[targetEvent] = new DelegateHandlerEntry(boundary, targetEvent)),
                delegatedCallbacks = target.delegatedCallbacks || (target.delegatedCallbacks = {});
            handlerEntry.increment();
            delegatedCallbacks[targetEvent] = callback;
            return {v: function() {
                handlerEntry.decrement();
                delegatedCallbacks[targetEvent] = null;
              }};
          })();
          if (typeof _ret === 'object')
            return _ret.v;
        } else {
          target.addEventListener(targetEvent, callback, false);
          return function() {
            target.removeEventListener(targetEvent, callback);
          };
        }
      };
      return DefaultEventStrategy;
    })();
    var EventManager = (function() {
      function EventManager() {
        _classCallCheck(this, EventManager);
        this.elementHandlerLookup = {};
        this.eventStrategyLookup = {};
        this.registerElementConfig({
          tagName: 'input',
          properties: {
            value: ['change', 'input'],
            checked: ['change', 'input'],
            files: ['change', 'input']
          }
        });
        this.registerElementConfig({
          tagName: 'textarea',
          properties: {value: ['change', 'input']}
        });
        this.registerElementConfig({
          tagName: 'select',
          properties: {value: ['change']}
        });
        this.registerElementConfig({
          tagName: 'content editable',
          properties: {value: ['change', 'input', 'blur', 'keyup', 'paste']}
        });
        this.registerElementConfig({
          tagName: 'scrollable element',
          properties: {
            scrollTop: ['scroll'],
            scrollLeft: ['scroll']
          }
        });
        this.defaultEventStrategy = new DefaultEventStrategy();
      }
      EventManager.prototype.registerElementConfig = function registerElementConfig(config) {
        var tagName = config.tagName.toLowerCase(),
            properties = config.properties,
            propertyName;
        this.elementHandlerLookup[tagName] = {};
        for (propertyName in properties) {
          if (properties.hasOwnProperty(propertyName)) {
            this.registerElementPropertyConfig(tagName, propertyName, properties[propertyName]);
          }
        }
      };
      EventManager.prototype.registerElementPropertyConfig = function registerElementPropertyConfig(tagName, propertyName, events) {
        this.elementHandlerLookup[tagName][propertyName] = {subscribe: function subscribe(target, callback) {
            events.forEach(function(changeEvent) {
              target.addEventListener(changeEvent, callback, false);
            });
            return function() {
              events.forEach(function(changeEvent) {
                target.removeEventListener(changeEvent, callback);
              });
            };
          }};
      };
      EventManager.prototype.registerElementHandler = function registerElementHandler(tagName, handler) {
        this.elementHandlerLookup[tagName.toLowerCase()] = handler;
      };
      EventManager.prototype.registerEventStrategy = function registerEventStrategy(eventName, strategy) {
        this.eventStrategyLookup[eventName] = strategy;
      };
      EventManager.prototype.getElementHandler = function getElementHandler(target, propertyName) {
        var tagName,
            lookup = this.elementHandlerLookup;
        if (target.tagName) {
          tagName = target.tagName.toLowerCase();
          if (lookup[tagName] && lookup[tagName][propertyName]) {
            return lookup[tagName][propertyName];
          }
          if (propertyName === 'textContent' || propertyName === 'innerHTML') {
            return lookup['content editable']['value'];
          }
          if (propertyName === 'scrollTop' || propertyName === 'scrollLeft') {
            return lookup['scrollable element'][propertyName];
          }
        }
        return null;
      };
      EventManager.prototype.addEventListener = function addEventListener(target, targetEvent, callback, delegate) {
        return (this.eventStrategyLookup[targetEvent] || this.defaultEventStrategy).subscribe(target, targetEvent, callback, delegate);
      };
      return EventManager;
    })();
    exports.EventManager = EventManager;
    var DirtyChecker = (function() {
      function DirtyChecker() {
        _classCallCheck(this, DirtyChecker);
        this.tracked = [];
        this.checkDelay = 120;
      }
      DirtyChecker.prototype.addProperty = function addProperty(property) {
        var tracked = this.tracked;
        tracked.push(property);
        if (tracked.length === 1) {
          this.scheduleDirtyCheck();
        }
      };
      DirtyChecker.prototype.removeProperty = function removeProperty(property) {
        var tracked = this.tracked;
        tracked.splice(tracked.indexOf(property), 1);
      };
      DirtyChecker.prototype.scheduleDirtyCheck = function scheduleDirtyCheck() {
        var _this18 = this;
        setTimeout(function() {
          return _this18.check();
        }, this.checkDelay);
      };
      DirtyChecker.prototype.check = function check() {
        var tracked = this.tracked,
            i = tracked.length;
        while (i--) {
          var current = tracked[i];
          if (current.isDirty()) {
            current.call();
          }
        }
        if (tracked.length) {
          this.scheduleDirtyCheck();
        }
      };
      return DirtyChecker;
    })();
    exports.DirtyChecker = DirtyChecker;
    var DirtyCheckProperty = (function() {
      function DirtyCheckProperty(dirtyChecker, obj, propertyName) {
        _classCallCheck(this, DirtyCheckProperty);
        this.dirtyChecker = dirtyChecker;
        this.obj = obj;
        this.propertyName = propertyName;
        this.callbacks = [];
        this.isSVG = obj instanceof SVGElement;
      }
      DirtyCheckProperty.prototype.getValue = function getValue() {
        return this.obj[this.propertyName];
      };
      DirtyCheckProperty.prototype.setValue = function setValue(newValue) {
        if (this.isSVG) {
          this.obj.setAttributeNS(null, this.propertyName, newValue);
        } else {
          this.obj[this.propertyName] = newValue;
        }
      };
      DirtyCheckProperty.prototype.call = function call() {
        var callbacks = this.callbacks,
            i = callbacks.length,
            oldValue = this.oldValue,
            newValue = this.getValue();
        while (i--) {
          callbacks[i](newValue, oldValue);
        }
        this.oldValue = newValue;
      };
      DirtyCheckProperty.prototype.isDirty = function isDirty() {
        return this.oldValue !== this.getValue();
      };
      DirtyCheckProperty.prototype.beginTracking = function beginTracking() {
        this.tracking = true;
        this.oldValue = this.newValue = this.getValue();
        this.dirtyChecker.addProperty(this);
      };
      DirtyCheckProperty.prototype.endTracking = function endTracking() {
        this.tracking = false;
        this.dirtyChecker.removeProperty(this);
      };
      DirtyCheckProperty.prototype.subscribe = function subscribe(callback) {
        var callbacks = this.callbacks,
            that = this;
        callbacks.push(callback);
        if (!this.tracking) {
          this.beginTracking();
        }
        return function() {
          callbacks.splice(callbacks.indexOf(callback), 1);
          if (callbacks.length === 0) {
            that.endTracking();
          }
        };
      };
      return DirtyCheckProperty;
    })();
    exports.DirtyCheckProperty = DirtyCheckProperty;
    var SetterObserver = (function() {
      function SetterObserver(taskQueue, obj, propertyName) {
        _classCallCheck(this, SetterObserver);
        this.taskQueue = taskQueue;
        this.obj = obj;
        this.propertyName = propertyName;
        this.callbacks = [];
        this.queued = false;
        this.observing = false;
      }
      SetterObserver.prototype.getValue = function getValue() {
        return this.obj[this.propertyName];
      };
      SetterObserver.prototype.setValue = function setValue(newValue) {
        this.obj[this.propertyName] = newValue;
      };
      SetterObserver.prototype.getterValue = function getterValue() {
        return this.currentValue;
      };
      SetterObserver.prototype.setterValue = function setterValue(newValue) {
        var oldValue = this.currentValue;
        if (oldValue !== newValue) {
          if (!this.queued) {
            this.oldValue = oldValue;
            this.queued = true;
            this.taskQueue.queueMicroTask(this);
          }
          this.currentValue = newValue;
        }
      };
      SetterObserver.prototype.call = function call() {
        var callbacks = this.callbacks,
            i = callbacks.length,
            oldValue = this.oldValue,
            newValue = this.currentValue;
        this.queued = false;
        while (i--) {
          callbacks[i](newValue, oldValue);
        }
      };
      SetterObserver.prototype.subscribe = function subscribe(callback) {
        var callbacks = this.callbacks;
        callbacks.push(callback);
        if (!this.observing) {
          this.convertProperty();
        }
        return function() {
          callbacks.splice(callbacks.indexOf(callback), 1);
        };
      };
      SetterObserver.prototype.convertProperty = function convertProperty() {
        this.observing = true;
        this.currentValue = this.obj[this.propertyName];
        this.setValue = this.setterValue;
        this.getValue = this.getterValue;
        try {
          Object.defineProperty(this.obj, this.propertyName, {
            configurable: true,
            enumerable: true,
            get: this.getValue.bind(this),
            set: this.setValue.bind(this)
          });
        } catch (_) {}
      };
      return SetterObserver;
    })();
    exports.SetterObserver = SetterObserver;
    var OoPropertyObserver = (function() {
      function OoPropertyObserver(obj, propertyName, subscribe) {
        _classCallCheck(this, OoPropertyObserver);
        this.obj = obj;
        this.propertyName = propertyName;
        this.subscribe = subscribe;
      }
      OoPropertyObserver.prototype.getValue = function getValue() {
        return this.obj[this.propertyName];
      };
      OoPropertyObserver.prototype.setValue = function setValue(newValue) {
        this.obj[this.propertyName] = newValue;
      };
      return OoPropertyObserver;
    })();
    exports.OoPropertyObserver = OoPropertyObserver;
    var OoObjectObserver = (function() {
      function OoObjectObserver(obj, observerLocator) {
        _classCallCheck(this, OoObjectObserver);
        this.obj = obj;
        this.observerLocator = observerLocator;
        this.observers = {};
        this.callbacks = {};
        this.callbackCount = 0;
      }
      OoObjectObserver.prototype.subscribe = function subscribe(propertyName, callback) {
        if (this.callbacks[propertyName]) {
          this.callbacks[propertyName].push(callback);
        } else {
          this.callbacks[propertyName] = [callback];
          this.callbacks[propertyName].oldValue = this.obj[propertyName];
        }
        if (this.callbackCount === 0) {
          this.handler = this.handleChanges.bind(this);
          try {
            Object.observe(this.obj, this.handler, ['update', 'add']);
          } catch (_) {}
        }
        this.callbackCount++;
        return this.unsubscribe.bind(this, propertyName, callback);
      };
      OoObjectObserver.prototype.unsubscribe = function unsubscribe(propertyName, callback) {
        var callbacks = this.callbacks[propertyName],
            index = callbacks.indexOf(callback);
        if (index === -1) {
          return ;
        }
        callbacks.splice(index, 1);
        if (callbacks.count = 0) {
          callbacks.oldValue = null;
          this.callbacks[propertyName] = null;
        }
        this.callbackCount--;
        if (this.callbackCount === 0) {
          try {
            Object.unobserve(this.obj, this.handler);
          } catch (_) {}
        }
      };
      OoObjectObserver.prototype.getObserver = function getObserver(propertyName, descriptor) {
        var propertyObserver = this.observers[propertyName];
        if (!propertyObserver) {
          if (descriptor) {
            propertyObserver = this.observers[propertyName] = new OoPropertyObserver(this.obj, propertyName, this.subscribe.bind(this, propertyName));
          } else {
            propertyObserver = this.observers[propertyName] = new UndefinedPropertyObserver(this, this.obj, propertyName);
          }
        }
        return propertyObserver;
      };
      OoObjectObserver.prototype.handleChanges = function handleChanges(changes) {
        var properties = {},
            i,
            ii,
            change,
            propertyName,
            oldValue,
            newValue,
            callbacks;
        for (i = 0, ii = changes.length; i < ii; i++) {
          change = changes[i];
          properties[change.name] = change;
        }
        for (name in properties) {
          callbacks = this.callbacks[name];
          if (!callbacks) {
            continue;
          }
          change = properties[name];
          newValue = change.object[name];
          oldValue = change.oldValue;
          for (i = 0, ii = callbacks.length; i < ii; i++) {
            callbacks[i](newValue, oldValue);
          }
        }
      };
      return OoObjectObserver;
    })();
    exports.OoObjectObserver = OoObjectObserver;
    var UndefinedPropertyObserver = (function() {
      function UndefinedPropertyObserver(owner, obj, propertyName) {
        _classCallCheck(this, UndefinedPropertyObserver);
        this.owner = owner;
        this.obj = obj;
        this.propertyName = propertyName;
        this.callbackMap = new Map();
      }
      UndefinedPropertyObserver.prototype.getValue = function getValue() {
        if (this.actual) {
          return this.actual.getValue();
        }
        return this.obj[this.propertyName];
      };
      UndefinedPropertyObserver.prototype.setValue = function setValue(newValue) {
        if (this.actual) {
          this.actual.setValue(newValue);
          return ;
        }
        this.obj[this.propertyName] = newValue;
        this.trigger(newValue, undefined);
      };
      UndefinedPropertyObserver.prototype.trigger = function trigger(newValue, oldValue) {
        var callback;
        if (this.subscription) {
          this.subscription();
        }
        this.getObserver();
        for (var _iterator2 = this.callbackMap.keys(),
            _isArray2 = Array.isArray(_iterator2),
            _i2 = 0,
            _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator](); ; ) {
          if (_isArray2) {
            if (_i2 >= _iterator2.length)
              break;
            callback = _iterator2[_i2++];
          } else {
            _i2 = _iterator2.next();
            if (_i2.done)
              break;
            callback = _i2.value;
          }
          callback(newValue, oldValue);
        }
      };
      UndefinedPropertyObserver.prototype.getObserver = function getObserver() {
        var callback,
            observerLocator;
        if (!Object.getOwnPropertyDescriptor(this.obj, this.propertyName)) {
          return ;
        }
        observerLocator = this.owner.observerLocator;
        delete this.owner.observers[this.propertyName];
        delete observerLocator.getOrCreateObserversLookup(this.obj, observerLocator)[this.propertyName];
        this.actual = observerLocator.getObserver(this.obj, this.propertyName);
        for (var _iterator3 = this.callbackMap.keys(),
            _isArray3 = Array.isArray(_iterator3),
            _i3 = 0,
            _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator](); ; ) {
          if (_isArray3) {
            if (_i3 >= _iterator3.length)
              break;
            callback = _iterator3[_i3++];
          } else {
            _i3 = _iterator3.next();
            if (_i3.done)
              break;
            callback = _i3.value;
          }
          this.callbackMap.set(callback, this.actual.subscribe(callback));
        }
      };
      UndefinedPropertyObserver.prototype.subscribe = function subscribe(callback) {
        var _this19 = this;
        if (!this.actual) {
          this.getObserver();
        }
        if (this.actual) {
          return this.actual.subscribe(callback);
        }
        if (!this.subscription) {
          this.subscription = this.owner.subscribe(this.propertyName, this.trigger.bind(this));
        }
        this.callbackMap.set(callback, null);
        return function() {
          var actualDispose = _this19.callbackMap.get(callback);
          if (actualDispose)
            actualDispose();
          _this19.callbackMap['delete'](callback);
        };
      };
      return UndefinedPropertyObserver;
    })();
    exports.UndefinedPropertyObserver = UndefinedPropertyObserver;
    var XLinkAttributeObserver = (function() {
      function XLinkAttributeObserver(element, propertyName, attributeName) {
        _classCallCheck(this, XLinkAttributeObserver);
        this.element = element;
        this.propertyName = propertyName;
        this.attributeName = attributeName;
      }
      XLinkAttributeObserver.prototype.getValue = function getValue() {
        return this.element.getAttributeNS('http://www.w3.org/1999/xlink', this.attributeName);
      };
      XLinkAttributeObserver.prototype.setValue = function setValue(newValue) {
        return this.element.setAttributeNS('http://www.w3.org/1999/xlink', this.attributeName, newValue);
      };
      XLinkAttributeObserver.prototype.subscribe = function subscribe(callback) {
        throw new Error('Observation of a "' + this.element.nodeName + '" element\'s "' + this.propertyName + '" property is not supported.');
      };
      return XLinkAttributeObserver;
    })();
    exports.XLinkAttributeObserver = XLinkAttributeObserver;
    var DataAttributeObserver = (function() {
      function DataAttributeObserver(element, propertyName) {
        _classCallCheck(this, DataAttributeObserver);
        this.element = element;
        this.propertyName = propertyName;
      }
      DataAttributeObserver.prototype.getValue = function getValue() {
        return this.element.getAttribute(this.propertyName);
      };
      DataAttributeObserver.prototype.setValue = function setValue(newValue) {
        return this.element.setAttribute(this.propertyName, newValue);
      };
      DataAttributeObserver.prototype.subscribe = function subscribe(callback) {
        throw new Error('Observation of a "' + this.element.nodeName + '" element\'s "' + this.propertyName + '" property is not supported.');
      };
      return DataAttributeObserver;
    })();
    exports.DataAttributeObserver = DataAttributeObserver;
    var StyleObserver = (function() {
      function StyleObserver(element, propertyName) {
        _classCallCheck(this, StyleObserver);
        this.element = element;
        this.propertyName = propertyName;
      }
      StyleObserver.prototype.getValue = function getValue() {
        return this.element.style.cssText;
      };
      StyleObserver.prototype.setValue = function setValue(newValue) {
        if (newValue instanceof Object) {
          newValue = this.flattenCss(newValue);
        }
        this.element.style.cssText = newValue;
      };
      StyleObserver.prototype.subscribe = function subscribe(callback) {
        throw new Error('Observation of a "' + this.element.nodeName + '" element\'s "' + this.propertyName + '" property is not supported.');
      };
      StyleObserver.prototype.flattenCss = function flattenCss(object) {
        var s = '';
        for (var propertyName in object) {
          if (object.hasOwnProperty(propertyName)) {
            s += propertyName + ': ' + object[propertyName] + '; ';
          }
        }
        return s;
      };
      return StyleObserver;
    })();
    exports.StyleObserver = StyleObserver;
    var ValueAttributeObserver = (function() {
      function ValueAttributeObserver(element, propertyName, handler) {
        _classCallCheck(this, ValueAttributeObserver);
        this.element = element;
        this.propertyName = propertyName;
        this.handler = handler;
        this.callbacks = [];
      }
      ValueAttributeObserver.prototype.getValue = function getValue() {
        return this.element[this.propertyName];
      };
      ValueAttributeObserver.prototype.setValue = function setValue(newValue) {
        this.element[this.propertyName] = newValue;
        this.call();
      };
      ValueAttributeObserver.prototype.call = function call() {
        var callbacks = this.callbacks,
            i = callbacks.length,
            oldValue = this.oldValue,
            newValue = this.getValue();
        while (i--) {
          callbacks[i](newValue, oldValue);
        }
        this.oldValue = newValue;
      };
      ValueAttributeObserver.prototype.subscribe = function subscribe(callback) {
        var that = this;
        if (!this.disposeHandler) {
          this.oldValue = this.getValue();
          this.disposeHandler = this.handler.subscribe(this.element, this.call.bind(this));
        }
        this.callbacks.push(callback);
        return this.unsubscribe.bind(this, callback);
      };
      ValueAttributeObserver.prototype.unsubscribe = function unsubscribe(callback) {
        var callbacks = this.callbacks;
        callbacks.splice(callbacks.indexOf(callback), 1);
        if (callbacks.length === 0) {
          this.disposeHandler();
          this.disposeHandler = null;
        }
      };
      return ValueAttributeObserver;
    })();
    exports.ValueAttributeObserver = ValueAttributeObserver;
    var SelectValueObserver = (function() {
      function SelectValueObserver(element, handler, observerLocator) {
        _classCallCheck(this, SelectValueObserver);
        this.element = element;
        this.handler = handler;
        this.observerLocator = observerLocator;
      }
      SelectValueObserver.prototype.getValue = function getValue() {
        return this.value;
      };
      SelectValueObserver.prototype.setValue = function setValue(newValue) {
        var _this20 = this;
        if (newValue !== null && newValue !== undefined && this.element.multiple && !Array.isArray(newValue)) {
          throw new Error('Only null or Array instances can be bound to a multi-select.');
        }
        if (this.value === newValue) {
          return ;
        }
        if (this.arraySubscription) {
          this.arraySubscription();
          this.arraySubscription = null;
        }
        if (Array.isArray(newValue)) {
          this.arraySubscription = this.observerLocator.getArrayObserver(newValue).subscribe(this.synchronizeOptions.bind(this));
        }
        this.value = newValue;
        this.synchronizeOptions();
        if (this.element.options.length > 0 && !this.initialSync) {
          this.initialSync = true;
          this.observerLocator.taskQueue.queueMicroTask({call: function call() {
              return _this20.synchronizeOptions();
            }});
        }
      };
      SelectValueObserver.prototype.synchronizeOptions = function synchronizeOptions() {
        var value = this.value,
            i,
            options,
            option,
            optionValue,
            clear,
            isArray;
        if (value === null || value === undefined) {
          clear = true;
        } else if (Array.isArray(value)) {
          isArray = true;
        }
        options = this.element.options;
        i = options.length;
        while (i--) {
          option = options.item(i);
          if (clear) {
            option.selected = false;
            continue;
          }
          optionValue = option.hasOwnProperty('model') ? option.model : option.value;
          if (isArray) {
            option.selected = value.indexOf(optionValue) !== -1;
            continue;
          }
          option.selected = value === optionValue;
        }
      };
      SelectValueObserver.prototype.synchronizeValue = function synchronizeValue() {
        var options = this.element.options,
            option,
            i,
            ii,
            count = 0,
            value = [];
        for (i = 0, ii = options.length; i < ii; i++) {
          option = options.item(i);
          if (!option.selected) {
            continue;
          }
          value[count] = option.hasOwnProperty('model') ? option.model : option.value;
          count++;
        }
        if (!this.element.multiple) {
          if (count === 0) {
            value = null;
          } else {
            value = value[0];
          }
        }
        this.oldValue = this.value;
        this.value = value;
        this.call();
      };
      SelectValueObserver.prototype.call = function call() {
        var callbacks = this.callbacks,
            i = callbacks.length,
            oldValue = this.oldValue,
            newValue = this.value;
        while (i--) {
          callbacks[i](newValue, oldValue);
        }
      };
      SelectValueObserver.prototype.subscribe = function subscribe(callback) {
        if (!this.callbacks) {
          this.callbacks = [];
          this.disposeHandler = this.handler.subscribe(this.element, this.synchronizeValue.bind(this, false));
        }
        this.callbacks.push(callback);
        return this.unsubscribe.bind(this, callback);
      };
      SelectValueObserver.prototype.unsubscribe = function unsubscribe(callback) {
        var callbacks = this.callbacks;
        callbacks.splice(callbacks.indexOf(callback), 1);
        if (callbacks.length === 0) {
          this.disposeHandler();
          this.disposeHandler = null;
          this.callbacks = null;
        }
      };
      SelectValueObserver.prototype.bind = function bind() {
        var _this21 = this;
        this.domObserver = new MutationObserver(function() {
          _this21.synchronizeOptions();
          _this21.synchronizeValue();
        });
        this.domObserver.observe(this.element, {
          childList: true,
          subtree: true
        });
      };
      SelectValueObserver.prototype.unbind = function unbind() {
        this.domObserver.disconnect();
        this.domObserver = null;
        if (this.arraySubscription) {
          this.arraySubscription();
          this.arraySubscription = null;
        }
      };
      return SelectValueObserver;
    })();
    exports.SelectValueObserver = SelectValueObserver;
    var CheckedObserver = (function() {
      function CheckedObserver(element, handler, observerLocator) {
        _classCallCheck(this, CheckedObserver);
        this.element = element;
        this.handler = handler;
        this.observerLocator = observerLocator;
      }
      CheckedObserver.prototype.getValue = function getValue() {
        return this.value;
      };
      CheckedObserver.prototype.setValue = function setValue(newValue) {
        var _this22 = this;
        if (this.value === newValue) {
          return ;
        }
        if (this.arraySubscription) {
          this.arraySubscription();
          this.arraySubscription = null;
        }
        if (this.element.type === 'checkbox' && Array.isArray(newValue)) {
          this.arraySubscription = this.observerLocator.getArrayObserver(newValue).subscribe(this.synchronizeElement.bind(this));
        }
        this.value = newValue;
        this.synchronizeElement();
        if (!this.element.hasOwnProperty('model') && !this.initialSync) {
          this.initialSync = true;
          this.observerLocator.taskQueue.queueMicroTask({call: function call() {
              return _this22.synchronizeElement();
            }});
        }
      };
      CheckedObserver.prototype.synchronizeElement = function synchronizeElement() {
        var value = this.value,
            element = this.element,
            elementValue = element.hasOwnProperty('model') ? element.model : element.value,
            isRadio = element.type === 'radio';
        element.checked = isRadio && value === elementValue || !isRadio && value === true || !isRadio && Array.isArray(value) && value.indexOf(elementValue) !== -1;
      };
      CheckedObserver.prototype.synchronizeValue = function synchronizeValue() {
        var value = this.value,
            element = this.element,
            elementValue = element.hasOwnProperty('model') ? element.model : element.value,
            index;
        if (element.type === 'checkbox') {
          if (Array.isArray(value)) {
            index = value.indexOf(elementValue);
            if (element.checked && index === -1) {
              value.push(elementValue);
            } else if (!element.checked && index !== -1) {
              value.splice(index, 1);
            }
            return ;
          } else {
            value = element.checked;
          }
        } else if (element.checked) {
          value = elementValue;
        } else {
          return ;
        }
        this.oldValue = this.value;
        this.value = value;
        this.call();
      };
      CheckedObserver.prototype.call = function call() {
        var callbacks = this.callbacks,
            i = callbacks.length,
            oldValue = this.oldValue,
            newValue = this.value;
        while (i--) {
          callbacks[i](newValue, oldValue);
        }
      };
      CheckedObserver.prototype.subscribe = function subscribe(callback) {
        if (!this.callbacks) {
          this.callbacks = [];
          this.disposeHandler = this.handler.subscribe(this.element, this.synchronizeValue.bind(this, false));
        }
        this.callbacks.push(callback);
        return this.unsubscribe.bind(this, callback);
      };
      CheckedObserver.prototype.unsubscribe = function unsubscribe(callback) {
        var callbacks = this.callbacks;
        callbacks.splice(callbacks.indexOf(callback), 1);
        if (callbacks.length === 0) {
          this.disposeHandler();
          this.disposeHandler = null;
          this.callbacks = null;
        }
      };
      CheckedObserver.prototype.unbind = function unbind() {
        if (this.arraySubscription) {
          this.arraySubscription();
          this.arraySubscription = null;
        }
      };
      return CheckedObserver;
    })();
    exports.CheckedObserver = CheckedObserver;
    var ClassObserver = (function() {
      function ClassObserver(element) {
        _classCallCheck(this, ClassObserver);
        this.element = element;
        this.doNotCache = true;
        this.value = '';
        this.version = 0;
      }
      ClassObserver.prototype.getValue = function getValue() {
        return this.value;
      };
      ClassObserver.prototype.setValue = function setValue(newValue) {
        var nameIndex = this.nameIndex || {},
            version = this.version,
            names,
            name,
            i;
        if (newValue !== null && newValue !== undefined && newValue.length) {
          names = newValue.split(' ');
          i = names.length;
          while (i--) {
            name = names[i];
            if (name === '') {
              continue;
            }
            nameIndex[name] = version;
            this.element.classList.add(name);
          }
        }
        this.value = newValue;
        this.nameIndex = nameIndex;
        this.version += 1;
        if (version === 0) {
          return ;
        }
        version -= 1;
        for (name in nameIndex) {
          if (!nameIndex.hasOwnProperty(name) || nameIndex[name] !== version) {
            continue;
          }
          this.element.classList.remove(name);
        }
      };
      ClassObserver.prototype.subscribe = function subscribe(callback) {
        throw new Error('Observation of a "' + this.element.nodeName + '" element\'s "class" property is not supported.');
      };
      return ClassObserver;
    })();
    exports.ClassObserver = ClassObserver;
    var ComputedPropertyObserver = (function() {
      function ComputedPropertyObserver(obj, propertyName, descriptor, observerLocator) {
        _classCallCheck(this, ComputedPropertyObserver);
        this.obj = obj;
        this.propertyName = propertyName;
        this.descriptor = descriptor;
        this.observerLocator = observerLocator;
        this.callbacks = [];
      }
      ComputedPropertyObserver.prototype.getValue = function getValue() {
        return this.obj[this.propertyName];
      };
      ComputedPropertyObserver.prototype.setValue = function setValue(newValue) {
        this.obj[this.propertyName] = newValue;
      };
      ComputedPropertyObserver.prototype.trigger = function trigger(newValue, oldValue) {
        var callbacks = this.callbacks,
            i = callbacks.length;
        while (i--) {
          callbacks[i](newValue, oldValue);
        }
      };
      ComputedPropertyObserver.prototype.evaluate = function evaluate() {
        var newValue = this.getValue();
        if (this.oldValue === newValue)
          return ;
        this.trigger(newValue, this.oldValue);
        this.oldValue = newValue;
      };
      ComputedPropertyObserver.prototype.subscribe = function subscribe(callback) {
        var _this23 = this;
        var dependencies,
            i,
            ii;
        this.callbacks.push(callback);
        if (this.oldValue === undefined) {
          this.oldValue = this.getValue();
          this.subscriptions = [];
          dependencies = this.descriptor.get.dependencies;
          for (i = 0, ii = dependencies.length; i < ii; i++) {
            this.subscriptions.push(this.observerLocator.getObserver(this.obj, dependencies[i]).subscribe(function() {
              return _this23.evaluate();
            }));
          }
        }
        return function() {
          _this23.callbacks.splice(_this23.callbacks.indexOf(callback), 1);
          if (_this23.callbacks.length > 0)
            return ;
          while (_this23.subscriptions.length) {
            _this23.subscriptions.pop()();
          }
          _this23.oldValue = undefined;
        };
      };
      return ComputedPropertyObserver;
    })();
    exports.ComputedPropertyObserver = ComputedPropertyObserver;
    function hasDeclaredDependencies(descriptor) {
      return descriptor && descriptor.get && descriptor.get.dependencies && descriptor.get.dependencies.length > 0;
    }
    function declarePropertyDependencies(ctor, propertyName, dependencies) {
      var descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, propertyName);
      descriptor.get.dependencies = dependencies;
    }
    var elements = {
      a: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'target', 'transform', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      altGlyph: ['class', 'dx', 'dy', 'externalResourcesRequired', 'format', 'glyphRef', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rotate', 'style', 'systemLanguage', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      altGlyphDef: ['id', 'xml:base', 'xml:lang', 'xml:space'],
      altGlyphItem: ['id', 'xml:base', 'xml:lang', 'xml:space'],
      animate: ['accumulate', 'additive', 'attributeName', 'attributeType', 'begin', 'by', 'calcMode', 'dur', 'end', 'externalResourcesRequired', 'fill', 'from', 'id', 'keySplines', 'keyTimes', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'systemLanguage', 'to', 'values', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      animateColor: ['accumulate', 'additive', 'attributeName', 'attributeType', 'begin', 'by', 'calcMode', 'dur', 'end', 'externalResourcesRequired', 'fill', 'from', 'id', 'keySplines', 'keyTimes', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'systemLanguage', 'to', 'values', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      animateMotion: ['accumulate', 'additive', 'begin', 'by', 'calcMode', 'dur', 'end', 'externalResourcesRequired', 'fill', 'from', 'id', 'keyPoints', 'keySplines', 'keyTimes', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'origin', 'path', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'rotate', 'systemLanguage', 'to', 'values', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      animateTransform: ['accumulate', 'additive', 'attributeName', 'attributeType', 'begin', 'by', 'calcMode', 'dur', 'end', 'externalResourcesRequired', 'fill', 'from', 'id', 'keySplines', 'keyTimes', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'systemLanguage', 'to', 'type', 'values', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      circle: ['class', 'cx', 'cy', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'r', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
      clipPath: ['class', 'clipPathUnits', 'externalResourcesRequired', 'id', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
      'color-profile': ['id', 'local', 'name', 'rendering-intent', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      cursor: ['externalResourcesRequired', 'id', 'requiredExtensions', 'requiredFeatures', 'systemLanguage', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      defs: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
      desc: ['class', 'id', 'style', 'xml:base', 'xml:lang', 'xml:space'],
      ellipse: ['class', 'cx', 'cy', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rx', 'ry', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
      feBlend: ['class', 'height', 'id', 'in', 'in2', 'mode', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feColorMatrix: ['class', 'height', 'id', 'in', 'result', 'style', 'type', 'values', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feComponentTransfer: ['class', 'height', 'id', 'in', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feComposite: ['class', 'height', 'id', 'in', 'in2', 'k1', 'k2', 'k3', 'k4', 'operator', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feConvolveMatrix: ['bias', 'class', 'divisor', 'edgeMode', 'height', 'id', 'in', 'kernelMatrix', 'kernelUnitLength', 'order', 'preserveAlpha', 'result', 'style', 'targetX', 'targetY', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feDiffuseLighting: ['class', 'diffuseConstant', 'height', 'id', 'in', 'kernelUnitLength', 'result', 'style', 'surfaceScale', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feDisplacementMap: ['class', 'height', 'id', 'in', 'in2', 'result', 'scale', 'style', 'width', 'x', 'xChannelSelector', 'xml:base', 'xml:lang', 'xml:space', 'y', 'yChannelSelector'],
      feDistantLight: ['azimuth', 'elevation', 'id', 'xml:base', 'xml:lang', 'xml:space'],
      feFlood: ['class', 'height', 'id', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feFuncA: ['amplitude', 'exponent', 'id', 'intercept', 'offset', 'slope', 'tableValues', 'type', 'xml:base', 'xml:lang', 'xml:space'],
      feFuncB: ['amplitude', 'exponent', 'id', 'intercept', 'offset', 'slope', 'tableValues', 'type', 'xml:base', 'xml:lang', 'xml:space'],
      feFuncG: ['amplitude', 'exponent', 'id', 'intercept', 'offset', 'slope', 'tableValues', 'type', 'xml:base', 'xml:lang', 'xml:space'],
      feFuncR: ['amplitude', 'exponent', 'id', 'intercept', 'offset', 'slope', 'tableValues', 'type', 'xml:base', 'xml:lang', 'xml:space'],
      feGaussianBlur: ['class', 'height', 'id', 'in', 'result', 'stdDeviation', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feImage: ['class', 'externalResourcesRequired', 'height', 'id', 'preserveAspectRatio', 'result', 'style', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feMerge: ['class', 'height', 'id', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feMergeNode: ['id', 'xml:base', 'xml:lang', 'xml:space'],
      feMorphology: ['class', 'height', 'id', 'in', 'operator', 'radius', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feOffset: ['class', 'dx', 'dy', 'height', 'id', 'in', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      fePointLight: ['id', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y', 'z'],
      feSpecularLighting: ['class', 'height', 'id', 'in', 'kernelUnitLength', 'result', 'specularConstant', 'specularExponent', 'style', 'surfaceScale', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feSpotLight: ['id', 'limitingConeAngle', 'pointsAtX', 'pointsAtY', 'pointsAtZ', 'specularExponent', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y', 'z'],
      feTile: ['class', 'height', 'id', 'in', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feTurbulence: ['baseFrequency', 'class', 'height', 'id', 'numOctaves', 'result', 'seed', 'stitchTiles', 'style', 'type', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      filter: ['class', 'externalResourcesRequired', 'filterRes', 'filterUnits', 'height', 'id', 'primitiveUnits', 'style', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      font: ['class', 'externalResourcesRequired', 'horiz-adv-x', 'horiz-origin-x', 'horiz-origin-y', 'id', 'style', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'xml:base', 'xml:lang', 'xml:space'],
      'font-face': ['accent-height', 'alphabetic', 'ascent', 'bbox', 'cap-height', 'descent', 'font-family', 'font-size', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'hanging', 'id', 'ideographic', 'mathematical', 'overline-position', 'overline-thickness', 'panose-1', 'slope', 'stemh', 'stemv', 'strikethrough-position', 'strikethrough-thickness', 'underline-position', 'underline-thickness', 'unicode-range', 'units-per-em', 'v-alphabetic', 'v-hanging', 'v-ideographic', 'v-mathematical', 'widths', 'x-height', 'xml:base', 'xml:lang', 'xml:space'],
      'font-face-format': ['id', 'string', 'xml:base', 'xml:lang', 'xml:space'],
      'font-face-name': ['id', 'name', 'xml:base', 'xml:lang', 'xml:space'],
      'font-face-src': ['id', 'xml:base', 'xml:lang', 'xml:space'],
      'font-face-uri': ['id', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      foreignObject: ['class', 'externalResourcesRequired', 'height', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      g: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
      glyph: ['arabic-form', 'class', 'd', 'glyph-name', 'horiz-adv-x', 'id', 'lang', 'orientation', 'style', 'unicode', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'xml:base', 'xml:lang', 'xml:space'],
      glyphRef: ['class', 'dx', 'dy', 'format', 'glyphRef', 'id', 'style', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      hkern: ['g1', 'g2', 'id', 'k', 'u1', 'u2', 'xml:base', 'xml:lang', 'xml:space'],
      image: ['class', 'externalResourcesRequired', 'height', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'preserveAspectRatio', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      line: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'x1', 'x2', 'xml:base', 'xml:lang', 'xml:space', 'y1', 'y2'],
      linearGradient: ['class', 'externalResourcesRequired', 'gradientTransform', 'gradientUnits', 'id', 'spreadMethod', 'style', 'x1', 'x2', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y1', 'y2'],
      marker: ['class', 'externalResourcesRequired', 'id', 'markerHeight', 'markerUnits', 'markerWidth', 'orient', 'preserveAspectRatio', 'refX', 'refY', 'style', 'viewBox', 'xml:base', 'xml:lang', 'xml:space'],
      mask: ['class', 'externalResourcesRequired', 'height', 'id', 'maskContentUnits', 'maskUnits', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      metadata: ['id', 'xml:base', 'xml:lang', 'xml:space'],
      'missing-glyph': ['class', 'd', 'horiz-adv-x', 'id', 'style', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'xml:base', 'xml:lang', 'xml:space'],
      mpath: ['externalResourcesRequired', 'id', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      path: ['class', 'd', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'pathLength', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
      pattern: ['class', 'externalResourcesRequired', 'height', 'id', 'patternContentUnits', 'patternTransform', 'patternUnits', 'preserveAspectRatio', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'viewBox', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      polygon: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'points', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
      polyline: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'points', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
      radialGradient: ['class', 'cx', 'cy', 'externalResourcesRequired', 'fx', 'fy', 'gradientTransform', 'gradientUnits', 'id', 'r', 'spreadMethod', 'style', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      rect: ['class', 'externalResourcesRequired', 'height', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rx', 'ry', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      script: ['externalResourcesRequired', 'id', 'type', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      set: ['attributeName', 'attributeType', 'begin', 'dur', 'end', 'externalResourcesRequired', 'fill', 'id', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'systemLanguage', 'to', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      stop: ['class', 'id', 'offset', 'style', 'xml:base', 'xml:lang', 'xml:space'],
      style: ['id', 'media', 'title', 'type', 'xml:base', 'xml:lang', 'xml:space'],
      svg: ['baseProfile', 'class', 'contentScriptType', 'contentStyleType', 'externalResourcesRequired', 'height', 'id', 'onabort', 'onactivate', 'onclick', 'onerror', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onresize', 'onscroll', 'onunload', 'onzoom', 'preserveAspectRatio', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'version', 'viewBox', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y', 'zoomAndPan'],
      'switch': ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
      symbol: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'preserveAspectRatio', 'style', 'viewBox', 'xml:base', 'xml:lang', 'xml:space'],
      text: ['class', 'dx', 'dy', 'externalResourcesRequired', 'id', 'lengthAdjust', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rotate', 'style', 'systemLanguage', 'textLength', 'transform', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      textPath: ['class', 'externalResourcesRequired', 'id', 'lengthAdjust', 'method', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'spacing', 'startOffset', 'style', 'systemLanguage', 'textLength', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      title: ['class', 'id', 'style', 'xml:base', 'xml:lang', 'xml:space'],
      tref: ['class', 'dx', 'dy', 'externalResourcesRequired', 'id', 'lengthAdjust', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rotate', 'style', 'systemLanguage', 'textLength', 'x', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      tspan: ['class', 'dx', 'dy', 'externalResourcesRequired', 'id', 'lengthAdjust', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rotate', 'style', 'systemLanguage', 'textLength', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      use: ['class', 'externalResourcesRequired', 'height', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      view: ['externalResourcesRequired', 'id', 'preserveAspectRatio', 'viewBox', 'viewTarget', 'xml:base', 'xml:lang', 'xml:space', 'zoomAndPan'],
      vkern: ['g1', 'g2', 'id', 'k', 'u1', 'u2', 'xml:base', 'xml:lang', 'xml:space']
    };
    exports.elements = elements;
    var presentationElements = {
      'a': true,
      'altGlyph': true,
      'animate': true,
      'animateColor': true,
      'circle': true,
      'clipPath': true,
      'defs': true,
      'ellipse': true,
      'feBlend': true,
      'feColorMatrix': true,
      'feComponentTransfer': true,
      'feComposite': true,
      'feConvolveMatrix': true,
      'feDiffuseLighting': true,
      'feDisplacementMap': true,
      'feFlood': true,
      'feGaussianBlur': true,
      'feImage': true,
      'feMerge': true,
      'feMorphology': true,
      'feOffset': true,
      'feSpecularLighting': true,
      'feTile': true,
      'feTurbulence': true,
      'filter': true,
      'font': true,
      'foreignObject': true,
      'g': true,
      'glyph': true,
      'glyphRef': true,
      'image': true,
      'line': true,
      'linearGradient': true,
      'marker': true,
      'mask': true,
      'missing-glyph': true,
      'path': true,
      'pattern': true,
      'polygon': true,
      'polyline': true,
      'radialGradient': true,
      'rect': true,
      'stop': true,
      'svg': true,
      'switch': true,
      'symbol': true,
      'text': true,
      'textPath': true,
      'tref': true,
      'tspan': true,
      'use': true
    };
    exports.presentationElements = presentationElements;
    var presentationAttributes = {
      'alignment-baseline': true,
      'baseline-shift': true,
      'clip-path': true,
      'clip-rule': true,
      'clip': true,
      'color-interpolation-filters': true,
      'color-interpolation': true,
      'color-profile': true,
      'color-rendering': true,
      'color': true,
      'cursor': true,
      'direction': true,
      'display': true,
      'dominant-baseline': true,
      'enable-background': true,
      'fill-opacity': true,
      'fill-rule': true,
      'fill': true,
      'filter': true,
      'flood-color': true,
      'flood-opacity': true,
      'font-family': true,
      'font-size-adjust': true,
      'font-size': true,
      'font-stretch': true,
      'font-style': true,
      'font-variant': true,
      'font-weight': true,
      'glyph-orientation-horizontal': true,
      'glyph-orientation-vertical': true,
      'image-rendering': true,
      'kerning': true,
      'letter-spacing': true,
      'lighting-color': true,
      'marker-end': true,
      'marker-mid': true,
      'marker-start': true,
      'mask': true,
      'opacity': true,
      'overflow': true,
      'pointer-events': true,
      'shape-rendering': true,
      'stop-color': true,
      'stop-opacity': true,
      'stroke-dasharray': true,
      'stroke-dashoffset': true,
      'stroke-linecap': true,
      'stroke-linejoin': true,
      'stroke-miterlimit': true,
      'stroke-opacity': true,
      'stroke-width': true,
      'stroke': true,
      'text-anchor': true,
      'text-decoration': true,
      'text-rendering': true,
      'unicode-bidi': true,
      'visibility': true,
      'word-spacing': true,
      'writing-mode': true
    };
    exports.presentationAttributes = presentationAttributes;
    function isStandardSvgAttribute(nodeName, attributeName) {
      return presentationElements[nodeName] && presentationAttributes[attributeName] || elements[nodeName] && elements[nodeName].indexOf(attributeName) !== -1;
    }
    function createElement(html) {
      var div = document.createElement('div');
      div.innerHTML = html;
      return div.firstChild;
    }
    if (createElement('<svg><altGlyph /></svg>').firstElementChild.nodeName === 'altglyph') {
      elements.altglyph = elements.altGlyph;
      delete elements.altGlyph;
      elements.altglyphdef = elements.altGlyphDef;
      delete elements.altGlyphDef;
      elements.altglyphitem = elements.altGlyphItem;
      delete elements.altGlyphItem;
      elements.glyphref = elements.glyphRef;
      delete elements.glyphRef;
    }
    if (typeof Object.getPropertyDescriptor !== 'function') {
      Object.getPropertyDescriptor = function(subject, name) {
        var pd = Object.getOwnPropertyDescriptor(subject, name);
        var proto = Object.getPrototypeOf(subject);
        while (typeof pd === 'undefined' && proto !== null) {
          pd = Object.getOwnPropertyDescriptor(proto, name);
          proto = Object.getPrototypeOf(proto);
        }
        return pd;
      };
    }
    function createObserverLookup(obj, observerLocator) {
      var value = new OoObjectObserver(obj, observerLocator);
      try {
        Object.defineProperty(obj, '__observer__', {
          enumerable: false,
          configurable: false,
          writable: false,
          value: value
        });
      } catch (_) {}
      return value;
    }
    var ObserverLocator = (function() {
      function ObserverLocator(taskQueue, eventManager, dirtyChecker, observationAdapters) {
        _classCallCheck(this, ObserverLocator);
        this.taskQueue = taskQueue;
        this.eventManager = eventManager;
        this.dirtyChecker = dirtyChecker;
        this.observationAdapters = observationAdapters;
      }
      ObserverLocator.inject = function inject() {
        return [_aureliaTaskQueue.TaskQueue, EventManager, DirtyChecker, _aureliaDependencyInjection.All.of(ObjectObservationAdapter)];
      };
      ObserverLocator.prototype.getObserver = function getObserver(obj, propertyName) {
        var observersLookup = obj.__observers__,
            observer;
        if (observersLookup && propertyName in observersLookup) {
          return observersLookup[propertyName];
        }
        observer = this.createPropertyObserver(obj, propertyName);
        if (!observer.doNotCache) {
          if (observersLookup === undefined) {
            observersLookup = this.getOrCreateObserversLookup(obj);
          }
          observersLookup[propertyName] = observer;
        }
        return observer;
      };
      ObserverLocator.prototype.getOrCreateObserversLookup = function getOrCreateObserversLookup(obj) {
        return obj.__observers__ || this.createObserversLookup(obj);
      };
      ObserverLocator.prototype.createObserversLookup = function createObserversLookup(obj) {
        var value = {};
        try {
          Object.defineProperty(obj, '__observers__', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: value
          });
        } catch (_) {}
        return value;
      };
      ObserverLocator.prototype.getObservationAdapter = function getObservationAdapter(obj, propertyName, descriptor) {
        var i,
            ii,
            observationAdapter;
        for (i = 0, ii = this.observationAdapters.length; i < ii; i++) {
          observationAdapter = this.observationAdapters[i];
          if (observationAdapter.handlesProperty(obj, propertyName, descriptor))
            return observationAdapter;
        }
        return null;
      };
      ObserverLocator.prototype.createPropertyObserver = function createPropertyObserver(obj, propertyName) {
        var observerLookup,
            descriptor,
            handler,
            observationAdapter,
            xlinkResult;
        if (obj instanceof Element) {
          if (propertyName === 'class') {
            return new ClassObserver(obj);
          }
          if (propertyName === 'style' || propertyName === 'css') {
            return new StyleObserver(obj, propertyName);
          }
          handler = this.eventManager.getElementHandler(obj, propertyName);
          if (propertyName === 'value' && obj.tagName.toLowerCase() === 'select') {
            return new SelectValueObserver(obj, handler, this);
          }
          if (propertyName === 'checked' && obj.tagName.toLowerCase() === 'input') {
            return new CheckedObserver(obj, handler, this);
          }
          if (handler) {
            return new ValueAttributeObserver(obj, propertyName, handler);
          }
          xlinkResult = /^xlink:(.+)$/.exec(propertyName);
          if (xlinkResult) {
            return new XLinkAttributeObserver(obj, propertyName, xlinkResult[1]);
          }
          if (/^\w+:|^data-|^aria-/.test(propertyName) || obj instanceof SVGElement && isStandardSvgAttribute(obj.nodeName, propertyName)) {
            return new DataAttributeObserver(obj, propertyName);
          }
        }
        descriptor = Object.getPropertyDescriptor(obj, propertyName);
        if (hasDeclaredDependencies(descriptor)) {
          return new ComputedPropertyObserver(obj, propertyName, descriptor, this);
        }
        var existingGetterOrSetter = undefined;
        if (descriptor && (existingGetterOrSetter = descriptor.get || descriptor.set)) {
          if (existingGetterOrSetter.getObserver) {
            return existingGetterOrSetter.getObserver(obj);
          }
          observationAdapter = this.getObservationAdapter(obj, propertyName, descriptor);
          if (observationAdapter)
            return observationAdapter.getObserver(obj, propertyName, descriptor);
          return new DirtyCheckProperty(this.dirtyChecker, obj, propertyName);
        }
        if (hasObjectObserve) {
          observerLookup = obj.__observer__ || createObserverLookup(obj, this);
          return observerLookup.getObserver(propertyName, descriptor);
        }
        if (obj instanceof Array) {
          if (propertyName === 'length') {
            return this.getArrayObserver(obj).getLengthObserver();
          } else {
            return new DirtyCheckProperty(this.dirtyChecker, obj, propertyName);
          }
        } else if (obj instanceof Map) {
          if (propertyName === 'size') {
            return this.getMapObserver(obj).getLengthObserver();
          } else {
            return new DirtyCheckProperty(this.dirtyChecker, obj, propertyName);
          }
        }
        return new SetterObserver(this.taskQueue, obj, propertyName);
      };
      ObserverLocator.prototype.getArrayObserver = function getArrayObserver(array) {
        if ('__array_observer__' in array) {
          return array.__array_observer__;
        }
        return array.__array_observer__ = _getArrayObserver(this.taskQueue, array);
      };
      ObserverLocator.prototype.getMapObserver = function getMapObserver(map) {
        if ('__map_observer__' in map) {
          return map.__map_observer__;
        }
        return map.__map_observer__ = _getMapObserver(this.taskQueue, map);
      };
      return ObserverLocator;
    })();
    exports.ObserverLocator = ObserverLocator;
    var ObjectObservationAdapter = (function() {
      function ObjectObservationAdapter() {
        _classCallCheck(this, ObjectObservationAdapter);
      }
      ObjectObservationAdapter.prototype.handlesProperty = function handlesProperty(object, propertyName, descriptor) {
        throw new Error('BindingAdapters must implement handlesProperty(object, propertyName).');
      };
      ObjectObservationAdapter.prototype.getObserver = function getObserver(object, propertyName, descriptor) {
        throw new Error('BindingAdapters must implement createObserver(object, propertyName).');
      };
      return ObjectObservationAdapter;
    })();
    exports.ObjectObservationAdapter = ObjectObservationAdapter;
    var BindingExpression = (function() {
      function BindingExpression(observerLocator, targetProperty, sourceExpression, mode, valueConverterLookupFunction, attribute) {
        _classCallCheck(this, BindingExpression);
        this.observerLocator = observerLocator;
        this.targetProperty = targetProperty;
        this.sourceExpression = sourceExpression;
        this.mode = mode;
        this.valueConverterLookupFunction = valueConverterLookupFunction;
        this.attribute = attribute;
        this.discrete = false;
      }
      BindingExpression.prototype.createBinding = function createBinding(target) {
        return new Binding(this.observerLocator, this.sourceExpression, target, this.targetProperty, this.mode, this.valueConverterLookupFunction);
      };
      BindingExpression.create = function create(targetProperty, sourceExpression) {
        var mode = arguments[2] === undefined ? bindingMode.oneWay : arguments[2];
        var parser = _aureliaDependencyInjection.Container.instance.get(Parser),
            observerLocator = _aureliaDependencyInjection.Container.instance.get(ObserverLocator);
        return new BindingExpression(observerLocator, targetProperty, parser.parse(sourceExpression), mode);
      };
      return BindingExpression;
    })();
    exports.BindingExpression = BindingExpression;
    var Binding = (function() {
      function Binding(observerLocator, sourceExpression, target, targetProperty, mode, valueConverterLookupFunction) {
        _classCallCheck(this, Binding);
        this.observerLocator = observerLocator;
        this.sourceExpression = sourceExpression;
        this.targetProperty = observerLocator.getObserver(target, targetProperty);
        this.mode = mode;
        this.valueConverterLookupFunction = valueConverterLookupFunction;
      }
      Binding.prototype.getObserver = function getObserver(obj, propertyName) {
        return this.observerLocator.getObserver(obj, propertyName);
      };
      Binding.prototype.bind = function bind(source) {
        var _this24 = this;
        var targetProperty = this.targetProperty,
            info;
        if ('bind' in targetProperty) {
          targetProperty.bind();
        }
        if (this.mode == bindingMode.oneWay || this.mode == bindingMode.twoWay) {
          if (this._disposeObserver) {
            if (this.source === source) {
              return ;
            }
            this.unbind();
          }
          info = this.sourceExpression.connect(this, source);
          if (info.observer) {
            this._disposeObserver = info.observer.subscribe(function(newValue) {
              var existing = targetProperty.getValue();
              if (newValue !== existing) {
                targetProperty.setValue(newValue);
              }
            });
          }
          if (info.value !== undefined) {
            targetProperty.setValue(info.value);
          }
          if (this.mode == bindingMode.twoWay) {
            this._disposeListener = targetProperty.subscribe(function(newValue) {
              _this24.sourceExpression.assign(source, newValue, _this24.valueConverterLookupFunction);
            });
          }
          this.source = source;
        } else {
          var value = this.sourceExpression.evaluate(source, this.valueConverterLookupFunction);
          if (value !== undefined) {
            targetProperty.setValue(value);
          }
        }
      };
      Binding.prototype.unbind = function unbind() {
        if ('unbind' in this.targetProperty) {
          this.targetProperty.unbind();
        }
        if (this._disposeObserver) {
          this._disposeObserver();
          this._disposeObserver = null;
        }
        if (this._disposeListener) {
          this._disposeListener();
          this._disposeListener = null;
        }
      };
      return Binding;
    })();
    var CallExpression = (function() {
      function CallExpression(observerLocator, targetProperty, sourceExpression, valueConverterLookupFunction) {
        _classCallCheck(this, CallExpression);
        this.observerLocator = observerLocator;
        this.targetProperty = targetProperty;
        this.sourceExpression = sourceExpression;
        this.valueConverterLookupFunction = valueConverterLookupFunction;
      }
      CallExpression.prototype.createBinding = function createBinding(target) {
        return new Call(this.observerLocator, this.sourceExpression, target, this.targetProperty, this.valueConverterLookupFunction);
      };
      return CallExpression;
    })();
    exports.CallExpression = CallExpression;
    var Call = (function() {
      function Call(observerLocator, sourceExpression, target, targetProperty, valueConverterLookupFunction) {
        _classCallCheck(this, Call);
        this.sourceExpression = sourceExpression;
        this.target = target;
        this.targetProperty = observerLocator.getObserver(target, targetProperty);
        this.valueConverterLookupFunction = valueConverterLookupFunction;
      }
      Call.prototype.bind = function bind(source) {
        var _this25 = this;
        if (this.source === source) {
          return ;
        }
        if (this.source) {
          this.unbind();
        }
        this.source = source;
        this.targetProperty.setValue(function($event) {
          var result,
              temp = source.$event;
          source.$event = $event;
          result = _this25.sourceExpression.evaluate(source, _this25.valueConverterLookupFunction);
          source.$event = temp;
          return result;
        });
      };
      Call.prototype.unbind = function unbind() {
        this.targetProperty.setValue(null);
      };
      return Call;
    })();
    if (!('classList' in document.createElement('_')) || document.createElementNS && !('classList' in document.createElementNS('http://www.w3.org/2000/svg', 'g'))) {
      (function(view) {
        'use strict';
        if (!('Element' in view))
          return ;
        var classListProp = 'classList',
            protoProp = 'prototype',
            elemCtrProto = view.Element[protoProp],
            objCtr = Object,
            strTrim = String[protoProp].trim || function() {
              return this.replace(/^\s+|\s+$/g, '');
            },
            arrIndexOf = Array[protoProp].indexOf || function(item) {
              var i = 0,
                  len = this.length;
              for (; i < len; i++) {
                if (i in this && this[i] === item) {
                  return i;
                }
              }
              return -1;
            },
            DOMEx = function DOMEx(type, message) {
              this.name = type;
              this.code = DOMException[type];
              this.message = message;
            },
            checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
              if (token === '') {
                throw new DOMEx('SYNTAX_ERR', 'An invalid or illegal string was specified');
              }
              if (/\s/.test(token)) {
                throw new DOMEx('INVALID_CHARACTER_ERR', 'String contains an invalid character');
              }
              return arrIndexOf.call(classList, token);
            },
            ClassList = function ClassList(elem) {
              var trimmedClasses = strTrim.call(elem.getAttribute('class') || ''),
                  classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
                  i = 0,
                  len = classes.length;
              for (; i < len; i++) {
                this.push(classes[i]);
              }
              this._updateClassName = function() {
                elem.setAttribute('class', this.toString());
              };
            },
            classListProto = ClassList[protoProp] = [],
            classListGetter = function classListGetter() {
              return new ClassList(this);
            };
        DOMEx[protoProp] = Error[protoProp];
        classListProto.item = function(i) {
          return this[i] || null;
        };
        classListProto.contains = function(token) {
          token += '';
          return checkTokenAndGetIndex(this, token) !== -1;
        };
        classListProto.add = function() {
          var tokens = arguments,
              i = 0,
              l = tokens.length,
              token,
              updated = false;
          do {
            token = tokens[i] + '';
            if (checkTokenAndGetIndex(this, token) === -1) {
              this.push(token);
              updated = true;
            }
          } while (++i < l);
          if (updated) {
            this._updateClassName();
          }
        };
        classListProto.remove = function() {
          var tokens = arguments,
              i = 0,
              l = tokens.length,
              token,
              updated = false,
              index;
          do {
            token = tokens[i] + '';
            index = checkTokenAndGetIndex(this, token);
            while (index !== -1) {
              this.splice(index, 1);
              updated = true;
              index = checkTokenAndGetIndex(this, token);
            }
          } while (++i < l);
          if (updated) {
            this._updateClassName();
          }
        };
        classListProto.toggle = function(token, force) {
          token += '';
          var result = this.contains(token),
              method = result ? force !== true && 'remove' : force !== false && 'add';
          if (method) {
            this[method](token);
          }
          if (force === true || force === false) {
            return force;
          } else {
            return !result;
          }
        };
        classListProto.toString = function() {
          return this.join(' ');
        };
        if (objCtr.defineProperty) {
          var classListPropDesc = {
            get: classListGetter,
            enumerable: true,
            configurable: true
          };
          try {
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
          } catch (ex) {
            if (ex.number === -0x7FF5EC54) {
              classListPropDesc.enumerable = false;
              objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
            }
          }
        } else if (objCtr[protoProp].__defineGetter__) {
          elemCtrProto.__defineGetter__(classListProp, classListGetter);
        }
      })(self);
    } else {
      (function() {
        'use strict';
        var testElement = document.createElement('_');
        testElement.classList.add('c1', 'c2');
        if (!testElement.classList.contains('c2')) {
          var createMethod = function createMethod(method) {
            var original = DOMTokenList.prototype[method];
            DOMTokenList.prototype[method] = function(token) {
              var i,
                  len = arguments.length;
              for (i = 0; i < len; i++) {
                token = arguments[i];
                original.call(this, token);
              }
            };
          };
          createMethod('add');
          createMethod('remove');
        }
        testElement.classList.toggle('c3', false);
        if (testElement.classList.contains('c3')) {
          var _toggle = DOMTokenList.prototype.toggle;
          DOMTokenList.prototype.toggle = function(token, force) {
            if (1 in arguments && !this.contains(token) === !force) {
              return force;
            } else {
              return _toggle.call(this, token);
            }
          };
        }
        testElement = null;
      })();
    }
    function camelCase(name) {
      return name.charAt(0).toLowerCase() + name.slice(1);
    }
    var ValueConverterResource = (function() {
      function ValueConverterResource(name) {
        _classCallCheck(this, ValueConverterResource);
        this.name = name;
      }
      ValueConverterResource.convention = function convention(name) {
        if (name.endsWith('ValueConverter')) {
          return new ValueConverterResource(camelCase(name.substring(0, name.length - 14)));
        }
      };
      ValueConverterResource.prototype.analyze = function analyze(container, target) {
        this.instance = container.get(target);
      };
      ValueConverterResource.prototype.register = function register(registry, name) {
        registry.registerValueConverter(name || this.name, this.instance);
      };
      ValueConverterResource.prototype.load = function load(container, target) {
        return Promise.resolve(this);
      };
      return ValueConverterResource;
    })();
    exports.ValueConverterResource = ValueConverterResource;
    function valueConverter(nameOrTarget) {
      if (nameOrTarget === undefined || typeof nameOrTarget === 'string') {
        return function(target) {
          _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.resource, new ValueConverterResource(nameOrTarget), target);
        };
      }
      _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.resource, new ValueConverterResource(), nameOrTarget);
    }
    _aureliaMetadata.Decorators.configure.parameterizedDecorator('valueConverter', valueConverter);
    function computedFrom() {
      for (var _len = arguments.length,
          rest = Array(_len),
          _key = 0; _key < _len; _key++) {
        rest[_key] = arguments[_key];
      }
      return function(target, key, descriptor) {
        descriptor.get.dependencies = rest;
        return descriptor;
      };
    }
    var ListenerExpression = (function() {
      function ListenerExpression(eventManager, targetEvent, sourceExpression, delegate, preventDefault) {
        _classCallCheck(this, ListenerExpression);
        this.eventManager = eventManager;
        this.targetEvent = targetEvent;
        this.sourceExpression = sourceExpression;
        this.delegate = delegate;
        this.discrete = true;
        this.preventDefault = preventDefault;
      }
      ListenerExpression.prototype.createBinding = function createBinding(target) {
        return new Listener(this.eventManager, this.targetEvent, this.delegate, this.sourceExpression, target, this.preventDefault);
      };
      return ListenerExpression;
    })();
    exports.ListenerExpression = ListenerExpression;
    var Listener = (function() {
      function Listener(eventManager, targetEvent, delegate, sourceExpression, target, preventDefault) {
        _classCallCheck(this, Listener);
        this.eventManager = eventManager;
        this.targetEvent = targetEvent;
        this.delegate = delegate;
        this.sourceExpression = sourceExpression;
        this.target = target;
        this.preventDefault = preventDefault;
      }
      Listener.prototype.bind = function bind(source) {
        var _this26 = this;
        if (this._disposeListener) {
          if (this.source === source) {
            return ;
          }
          this.unbind();
        }
        this.source = source;
        this._disposeListener = this.eventManager.addEventListener(this.target, this.targetEvent, function(event) {
          var prevEvent = source.$event;
          source.$event = event;
          var result = _this26.sourceExpression.evaluate(source);
          source.$event = prevEvent;
          if (result !== true && _this26.preventDefault) {
            event.preventDefault();
          }
          return result;
        }, this.delegate);
      };
      Listener.prototype.unbind = function unbind() {
        if (this._disposeListener) {
          this._disposeListener();
          this._disposeListener = null;
        }
      };
      return Listener;
    })();
    var NameExpression = (function() {
      function NameExpression(name, mode) {
        _classCallCheck(this, NameExpression);
        this.property = name;
        this.discrete = true;
        this.mode = mode;
      }
      NameExpression.prototype.createBinding = function createBinding(target) {
        return new NameBinder(this.property, target, this.mode);
      };
      return NameExpression;
    })();
    exports.NameExpression = NameExpression;
    var NameBinder = (function() {
      function NameBinder(property, target, mode) {
        _classCallCheck(this, NameBinder);
        this.property = property;
        switch (mode) {
          case 'element':
            this.target = target;
            break;
          case 'view-model':
            this.target = target.primaryBehavior.executionContext;
            break;
          default:
            this.target = target[mode];
            if (this.target === undefined) {
              throw new Error('Attempted to reference "' + mode + '", but it was not found on the target element.');
            } else {
              this.target = this.target.executionContext || this.target;
            }
            break;
        }
      }
      NameBinder.prototype.bind = function bind(source) {
        if (this.source) {
          if (this.source === source) {
            return ;
          }
          this.unbind();
        }
        this.source = source;
        source[this.property] = this.target;
      };
      NameBinder.prototype.unbind = function unbind() {
        this.source[this.property] = null;
      };
      return NameBinder;
    })();
  }).call(__exports, __exports, __require('npm:core-js@0.9.18'), __require('github:aurelia/task-queue@0.6.1'), __require('github:aurelia/dependency-injection@0.9.1'), __require('github:aurelia/metadata@0.7.1'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/dependency-injection@0.9.1", ["github:aurelia/dependency-injection@0.9.1/aurelia-dependency-injection"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/dependency-injection@0.9.1/aurelia-dependency-injection'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/binding@0.8.4", ["github:aurelia/binding@0.8.4/aurelia-binding"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/binding@0.8.4/aurelia-binding'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/templating@0.13.13/aurelia-templating", ["npm:core-js@0.9.18", "github:aurelia/metadata@0.7.1", "github:aurelia/path@0.8.1", "github:aurelia/loader@0.8.3", "github:aurelia/dependency-injection@0.9.1", "github:aurelia/binding@0.8.4", "github:aurelia/task-queue@0.6.1", "github:aurelia/logging@0.6.2"], false, function(__require, __exports, __module) {
  return (function(exports, _coreJs, _aureliaMetadata, _aureliaPath, _aureliaLoader, _aureliaDependencyInjection, _aureliaBinding, _aureliaTaskQueue, _aureliaLogging) {
    'use strict';
    exports.__esModule = true;
    var _createClass = (function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ('value' in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          defineProperties(Constructor, staticProps);
        return Constructor;
      };
    })();
    exports.createTemplateFromMarkup = createTemplateFromMarkup;
    exports.hyphenate = hyphenate;
    exports.nextElementSibling = nextElementSibling;
    exports.behavior = behavior;
    exports.customElement = customElement;
    exports.customAttribute = customAttribute;
    exports.templateController = templateController;
    exports.bindable = bindable;
    exports.dynamicOptions = dynamicOptions;
    exports.sync = sync;
    exports.useShadowDOM = useShadowDOM;
    exports.skipContentProcessing = skipContentProcessing;
    exports.processContent = processContent;
    exports.containerless = containerless;
    exports.viewStrategy = viewStrategy;
    exports.useView = useView;
    exports.inlineView = inlineView;
    exports.noView = noView;
    exports.elementConfig = elementConfig;
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {'default': obj};
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }});
      if (superClass)
        subClass.__proto__ = superClass;
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var _core = _interopRequireDefault(_coreJs);
    var needsTemplateFixup = !('content' in document.createElement('template'));
    var DOMBoundary = 'aurelia-dom-boundary';
    exports.DOMBoundary = DOMBoundary;
    function createTemplateFromMarkup(markup) {
      var temp = document.createElement('template');
      temp.innerHTML = markup;
      if (needsTemplateFixup) {
        temp.content = document.createDocumentFragment();
        while (temp.firstChild) {
          temp.content.appendChild(temp.firstChild);
        }
      }
      return temp;
    }
    var animationEvent = {
      enterBegin: 'animation:enter:begin',
      enterActive: 'animation:enter:active',
      enterDone: 'animation:enter:done',
      enterTimeout: 'animation:enter:timeout',
      leaveBegin: 'animation:leave:begin',
      leaveActive: 'animation:leave:active',
      leaveDone: 'animation:leave:done',
      leaveTimeout: 'animation:leave:timeout',
      staggerNext: 'animation:stagger:next',
      removeClassBegin: 'animation:remove-class:begin',
      removeClassActive: 'animation:remove-class:active',
      removeClassDone: 'animation:remove-class:done',
      removeClassTimeout: 'animation:remove-class:timeout',
      addClassBegin: 'animation:add-class:begin',
      addClassActive: 'animation:add-class:active',
      addClassDone: 'animation:add-class:done',
      addClassTimeout: 'animation:add-class:timeout',
      animateBegin: 'animation:animate:begin',
      animateActive: 'animation:animate:active',
      animateDone: 'animation:animate:done',
      animateTimeout: 'animation:animate:timeout',
      sequenceBegin: 'animation:sequence:begin',
      sequenceDone: 'animation:sequence:done'
    };
    exports.animationEvent = animationEvent;
    var Animator = (function() {
      function Animator() {
        _classCallCheck(this, Animator);
      }
      Animator.configureDefault = function configureDefault(container, animatorInstance) {
        container.registerInstance(Animator, Animator.instance = animatorInstance || new Animator());
      };
      Animator.prototype.move = function move() {
        return Promise.resolve(false);
      };
      Animator.prototype.enter = function enter(element) {
        return Promise.resolve(false);
      };
      Animator.prototype.leave = function leave(element) {
        return Promise.resolve(false);
      };
      Animator.prototype.removeClass = function removeClass(element, className) {
        return Promise.resolve(false);
      };
      Animator.prototype.addClass = function addClass(element, className) {
        return Promise.resolve(false);
      };
      Animator.prototype.animate = function animate(element, className, options) {
        return Promise.resolve(false);
      };
      Animator.prototype.runSequence = function runSequence(sequence) {};
      Animator.prototype.registerEffect = function registerEffect(effectName, properties) {};
      Animator.prototype.unregisterEffect = function unregisterEffect(effectName) {};
      return Animator;
    })();
    exports.Animator = Animator;
    var capitalMatcher = /([A-Z])/g;
    function addHyphenAndLower(char) {
      return '-' + char.toLowerCase();
    }
    function hyphenate(name) {
      return (name.charAt(0).toLowerCase() + name.slice(1)).replace(capitalMatcher, addHyphenAndLower);
    }
    function nextElementSibling(element) {
      if (element.nextElementSibling) {
        return element.nextElementSibling;
      }
      do {
        element = element.nextSibling;
      } while (element && element.nodeType !== 1);
      return element;
    }
    var ViewStrategy = (function() {
      function ViewStrategy() {
        _classCallCheck(this, ViewStrategy);
      }
      ViewStrategy.prototype.makeRelativeTo = function makeRelativeTo(baseUrl) {};
      ViewStrategy.normalize = function normalize(value) {
        if (typeof value === 'string') {
          value = new UseViewStrategy(value);
        }
        if (value && !(value instanceof ViewStrategy)) {
          throw new Error('The view must be a string or an instance of ViewStrategy.');
        }
        return value;
      };
      ViewStrategy.getDefault = function getDefault(target) {
        var strategy,
            annotation;
        if (typeof target !== 'function') {
          target = target.constructor;
        }
        annotation = _aureliaMetadata.Origin.get(target);
        strategy = _aureliaMetadata.Metadata.get(ViewStrategy.metadataKey, target);
        if (!strategy) {
          if (!annotation) {
            throw new Error('Cannot determinte default view strategy for object.', target);
          }
          strategy = new ConventionalViewStrategy(annotation.moduleId);
        } else if (annotation) {
          strategy.moduleId = annotation.moduleId;
        }
        return strategy;
      };
      _createClass(ViewStrategy, null, [{
        key: 'metadataKey',
        value: 'aurelia:view-strategy',
        enumerable: true
      }]);
      return ViewStrategy;
    })();
    exports.ViewStrategy = ViewStrategy;
    var UseViewStrategy = (function(_ViewStrategy) {
      function UseViewStrategy(path) {
        _classCallCheck(this, UseViewStrategy);
        _ViewStrategy.call(this);
        this.path = path;
      }
      _inherits(UseViewStrategy, _ViewStrategy);
      UseViewStrategy.prototype.loadViewFactory = function loadViewFactory(viewEngine, options, loadContext) {
        if (!this.absolutePath && this.moduleId) {
          this.absolutePath = _aureliaPath.relativeToFile(this.path, this.moduleId);
        }
        return viewEngine.loadViewFactory(this.absolutePath || this.path, options, this.moduleId, loadContext);
      };
      UseViewStrategy.prototype.makeRelativeTo = function makeRelativeTo(file) {
        this.absolutePath = _aureliaPath.relativeToFile(this.path, file);
      };
      return UseViewStrategy;
    })(ViewStrategy);
    exports.UseViewStrategy = UseViewStrategy;
    var ConventionalViewStrategy = (function(_ViewStrategy2) {
      function ConventionalViewStrategy(moduleId) {
        _classCallCheck(this, ConventionalViewStrategy);
        _ViewStrategy2.call(this);
        this.moduleId = moduleId;
        this.viewUrl = ConventionalViewStrategy.convertModuleIdToViewUrl(moduleId);
      }
      _inherits(ConventionalViewStrategy, _ViewStrategy2);
      ConventionalViewStrategy.prototype.loadViewFactory = function loadViewFactory(viewEngine, options, loadContext) {
        return viewEngine.loadViewFactory(this.viewUrl, options, this.moduleId, loadContext);
      };
      ConventionalViewStrategy.convertModuleIdToViewUrl = function convertModuleIdToViewUrl(moduleId) {
        var id = moduleId.endsWith('.js') || moduleId.endsWith('.ts') ? moduleId.substring(0, moduleId.length - 3) : moduleId;
        return id + '.html';
      };
      return ConventionalViewStrategy;
    })(ViewStrategy);
    exports.ConventionalViewStrategy = ConventionalViewStrategy;
    var NoViewStrategy = (function(_ViewStrategy3) {
      function NoViewStrategy() {
        _classCallCheck(this, NoViewStrategy);
        _ViewStrategy3.apply(this, arguments);
      }
      _inherits(NoViewStrategy, _ViewStrategy3);
      NoViewStrategy.prototype.loadViewFactory = function loadViewFactory(viewEngine, options, loadContext) {
        return Promise.resolve(null);
      };
      return NoViewStrategy;
    })(ViewStrategy);
    exports.NoViewStrategy = NoViewStrategy;
    var TemplateRegistryViewStrategy = (function(_ViewStrategy4) {
      function TemplateRegistryViewStrategy(moduleId, entry) {
        _classCallCheck(this, TemplateRegistryViewStrategy);
        _ViewStrategy4.call(this);
        this.moduleId = moduleId;
        this.entry = entry;
      }
      _inherits(TemplateRegistryViewStrategy, _ViewStrategy4);
      TemplateRegistryViewStrategy.prototype.loadViewFactory = function loadViewFactory(viewEngine, options, loadContext) {
        var entry = this.entry;
        if (entry.isReady) {
          return Promise.resolve(entry.factory);
        }
        return viewEngine.loadViewFactory(entry, options, this.moduleId, loadContext);
      };
      return TemplateRegistryViewStrategy;
    })(ViewStrategy);
    exports.TemplateRegistryViewStrategy = TemplateRegistryViewStrategy;
    var InlineViewStrategy = (function(_ViewStrategy5) {
      function InlineViewStrategy(markup, dependencies, dependencyBaseUrl) {
        _classCallCheck(this, InlineViewStrategy);
        _ViewStrategy5.call(this);
        this.markup = markup;
        this.dependencies = dependencies || null;
        this.dependencyBaseUrl = dependencyBaseUrl || '';
      }
      _inherits(InlineViewStrategy, _ViewStrategy5);
      InlineViewStrategy.prototype.loadViewFactory = function loadViewFactory(viewEngine, options, loadContext) {
        var entry = this.entry,
            dependencies = this.dependencies;
        if (entry && entry.isReady) {
          return Promise.resolve(entry.factory);
        }
        this.entry = entry = new _aureliaLoader.TemplateRegistryEntry(this.moduleId || this.dependencyBaseUrl);
        entry.setTemplate(createTemplateFromMarkup(this.markup));
        if (dependencies !== null) {
          for (var i = 0,
              ii = dependencies.length; i < ii; ++i) {
            var current = dependencies[i];
            if (typeof current === 'string' || typeof current === 'function') {
              entry.addDependency(current);
            } else {
              entry.addDependency(current.from, current.as);
            }
          }
        }
        return viewEngine.loadViewFactory(entry, options, this.moduleId, loadContext);
      };
      return InlineViewStrategy;
    })(ViewStrategy);
    exports.InlineViewStrategy = InlineViewStrategy;
    var BindingLanguage = (function() {
      function BindingLanguage() {
        _classCallCheck(this, BindingLanguage);
      }
      BindingLanguage.prototype.inspectAttribute = function inspectAttribute(resources, attrName, attrValue) {
        throw new Error('A BindingLanguage must implement inspectAttribute(...)');
      };
      BindingLanguage.prototype.createAttributeInstruction = function createAttributeInstruction(resources, element, info, existingInstruction) {
        throw new Error('A BindingLanguage must implement createAttributeInstruction(...)');
      };
      BindingLanguage.prototype.parseText = function parseText(resources, value) {
        throw new Error('A BindingLanguage must implement parseText(...)');
      };
      return BindingLanguage;
    })();
    exports.BindingLanguage = BindingLanguage;
    function register(lookup, name, resource, type) {
      if (!name) {
        return ;
      }
      var existing = lookup[name];
      if (existing) {
        if (existing != resource) {
          throw new Error('Attempted to register ' + type + ' when one with the same name already exists. Name: ' + name + '.');
        }
        return ;
      }
      lookup[name] = resource;
    }
    var ResourceRegistry = (function() {
      function ResourceRegistry() {
        _classCallCheck(this, ResourceRegistry);
        this.attributes = {};
        this.elements = {};
        this.valueConverters = {};
        this.attributeMap = {};
        this.baseResourceUrl = '';
      }
      ResourceRegistry.prototype.registerElement = function registerElement(tagName, behavior) {
        register(this.elements, tagName, behavior, 'an Element');
      };
      ResourceRegistry.prototype.getElement = function getElement(tagName) {
        return this.elements[tagName];
      };
      ResourceRegistry.prototype.registerAttribute = function registerAttribute(attribute, behavior, knownAttribute) {
        this.attributeMap[attribute] = knownAttribute;
        register(this.attributes, attribute, behavior, 'an Attribute');
      };
      ResourceRegistry.prototype.getAttribute = function getAttribute(attribute) {
        return this.attributes[attribute];
      };
      ResourceRegistry.prototype.registerValueConverter = function registerValueConverter(name, valueConverter) {
        register(this.valueConverters, name, valueConverter, 'a ValueConverter');
      };
      ResourceRegistry.prototype.getValueConverter = function getValueConverter(name) {
        return this.valueConverters[name];
      };
      return ResourceRegistry;
    })();
    exports.ResourceRegistry = ResourceRegistry;
    var ViewResources = (function(_ResourceRegistry) {
      function ViewResources(parent, viewUrl) {
        _classCallCheck(this, ViewResources);
        _ResourceRegistry.call(this);
        this.parent = parent;
        this.viewUrl = viewUrl;
        this.valueConverterLookupFunction = this.getValueConverter.bind(this);
      }
      _inherits(ViewResources, _ResourceRegistry);
      ViewResources.prototype.relativeToView = function relativeToView(path) {
        return _aureliaPath.relativeToFile(path, this.viewUrl);
      };
      ViewResources.prototype.getElement = function getElement(tagName) {
        return this.elements[tagName] || this.parent.getElement(tagName);
      };
      ViewResources.prototype.mapAttribute = function mapAttribute(attribute) {
        return this.attributeMap[attribute] || this.parent.attributeMap[attribute];
      };
      ViewResources.prototype.getAttribute = function getAttribute(attribute) {
        return this.attributes[attribute] || this.parent.getAttribute(attribute);
      };
      ViewResources.prototype.getValueConverter = function getValueConverter(name) {
        return this.valueConverters[name] || this.parent.getValueConverter(name);
      };
      return ViewResources;
    })(ResourceRegistry);
    exports.ViewResources = ViewResources;
    var View = (function() {
      function View(container, fragment, behaviors, bindings, children, systemControlled, contentSelectors) {
        _classCallCheck(this, View);
        this.container = container;
        this.fragment = fragment;
        this.behaviors = behaviors;
        this.bindings = bindings;
        this.children = children;
        this.systemControlled = systemControlled;
        this.contentSelectors = contentSelectors;
        this.firstChild = fragment.firstChild;
        this.lastChild = fragment.lastChild;
        this.isBound = false;
        this.isAttached = false;
      }
      View.prototype.created = function created(executionContext) {
        var i,
            ii,
            behaviors = this.behaviors;
        for (i = 0, ii = behaviors.length; i < ii; ++i) {
          behaviors[i].created(executionContext);
        }
      };
      View.prototype.bind = function bind(executionContext, systemUpdate) {
        var context,
            behaviors,
            bindings,
            children,
            i,
            ii;
        if (systemUpdate && !this.systemControlled) {
          context = this.executionContext || executionContext;
        } else {
          context = executionContext || this.executionContext;
        }
        if (this.isBound) {
          if (this.executionContext === context) {
            return ;
          }
          this.unbind();
        }
        this.isBound = true;
        this.executionContext = context;
        if (this.owner) {
          this.owner.bind(context);
        }
        bindings = this.bindings;
        for (i = 0, ii = bindings.length; i < ii; ++i) {
          bindings[i].bind(context);
        }
        behaviors = this.behaviors;
        for (i = 0, ii = behaviors.length; i < ii; ++i) {
          behaviors[i].bind(context);
        }
        children = this.children;
        for (i = 0, ii = children.length; i < ii; ++i) {
          children[i].bind(context, true);
        }
      };
      View.prototype.addBinding = function addBinding(binding) {
        this.bindings.push(binding);
        if (this.isBound) {
          binding.bind(this.executionContext);
        }
      };
      View.prototype.unbind = function unbind() {
        var behaviors,
            bindings,
            children,
            i,
            ii;
        if (this.isBound) {
          this.isBound = false;
          if (this.owner) {
            this.owner.unbind();
          }
          bindings = this.bindings;
          for (i = 0, ii = bindings.length; i < ii; ++i) {
            bindings[i].unbind();
          }
          behaviors = this.behaviors;
          for (i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].unbind();
          }
          children = this.children;
          for (i = 0, ii = children.length; i < ii; ++i) {
            children[i].unbind();
          }
        }
      };
      View.prototype.insertNodesBefore = function insertNodesBefore(refNode) {
        var parent = refNode.parentNode;
        parent.insertBefore(this.fragment, refNode);
      };
      View.prototype.appendNodesTo = function appendNodesTo(parent) {
        parent.appendChild(this.fragment);
      };
      View.prototype.removeNodes = function removeNodes() {
        var start = this.firstChild,
            end = this.lastChild,
            fragment = this.fragment,
            next;
        var current = start,
            loop = true,
            nodes = [];
        while (loop) {
          if (current === end) {
            loop = false;
          }
          next = current.nextSibling;
          this.fragment.appendChild(current);
          current = next;
        }
      };
      View.prototype.attached = function attached() {
        var behaviors,
            children,
            i,
            ii;
        if (this.isAttached) {
          return ;
        }
        this.isAttached = true;
        if (this.owner) {
          this.owner.attached();
        }
        behaviors = this.behaviors;
        for (i = 0, ii = behaviors.length; i < ii; ++i) {
          behaviors[i].attached();
        }
        children = this.children;
        for (i = 0, ii = children.length; i < ii; ++i) {
          children[i].attached();
        }
      };
      View.prototype.detached = function detached() {
        var behaviors,
            children,
            i,
            ii;
        if (this.isAttached) {
          this.isAttached = false;
          if (this.owner) {
            this.owner.detached();
          }
          behaviors = this.behaviors;
          for (i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].detached();
          }
          children = this.children;
          for (i = 0, ii = children.length; i < ii; ++i) {
            children[i].detached();
          }
        }
      };
      return View;
    })();
    exports.View = View;
    if (Element && !Element.prototype.matches) {
      var proto = Element.prototype;
      proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
    }
    var placeholder = [];
    function findInsertionPoint(groups, index) {
      var insertionPoint;
      while (!insertionPoint && index >= 0) {
        insertionPoint = groups[index][0];
        index--;
      }
      return insertionPoint;
    }
    var ContentSelector = (function() {
      function ContentSelector(anchor, selector) {
        _classCallCheck(this, ContentSelector);
        this.anchor = anchor;
        this.selector = selector;
        this.all = !this.selector;
        this.groups = [];
      }
      ContentSelector.applySelectors = function applySelectors(view, contentSelectors, callback) {
        var currentChild = view.fragment.firstChild,
            contentMap = new Map(),
            nextSibling,
            i,
            ii,
            contentSelector;
        while (currentChild) {
          nextSibling = currentChild.nextSibling;
          if (currentChild.viewSlot) {
            var viewSlotSelectors = contentSelectors.map(function(x) {
              return x.copyForViewSlot();
            });
            currentChild.viewSlot.installContentSelectors(viewSlotSelectors);
          } else {
            for (i = 0, ii = contentSelectors.length; i < ii; i++) {
              contentSelector = contentSelectors[i];
              if (contentSelector.matches(currentChild)) {
                var elements = contentMap.get(contentSelector);
                if (!elements) {
                  elements = [];
                  contentMap.set(contentSelector, elements);
                }
                elements.push(currentChild);
                break;
              }
            }
          }
          currentChild = nextSibling;
        }
        for (i = 0, ii = contentSelectors.length; i < ii; ++i) {
          contentSelector = contentSelectors[i];
          callback(contentSelector, contentMap.get(contentSelector) || placeholder);
        }
      };
      ContentSelector.prototype.copyForViewSlot = function copyForViewSlot() {
        return new ContentSelector(this.anchor, this.selector);
      };
      ContentSelector.prototype.matches = function matches(node) {
        return this.all || node.nodeType === 1 && node.matches(this.selector);
      };
      ContentSelector.prototype.add = function add(group) {
        var anchor = this.anchor,
            parent = anchor.parentNode,
            i,
            ii;
        for (i = 0, ii = group.length; i < ii; ++i) {
          parent.insertBefore(group[i], anchor);
        }
        this.groups.push(group);
      };
      ContentSelector.prototype.insert = function insert(index, group) {
        if (group.length) {
          var anchor = findInsertionPoint(this.groups, index) || this.anchor,
              parent = anchor.parentNode,
              i,
              ii;
          for (i = 0, ii = group.length; i < ii; ++i) {
            parent.insertBefore(group[i], anchor);
          }
        }
        this.groups.splice(index, 0, group);
      };
      ContentSelector.prototype.removeAt = function removeAt(index, fragment) {
        var group = this.groups[index],
            i,
            ii;
        for (i = 0, ii = group.length; i < ii; ++i) {
          fragment.appendChild(group[i]);
        }
        this.groups.splice(index, 1);
      };
      return ContentSelector;
    })();
    exports.ContentSelector = ContentSelector;
    function getAnimatableElement(view) {
      var firstChild = view.firstChild;
      if (firstChild !== null && firstChild !== undefined && firstChild.nodeType === 8) {
        var element = nextElementSibling(firstChild);
        if (element !== null && element !== undefined && element.nodeType === 1 && element.classList.contains('au-animate')) {
          return element;
        }
      }
      return null;
    }
    var ViewSlot = (function() {
      function ViewSlot(anchor, anchorIsContainer, executionContext) {
        var animator = arguments[3] === undefined ? Animator.instance : arguments[3];
        _classCallCheck(this, ViewSlot);
        this.anchor = anchor;
        this.viewAddMethod = anchorIsContainer ? 'appendNodesTo' : 'insertNodesBefore';
        this.executionContext = executionContext;
        this.animator = animator;
        this.children = [];
        this.isBound = false;
        this.isAttached = false;
        anchor.viewSlot = this;
      }
      ViewSlot.prototype.transformChildNodesIntoView = function transformChildNodesIntoView() {
        var parent = this.anchor;
        this.children.push({
          fragment: parent,
          firstChild: parent.firstChild,
          lastChild: parent.lastChild,
          removeNodes: function removeNodes() {
            var last;
            while (last = parent.lastChild) {
              parent.removeChild(last);
            }
          },
          created: function created() {},
          bind: function bind() {},
          unbind: function unbind() {},
          attached: function attached() {},
          detached: function detached() {}
        });
      };
      ViewSlot.prototype.bind = function bind(executionContext) {
        var i,
            ii,
            children;
        if (this.isBound) {
          if (this.executionContext === executionContext) {
            return ;
          }
          this.unbind();
        }
        this.isBound = true;
        this.executionContext = executionContext = executionContext || this.executionContext;
        children = this.children;
        for (i = 0, ii = children.length; i < ii; ++i) {
          children[i].bind(executionContext, true);
        }
      };
      ViewSlot.prototype.unbind = function unbind() {
        var i,
            ii,
            children = this.children;
        this.isBound = false;
        for (i = 0, ii = children.length; i < ii; ++i) {
          children[i].unbind();
        }
      };
      ViewSlot.prototype.add = function add(view) {
        view[this.viewAddMethod](this.anchor);
        this.children.push(view);
        if (this.isAttached) {
          view.attached();
          var animatableElement = getAnimatableElement(view);
          if (animatableElement !== null) {
            return this.animator.enter(animatableElement);
          }
        }
      };
      ViewSlot.prototype.insert = function insert(index, view) {
        var children = this.children,
            length = children.length;
        if (index === 0 && length === 0 || index >= length) {
          return this.add(view);
        } else {
          view.insertNodesBefore(children[index].firstChild);
          children.splice(index, 0, view);
          if (this.isAttached) {
            view.attached();
            var animatableElement = getAnimatableElement(view);
            if (animatableElement !== null) {
              return this.animator.enter(animatableElement);
            }
          }
        }
      };
      ViewSlot.prototype.remove = function remove(view) {
        return this.removeAt(this.children.indexOf(view));
      };
      ViewSlot.prototype.removeAt = function removeAt(index) {
        var _this = this;
        var view = this.children[index];
        var removeAction = function removeAction() {
          view.removeNodes();
          _this.children.splice(index, 1);
          if (_this.isAttached) {
            view.detached();
          }
          return view;
        };
        var animatableElement = getAnimatableElement(view);
        if (animatableElement !== null) {
          return this.animator.leave(animatableElement).then(function() {
            return removeAction();
          });
        }
        return removeAction();
      };
      ViewSlot.prototype.removeAll = function removeAll() {
        var _this2 = this;
        var children = this.children,
            ii = children.length,
            i;
        var rmPromises = [];
        children.forEach(function(child) {
          var animatableElement = getAnimatableElement(child);
          if (animatableElement !== null) {
            rmPromises.push(_this2.animator.leave(animatableElement).then(function() {
              return child.removeNodes();
            }));
          } else {
            child.removeNodes();
          }
        });
        var removeAction = function removeAction() {
          if (_this2.isAttached) {
            for (i = 0; i < ii; ++i) {
              children[i].detached();
            }
          }
          _this2.children = [];
        };
        if (rmPromises.length > 0) {
          return Promise.all(rmPromises).then(function() {
            return removeAction();
          });
        } else {
          removeAction();
        }
      };
      ViewSlot.prototype.swap = function swap(view) {
        var _this3 = this;
        var removeResponse = this.removeAll();
        if (removeResponse !== undefined) {
          return removeResponse.then(function() {
            return _this3.add(view);
          });
        } else {
          return this.add(view);
        }
      };
      ViewSlot.prototype.attached = function attached() {
        var i,
            ii,
            children,
            child;
        if (this.isAttached) {
          return ;
        }
        this.isAttached = true;
        children = this.children;
        for (i = 0, ii = children.length; i < ii; ++i) {
          child = children[i];
          child.attached();
          var element = child.firstChild ? nextElementSibling(child.firstChild) : null;
          if (child.firstChild && child.firstChild.nodeType === 8 && element && element.nodeType === 1 && element.classList.contains('au-animate')) {
            this.animator.enter(element);
          }
        }
      };
      ViewSlot.prototype.detached = function detached() {
        var i,
            ii,
            children;
        if (this.isAttached) {
          this.isAttached = false;
          children = this.children;
          for (i = 0, ii = children.length; i < ii; ++i) {
            children[i].detached();
          }
        }
      };
      ViewSlot.prototype.installContentSelectors = function installContentSelectors(contentSelectors) {
        this.contentSelectors = contentSelectors;
        this.add = this.contentSelectorAdd;
        this.insert = this.contentSelectorInsert;
        this.remove = this.contentSelectorRemove;
        this.removeAt = this.contentSelectorRemoveAt;
        this.removeAll = this.contentSelectorRemoveAll;
      };
      ViewSlot.prototype.contentSelectorAdd = function contentSelectorAdd(view) {
        ContentSelector.applySelectors(view, this.contentSelectors, function(contentSelector, group) {
          return contentSelector.add(group);
        });
        this.children.push(view);
        if (this.isAttached) {
          view.attached();
        }
      };
      ViewSlot.prototype.contentSelectorInsert = function contentSelectorInsert(index, view) {
        if (index === 0 && !this.children.length || index >= this.children.length) {
          this.add(view);
        } else {
          ContentSelector.applySelectors(view, this.contentSelectors, function(contentSelector, group) {
            return contentSelector.insert(index, group);
          });
          this.children.splice(index, 0, view);
          if (this.isAttached) {
            view.attached();
          }
        }
      };
      ViewSlot.prototype.contentSelectorRemove = function contentSelectorRemove(view) {
        var index = this.children.indexOf(view),
            contentSelectors = this.contentSelectors,
            i,
            ii;
        for (i = 0, ii = contentSelectors.length; i < ii; ++i) {
          contentSelectors[i].removeAt(index, view.fragment);
        }
        this.children.splice(index, 1);
        if (this.isAttached) {
          view.detached();
        }
      };
      ViewSlot.prototype.contentSelectorRemoveAt = function contentSelectorRemoveAt(index) {
        var view = this.children[index],
            contentSelectors = this.contentSelectors,
            i,
            ii;
        for (i = 0, ii = contentSelectors.length; i < ii; ++i) {
          contentSelectors[i].removeAt(index, view.fragment);
        }
        this.children.splice(index, 1);
        if (this.isAttached) {
          view.detached();
        }
        return view;
      };
      ViewSlot.prototype.contentSelectorRemoveAll = function contentSelectorRemoveAll() {
        var children = this.children,
            contentSelectors = this.contentSelectors,
            ii = children.length,
            jj = contentSelectors.length,
            i,
            j,
            view;
        for (i = 0; i < ii; ++i) {
          view = children[i];
          for (j = 0; j < jj; ++j) {
            contentSelectors[j].removeAt(i, view.fragment);
          }
        }
        if (this.isAttached) {
          for (i = 0; i < ii; ++i) {
            children[i].detached();
          }
        }
        this.children = [];
      };
      return ViewSlot;
    })();
    exports.ViewSlot = ViewSlot;
    function elementContainerGet(key) {
      if (key === Element) {
        return this.element;
      }
      if (key === BoundViewFactory) {
        if (this.boundViewFactory) {
          return this.boundViewFactory;
        }
        var factory = this.instruction.viewFactory,
            partReplacements = this.partReplacements;
        if (partReplacements) {
          factory = partReplacements[factory.part] || factory;
        }
        return this.boundViewFactory = new BoundViewFactory(this, factory, this.executionContext, partReplacements);
      }
      if (key === ViewSlot) {
        if (this.viewSlot === undefined) {
          this.viewSlot = new ViewSlot(this.element, this.instruction.anchorIsContainer, this.executionContext);
          this.children.push(this.viewSlot);
        }
        return this.viewSlot;
      }
      if (key === ViewResources) {
        return this.viewResources;
      }
      return this.superGet(key);
    }
    function createElementContainer(parent, element, instruction, executionContext, children, partReplacements, resources) {
      var container = parent.createChild(),
          providers,
          i;
      container.element = element;
      container.instruction = instruction;
      container.executionContext = executionContext;
      container.children = children;
      container.viewResources = resources;
      container.partReplacements = partReplacements;
      providers = instruction.providers;
      i = providers.length;
      while (i--) {
        container.registerSingleton(providers[i]);
      }
      container.superGet = container.get;
      container.get = elementContainerGet;
      return container;
    }
    function makeElementIntoAnchor(element, isCustomElement) {
      var anchor = document.createComment('anchor');
      if (isCustomElement) {
        anchor.hasAttribute = function(name) {
          return element.hasAttribute(name);
        };
        anchor.getAttribute = function(name) {
          return element.getAttribute(name);
        };
        anchor.setAttribute = function(name, value) {
          element.setAttribute(name, value);
        };
      }
      element.parentNode.replaceChild(anchor, element);
      return anchor;
    }
    function applyInstructions(containers, executionContext, element, instruction, behaviors, bindings, children, contentSelectors, partReplacements, resources) {
      var behaviorInstructions = instruction.behaviorInstructions,
          expressions = instruction.expressions,
          elementContainer,
          i,
          ii,
          current,
          instance;
      if (instruction.contentExpression) {
        bindings.push(instruction.contentExpression.createBinding(element.nextSibling));
        element.parentNode.removeChild(element);
        return ;
      }
      if (instruction.contentSelector) {
        var commentAnchor = document.createComment('anchor');
        element.parentNode.replaceChild(commentAnchor, element);
        contentSelectors.push(new ContentSelector(commentAnchor, instruction.selector));
        return ;
      }
      if (behaviorInstructions.length) {
        if (!instruction.anchorIsContainer) {
          element = makeElementIntoAnchor(element, instruction.isCustomElement);
        }
        containers[instruction.injectorId] = elementContainer = createElementContainer(containers[instruction.parentInjectorId], element, instruction, executionContext, children, partReplacements, resources);
        for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
          current = behaviorInstructions[i];
          instance = current.type.create(elementContainer, current, element, bindings, current.partReplacements);
          if (instance.contentView) {
            children.push(instance.contentView);
          }
          behaviors.push(instance);
        }
      }
      for (i = 0, ii = expressions.length; i < ii; ++i) {
        bindings.push(expressions[i].createBinding(element));
      }
    }
    function styleStringToObject(style, target) {
      var attributes = style.split(';'),
          firstIndexOfColon,
          i,
          current,
          key,
          value;
      target = target || {};
      for (i = 0; i < attributes.length; i++) {
        current = attributes[i];
        firstIndexOfColon = current.indexOf(':');
        key = current.substring(0, firstIndexOfColon).trim();
        value = current.substring(firstIndexOfColon + 1).trim();
        target[key] = value;
      }
      return target;
    }
    function styleObjectToString(obj) {
      var result = '';
      for (var key in obj) {
        result += key + ':' + obj[key] + ';';
      }
      return result;
    }
    function applySurrogateInstruction(container, element, instruction, behaviors, bindings, children) {
      var behaviorInstructions = instruction.behaviorInstructions,
          expressions = instruction.expressions,
          providers = instruction.providers,
          values = instruction.values,
          i = undefined,
          ii = undefined,
          current = undefined,
          instance = undefined,
          currentAttributeValue = undefined,
          styleParts = undefined;
      i = providers.length;
      while (i--) {
        container.registerSingleton(providers[i]);
      }
      for (var key in values) {
        currentAttributeValue = element.getAttribute(key);
        if (currentAttributeValue) {
          if (key === 'class') {
            if (currentAttributeValue !== 'au-target') {
              element.setAttribute('class', currentAttributeValue + ' ' + values[key]);
            }
          } else if (key === 'style') {
            var styleObject = styleStringToObject(values[key]);
            styleStringToObject(currentAttributeValue, styleObject);
            element.setAttribute('style', styleObjectToString(styleObject));
          }
        } else {
          element.setAttribute(key, values[key]);
        }
      }
      if (behaviorInstructions.length) {
        for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
          current = behaviorInstructions[i];
          instance = current.type.create(container, current, element, bindings, current.partReplacements);
          if (instance.contentView) {
            children.push(instance.contentView);
          }
          behaviors.push(instance);
        }
      }
      for (i = 0, ii = expressions.length; i < ii; ++i) {
        bindings.push(expressions[i].createBinding(element));
      }
    }
    var BoundViewFactory = (function() {
      function BoundViewFactory(parentContainer, viewFactory, executionContext, partReplacements) {
        _classCallCheck(this, BoundViewFactory);
        this.parentContainer = parentContainer;
        this.viewFactory = viewFactory;
        this.executionContext = executionContext;
        this.factoryOptions = {
          behaviorInstance: false,
          partReplacements: partReplacements
        };
      }
      BoundViewFactory.prototype.create = function create(executionContext) {
        var childContainer = this.parentContainer.createChild(),
            context = executionContext || this.executionContext;
        this.factoryOptions.systemControlled = !executionContext;
        return this.viewFactory.create(childContainer, context, this.factoryOptions);
      };
      return BoundViewFactory;
    })();
    exports.BoundViewFactory = BoundViewFactory;
    var defaultFactoryOptions = {
      systemControlled: false,
      suppressBind: false
    };
    var ViewFactory = (function() {
      function ViewFactory(template, instructions, resources) {
        _classCallCheck(this, ViewFactory);
        this.template = template;
        this.instructions = instructions;
        this.resources = resources;
      }
      ViewFactory.prototype.create = function create(container, executionContext) {
        var options = arguments[2] === undefined ? defaultFactoryOptions : arguments[2];
        var element = arguments[3] === undefined ? null : arguments[3];
        var fragment = this.template.cloneNode(true),
            instructables = fragment.querySelectorAll('.au-target'),
            instructions = this.instructions,
            resources = this.resources,
            behaviors = [],
            bindings = [],
            children = [],
            contentSelectors = [],
            containers = {root: container},
            partReplacements = options.partReplacements,
            domBoundary = container.get(DOMBoundary),
            i,
            ii,
            view,
            instructable,
            instruction;
        if (element !== null && this.surrogateInstruction !== null) {
          applySurrogateInstruction(container, element, this.surrogateInstruction, behaviors, bindings, children);
        }
        for (i = 0, ii = instructables.length; i < ii; ++i) {
          instructable = instructables[i];
          instruction = instructions[instructable.getAttribute('au-target-id')];
          instructable.domBoundary = domBoundary;
          applyInstructions(containers, executionContext, instructable, instruction, behaviors, bindings, children, contentSelectors, partReplacements, resources);
        }
        view = new View(container, fragment, behaviors, bindings, children, options.systemControlled, contentSelectors);
        view.created(executionContext);
        if (!options.suppressBind) {
          view.bind(executionContext);
        }
        return view;
      };
      return ViewFactory;
    })();
    exports.ViewFactory = ViewFactory;
    var nextInjectorId = 0,
        defaultCompileOptions = {targetShadowDOM: false},
        hasShadowDOM = !!HTMLElement.prototype.createShadowRoot;
    function getNextInjectorId() {
      return ++nextInjectorId;
    }
    function configureProperties(instruction, resources) {
      var type = instruction.type,
          attrName = instruction.attrName,
          attributes = instruction.attributes,
          property,
          key,
          value;
      var knownAttribute = resources.mapAttribute(attrName);
      if (knownAttribute && attrName in attributes && knownAttribute !== attrName) {
        attributes[knownAttribute] = attributes[attrName];
        delete attributes[attrName];
      }
      for (key in attributes) {
        value = attributes[key];
        if (value !== null && typeof value === 'object') {
          property = type.attributes[key];
          if (property !== undefined) {
            value.targetProperty = property.name;
          } else {
            value.targetProperty = key;
          }
        }
      }
    }
    var lastAUTargetID = 0;
    function getNextAUTargetID() {
      return (++lastAUTargetID).toString();
    }
    function makeIntoInstructionTarget(element) {
      var value = element.getAttribute('class'),
          auTargetID = getNextAUTargetID();
      element.setAttribute('class', value ? value += ' au-target' : 'au-target');
      element.setAttribute('au-target-id', auTargetID);
      return auTargetID;
    }
    var ViewCompiler = (function() {
      function ViewCompiler(bindingLanguage) {
        _classCallCheck(this, ViewCompiler);
        this.bindingLanguage = bindingLanguage;
      }
      ViewCompiler.inject = function inject() {
        return [BindingLanguage];
      };
      ViewCompiler.prototype.compile = function compile(templateOrFragment, resources) {
        var options = arguments[2] === undefined ? defaultCompileOptions : arguments[2];
        var instructions = {},
            targetShadowDOM = options.targetShadowDOM,
            content,
            part,
            factory;
        targetShadowDOM = targetShadowDOM && hasShadowDOM;
        if (options.beforeCompile) {
          options.beforeCompile(templateOrFragment);
        }
        if (typeof templateOrFragment === 'string') {
          templateOrFragment = createTemplateFromMarkup(templateOrFragment);
        }
        if (templateOrFragment.content) {
          part = templateOrFragment.getAttribute('part');
          content = document.adoptNode(templateOrFragment.content, true);
        } else {
          content = templateOrFragment;
        }
        this.compileNode(content, resources, instructions, templateOrFragment, 'root', !targetShadowDOM);
        content.insertBefore(document.createComment('<view>'), content.firstChild);
        content.appendChild(document.createComment('</view>'));
        var factory = new ViewFactory(content, instructions, resources);
        factory.surrogateInstruction = options.compileSurrogate ? this.compileSurrogate(templateOrFragment, resources) : null;
        if (part) {
          factory.part = part;
        }
        return factory;
      };
      ViewCompiler.prototype.compileNode = function compileNode(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM) {
        switch (node.nodeType) {
          case 1:
            return this.compileElement(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM);
          case 3:
            var expression = this.bindingLanguage.parseText(resources, node.wholeText);
            if (expression) {
              var marker = document.createElement('au-marker'),
                  auTargetID = makeIntoInstructionTarget(marker);
              (node.parentNode || parentNode).insertBefore(marker, node);
              node.textContent = ' ';
              instructions[auTargetID] = {contentExpression: expression};
              while (node.nextSibling && node.nextSibling.nodeType === 3) {
                (node.parentNode || parentNode).removeChild(node.nextSibling);
              }
            } else {
              while (node.nextSibling && node.nextSibling.nodeType === 3) {
                node = node.nextSibling;
              }
            }
            return node.nextSibling;
          case 11:
            var currentChild = node.firstChild;
            while (currentChild) {
              currentChild = this.compileNode(currentChild, resources, instructions, node, parentInjectorId, targetLightDOM);
            }
            break;
        }
        return node.nextSibling;
      };
      ViewCompiler.prototype.compileSurrogate = function compileSurrogate(node, resources) {
        var attributes = node.attributes,
            bindingLanguage = this.bindingLanguage,
            knownAttribute = undefined,
            property = undefined,
            instruction = undefined,
            i = undefined,
            ii = undefined,
            attr = undefined,
            attrName = undefined,
            attrValue = undefined,
            info = undefined,
            type = undefined,
            expressions = [],
            expression = undefined,
            behaviorInstructions = [],
            values = {},
            hasValues = false,
            providers = [];
        for (i = 0, ii = attributes.length; i < ii; ++i) {
          attr = attributes[i];
          attrName = attr.name;
          attrValue = attr.value;
          info = bindingLanguage.inspectAttribute(resources, attrName, attrValue);
          type = resources.getAttribute(info.attrName);
          if (type) {
            knownAttribute = resources.mapAttribute(info.attrName);
            if (knownAttribute) {
              property = type.attributes[knownAttribute];
              if (property) {
                info.defaultBindingMode = property.defaultBindingMode;
                if (!info.command && !info.expression) {
                  info.command = property.hasOptions ? 'options' : null;
                }
              }
            }
          }
          instruction = bindingLanguage.createAttributeInstruction(resources, node, info);
          if (instruction) {
            if (instruction.alteredAttr) {
              type = resources.getAttribute(instruction.attrName);
            }
            if (instruction.discrete) {
              expressions.push(instruction);
            } else {
              if (type) {
                instruction.type = type;
                configureProperties(instruction, resources);
                if (type.liftsContent) {
                  throw new Error('You cannot place a template controller on a surrogate element.');
                } else {
                  behaviorInstructions.push(instruction);
                }
              } else {
                expressions.push(instruction.attributes[instruction.attrName]);
              }
            }
          } else {
            if (type) {
              instruction = {
                attrName: attrName,
                type: type,
                attributes: {}
              };
              instruction.attributes[resources.mapAttribute(attrName)] = attrValue;
              if (type.liftsContent) {
                throw new Error('You cannot place a template controller on a surrogate element.');
              } else {
                behaviorInstructions.push(instruction);
              }
            } else if (attrName !== 'id' && attrName !== 'part' && attrName !== 'replace-part') {
              hasValues = true;
              values[attrName] = attrValue;
            }
          }
        }
        if (expressions.length || behaviorInstructions.length || hasValues) {
          for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
            instruction = behaviorInstructions[i];
            instruction.type.compile(this, resources, node, instruction);
            providers.push(instruction.type.target);
          }
          for (i = 0, ii = expressions.length; i < ii; ++i) {
            expression = expressions[i];
            if (expression.attrToRemove !== undefined) {
              node.removeAttribute(expression.attrToRemove);
            }
          }
          return {
            anchorIsContainer: false,
            isCustomElement: false,
            injectorId: null,
            parentInjectorId: null,
            expressions: expressions,
            behaviorInstructions: behaviorInstructions,
            providers: providers,
            values: values
          };
        }
        return null;
      };
      ViewCompiler.prototype.compileElement = function compileElement(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM) {
        var tagName = node.tagName.toLowerCase(),
            attributes = node.attributes,
            expressions = [],
            expression,
            behaviorInstructions = [],
            providers = [],
            bindingLanguage = this.bindingLanguage,
            liftingInstruction,
            viewFactory,
            type,
            elementInstruction,
            elementProperty,
            i,
            ii,
            attr,
            attrName,
            attrValue,
            instruction,
            info,
            property,
            knownAttribute,
            auTargetID,
            injectorId;
        if (tagName === 'content') {
          if (targetLightDOM) {
            auTargetID = makeIntoInstructionTarget(node);
            instructions[auTargetID] = {
              parentInjectorId: parentInjectorId,
              contentSelector: true,
              selector: node.getAttribute('select'),
              suppressBind: true
            };
          }
          return node.nextSibling;
        } else if (tagName === 'template') {
          viewFactory = this.compile(node, resources);
          viewFactory.part = node.getAttribute('part');
        } else {
          type = resources.getElement(tagName);
          if (type) {
            elementInstruction = {
              type: type,
              attributes: {}
            };
            elementInstruction.anchorIsContainer = !node.hasAttribute('containerless') && !type.containerless;
            behaviorInstructions.push(elementInstruction);
          }
        }
        for (i = 0, ii = attributes.length; i < ii; ++i) {
          attr = attributes[i];
          attrName = attr.name;
          attrValue = attr.value;
          info = bindingLanguage.inspectAttribute(resources, attrName, attrValue);
          type = resources.getAttribute(info.attrName);
          elementProperty = null;
          if (type) {
            knownAttribute = resources.mapAttribute(info.attrName);
            if (knownAttribute) {
              property = type.attributes[knownAttribute];
              if (property) {
                info.defaultBindingMode = property.defaultBindingMode;
                if (!info.command && !info.expression) {
                  info.command = property.hasOptions ? 'options' : null;
                }
              }
            }
          } else if (elementInstruction) {
            elementProperty = elementInstruction.type.attributes[info.attrName];
            if (elementProperty) {
              info.defaultBindingMode = elementProperty.defaultBindingMode;
              if (!info.command && !info.expression) {
                info.command = elementProperty.hasOptions ? 'options' : null;
              }
            }
          }
          if (elementProperty) {
            instruction = bindingLanguage.createAttributeInstruction(resources, node, info, elementInstruction);
          } else {
            instruction = bindingLanguage.createAttributeInstruction(resources, node, info);
          }
          if (instruction) {
            if (instruction.alteredAttr) {
              type = resources.getAttribute(instruction.attrName);
            }
            if (instruction.discrete) {
              expressions.push(instruction);
            } else {
              if (type) {
                instruction.type = type;
                configureProperties(instruction, resources);
                if (type.liftsContent) {
                  instruction.originalAttrName = attrName;
                  liftingInstruction = instruction;
                  break;
                } else {
                  behaviorInstructions.push(instruction);
                }
              } else if (elementProperty) {
                elementInstruction.attributes[info.attrName].targetProperty = elementProperty.name;
              } else {
                expressions.push(instruction.attributes[instruction.attrName]);
              }
            }
          } else {
            if (type) {
              instruction = {
                attrName: attrName,
                type: type,
                attributes: {}
              };
              instruction.attributes[resources.mapAttribute(attrName)] = attrValue;
              if (type.liftsContent) {
                instruction.originalAttrName = attrName;
                liftingInstruction = instruction;
                break;
              } else {
                behaviorInstructions.push(instruction);
              }
            } else if (elementProperty) {
              elementInstruction.attributes[attrName] = attrValue;
            }
          }
        }
        if (liftingInstruction) {
          liftingInstruction.viewFactory = viewFactory;
          node = liftingInstruction.type.compile(this, resources, node, liftingInstruction, parentNode);
          auTargetID = makeIntoInstructionTarget(node);
          instructions[auTargetID] = {
            anchorIsContainer: false,
            parentInjectorId: parentInjectorId,
            expressions: [],
            behaviorInstructions: [liftingInstruction],
            viewFactory: liftingInstruction.viewFactory,
            providers: [liftingInstruction.type.target]
          };
        } else {
          if (expressions.length || behaviorInstructions.length) {
            injectorId = behaviorInstructions.length ? getNextInjectorId() : false;
            for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
              instruction = behaviorInstructions[i];
              instruction.type.compile(this, resources, node, instruction, parentNode);
              providers.push(instruction.type.target);
            }
            for (i = 0, ii = expressions.length; i < ii; ++i) {
              expression = expressions[i];
              if (expression.attrToRemove !== undefined) {
                node.removeAttribute(expression.attrToRemove);
              }
            }
            auTargetID = makeIntoInstructionTarget(node);
            instructions[auTargetID] = {
              anchorIsContainer: elementInstruction ? elementInstruction.anchorIsContainer : true,
              isCustomElement: !!elementInstruction,
              injectorId: injectorId,
              parentInjectorId: parentInjectorId,
              expressions: expressions,
              behaviorInstructions: behaviorInstructions,
              providers: providers
            };
          }
          if (elementInstruction && elementInstruction.type.skipContentProcessing) {
            return node.nextSibling;
          }
          var currentChild = node.firstChild;
          while (currentChild) {
            currentChild = this.compileNode(currentChild, resources, instructions, node, injectorId || parentInjectorId, targetLightDOM);
          }
        }
        return node.nextSibling;
      };
      return ViewCompiler;
    })();
    exports.ViewCompiler = ViewCompiler;
    var logger = _aureliaLogging.getLogger('templating');
    function ensureRegistryEntry(loader, urlOrRegistryEntry) {
      if (urlOrRegistryEntry instanceof _aureliaLoader.TemplateRegistryEntry) {
        return Promise.resolve(urlOrRegistryEntry);
      }
      return loader.loadTemplate(urlOrRegistryEntry);
    }
    var ProxyViewFactory = (function() {
      function ProxyViewFactory(promise) {
        var _this4 = this;
        _classCallCheck(this, ProxyViewFactory);
        promise.then(function(x) {
          return _this4.absorb(x);
        });
      }
      ProxyViewFactory.prototype.absorb = function absorb(factory) {
        this.create = factory.create.bind(factory);
      };
      return ProxyViewFactory;
    })();
    var ViewEngine = (function() {
      function ViewEngine(loader, container, viewCompiler, moduleAnalyzer, appResources) {
        _classCallCheck(this, ViewEngine);
        this.loader = loader;
        this.container = container;
        this.viewCompiler = viewCompiler;
        this.moduleAnalyzer = moduleAnalyzer;
        this.appResources = appResources;
      }
      ViewEngine.inject = function inject() {
        return [_aureliaLoader.Loader, _aureliaDependencyInjection.Container, ViewCompiler, ModuleAnalyzer, ResourceRegistry];
      };
      ViewEngine.prototype.loadViewFactory = function loadViewFactory(urlOrRegistryEntry, compileOptions, associatedModuleId, loadContext) {
        var _this5 = this;
        loadContext = loadContext || [];
        return ensureRegistryEntry(this.loader, urlOrRegistryEntry).then(function(viewRegistryEntry) {
          if (viewRegistryEntry.onReady) {
            if (loadContext.indexOf(urlOrRegistryEntry) === -1) {
              loadContext.push(urlOrRegistryEntry);
              return viewRegistryEntry.onReady;
            }
            return Promise.resolve(new ProxyViewFactory(viewRegistryEntry.onReady));
          }
          loadContext.push(urlOrRegistryEntry);
          return viewRegistryEntry.onReady = _this5.loadTemplateResources(viewRegistryEntry, associatedModuleId, loadContext).then(function(resources) {
            viewRegistryEntry.setResources(resources);
            var viewFactory = _this5.viewCompiler.compile(viewRegistryEntry.template, resources, compileOptions);
            viewRegistryEntry.setFactory(viewFactory);
            return viewFactory;
          });
        });
      };
      ViewEngine.prototype.loadTemplateResources = function loadTemplateResources(viewRegistryEntry, associatedModuleId, loadContext) {
        var resources = new ViewResources(this.appResources, viewRegistryEntry.id),
            dependencies = viewRegistryEntry.dependencies,
            importIds,
            names;
        if (dependencies.length === 0 && !associatedModuleId) {
          return Promise.resolve(resources);
        }
        importIds = dependencies.map(function(x) {
          return x.src;
        });
        names = dependencies.map(function(x) {
          return x.name;
        });
        logger.debug('importing resources for ' + viewRegistryEntry.id, importIds);
        return this.importViewResources(importIds, names, resources, associatedModuleId, loadContext);
      };
      ViewEngine.prototype.importViewModelResource = function importViewModelResource(moduleImport, moduleMember) {
        var _this6 = this;
        return this.loader.loadModule(moduleImport).then(function(viewModelModule) {
          var normalizedId = _aureliaMetadata.Origin.get(viewModelModule).moduleId,
              resourceModule = _this6.moduleAnalyzer.analyze(normalizedId, viewModelModule, moduleMember);
          if (!resourceModule.mainResource) {
            throw new Error('No view model found in module "' + moduleImport + '".');
          }
          resourceModule.analyze(_this6.container);
          return resourceModule.mainResource;
        });
      };
      ViewEngine.prototype.importViewResources = function importViewResources(moduleIds, names, resources, associatedModuleId, loadContext) {
        var _this7 = this;
        loadContext = loadContext || [];
        return this.loader.loadAllModules(moduleIds).then(function(imports) {
          var i,
              ii,
              analysis,
              normalizedId,
              current,
              associatedModule,
              container = _this7.container,
              moduleAnalyzer = _this7.moduleAnalyzer,
              allAnalysis = new Array(imports.length);
          for (i = 0, ii = imports.length; i < ii; ++i) {
            current = imports[i];
            normalizedId = _aureliaMetadata.Origin.get(current).moduleId;
            analysis = moduleAnalyzer.analyze(normalizedId, current);
            analysis.analyze(container);
            analysis.register(resources, names[i]);
            allAnalysis[i] = analysis;
          }
          if (associatedModuleId) {
            associatedModule = moduleAnalyzer.getAnalysis(associatedModuleId);
            if (associatedModule) {
              associatedModule.register(resources);
            }
          }
          for (i = 0, ii = allAnalysis.length; i < ii; ++i) {
            allAnalysis[i] = allAnalysis[i].load(container, loadContext);
          }
          return Promise.all(allAnalysis).then(function() {
            return resources;
          });
        });
      };
      return ViewEngine;
    })();
    exports.ViewEngine = ViewEngine;
    var BehaviorInstance = (function() {
      function BehaviorInstance(behavior, executionContext, instruction) {
        _classCallCheck(this, BehaviorInstance);
        this.behavior = behavior;
        this.executionContext = executionContext;
        this.isAttached = false;
        var observerLookup = behavior.observerLocator.getOrCreateObserversLookup(executionContext),
            handlesBind = behavior.handlesBind,
            attributes = instruction.attributes,
            boundProperties = this.boundProperties = [],
            properties = behavior.properties,
            i,
            ii;
        behavior.ensurePropertiesDefined(executionContext, observerLookup);
        for (i = 0, ii = properties.length; i < ii; ++i) {
          properties[i].initialize(executionContext, observerLookup, attributes, handlesBind, boundProperties);
        }
      }
      BehaviorInstance.createForUnitTest = function createForUnitTest(type, attributes, bindingContext) {
        var description = ResourceDescription.get(type);
        description.analyze(_aureliaDependencyInjection.Container.instance);
        var executionContext = _aureliaDependencyInjection.Container.instance.get(type);
        var behaviorInstance = new BehaviorInstance(description.metadata, executionContext, {attributes: attributes || {}});
        behaviorInstance.bind(bindingContext || {});
        return executionContext;
      };
      BehaviorInstance.prototype.created = function created(context) {
        if (this.behavior.handlesCreated) {
          this.executionContext.created(context);
        }
      };
      BehaviorInstance.prototype.bind = function bind(context) {
        var skipSelfSubscriber = this.behavior.handlesBind,
            boundProperties = this.boundProperties,
            i,
            ii,
            x,
            observer,
            selfSubscriber;
        for (i = 0, ii = boundProperties.length; i < ii; ++i) {
          x = boundProperties[i];
          observer = x.observer;
          selfSubscriber = observer.selfSubscriber;
          observer.publishing = false;
          if (skipSelfSubscriber) {
            observer.selfSubscriber = null;
          }
          x.binding.bind(context);
          observer.call();
          observer.publishing = true;
          observer.selfSubscriber = selfSubscriber;
        }
        if (skipSelfSubscriber) {
          this.executionContext.bind(context);
        }
        if (this.view) {
          this.view.bind(this.executionContext);
        }
      };
      BehaviorInstance.prototype.unbind = function unbind() {
        var boundProperties = this.boundProperties,
            i,
            ii;
        if (this.view) {
          this.view.unbind();
        }
        if (this.behavior.handlesUnbind) {
          this.executionContext.unbind();
        }
        for (i = 0, ii = boundProperties.length; i < ii; ++i) {
          boundProperties[i].binding.unbind();
        }
      };
      BehaviorInstance.prototype.attached = function attached() {
        if (this.isAttached) {
          return ;
        }
        this.isAttached = true;
        if (this.behavior.handlesAttached) {
          this.executionContext.attached();
        }
        if (this.view) {
          this.view.attached();
        }
      };
      BehaviorInstance.prototype.detached = function detached() {
        if (this.isAttached) {
          this.isAttached = false;
          if (this.view) {
            this.view.detached();
          }
          if (this.behavior.handlesDetached) {
            this.executionContext.detached();
          }
        }
      };
      return BehaviorInstance;
    })();
    exports.BehaviorInstance = BehaviorInstance;
    function getObserver(behavior, instance, name) {
      var lookup = instance.__observers__;
      if (lookup === undefined) {
        lookup = behavior.observerLocator.getOrCreateObserversLookup(instance);
        behavior.ensurePropertiesDefined(instance, lookup);
      }
      return lookup[name];
    }
    var BindableProperty = (function() {
      function BindableProperty(nameOrConfig) {
        _classCallCheck(this, BindableProperty);
        if (typeof nameOrConfig === 'string') {
          this.name = nameOrConfig;
        } else {
          Object.assign(this, nameOrConfig);
        }
        this.attribute = this.attribute || hyphenate(this.name);
        this.defaultBindingMode = this.defaultBindingMode || _aureliaBinding.bindingMode.oneWay;
        this.changeHandler = this.changeHandler || null;
        this.owner = null;
      }
      BindableProperty.prototype.registerWith = function registerWith(target, behavior, descriptor) {
        behavior.properties.push(this);
        behavior.attributes[this.attribute] = this;
        this.owner = behavior;
        if (descriptor) {
          this.descriptor = descriptor;
          return this.configureDescriptor(behavior, descriptor);
        }
      };
      BindableProperty.prototype.configureDescriptor = function configureDescriptor(behavior, descriptor) {
        var name = this.name;
        descriptor.configurable = true;
        descriptor.enumerable = true;
        if ('initializer' in descriptor) {
          this.defaultValue = descriptor.initializer;
          delete descriptor.initializer;
          delete descriptor.writable;
        }
        if ('value' in descriptor) {
          this.defaultValue = descriptor.value;
          delete descriptor.value;
          delete descriptor.writable;
        }
        descriptor.get = function() {
          return getObserver(behavior, this, name).getValue();
        };
        descriptor.set = function(value) {
          getObserver(behavior, this, name).setValue(value);
        };
        descriptor.get.getObserver = function(obj) {
          return getObserver(behavior, obj, name);
        };
        return descriptor;
      };
      BindableProperty.prototype.defineOn = function defineOn(target, behavior) {
        var name = this.name,
            handlerName;
        if (this.changeHandler === null) {
          handlerName = name + 'Changed';
          if (handlerName in target.prototype) {
            this.changeHandler = handlerName;
          }
        }
        if (!this.descriptor) {
          Object.defineProperty(target.prototype, name, this.configureDescriptor(behavior, {}));
        }
      };
      BindableProperty.prototype.createObserver = function createObserver(executionContext) {
        var selfSubscriber = null,
            defaultValue = this.defaultValue,
            changeHandlerName = this.changeHandler,
            name = this.name,
            initialValue;
        if (this.hasOptions) {
          return ;
        }
        if (changeHandlerName in executionContext) {
          if ('propertyChanged' in executionContext) {
            selfSubscriber = function(newValue, oldValue) {
              executionContext[changeHandlerName](newValue, oldValue);
              executionContext.propertyChanged(name, newValue, oldValue);
            };
          } else {
            selfSubscriber = function(newValue, oldValue) {
              return executionContext[changeHandlerName](newValue, oldValue);
            };
          }
        } else if ('propertyChanged' in executionContext) {
          selfSubscriber = function(newValue, oldValue) {
            return executionContext.propertyChanged(name, newValue, oldValue);
          };
        } else if (changeHandlerName !== null) {
          throw new Error('Change handler ' + changeHandlerName + ' was specified but not delcared on the class.');
        }
        if (defaultValue !== undefined) {
          initialValue = typeof defaultValue === 'function' ? defaultValue.call(executionContext) : defaultValue;
        }
        return new BehaviorPropertyObserver(this.owner.taskQueue, executionContext, this.name, selfSubscriber, initialValue);
      };
      BindableProperty.prototype.initialize = function initialize(executionContext, observerLookup, attributes, behaviorHandlesBind, boundProperties) {
        var selfSubscriber,
            observer,
            attribute,
            defaultValue = this.defaultValue;
        if (this.isDynamic) {
          for (var key in attributes) {
            this.createDynamicProperty(executionContext, observerLookup, behaviorHandlesBind, key, attributes[key], boundProperties);
          }
        } else if (!this.hasOptions) {
          observer = observerLookup[this.name];
          if (attributes !== undefined) {
            selfSubscriber = observer.selfSubscriber;
            attribute = attributes[this.attribute];
            if (behaviorHandlesBind) {
              observer.selfSubscriber = null;
            }
            if (typeof attribute === 'string') {
              executionContext[this.name] = attribute;
              observer.call();
            } else if (attribute) {
              boundProperties.push({
                observer: observer,
                binding: attribute.createBinding(executionContext)
              });
            } else if (defaultValue !== undefined) {
              observer.call();
            }
            observer.selfSubscriber = selfSubscriber;
          }
          observer.publishing = true;
        }
      };
      BindableProperty.prototype.createDynamicProperty = function createDynamicProperty(executionContext, observerLookup, behaviorHandlesBind, name, attribute, boundProperties) {
        var changeHandlerName = name + 'Changed',
            selfSubscriber = null,
            observer,
            info;
        if (changeHandlerName in executionContext) {
          if ('propertyChanged' in executionContext) {
            selfSubscriber = function(newValue, oldValue) {
              executionContext[changeHandlerName](newValue, oldValue);
              executionContext.propertyChanged(name, newValue, oldValue);
            };
          } else {
            selfSubscriber = function(newValue, oldValue) {
              return executionContext[changeHandlerName](newValue, oldValue);
            };
          }
        } else if ('propertyChanged' in executionContext) {
          selfSubscriber = function(newValue, oldValue) {
            return executionContext.propertyChanged(name, newValue, oldValue);
          };
        }
        observer = observerLookup[name] = new BehaviorPropertyObserver(this.owner.taskQueue, executionContext, name, selfSubscriber);
        Object.defineProperty(executionContext, name, {
          configurable: true,
          enumerable: true,
          get: observer.getValue.bind(observer),
          set: observer.setValue.bind(observer)
        });
        if (behaviorHandlesBind) {
          observer.selfSubscriber = null;
        }
        if (typeof attribute === 'string') {
          executionContext[name] = attribute;
          observer.call();
        } else if (attribute) {
          info = {
            observer: observer,
            binding: attribute.createBinding(executionContext)
          };
          boundProperties.push(info);
        }
        observer.publishing = true;
        observer.selfSubscriber = selfSubscriber;
      };
      return BindableProperty;
    })();
    exports.BindableProperty = BindableProperty;
    var BehaviorPropertyObserver = (function() {
      function BehaviorPropertyObserver(taskQueue, obj, propertyName, selfSubscriber, initialValue) {
        _classCallCheck(this, BehaviorPropertyObserver);
        this.taskQueue = taskQueue;
        this.obj = obj;
        this.propertyName = propertyName;
        this.callbacks = [];
        this.notqueued = true;
        this.publishing = false;
        this.selfSubscriber = selfSubscriber;
        this.currentValue = this.oldValue = initialValue;
      }
      BehaviorPropertyObserver.prototype.getValue = function getValue() {
        return this.currentValue;
      };
      BehaviorPropertyObserver.prototype.setValue = function setValue(newValue) {
        var oldValue = this.currentValue;
        if (oldValue !== newValue) {
          if (this.publishing && this.notqueued) {
            this.notqueued = false;
            this.taskQueue.queueMicroTask(this);
          }
          this.oldValue = oldValue;
          this.currentValue = newValue;
        }
      };
      BehaviorPropertyObserver.prototype.call = function call() {
        var callbacks = this.callbacks,
            i = callbacks.length,
            oldValue = this.oldValue,
            newValue = this.currentValue;
        this.notqueued = true;
        if (newValue !== oldValue) {
          if (this.selfSubscriber !== null) {
            this.selfSubscriber(newValue, oldValue);
          }
          while (i--) {
            callbacks[i](newValue, oldValue);
          }
          this.oldValue = newValue;
        }
      };
      BehaviorPropertyObserver.prototype.subscribe = function subscribe(callback) {
        var callbacks = this.callbacks;
        callbacks.push(callback);
        return function() {
          callbacks.splice(callbacks.indexOf(callback), 1);
        };
      };
      return BehaviorPropertyObserver;
    })();
    var defaultInstruction = {suppressBind: false},
        contentSelectorFactoryOptions = {suppressBind: true},
        hasShadowDOM = !!HTMLElement.prototype.createShadowRoot;
    function doProcessContent() {
      return true;
    }
    var HtmlBehaviorResource = (function() {
      function HtmlBehaviorResource() {
        _classCallCheck(this, HtmlBehaviorResource);
        this.elementName = null;
        this.attributeName = null;
        this.attributeDefaultBindingMode = undefined;
        this.liftsContent = false;
        this.targetShadowDOM = false;
        this.processContent = doProcessContent;
        this.usesShadowDOM = false;
        this.childBindings = null;
        this.hasDynamicOptions = false;
        this.containerless = false;
        this.properties = [];
        this.attributes = {};
      }
      HtmlBehaviorResource.convention = function convention(name, existing) {
        var behavior;
        if (name.endsWith('CustomAttribute')) {
          behavior = existing || new HtmlBehaviorResource();
          behavior.attributeName = hyphenate(name.substring(0, name.length - 15));
        }
        if (name.endsWith('CustomElement')) {
          behavior = existing || new HtmlBehaviorResource();
          behavior.elementName = hyphenate(name.substring(0, name.length - 13));
        }
        return behavior;
      };
      HtmlBehaviorResource.prototype.addChildBinding = function addChildBinding(behavior) {
        if (this.childBindings === null) {
          this.childBindings = [];
        }
        this.childBindings.push(behavior);
      };
      HtmlBehaviorResource.prototype.analyze = function analyze(container, target) {
        var proto = target.prototype,
            properties = this.properties,
            attributeName = this.attributeName,
            attributeDefaultBindingMode = this.attributeDefaultBindingMode,
            i,
            ii,
            current;
        this.observerLocator = container.get(_aureliaBinding.ObserverLocator);
        this.taskQueue = container.get(_aureliaTaskQueue.TaskQueue);
        this.target = target;
        this.usesShadowDOM = this.targetShadowDOM && hasShadowDOM;
        this.handlesCreated = 'created' in proto;
        this.handlesBind = 'bind' in proto;
        this.handlesUnbind = 'unbind' in proto;
        this.handlesAttached = 'attached' in proto;
        this.handlesDetached = 'detached' in proto;
        this.htmlName = this.elementName || this.attributeName;
        this.apiName = this.htmlName.replace(/-([a-z])/g, function(m, w) {
          return w.toUpperCase();
        });
        if (attributeName !== null) {
          if (properties.length === 0) {
            new BindableProperty({
              name: 'value',
              changeHandler: 'valueChanged' in proto ? 'valueChanged' : null,
              attribute: attributeName,
              defaultBindingMode: attributeDefaultBindingMode
            }).registerWith(target, this);
          }
          current = properties[0];
          if (properties.length === 1 && current.name === 'value') {
            current.isDynamic = current.hasOptions = this.hasDynamicOptions;
            current.defineOn(target, this);
          } else {
            for (i = 0, ii = properties.length; i < ii; ++i) {
              properties[i].defineOn(target, this);
            }
            current = new BindableProperty({
              name: 'value',
              changeHandler: 'valueChanged' in proto ? 'valueChanged' : null,
              attribute: attributeName,
              defaultBindingMode: attributeDefaultBindingMode
            });
            current.hasOptions = true;
            current.registerWith(target, this);
          }
        } else {
          for (i = 0, ii = properties.length; i < ii; ++i) {
            properties[i].defineOn(target, this);
          }
        }
      };
      HtmlBehaviorResource.prototype.load = function load(container, target, viewStrategy, transientView, loadContext) {
        var _this8 = this;
        var options;
        if (this.elementName !== null) {
          viewStrategy = viewStrategy || this.viewStrategy || ViewStrategy.getDefault(target);
          options = {
            targetShadowDOM: this.targetShadowDOM,
            beforeCompile: target.beforeCompile,
            compileSurrogate: true
          };
          if (!viewStrategy.moduleId) {
            viewStrategy.moduleId = _aureliaMetadata.Origin.get(target).moduleId;
          }
          return viewStrategy.loadViewFactory(container.get(ViewEngine), options, loadContext).then(function(viewFactory) {
            if (!transientView || !_this8.viewFactory) {
              _this8.viewFactory = viewFactory;
            }
            return viewFactory;
          });
        }
        return Promise.resolve(this);
      };
      HtmlBehaviorResource.prototype.register = function register(registry, name) {
        if (this.attributeName !== null) {
          registry.registerAttribute(name || this.attributeName, this, this.attributeName);
        }
        if (this.elementName !== null) {
          registry.registerElement(name || this.elementName, this);
        }
      };
      HtmlBehaviorResource.prototype.compile = function compile(compiler, resources, node, instruction, parentNode) {
        if (this.liftsContent) {
          if (!instruction.viewFactory) {
            var template = document.createElement('template'),
                fragment = document.createDocumentFragment(),
                part = node.getAttribute('part');
            node.removeAttribute(instruction.originalAttrName);
            if (node.parentNode) {
              node.parentNode.replaceChild(template, node);
            } else if (window.ShadowDOMPolyfill) {
              ShadowDOMPolyfill.unwrap(parentNode).replaceChild(ShadowDOMPolyfill.unwrap(template), ShadowDOMPolyfill.unwrap(node));
            } else {
              parentNode.replaceChild(template, node);
            }
            fragment.appendChild(node);
            instruction.viewFactory = compiler.compile(fragment, resources);
            if (part) {
              instruction.viewFactory.part = part;
              node.removeAttribute('part');
            }
            node = template;
          }
        } else if (this.elementName !== null) {
          var partReplacements = instruction.partReplacements = {};
          if (this.processContent(compiler, resources, node, instruction) && node.hasChildNodes()) {
            if (!this.usesShadowDOM) {
              var fragment = document.createDocumentFragment(),
                  currentChild = node.firstChild,
                  nextSibling;
              while (currentChild) {
                nextSibling = currentChild.nextSibling;
                if (currentChild.tagName === 'TEMPLATE' && (toReplace = currentChild.getAttribute('replace-part'))) {
                  partReplacements[toReplace] = compiler.compile(currentChild, resources);
                } else {
                  fragment.appendChild(currentChild);
                }
                currentChild = nextSibling;
              }
              instruction.contentFactory = compiler.compile(fragment, resources);
            } else {
              var currentChild = node.firstChild,
                  nextSibling,
                  toReplace;
              while (currentChild) {
                nextSibling = currentChild.nextSibling;
                if (currentChild.tagName === 'TEMPLATE' && (toReplace = currentChild.getAttribute('replace-part'))) {
                  partReplacements[toReplace] = compiler.compile(currentChild, resources);
                }
                currentChild = nextSibling;
              }
            }
          }
        }
        instruction.suppressBind = true;
        return node;
      };
      HtmlBehaviorResource.prototype.create = function create(container) {
        var instruction = arguments[1] === undefined ? defaultInstruction : arguments[1];
        var element = arguments[2] === undefined ? null : arguments[2];
        var bindings = arguments[3] === undefined ? null : arguments[3];
        var host = undefined;
        if (this.elementName !== null && element) {
          if (this.usesShadowDOM) {
            host = element.createShadowRoot();
          } else {
            host = element;
          }
          container.registerInstance(DOMBoundary, host);
        }
        var executionContext = instruction.executionContext || container.get(this.target),
            behaviorInstance = new BehaviorInstance(this, executionContext, instruction),
            childBindings = this.childBindings,
            viewFactory = undefined;
        if (this.liftsContent) {
          element.primaryBehavior = behaviorInstance;
        } else if (this.elementName !== null) {
          viewFactory = instruction.viewFactory || this.viewFactory;
          if (viewFactory) {
            behaviorInstance.view = viewFactory.create(container, executionContext, instruction, element);
          }
          if (element) {
            element.primaryBehavior = behaviorInstance;
            if (behaviorInstance.view) {
              if (!this.usesShadowDOM) {
                if (instruction.contentFactory) {
                  var contentView = instruction.contentFactory.create(container, null, contentSelectorFactoryOptions);
                  ContentSelector.applySelectors(contentView, behaviorInstance.view.contentSelectors, function(contentSelector, group) {
                    return contentSelector.add(group);
                  });
                  behaviorInstance.contentView = contentView;
                }
              }
              if (instruction.anchorIsContainer) {
                if (childBindings !== null) {
                  for (var i = 0,
                      ii = childBindings.length; i < ii; ++i) {
                    behaviorInstance.view.addBinding(childBindings[i].create(host, executionContext));
                  }
                }
                behaviorInstance.view.appendNodesTo(host);
              } else {
                behaviorInstance.view.insertNodesBefore(host);
              }
            } else if (childBindings !== null) {
              for (var i = 0,
                  ii = childBindings.length; i < ii; ++i) {
                bindings.push(childBindings[i].create(element, executionContext));
              }
            }
          } else if (behaviorInstance.view) {
            behaviorInstance.view.owner = behaviorInstance;
            if (childBindings !== null) {
              for (var i = 0,
                  ii = childBindings.length; i < ii; ++i) {
                behaviorInstance.view.addBinding(childBindings[i].create(instruction.host, executionContext));
              }
            }
          } else if (childBindings !== null) {
            for (var i = 0,
                ii = childBindings.length; i < ii; ++i) {
              bindings.push(childBindings[i].create(instruction.host, executionContext));
            }
          }
        } else if (childBindings !== null) {
          for (var i = 0,
              ii = childBindings.length; i < ii; ++i) {
            bindings.push(childBindings[i].create(element, executionContext));
          }
        }
        if (element) {
          if (!(this.apiName in element)) {
            element[this.apiName] = executionContext;
          }
          if (!(this.htmlName in element)) {
            element[this.htmlName] = behaviorInstance;
          }
        }
        return behaviorInstance;
      };
      HtmlBehaviorResource.prototype.ensurePropertiesDefined = function ensurePropertiesDefined(instance, lookup) {
        var properties,
            i,
            ii,
            observer;
        if ('__propertiesDefined__' in lookup) {
          return ;
        }
        lookup.__propertiesDefined__ = true;
        properties = this.properties;
        for (i = 0, ii = properties.length; i < ii; ++i) {
          observer = properties[i].createObserver(instance);
          if (observer !== undefined) {
            lookup[observer.propertyName] = observer;
          }
        }
      };
      return HtmlBehaviorResource;
    })();
    exports.HtmlBehaviorResource = HtmlBehaviorResource;
    var ResourceModule = (function() {
      function ResourceModule(moduleId) {
        _classCallCheck(this, ResourceModule);
        this.id = moduleId;
        this.moduleInstance = null;
        this.mainResource = null;
        this.resources = null;
        this.viewStrategy = null;
        this.isAnalyzed = false;
      }
      ResourceModule.prototype.analyze = function analyze(container) {
        var current = this.mainResource,
            resources = this.resources,
            viewStrategy = this.viewStrategy,
            i,
            ii;
        if (this.isAnalyzed) {
          return ;
        }
        this.isAnalyzed = true;
        if (current) {
          current.metadata.viewStrategy = viewStrategy;
          current.analyze(container);
        }
        for (i = 0, ii = resources.length; i < ii; ++i) {
          current = resources[i];
          current.metadata.viewStrategy = viewStrategy;
          current.analyze(container);
        }
      };
      ResourceModule.prototype.register = function register(registry, name) {
        var i,
            ii,
            resources = this.resources;
        if (this.mainResource) {
          this.mainResource.register(registry, name);
          name = null;
        }
        for (i = 0, ii = resources.length; i < ii; ++i) {
          resources[i].register(registry, name);
          name = null;
        }
      };
      ResourceModule.prototype.load = function load(container, loadContext) {
        if (this.onLoaded) {
          return this.onLoaded;
        }
        var current = this.mainResource,
            resources = this.resources,
            i,
            ii,
            loads = [];
        if (current) {
          loads.push(current.load(container, loadContext));
        }
        for (i = 0, ii = resources.length; i < ii; ++i) {
          loads.push(resources[i].load(container, loadContext));
        }
        this.onLoaded = Promise.all(loads);
        return this.onLoaded;
      };
      return ResourceModule;
    })();
    exports.ResourceModule = ResourceModule;
    var ResourceDescription = (function() {
      function ResourceDescription(key, exportedValue, resourceTypeMeta) {
        _classCallCheck(this, ResourceDescription);
        if (!resourceTypeMeta) {
          resourceTypeMeta = _aureliaMetadata.Metadata.get(_aureliaMetadata.Metadata.resource, exportedValue);
          if (!resourceTypeMeta) {
            resourceTypeMeta = new HtmlBehaviorResource();
            resourceTypeMeta.elementName = hyphenate(key);
            _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.resource, resourceTypeMeta, exportedValue);
          }
        }
        if (resourceTypeMeta instanceof HtmlBehaviorResource) {
          if (resourceTypeMeta.elementName === undefined) {
            resourceTypeMeta.elementName = hyphenate(key);
          } else if (resourceTypeMeta.attributeName === undefined) {
            resourceTypeMeta.attributeName = hyphenate(key);
          } else if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
            HtmlBehaviorResource.convention(key, resourceTypeMeta);
          }
        } else if (!resourceTypeMeta.name) {
          resourceTypeMeta.name = hyphenate(key);
        }
        this.metadata = resourceTypeMeta;
        this.value = exportedValue;
      }
      ResourceDescription.prototype.analyze = function analyze(container) {
        var metadata = this.metadata,
            value = this.value;
        if ('analyze' in metadata) {
          metadata.analyze(container, value);
        }
      };
      ResourceDescription.prototype.register = function register(registry, name) {
        this.metadata.register(registry, name);
      };
      ResourceDescription.prototype.load = function load(container, loadContext) {
        var metadata = this.metadata,
            value = this.value;
        if ('load' in metadata) {
          return metadata.load(container, value, null, null, loadContext);
        }
      };
      ResourceDescription.get = function get(resource) {
        var key = arguments[1] === undefined ? 'custom-resource' : arguments[1];
        var resourceTypeMeta = _aureliaMetadata.Metadata.get(_aureliaMetadata.Metadata.resource, resource),
            resourceDescription;
        if (resourceTypeMeta) {
          if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
            HtmlBehaviorResource.convention(key, resourceTypeMeta);
          }
          if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
            resourceTypeMeta.elementName = hyphenate(key);
          }
          resourceDescription = new ResourceDescription(key, resource, resourceTypeMeta);
        } else {
          if (resourceTypeMeta = HtmlBehaviorResource.convention(key)) {
            resourceDescription = new ResourceDescription(key, resource, resourceTypeMeta);
            _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.resource, resourceTypeMeta, resource);
          } else if (resourceTypeMeta = _aureliaBinding.ValueConverterResource.convention(key)) {
            resourceDescription = new ResourceDescription(key, resource, resourceTypeMeta);
            _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.resource, resourceTypeMeta, resource);
          }
        }
        return resourceDescription;
      };
      return ResourceDescription;
    })();
    exports.ResourceDescription = ResourceDescription;
    var ModuleAnalyzer = (function() {
      function ModuleAnalyzer() {
        _classCallCheck(this, ModuleAnalyzer);
        this.cache = {};
      }
      ModuleAnalyzer.prototype.getAnalysis = function getAnalysis(moduleId) {
        return this.cache[moduleId];
      };
      ModuleAnalyzer.prototype.analyze = function analyze(moduleId, moduleInstance, viewModelMember) {
        var mainResource,
            fallbackValue,
            fallbackKey,
            resourceTypeMeta,
            key,
            exportedValue,
            resources = [],
            conventional,
            viewStrategy,
            resourceModule;
        resourceModule = this.cache[moduleId];
        if (resourceModule) {
          return resourceModule;
        }
        resourceModule = new ResourceModule(moduleId);
        this.cache[moduleId] = resourceModule;
        if (typeof moduleInstance === 'function') {
          moduleInstance = {'default': moduleInstance};
        }
        if (viewModelMember) {
          mainResource = new ResourceDescription(viewModelMember, moduleInstance[viewModelMember]);
        }
        for (key in moduleInstance) {
          exportedValue = moduleInstance[key];
          if (key === viewModelMember || typeof exportedValue !== 'function') {
            continue;
          }
          resourceTypeMeta = _aureliaMetadata.Metadata.get(_aureliaMetadata.Metadata.resource, exportedValue);
          if (resourceTypeMeta) {
            if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
              HtmlBehaviorResource.convention(key, resourceTypeMeta);
            }
            if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
              resourceTypeMeta.elementName = hyphenate(key);
            }
            if (!mainResource && resourceTypeMeta instanceof HtmlBehaviorResource && resourceTypeMeta.elementName !== null) {
              mainResource = new ResourceDescription(key, exportedValue, resourceTypeMeta);
            } else {
              resources.push(new ResourceDescription(key, exportedValue, resourceTypeMeta));
            }
          } else if (exportedValue instanceof ViewStrategy) {
            viewStrategy = exportedValue;
          } else if (exportedValue instanceof _aureliaLoader.TemplateRegistryEntry) {
            viewStrategy = new TemplateRegistryViewStrategy(moduleId, exportedValue);
          } else {
            if (conventional = HtmlBehaviorResource.convention(key)) {
              if (conventional.elementName !== null && !mainResource) {
                mainResource = new ResourceDescription(key, exportedValue, conventional);
              } else {
                resources.push(new ResourceDescription(key, exportedValue, conventional));
              }
              _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.resource, conventional, exportedValue);
            } else if (conventional = _aureliaBinding.ValueConverterResource.convention(key)) {
              resources.push(new ResourceDescription(key, exportedValue, conventional));
              _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.resource, conventional, exportedValue);
            } else if (!fallbackValue) {
              fallbackValue = exportedValue;
              fallbackKey = key;
            }
          }
        }
        if (!mainResource && fallbackValue) {
          mainResource = new ResourceDescription(fallbackKey, fallbackValue);
        }
        resourceModule.moduleInstance = moduleInstance;
        resourceModule.mainResource = mainResource;
        resourceModule.resources = resources;
        resourceModule.viewStrategy = viewStrategy;
        return resourceModule;
      };
      return ModuleAnalyzer;
    })();
    exports.ModuleAnalyzer = ModuleAnalyzer;
    var noMutations = [];
    var ChildObserver = (function() {
      function ChildObserver(config) {
        _classCallCheck(this, ChildObserver);
        this.name = config.name;
        this.changeHandler = config.changeHandler || this.name + 'Changed';
        this.selector = config.selector;
      }
      ChildObserver.prototype.create = function create(target, behavior) {
        return new ChildObserverBinder(this.selector, target, this.name, behavior, this.changeHandler);
      };
      return ChildObserver;
    })();
    exports.ChildObserver = ChildObserver;
    var ChildObserverBinder = (function() {
      function ChildObserverBinder(selector, target, property, behavior, changeHandler) {
        _classCallCheck(this, ChildObserverBinder);
        this.selector = selector;
        this.target = target;
        this.property = property;
        this.behavior = behavior;
        this.changeHandler = changeHandler in behavior ? changeHandler : null;
        this.observer = new MutationObserver(this.onChange.bind(this));
      }
      ChildObserverBinder.prototype.bind = function bind(source) {
        var items,
            results,
            i,
            ii,
            node,
            behavior = this.behavior;
        this.observer.observe(this.target, {
          childList: true,
          subtree: true
        });
        items = behavior[this.property];
        if (!items) {
          items = behavior[this.property] = [];
        } else {
          items.length = 0;
        }
        results = this.target.querySelectorAll(this.selector);
        for (i = 0, ii = results.length; i < ii; ++i) {
          node = results[i];
          items.push(node.primaryBehavior ? node.primaryBehavior.executionContext : node);
        }
        if (this.changeHandler !== null) {
          this.behavior[this.changeHandler](noMutations);
        }
      };
      ChildObserverBinder.prototype.unbind = function unbind() {
        this.observer.disconnect();
      };
      ChildObserverBinder.prototype.onChange = function onChange(mutations) {
        var items = this.behavior[this.property],
            selector = this.selector;
        mutations.forEach(function(record) {
          var added = record.addedNodes,
              removed = record.removedNodes,
              prev = record.previousSibling,
              i,
              ii,
              primary,
              index,
              node;
          for (i = 0, ii = removed.length; i < ii; ++i) {
            node = removed[i];
            if (node.nodeType === 1 && node.matches(selector)) {
              primary = node.primaryBehavior ? node.primaryBehavior.executionContext : node;
              index = items.indexOf(primary);
              if (index != -1) {
                items.splice(index, 1);
              }
            }
          }
          for (i = 0, ii = added.length; i < ii; ++i) {
            node = added[i];
            if (node.nodeType === 1 && node.matches(selector)) {
              primary = node.primaryBehavior ? node.primaryBehavior.executionContext : node;
              index = 0;
              while (prev) {
                if (prev.nodeType === 1 && prev.matches(selector)) {
                  index++;
                }
                prev = prev.previousSibling;
              }
              items.splice(index, 0, primary);
            }
          }
        });
        if (this.changeHandler !== null) {
          this.behavior[this.changeHandler](mutations);
        }
      };
      return ChildObserverBinder;
    })();
    exports.ChildObserverBinder = ChildObserverBinder;
    var CompositionEngine = (function() {
      function CompositionEngine(viewEngine) {
        _classCallCheck(this, CompositionEngine);
        this.viewEngine = viewEngine;
      }
      CompositionEngine.inject = function inject() {
        return [ViewEngine];
      };
      CompositionEngine.prototype.activate = function activate(instruction) {
        if (instruction.skipActivation || typeof instruction.viewModel.activate !== 'function') {
          return Promise.resolve();
        }
        return instruction.viewModel.activate(instruction.model) || Promise.resolve();
      };
      CompositionEngine.prototype.createBehaviorAndSwap = function createBehaviorAndSwap(instruction) {
        return this.createBehavior(instruction).then(function(behavior) {
          behavior.view.bind(behavior.executionContext);
          instruction.viewSlot.swap(behavior.view);
          if (instruction.currentBehavior) {
            instruction.currentBehavior.unbind();
          }
          return behavior;
        });
      };
      CompositionEngine.prototype.createBehavior = function createBehavior(instruction) {
        var childContainer = instruction.childContainer,
            viewModelResource = instruction.viewModelResource,
            viewModel = instruction.viewModel,
            metadata;
        return this.activate(instruction).then(function() {
          var doneLoading,
              viewStrategyFromViewModel,
              origin;
          if ('getViewStrategy' in viewModel && !instruction.view) {
            viewStrategyFromViewModel = true;
            instruction.view = ViewStrategy.normalize(viewModel.getViewStrategy());
          }
          if (instruction.view) {
            if (viewStrategyFromViewModel) {
              origin = _aureliaMetadata.Origin.get(viewModel.constructor);
              if (origin) {
                instruction.view.makeRelativeTo(origin.moduleId);
              }
            } else if (instruction.viewResources) {
              instruction.view.makeRelativeTo(instruction.viewResources.viewUrl);
            }
          }
          if (viewModelResource) {
            metadata = viewModelResource.metadata;
            doneLoading = metadata.load(childContainer, viewModelResource.value, instruction.view, true);
          } else {
            metadata = new HtmlBehaviorResource();
            metadata.elementName = 'dynamic-element';
            metadata.analyze(instruction.container || childContainer, viewModel.constructor);
            doneLoading = metadata.load(childContainer, viewModel.constructor, instruction.view, true).then(function(viewFactory) {
              return viewFactory;
            });
          }
          return doneLoading.then(function(viewFactory) {
            return metadata.create(childContainer, {
              executionContext: viewModel,
              viewFactory: viewFactory,
              suppressBind: true,
              host: instruction.host
            });
          });
        });
      };
      CompositionEngine.prototype.createViewModel = function createViewModel(instruction) {
        var childContainer = instruction.childContainer || instruction.container.createChild();
        instruction.viewModel = instruction.viewResources ? instruction.viewResources.relativeToView(instruction.viewModel) : instruction.viewModel;
        return this.viewEngine.importViewModelResource(instruction.viewModel).then(function(viewModelResource) {
          childContainer.autoRegister(viewModelResource.value);
          if (instruction.host) {
            childContainer.registerInstance(Element, instruction.host);
          }
          instruction.viewModel = childContainer.viewModel = childContainer.get(viewModelResource.value);
          instruction.viewModelResource = viewModelResource;
          return instruction;
        });
      };
      CompositionEngine.prototype.compose = function compose(instruction) {
        var _this9 = this;
        instruction.childContainer = instruction.childContainer || instruction.container.createChild();
        instruction.view = ViewStrategy.normalize(instruction.view);
        if (instruction.viewModel) {
          if (typeof instruction.viewModel === 'string') {
            return this.createViewModel(instruction).then(function(instruction) {
              return _this9.createBehaviorAndSwap(instruction);
            });
          } else {
            return this.createBehaviorAndSwap(instruction);
          }
        } else if (instruction.view) {
          if (instruction.viewResources) {
            instruction.view.makeRelativeTo(instruction.viewResources.viewUrl);
          }
          return instruction.view.loadViewFactory(this.viewEngine).then(function(viewFactory) {
            var result = viewFactory.create(instruction.childContainer, instruction.executionContext);
            instruction.viewSlot.swap(result);
            return result;
          });
        } else if (instruction.viewSlot) {
          instruction.viewSlot.removeAll();
          return Promise.resolve(null);
        }
      };
      return CompositionEngine;
    })();
    exports.CompositionEngine = CompositionEngine;
    var ElementConfigResource = (function() {
      function ElementConfigResource() {
        _classCallCheck(this, ElementConfigResource);
      }
      ElementConfigResource.prototype.load = function load(container, target) {
        var config = new target(),
            eventManager = container.get(_aureliaBinding.EventManager);
        eventManager.registerElementConfig(config);
        return Promise.resolve(this);
      };
      ElementConfigResource.prototype.register = function register() {};
      return ElementConfigResource;
    })();
    exports.ElementConfigResource = ElementConfigResource;
    function validateBehaviorName(name, type) {
      if (/[A-Z]/.test(name)) {
        throw new Error('\'' + name + '\' is not a valid ' + type + ' name.  Upper-case letters are not allowed because the DOM is not case-sensitive.');
      }
    }
    function behavior(override) {
      return function(target) {
        if (override instanceof HtmlBehaviorResource) {
          _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.resource, override, target);
        } else {
          var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, target);
          Object.assign(resource, override);
        }
      };
    }
    _aureliaMetadata.Decorators.configure.parameterizedDecorator('behavior', behavior);
    function customElement(name) {
      validateBehaviorName(name, 'custom element');
      return function(target) {
        var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, target);
        resource.elementName = name;
      };
    }
    _aureliaMetadata.Decorators.configure.parameterizedDecorator('customElement', customElement);
    function customAttribute(name, defaultBindingMode) {
      validateBehaviorName(name, 'custom attribute');
      return function(target) {
        var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, target);
        resource.attributeName = name;
        resource.attributeDefaultBindingMode = defaultBindingMode;
      };
    }
    _aureliaMetadata.Decorators.configure.parameterizedDecorator('customAttribute', customAttribute);
    function templateController(target) {
      var deco = function deco(target) {
        var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, target);
        resource.liftsContent = true;
      };
      return target ? deco(target) : deco;
    }
    _aureliaMetadata.Decorators.configure.simpleDecorator('templateController', templateController);
    function bindable(nameOrConfigOrTarget, key, descriptor) {
      var deco = function deco(target, key, descriptor) {
        var actualTarget = key ? target.constructor : target,
            resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, actualTarget),
            prop;
        if (key) {
          nameOrConfigOrTarget = nameOrConfigOrTarget || {};
          nameOrConfigOrTarget.name = key;
        }
        prop = new BindableProperty(nameOrConfigOrTarget);
        return prop.registerWith(actualTarget, resource, descriptor);
      };
      if (!nameOrConfigOrTarget) {
        return deco;
      }
      if (key) {
        var target = nameOrConfigOrTarget;
        nameOrConfigOrTarget = null;
        return deco(target, key, descriptor);
      }
      return deco;
    }
    _aureliaMetadata.Decorators.configure.parameterizedDecorator('bindable', bindable);
    function dynamicOptions(target) {
      var deco = function deco(target) {
        var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, target);
        resource.hasDynamicOptions = true;
      };
      return target ? deco(target) : deco;
    }
    _aureliaMetadata.Decorators.configure.simpleDecorator('dynamicOptions', dynamicOptions);
    function sync(selectorOrConfig) {
      return function(target, key, descriptor) {
        var actualTarget = key ? target.constructor : target,
            resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, actualTarget);
        if (typeof selectorOrConfig === 'string') {
          selectorOrConfig = {
            selector: selectorOrConfig,
            name: key
          };
        }
        resource.addChildBinding(new ChildObserver(selectorOrConfig));
      };
    }
    _aureliaMetadata.Decorators.configure.parameterizedDecorator('sync', sync);
    function useShadowDOM(target) {
      var deco = function deco(target) {
        var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, target);
        resource.targetShadowDOM = true;
      };
      return target ? deco(target) : deco;
    }
    _aureliaMetadata.Decorators.configure.simpleDecorator('useShadowDOM', useShadowDOM);
    function doNotProcessContent() {
      return false;
    }
    function skipContentProcessing(target) {
      var deco = function deco(target) {
        var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, target);
        resource.processContent = doNotProcessContent;
        console.warn('The @skipContentProcessing decorator is deprecated and will be removed in a future release. Please use @processContent(false) instead.');
      };
      return target ? deco(target) : deco;
    }
    _aureliaMetadata.Decorators.configure.simpleDecorator('skipContentProcessing', skipContentProcessing);
    function processContent(processor) {
      return function(target) {
        var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, target);
        resource.processContent = processor || doNotProcessContent;
      };
    }
    _aureliaMetadata.Decorators.configure.parameterizedDecorator('processContent', processContent);
    function containerless(target) {
      var deco = function deco(target) {
        var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, target);
        resource.containerless = true;
      };
      return target ? deco(target) : deco;
    }
    _aureliaMetadata.Decorators.configure.simpleDecorator('containerless', containerless);
    function viewStrategy(strategy) {
      return function(target) {
        _aureliaMetadata.Metadata.define(ViewStrategy.metadataKey, strategy, target);
      };
    }
    _aureliaMetadata.Decorators.configure.parameterizedDecorator('viewStrategy', useView);
    function useView(path) {
      return viewStrategy(new UseViewStrategy(path));
    }
    _aureliaMetadata.Decorators.configure.parameterizedDecorator('useView', useView);
    function inlineView(markup, dependencies, dependencyBaseUrl) {
      return viewStrategy(new InlineViewStrategy(markup, dependencies, dependencyBaseUrl));
    }
    _aureliaMetadata.Decorators.configure.parameterizedDecorator('inlineView', inlineView);
    function noView(target) {
      var deco = function deco(target) {
        _aureliaMetadata.Metadata.define(ViewStrategy.metadataKey, new NoViewStrategy(), target);
      };
      return target ? deco(target) : deco;
    }
    _aureliaMetadata.Decorators.configure.simpleDecorator('noView', noView);
    function elementConfig(target) {
      var deco = function deco(target) {
        _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.resource, new ElementConfigResource(), target);
      };
      return target ? deco(target) : deco;
    }
    _aureliaMetadata.Decorators.configure.simpleDecorator('elementConfig', elementConfig);
  }).call(__exports, __exports, __require('npm:core-js@0.9.18'), __require('github:aurelia/metadata@0.7.1'), __require('github:aurelia/path@0.8.1'), __require('github:aurelia/loader@0.8.3'), __require('github:aurelia/dependency-injection@0.9.1'), __require('github:aurelia/binding@0.8.4'), __require('github:aurelia/task-queue@0.6.1'), __require('github:aurelia/logging@0.6.2'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/templating@0.13.13", ["github:aurelia/templating@0.13.13/aurelia-templating"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/templating@0.13.13/aurelia-templating'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/router@0.10.3/aurelia-router", ["npm:core-js@0.9.18", "github:aurelia/dependency-injection@0.9.1", "github:aurelia/route-recognizer@0.6.1", "github:aurelia/path@0.8.1", "github:aurelia/history@0.6.1", "github:aurelia/event-aggregator@0.6.2", "github:aurelia/logging@0.6.2"], false, function(__require, __exports, __module) {
  return (function(exports, _coreJs, _aureliaDependencyInjection, _aureliaRouteRecognizer, _aureliaPath, _aureliaHistory, _aureliaEventAggregator, _aureliaLogging) {
    'use strict';
    exports.__esModule = true;
    var _createClass = (function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ('value' in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          defineProperties(Constructor, staticProps);
        return Constructor;
      };
    })();
    exports.processPotential = processPotential;
    exports.normalizeAbsolutePath = normalizeAbsolutePath;
    exports.createRootedPath = createRootedPath;
    exports.resolveUrl = resolveUrl;
    exports.isNavigationCommand = isNavigationCommand;
    exports.buildNavigationPlan = buildNavigationPlan;
    exports.createRouteFilterStep = createRouteFilterStep;
    exports.loadNewRoute = loadNewRoute;
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {'default': obj};
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }});
      if (superClass)
        subClass.__proto__ = superClass;
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var _core = _interopRequireDefault(_coreJs);
    function processPotential(obj, resolve, reject) {
      if (obj && typeof obj.then === 'function') {
        var dfd = obj.then(resolve);
        if (typeof dfd['catch'] === 'function') {
          return dfd['catch'](reject);
        } else if (typeof dfd.fail === 'function') {
          return dfd.fail(reject);
        }
        return dfd;
      } else {
        try {
          return resolve(obj);
        } catch (error) {
          return reject(error);
        }
      }
    }
    function normalizeAbsolutePath(path, hasPushState) {
      if (!hasPushState && path[0] !== '#') {
        path = '#' + path;
      }
      return path;
    }
    function createRootedPath(fragment, baseUrl, hasPushState) {
      if (isAbsoluteUrl.test(fragment)) {
        return fragment;
      }
      var path = '';
      if (baseUrl.length && baseUrl[0] !== '/') {
        path += '/';
      }
      path += baseUrl;
      if ((!path.length || path[path.length - 1] != '/') && fragment[0] != '/') {
        path += '/';
      }
      if (path.length && path[path.length - 1] == '/' && fragment[0] == '/') {
        path = path.substring(0, path.length - 1);
      }
      return normalizeAbsolutePath(path + fragment, hasPushState);
    }
    function resolveUrl(fragment, baseUrl, hasPushState) {
      if (isRootedPath.test(fragment)) {
        return normalizeAbsolutePath(fragment, hasPushState);
      } else {
        return createRootedPath(fragment, baseUrl, hasPushState);
      }
    }
    var isRootedPath = /^#?\//;
    var isAbsoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;
    function isNavigationCommand(obj) {
      return obj && typeof obj.navigate === 'function';
    }
    var Redirect = (function() {
      function Redirect(url, options) {
        _classCallCheck(this, Redirect);
        this.url = url;
        this.options = Object.assign({
          trigger: true,
          replace: true
        }, options || {});
        this.shouldContinueProcessing = false;
      }
      Redirect.prototype.setRouter = function setRouter(router) {
        this.router = router;
      };
      Redirect.prototype.navigate = function navigate(appRouter) {
        var navigatingRouter = this.options.useAppRouter ? appRouter : this.router || appRouter;
        navigatingRouter.navigate(this.url, this.options);
      };
      return Redirect;
    })();
    exports.Redirect = Redirect;
    var activationStrategy = {
      noChange: 'no-change',
      invokeLifecycle: 'invoke-lifecycle',
      replace: 'replace'
    };
    exports.activationStrategy = activationStrategy;
    function buildNavigationPlan(navigationContext, forceLifecycleMinimum) {
      var prev = navigationContext.prevInstruction;
      var next = navigationContext.nextInstruction;
      var plan = {},
          viewPortName;
      if ('redirect' in next.config) {
        var redirectLocation = resolveUrl(next.config.redirect, getInstructionBaseUrl(next));
        if (next.queryString) {
          redirectLocation += '?' + next.queryString;
        }
        return Promise.reject(new Redirect(redirectLocation));
      }
      if (prev) {
        var newParams = hasDifferentParameterValues(prev, next);
        var pending = [];
        for (viewPortName in prev.viewPortInstructions) {
          var prevViewPortInstruction = prev.viewPortInstructions[viewPortName];
          var nextViewPortConfig = next.config.viewPorts[viewPortName];
          var viewPortPlan = plan[viewPortName] = {
            name: viewPortName,
            config: nextViewPortConfig,
            prevComponent: prevViewPortInstruction.component,
            prevModuleId: prevViewPortInstruction.moduleId
          };
          if (prevViewPortInstruction.moduleId != nextViewPortConfig.moduleId) {
            viewPortPlan.strategy = activationStrategy.replace;
          } else if ('determineActivationStrategy' in prevViewPortInstruction.component.executionContext) {
            var _prevViewPortInstruction$component$executionContext;
            viewPortPlan.strategy = (_prevViewPortInstruction$component$executionContext = prevViewPortInstruction.component.executionContext).determineActivationStrategy.apply(_prevViewPortInstruction$component$executionContext, next.lifecycleArgs);
          } else if (newParams || forceLifecycleMinimum) {
            viewPortPlan.strategy = activationStrategy.invokeLifecycle;
          } else {
            viewPortPlan.strategy = activationStrategy.noChange;
          }
          if (viewPortPlan.strategy !== activationStrategy.replace && prevViewPortInstruction.childRouter) {
            var path = next.getWildcardPath();
            var task = prevViewPortInstruction.childRouter.createNavigationInstruction(path, next).then(function(childInstruction) {
              viewPortPlan.childNavigationContext = prevViewPortInstruction.childRouter.createNavigationContext(childInstruction);
              return buildNavigationPlan(viewPortPlan.childNavigationContext, viewPortPlan.strategy == activationStrategy.invokeLifecycle).then(function(childPlan) {
                viewPortPlan.childNavigationContext.plan = childPlan;
              });
            });
            pending.push(task);
          }
        }
        return Promise.all(pending).then(function() {
          return plan;
        });
      } else {
        for (viewPortName in next.config.viewPorts) {
          plan[viewPortName] = {
            name: viewPortName,
            strategy: activationStrategy.replace,
            config: next.config.viewPorts[viewPortName]
          };
        }
        return Promise.resolve(plan);
      }
    }
    var BuildNavigationPlanStep = (function() {
      function BuildNavigationPlanStep() {
        _classCallCheck(this, BuildNavigationPlanStep);
      }
      BuildNavigationPlanStep.prototype.run = function run(navigationContext, next) {
        return buildNavigationPlan(navigationContext).then(function(plan) {
          navigationContext.plan = plan;
          return next();
        })['catch'](next.cancel);
      };
      return BuildNavigationPlanStep;
    })();
    exports.BuildNavigationPlanStep = BuildNavigationPlanStep;
    function hasDifferentParameterValues(prev, next) {
      var prevParams = prev.params,
          nextParams = next.params,
          nextWildCardName = next.config.hasChildRouter ? next.getWildCardName() : null;
      for (var key in nextParams) {
        if (key === nextWildCardName) {
          continue;
        }
        if (prevParams[key] !== nextParams[key]) {
          return true;
        }
      }
      for (var key in prevParams) {
        if (key === nextWildCardName) {
          continue;
        }
        if (prevParams[key] !== nextParams[key]) {
          return true;
        }
      }
      return false;
    }
    function getInstructionBaseUrl(instruction) {
      var instructionBaseUrlParts = [];
      while (instruction = instruction.parentInstruction) {
        instructionBaseUrlParts.unshift(instruction.getBaseUrl());
      }
      instructionBaseUrlParts.unshift('/');
      return instructionBaseUrlParts.join('');
    }
    var affirmations = ['yes', 'ok', 'true'];
    exports.affirmations = affirmations;
    var CanDeactivatePreviousStep = (function() {
      function CanDeactivatePreviousStep() {
        _classCallCheck(this, CanDeactivatePreviousStep);
      }
      CanDeactivatePreviousStep.prototype.run = function run(navigationContext, next) {
        return processDeactivatable(navigationContext.plan, 'canDeactivate', next);
      };
      return CanDeactivatePreviousStep;
    })();
    exports.CanDeactivatePreviousStep = CanDeactivatePreviousStep;
    var CanActivateNextStep = (function() {
      function CanActivateNextStep() {
        _classCallCheck(this, CanActivateNextStep);
      }
      CanActivateNextStep.prototype.run = function run(navigationContext, next) {
        return processActivatable(navigationContext, 'canActivate', next);
      };
      return CanActivateNextStep;
    })();
    exports.CanActivateNextStep = CanActivateNextStep;
    var DeactivatePreviousStep = (function() {
      function DeactivatePreviousStep() {
        _classCallCheck(this, DeactivatePreviousStep);
      }
      DeactivatePreviousStep.prototype.run = function run(navigationContext, next) {
        return processDeactivatable(navigationContext.plan, 'deactivate', next, true);
      };
      return DeactivatePreviousStep;
    })();
    exports.DeactivatePreviousStep = DeactivatePreviousStep;
    var ActivateNextStep = (function() {
      function ActivateNextStep() {
        _classCallCheck(this, ActivateNextStep);
      }
      ActivateNextStep.prototype.run = function run(navigationContext, next) {
        return processActivatable(navigationContext, 'activate', next, true);
      };
      return ActivateNextStep;
    })();
    exports.ActivateNextStep = ActivateNextStep;
    function processDeactivatable(plan, callbackName, next, ignoreResult) {
      var infos = findDeactivatable(plan, callbackName),
          i = infos.length;
      function inspect(val) {
        if (ignoreResult || shouldContinue(val)) {
          return iterate();
        } else {
          return next.cancel(val);
        }
      }
      function iterate() {
        if (i--) {
          try {
            var controller = infos[i];
            var result = controller[callbackName]();
            return processPotential(result, inspect, next.cancel);
          } catch (error) {
            return next.cancel(error);
          }
        } else {
          return next();
        }
      }
      return iterate();
    }
    function findDeactivatable(plan, callbackName, list) {
      list = list || [];
      for (var viewPortName in plan) {
        var viewPortPlan = plan[viewPortName];
        var prevComponent = viewPortPlan.prevComponent;
        if ((viewPortPlan.strategy == activationStrategy.invokeLifecycle || viewPortPlan.strategy == activationStrategy.replace) && prevComponent) {
          var controller = prevComponent.executionContext;
          if (callbackName in controller) {
            list.push(controller);
          }
        }
        if (viewPortPlan.childNavigationContext) {
          findDeactivatable(viewPortPlan.childNavigationContext.plan, callbackName, list);
        } else if (prevComponent) {
          addPreviousDeactivatable(prevComponent, callbackName, list);
        }
      }
      return list;
    }
    function addPreviousDeactivatable(component, callbackName, list) {
      var controller = component.executionContext,
          childRouter = component.childRouter;
      if (childRouter && childRouter.currentInstruction) {
        var viewPortInstructions = childRouter.currentInstruction.viewPortInstructions;
        for (var viewPortName in viewPortInstructions) {
          var viewPortInstruction = viewPortInstructions[viewPortName];
          var prevComponent = viewPortInstruction.component;
          var prevController = prevComponent.executionContext;
          if (callbackName in prevController) {
            list.push(prevController);
          }
          addPreviousDeactivatable(prevComponent, callbackName, list);
        }
      }
    }
    function processActivatable(navigationContext, callbackName, next, ignoreResult) {
      var infos = findActivatable(navigationContext, callbackName),
          length = infos.length,
          i = -1;
      function inspect(val, router) {
        if (ignoreResult || shouldContinue(val, router)) {
          return iterate();
        } else {
          return next.cancel(val);
        }
      }
      function iterate() {
        i++;
        if (i < length) {
          try {
            var _current$controller;
            var current = infos[i];
            var result = (_current$controller = current.controller)[callbackName].apply(_current$controller, current.lifecycleArgs);
            return processPotential(result, function(val) {
              return inspect(val, current.router);
            }, next.cancel);
          } catch (error) {
            return next.cancel(error);
          }
        } else {
          return next();
        }
      }
      return iterate();
    }
    function findActivatable(navigationContext, callbackName, list, router) {
      var plan = navigationContext.plan;
      var next = navigationContext.nextInstruction;
      list = list || [];
      Object.keys(plan).filter(function(viewPortName) {
        var viewPortPlan = plan[viewPortName];
        var viewPortInstruction = next.viewPortInstructions[viewPortName];
        var controller = viewPortInstruction.component.executionContext;
        if ((viewPortPlan.strategy === activationStrategy.invokeLifecycle || viewPortPlan.strategy === activationStrategy.replace) && callbackName in controller) {
          list.push({
            controller: controller,
            lifecycleArgs: viewPortInstruction.lifecycleArgs,
            router: router
          });
        }
        if (viewPortPlan.childNavigationContext) {
          findActivatable(viewPortPlan.childNavigationContext, callbackName, list, viewPortInstruction.component.childRouter || router);
        }
      });
      return list;
    }
    function shouldContinue(output, router) {
      if (output instanceof Error) {
        return false;
      }
      if (isNavigationCommand(output)) {
        if (typeof output.setRouter === 'function') {
          output.setRouter(router);
        }
        return !!output.shouldContinueProcessing;
      }
      if (typeof output === 'string') {
        return affirmations.indexOf(output.toLowerCase()) !== -1;
      }
      if (typeof output === 'undefined') {
        return true;
      }
      return output;
    }
    var NavigationContext = (function() {
      function NavigationContext(router, nextInstruction) {
        _classCallCheck(this, NavigationContext);
        this.router = router;
        this.nextInstruction = nextInstruction;
        this.currentInstruction = router.currentInstruction;
        this.prevInstruction = router.currentInstruction;
      }
      NavigationContext.prototype.getAllContexts = function getAllContexts() {
        var acc = arguments[0] === undefined ? [] : arguments[0];
        acc.push(this);
        if (this.plan) {
          for (var key in this.plan) {
            this.plan[key].childNavigationContext && this.plan[key].childNavigationContext.getAllContexts(acc);
          }
        }
        return acc;
      };
      NavigationContext.prototype.commitChanges = function commitChanges(waitToSwap) {
        var next = this.nextInstruction,
            prev = this.prevInstruction,
            viewPortInstructions = next.viewPortInstructions,
            router = this.router,
            loads = [],
            delaySwaps = [];
        router.currentInstruction = next;
        if (prev) {
          prev.config.navModel.isActive = false;
        }
        next.config.navModel.isActive = true;
        router.refreshBaseUrl();
        router.refreshNavigation();
        for (var viewPortName in viewPortInstructions) {
          var viewPortInstruction = viewPortInstructions[viewPortName];
          var viewPort = router.viewPorts[viewPortName];
          if (!viewPort) {
            throw new Error('There was no router-view found in the view for ' + viewPortInstruction.moduleId + '.');
          }
          if (viewPortInstruction.strategy === activationStrategy.replace) {
            if (waitToSwap) {
              delaySwaps.push({
                viewPort: viewPort,
                viewPortInstruction: viewPortInstruction
              });
            }
            loads.push(viewPort.process(viewPortInstruction, waitToSwap).then(function(x) {
              if ('childNavigationContext' in viewPortInstruction) {
                return viewPortInstruction.childNavigationContext.commitChanges();
              }
            }));
          } else {
            if ('childNavigationContext' in viewPortInstruction) {
              loads.push(viewPortInstruction.childNavigationContext.commitChanges(waitToSwap));
            }
          }
        }
        return Promise.all(loads).then(function() {
          delaySwaps.forEach(function(x) {
            return x.viewPort.swap(x.viewPortInstruction);
          });
        });
      };
      NavigationContext.prototype.updateTitle = function updateTitle() {
        var title = this.buildTitle();
        if (title) {
          document.title = title;
        }
      };
      NavigationContext.prototype.buildTitle = function buildTitle() {
        var separator = arguments[0] === undefined ? ' | ' : arguments[0];
        var next = this.nextInstruction,
            title = next.config.navModel.title || '',
            viewPortInstructions = next.viewPortInstructions,
            childTitles = [];
        for (var viewPortName in viewPortInstructions) {
          var viewPortInstruction = viewPortInstructions[viewPortName];
          if ('childNavigationContext' in viewPortInstruction) {
            var childTitle = viewPortInstruction.childNavigationContext.buildTitle(separator);
            if (childTitle) {
              childTitles.push(childTitle);
            }
          }
        }
        if (childTitles.length) {
          title = childTitles.join(separator) + (title ? separator : '') + title;
        }
        if (this.router.title) {
          title += (title ? separator : '') + this.router.title;
        }
        return title;
      };
      _createClass(NavigationContext, [{
        key: 'nextInstructions',
        get: function get() {
          return this.getAllContexts().map(function(c) {
            return c.nextInstruction;
          }).filter(function(c) {
            return c;
          });
        }
      }, {
        key: 'currentInstructions',
        get: function get() {
          return this.getAllContexts().map(function(c) {
            return c.currentInstruction;
          }).filter(function(c) {
            return c;
          });
        }
      }, {
        key: 'prevInstructions',
        get: function get() {
          return this.getAllContexts().map(function(c) {
            return c.prevInstruction;
          }).filter(function(c) {
            return c;
          });
        }
      }]);
      return NavigationContext;
    })();
    exports.NavigationContext = NavigationContext;
    var CommitChangesStep = (function() {
      function CommitChangesStep() {
        _classCallCheck(this, CommitChangesStep);
      }
      CommitChangesStep.prototype.run = function run(navigationContext, next) {
        return navigationContext.commitChanges(true).then(function() {
          navigationContext.updateTitle();
          return next();
        });
      };
      return CommitChangesStep;
    })();
    exports.CommitChangesStep = CommitChangesStep;
    var NavigationInstruction = (function() {
      function NavigationInstruction(fragment, queryString, params, queryParams, config, parentInstruction) {
        _classCallCheck(this, NavigationInstruction);
        this.fragment = fragment;
        this.queryString = queryString;
        this.params = params || {};
        this.queryParams = queryParams;
        this.config = config;
        this.viewPortInstructions = {};
        this.parentInstruction = parentInstruction;
        var ancestorParams = [];
        var current = this;
        do {
          var currentParams = Object.assign({}, current.params);
          if (current.config.hasChildRouter) {
            delete currentParams[current.getWildCardName()];
          }
          ancestorParams.unshift(currentParams);
          current = current.parentInstruction;
        } while (current);
        var allParams = Object.assign.apply(Object, [{}, queryParams].concat(ancestorParams));
        this.lifecycleArgs = [allParams, config, this];
      }
      NavigationInstruction.prototype.addViewPortInstruction = function addViewPortInstruction(viewPortName, strategy, moduleId, component) {
        return this.viewPortInstructions[viewPortName] = {
          name: viewPortName,
          strategy: strategy,
          moduleId: moduleId,
          component: component,
          childRouter: component.childRouter,
          lifecycleArgs: this.lifecycleArgs.slice()
        };
      };
      NavigationInstruction.prototype.getWildCardName = function getWildCardName() {
        var wildcardIndex = this.config.route.lastIndexOf('*');
        return this.config.route.substr(wildcardIndex + 1);
      };
      NavigationInstruction.prototype.getWildcardPath = function getWildcardPath() {
        var wildcardName = this.getWildCardName();
        var path = this.params[wildcardName] || '';
        if (this.queryString) {
          path += '?' + this.queryString;
        }
        return path;
      };
      NavigationInstruction.prototype.getBaseUrl = function getBaseUrl() {
        if (!this.params) {
          return this.fragment;
        }
        var wildcardName = this.getWildCardName();
        var path = this.params[wildcardName] || '';
        if (!path) {
          return this.fragment;
        }
        return this.fragment.substr(0, this.fragment.lastIndexOf(path));
      };
      return NavigationInstruction;
    })();
    exports.NavigationInstruction = NavigationInstruction;
    var NavModel = (function() {
      function NavModel(router, relativeHref) {
        _classCallCheck(this, NavModel);
        this.router = router;
        this.relativeHref = relativeHref;
        this.isActive = false;
        this.title = null;
        this.href = null;
        this.settings = {};
        this.config = null;
      }
      NavModel.prototype.setTitle = function setTitle(title) {
        this.title = title;
        if (this.isActive) {
          this.router.updateTitle();
        }
      };
      return NavModel;
    })();
    exports.NavModel = NavModel;
    var RouteFilterContainer = (function() {
      function RouteFilterContainer(container) {
        _classCallCheck(this, RouteFilterContainer);
        this.container = container;
        this.filters = {};
        this.filterCache = {};
      }
      RouteFilterContainer.inject = function inject() {
        return [_aureliaDependencyInjection.Container];
      };
      RouteFilterContainer.prototype.addStep = function addStep(name, step) {
        var index = arguments[2] === undefined ? -1 : arguments[2];
        var filter = this.filters[name];
        if (!filter) {
          filter = this.filters[name] = [];
        }
        if (index === -1) {
          index = filter.length;
        }
        filter.splice(index, 0, step);
        this.filterCache = {};
      };
      RouteFilterContainer.prototype.getFilterSteps = function getFilterSteps(name) {
        if (this.filterCache[name]) {
          return this.filterCache[name];
        }
        var steps = [];
        var filter = this.filters[name];
        if (!filter) {
          return steps;
        }
        for (var i = 0,
            l = filter.length; i < l; i++) {
          if (typeof filter[i] === 'string') {
            steps.push.apply(steps, this.getFilterSteps(filter[i]));
          } else {
            steps.push(this.container.get(filter[i]));
          }
        }
        return this.filterCache[name] = steps;
      };
      return RouteFilterContainer;
    })();
    exports.RouteFilterContainer = RouteFilterContainer;
    function createRouteFilterStep(name) {
      function create(routeFilterContainer) {
        return new RouteFilterStep(name, routeFilterContainer);
      }
      ;
      create.inject = function() {
        return [RouteFilterContainer];
      };
      return create;
    }
    var RouteFilterStep = (function() {
      function RouteFilterStep(name, routeFilterContainer) {
        _classCallCheck(this, RouteFilterStep);
        this.name = name;
        this.routeFilterContainer = routeFilterContainer;
        this.isMultiStep = true;
      }
      RouteFilterStep.prototype.getSteps = function getSteps() {
        return this.routeFilterContainer.getFilterSteps(this.name);
      };
      return RouteFilterStep;
    })();
    var RouterConfiguration = (function() {
      function RouterConfiguration() {
        _classCallCheck(this, RouterConfiguration);
        this.instructions = [];
        this.options = {};
        this.pipelineSteps = [];
      }
      RouterConfiguration.prototype.addPipelineStep = function addPipelineStep(name, step) {
        this.pipelineSteps.push({
          name: name,
          step: step
        });
      };
      RouterConfiguration.prototype.map = function map(route) {
        if (Array.isArray(route)) {
          route.forEach(this.map.bind(this));
          return this;
        }
        return this.mapRoute(route);
      };
      RouterConfiguration.prototype.mapRoute = function mapRoute(config) {
        this.instructions.push(function(router) {
          var routeConfigs = [];
          if (Array.isArray(config.route)) {
            for (var i = 0,
                ii = config.route.length; i < ii; ++i) {
              var current = Object.assign({}, config);
              current.route = config.route[i];
              routeConfigs.push(current);
            }
          } else {
            routeConfigs.push(Object.assign({}, config));
          }
          var navModel = undefined;
          for (var i = 0,
              ii = routeConfigs.length; i < ii; ++i) {
            var routeConfig = routeConfigs[i];
            routeConfig.settings = routeConfig.settings || {};
            if (!navModel) {
              navModel = router.createNavModel(routeConfig);
            }
            router.addRoute(routeConfig, navModel);
          }
        });
        return this;
      };
      RouterConfiguration.prototype.mapUnknownRoutes = function mapUnknownRoutes(config) {
        this.unknownRouteConfig = config;
        return this;
      };
      RouterConfiguration.prototype.exportToRouter = function exportToRouter(router) {
        var instructions = this.instructions;
        for (var i = 0,
            ii = instructions.length; i < ii; ++i) {
          instructions[i](router);
        }
        if (this.title) {
          router.title = this.title;
        }
        if (this.unknownRouteConfig) {
          router.handleUnknownRoutes(this.unknownRouteConfig);
        }
        router.options = this.options;
        var pipelineSteps = this.pipelineSteps;
        if (pipelineSteps.length) {
          if (!router.isRoot) {
            throw new Error('Pipeline steps can only be added to the root router');
          }
          var filterContainer = router.container.get(RouteFilterContainer);
          for (var i = 0,
              ii = pipelineSteps.length; i < ii; ++i) {
            var _pipelineSteps$i = pipelineSteps[i];
            var _name = _pipelineSteps$i.name;
            var step = _pipelineSteps$i.step;
            filterContainer.addStep(_name, step);
          }
        }
      };
      return RouterConfiguration;
    })();
    exports.RouterConfiguration = RouterConfiguration;
    var Router = (function() {
      function Router(container, history) {
        _classCallCheck(this, Router);
        this.viewPorts = {};
        this.baseUrl = '';
        this.isConfigured = false;
        this.fallbackOrder = 100;
        this.recognizer = new _aureliaRouteRecognizer.RouteRecognizer();
        this.childRecognizer = new _aureliaRouteRecognizer.RouteRecognizer();
        this.routes = [];
        this.isNavigating = false;
        this.navigation = [];
        this.container = container;
        this.history = history;
        this.reset();
      }
      Router.prototype.registerViewPort = function registerViewPort(viewPort, name) {
        name = name || 'default';
        this.viewPorts[name] = viewPort;
      };
      Router.prototype.refreshBaseUrl = function refreshBaseUrl() {
        if (this.parent) {
          var baseUrl = this.parent.currentInstruction.getBaseUrl();
          this.baseUrl = this.parent.baseUrl + baseUrl;
        }
      };
      Router.prototype.refreshNavigation = function refreshNavigation() {
        var nav = this.navigation;
        for (var i = 0,
            length = nav.length; i < length; i++) {
          var current = nav[i];
          current.href = createRootedPath(current.relativeHref, this.baseUrl, this.history._hasPushState);
        }
      };
      Router.prototype.configure = function configure(callbackOrConfig) {
        this.isConfigured = true;
        if (typeof callbackOrConfig == 'function') {
          var config = new RouterConfiguration();
          callbackOrConfig(config);
          config.exportToRouter(this);
        } else {
          callbackOrConfig.exportToRouter(this);
        }
        return this;
      };
      Router.prototype.navigate = function navigate(fragment, options) {
        if (!this.isConfigured && this.parent) {
          return this.parent.navigate(fragment, options);
        }
        return this.history.navigate(resolveUrl(fragment, this.baseUrl, this.history._hasPushState), options);
      };
      Router.prototype.navigateToRoute = function navigateToRoute(route, params, options) {
        var path = this.generate(route, params);
        return this.navigate(path, options);
      };
      Router.prototype.navigateBack = function navigateBack() {
        this.history.navigateBack();
      };
      Router.prototype.createChild = function createChild(container) {
        var childRouter = new Router(container || this.container.createChild(), this.history);
        childRouter.parent = this;
        return childRouter;
      };
      Router.prototype.createNavigationInstruction = function createNavigationInstruction() {
        var url = arguments[0] === undefined ? '' : arguments[0];
        var parentInstruction = arguments[1] === undefined ? null : arguments[1];
        var fragment = url;
        var queryString = '';
        var queryIndex = url.indexOf('?');
        if (queryIndex != -1) {
          fragment = url.substr(0, queryIndex);
          queryString = url.substr(queryIndex + 1);
        }
        var results = this.recognizer.recognize(url);
        if (!results || !results.length) {
          results = this.childRecognizer.recognize(url);
        }
        if ((!results || !results.length) && this.catchAllHandler) {
          results = [{
            config: {navModel: {}},
            handler: this.catchAllHandler,
            params: {path: fragment}
          }];
        }
        if (results && results.length) {
          var first = results[0];
          var instruction = new NavigationInstruction(fragment, queryString, first.params, first.queryParams || results.queryParams, first.config || first.handler, parentInstruction);
          if (typeof first.handler === 'function') {
            return evaluateNavigationStrategy(instruction, first.handler, first);
          } else if (first.handler && 'navigationStrategy' in first.handler) {
            return evaluateNavigationStrategy(instruction, first.handler.navigationStrategy, first.handler);
          }
          return Promise.resolve(instruction);
        }
        return Promise.reject(new Error('Route not found: ' + url));
      };
      Router.prototype.createNavigationContext = function createNavigationContext(instruction) {
        instruction.navigationContext = new NavigationContext(this, instruction);
        return instruction.navigationContext;
      };
      Router.prototype.generate = function generate(name, params) {
        var hasRoute = this.recognizer.hasRoute(name);
        if ((!this.isConfigured || !hasRoute) && this.parent) {
          return this.parent.generate(name, params);
        }
        if (!hasRoute) {
          throw new Error('A route with name \'' + name + '\' could not be found. Check that `name: \'' + name + '\'` was specified in the route\'s config.');
        }
        var path = this.recognizer.generate(name, params);
        return createRootedPath(path, this.baseUrl, this.history._hasPushState);
      };
      Router.prototype.createNavModel = function createNavModel(config) {
        var navModel = new NavModel(this, 'href' in config ? config.href : config.route);
        navModel.title = config.title;
        navModel.order = config.nav;
        navModel.href = config.href;
        navModel.settings = config.settings;
        navModel.config = config;
        return navModel;
      };
      Router.prototype.addRoute = function addRoute(config, navModel) {
        validateRouteConfig(config);
        if (!('viewPorts' in config) && !config.navigationStrategy) {
          config.viewPorts = {'default': {
              moduleId: config.moduleId,
              view: config.view
            }};
        }
        if (!navModel) {
          navModel = this.createNavModel(config);
        }
        this.routes.push(config);
        var path = config.route;
        if (path.charAt(0) === '/') {
          path = path.substr(1);
        }
        var state = this.recognizer.add({
          path: path,
          handler: config
        });
        if (path) {
          var withChild = undefined,
              settings = config.settings;
          delete config.settings;
          withChild = JSON.parse(JSON.stringify(config));
          config.settings = settings;
          withChild.route = path + '/*childRoute';
          withChild.hasChildRouter = true;
          this.childRecognizer.add({
            path: withChild.route,
            handler: withChild
          });
          withChild.navModel = navModel;
          withChild.settings = config.settings;
        }
        config.navModel = navModel;
        if ((navModel.order || navModel.order === 0) && this.navigation.indexOf(navModel) === -1) {
          if (!navModel.href && navModel.href != '' && (state.types.dynamics || state.types.stars)) {
            throw new Error('Invalid route config: dynamic routes must specify an href to be included in the navigation model.');
          }
          if (typeof navModel.order != 'number') {
            navModel.order = ++this.fallbackOrder;
          }
          this.navigation.push(navModel);
          this.navigation = this.navigation.sort(function(a, b) {
            return a.order - b.order;
          });
        }
      };
      Router.prototype.hasRoute = function hasRoute(name) {
        return !!(this.recognizer.hasRoute(name) || this.parent && this.parent.hasRoute(name));
      };
      Router.prototype.hasOwnRoute = function hasOwnRoute(name) {
        return this.recognizer.hasRoute(name);
      };
      Router.prototype.handleUnknownRoutes = function handleUnknownRoutes(config) {
        var callback = function callback(instruction) {
          return new Promise(function(resolve, reject) {
            function done(inst) {
              inst = inst || instruction;
              inst.config.route = inst.params.path;
              resolve(inst);
            }
            if (!config) {
              instruction.config.moduleId = instruction.fragment;
              done(instruction);
            } else if (typeof config == 'string') {
              instruction.config.moduleId = config;
              done(instruction);
            } else if (typeof config == 'function') {
              processPotential(config(instruction), done, reject);
            } else {
              instruction.config = config;
              done(instruction);
            }
          });
        };
        this.catchAllHandler = callback;
      };
      Router.prototype.updateTitle = function updateTitle() {
        if (this.parent) {
          return this.parent.updateTitle();
        }
        this.currentInstruction.navigationContext.updateTitle();
      };
      Router.prototype.reset = function reset() {
        this.fallbackOrder = 100;
        this.recognizer = new _aureliaRouteRecognizer.RouteRecognizer();
        this.childRecognizer = new _aureliaRouteRecognizer.RouteRecognizer();
        this.routes = [];
        this.isNavigating = false;
        this.navigation = [];
        this.isConfigured = false;
      };
      _createClass(Router, [{
        key: 'isRoot',
        get: function get() {
          return false;
        }
      }]);
      return Router;
    })();
    exports.Router = Router;
    function validateRouteConfig(config) {
      if (typeof config !== 'object') {
        throw new Error('Invalid Route Config');
      }
      if (typeof config.route !== 'string') {
        throw new Error('Invalid Route Config: You must specify a route pattern.');
      }
      if (!('redirect' in config || config.moduleId || config.navigationStrategy || config.viewPorts)) {
        throw new Error('Invalid Route Config: You must specify a moduleId, redirect, navigationStrategy, or viewPorts.');
      }
    }
    function evaluateNavigationStrategy(instruction, evaluator, context) {
      return Promise.resolve(evaluator.call(context, instruction)).then(function() {
        if (!('viewPorts' in instruction.config)) {
          instruction.config.viewPorts = {'default': {moduleId: instruction.config.moduleId}};
        }
        return instruction;
      });
    }
    function createResult(ctx, next) {
      return {
        status: next.status,
        context: ctx,
        output: next.output,
        completed: next.status == pipelineStatus.completed
      };
    }
    var pipelineStatus = {
      completed: 'completed',
      cancelled: 'cancelled',
      rejected: 'rejected',
      running: 'running'
    };
    exports.pipelineStatus = pipelineStatus;
    var Pipeline = (function() {
      function Pipeline() {
        _classCallCheck(this, Pipeline);
        this.steps = [];
      }
      Pipeline.prototype.withStep = function withStep(step) {
        var run,
            steps,
            i,
            l;
        if (typeof step == 'function') {
          run = step;
        } else if (step.isMultiStep) {
          steps = step.getSteps();
          for (i = 0, l = steps.length; i < l; i++) {
            this.withStep(steps[i]);
          }
          return this;
        } else {
          run = step.run.bind(step);
        }
        this.steps.push(run);
        return this;
      };
      Pipeline.prototype.run = function run(ctx) {
        var index = -1,
            steps = this.steps,
            next,
            currentStep;
        next = function() {
          index++;
          if (index < steps.length) {
            currentStep = steps[index];
            try {
              return currentStep(ctx, next);
            } catch (e) {
              return next.reject(e);
            }
          } else {
            return next.complete();
          }
        };
        next.complete = function(output) {
          next.status = pipelineStatus.completed;
          next.output = output;
          return Promise.resolve(createResult(ctx, next));
        };
        next.cancel = function(reason) {
          next.status = pipelineStatus.cancelled;
          next.output = reason;
          return Promise.resolve(createResult(ctx, next));
        };
        next.reject = function(error) {
          next.status = pipelineStatus.rejected;
          next.output = error;
          return Promise.resolve(createResult(ctx, next));
        };
        next.status = pipelineStatus.running;
        return next();
      };
      return Pipeline;
    })();
    exports.Pipeline = Pipeline;
    var RouteLoader = (function() {
      function RouteLoader() {
        _classCallCheck(this, RouteLoader);
      }
      RouteLoader.prototype.loadRoute = function loadRoute(router, config) {
        throw Error('Route loaders must implement "loadRoute(router, config)".');
      };
      return RouteLoader;
    })();
    exports.RouteLoader = RouteLoader;
    var LoadRouteStep = (function() {
      function LoadRouteStep(routeLoader) {
        _classCallCheck(this, LoadRouteStep);
        this.routeLoader = routeLoader;
      }
      LoadRouteStep.inject = function inject() {
        return [RouteLoader];
      };
      LoadRouteStep.prototype.run = function run(navigationContext, next) {
        return loadNewRoute(this.routeLoader, navigationContext).then(next)['catch'](next.cancel);
      };
      return LoadRouteStep;
    })();
    exports.LoadRouteStep = LoadRouteStep;
    function loadNewRoute(routeLoader, navigationContext) {
      var toLoad = determineWhatToLoad(navigationContext);
      var loadPromises = toLoad.map(function(current) {
        return loadRoute(routeLoader, current.navigationContext, current.viewPortPlan);
      });
      return Promise.all(loadPromises);
    }
    function determineWhatToLoad(navigationContext, toLoad) {
      var plan = navigationContext.plan;
      var next = navigationContext.nextInstruction;
      toLoad = toLoad || [];
      for (var viewPortName in plan) {
        var viewPortPlan = plan[viewPortName];
        if (viewPortPlan.strategy == activationStrategy.replace) {
          toLoad.push({
            viewPortPlan: viewPortPlan,
            navigationContext: navigationContext
          });
          if (viewPortPlan.childNavigationContext) {
            determineWhatToLoad(viewPortPlan.childNavigationContext, toLoad);
          }
        } else {
          var viewPortInstruction = next.addViewPortInstruction(viewPortName, viewPortPlan.strategy, viewPortPlan.prevModuleId, viewPortPlan.prevComponent);
          if (viewPortPlan.childNavigationContext) {
            viewPortInstruction.childNavigationContext = viewPortPlan.childNavigationContext;
            determineWhatToLoad(viewPortPlan.childNavigationContext, toLoad);
          }
        }
      }
      return toLoad;
    }
    function loadRoute(routeLoader, navigationContext, viewPortPlan) {
      var moduleId = viewPortPlan.config.moduleId;
      var next = navigationContext.nextInstruction;
      return loadComponent(routeLoader, navigationContext, viewPortPlan.config).then(function(component) {
        var viewPortInstruction = next.addViewPortInstruction(viewPortPlan.name, viewPortPlan.strategy, moduleId, component);
        var controller = component.executionContext,
            childRouter = component.childRouter;
        if (childRouter) {
          var path = next.getWildcardPath();
          return childRouter.createNavigationInstruction(path, next).then(function(childInstruction) {
            var childNavigationContext = childRouter.createNavigationContext(childInstruction);
            viewPortPlan.childNavigationContext = childNavigationContext;
            return buildNavigationPlan(childNavigationContext).then(function(childPlan) {
              childNavigationContext.plan = childPlan;
              viewPortInstruction.childNavigationContext = childNavigationContext;
              return loadNewRoute(routeLoader, childNavigationContext);
            });
          });
        }
      });
    }
    function loadComponent(routeLoader, navigationContext, config) {
      var router = navigationContext.router,
          lifecycleArgs = navigationContext.nextInstruction.lifecycleArgs;
      return routeLoader.loadRoute(router, config).then(function(component) {
        component.router = router;
        component.config = config;
        if ('configureRouter' in component.executionContext) {
          var _component$executionContext;
          component.childRouter = component.childContainer.getChildRouter();
          var config = new RouterConfiguration();
          var result = Promise.resolve((_component$executionContext = component.executionContext).configureRouter.apply(_component$executionContext, [config, component.childRouter].concat(lifecycleArgs)));
          return result.then(function() {
            component.childRouter.configure(config);
            return component;
          });
        }
        return component;
      });
    }
    var PipelineProvider = (function() {
      function PipelineProvider(container) {
        _classCallCheck(this, PipelineProvider);
        this.container = container;
        this.steps = [BuildNavigationPlanStep, CanDeactivatePreviousStep, LoadRouteStep, createRouteFilterStep('authorize'), createRouteFilterStep('modelbind'), CanActivateNextStep, DeactivatePreviousStep, ActivateNextStep, createRouteFilterStep('precommit'), CommitChangesStep, createRouteFilterStep('postcomplete')];
      }
      PipelineProvider.inject = function inject() {
        return [_aureliaDependencyInjection.Container];
      };
      PipelineProvider.prototype.createPipeline = function createPipeline(navigationContext) {
        var _this = this;
        var pipeline = new Pipeline();
        this.steps.forEach(function(step) {
          return pipeline.withStep(_this.container.get(step));
        });
        return pipeline;
      };
      return PipelineProvider;
    })();
    exports.PipelineProvider = PipelineProvider;
    var logger = _aureliaLogging.getLogger('app-router');
    var AppRouter = (function(_Router) {
      function AppRouter(container, history, pipelineProvider, events) {
        _classCallCheck(this, AppRouter);
        _Router.call(this, container, history);
        this.pipelineProvider = pipelineProvider;
        document.addEventListener('click', handleLinkClick.bind(this), true);
        this.events = events;
        this.maxInstructionCount = 10;
      }
      _inherits(AppRouter, _Router);
      AppRouter.inject = function inject() {
        return [_aureliaDependencyInjection.Container, _aureliaHistory.History, PipelineProvider, _aureliaEventAggregator.EventAggregator];
      };
      AppRouter.prototype.loadUrl = function loadUrl(url) {
        var _this2 = this;
        return this.createNavigationInstruction(url).then(function(instruction) {
          return _this2.queueInstruction(instruction);
        })['catch'](function(error) {
          logger.error(error);
          restorePreviousLocation(_this2);
        });
      };
      AppRouter.prototype.queueInstruction = function queueInstruction(instruction) {
        var _this3 = this;
        return new Promise(function(resolve) {
          instruction.resolve = resolve;
          _this3.queue.unshift(instruction);
          _this3.dequeueInstruction();
        });
      };
      AppRouter.prototype.dequeueInstruction = function dequeueInstruction() {
        var _this4 = this;
        var instructionCount = arguments[0] === undefined ? 0 : arguments[0];
        return Promise.resolve().then(function() {
          if (_this4.isNavigating && !instructionCount) {
            return ;
          }
          var instruction = _this4.queue.shift();
          _this4.queue = [];
          if (!instruction) {
            return ;
          }
          _this4.isNavigating = true;
          if (!instructionCount) {
            _this4.events.publish('router:navigation:processing', {instruction: instruction});
          } else if (instructionCount === _this4.maxInstructionCount - 1) {
            logger.error(instructionCount + 1 + ' navigation instructions have been attempted without success. Restoring last known good location.');
            restorePreviousLocation(_this4);
            return _this4.dequeueInstruction(instructionCount + 1);
          } else if (instructionCount > _this4.maxInstructionCount) {
            throw new Error('Maximum navigation attempts exceeded. Giving up.');
          }
          var context = _this4.createNavigationContext(instruction);
          var pipeline = _this4.pipelineProvider.createPipeline(context);
          return pipeline.run(context).then(function(result) {
            return processResult(instruction, result, instructionCount, _this4);
          })['catch'](function(error) {
            return {output: error instanceof Error ? error : new Error(error)};
          }).then(function(result) {
            return resolveInstruction(instruction, result, !!instructionCount, _this4);
          });
        });
      };
      AppRouter.prototype.registerViewPort = function registerViewPort(viewPort, name) {
        var _this5 = this;
        _Router.prototype.registerViewPort.call(this, viewPort, name);
        if (!this.isActive) {
          if ('configureRouter' in this.container.viewModel) {
            var config = new RouterConfiguration();
            var result = Promise.resolve(this.container.viewModel.configureRouter(config, this));
            return result.then(function() {
              _this5.configure(config);
              _this5.activate();
            });
          } else {
            this.activate();
          }
        } else {
          this.dequeueInstruction();
        }
      };
      AppRouter.prototype.activate = function activate(options) {
        if (this.isActive) {
          return ;
        }
        this.isActive = true;
        this.options = Object.assign({routeHandler: this.loadUrl.bind(this)}, this.options, options);
        this.history.activate(this.options);
        this.dequeueInstruction();
      };
      AppRouter.prototype.deactivate = function deactivate() {
        this.isActive = false;
        this.history.deactivate();
      };
      AppRouter.prototype.reset = function reset() {
        _Router.prototype.reset.call(this);
        this.queue = [];
        this.options = null;
      };
      _createClass(AppRouter, [{
        key: 'isRoot',
        get: function get() {
          return true;
        }
      }]);
      return AppRouter;
    })(Router);
    exports.AppRouter = AppRouter;
    function findAnchor(el) {
      while (el) {
        if (el.tagName === 'A')
          return el;
        el = el.parentNode;
      }
    }
    function handleLinkClick(evt) {
      if (!this.isActive) {
        return ;
      }
      var target = findAnchor(evt.target);
      if (!target) {
        return ;
      }
      if (this.history._hasPushState) {
        if (!evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && targetIsThisWindow(target)) {
          var href = target.getAttribute('href');
          if (href !== null && !(href.charAt(0) === '#' || /^[a-z]+:/i.test(href))) {
            evt.preventDefault();
            this.history.navigate(href);
          }
        }
      }
    }
    function targetIsThisWindow(target) {
      var targetWindow = target.getAttribute('target');
      return !targetWindow || targetWindow === window.name || targetWindow === '_self' || targetWindow === 'top' && window === window.top;
    }
    function processResult(instruction, result, instructionCount, router) {
      if (!(result && 'completed' in result && 'output' in result)) {
        resut = result || {};
        result.output = new Error('Expected router pipeline to return a navigation result, but got [' + JSON.stringify(result) + '] instead.');
      }
      var finalResult = null;
      if (isNavigationCommand(result.output)) {
        result.output.navigate(router);
      } else {
        finalResult = result;
        if (!result.completed) {
          if (result.output instanceof Error) {
            logger.error(result.output);
          }
          restorePreviousLocation(router);
        }
      }
      return router.dequeueInstruction(instructionCount + 1).then(function(innerResult) {
        return finalResult || innerResult || result;
      });
    }
    function resolveInstruction(instruction, result, isInnerInstruction, router) {
      instruction.resolve(result);
      if (!isInnerInstruction) {
        router.isNavigating = false;
        var eventArgs = {
          instruction: instruction,
          result: result
        };
        var eventName = undefined;
        if (result.output instanceof Error) {
          eventName = 'error';
        } else if (!result.completed) {
          eventName = 'canceled';
        } else {
          var _queryString = instruction.queryString ? '?' + instruction.queryString : '';
          router.history.previousLocation = instruction.fragment + _queryString;
          eventName = 'success';
        }
        router.events.publish('router:navigation:' + eventName, eventArgs);
        router.events.publish('router:navigation:complete', eventArgs);
      }
      return result;
    }
    function restorePreviousLocation(router) {
      var previousLocation = router.history.previousLocation;
      if (previousLocation) {
        router.navigate(router.history.previousLocation, {
          trigger: false,
          replace: true
        });
      } else {
        logger.error('Router navigation failed, and no previous location could be restored.');
      }
    }
  }).call(__exports, __exports, __require('npm:core-js@0.9.18'), __require('github:aurelia/dependency-injection@0.9.1'), __require('github:aurelia/route-recognizer@0.6.1'), __require('github:aurelia/path@0.8.1'), __require('github:aurelia/history@0.6.1'), __require('github:aurelia/event-aggregator@0.6.2'), __require('github:aurelia/logging@0.6.2'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/templating-router@0.14.1/route-loader", ["github:aurelia/dependency-injection@0.9.1", "github:aurelia/templating@0.13.13", "github:aurelia/router@0.10.3", "github:aurelia/path@0.8.1", "github:aurelia/metadata@0.7.1"], false, function(__require, __exports, __module) {
  return (function(exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaRouter, _aureliaPath, _aureliaMetadata) {
    'use strict';
    exports.__esModule = true;
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }});
      if (superClass)
        subClass.__proto__ = superClass;
    }
    var TemplatingRouteLoader = (function(_RouteLoader) {
      function TemplatingRouteLoader(compositionEngine) {
        _classCallCheck(this, _TemplatingRouteLoader);
        _RouteLoader.call(this);
        this.compositionEngine = compositionEngine;
      }
      _inherits(TemplatingRouteLoader, _RouteLoader);
      var _TemplatingRouteLoader = TemplatingRouteLoader;
      _TemplatingRouteLoader.prototype.loadRoute = function loadRoute(router, config) {
        var childContainer = router.container.createChild(),
            instruction = {
              viewModel: _aureliaPath.relativeToFile(config.moduleId, _aureliaMetadata.Origin.get(router.container.viewModel.constructor).moduleId),
              childContainer: childContainer,
              view: config.view || config.viewStrategy
            };
        childContainer.getChildRouter = function() {
          var childRouter;
          childContainer.registerHandler(_aureliaRouter.Router, function(c) {
            return childRouter || (childRouter = router.createChild(childContainer));
          });
          return childContainer.get(_aureliaRouter.Router);
        };
        return this.compositionEngine.createViewModel(instruction).then(function(instruction) {
          instruction.executionContext = instruction.viewModel;
          instruction.router = router;
          return instruction;
        });
      };
      TemplatingRouteLoader = _aureliaDependencyInjection.inject(_aureliaTemplating.CompositionEngine)(TemplatingRouteLoader) || TemplatingRouteLoader;
      return TemplatingRouteLoader;
    })(_aureliaRouter.RouteLoader);
    exports.TemplatingRouteLoader = TemplatingRouteLoader;
  }).call(__exports, __exports, __require('github:aurelia/dependency-injection@0.9.1'), __require('github:aurelia/templating@0.13.13'), __require('github:aurelia/router@0.10.3'), __require('github:aurelia/path@0.8.1'), __require('github:aurelia/metadata@0.7.1'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/router@0.10.3", ["github:aurelia/router@0.10.3/aurelia-router"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/router@0.10.3/aurelia-router'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/templating-router@0.14.1/aurelia-templating-router", ["github:aurelia/router@0.10.3", "github:aurelia/templating-router@0.14.1/route-loader", "github:aurelia/templating-router@0.14.1/router-view", "github:aurelia/templating-router@0.14.1/route-href"], false, function(__require, __exports, __module) {
  return (function(exports, _aureliaRouter, _routeLoader, _routerView, _routeHref) {
    'use strict';
    exports.__esModule = true;
    function configure(aurelia) {
      aurelia.withSingleton(_aureliaRouter.RouteLoader, _routeLoader.TemplatingRouteLoader).withSingleton(_aureliaRouter.Router, _aureliaRouter.AppRouter).globalizeResources('./router-view', './route-href');
    }
    exports.TemplatingRouteLoader = _routeLoader.TemplatingRouteLoader;
    exports.RouterView = _routerView.RouterView;
    exports.RouteHref = _routeHref.RouteHref;
    exports.configure = configure;
  }).call(__exports, __exports, __require('github:aurelia/router@0.10.3'), __require('github:aurelia/templating-router@0.14.1/route-loader'), __require('github:aurelia/templating-router@0.14.1/router-view'), __require('github:aurelia/templating-router@0.14.1/route-href'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/templating-router@0.14.1", ["github:aurelia/templating-router@0.14.1/aurelia-templating-router"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/templating-router@0.14.1/aurelia-templating-router'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/templating-resources@0.13.3/if", ["github:aurelia/templating@0.13.13", "github:aurelia/dependency-injection@0.9.1"], false, function(__require, __exports, __module) {
  return (function(exports, _aureliaTemplating, _aureliaDependencyInjection) {
    'use strict';
    exports.__esModule = true;
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var If = (function() {
      function If(viewFactory, viewSlot) {
        _classCallCheck(this, _If);
        this.viewFactory = viewFactory;
        this.viewSlot = viewSlot;
        this.showing = false;
      }
      var _If = If;
      _If.prototype.bind = function bind(executionContext) {
        this.executionContext = executionContext;
        this.valueChanged(this.value);
      };
      _If.prototype.valueChanged = function valueChanged(newValue) {
        if (!newValue) {
          if (this.view && this.showing) {
            this.viewSlot.remove(this.view);
            this.view.unbind();
          }
          this.showing = false;
          return ;
        }
        if (!this.view) {
          this.view = this.viewFactory.create(this.executionContext);
        }
        if (!this.showing) {
          this.showing = true;
          if (!this.view.isBound) {
            this.view.bind();
          }
          this.viewSlot.add(this.view);
        }
      };
      If = _aureliaDependencyInjection.inject(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot)(If) || If;
      If = _aureliaTemplating.templateController(If) || If;
      If = _aureliaTemplating.customAttribute('if')(If) || If;
      return If;
    })();
    exports.If = If;
  }).call(__exports, __exports, __require('github:aurelia/templating@0.13.13'), __require('github:aurelia/dependency-injection@0.9.1'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/templating-resources@0.13.3/with", ["github:aurelia/dependency-injection@0.9.1", "github:aurelia/templating@0.13.13"], false, function(__require, __exports, __module) {
  return (function(exports, _aureliaDependencyInjection, _aureliaTemplating) {
    'use strict';
    exports.__esModule = true;
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var With = (function() {
      function With(viewFactory, viewSlot) {
        _classCallCheck(this, _With);
        this.viewFactory = viewFactory;
        this.viewSlot = viewSlot;
      }
      var _With = With;
      _With.prototype.valueChanged = function valueChanged(newValue) {
        if (!this.view) {
          this.view = this.viewFactory.create(newValue);
          this.viewSlot.add(this.view);
        } else {
          this.view.bind(newValue);
        }
      };
      With = _aureliaDependencyInjection.inject(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot)(With) || With;
      With = _aureliaTemplating.templateController(With) || With;
      With = _aureliaTemplating.customAttribute('with')(With) || With;
      return With;
    })();
    exports.With = With;
  }).call(__exports, __exports, __require('github:aurelia/dependency-injection@0.9.1'), __require('github:aurelia/templating@0.13.13'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/templating-resources@0.13.3/repeat", ["github:aurelia/dependency-injection@0.9.1", "github:aurelia/binding@0.8.4", "github:aurelia/templating@0.13.13"], false, function(__require, __exports, __module) {
  return (function(exports, _aureliaDependencyInjection, _aureliaBinding, _aureliaTemplating) {
    'use strict';
    exports.__esModule = true;
    var _createDecoratedClass = (function() {
      function defineProperties(target, descriptors, initializers) {
        for (var i = 0; i < descriptors.length; i++) {
          var descriptor = descriptors[i];
          var decorators = descriptor.decorators;
          var key = descriptor.key;
          delete descriptor.key;
          delete descriptor.decorators;
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ('value' in descriptor || descriptor.initializer)
            descriptor.writable = true;
          if (decorators) {
            for (var f = 0; f < decorators.length; f++) {
              var decorator = decorators[f];
              if (typeof decorator === 'function') {
                descriptor = decorator(target, key, descriptor) || descriptor;
              } else {
                throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator);
              }
            }
            if (descriptor.initializer !== undefined) {
              initializers[key] = descriptor;
              continue;
            }
          }
          Object.defineProperty(target, key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps, protoInitializers, staticInitializers) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps, protoInitializers);
        if (staticProps)
          defineProperties(Constructor, staticProps, staticInitializers);
        return Constructor;
      };
    })();
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    function _defineDecoratedPropertyDescriptor(target, key, descriptors) {
      var _descriptor = descriptors[key];
      if (!_descriptor)
        return ;
      var descriptor = {};
      for (var _key in _descriptor)
        descriptor[_key] = _descriptor[_key];
      descriptor.value = descriptor.initializer.call(target);
      Object.defineProperty(target, key, descriptor);
    }
    var Repeat = (function() {
      var _instanceInitializers = {};
      function Repeat(viewFactory, viewSlot, observerLocator) {
        _classCallCheck(this, _Repeat);
        _defineDecoratedPropertyDescriptor(this, 'items', _instanceInitializers);
        _defineDecoratedPropertyDescriptor(this, 'local', _instanceInitializers);
        _defineDecoratedPropertyDescriptor(this, 'key', _instanceInitializers);
        _defineDecoratedPropertyDescriptor(this, 'value', _instanceInitializers);
        this.viewFactory = viewFactory;
        this.viewSlot = viewSlot;
        this.observerLocator = observerLocator;
        this.local = 'item';
        this.key = 'key';
        this.value = 'value';
      }
      var _Repeat = Repeat;
      _Repeat.prototype.bind = function bind(executionContext) {
        var _this = this;
        var items = this.items,
            observer;
        this.executionContext = executionContext;
        if (!items) {
          if (this.oldItems) {
            this.removeAll();
          }
          return ;
        }
        if (this.oldItems === items) {
          if (items instanceof Map) {
            var records = _aureliaBinding.getChangeRecords(items);
            observer = this.observerLocator.getMapObserver(items);
            this.handleMapChangeRecords(items, records);
            this.disposeSubscription = observer.subscribe(function(records) {
              _this.handleMapChangeRecords(items, records);
            });
          } else {
            var splices = _aureliaBinding.calcSplices(items, 0, items.length, this.lastBoundItems, 0, this.lastBoundItems.length);
            observer = this.observerLocator.getArrayObserver(items);
            this.handleSplices(items, splices);
            this.lastBoundItems = this.oldItems = null;
            this.disposeSubscription = observer.subscribe(function(splices) {
              _this.handleSplices(items, splices);
            });
            return ;
          }
        } else if (this.oldItems) {
          this.removeAll();
        }
        this.processItems();
      };
      _Repeat.prototype.unbind = function unbind() {
        this.oldItems = this.items;
        if (this.items instanceof Array) {
          this.lastBoundItems = this.items.slice(0);
        }
        if (this.disposeSubscription) {
          this.disposeSubscription();
          this.disposeSubscription = null;
        }
      };
      _Repeat.prototype.itemsChanged = function itemsChanged() {
        this.processItems();
      };
      _Repeat.prototype.processItems = function processItems() {
        var items = this.items;
        if (this.disposeSubscription) {
          this.disposeSubscription();
          this.removeAll();
        }
        if (!items && items !== 0) {
          return ;
        }
        if (items instanceof Array) {
          this.processArrayItems(items);
        } else if (items instanceof Map) {
          this.processMapEntries(items);
        } else if (typeof items === 'number') {
          this.processNumber(items);
        } else {
          throw new Error('Object in "repeat" must be of type Array, Map or Number');
        }
      };
      _Repeat.prototype.processArrayItems = function processArrayItems(items) {
        var _this2 = this;
        var viewFactory = this.viewFactory,
            viewSlot = this.viewSlot,
            i,
            ii,
            row,
            view,
            observer;
        observer = this.observerLocator.getArrayObserver(items);
        for (i = 0, ii = items.length; i < ii; ++i) {
          row = this.createFullExecutionContext(items[i], i, ii);
          view = viewFactory.create(row);
          viewSlot.add(view);
        }
        this.disposeSubscription = observer.subscribe(function(splices) {
          _this2.handleSplices(items, splices);
        });
      };
      _Repeat.prototype.processMapEntries = function processMapEntries(items) {
        var _this3 = this;
        var viewFactory = this.viewFactory,
            viewSlot = this.viewSlot,
            index = 0,
            row,
            view,
            observer;
        observer = this.observerLocator.getMapObserver(items);
        items.forEach(function(value, key) {
          row = _this3.createFullExecutionKvpContext(key, value, index, items.size);
          view = viewFactory.create(row);
          viewSlot.add(view);
          ++index;
        });
        this.disposeSubscription = observer.subscribe(function(record) {
          _this3.handleMapChangeRecords(items, record);
        });
      };
      _Repeat.prototype.processNumber = function processNumber(value) {
        var viewFactory = this.viewFactory,
            viewSlot = this.viewSlot,
            childrenLength = viewSlot.children.length,
            i,
            ii,
            row,
            view,
            viewsToRemove;
        value = Math.floor(value);
        viewsToRemove = childrenLength - value;
        if (viewsToRemove > 0) {
          if (viewsToRemove > childrenLength) {
            viewsToRemove = childrenLength;
          }
          for (i = 0, ii = viewsToRemove; i < ii; ++i) {
            viewSlot.removeAt(childrenLength - (i + 1));
          }
          return ;
        }
        for (i = childrenLength, ii = value; i < ii; ++i) {
          row = this.createFullExecutionContext(i, i, ii);
          view = viewFactory.create(row);
          viewSlot.add(view);
        }
      };
      _Repeat.prototype.createBaseExecutionContext = function createBaseExecutionContext(data) {
        var context = {};
        context[this.local] = data;
        context.$parent = this.executionContext;
        return context;
      };
      _Repeat.prototype.createBaseExecutionKvpContext = function createBaseExecutionKvpContext(key, value) {
        var context = {};
        context[this.key] = key;
        context[this.value] = value;
        context.$parent = this.executionContext;
        return context;
      };
      _Repeat.prototype.createFullExecutionContext = function createFullExecutionContext(data, index, length) {
        var context = this.createBaseExecutionContext(data);
        return this.updateExecutionContext(context, index, length);
      };
      _Repeat.prototype.createFullExecutionKvpContext = function createFullExecutionKvpContext(key, value, index, length) {
        var context = this.createBaseExecutionKvpContext(key, value);
        return this.updateExecutionContext(context, index, length);
      };
      _Repeat.prototype.updateExecutionContext = function updateExecutionContext(context, index, length) {
        var first = index === 0,
            last = index === length - 1,
            even = index % 2 === 0;
        context.$index = index;
        context.$first = first;
        context.$last = last;
        context.$middle = !(first || last);
        context.$odd = !even;
        context.$even = even;
        return context;
      };
      _Repeat.prototype.handleSplices = function handleSplices(array, splices) {
        var viewLookup = new Map(),
            viewSlot = this.viewSlot,
            spliceIndexLow,
            viewOrPromise,
            view,
            i,
            ii,
            j,
            jj,
            row,
            splice,
            addIndex,
            end,
            itemsLeftToAdd,
            removed,
            model,
            children,
            length,
            context,
            spliceIndex;
        for (i = 0, ii = splices.length; i < ii; ++i) {
          splice = splices[i];
          addIndex = spliceIndex = splice.index;
          itemsLeftToAdd = splice.addedCount;
          end = splice.index + splice.addedCount;
          removed = splice.removed;
          if (typeof spliceIndexLow === 'undefined' || spliceIndexLow === null || spliceIndexLow > splice.index) {
            spliceIndexLow = spliceIndex;
          }
          for (j = 0, jj = removed.length; j < jj; ++j) {
            if (itemsLeftToAdd > 0) {
              view = viewSlot.children[spliceIndex + j];
              view.detached();
              context = this.createFullExecutionContext(array[addIndex + j], spliceIndex + j, array.length);
              view.bind(context);
              view.attached();
              --itemsLeftToAdd;
            } else {
              viewOrPromise = viewSlot.removeAt(addIndex + splice.addedCount);
              if (viewOrPromise) {
                viewLookup.set(removed[j], viewOrPromise);
              }
            }
          }
          addIndex += removed.length;
          for (; 0 < itemsLeftToAdd; ++addIndex) {
            model = array[addIndex];
            viewOrPromise = viewLookup.get(model);
            if (viewOrPromise instanceof Promise) {
              (function(localAddIndex, localModel) {
                viewOrPromise.then(function(view) {
                  viewLookup['delete'](localModel);
                  viewSlot.insert(localAddIndex, view);
                });
              })(addIndex, model);
            } else if (viewOrPromise) {
              viewLookup['delete'](model);
              viewSlot.insert(addIndex, viewOrPromise);
            } else {
              row = this.createBaseExecutionContext(model);
              view = this.viewFactory.create(row);
              viewSlot.insert(addIndex, view);
            }
            --itemsLeftToAdd;
          }
        }
        children = this.viewSlot.children;
        length = children.length;
        if (spliceIndexLow > 0) {
          spliceIndexLow = spliceIndexLow - 1;
        }
        for (; spliceIndexLow < length; ++spliceIndexLow) {
          this.updateExecutionContext(children[spliceIndexLow].executionContext, spliceIndexLow, length);
        }
        viewLookup.forEach(function(x) {
          if (x instanceof Promise) {
            x.then(function(y) {
              return y.unbind();
            });
          } else {
            x.unbind();
          }
        });
      };
      _Repeat.prototype.handleMapChangeRecords = function handleMapChangeRecords(map, records) {
        var viewSlot = this.viewSlot,
            key,
            i,
            ii,
            view,
            children,
            length,
            row,
            removeIndex,
            record;
        for (i = 0, ii = records.length; i < ii; ++i) {
          record = records[i];
          key = record.key;
          switch (record.type) {
            case 'update':
              removeIndex = this.getViewIndexByKey(key);
              viewSlot.removeAt(removeIndex);
              row = this.createBaseExecutionKvpContext(key, map.get(key));
              view = this.viewFactory.create(row);
              viewSlot.insert(removeIndex, view);
              break;
            case 'add':
              row = this.createBaseExecutionKvpContext(key, map.get(key));
              view = this.viewFactory.create(row);
              viewSlot.insert(map.size, view);
              break;
            case 'delete':
              if (!record.oldValue) {
                return ;
              }
              removeIndex = this.getViewIndexByKey(key);
              viewSlot.removeAt(removeIndex);
              break;
            case 'clear':
              viewSlot.removeAll();
          }
        }
        children = viewSlot.children;
        length = children.length;
        for (i = 0; i < length; i++) {
          this.updateExecutionContext(children[i].executionContext, i, length);
        }
      };
      _Repeat.prototype.getViewIndexByKey = function getViewIndexByKey(key) {
        var viewSlot = this.viewSlot,
            i,
            ii,
            child;
        for (i = 0, ii = viewSlot.children.length; i < ii; ++i) {
          child = viewSlot.children[i];
          if (child.bindings[0].source[this.key] === key) {
            return i;
          }
        }
      };
      _Repeat.prototype.removeAll = function removeAll() {
        var viewSlot = this.viewSlot,
            views,
            i;
        views = viewSlot.children;
        viewSlot.removeAll();
        i = views.length;
        while (i--) {
          views[i].unbind();
        }
      };
      _createDecoratedClass(_Repeat, [{
        key: 'items',
        decorators: [_aureliaTemplating.bindable],
        initializer: null,
        enumerable: true
      }, {
        key: 'local',
        decorators: [_aureliaTemplating.bindable],
        initializer: null,
        enumerable: true
      }, {
        key: 'key',
        decorators: [_aureliaTemplating.bindable],
        initializer: null,
        enumerable: true
      }, {
        key: 'value',
        decorators: [_aureliaTemplating.bindable],
        initializer: null,
        enumerable: true
      }], null, _instanceInitializers);
      Repeat = _aureliaDependencyInjection.inject(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot, _aureliaBinding.ObserverLocator)(Repeat) || Repeat;
      Repeat = _aureliaTemplating.templateController(Repeat) || Repeat;
      Repeat = _aureliaTemplating.customAttribute('repeat')(Repeat) || Repeat;
      return Repeat;
    })();
    exports.Repeat = Repeat;
  }).call(__exports, __exports, __require('github:aurelia/dependency-injection@0.9.1'), __require('github:aurelia/binding@0.8.4'), __require('github:aurelia/templating@0.13.13'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/templating-resources@0.13.3/show", ["github:aurelia/dependency-injection@0.9.1", "github:aurelia/templating@0.13.13"], false, function(__require, __exports, __module) {
  return (function(exports, _aureliaDependencyInjection, _aureliaTemplating) {
    'use strict';
    exports.__esModule = true;
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    function addStyleString(str) {
      var node = document.createElement('style');
      node.innerHTML = str;
      node.type = 'text/css';
      document.head.appendChild(node);
    }
    if (!!HTMLElement.prototype.createShadowRoot) {
      addStyleString('body /deep/ .aurelia-hide { display:none !important; }');
    } else {
      addStyleString('.aurelia-hide { display:none !important; }');
    }
    var Show = (function() {
      function Show(element) {
        _classCallCheck(this, _Show);
        this.element = element;
      }
      var _Show = Show;
      _Show.prototype.valueChanged = function valueChanged(newValue) {
        if (newValue) {
          this.element.classList.remove('aurelia-hide');
        } else {
          this.element.classList.add('aurelia-hide');
        }
      };
      _Show.prototype.bind = function bind(executionContext) {
        this.valueChanged(this.value);
      };
      Show = _aureliaDependencyInjection.inject(Element)(Show) || Show;
      Show = _aureliaTemplating.customAttribute('show')(Show) || Show;
      return Show;
    })();
    exports.Show = Show;
  }).call(__exports, __exports, __require('github:aurelia/dependency-injection@0.9.1'), __require('github:aurelia/templating@0.13.13'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/templating-resources@0.13.3/global-behavior", ["github:aurelia/dependency-injection@0.9.1", "github:aurelia/templating@0.13.13", "github:aurelia/logging@0.6.2"], false, function(__require, __exports, __module) {
  return (function(exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaLogging) {
    'use strict';
    exports.__esModule = true;
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var GlobalBehavior = (function() {
      function GlobalBehavior(element) {
        _classCallCheck(this, _GlobalBehavior);
        this.element = element;
      }
      var _GlobalBehavior = GlobalBehavior;
      _GlobalBehavior.prototype.bind = function bind() {
        var handler = GlobalBehavior.handlers[this.aureliaAttrName];
        if (!handler) {
          throw new Error('Binding handler not found for \'' + this.aureliaAttrName + '.' + this.aureliaCommand + '\'. Element:\n' + this.element.outerHTML + '\n');
        }
        try {
          this.handler = handler.bind(this, this.element, this.aureliaCommand) || handler;
        } catch (error) {
          throw _aureliaLogging.AggregateError('Conventional binding handler failed.', error);
        }
      };
      _GlobalBehavior.prototype.attached = function attached() {
        if (this.handler && 'attached' in this.handler) {
          this.handler.attached(this, this.element);
        }
      };
      _GlobalBehavior.prototype.detached = function detached() {
        if (this.handler && 'detached' in this.handler) {
          this.handler.detached(this, this.element);
        }
      };
      _GlobalBehavior.prototype.unbind = function unbind() {
        if (this.handler && 'unbind' in this.handler) {
          this.handler.unbind(this, this.element);
        }
        this.handler = null;
      };
      GlobalBehavior = _aureliaDependencyInjection.inject(Element)(GlobalBehavior) || GlobalBehavior;
      GlobalBehavior = _aureliaTemplating.dynamicOptions(GlobalBehavior) || GlobalBehavior;
      GlobalBehavior = _aureliaTemplating.customAttribute('global-behavior')(GlobalBehavior) || GlobalBehavior;
      return GlobalBehavior;
    })();
    exports.GlobalBehavior = GlobalBehavior;
    GlobalBehavior.createSettingsFromBehavior = function(behavior) {
      var settings = {};
      for (var key in behavior) {
        if (key === 'aureliaAttrName' || key === 'aureliaCommand' || !behavior.hasOwnProperty(key)) {
          continue;
        }
        settings[key] = behavior[key];
      }
      return settings;
    };
    GlobalBehavior.jQueryPlugins = {};
    GlobalBehavior.handlers = {jquery: {
        bind: function bind(behavior, element, command) {
          var settings = GlobalBehavior.createSettingsFromBehavior(behavior);
          var pluginName = GlobalBehavior.jQueryPlugins[command] || command;
          var jqueryElement = window.jQuery(element);
          if (!jqueryElement[pluginName]) {
            _aureliaLogging.getLogger('templating-resources').warn('Could not find the jQuery plugin ' + pluginName + ', possibly due to case mismatch. Trying to enumerate jQuery methods in lowercase. Add the correctly cased plugin name to the GlobalBehavior to avoid this performance hit.');
            for (var prop in jqueryElement) {
              if (prop.toLowerCase() === pluginName) {
                pluginName = prop;
              }
            }
          }
          behavior.plugin = jqueryElement[pluginName](settings);
        },
        unbind: function unbind(behavior, element) {
          if (typeof behavior.plugin.destroy === 'function') {
            behavior.plugin.destroy();
            behavior.plugin = null;
          }
        }
      }};
  }).call(__exports, __exports, __require('github:aurelia/dependency-injection@0.9.1'), __require('github:aurelia/templating@0.13.13'), __require('github:aurelia/logging@0.6.2'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/templating-resources@0.13.3/sanitize-html", ["github:aurelia/binding@0.8.4"], false, function(__require, __exports, __module) {
  return (function(exports, _aureliaBinding) {
    'use strict';
    exports.__esModule = true;
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    var SanitizeHtmlValueConverter = (function() {
      function SanitizeHtmlValueConverter() {
        _classCallCheck(this, _SanitizeHtmlValueConverter);
        this.sanitizer = SanitizeHtmlValueConverter.defaultSanitizer;
      }
      var _SanitizeHtmlValueConverter = SanitizeHtmlValueConverter;
      _SanitizeHtmlValueConverter.defaultSanitizer = function defaultSanitizer(untrustedMarkup) {
        return untrustedMarkup.replace(SCRIPT_REGEX, '');
      };
      _SanitizeHtmlValueConverter.prototype.toView = function toView(untrustedMarkup) {
        if (untrustedMarkup === null) {
          return null;
        }
        return this.sanitizer(untrustedMarkup);
      };
      SanitizeHtmlValueConverter = _aureliaBinding.valueConverter('sanitizeHtml')(SanitizeHtmlValueConverter) || SanitizeHtmlValueConverter;
      return SanitizeHtmlValueConverter;
    })();
    exports.SanitizeHtmlValueConverter = SanitizeHtmlValueConverter;
  }).call(__exports, __exports, __require('github:aurelia/binding@0.8.4'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/templating-resources@0.13.3/replaceable", ["github:aurelia/dependency-injection@0.9.1", "github:aurelia/templating@0.13.13"], false, function(__require, __exports, __module) {
  return (function(exports, _aureliaDependencyInjection, _aureliaTemplating) {
    'use strict';
    exports.__esModule = true;
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var Replaceable = (function() {
      function Replaceable(viewFactory, viewSlot) {
        _classCallCheck(this, _Replaceable);
        viewSlot.add(viewFactory.create());
      }
      var _Replaceable = Replaceable;
      Replaceable = _aureliaDependencyInjection.inject(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot)(Replaceable) || Replaceable;
      Replaceable = _aureliaTemplating.templateController(Replaceable) || Replaceable;
      Replaceable = _aureliaTemplating.customAttribute('replaceable')(Replaceable) || Replaceable;
      return Replaceable;
    })();
    exports.Replaceable = Replaceable;
  }).call(__exports, __exports, __require('github:aurelia/dependency-injection@0.9.1'), __require('github:aurelia/templating@0.13.13'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/templating-resources@0.13.3/focus", ["github:aurelia/templating@0.13.13", "github:aurelia/binding@0.8.4", "github:aurelia/dependency-injection@0.9.1", "github:aurelia/task-queue@0.6.1"], false, function(__require, __exports, __module) {
  return (function(exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _aureliaTaskQueue) {
    'use strict';
    exports.__esModule = true;
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var Focus = (function() {
      function Focus(element, taskQueue) {
        var _this = this;
        _classCallCheck(this, _Focus);
        this.element = element;
        this.taskQueue = taskQueue;
        this.focusListener = function(e) {
          _this.value = true;
        };
        this.blurListener = function(e) {
          if (document.activeElement !== _this.element) {
            _this.value = false;
          }
        };
      }
      var _Focus = Focus;
      _Focus.prototype.valueChanged = function valueChanged(newValue) {
        if (newValue) {
          this.giveFocus();
        } else {
          this.element.blur();
        }
      };
      _Focus.prototype.giveFocus = function giveFocus() {
        var _this2 = this;
        this.taskQueue.queueMicroTask(function() {
          if (_this2.value) {
            _this2.element.focus();
          }
        });
      };
      _Focus.prototype.attached = function attached() {
        this.element.addEventListener('focus', this.focusListener);
        this.element.addEventListener('blur', this.blurListener);
      };
      _Focus.prototype.detached = function detached() {
        this.element.removeEventListener('focus', this.focusListener);
        this.element.removeEventListener('blur', this.blurListener);
      };
      Focus = _aureliaDependencyInjection.inject(Element, _aureliaTaskQueue.TaskQueue)(Focus) || Focus;
      Focus = _aureliaTemplating.customAttribute('focus', _aureliaBinding.bindingMode.twoWay)(Focus) || Focus;
      return Focus;
    })();
    exports.Focus = Focus;
  }).call(__exports, __exports, __require('github:aurelia/templating@0.13.13'), __require('github:aurelia/binding@0.8.4'), __require('github:aurelia/dependency-injection@0.9.1'), __require('github:aurelia/task-queue@0.6.1'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/templating-resources@0.13.3/compose", ["github:aurelia/dependency-injection@0.9.1", "github:aurelia/task-queue@0.6.1", "github:aurelia/templating@0.13.13"], false, function(__require, __exports, __module) {
  return (function(exports, _aureliaDependencyInjection, _aureliaTaskQueue, _aureliaTemplating) {
    'use strict';
    exports.__esModule = true;
    var _createDecoratedClass = (function() {
      function defineProperties(target, descriptors, initializers) {
        for (var i = 0; i < descriptors.length; i++) {
          var descriptor = descriptors[i];
          var decorators = descriptor.decorators;
          var key = descriptor.key;
          delete descriptor.key;
          delete descriptor.decorators;
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ('value' in descriptor || descriptor.initializer)
            descriptor.writable = true;
          if (decorators) {
            for (var f = 0; f < decorators.length; f++) {
              var decorator = decorators[f];
              if (typeof decorator === 'function') {
                descriptor = decorator(target, key, descriptor) || descriptor;
              } else {
                throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator);
              }
            }
            if (descriptor.initializer !== undefined) {
              initializers[key] = descriptor;
              continue;
            }
          }
          Object.defineProperty(target, key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps, protoInitializers, staticInitializers) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps, protoInitializers);
        if (staticProps)
          defineProperties(Constructor, staticProps, staticInitializers);
        return Constructor;
      };
    })();
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    function _defineDecoratedPropertyDescriptor(target, key, descriptors) {
      var _descriptor = descriptors[key];
      if (!_descriptor)
        return ;
      var descriptor = {};
      for (var _key in _descriptor)
        descriptor[_key] = _descriptor[_key];
      descriptor.value = descriptor.initializer.call(target);
      Object.defineProperty(target, key, descriptor);
    }
    var Compose = (function() {
      var _instanceInitializers = {};
      function Compose(element, container, compositionEngine, viewSlot, viewResources, taskQueue) {
        _classCallCheck(this, _Compose);
        _defineDecoratedPropertyDescriptor(this, 'model', _instanceInitializers);
        _defineDecoratedPropertyDescriptor(this, 'view', _instanceInitializers);
        _defineDecoratedPropertyDescriptor(this, 'viewModel', _instanceInitializers);
        this.element = element;
        this.container = container;
        this.compositionEngine = compositionEngine;
        this.viewSlot = viewSlot;
        this.viewResources = viewResources;
        this.taskQueue = taskQueue;
      }
      var _Compose = Compose;
      _Compose.prototype.bind = function bind(executionContext) {
        this.executionContext = executionContext;
        processInstruction(this, createInstruction(this, {
          view: this.view,
          viewModel: this.viewModel,
          model: this.model
        }));
      };
      _Compose.prototype.modelChanged = function modelChanged(newValue, oldValue) {
        var _this = this;
        if (this.currentInstruction) {
          this.currentInstruction.model = newValue;
          return ;
        }
        this.taskQueue.queueMicroTask(function() {
          if (_this.currentInstruction) {
            _this.currentInstruction.model = newValue;
            return ;
          }
          var vm = _this.currentViewModel;
          if (vm && typeof vm.activate === 'function') {
            vm.activate(newValue);
          }
        });
      };
      _Compose.prototype.viewChanged = function viewChanged(newValue, oldValue) {
        var _this2 = this;
        var instruction = createInstruction(this, {
          view: newValue,
          viewModel: this.currentViewModel || this.viewModel,
          model: this.model
        });
        if (this.currentInstruction) {
          this.currentInstruction = instruction;
          return ;
        }
        this.currentInstruction = instruction;
        this.taskQueue.queueMicroTask(function() {
          return processInstruction(_this2, _this2.currentInstruction);
        });
      };
      _Compose.prototype.viewModelChanged = function viewModelChanged(newValue, oldValue) {
        var _this3 = this;
        var instruction = createInstruction(this, {
          viewModel: newValue,
          view: this.view,
          model: this.model
        });
        if (this.currentInstruction) {
          this.currentInstruction = instruction;
          return ;
        }
        this.currentInstruction = instruction;
        this.taskQueue.queueMicroTask(function() {
          return processInstruction(_this3, _this3.currentInstruction);
        });
      };
      _createDecoratedClass(_Compose, [{
        key: 'model',
        decorators: [_aureliaTemplating.bindable],
        initializer: null,
        enumerable: true
      }, {
        key: 'view',
        decorators: [_aureliaTemplating.bindable],
        initializer: null,
        enumerable: true
      }, {
        key: 'viewModel',
        decorators: [_aureliaTemplating.bindable],
        initializer: null,
        enumerable: true
      }], null, _instanceInitializers);
      Compose = _aureliaDependencyInjection.inject(Element, _aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine, _aureliaTemplating.ViewSlot, _aureliaTemplating.ViewResources, _aureliaTaskQueue.TaskQueue)(Compose) || Compose;
      Compose = _aureliaTemplating.noView(Compose) || Compose;
      Compose = _aureliaTemplating.customElement('compose')(Compose) || Compose;
      return Compose;
    })();
    exports.Compose = Compose;
    function createInstruction(composer, instruction) {
      return Object.assign(instruction, {
        executionContext: composer.executionContext,
        container: composer.container,
        viewSlot: composer.viewSlot,
        viewResources: composer.viewResources,
        currentBehavior: composer.currentBehavior,
        host: composer.element
      });
    }
    function processInstruction(composer, instruction) {
      composer.currentInstruction = null;
      composer.compositionEngine.compose(instruction).then(function(next) {
        composer.currentBehavior = next;
        composer.currentViewModel = next ? next.executionContext : null;
      });
    }
  }).call(__exports, __exports, __require('github:aurelia/dependency-injection@0.9.1'), __require('github:aurelia/task-queue@0.6.1'), __require('github:aurelia/templating@0.13.13'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/templating-resources@0.13.3/aurelia-templating-resources", ["github:aurelia/templating-resources@0.13.3/compose", "github:aurelia/templating-resources@0.13.3/if", "github:aurelia/templating-resources@0.13.3/with", "github:aurelia/templating-resources@0.13.3/repeat", "github:aurelia/templating-resources@0.13.3/show", "github:aurelia/templating-resources@0.13.3/global-behavior", "github:aurelia/templating-resources@0.13.3/sanitize-html", "github:aurelia/templating-resources@0.13.3/replaceable", "github:aurelia/templating-resources@0.13.3/focus"], false, function(__require, __exports, __module) {
  return (function(exports, _compose, _if, _with, _repeat, _show, _globalBehavior, _sanitizeHtml, _replaceable, _focus) {
    'use strict';
    exports.__esModule = true;
    function configure(aurelia) {
      aurelia.globalizeResources('./compose', './if', './with', './repeat', './show', './replaceable', './global-behavior', './sanitize-html', './focus');
    }
    exports.Compose = _compose.Compose;
    exports.If = _if.If;
    exports.With = _with.With;
    exports.Repeat = _repeat.Repeat;
    exports.Show = _show.Show;
    exports.SanitizeHtmlValueConverter = _sanitizeHtml.SanitizeHtmlValueConverter;
    exports.GlobalBehavior = _globalBehavior.GlobalBehavior;
    exports.Replaceable = _replaceable.Replaceable;
    exports.Focus = _focus.Focus;
    exports.configure = configure;
  }).call(__exports, __exports, __require('github:aurelia/templating-resources@0.13.3/compose'), __require('github:aurelia/templating-resources@0.13.3/if'), __require('github:aurelia/templating-resources@0.13.3/with'), __require('github:aurelia/templating-resources@0.13.3/repeat'), __require('github:aurelia/templating-resources@0.13.3/show'), __require('github:aurelia/templating-resources@0.13.3/global-behavior'), __require('github:aurelia/templating-resources@0.13.3/sanitize-html'), __require('github:aurelia/templating-resources@0.13.3/replaceable'), __require('github:aurelia/templating-resources@0.13.3/focus'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/templating-resources@0.13.3", ["github:aurelia/templating-resources@0.13.3/aurelia-templating-resources"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/templating-resources@0.13.3/aurelia-templating-resources'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/templating-binding@0.13.2/aurelia-templating-binding", ["github:aurelia/binding@0.8.4", "github:aurelia/templating@0.13.13", "github:aurelia/logging@0.6.2"], false, function(__require, __exports, __module) {
  return (function(exports, _aureliaBinding, _aureliaTemplating, _aureliaLogging) {
    'use strict';
    exports.__esModule = true;
    exports.configure = configure;
    function _inherits(subClass, superClass) {
      if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }});
      if (superClass)
        subClass.__proto__ = superClass;
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var SyntaxInterpreter = (function() {
      function SyntaxInterpreter(parser, observerLocator, eventManager) {
        _classCallCheck(this, SyntaxInterpreter);
        this.parser = parser;
        this.observerLocator = observerLocator;
        this.eventManager = eventManager;
      }
      SyntaxInterpreter.inject = function inject() {
        return [_aureliaBinding.Parser, _aureliaBinding.ObserverLocator, _aureliaBinding.EventManager];
      };
      SyntaxInterpreter.prototype.interpret = function interpret(resources, element, info, existingInstruction) {
        if (info.command in this) {
          return this[info.command](resources, element, info, existingInstruction);
        }
        return this.handleUnknownCommand(resources, element, info, existingInstruction);
      };
      SyntaxInterpreter.prototype.handleUnknownCommand = function handleUnknownCommand(resources, element, info, existingInstruction) {
        var attrName = info.attrName,
            command = info.command;
        var instruction = this.options(resources, element, info, existingInstruction);
        instruction.alteredAttr = true;
        instruction.attrName = 'global-behavior';
        instruction.attributes.aureliaAttrName = attrName;
        instruction.attributes.aureliaCommand = command;
        return instruction;
      };
      SyntaxInterpreter.prototype.determineDefaultBindingMode = function determineDefaultBindingMode(element, attrName) {
        var tagName = element.tagName.toLowerCase();
        if (tagName === 'input') {
          return attrName === 'value' || attrName === 'checked' || attrName === 'files' ? _aureliaBinding.bindingMode.twoWay : _aureliaBinding.bindingMode.oneWay;
        } else if (tagName == 'textarea' || tagName == 'select') {
          return attrName == 'value' ? _aureliaBinding.bindingMode.twoWay : _aureliaBinding.bindingMode.oneWay;
        } else if (attrName === 'textcontent' || attrName === 'innerhtml') {
          return element.contentEditable === 'true' ? _aureliaBinding.bindingMode.twoWay : _aureliaBinding.bindingMode.oneWay;
        } else if (attrName === 'scrolltop' || attrName === 'scrollleft') {
          return _aureliaBinding.bindingMode.twoWay;
        }
        return _aureliaBinding.bindingMode.oneWay;
      };
      SyntaxInterpreter.prototype.bind = function bind(resources, element, info, existingInstruction) {
        var instruction = existingInstruction || {
          attrName: info.attrName,
          attributes: {}
        };
        instruction.attributes[info.attrName] = new _aureliaBinding.BindingExpression(this.observerLocator, this.attributeMap[info.attrName] || info.attrName, this.parser.parse(info.attrValue), info.defaultBindingMode || this.determineDefaultBindingMode(element, info.attrName), resources.valueConverterLookupFunction);
        return instruction;
      };
      SyntaxInterpreter.prototype.trigger = function trigger(resources, element, info) {
        return new _aureliaBinding.ListenerExpression(this.eventManager, info.attrName, this.parser.parse(info.attrValue), false, true);
      };
      SyntaxInterpreter.prototype.delegate = function delegate(resources, element, info) {
        return new _aureliaBinding.ListenerExpression(this.eventManager, info.attrName, this.parser.parse(info.attrValue), true, true);
      };
      SyntaxInterpreter.prototype.call = function call(resources, element, info, existingInstruction) {
        var instruction = existingInstruction || {
          attrName: info.attrName,
          attributes: {}
        };
        instruction.attributes[info.attrName] = new _aureliaBinding.CallExpression(this.observerLocator, info.attrName, this.parser.parse(info.attrValue), resources.valueConverterLookupFunction);
        return instruction;
      };
      SyntaxInterpreter.prototype.options = function options(resources, element, info, existingInstruction) {
        var instruction = existingInstruction || {
          attrName: info.attrName,
          attributes: {}
        },
            attrValue = info.attrValue,
            language = this.language,
            name = null,
            target = '',
            current,
            i,
            ii;
        for (i = 0, ii = attrValue.length; i < ii; ++i) {
          current = attrValue[i];
          if (current === ';') {
            info = language.inspectAttribute(resources, name, target.trim());
            language.createAttributeInstruction(resources, element, info, instruction);
            if (!instruction.attributes[info.attrName]) {
              instruction.attributes[info.attrName] = info.attrValue;
            }
            target = '';
            name = null;
          } else if (current === ':' && name === null) {
            name = target.trim();
            target = '';
          } else {
            target += current;
          }
        }
        if (name !== null) {
          info = language.inspectAttribute(resources, name, target.trim());
          language.createAttributeInstruction(resources, element, info, instruction);
          if (!instruction.attributes[info.attrName]) {
            instruction.attributes[info.attrName] = info.attrValue;
          }
        }
        return instruction;
      };
      return SyntaxInterpreter;
    })();
    exports.SyntaxInterpreter = SyntaxInterpreter;
    SyntaxInterpreter.prototype['for'] = function(resources, element, info, existingInstruction) {
      var parts,
          keyValue,
          instruction,
          attrValue,
          isDestructuring;
      attrValue = info.attrValue;
      isDestructuring = attrValue.match(/[[].+[\]]/);
      parts = isDestructuring ? attrValue.split('of ') : attrValue.split(' of ');
      if (parts.length !== 2) {
        throw new Error('Incorrect syntax for "for". The form is: "$local of $items" or "[$key, $value] of $items".');
      }
      instruction = existingInstruction || {
        attrName: info.attrName,
        attributes: {}
      };
      if (isDestructuring) {
        keyValue = parts[0].replace(/[[\]]/g, '').replace(/,/g, ' ').replace(/\s+/g, ' ').trim().split(' ');
        instruction.attributes.key = keyValue[0];
        instruction.attributes.value = keyValue[1];
      } else {
        instruction.attributes.local = parts[0];
      }
      instruction.attributes.items = new _aureliaBinding.BindingExpression(this.observerLocator, 'items', this.parser.parse(parts[1]), _aureliaBinding.bindingMode.oneWay, resources.valueConverterLookupFunction);
      return instruction;
    };
    SyntaxInterpreter.prototype['two-way'] = function(resources, element, info, existingInstruction) {
      var instruction = existingInstruction || {
        attrName: info.attrName,
        attributes: {}
      };
      instruction.attributes[info.attrName] = new _aureliaBinding.BindingExpression(this.observerLocator, this.attributeMap[info.attrName] || info.attrName, this.parser.parse(info.attrValue), _aureliaBinding.bindingMode.twoWay, resources.valueConverterLookupFunction);
      return instruction;
    };
    SyntaxInterpreter.prototype['one-way'] = function(resources, element, info, existingInstruction) {
      var instruction = existingInstruction || {
        attrName: info.attrName,
        attributes: {}
      };
      instruction.attributes[info.attrName] = new _aureliaBinding.BindingExpression(this.observerLocator, this.attributeMap[info.attrName] || info.attrName, this.parser.parse(info.attrValue), _aureliaBinding.bindingMode.oneWay, resources.valueConverterLookupFunction);
      return instruction;
    };
    SyntaxInterpreter.prototype['one-time'] = function(resources, element, info, existingInstruction) {
      var instruction = existingInstruction || {
        attrName: info.attrName,
        attributes: {}
      };
      instruction.attributes[info.attrName] = new _aureliaBinding.BindingExpression(this.observerLocator, this.attributeMap[info.attrName] || info.attrName, this.parser.parse(info.attrValue), _aureliaBinding.bindingMode.oneTime, resources.valueConverterLookupFunction);
      return instruction;
    };
    var info = {},
        logger = _aureliaLogging.getLogger('templating-binding');
    var TemplatingBindingLanguage = (function(_BindingLanguage) {
      function TemplatingBindingLanguage(parser, observerLocator, syntaxInterpreter) {
        _classCallCheck(this, TemplatingBindingLanguage);
        _BindingLanguage.call(this);
        this.parser = parser;
        this.observerLocator = observerLocator;
        this.syntaxInterpreter = syntaxInterpreter;
        this.emptyStringExpression = this.parser.parse('\'\'');
        syntaxInterpreter.language = this;
        this.attributeMap = syntaxInterpreter.attributeMap = {
          'contenteditable': 'contentEditable',
          'for': 'htmlFor',
          'tabindex': 'tabIndex',
          'textcontent': 'textContent',
          'innerhtml': 'innerHTML',
          'maxlength': 'maxLength',
          'minlength': 'minLength',
          'formaction': 'formAction',
          'formenctype': 'formEncType',
          'formmethod': 'formMethod',
          'formnovalidate': 'formNoValidate',
          'formtarget': 'formTarget',
          'rowspan': 'rowSpan',
          'colspan': 'colSpan',
          'scrolltop': 'scrollTop',
          'scrollleft': 'scrollLeft',
          'readonly': 'readOnly'
        };
      }
      _inherits(TemplatingBindingLanguage, _BindingLanguage);
      TemplatingBindingLanguage.inject = function inject() {
        return [_aureliaBinding.Parser, _aureliaBinding.ObserverLocator, SyntaxInterpreter];
      };
      TemplatingBindingLanguage.prototype.inspectAttribute = function inspectAttribute(resources, attrName, attrValue) {
        var parts = attrName.split('.');
        info.defaultBindingMode = null;
        if (parts.length == 2) {
          info.attrName = parts[0].trim();
          info.attrValue = attrValue;
          info.command = parts[1].trim();
          if (info.command === 'ref') {
            info.expression = new _aureliaBinding.NameExpression(attrValue, info.attrName);
            info.command = null;
            info.attrName = 'ref';
          } else {
            info.expression = null;
          }
        } else if (attrName == 'ref') {
          info.attrName = attrName;
          info.attrValue = attrValue;
          info.command = null;
          info.expression = new _aureliaBinding.NameExpression(attrValue, 'element');
        } else {
          info.attrName = attrName;
          info.attrValue = attrValue;
          info.command = null;
          info.expression = this.parseContent(resources, attrName, attrValue);
        }
        return info;
      };
      TemplatingBindingLanguage.prototype.createAttributeInstruction = function createAttributeInstruction(resources, element, info, existingInstruction) {
        var instruction;
        if (info.expression) {
          if (info.attrName === 'ref') {
            return info.expression;
          }
          instruction = existingInstruction || {
            attrName: info.attrName,
            attributes: {}
          };
          instruction.attributes[info.attrName] = info.expression;
        } else if (info.command) {
          instruction = this.syntaxInterpreter.interpret(resources, element, info, existingInstruction);
        }
        return instruction;
      };
      TemplatingBindingLanguage.prototype.parseText = function parseText(resources, value) {
        return this.parseContent(resources, 'textContent', value);
      };
      TemplatingBindingLanguage.prototype.parseContent = function parseContent(resources, attrName, attrValue) {
        var i = attrValue.indexOf('${', 0),
            ii = attrValue.length,
            char,
            pos = 0,
            open = 0,
            quote = null,
            interpolationStart,
            parts,
            partIndex = 0;
        while (i >= 0 && i < ii - 2) {
          open = 1;
          interpolationStart = i;
          i += 2;
          do {
            char = attrValue[i];
            i++;
            switch (char) {
              case '\'':
              case '"':
                if (quote === null) {
                  quote = char;
                } else if (quote === char) {
                  quote = null;
                }
                continue;
              case '\\':
                i++;
                continue;
            }
            if (quote !== null) {
              continue;
            }
            if (char === '{') {
              open++;
            } else if (char === '}') {
              open--;
            }
          } while (open > 0 && i < ii);
          if (open === 0) {
            parts = parts || [];
            if (attrValue[interpolationStart - 1] === '\\' && attrValue[interpolationStart - 2] !== '\\') {
              parts[partIndex] = attrValue.substring(pos, interpolationStart - 1) + attrValue.substring(interpolationStart, i);
              partIndex++;
              parts[partIndex] = this.emptyStringExpression;
              partIndex++;
            } else {
              parts[partIndex] = attrValue.substring(pos, interpolationStart);
              partIndex++;
              parts[partIndex] = this.parser.parse(attrValue.substring(interpolationStart + 2, i - 1));
              partIndex++;
            }
            pos = i;
            i = attrValue.indexOf('${', i);
          } else {
            break;
          }
        }
        if (partIndex === 0) {
          return null;
        }
        parts[partIndex] = attrValue.substr(pos);
        return new InterpolationBindingExpression(this.observerLocator, this.attributeMap[attrName] || attrName, parts, _aureliaBinding.bindingMode.oneWay, resources.valueConverterLookupFunction, attrName);
      };
      return TemplatingBindingLanguage;
    })(_aureliaTemplating.BindingLanguage);
    exports.TemplatingBindingLanguage = TemplatingBindingLanguage;
    var InterpolationBindingExpression = (function() {
      function InterpolationBindingExpression(observerLocator, targetProperty, parts, mode, valueConverterLookupFunction, attribute) {
        _classCallCheck(this, InterpolationBindingExpression);
        this.observerLocator = observerLocator;
        this.targetProperty = targetProperty;
        this.parts = parts;
        this.mode = mode;
        this.valueConverterLookupFunction = valueConverterLookupFunction;
        this.attribute = this.attrToRemove = attribute;
        this.discrete = false;
      }
      InterpolationBindingExpression.prototype.createBinding = function createBinding(target) {
        return new InterpolationBinding(this.observerLocator, this.parts, target, this.targetProperty, this.mode, this.valueConverterLookupFunction);
      };
      return InterpolationBindingExpression;
    })();
    exports.InterpolationBindingExpression = InterpolationBindingExpression;
    var InterpolationBinding = (function() {
      function InterpolationBinding(observerLocator, parts, target, targetProperty, mode, valueConverterLookupFunction) {
        _classCallCheck(this, InterpolationBinding);
        if (targetProperty === 'style') {
          logger.info('Internet Explorer does not support interpolation in "style" attributes.  Use the style attribute\'s alias, "css" instead.');
        } else if (target.parentElement && target.parentElement.nodeName === 'TEXTAREA' && targetProperty === 'textContent') {
          throw new Error('Interpolation binding cannot be used in the content of a textarea element.  Use <textarea value.bind="expression"></textarea> instead.');
        }
        this.observerLocator = observerLocator;
        this.parts = parts;
        this.targetProperty = observerLocator.getObserver(target, targetProperty);
        this.mode = mode;
        this.valueConverterLookupFunction = valueConverterLookupFunction;
        this.toDispose = [];
      }
      InterpolationBinding.prototype.getObserver = function getObserver(obj, propertyName) {
        return this.observerLocator.getObserver(obj, propertyName);
      };
      InterpolationBinding.prototype.bind = function bind(source) {
        this.source = source;
        if (this.mode == _aureliaBinding.bindingMode.oneWay) {
          this.unbind();
          this.connect();
          this.setValue();
        } else {
          this.setValue();
        }
      };
      InterpolationBinding.prototype.setValue = function setValue() {
        var value = this.interpolate();
        this.targetProperty.setValue(value);
      };
      InterpolationBinding.prototype.partChanged = function partChanged(newValue, oldValue, connecting) {
        var _this = this;
        var map,
            info;
        if (!connecting) {
          this.setValue();
        }
        if (oldValue instanceof Array) {
          map = this.arrayPartMap;
          info = map ? map.get(oldValue) : null;
          if (info) {
            info.refs--;
            if (info.refs === 0) {
              info.dispose();
              map['delete'](oldValue);
            }
          }
        }
        if (newValue instanceof Array) {
          map = this.arrayPartMap || (this.arrayPartMap = new Map());
          info = map.get(newValue);
          if (!info) {
            info = {
              refs: 0,
              dispose: this.observerLocator.getArrayObserver(newValue).subscribe(function() {
                return _this.setValue();
              })
            };
            map.set(newValue, info);
          }
          info.refs++;
        }
      };
      InterpolationBinding.prototype.connect = function connect() {
        var info,
            parts = this.parts,
            source = this.source,
            toDispose = this.toDispose = [],
            partChanged = this.partChanged.bind(this),
            i,
            ii;
        for (i = 0, ii = parts.length; i < ii; ++i) {
          if (i % 2 === 0) {} else {
            info = parts[i].connect(this, source);
            if (info.observer) {
              toDispose.push(info.observer.subscribe(partChanged));
            }
            if (info.value instanceof Array) {
              partChanged(info.value, undefined, true);
            }
          }
        }
      };
      InterpolationBinding.prototype.interpolate = function interpolate() {
        var value = '',
            parts = this.parts,
            source = this.source,
            valueConverterLookupFunction = this.valueConverterLookupFunction,
            i,
            ii,
            temp;
        for (i = 0, ii = parts.length; i < ii; ++i) {
          if (i % 2 === 0) {
            value += parts[i];
          } else {
            temp = parts[i].evaluate(source, valueConverterLookupFunction);
            value += typeof temp !== 'undefined' && temp !== null ? temp.toString() : '';
          }
        }
        return value;
      };
      InterpolationBinding.prototype.unbind = function unbind() {
        var i,
            ii,
            toDispose = this.toDispose,
            map = this.arrayPartMap;
        if (toDispose) {
          for (i = 0, ii = toDispose.length; i < ii; ++i) {
            toDispose[i]();
          }
        }
        this.toDispose = null;
        if (map) {
          for (var _iterator = map.values(),
              _isArray = Array.isArray(_iterator),
              _i = 0,
              _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ; ) {
            if (_isArray) {
              if (_i >= _iterator.length)
                break;
              toDispose = _iterator[_i++];
            } else {
              _i = _iterator.next();
              if (_i.done)
                break;
              toDispose = _i.value;
            }
            toDispose.dispose();
          }
          map.clear();
        }
        this.arrayPartMap = null;
      };
      return InterpolationBinding;
    })();
    function configure(aurelia) {
      var instance,
          getInstance = function getInstance(c) {
            return instance || (instance = c.invoke(TemplatingBindingLanguage));
          };
      if (aurelia.container.hasHandler(TemplatingBindingLanguage)) {
        instance = aurelia.container.get(TemplatingBindingLanguage);
      } else {
        aurelia.container.registerHandler(TemplatingBindingLanguage, getInstance);
      }
      aurelia.container.registerHandler(_aureliaTemplating.BindingLanguage, getInstance);
    }
  }).call(__exports, __exports, __require('github:aurelia/binding@0.8.4'), __require('github:aurelia/templating@0.13.13'), __require('github:aurelia/logging@0.6.2'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/templating-binding@0.13.2", ["github:aurelia/templating-binding@0.13.2/aurelia-templating-binding"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/templating-binding@0.13.2/aurelia-templating-binding'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/animator-css@0.14.1/aurelia-animator-css", ["github:aurelia/templating@0.13.13"], false, function(__require, __exports, __module) {
  return (function(exports, _aureliaTemplating) {
    'use strict';
    exports.__esModule = true;
    exports.configure = configure;
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var CssAnimator = (function() {
      function CssAnimator() {
        _classCallCheck(this, CssAnimator);
        this.animationStack = [];
        this.useAnimationDoneClasses = false;
        this.animationEnteredClass = 'au-entered';
        this.animationLeftClass = 'au-left';
        this.isAnimating = false;
        this.animationTimeout = 50;
      }
      CssAnimator.prototype._addMultipleEventListener = function _addMultipleEventListener(el, s, fn) {
        var evts = s.split(' '),
            i,
            ii;
        for (i = 0, ii = evts.length; i < ii; ++i) {
          el.addEventListener(evts[i], fn, false);
        }
      };
      CssAnimator.prototype._addAnimationToStack = function _addAnimationToStack(animId) {
        if (this.animationStack.indexOf(animId) < 0) {
          this.animationStack.push(animId);
        }
      };
      CssAnimator.prototype._removeAnimationFromStack = function _removeAnimationFromStack(animId) {
        var idx = this.animationStack.indexOf(animId);
        if (idx > -1) {
          this.animationStack.splice(idx, 1);
        }
      };
      CssAnimator.prototype._getElementAnimationDelay = function _getElementAnimationDelay(element) {
        var styl = window.getComputedStyle(element);
        var prop,
            delay;
        if (styl.getPropertyValue('animation-delay')) {
          prop = 'animation-delay';
        } else if (styl.getPropertyValue('-webkit-animation-delay')) {
          prop = '-webkit-animation-delay';
        } else if (styl.getPropertyValue('-moz-animation-delay')) {
          prop = '-moz-animation-delay';
        } else {
          return 0;
        }
        delay = styl.getPropertyValue(prop);
        delay = Number(delay.replace(/[^\d\.]/g, ''));
        return delay * 1000;
      };
      CssAnimator.prototype._performSingleAnimate = function _performSingleAnimate(element, className) {
        var _this = this;
        this._triggerDOMEvent(_aureliaTemplating.animationEvent.animateBegin, element);
        return this.addClass(element, className, true).then(function(result) {
          _this._triggerDOMEvent(_aureliaTemplating.animationEvent.animateActive, element);
          if (result !== false) {
            return _this.removeClass(element, className, true).then(function() {
              _this._triggerDOMEvent(_aureliaTemplating.animationEvent.animateDone, element);
            });
          } else {
            return false;
          }
        })['catch'](function() {
          _this._triggerDOMEvent(_aureliaTemplating.animationEvent.animateTimeout, element);
        });
      };
      CssAnimator.prototype._triggerDOMEvent = function _triggerDOMEvent(eventType, element) {
        var evt = new window.CustomEvent(eventType, {
          bubbles: true,
          cancelable: true,
          detail: element
        });
        document.dispatchEvent(evt);
      };
      CssAnimator.prototype.animate = function animate(element, className) {
        var _this2 = this;
        if (Array.isArray(element)) {
          return Promise.all(element.map(function(el) {
            return _this2._performSingleAnimate(el, className);
          }));
        } else {
          return this._performSingleAnimate(element, className);
        }
      };
      CssAnimator.prototype.runSequence = function runSequence(animations) {
        var _this3 = this;
        this._triggerDOMEvent(_aureliaTemplating.animationEvent.sequenceBegin, null);
        return animations.reduce(function(p, anim) {
          return p.then(function() {
            return _this3.animate(anim.element, anim.className);
          });
        }, Promise.resolve(true)).then(function() {
          _this3._triggerDOMEvent(_aureliaTemplating.animationEvent.sequenceDone, null);
        });
      };
      CssAnimator.prototype.move = function move() {
        return Promise.resolve(false);
      };
      CssAnimator.prototype.enter = function enter(element) {
        var _this4 = this;
        return new Promise(function(resolve, reject) {
          var animId = element.toString() + Math.random(),
              classList = element.classList;
          _this4._triggerDOMEvent(_aureliaTemplating.animationEvent.enterBegin, element);
          if (_this4.useAnimationDoneClasses) {
            classList.remove(_this4.animationEnteredClass);
            classList.remove(_this4.animationLeftClass);
          }
          classList.add('au-enter');
          var animStart;
          _this4._addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = function(evAnimStart) {
            _this4.isAnimating = true;
            _this4._triggerDOMEvent(_aureliaTemplating.animationEvent.enterActive, element);
            evAnimStart.stopPropagation();
            _this4._addAnimationToStack(animId);
            var animEnd;
            _this4._addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = function(evAnimEnd) {
              evAnimEnd.stopPropagation();
              classList.remove('au-enter-active');
              classList.remove('au-enter');
              _this4._removeAnimationFromStack(animId);
              evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);
              if (_this4.useAnimationDoneClasses && _this4.animationEnteredClass !== undefined && _this4.animationEnteredClass !== null) {
                classList.add(_this4.animationEnteredClass);
              }
              _this4.isAnimating = false;
              _this4._triggerDOMEvent(_aureliaTemplating.animationEvent.enterDone, element);
              resolve(true);
            }, false);
            evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
          }, false);
          var parent = element.parentElement,
              delay = 0;
          if (parent !== null && parent !== undefined && (parent.classList.contains('au-stagger') || parent.classList.contains('au-stagger-enter'))) {
            var elemPos = Array.prototype.indexOf.call(parent.childNodes, element);
            delay = _this4._getElementAnimationDelay(parent) * elemPos;
            _this4._triggerDOMEvent(_aureliaTemplating.animationEvent.staggerNext, element);
            setTimeout(function() {
              classList.add('au-enter-active');
            }, delay);
          } else {
            classList.add('au-enter-active');
          }
          setTimeout(function() {
            if (_this4.animationStack.indexOf(animId) < 0) {
              classList.remove('au-enter-active');
              classList.remove('au-enter');
              _this4._triggerDOMEvent(_aureliaTemplating.animationEvent.enterTimeout, element);
              resolve(false);
            }
          }, _this4._getElementAnimationDelay(element) + _this4.animationTimeout + delay);
        });
      };
      CssAnimator.prototype.leave = function leave(element) {
        var _this5 = this;
        return new Promise(function(resolve, reject) {
          var animId = element.toString() + Math.random(),
              classList = element.classList;
          _this5._triggerDOMEvent(_aureliaTemplating.animationEvent.leaveBegin, element);
          if (_this5.useAnimationDoneClasses) {
            classList.remove(_this5.animationEnteredClass);
            classList.remove(_this5.animationLeftClass);
          }
          classList.add('au-leave');
          var animStart;
          _this5._addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = function(evAnimStart) {
            _this5.isAnimating = true;
            _this5._triggerDOMEvent(_aureliaTemplating.animationEvent.leaveActive, element);
            evAnimStart.stopPropagation();
            _this5._addAnimationToStack(animId);
            var animEnd;
            _this5._addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = function(evAnimEnd) {
              evAnimEnd.stopPropagation();
              classList.remove('au-leave-active');
              classList.remove('au-leave');
              _this5._removeAnimationFromStack(animId);
              evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);
              if (_this5.useAnimationDoneClasses && _this5.animationLeftClass !== undefined && _this5.animationLeftClass !== null) {
                classList.add(_this5.animationLeftClass);
              }
              _this5.isAnimating = false;
              _this5._triggerDOMEvent(_aureliaTemplating.animationEvent.leaveDone, element);
              resolve(true);
            }, false);
            evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
          }, false);
          var parent = element.parentElement,
              delay = 0;
          if (parent !== null && parent !== undefined && (parent.classList.contains('au-stagger') || parent.classList.contains('au-stagger-leave'))) {
            var elemPos = Array.prototype.indexOf.call(parent.childNodes, element);
            delay = _this5._getElementAnimationDelay(parent) * elemPos;
            _this5._triggerDOMEvent(_aureliaTemplating.animationEvent.staggerNext, element);
            setTimeout(function() {
              classList.add('au-leave-active');
            }, delay);
          } else {
            classList.add('au-leave-active');
          }
          setTimeout(function() {
            if (_this5.animationStack.indexOf(animId) < 0) {
              classList.remove('au-leave-active');
              classList.remove('au-leave');
              _this5._triggerDOMEvent(_aureliaTemplating.animationEvent.leaveTimeout, element);
              resolve(false);
            }
          }, _this5._getElementAnimationDelay(element) + _this5.animationTimeout + delay);
        });
      };
      CssAnimator.prototype.removeClass = function removeClass(element, className) {
        var _this6 = this;
        var suppressEvents = arguments[2] === undefined ? false : arguments[2];
        return new Promise(function(resolve, reject) {
          var classList = element.classList;
          if (!classList.contains(className)) {
            resolve(false);
            return ;
          }
          if (suppressEvents !== true) {
            _this6._triggerDOMEvent(_aureliaTemplating.animationEvent.removeClassBegin, element);
          }
          var animId = element.toString() + className + Math.random();
          classList.remove(className);
          var animStart;
          _this6._addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = function(evAnimStart) {
            _this6.isAnimating = true;
            if (suppressEvents !== true) {
              _this6._triggerDOMEvent(_aureliaTemplating.animationEvent.removeClassActive, element);
            }
            evAnimStart.stopPropagation();
            _this6._addAnimationToStack(animId);
            var animEnd;
            _this6._addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = function(evAnimEnd) {
              evAnimEnd.stopPropagation();
              classList.remove(className + '-remove');
              _this6._removeAnimationFromStack(animId);
              evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);
              _this6.isAnimating = false;
              if (suppressEvents !== true) {
                _this6._triggerDOMEvent(_aureliaTemplating.animationEvent.removeClassDone, element);
              }
              resolve(true);
            }, false);
            evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
          }, false);
          classList.add(className + '-remove');
          setTimeout(function() {
            if (_this6.animationStack.indexOf(animId) < 0) {
              classList.remove(className + '-remove');
              classList.remove(className);
              if (suppressEvents !== true) {
                _this6._triggerDOMEvent(_aureliaTemplating.animationEvent.removeClassTimeout, element);
              }
              resolve(false);
            }
          }, _this6._getElementAnimationDelay(element) + _this6.animationTimeout);
        });
      };
      CssAnimator.prototype.addClass = function addClass(element, className) {
        var _this7 = this;
        var suppressEvents = arguments[2] === undefined ? false : arguments[2];
        return new Promise(function(resolve, reject) {
          var animId = element.toString() + className + Math.random(),
              classList = element.classList;
          if (suppressEvents !== true) {
            _this7._triggerDOMEvent(_aureliaTemplating.animationEvent.addClassBegin, element);
          }
          var animStart;
          _this7._addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = function(evAnimStart) {
            _this7.isAnimating = true;
            if (suppressEvents !== true) {
              _this7._triggerDOMEvent(_aureliaTemplating.animationEvent.addClassActive, element);
            }
            evAnimStart.stopPropagation();
            _this7._addAnimationToStack(animId);
            var animEnd;
            _this7._addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = function(evAnimEnd) {
              evAnimEnd.stopPropagation();
              classList.add(className);
              classList.remove(className + '-add');
              _this7._removeAnimationFromStack(animId);
              evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);
              _this7.isAnimating = false;
              if (suppressEvents !== true) {
                _this7._triggerDOMEvent(_aureliaTemplating.animationEvent.addClassDone, element);
              }
              resolve(true);
            }, false);
            evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
          }, false);
          classList.add(className + '-add');
          setTimeout(function() {
            if (_this7.animationStack.indexOf(animId) < 0) {
              classList.remove(className + '-add');
              classList.add(className);
              if (suppressEvents !== true) {
                _this7._triggerDOMEvent(_aureliaTemplating.animationEvent.addClassTimeout, element);
              }
              resolve(false);
            }
          }, _this7._getElementAnimationDelay(element) + _this7.animationTimeout);
        });
      };
      return CssAnimator;
    })();
    exports.CssAnimator = CssAnimator;
    function configure(aurelia, cb) {
      var animator = aurelia.container.get(CssAnimator);
      _aureliaTemplating.Animator.configureDefault(aurelia.container, animator);
      if (typeof cb === 'function') {
        cb(animator);
      }
    }
  }).call(__exports, __exports, __require('github:aurelia/templating@0.13.13'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/animator-css@0.14.1", ["github:aurelia/animator-css@0.14.1/aurelia-animator-css"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/animator-css@0.14.1/aurelia-animator-css'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/http-client@0.10.2/aurelia-http-client", ["npm:core-js@0.9.18", "github:aurelia/path@0.8.1"], false, function(__require, __exports, __module) {
  return (function(exports, _coreJs, _aureliaPath) {
    'use strict';
    exports.__esModule = true;
    var _createClass = (function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ('value' in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          defineProperties(Constructor, staticProps);
        return Constructor;
      };
    })();
    exports.timeoutTransformer = timeoutTransformer;
    exports.callbackParameterNameTransformer = callbackParameterNameTransformer;
    exports.credentialsTransformer = credentialsTransformer;
    exports.progressTransformer = progressTransformer;
    exports.responseTypeTransformer = responseTypeTransformer;
    exports.headerTransformer = headerTransformer;
    exports.contentTransformer = contentTransformer;
    exports.createJSONPRequestMessageProcessor = createJSONPRequestMessageProcessor;
    exports.createHttpRequestMessageProcessor = createHttpRequestMessageProcessor;
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {'default': obj};
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }});
      if (superClass)
        subClass.__proto__ = superClass;
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var _core = _interopRequireDefault(_coreJs);
    var Headers = (function() {
      function Headers() {
        var headers = arguments[0] === undefined ? {} : arguments[0];
        _classCallCheck(this, Headers);
        this.headers = headers;
      }
      Headers.prototype.add = function add(key, value) {
        this.headers[key] = value;
      };
      Headers.prototype.get = function get(key) {
        return this.headers[key];
      };
      Headers.prototype.clear = function clear() {
        this.headers = {};
      };
      Headers.prototype.configureXHR = function configureXHR(xhr) {
        var headers = this.headers,
            key;
        for (key in headers) {
          xhr.setRequestHeader(key, headers[key]);
        }
      };
      Headers.parse = function parse(headerStr) {
        var headers = new Headers();
        if (!headerStr) {
          return headers;
        }
        var headerPairs = headerStr.split('\r\n');
        for (var i = 0; i < headerPairs.length; i++) {
          var headerPair = headerPairs[i];
          var index = headerPair.indexOf(': ');
          if (index > 0) {
            var key = headerPair.substring(0, index);
            var val = headerPair.substring(index + 2);
            headers.add(key, val);
          }
        }
        return headers;
      };
      return Headers;
    })();
    exports.Headers = Headers;
    var RequestMessage = (function() {
      function RequestMessage(method, url, content, headers) {
        _classCallCheck(this, RequestMessage);
        this.method = method;
        this.url = url;
        this.content = content;
        this.headers = headers || new Headers();
        this.baseUrl = '';
      }
      RequestMessage.prototype.buildFullUrl = function buildFullUrl() {
        var url = _aureliaPath.join(this.baseUrl, this.url);
        if (this.params) {
          var qs = _aureliaPath.buildQueryString(this.params);
          url = qs ? url + '?' + qs : url;
        }
        return url;
      };
      return RequestMessage;
    })();
    exports.RequestMessage = RequestMessage;
    var HttpResponseMessage = (function() {
      function HttpResponseMessage(requestMessage, xhr, responseType, reviver) {
        _classCallCheck(this, HttpResponseMessage);
        this.requestMessage = requestMessage;
        this.statusCode = xhr.status;
        this.response = xhr.response || xhr.responseText;
        this.isSuccess = xhr.status >= 200 && xhr.status < 400;
        this.statusText = xhr.statusText;
        this.reviver = reviver;
        this.mimeType = null;
        if (xhr.getAllResponseHeaders) {
          try {
            this.headers = Headers.parse(xhr.getAllResponseHeaders());
          } catch (err) {
            if (xhr.requestHeaders)
              this.headers = {headers: xhr.requestHeaders};
          }
        } else {
          this.headers = new Headers();
        }
        var contentType;
        if (this.headers && this.headers.headers)
          contentType = this.headers.headers['Content-Type'];
        if (contentType) {
          this.mimeType = responseType = contentType.split(';')[0].trim();
          if (mimeTypes.hasOwnProperty(this.mimeType))
            responseType = mimeTypes[this.mimeType];
        }
        this.responseType = responseType;
      }
      _createClass(HttpResponseMessage, [{
        key: 'content',
        get: function get() {
          try {
            if (this._content !== undefined) {
              return this._content;
            }
            if (this.response === undefined || this.response === null) {
              return this._content = this.response;
            }
            if (this.responseType === 'json') {
              return this._content = JSON.parse(this.response, this.reviver);
            }
            if (this.reviver) {
              return this._content = this.reviver(this.response);
            }
            return this._content = this.response;
          } catch (e) {
            if (this.isSuccess) {
              throw e;
            }
            return this._content = null;
          }
        }
      }]);
      return HttpResponseMessage;
    })();
    exports.HttpResponseMessage = HttpResponseMessage;
    var mimeTypes = {
      'text/html': 'html',
      'text/javascript': 'js',
      'application/javascript': 'js',
      'text/json': 'json',
      'application/json': 'json',
      'application/rss+xml': 'rss',
      'application/atom+xml': 'atom',
      'application/xhtml+xml': 'xhtml',
      'text/markdown': 'md',
      'text/xml': 'xml',
      'text/mathml': 'mml',
      'application/xml': 'xml',
      'text/yml': 'yml',
      'text/csv': 'csv',
      'text/css': 'css',
      'text/less': 'less',
      'text/stylus': 'styl',
      'text/scss': 'scss',
      'text/sass': 'sass',
      'text/plain': 'txt'
    };
    exports.mimeTypes = mimeTypes;
    function applyXhrTransformers(xhrTransformers, client, processor, message, xhr) {
      var i,
          ii;
      for (i = 0, ii = xhrTransformers.length; i < ii; ++i) {
        xhrTransformers[i](client, processor, message, xhr);
      }
    }
    var RequestMessageProcessor = (function() {
      function RequestMessageProcessor(xhrType, xhrTransformers) {
        _classCallCheck(this, RequestMessageProcessor);
        this.XHRType = xhrType;
        this.xhrTransformers = xhrTransformers;
        this.isAborted = false;
      }
      RequestMessageProcessor.prototype.abort = function abort() {
        if (this.xhr && this.xhr.readyState !== XMLHttpRequest.UNSENT) {
          this.xhr.abort();
        }
        this.isAborted = true;
      };
      RequestMessageProcessor.prototype.process = function process(client, message) {
        var _this = this;
        var promise = new Promise(function(resolve, reject) {
          var xhr = _this.xhr = new _this.XHRType();
          xhr.onload = function(e) {
            var response = new HttpResponseMessage(message, xhr, message.responseType, message.reviver);
            if (response.isSuccess) {
              resolve(response);
            } else {
              reject(response);
            }
          };
          xhr.ontimeout = function(e) {
            reject(new HttpResponseMessage(message, {
              response: e,
              status: xhr.status,
              statusText: xhr.statusText
            }, 'timeout'));
          };
          xhr.onerror = function(e) {
            reject(new HttpResponseMessage(message, {
              response: e,
              status: xhr.status,
              statusText: xhr.statusText
            }, 'error'));
          };
          xhr.onabort = function(e) {
            reject(new HttpResponseMessage(message, {
              response: e,
              status: xhr.status,
              statusText: xhr.statusText
            }, 'abort'));
          };
        });
        return Promise.resolve(message).then(function(message) {
          var processRequest = function processRequest() {
            if (_this.isAborted) {
              _this.xhr.abort();
            } else {
              _this.xhr.open(message.method, message.buildFullUrl(), true);
              applyXhrTransformers(_this.xhrTransformers, client, _this, message, _this.xhr);
              _this.xhr.send(message.content);
            }
            return promise;
          };
          var chain = [[processRequest, undefined]];
          var interceptors = message.interceptors || [];
          interceptors.forEach(function(interceptor) {
            if (interceptor.request || interceptor.requestError) {
              chain.unshift([interceptor.request ? interceptor.request.bind(interceptor) : undefined, interceptor.requestError ? interceptor.requestError.bind(interceptor) : undefined]);
            }
            if (interceptor.response || interceptor.responseError) {
              chain.push([interceptor.response ? interceptor.response.bind(interceptor) : undefined, interceptor.responseError ? interceptor.responseError.bind(interceptor) : undefined]);
            }
          });
          var interceptorsPromise = Promise.resolve(message);
          while (chain.length) {
            interceptorsPromise = interceptorsPromise.then.apply(interceptorsPromise, chain.shift());
          }
          return interceptorsPromise;
        });
      };
      return RequestMessageProcessor;
    })();
    exports.RequestMessageProcessor = RequestMessageProcessor;
    function timeoutTransformer(client, processor, message, xhr) {
      if (message.timeout !== undefined) {
        xhr.timeout = message.timeout;
      }
    }
    function callbackParameterNameTransformer(client, processor, message, xhr) {
      if (message.callbackParameterName !== undefined) {
        xhr.callbackParameterName = message.callbackParameterName;
      }
    }
    function credentialsTransformer(client, processor, message, xhr) {
      if (message.withCredentials !== undefined) {
        xhr.withCredentials = message.withCredentials;
      }
    }
    function progressTransformer(client, processor, message, xhr) {
      if (message.progressCallback) {
        xhr.upload.onprogress = message.progressCallback;
      }
    }
    function responseTypeTransformer(client, processor, message, xhr) {
      var responseType = message.responseType;
      if (responseType === 'json') {
        responseType = 'text';
      }
      xhr.responseType = responseType;
    }
    function headerTransformer(client, processor, message, xhr) {
      message.headers.configureXHR(xhr);
    }
    function contentTransformer(client, processor, message, xhr) {
      if (window.FormData && message.content instanceof FormData) {
        return ;
      }
      if (window.Blob && message.content instanceof Blob) {
        return ;
      }
      if (window.ArrayBufferView && message.content instanceof ArrayBufferView) {
        return ;
      }
      if (message.content instanceof Document) {
        return ;
      }
      if (typeof message.content === 'string') {
        return ;
      }
      if (message.content === null || message.content === undefined) {
        return ;
      }
      message.content = JSON.stringify(message.content, message.replacer);
      if (message.headers.get('Content-Type') === undefined) {
        message.headers.add('Content-Type', 'application/json');
      }
    }
    var JSONPRequestMessage = (function(_RequestMessage) {
      function JSONPRequestMessage(url, callbackParameterName) {
        _classCallCheck(this, JSONPRequestMessage);
        _RequestMessage.call(this, 'JSONP', url);
        this.responseType = 'jsonp';
        this.callbackParameterName = callbackParameterName;
      }
      _inherits(JSONPRequestMessage, _RequestMessage);
      return JSONPRequestMessage;
    })(RequestMessage);
    exports.JSONPRequestMessage = JSONPRequestMessage;
    var JSONPXHR = (function() {
      function JSONPXHR() {
        _classCallCheck(this, JSONPXHR);
      }
      JSONPXHR.prototype.open = function open(method, url) {
        this.method = method;
        this.url = url;
        this.callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
      };
      JSONPXHR.prototype.send = function send() {
        var _this2 = this;
        var url = this.url + (this.url.indexOf('?') >= 0 ? '&' : '?') + encodeURIComponent(this.callbackParameterName) + '=' + this.callbackName;
        var script = document.createElement('script');
        script.src = url;
        script.onerror = function(e) {
          cleanUp();
          _this2.status = 0;
          _this2.onerror(new Error('error'));
        };
        var cleanUp = function cleanUp() {
          delete window[_this2.callbackName];
          document.body.removeChild(script);
        };
        window[this.callbackName] = function(data) {
          cleanUp();
          if (_this2.status === undefined) {
            _this2.status = 200;
            _this2.statusText = 'OK';
            _this2.response = data;
            _this2.onload(_this2);
          }
        };
        document.body.appendChild(script);
        if (this.timeout !== undefined) {
          setTimeout(function() {
            if (_this2.status === undefined) {
              _this2.status = 0;
              _this2.ontimeout(new Error('timeout'));
            }
          }, this.timeout);
        }
      };
      JSONPXHR.prototype.abort = function abort() {
        if (this.status === undefined) {
          this.status = 0;
          this.onabort(new Error('abort'));
        }
      };
      JSONPXHR.prototype.setRequestHeader = function setRequestHeader() {};
      return JSONPXHR;
    })();
    function createJSONPRequestMessageProcessor() {
      return new RequestMessageProcessor(JSONPXHR, [timeoutTransformer, callbackParameterNameTransformer]);
    }
    var HttpRequestMessage = (function(_RequestMessage2) {
      function HttpRequestMessage(method, url, content, headers) {
        _classCallCheck(this, HttpRequestMessage);
        _RequestMessage2.call(this, method, url, content, headers);
        this.responseType = 'json';
      }
      _inherits(HttpRequestMessage, _RequestMessage2);
      return HttpRequestMessage;
    })(RequestMessage);
    exports.HttpRequestMessage = HttpRequestMessage;
    function createHttpRequestMessageProcessor() {
      return new RequestMessageProcessor(XMLHttpRequest, [timeoutTransformer, credentialsTransformer, progressTransformer, responseTypeTransformer, contentTransformer, headerTransformer]);
    }
    var RequestBuilder = (function() {
      function RequestBuilder(client) {
        _classCallCheck(this, RequestBuilder);
        this.client = client;
        this.transformers = client.requestTransformers.slice(0);
        this.useJsonp = false;
      }
      RequestBuilder.addHelper = function addHelper(name, fn) {
        RequestBuilder.prototype[name] = function() {
          this.transformers.push(fn.apply(this, arguments));
          return this;
        };
      };
      RequestBuilder.prototype.send = function send() {
        var message = this.useJsonp ? new JSONPRequestMessage() : new HttpRequestMessage();
        return this.client.send(message, this.transformers);
      };
      return RequestBuilder;
    })();
    exports.RequestBuilder = RequestBuilder;
    RequestBuilder.addHelper('asDelete', function() {
      return function(client, processor, message) {
        message.method = 'DELETE';
      };
    });
    RequestBuilder.addHelper('asGet', function() {
      return function(client, processor, message) {
        message.method = 'GET';
      };
    });
    RequestBuilder.addHelper('asHead', function() {
      return function(client, processor, message) {
        message.method = 'HEAD';
      };
    });
    RequestBuilder.addHelper('asOptions', function() {
      return function(client, processor, message) {
        message.method = 'OPTIONS';
      };
    });
    RequestBuilder.addHelper('asPatch', function() {
      return function(client, processor, message) {
        message.method = 'PATCH';
      };
    });
    RequestBuilder.addHelper('asPost', function() {
      return function(client, processor, message) {
        message.method = 'POST';
      };
    });
    RequestBuilder.addHelper('asPut', function() {
      return function(client, processor, message) {
        message.method = 'PUT';
      };
    });
    RequestBuilder.addHelper('asJsonp', function(callbackParameterName) {
      this.useJsonp = true;
      return function(client, processor, message) {
        message.callbackParameterName = callbackParameterName;
      };
    });
    RequestBuilder.addHelper('withUrl', function(url) {
      return function(client, processor, message) {
        message.url = url;
      };
    });
    RequestBuilder.addHelper('withContent', function(content) {
      return function(client, processor, message) {
        message.content = content;
      };
    });
    RequestBuilder.addHelper('withBaseUrl', function(baseUrl) {
      return function(client, processor, message) {
        message.baseUrl = baseUrl;
      };
    });
    RequestBuilder.addHelper('withParams', function(params) {
      return function(client, processor, message) {
        message.params = params;
      };
    });
    RequestBuilder.addHelper('withResponseType', function(responseType) {
      return function(client, processor, message) {
        message.responseType = responseType;
      };
    });
    RequestBuilder.addHelper('withTimeout', function(timeout) {
      return function(client, processor, message) {
        message.timeout = timeout;
      };
    });
    RequestBuilder.addHelper('withHeader', function(key, value) {
      return function(client, processor, message) {
        message.headers.add(key, value);
      };
    });
    RequestBuilder.addHelper('withCredentials', function(value) {
      return function(client, processor, message) {
        message.withCredentials = value;
      };
    });
    RequestBuilder.addHelper('withReviver', function(reviver) {
      return function(client, processor, message) {
        message.reviver = reviver;
      };
    });
    RequestBuilder.addHelper('withReplacer', function(replacer) {
      return function(client, processor, message) {
        message.replacer = replacer;
      };
    });
    RequestBuilder.addHelper('withProgressCallback', function(progressCallback) {
      return function(client, processor, message) {
        message.progressCallback = progressCallback;
      };
    });
    RequestBuilder.addHelper('withCallbackParameterName', function(callbackParameterName) {
      return function(client, processor, message) {
        message.callbackParameterName = callbackParameterName;
      };
    });
    RequestBuilder.addHelper('withInterceptor', function(interceptor) {
      return function(client, processor, message) {
        message.interceptors = message.interceptors || [];
        message.interceptors.unshift(interceptor);
      };
    });
    function trackRequestStart(client, processor) {
      client.pendingRequests.push(processor);
      client.isRequesting = true;
    }
    function trackRequestEnd(client, processor) {
      var index = client.pendingRequests.indexOf(processor);
      client.pendingRequests.splice(index, 1);
      client.isRequesting = client.pendingRequests.length > 0;
      if (!client.isRequesting) {
        var evt = new window.CustomEvent('aurelia-http-client-requests-drained', {
          bubbles: true,
          cancelable: true
        });
        setTimeout(function() {
          return document.dispatchEvent(evt);
        }, 1);
      }
    }
    var HttpClient = (function() {
      function HttpClient() {
        _classCallCheck(this, HttpClient);
        this.requestTransformers = [];
        this.requestProcessorFactories = new Map();
        this.requestProcessorFactories.set(HttpRequestMessage, createHttpRequestMessageProcessor);
        this.requestProcessorFactories.set(JSONPRequestMessage, createJSONPRequestMessageProcessor);
        this.pendingRequests = [];
        this.isRequesting = false;
      }
      HttpClient.prototype.configure = function configure(fn) {
        var builder = new RequestBuilder(this);
        fn(builder);
        this.requestTransformers = builder.transformers;
        return this;
      };
      HttpClient.prototype.createRequest = function createRequest(url) {
        var builder = new RequestBuilder(this);
        if (url) {
          builder.withUrl(url);
        }
        return builder;
      };
      HttpClient.prototype.send = function send(message, transformers) {
        var _this3 = this;
        var createProcessor = this.requestProcessorFactories.get(message.constructor),
            processor,
            promise,
            i,
            ii,
            processRequest;
        if (!createProcessor) {
          throw new Error('No request message processor factory for ' + message.constructor + '.');
        }
        processor = createProcessor();
        trackRequestStart(this, processor);
        transformers = transformers || this.requestTransformers;
        promise = Promise.resolve(message).then(function(message) {
          for (i = 0, ii = transformers.length; i < ii; ++i) {
            transformers[i](_this3, processor, message);
          }
          return processor.process(_this3, message).then(function(response) {
            trackRequestEnd(_this3, processor);
            return response;
          })['catch'](function(response) {
            trackRequestEnd(_this3, processor);
            throw response;
          });
        });
        promise.abort = promise.cancel = function() {
          processor.abort();
        };
        return promise;
      };
      HttpClient.prototype['delete'] = function _delete(url) {
        return this.createRequest(url).asDelete().send();
      };
      HttpClient.prototype.get = function get(url) {
        return this.createRequest(url).asGet().send();
      };
      HttpClient.prototype.head = function head(url) {
        return this.createRequest(url).asHead().send();
      };
      HttpClient.prototype.jsonp = function jsonp(url) {
        var callbackParameterName = arguments[1] === undefined ? 'jsoncallback' : arguments[1];
        return this.createRequest(url).asJsonp(callbackParameterName).send();
      };
      HttpClient.prototype.options = function options(url) {
        return this.createRequest(url).asOptions().send();
      };
      HttpClient.prototype.put = function put(url, content) {
        return this.createRequest(url).asPut().withContent(content).send();
      };
      HttpClient.prototype.patch = function patch(url, content) {
        return this.createRequest(url).asPatch().withContent(content).send();
      };
      HttpClient.prototype.post = function post(url, content) {
        return this.createRequest(url).asPost().withContent(content).send();
      };
      return HttpClient;
    })();
    exports.HttpClient = HttpClient;
  }).call(__exports, __exports, __require('npm:core-js@0.9.18'), __require('github:aurelia/path@0.8.1'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/http-client@0.10.2", ["github:aurelia/http-client@0.10.2/aurelia-http-client"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/http-client@0.10.2/aurelia-http-client'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/logging-console@0.6.1/aurelia-logging-console", [], false, function(__require, __exports, __module) {
  return (function(exports) {
    'use strict';
    exports.__esModule = true;
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    (function(global) {
      'use strict';
      global.console = global.console || {};
      var con = global.console;
      var prop,
          method;
      var empty = {};
      var dummy = function dummy() {};
      var properties = 'memory'.split(',');
      var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' + 'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' + 'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
      while (prop = properties.pop())
        if (!con[prop])
          con[prop] = empty;
      while (method = methods.pop())
        if (!con[method])
          con[method] = dummy;
    })(typeof window === 'undefined' ? undefined : window);
    if (Function.prototype.bind && window.console && typeof console.log == 'object') {
      ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd'].forEach(function(method) {
        console[method] = this.bind(console[method], console);
      }, Function.prototype.call);
    }
    var ConsoleAppender = (function() {
      function ConsoleAppender() {
        _classCallCheck(this, ConsoleAppender);
      }
      ConsoleAppender.prototype.debug = function debug(logger) {
        for (var _len = arguments.length,
            rest = Array(_len > 1 ? _len - 1 : 0),
            _key = 1; _key < _len; _key++) {
          rest[_key - 1] = arguments[_key];
        }
        console.debug.apply(console, ['DEBUG [' + logger.id + ']'].concat(rest));
      };
      ConsoleAppender.prototype.info = function info(logger) {
        for (var _len2 = arguments.length,
            rest = Array(_len2 > 1 ? _len2 - 1 : 0),
            _key2 = 1; _key2 < _len2; _key2++) {
          rest[_key2 - 1] = arguments[_key2];
        }
        console.info.apply(console, ['INFO [' + logger.id + ']'].concat(rest));
      };
      ConsoleAppender.prototype.warn = function warn(logger) {
        for (var _len3 = arguments.length,
            rest = Array(_len3 > 1 ? _len3 - 1 : 0),
            _key3 = 1; _key3 < _len3; _key3++) {
          rest[_key3 - 1] = arguments[_key3];
        }
        console.warn.apply(console, ['WARN [' + logger.id + ']'].concat(rest));
      };
      ConsoleAppender.prototype.error = function error(logger) {
        for (var _len4 = arguments.length,
            rest = Array(_len4 > 1 ? _len4 - 1 : 0),
            _key4 = 1; _key4 < _len4; _key4++) {
          rest[_key4 - 1] = arguments[_key4];
        }
        console.error.apply(console, ['ERROR [' + logger.id + ']'].concat(rest));
      };
      return ConsoleAppender;
    })();
    exports.ConsoleAppender = ConsoleAppender;
  }).call(__exports, __exports);
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/logging-console@0.6.1", ["github:aurelia/logging-console@0.6.1/aurelia-logging-console"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/logging-console@0.6.1/aurelia-logging-console'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/framework@0.13.4/aurelia-framework", ["npm:core-js@0.9.18", "github:aurelia/logging@0.6.2", "github:aurelia/metadata@0.7.1", "github:aurelia/dependency-injection@0.9.1", "github:aurelia/loader@0.8.3", "github:aurelia/path@0.8.1", "github:aurelia/templating@0.13.13", "github:aurelia/binding@0.8.4", "github:aurelia/task-queue@0.6.1"], false, function(__require, __exports, __module) {
  return (function(exports, _coreJs, _aureliaLogging, _aureliaMetadata, _aureliaDependencyInjection, _aureliaLoader, _aureliaPath, _aureliaTemplating, _aureliaBinding, _aureliaTaskQueue) {
    'use strict';
    exports.__esModule = true;
    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj;
      } else {
        var newObj = {};
        if (obj != null) {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key))
              newObj[key] = obj[key];
          }
        }
        newObj['default'] = obj;
        return newObj;
      }
    }
    function _defaults(obj, defaults) {
      var keys = Object.getOwnPropertyNames(defaults);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = Object.getOwnPropertyDescriptor(defaults, key);
        if (value && value.configurable && obj[key] === undefined) {
          Object.defineProperty(obj, key, value);
        }
      }
      return obj;
    }
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {'default': obj};
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    var _core = _interopRequireDefault(_coreJs);
    var logger = _aureliaLogging.getLogger('aurelia');
    function loadPlugin(aurelia, loader, info) {
      logger.debug('Loading plugin ' + info.moduleId + '.');
      aurelia.currentPluginId = info.moduleId.endsWith('.js') || info.moduleId.endsWith('.ts') ? info.moduleId.substring(0, info.moduleId.length - 3) : info.moduleId;
      return loader.loadModule(info.moduleId).then(function(m) {
        if ('configure' in m) {
          return Promise.resolve(m.configure(aurelia, info.config || {})).then(function() {
            aurelia.currentPluginId = null;
            logger.debug('Configured plugin ' + info.moduleId + '.');
          });
        } else {
          aurelia.currentPluginId = null;
          logger.debug('Loaded plugin ' + info.moduleId + '.');
        }
      });
    }
    var Plugins = (function() {
      function Plugins(aurelia) {
        _classCallCheck(this, Plugins);
        this.aurelia = aurelia;
        this.info = [];
        this.processed = false;
      }
      Plugins.prototype.plugin = function plugin(moduleId, config) {
        var plugin = {
          moduleId: moduleId,
          config: config || {}
        };
        if (this.processed) {
          loadPlugin(this.aurelia, this.aurelia.loader, plugin);
        } else {
          this.info.push(plugin);
        }
        return this;
      };
      Plugins.prototype._process = function _process() {
        var _this = this;
        var aurelia = this.aurelia,
            loader = aurelia.loader,
            info = this.info,
            current;
        if (this.processed) {
          return ;
        }
        var next = function next() {
          if (current = info.shift()) {
            return loadPlugin(aurelia, loader, current).then(next);
          }
          _this.processed = true;
          return Promise.resolve();
        };
        return next();
      };
      return Plugins;
    })();
    exports.Plugins = Plugins;
    var logger = _aureliaLogging.getLogger('aurelia'),
        slice = Array.prototype.slice;
    if (!window.CustomEvent || typeof window.CustomEvent !== 'function') {
      var CustomEvent = function CustomEvent(event, params) {
        var params = params || {
          bubbles: false,
          cancelable: false,
          detail: undefined
        };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      };
      CustomEvent.prototype = window.Event.prototype;
      window.CustomEvent = CustomEvent;
    }
    function preventActionlessFormSubmit() {
      document.body.addEventListener('submit', function(evt) {
        var target = evt.target;
        var action = target.action;
        if (target.tagName.toLowerCase() === 'form' && !action) {
          evt.preventDefault();
        }
      });
    }
    function loadResources(container, resourcesToLoad, appResources) {
      var viewEngine = container.get(_aureliaTemplating.ViewEngine),
          importIds = Object.keys(resourcesToLoad),
          names = new Array(importIds.length),
          i,
          ii;
      for (i = 0, ii = importIds.length; i < ii; ++i) {
        names[i] = resourcesToLoad[importIds[i]];
      }
      return viewEngine.importViewResources(importIds, names, appResources);
    }
    var Aurelia = (function() {
      function Aurelia(loader, container, resources) {
        _classCallCheck(this, Aurelia);
        this.loader = loader || new window.AureliaLoader();
        this.container = container || new _aureliaDependencyInjection.Container();
        this.resources = resources || new _aureliaTemplating.ResourceRegistry();
        this.use = new Plugins(this);
        this.resourcesToLoad = {};
        this.withInstance(Aurelia, this);
        this.withInstance(_aureliaLoader.Loader, this.loader);
        this.withInstance(_aureliaTemplating.ResourceRegistry, this.resources);
        this.container.makeGlobal();
      }
      Aurelia.prototype.withInstance = function withInstance(type, instance) {
        this.container.registerInstance(type, instance);
        return this;
      };
      Aurelia.prototype.withSingleton = function withSingleton(type, implementation) {
        this.container.registerSingleton(type, implementation);
        return this;
      };
      Aurelia.prototype.withTransient = function withTransient(type, implementation) {
        this.container.registerTransient(type, implementation);
        return this;
      };
      Aurelia.prototype.globalizeResources = function globalizeResources(resources) {
        var toAdd = Array.isArray(resources) ? resources : arguments,
            i,
            ii,
            resource,
            pluginPath = this.currentPluginId || '',
            path,
            internalPlugin = pluginPath.startsWith('./');
        for (i = 0, ii = toAdd.length; i < ii; ++i) {
          resource = toAdd[i];
          if (typeof resource != 'string') {
            throw new Error('Invalid resource path [' + resource + ']. Resources must be specified as relative module IDs.');
          }
          path = internalPlugin ? _aureliaPath.relativeToFile(resource, pluginPath) : _aureliaPath.join(pluginPath, resource);
          this.resourcesToLoad[path] = this.resourcesToLoad[path];
        }
        return this;
      };
      Aurelia.prototype.renameGlobalResource = function renameGlobalResource(resourcePath, newName) {
        this.resourcesToLoad[resourcePath] = newName;
        return this;
      };
      Aurelia.prototype.start = function start() {
        var _this2 = this;
        if (this.started) {
          return Promise.resolve(this);
        }
        this.started = true;
        logger.info('Aurelia Starting');
        preventActionlessFormSubmit();
        return this.use._process().then(function() {
          if (!_this2.container.hasHandler(_aureliaTemplating.BindingLanguage)) {
            var message = 'You must configure Aurelia with a BindingLanguage implementation.';
            logger.error(message);
            throw new Error(message);
          }
          if (!_this2.container.hasHandler(_aureliaTemplating.Animator)) {
            _aureliaTemplating.Animator.configureDefault(_this2.container);
          }
          return loadResources(_this2.container, _this2.resourcesToLoad, _this2.resources).then(function() {
            logger.info('Aurelia Started');
            var evt = new window.CustomEvent('aurelia-started', {
              bubbles: true,
              cancelable: true
            });
            document.dispatchEvent(evt);
            return _this2;
          });
        });
      };
      Aurelia.prototype.setRoot = function setRoot() {
        var _this3 = this;
        var root = arguments[0] === undefined ? 'app' : arguments[0];
        var applicationHost = arguments[1] === undefined ? null : arguments[1];
        var compositionEngine,
            instruction = {};
        applicationHost = applicationHost || this.host;
        if (!applicationHost || typeof applicationHost == 'string') {
          this.host = document.getElementById(applicationHost || 'applicationHost') || document.body;
        } else {
          this.host = applicationHost;
        }
        this.host.aurelia = this;
        this.container.registerInstance(_aureliaTemplating.DOMBoundary, this.host);
        compositionEngine = this.container.get(_aureliaTemplating.CompositionEngine);
        instruction.viewModel = root;
        instruction.container = instruction.childContainer = this.container;
        instruction.viewSlot = new _aureliaTemplating.ViewSlot(this.host, true);
        instruction.viewSlot.transformChildNodesIntoView();
        instruction.host = this.host;
        return compositionEngine.compose(instruction).then(function(root) {
          _this3.root = root;
          instruction.viewSlot.attached();
          var evt = new window.CustomEvent('aurelia-composed', {
            bubbles: true,
            cancelable: true
          });
          setTimeout(function() {
            return document.dispatchEvent(evt);
          }, 1);
          return _this3;
        });
      };
      return Aurelia;
    })();
    exports.Aurelia = Aurelia;
    _defaults(exports, _interopRequireWildcard(_aureliaDependencyInjection));
    _defaults(exports, _interopRequireWildcard(_aureliaBinding));
    _defaults(exports, _interopRequireWildcard(_aureliaMetadata));
    _defaults(exports, _interopRequireWildcard(_aureliaTemplating));
    _defaults(exports, _interopRequireWildcard(_aureliaLoader));
    _defaults(exports, _interopRequireWildcard(_aureliaTaskQueue));
    _defaults(exports, _interopRequireWildcard(_aureliaPath));
    var LogManager = _aureliaLogging;
    exports.LogManager = LogManager;
  }).call(__exports, __exports, __require('npm:core-js@0.9.18'), __require('github:aurelia/logging@0.6.2'), __require('github:aurelia/metadata@0.7.1'), __require('github:aurelia/dependency-injection@0.9.1'), __require('github:aurelia/loader@0.8.3'), __require('github:aurelia/path@0.8.1'), __require('github:aurelia/templating@0.13.13'), __require('github:aurelia/binding@0.8.4'), __require('github:aurelia/task-queue@0.6.1'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/framework@0.13.4", ["github:aurelia/framework@0.13.4/aurelia-framework"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/framework@0.13.4/aurelia-framework'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/bootstrapper@0.14.1/aurelia-bootstrapper", ["npm:core-js@0.9.18", "github:aurelia/framework@0.13.4", "github:aurelia/logging-console@0.6.1"], false, function(__require, __exports, __module) {
  return (function(exports, _coreJs, _aureliaFramework, _aureliaLoggingConsole) {
    'use strict';
    exports.__esModule = true;
    exports.bootstrap = bootstrap;
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {'default': obj};
    }
    var _core = _interopRequireDefault(_coreJs);
    var logger = _aureliaFramework.LogManager.getLogger('bootstrapper');
    var readyQueue = [];
    var isReady = false;
    function onReady(callback) {
      return new Promise(function(resolve, reject) {
        if (!isReady) {
          readyQueue.push(function() {
            try {
              resolve(callback());
            } catch (e) {
              reject(e);
            }
          });
        } else {
          resolve(callback());
        }
      });
    }
    function bootstrap(configure) {
      return onReady(function() {
        var loader = new window.AureliaLoader(),
            aurelia = new _aureliaFramework.Aurelia(loader);
        return configureAurelia(aurelia).then(function() {
          return configure(aurelia);
        });
      });
    }
    function ready(global) {
      return new Promise(function(resolve, reject) {
        if (global.document.readyState === 'complete') {
          resolve(global.document);
        } else {
          global.document.addEventListener('DOMContentLoaded', completed, false);
          global.addEventListener('load', completed, false);
        }
        function completed() {
          global.document.removeEventListener('DOMContentLoaded', completed, false);
          global.removeEventListener('load', completed, false);
          resolve(global.document);
        }
      });
    }
    function ensureLoader() {
      if (!window.AureliaLoader) {
        if (window.System && !window.System.isFake) {
          return System.normalize('aurelia-bootstrapper').then(function(bootstrapperName) {
            return System.normalize('aurelia-loader-default', bootstrapperName).then(function(loaderName) {
              return System['import'](loaderName);
            });
          });
        } else if (window.require) {
          return new Promise(function(resolve, reject) {
            require(['aurelia-loader-default'], resolve, reject);
          });
        } else {
          throw new Error('No window.AureliaLoader is defined and there is neither a System API (ES6) or a Require API (AMD) available to load your app.');
        }
      }
      return Promise.resolve();
    }
    function preparePlatform() {
      return System.normalize('aurelia-bootstrapper').then(function(bootstrapperName) {
        return System.normalize('aurelia-framework', bootstrapperName).then(function(frameworkName) {
          System.map['aurelia-framework'] = frameworkName;
          return System.normalize('aurelia-loader', frameworkName).then(function(loaderName) {
            var toLoad = [];
            toLoad.push(System.normalize('aurelia-dependency-injection', frameworkName).then(function(name) {
              System.map['aurelia-dependency-injection'] = name;
            }));
            toLoad.push(System.normalize('aurelia-router', bootstrapperName).then(function(name) {
              System.map['aurelia-router'] = name;
            }));
            toLoad.push(System.normalize('aurelia-logging-console', bootstrapperName).then(function(name) {
              System.map['aurelia-logging-console'] = name;
            }));
            if (!('import' in document.createElement('link'))) {
              logger.debug('loading the HTMLImports polyfill');
              toLoad.push(System.normalize('webcomponentsjs/HTMLImports.min', loaderName).then(function(name) {
                return System['import'](name);
              }));
            }
            if (!('content' in document.createElement('template'))) {
              logger.debug('loading the HTMLTemplateElement polyfill');
              toLoad.push(System.normalize('aurelia-html-template-element', loaderName).then(function(name) {
                return System['import'](name);
              }));
            }
            return Promise.all(toLoad);
          });
        });
      });
    }
    var installedDevelopmentLogging = false;
    function configureAurelia(aurelia) {
      return System.normalize('aurelia-bootstrapper').then(function(bName) {
        var toLoad = [];
        toLoad.push(System.normalize('aurelia-templating-binding', bName).then(function(templatingBinding) {
          aurelia.use.defaultBindingLanguage = function() {
            aurelia.use.plugin(templatingBinding);
            return this;
          };
        }));
        toLoad.push(System.normalize('aurelia-templating-router', bName).then(function(templatingRouter) {
          aurelia.use.router = function() {
            aurelia.use.plugin(templatingRouter);
            return this;
          };
        }));
        toLoad.push(System.normalize('aurelia-history-browser', bName).then(function(historyBrowser) {
          aurelia.use.history = function() {
            aurelia.use.plugin(historyBrowser);
            return this;
          };
        }));
        toLoad.push(System.normalize('aurelia-templating-resources', bName).then(function(name) {
          System.map['aurelia-templating-resources'] = name;
          aurelia.use.defaultResources = function() {
            aurelia.use.plugin(name);
            return this;
          };
        }));
        toLoad.push(System.normalize('aurelia-event-aggregator', bName).then(function(eventAggregator) {
          System.map['aurelia-event-aggregator'] = eventAggregator;
          aurelia.use.eventAggregator = function() {
            aurelia.use.plugin(eventAggregator);
            return this;
          };
        }));
        aurelia.use.standardConfiguration = function() {
          aurelia.use.defaultBindingLanguage().defaultResources().history().router().eventAggregator();
          return this;
        };
        aurelia.use.developmentLogging = function() {
          if (!installedDevelopmentLogging) {
            installedDevelopmentLogging = true;
            _aureliaFramework.LogManager.addAppender(new _aureliaLoggingConsole.ConsoleAppender());
            _aureliaFramework.LogManager.setLevel(_aureliaFramework.LogManager.logLevel.debug);
          }
          return this;
        };
        return Promise.all(toLoad);
      });
    }
    function runningLocally() {
      return window.location.protocol !== 'http' && window.location.protocol !== 'https';
    }
    function handleApp(appHost) {
      var configModuleId = appHost.getAttribute('aurelia-app'),
          aurelia,
          loader;
      if (configModuleId) {
        loader = new window.AureliaLoader();
        return loader.loadModule(configModuleId).then(function(m) {
          aurelia = new _aureliaFramework.Aurelia(loader);
          aurelia.host = appHost;
          return configureAurelia(aurelia).then(function() {
            return m.configure(aurelia);
          });
        });
      } else {
        aurelia = new _aureliaFramework.Aurelia();
        aurelia.host = appHost;
        return configureAurelia(aurelia).then(function() {
          if (runningLocally()) {
            aurelia.use.developmentLogging();
          }
          aurelia.use.standardConfiguration();
          return aurelia.start().then(function(a) {
            return a.setRoot();
          });
        });
      }
    }
    function run() {
      return ready(window).then(function(doc) {
        var appHost = doc.querySelectorAll('[aurelia-app]');
        return ensureLoader().then(function() {
          return preparePlatform().then(function() {
            var i,
                ii;
            for (i = 0, ii = appHost.length; i < ii; ++i) {
              handleApp(appHost[i]);
            }
            isReady = true;
            for (i = 0, ii = readyQueue.length; i < ii; ++i) {
              readyQueue[i]();
            }
            readyQueue = [];
          });
        });
      });
    }
    run();
  }).call(__exports, __exports, __require('npm:core-js@0.9.18'), __require('github:aurelia/framework@0.13.4'), __require('github:aurelia/logging-console@0.6.1'));
});
})();
(function() {
function define(){};  define.amd = {};
System.register("github:aurelia/bootstrapper@0.14.1", ["github:aurelia/bootstrapper@0.14.1/aurelia-bootstrapper"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:aurelia/bootstrapper@0.14.1/aurelia-bootstrapper'));
});
})();
System.register("config", [], function(_export) {
  "use strict";
  _export("configure", configure);
  function configure(aurelia) {
    aurelia.use.standardConfiguration().developmentLogging();
    aurelia.start().then(function(a) {
      return a.setRoot();
    });
  }
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("app", ["github:jbellsey/material-decorator@master"], function(_export) {
  'use strict';
  var enableMDL,
      App;
  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  return {
    setters: [function(_jbellseyMaterialDecorator) {
      enableMDL = _jbellseyMaterialDecorator.enableMDL;
    }],
    execute: function() {
      App = (function() {
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
