'use strict';

var chai = require('chai'),
    PixelDiff = require('pixel-diff');

chai.Assertion.addMethod('toPass', () => {
    this._obj.then(result => {
        var percent = +((result.differences / result.dimension) * 100).toFixed(2);
        this.assert((result.code === PixelDiff.RESULT_IDENTICAL) || (result.code === PixelDiff.RESULT_SIMILAR),
            `Image is visibly different by ${result.differences} pixels, ${percent}%`);
    });
});