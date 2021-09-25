/*
    indent
*/
// 构造函数
import $ from '../../util/dom-core.js';

function Indent(editor) {
	this.editor = editor;
	this.$elem = $('<div class="w-e-menu">\n            缩进\n        </div>');
	this.type = 'click';

	(this.editor.cmd._indent = function(value) {
		let $selectionElem = this.editor.selection.getSelectionContainerElem();
		console.log($selectionElem);
		content = $selectionElem.text();
		console.log(content);
		// let range = this.editor.selection.getSelectionContainerElem();
		// let node = range[0];
		// if(range.collapsed){
		//   var txt = this.document.createTextNode('p');
		//   range.insertNode(txt);
		// }
		// if (!range.collapsed) {
		//   while( ['A', 'SPAN'].includes(node.tagName) ) {
		//     node = node.parentNode;
		//   }
		//   // 选区bug
		//   // 判断选区内容是否在不可编辑区域之内
		//   if ($(node).attr('contenteditable')) {
		//     $(node).children().forEach( child => {
		//       child.setAttribute('style', 'text-indent: 2em');
		//     })
		//   } else {
		//     node.setAttribute('style', 'text-indent: 2em');
		//   }
		// }
		// let block = {address:1,blockquote:1,center:1,dir:1,div:1,dl:1,fieldset:1,form:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,hr:1,isindex:1,menu:1,noframes:1,ol:1,p:1,pre:1,table:1,ul:1};
		// let isBlockElm = function (node) {
		//   return node.nodeType == 1 && block[node.tagName];
		// };

		// let range = this.editor.selection.getRange();
		// let pre = null;
		// let node = null;
		// let tmp = document.createTextNode('');

		// node = range.startContainer;
		// if (node.nodeType == 1) {
		//     if (node.childNodes[range.startOffset]) {
		//         pre = node = node.childNodes[range.startOffset]
		//     } else {
		//         node.appendChild(tmp);
		//         pre = node = tmp;
		//     }
		// } else {
		//     pre = node;
		// }
		// while (1) {
		//     if (isBlockElm(node)) {
		//         node = pre;
		//         while ((pre = node.previousSibling) && isBlockElm(pre)) {
		//             node = pre;
		//         }
		//         this.setStartBefore(node);
		//         break;
		//     }
		//     pre = node;
		//     node = node.parentNode;
		// }
		// node = range.endContainer;
		// if (node.nodeType == 1) {
		//     if (pre = node.childNodes[range.endOffset]) {
		//         node.insertBefore(tmp, pre);
		//     } else {
		//         node.appendChild(tmp);
		//     }
		//     pre = node = tmp;
		// } else {
		//     pre = node;
		// }
		// while (1) {
		//     if (isBlockElm(node)) {
		//         node = pre;
		//         while ((pre = node.nextSibling) && sBlockElm(pre)) {
		//             node = pre;
		//         }
		//         range.setEndAfter(node);
		//         break;
		//     }
		//     pre = node;
		//     node = node.parentNode;
		// }
		// if (tmp.parentNode === range.endContainer) {
		//   range.endOffset--;
		// }
		// console.log(tmp);

		// enlarge:function (toBlock, stopFn) {
		//   var isBody = domUtils.isBody,
		//       pre, node, tmp = this.document.createTextNode('');
		//   if (toBlock) {
		//       node = this.startContainer;
		//       if (node.nodeType == 1) {
		//           if (node.childNodes[this.startOffset]) {
		//               pre = node = node.childNodes[this.startOffset]
		//           } else {
		//               node.appendChild(tmp);
		//               pre = node = tmp;
		//           }
		//       } else {
		//           pre = node;
		//       }
		//       while (1) {
		//           if (domUtils.isBlockElm(node)) {
		//               node = pre;
		//               while ((pre = node.previousSibling) && !domUtils.isBlockElm(pre)) {
		//                   node = pre;
		//               }
		//               this.setStartBefore(node);
		//               break;
		//           }
		//           pre = node;
		//           node = node.parentNode;
		//       }
		//       node = this.endContainer;
		//       if (node.nodeType == 1) {
		//           if (pre = node.childNodes[this.endOffset]) {
		//               node.insertBefore(tmp, pre);
		//           } else {
		//               node.appendChild(tmp);
		//           }
		//           pre = node = tmp;
		//       } else {
		//           pre = node;
		//       }
		//       while (1) {
		//           if (domUtils.isBlockElm(node)) {
		//               node = pre;
		//               while ((pre = node.nextSibling) && !domUtils.isBlockElm(pre)) {
		//                   node = pre;
		//               }
		//               this.setEndAfter(node);
		//               break;
		//           }
		//           pre = node;
		//           node = node.parentNode;
		//       }
		//       if (tmp.parentNode === this.endContainer) {
		//           this.endOffset--;
		//       }
		//       domUtils.remove(tmp);
		//   }

		//   // 扩展边界到最大
		//   if (!this.collapsed) {
		//       while (this.startOffset == 0) {
		//           if (stopFn && stopFn(this.startContainer)) {
		//               break;
		//           }
		//           if (isBody(this.startContainer)) {
		//               break;
		//           }
		//           this.setStartBefore(this.startContainer);
		//       }
		//       while (this.endOffset == (this.endContainer.nodeType == 1 ? this.endContainer.childNodes.length : this.endContainer.nodeValue.length)) {
		//           if (stopFn && stopFn(this.endContainer)) {
		//               break;
		//           }
		//           if (isBody(this.endContainer)) {
		//               break;
		//           }
		//           this.setEndAfter(this.endContainer);
		//       }
		//   }
		//   return this;
		// },
	}),
		// 当前是否 active 状态
		(this._active = false);
}

