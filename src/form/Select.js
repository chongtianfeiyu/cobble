/**
 * @file 模拟 select
 * @author zhujl
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * select 和 input 不同
     *
     * 不要在页面写一堆 <select>，然后再替换，这样会产生没必要的开销
     *
     * 使用约定如下：
     *
     * 菜单项 value: data-value="1"
     * 菜单项 text:  date-text="xxx" 或 innerHTML，优先使用 data-text
     */

    var ComboBox = require('../ui/ComboBox');

    var jquerify = require('../function/jquerify');
    var lifeCycle = require('../function/lifeCycle');

    /**
     * 下拉菜单
     *
     * @constructor
     * @param {Object} options
     * @property {jQuery=} options.element 主元素
     * @property {string} options.name
     *
     * @property {Array=} options.data 下拉菜单的数据
     * @property {string=} options.value 当前选中的值
     *
     * @property {string=} options.buttonSelector 点击触发下拉菜单显示的元素
     * @property {string=} options.menuSelector 下拉菜单元素
     *
     * @property {string=} options.activeClass 菜单项选中状态的 class，可提升用户体验
     * @property {string=} options.openClass 菜单展开状态的 class
     *
     * @property {Function=} options.setText 把选中的菜单项文本写入到按钮上
     * @property {Function=} options.onChange 选中菜单项触发
     */
    function Select(options) {
        return lifeCycle.init(this, options);
    }

    Select.prototype = {

        constructor: Select,

        type: 'Select',

        /**
         * 初始化
         *
         * @private
         */
        init: function () {

            var me = this;
            var element = me.element;

            var html = '<input type="hidden" name="' + me.name + '"';
            if (me.value != null) {
                html += ' value="' + me.value + '"';
            }
            if (element.attr('required')) {
                html += ' required';
            }
            html += ' />';

            var input = me.input = $(html);
            element.append(input);

            me.comboBox = new ComboBox({
                element: element,
                button: element.find(me.buttonSelector),
                menu: element.find(me.menuSelector),
                data: me.data,
                value: me.value,
                defaultText: me.defaultText,
                template: me.template,
                renderTemplate: me.renderTemplate,
                activeClass: me.activeClass,
                openClass: me.openClass,
                setText: function (text) {
                    if ($.isFunction(me.setText)) {
                        me.setText(text);
                    }
                },
                onChange: function (e, data) {

                    me.setValue(data.value);

                    me.emit('change', data);

                },
                onAfterShow: function () {
                    element.trigger('focusin');
                },
                onAfterHide: function () {
                    element.trigger('focusout');
                }
            });

        },

        /**
         * 获取当前选中的值
         *
         * @return {string}
         */
        getValue: function () {
            return this.value;
        },

        /**
         * 设置当前选中的值
         *
         * @param {string} value
         * @return {boolean} 是否设置成功
         */
        setValue: function (value) {

            var me = this;

            var result = value != me.value;

            if (result) {
                me.value = value;
                me.input.val(value == null ? '' : value);

                me.comboBox.setValue(value);
            }

            return result;

        },

        /**
         * 刷新数据
         *
         * @param {Object} options
         * @property {Array} options.data 数据
         * @property {index=} options.value 选中的值
         */
        refresh: function (options) {
            this.comboBox.refresh(options);
        },

        /**
         * 销毁对象
         */
        dispose: function () {

            var me = this;

            lifeCycle.dispose(me);

            me.comboBox.dispose();

            me.input =
            me.element =
            me.comboBox = null;
        }
    };

    jquerify(Select.prototype);

    /**
     * 默认配置
     *
     * @static
     * @type {Object}
     */
    Select.defaultOptions = {
        defaultText: '请选择',
        buttonSelector: '.btn-default',
        menuSelector: '.dropdown-menu',
        activeClass: 'active',
        openClass: 'open',
        renderTemplate: function (data, tpl) {

            var html = [ ];

            $.each(
                data,
                function (index, item) {
                    html.push(
                        '<li data-value="' + item.value + '">' + item.text + '</li>'
                    );
                }
            );

            return html.join('');

        },
        setText: function (text) {
            var button = this.element.find(this.buttonSelector);
            button.find('span').html(text);
        }
    };


    return Select;

});
