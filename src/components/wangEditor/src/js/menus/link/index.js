/*
    menu - link
*/
import $ from '../../util/dom-core.js';
import { getRandom } from '../../util/util.js';
import Panel from '../panel.js';

// 构造函数
function Link(editor) {
	this.editor = editor;
	this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-link"></i></div>');
	this.type = 'panel';

	// 当前是否 active 状态
	this._active = false;
}

// 原型
Link.prototype = {
	constructor: Link,

	// 点击事件
	onClick: function(e) {
		const editor = this.editor;
		let $linkelem;

		if (this._active) {
			// 当前选区在链接里面
			$linkelem = editor.selection.getSelectionContainerElem();
			if (!$linkelem) {
				return;
			}
			// 将该元素都包含在选取之内，以便后面整体替换
			editor.selection.createRangeByElem($linkelem);
			editor.selection.restoreSelection();
			// 显示 panel
			this._createPanel($linkelem.text(), $linkelem.attr('href'));
		} else {
			// 当前选区不在链接里面
			if (editor.selection.isSelectionEmpty()) {
				// 选区是空的，未选中内容
				this._createPanel('', '');
			} else {
				// 选中内容了
				this._createPanel(editor.selection.getSelectionText(), '');
			}
		}
	},

	// 创建 panel
	_createPanel: function(text, link) {
		const _this = this;
		// panel 中需要用到的id
		const inputLinkId = getRandom('input-link');
		const inputTextId = getRandom('input-text');
		const btnOkId = getRandom('btn-ok');
		const btnDelId = getRandom('btn-del');

		// 引用模块获取随机id
		const inputTextId2 = getRandom('input-text');
		const btnOkId2 = getRandom('btn-ok');
		const btnDelId2 = getRandom('btn-del');

		// 是否显示“删除链接”
		const delBtnDisplay = this._active ? 'inline-block' : 'none';

		// 初始化并显示 panel
		const panel = new Panel(this, {
			width: 300,
			// panel 中可包含多个 tab
			tabs: [
				{
					// tab 的标题
					title: '链接',
					// 模板
					tpl: `<div>
                            <input id="${inputTextId}" type="text" class="block" value="${text}" placeholder="链接文字"/></td>
                            <input id="${inputLinkId}" type="text" class="block" value="${link}" placeholder="http://..."/></td>
                            <div class="w-e-button-container">
                                <button id="${btnOkId}" class="right">插入</button>
                                <button id="${btnDelId}" class="gray right" style="display:${delBtnDisplay}">删除链接</button>
                            </div>
                        </div>`,
					// 事件绑定
					events: [
						// 插入链接
						{
							selector: '#' + btnOkId,
							type: 'click',
							fn: () => {
								// 执行插入链接
								const $link = $('#' + inputLinkId);
								const $text = $('#' + inputTextId);
								const link = $link.val();
								const text = $text.val();
								this._insertLink(text, link);

								// 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
								return true;
							},
						},
						// 删除链接
						{
							selector: '#' + btnDelId,
							type: 'click',
							fn: () => {
								// 执行删除链接
								this._delLink();

								// 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
								return true;
							},
						},
					],
				}, // tab end
				{
					// ------------modify--------------//
					// tab 的标题
					title: '引用模块',
					// 模板
					tpl:
						'<div>\n                            <input id="' +
						inputTextId2 +
						'" type="text" class="block" value="' +
						text +
						'" placeholder="\u5f15\u7528\u6a21\u5757\u7eb8\u6761\u0049\u0044"/></td>\n                            </td>\n                            <div class="w-e-button-container">\n                                <button id="' +
						btnOkId2 +
						'" class="right">\u63D2\u5165</button>\n                                <button id="' +
						btnDelId2 +
						'" class="gray right" style="display:' +
						delBtnDisplay +
						'">\u5220\u9664\u94FE\u63A5</button>\n                            </div>\n                        </div>',
					// 事件绑定
					events: [
						// 插入链接
						{
							selector: '#' + btnOkId2,
							type: 'click',
							fn: function fn() {
								// 执行插入链接
								var $text = $('#' + inputTextId2);
								var text = $text.val();

								//--------------（添加）ajax请求--------------//
								let ajax = new Promise((resolve, reject) => {
									_this.editor.Vue.ajax({
										url: '/admin/content/manage/content',
										method: 'get',
										params: {
											id: text,
										},
									}).then(({ data }) => {
										// activity_type  0: 短纸条
										// activity_type  1: 通知纸条 // 暂时不允许
										// activity_type  2: 音频纸条
										// activity_type  3: 图文纸条

										let {
											activityType,
											articleName,
											author,
											content,
											cover,
											articleId,
											articleDate,
											articleLevel,
											articlePrimaryCategory,
											articleSecondCategory,
										} = data;
										let paperType =
											activityType === 2
												? 'audio'
												: activityType === 3
												? 'long'
												: 'short';
										// 切短正文字数
										// 切短后内容过短编辑器会自动将img标签并入类quote_contents下
										// 因此需要再多包一层标签
										// 多行省略时需要将多余标签清除，否则会出现格式混乱
										// 长纸条保留换行分隔符
										content = content.replace(/<.*?>/g, '').substring(0, 60);

										let _html = `
                                        <div class="quote_block quote_block-${
																					activityType === 2 ||
																					activityType === 3
																						? 'img'
																						: 'noImg'
																				}">
                                            <a 
                                              class="quote_block-router" 
                                              href="javascript:;" 
                                              type="${paperType}"
                                              articleid="${articleId}"
                                              date="${articleDate || ''}"
                                              grades="${articleLevel}"
                                              articleprimarycategory="${articlePrimaryCategory ||
																								''}"
                                              articlesecondarycategory="${articleSecondCategory ||
																								''}"
                                            ></a>
                                            ${
																							activityType === 0
																								? `
                                                    <span class="quote_title">${articleName.replace(
																											/\|/g,
																											''
																										)}</span>
                                                    <span class="quote_author">${author}</span>
                                                    <span class="quote_contents">${content}</span>
                                                    `
																								: `
                                                    <div class="quote_flex-space">
                                                        <div>
                                                            <span class="quote_title">${articleName}</span>
                                                            <span class="quote_contents">
                                                                <p>${content}</p>
                                                            </span>
                                                        </div>
                                                        <img class="quote_img" src="${cover}" />
                                                    </div>
                                                    `
																						}
                                        </div>
                                        `;
										resolve(_html);
									});
								});
								// 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
								return ajax.then(_html => {
									_this._insertReferenceLink(_html);
									return true;
								});
								// ------------modify--------------//
							},
						},

						// 删除链接
						{
							selector: '#' + btnDelId2,
							type: 'click',
							fn: function fn() {
								// 执行删除链接
								_this._delLink();

								// 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
								return true;
							},
						},
					],
				}, // tab end
			], // tabs end
		});

		// 显示 panel
		panel.show();

		// 记录属性
		this.panel = panel;
	},

	// 删除当前链接
	_delLink: function() {
		if (!this._active) {
			return;
		}
		const editor = this.editor;
		const $selectionELem = editor.selection.getSelectionContainerElem();
		if (!$selectionELem) {
			return;
		}
		const selectionText = editor.selection.getSelectionText();
		editor.cmd.do('insertHTML', '<span>' + selectionText + '</span>');
	},

	// 插入链接
	_insertLink: function(text, link) {
		const editor = this.editor;
		const config = editor.config;
		const linkCheck = config.linkCheck;
		let checkResult = true; // 默认为 true
		if (linkCheck && typeof linkCheck === 'function') {
			checkResult = linkCheck(text, link);
		}
		if (checkResult === true) {
			editor.cmd.do(
				'insertHTML',
				`<a href="${link}" target="_blank">${text}</a>`
			);
		} else {
			alert(checkResult);
		}
	},

	// ------------modify--------------//
	// 插入引用模块
	_insertReferenceLink: function _insertReferenceLink(text) {
		var editor = this.editor;

		editor.cmd.do(
			'insertHTML',
			'<p><figure class="reference" contenteditable="false">' +
				text +
				'</figure><br /></p>'
		);
	},
	// ------------modify--------------//

	// 试图改变 active 状态
	tryChangeActive: function(e) {
		const editor = this.editor;
		const $elem = this.$elem;
		const $selectionELem = editor.selection.getSelectionContainerElem();
		if (!$selectionELem) {
			return;
		}
		if ($selectionELem.getNodeName() === 'A') {
			this._active = true;
			$elem.addClass('w-e-active');
		} else {
			this._active = false;
			$elem.removeClass('w-e-active');
		}
	},
};

export default Link;
