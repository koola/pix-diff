'use strict';

const PixelDiff = require('pixel-diff');

beforeEach(() => {
    this.addMatchers({
        toPass: () => {
            var result = this.actual,
                percent = +((result.differences / result.dimension) * 100).toFixed(2);
            this.message = () => {
                return `Image is visibly different by ${result.differences} pixels, ${percent}%`;
            };
            return (result.code === PixelDiff.RESULT_IDENTICAL) || (result.code === PixelDiff.RESULT_SIMILAR);
        }
    });
});