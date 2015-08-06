import MDL from 'google/material-design-lite';

function setupMDL() {
    // all this fuss for one line of code.

    // after bundling, we don't use the componentHandler intermediary
    //
    (MDL.upgradeDom || MDL.componentHandler.upgradeDom)();
}

export function enableMDL(viewModelClass) {

    var originalHandler = viewModelClass.prototype.attached;

    // user already has an attached() handler; decorate it
    //
    if (typeof originalHandler !== 'undefined') {

        viewModelClass.prototype.attached = function(...args) {
            originalHandler.call(this, ...args);
            setupMDL();
        };
    }

    // user doesn't have an attached() handler; install one
    //
    else
        viewModelClass.prototype.attached = setupMDL;
}
