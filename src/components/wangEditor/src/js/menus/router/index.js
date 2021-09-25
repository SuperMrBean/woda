/*
    menu - link
*/
import $ from '../../util/dom-core.js';

// 构造函数
function Router(editor) {
	this.editor = editor;
	this.$elem = $(
		'<div class="w-e-menu"><i id="w-e_link-router" class="w-e-menu_router">Router</i></div>'
	);
	this.type = 'panel';

	// 当前是否 active 状态
	this._active = false;
}

// 原型
Router.prototype = {
	constructor: Router,
};

export default Router;
