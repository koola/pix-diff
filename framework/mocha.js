'use strict';

var chai = require('chai'),
    blinkDiff = require('blink-diff'),
    util = require('util');

chai.Assertion.addMethod('matchScreen', function () {
    this._obj.then(function (result) {
        var percent = +((result.differences / result.dimension) * 100).toFixed(2);
        this.assert(
                (result.code === blinkDiff.RESULT_IDENTICAL) || (result.code === blinkDiff.RESULT_SIMILAR)
            , util.format("Image is visibly different by %s pixels, %s %", result.differences, percent)
        );
    }.bind(this));
});