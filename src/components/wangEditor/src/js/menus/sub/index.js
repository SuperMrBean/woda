/*
    sup
*/
import $ from '../../util/dom-core.js';

// 构造函数
function Sub(editor) {
	this.editor = editor;
	this.$elem = $(
		'<div class="w-e-menu">\n            <i style="color: #999">A<sub>x</sub></i>\n        </div>'
	);
	this.type = 'click';

	// 当前是否 active 状态
	this._active = false;
}

// 原型
Sub.prototype = {
	constructor: Sub,

	// 点击事件
	onClick: function onClick(e) {
		// 点击菜单将触发这里

		let editor = this.editor;
		let isSeleEmpty = editor.selection.isSelectionEmpty();

		if (isSeleEmpty) {
			// 选区是空的，插入并选中一个“空白”
			return;
		}

		let selectionText = editor.selection.getSelectionText();

		editor._useStyleWithCSS = false;
		editor.cmd.do('subscript', selectionText);
	},

	// 试图改变 active 状态
	tryChangeActive: function tryChangeActive(e) {
		var editor = this.editor;
		var $elem = this.$elem;
		if (editor.cmd.queryCommandState('subscript')) {
			this._active = true;
			$elem.addClass('w-e-active');
		} else {
			this._active = false;
			$elem.removeClass('w-e-active');
		}
	},
};

export default Sub;
