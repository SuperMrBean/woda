/*
    sup
*/
import $ from '../../util/dom-core.js';

// 构造函数
function Sup(editor) {
	this.editor = editor;
	this.$elem = $(
		'<div class="w-e-menu">\n            <i style="color: #999;line-height: 0px;">A<sup>x</sup></i>\n        </div>'
	);
	this.type = 'click';

	// 当前是否 active 状态
	this._active = false;
}

// 原型
Sup.prototype = {
	constructor: Sup,

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
		editor.cmd.do('superscript', selectionText);
	},

	// 试图改变 active 状态
	tryChangeActive: function tryChangeActive(e) {
		var editor = this.editor;
		var $elem = this.$elem;
		if (editor.cmd.queryCommandState('superscript')) {
			this._active = true;
			$elem.addClass('w-e-active');
		} else {
			this._active = false;
			$elem.removeClass('w-e-active');
		}
	},
};

export default Sup;
