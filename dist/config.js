System.register([], function (_export) {
    "use strict";

    _export("configure", configure);

    function configure(aurelia) {
        aurelia.use.standardConfiguration().developmentLogging();

        aurelia.start().then(function (a) {
            return a.setRoot();
        });
    }

    return {
        setters: [],
        execute: function () {}
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNPLGFBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRTtBQUMvQixlQUFPLENBQUMsR0FBRyxDQUNOLHFCQUFxQixFQUFFLENBQ3ZCLGtCQUFrQixFQUFFLENBQUM7O0FBRTFCLGVBQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDO21CQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUU7U0FBQSxDQUFDLENBQUM7S0FDMUMiLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5leHBvcnQgZnVuY3Rpb24gY29uZmlndXJlKGF1cmVsaWEpIHtcbiAgICBhdXJlbGlhLnVzZVxuICAgICAgICAuc3RhbmRhcmRDb25maWd1cmF0aW9uKClcbiAgICAgICAgLmRldmVsb3BtZW50TG9nZ2luZygpO1xuXG4gICAgYXVyZWxpYS5zdGFydCgpLnRoZW4oYSA9PiBhLnNldFJvb3QoKSk7XG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9