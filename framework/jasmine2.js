'use strict';

const PixelDiff = require('pixel-diff');

beforeEach(() => {
    jasmine.addMatchers({
        toPass: () => {
            return {
                compare: actual => {
                    var percent = +((actual.differences / actual.dimension) * 100).toFixed(2);
                    return {
                        pass: (actual.code === PixelDiff.RESULT_IDENTICAL) || (actual.code === PixelDiff.RESULT_SIMILAR),
                        message: `Image is visibly different by ${actual.differences} pixels, ${percent}%`
                    };
                }
            };
        }
    });
});