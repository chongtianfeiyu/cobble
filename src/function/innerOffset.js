/**
 * @file 封装 jq 的 offset 方法，类似 width 和 innerWidth 的关系
 * @author zhujl
 */
define(function (require, exports, module) {

    'use strict';

    var toNumber = require('./toNumber');

    /**
     * @param {jQuery} element
     * @return {Object}
     */
    return function (element) {

        var offsetData = element.offset();
        var borderLeftWidth = element.css('border-left-width');
        var borderTopWidth = element.css('border-top-width');

        return {
            left: offsetData.left + toNumber(borderLeftWidth, 0, 'int'),
            top: offsetData.top + toNumber(borderTopWidth, 0, 'int')
        };

    };

});