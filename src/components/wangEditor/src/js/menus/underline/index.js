/*
    underline-menu
*/
import $ from '../../util/dom-core.js';

// 构造函数
function Underline(editor) {
	this.editor = editor;
	this.$elem = $(
		`<div class="w-e-menu">
            <i class="w-e-icon-underline"></i>
        </div>`
	);
	this.type = 'click';

	// 当前是否 active 状态
	this._active = false;
}

// 原型
Underline.prototype = {
	constructor: Underline,

	// 点击事件
	onClick: function(e) {
		// 点击菜单将触发这里

		const editor = this.editor;
		const isSeleEmpty = editor.selection.isSelectionEmpty();

		if (isSeleEmpty) {
			// 选区是空的，插入并选中一个“空白”
			editor.selection.createEmptyRange();
		}

		// 执行 underline 命令
		editor.cmd.do('underline');

		if (isSeleEmpty) {
			// 需要将选取折叠起来
			editor.selection.collapseRange();
			editor.selection.restoreSelection();
		}
	},

	// 试图改变 active 状态
	tryChangeActive: function(e) {
		const editor = this.editor;
		const $elem = this.$elem;
		if (editor.cmd.queryCommandState('underline')) {
			this._active = true;
			$elem.addClass('w-e-active');
		} else {
			this._active = false;
			$elem.removeClass('w-e-active');
		}
	},
};

export default Underline;
