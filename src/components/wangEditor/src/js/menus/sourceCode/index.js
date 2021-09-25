/*
    查看源代码
*/
import $ from '../../util/dom-core.js';

// 构造函数
function SourceCode(editor) {
	this.editor = editor;
	this.$elem = $(
		`<div class="w-e-menu">
            <i class="">code</i>
        </div>`
	);
	this.type = 'click';

	// 当前是否 active 状态
	this._active = false;

	this.editor.sourceCodeEle = null;

	this.timer = null;
}

// 原型
SourceCode.prototype = {
	constructor: SourceCode,

	// 点击事件
	onClick: function(e) {
		// 点击菜单将触发这里

		const editor = this.editor;
		let container = editor.$textContainerElem[0];
		let textContainer = editor.$textElem;

		editor.$textElem.on('keyup', e => {
			if (editor.sourceCodeEle) {
				editor.sourceCodeEle.textContent = textContainer.html();
			}
		});

		this._active = !this._active;
		if (this._active) {
			if (!editor.sourceCodeEle) {
				editor.sourceCodeEle = document.createElement('div');
				editor.sourceCodeEle.style.cssText =
					'width: 50%;height: 100%;overflow: scroll;padding: 20px;background: #E4E7ED; color: #606266;';
				editor.sourceCodeEle.setAttribute('contenteditable', 'true');
				editor.sourceCodeEle.textContent = textContainer.html();

				editor.sourceCodeEle.addEventListener('keyup', e => {
					if (this.timer) clearTimeout(this.timer);
					this.timer = setTimeout(() => {
						editor.$textElem.html(editor.sourceCodeEle.textContent);
					}, 500);
				});
			}
			editor.sourceCodeEle.style.display = 'block';
			container.appendChild(editor.sourceCodeEle);
			textContainer[0].style.width = '50%';
		} else {
			editor.sourceCodeEle.style.display = 'none';
			textContainer[0].style.width = '100%';
		}
	},
};

export default SourceCode;