// 原型
Indent.prototype = {
	constructor: Indent,

	// 点击事件
	onClick: function onClick(e) {
		// 点击菜单将触发这里

		var editor = this.editor;
		let $finalElement = '';
		editor.cmd.do('formatBlock', '<aside>');

		let parent = document.querySelectorAll('aside')[0];
		$(parent)
			.children()
			.forEach(child => {
				let paragraph = document.createElement('<p>');
				if (['A', 'SPAN'].includes(child.tagName)) {
					$finalElement += `<p style='text-indent: 2em'>${child}</p>`;
					console.log(child);
					console.log($finalElement);
				}
				child.setAttribute('style', 'text-indent: 2em');
			});
		console.log($($finalElement)[0]);
		parent.replaceChild($($finalElement)[0], parent);
		// let selectionText = editor.selection.getSelectionText();

		// editor.cmd.do('indent', selectionText);
	},

	// 试图改变 active 状态
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

// me.execCommand('Paragraph','p',{style:'text-indent:'+ value});
// editor.cmd.do('Paragraph','p', {style:'text-indent: 2em'});
// UE.plugins['paragraph'] = function() {
//   var me = this,
//       block = domUtils.isBlockElm,
//       notExchange = ['TD','LI','PRE'],

//       doParagraph = function(range,style,attrs,sourceCmdName){
//           var bookmark = range.createBookmark(),
//               filterFn = function( node ) {
//                   return   node.nodeType == 1 ? node.tagName.toLowerCase() != 'br' &&  !domUtils.isBookmarkNode(node) : !domUtils.isWhitespace( node );
//               },
//               para;

//           range.enlarge( true );
//           var bookmark2 = range.createBookmark(),
//               current = domUtils.getNextDomNode( bookmark2.start, false, filterFn ),
//               tmpRange = range.cloneRange(),
//               tmpNode;
//           while ( current && !(domUtils.getPosition( current, bookmark2.end ) & domUtils.POSITION_FOLLOWING) ) {
//               if ( current.nodeType == 3 || !block( current ) ) {
//                   tmpRange.setStartBefore( current );
//                   while ( current && current !== bookmark2.end && !block( current ) ) {
//                       tmpNode = current;
//                       current = domUtils.getNextDomNode( current, false, null, function( node ) {
//                           return !block( node );
//                       } );
//                   }
//                   tmpRange.setEndAfter( tmpNode );

//                   para = range.document.createElement( style );
//                   if(attrs){
//                       domUtils.setAttributes(para,attrs);
//                       if(sourceCmdName && sourceCmdName == 'customstyle' && attrs.style){
//                           para.style.cssText = attrs.style;
//                       }
//                   }
//                   para.appendChild( tmpRange.extractContents() );
//                   //需要内容占位
//                   if(domUtils.isEmptyNode(para)){
//                       domUtils.fillChar(range.document,para);

//                   }

//                   tmpRange.insertNode( para );

//                   var parent = para.parentNode;
//                   //如果para上一级是一个block元素且不是body,td就删除它
//                   if ( block( parent ) && !domUtils.isBody( para.parentNode ) && utils.indexOf(notExchange,parent.tagName)==-1) {
//                       //存储dir,style
//                       if(!(sourceCmdName && sourceCmdName == 'customstyle')){
//                           parent.getAttribute('dir') && para.setAttribute('dir',parent.getAttribute('dir'));
//                           //trace:1070
//                           parent.style.cssText && (para.style.cssText = parent.style.cssText + ';' + para.style.cssText);
//                           //trace:1030
//                           parent.style.textAlign && !para.style.textAlign && (para.style.textAlign = parent.style.textAlign);
//                           parent.style.textIndent && !para.style.textIndent && (para.style.textIndent = parent.style.textIndent);
//                           parent.style.padding && !para.style.padding && (para.style.padding = parent.style.padding);
//                       }

//                       //trace:1706 选择的就是h1-6要删除
//                       if(attrs && /h\d/i.test(parent.tagName) && !/h\d/i.test(para.tagName) ){
//                           domUtils.setAttributes(parent,attrs);
//                           if(sourceCmdName && sourceCmdName == 'customstyle' && attrs.style){
//                               parent.style.cssText = attrs.style;
//                           }
//                           domUtils.remove(para,true);
//                           para = parent;
//                       }else{
//                           domUtils.remove( para.parentNode, true );
//                       }

//                   }
//                   if(  utils.indexOf(notExchange,parent.tagName)!=-1){
//                       current = parent;
//                   }else{
//                      current = para;
//                   }

//                   current = domUtils.getNextDomNode( current, false, filterFn );
//               } else {
//                   current = domUtils.getNextDomNode( current, true, filterFn );
//               }
//           }
//           return range.moveToBookmark( bookmark2 ).moveToBookmark( bookmark );
//       };
//   // me.setOpt('paragraph',{'p':'', 'h1':'', 'h2':'', 'h3':'', 'h4':'', 'h5':'', 'h6':''});
//   me.commands['paragraph'] = {
//       execCommand : function( cmdName, style,attrs,sourceCmdName ) {
//           var range = this.selection.getRange();
//            //闭合时单独处理
//           if(range.collapsed){
//               var txt = this.document.createTextNode('p');
//               range.insertNode(txt);
//               //去掉冗余的fillchar
//               // if(browser.ie){
//               //     var node = txt.previousSibling;
//               //     if(node && domUtils.isWhitespace(node)){
//               //         domUtils.remove(node);
//               //     }
//               //     node = txt.nextSibling;
//               //     if(node && domUtils.isWhitespace(node)){
//               //         domUtils.remove(node);
//               //     }
//               // }

//           }
//           range = doParagraph(range,style,attrs,sourceCmdName);
//           if(txt){
//               range.setStartBefore(txt).collapse(true);
//               pN = txt.parentNode;

//               domUtils.remove(txt);

//               if(domUtils.isBlockElm(pN)&&domUtils.isEmptyNode(pN)){
//                   domUtils.fillNode(this.document,pN);
//               }

//           }

//           if(browser.gecko && range.collapsed && range.startContainer.nodeType == 1){
//               var child = range.startContainer.childNodes[range.startOffset];
//               if(child && child.nodeType == 1 && child.tagName.toLowerCase() == style){
//                   range.setStart(child,0).collapse(true);
//               }
//           }
//           //trace:1097 原来有true，原因忘了，但去了就不能清除多余的占位符了
//           range.select();

//           return true;
//       },
//       queryCommandValue : function() {
//           var node = domUtils.filterNodeList(this.selection.getStartElementPath(),'p h1 h2 h3 h4 h5 h6');
//           return node ? node.tagName.toLowerCase() : '';
//       },
//       remove:function (node, keepChildren) {
//         var parent = node.parentNode,
//             child;
//         if (parent) {
//             if (keepChildren && node.hasChildNodes()) {
//                 while (child = node.firstChild) {
//                     parent.insertBefore(child, node);
//                 }
//             }
//             parent.removeChild(node);
//         }
//         return node;
//       },
//       enlarge:function (toBlock, stopFn) {
//         var isBody = domUtils.isBody,
//             pre, node, tmp = this.document.createTextNode('');
//         if (toBlock) {
//             node = this.startContainer;
//             if (node.nodeType == 1) {
//                 if (node.childNodes[this.startOffset]) {
//                     pre = node = node.childNodes[this.startOffset]
//                 } else {
//                     node.appendChild(tmp);
//                     pre = node = tmp;
//                 }
//             } else {
//                 pre = node;
//             }
//             while (1) {
//                 if (domUtils.isBlockElm(node)) {
//                     node = pre;
//                     while ((pre = node.previousSibling) && !domUtils.isBlockElm(pre)) {
//                         node = pre;
//                     }
//                     this.setStartBefore(node);
//                     break;
//                 }
//                 pre = node;
//                 node = node.parentNode;
//             }
//             node = this.endContainer;
//             if (node.nodeType == 1) {
//                 if (pre = node.childNodes[this.endOffset]) {
//                     node.insertBefore(tmp, pre);
//                 } else {
//                     node.appendChild(tmp);
//                 }
//                 pre = node = tmp;
//             } else {
//                 pre = node;
//             }
//             while (1) {
//                 if (domUtils.isBlockElm(node)) {
//                     node = pre;
//                     while ((pre = node.nextSibling) && !domUtils.isBlockElm(pre)) {
//                         node = pre;
//                     }
//                     this.setEndAfter(node);
//                     break;
//                 }
//                 pre = node;
//                 node = node.parentNode;
//             }
//             if (tmp.parentNode === this.endContainer) {
//                 this.endOffset--;
//             }
//             domUtils.remove(tmp);
//         }

//         // 扩展边界到最大
//         if (!this.collapsed) {
//             while (this.startOffset == 0) {
//                 if (stopFn && stopFn(this.startContainer)) {
//                     break;
//                 }
//                 if (isBody(this.startContainer)) {
//                     break;
//                 }
//                 this.setStartBefore(this.startContainer);
//             }
//             while (this.endOffset == (this.endContainer.nodeType == 1 ? this.endContainer.childNodes.length : this.endContainer.nodeValue.length)) {
//                 if (stopFn && stopFn(this.endContainer)) {
//                     break;
//                 }
//                 if (isBody(this.endContainer)) {
//                     break;
//                 }
//                 this.setEndAfter(this.endContainer);
//             }
//         }
//         return this;
//       },
//       /**
//          * 创建当前range的一个书签，记录下当前range的位置，方便当dom树改变时，还能找回原来的选区位置
//          * @method createBookmark
//          * @param { Boolean } serialize 控制返回的标记位置是对当前位置的引用还是ID，如果该值为true，则
//          *                              返回标记位置的ID， 反之则返回标记位置节点的引用
//          * @return { Object } 返回一个书签记录键值对， 其包含的key有： start => 开始标记的ID或者引用，
//          *                          end => 结束标记的ID或引用， id => 当前标记的类型， 如果为true，则表示
//          *                          返回的记录的类型为ID， 反之则为引用
//          */
//         createBookmark:function (serialize, same) {
//           var endNode,
//               startNode = this.document.createElement('span');
//           startNode.style.cssText = 'display:none;line-height:0px;';
//           startNode.appendChild(this.document.createTextNode('\u200D'));
//           startNode.id = '_baidu_bookmark_start_' + (same ? '' : guid++);

//           if (!this.collapsed) {
//               endNode = startNode.cloneNode(true);
//               endNode.id = '_baidu_bookmark_end_' + (same ? '' : guid++);
//           }
//           this.insertNode(startNode);
//           if (endNode) {
//               this.collapse().insertNode(endNode).setEndBefore(endNode);
//           }
//           this.setStartAfter(startNode);
//           return {
//               start:serialize ? startNode.id : startNode,
//               end:endNode ? serialize ? endNode.id : endNode : null,
//               id:serialize
//           }
//       },
//       /**
//          *  调整当前range的边界到书签位置，并删除该书签对象所标记的位置内的节点
//          *  @method  moveToBookmark
//          *  @param { BookMark } bookmark createBookmark所创建的标签对象
//          *  @return { UE.dom.Range } 当前range对象
//          *  @see UE.dom.Range:createBookmark(Boolean)
//          */
//         moveToBookmark:function (bookmark) {
//           var start = bookmark.id ? this.document.getElementById(bookmark.start) : bookmark.start,
//               end = bookmark.end && bookmark.id ? this.document.getElementById(bookmark.end) : bookmark.end;
//           this.setStartBefore(start);
//           domUtils.remove(start);
//           if (end) {
//               this.setEndBefore(end);
//               domUtils.remove(end);
//           } else {
//               this.collapse(true);
//           }
//           return this;
//       },
//   };
// };

export default Indent;
