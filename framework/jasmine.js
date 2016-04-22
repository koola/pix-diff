'use strict';

var BlinkDiff = require('blink-diff'),
    util = require('util');

beforeEach(function() {
    this.addMatchers({
        toMatchScreen: function () {
            var result = this.actual,
                percent = +((result.differences / result.dimension) * 100).toFixed(2);
            this.message = function () {
                return util.format("Image is visibly different by %s pixels, %s %", result.differences, percent);
            };
            return ((result.code === BlinkDiff.RESULT_IDENTICAL) || (result.code === BlinkDiff.RESULT_SIMILAR));
        }
    });
});
