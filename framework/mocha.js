'use strict';

var chai = require('chai'),
    PixelDiff = require('pixel-diff'),
    util = require('util');

chai.Assertion.addMethod('matchScreen', function () {
    this._obj.then(function (result) {
        var percent = +((result.differences / result.dimension) * 100).toFixed(2);
        this.assert(
                (result.code === PixelDiff.RESULT_IDENTICAL) || (result.code === PixelDiff.RESULT_SIMILAR)
            , util.format("Image is visibly different by %s pixels, %s %", result.differences, percent)
        );
    }.bind(this));
});