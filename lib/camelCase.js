'use strict';

/**
 * Converts string to a camel cased string
 *
 * @method camelCase
 * @param {string} text
 * @returns {string}
 * @public
 */

function camelCase(text) {
    text = text || '';
    return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
        return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
}

module.exports = camelCase;