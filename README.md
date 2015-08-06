# material-decorator

Provides a decorator which adds support for 
[Material Design Lite](http://getmdl.io) (MDL) to an 
[Aurelia](http://aurelia.io) view-model.

View a demo site with all the MDL samples running 
in Aurelia [here](http://jbellsey.github.io/material-decorator/).

# Wait, what? Why?

This is needed because MDL doesn't play nice with dynamically-generated 
DOM nodes. And since all Aurelia templates are dynamic, you won't
get the benefit of the MDL JavaScript (e.g., ripple effects, dropdown
menus, etc.). 

You'll need to use the provided decorator on every view-model that uses MDL.

# Dependencies

This library has no external dependencies. However, it only makes sense in a project
that uses Aurelia and the Google Material Design Lite frameworks. This plugin 
does not load those dependencies for you.

# Using the plugin

To install:

```
jspm install github:jbellsey/material-decorator
```

In your view-model.js:

```javascript
import {enableMDL} from "jbellsey/material-decorator";

@enableMDL
class MyViewModel {
    // ... do your thing
}
``` 

Note that this will install an `attached()` handler, in which the essential javascript is installed.
If your class already implements that handler, it will not be overwritten; it will instead be 
decorated with the MDL support code.

No other code changes are necessary. Use the MDL library as documented.

# To do

* ensure this is the most efficient code
* see if this code can be installed globally, rather than per-VM

# Building the library

```
npm install
jspm install
gulp build
```
