/*
    clear
*/
import $ from '../../util/dom-core.js';

// 构造函数
function Clear(editor) {
	this.editor = editor;
	this.$elem = $('<div class="w-e-menu">\n            清除\n        </div>');
	this.type = 'click';

	(this.editor.cmd._clear = function() {
		let range = this.editor.selection.getSelectionContainerElem();
		let node = range[0];

		if (!range.collapsed) {
			while (['A', 'SPAN'].includes(node.tagName)) {
				node = node.parentNode;
			}
			// 选区bug
			// 判断选区内容是否在不可编辑区域之内
			if ($(node).attr('contenteditable')) {
				$(node)
					.children()
					.forEach(child => {
						child.removeAttribute('style');
					});
			} else {
				node.removeAttribute('style');
			}
		}
		let selectionText = this.editor.selection.getSelectionText();
		editor.cmd.do('insertHTML', selectionText);
	}),
		// 当前是否 active 状态
		(this._active = false);
}

// 原型
Clear.prototype = {
	constructor: Clear,

	// 点击事件
	onClick: function onClick(e) {
		// 点击菜单将触发这里

		var editor = this.editor;
		var isSeleEmpty = editor.selection.isSelectionEmpty();

		if (isSeleEmpty) {
			// 选区是空的，插入并选中一个“空白”
			return;
		}

		// 执行 bold 命令
		editor.cmd.do('clear');
	},

	// // 试图改变 active 状态
	// tryChangeActive: function tryChangeActive(e) {
	//     var editor = this.editor;
	//     var $elem = this.$elem;
	//     if (editor.cmd.queryCommandState('bold')) {
	//         this._active = true;
	//         $elem.addClass('w-e-active');
	//     } else {
	//         this._active = false;
	//         $elem.removeClass('w-e-active');
	//     }
	// }
};

export default Clear;
