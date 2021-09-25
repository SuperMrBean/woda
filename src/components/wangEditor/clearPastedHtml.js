// 清除冗余代码(主要排除word文档复制粘贴多余代码)
// 使用ueditor的filterWord，地址如下：
// https://github.com/fex-team/ueditor/blob/dev-1.5.0/_src/core/filterword.js
let filterWord = (function() {
	// 把cm／pt为单位的值转换为px为单位的值
	function transUnitToPx(val) {
		if (!/(pt|cm)/.test(val)) {
			return val;
		}
		var unit;
		val.replace(/([\d.]+)(\w+)/, function(str, v, u) {
			val = v;
			unit = u;
		});
		switch (unit) {
			case 'cm':
				val = parseFloat(val) * 25;
				break;
			case 'pt':
				val = Math.round((parseFloat(val) * 96) / 72);
		}
		return val + (val ? 'px' : '');
	}

	function isWordDocument(str) {
		return /(class="?Mso|style="[^"]*\bmso\-|w:WordDocument|<(v|o):|lang=)/gi.test(
			str
		);
	}
	//去掉小数
	function transUnit(v) {
		v = v.replace(/[\d.]+\w+/g, function(m) {
			return transUnitToPx(m);
		});
		return v;
	}

	function filterPasteWord(str) {
		return (
			str
				.replace(/[\t\r\n]+/g, ' ')
				.replace(/<!--[\s\S]*?-->/gi, '')
				//转换图片
				.replace(/<v:shape [^>]*>[\s\S]*?.<\/v:shape>/gi, function(str) {
					//opera能自己解析出image所这里直接返回空
					if (browser.opera) {
						return '';
					}
					try {
						//有可能是bitmap占为图，无用，直接过滤掉，主要体现在粘贴excel表格中
						if (/Bitmap/i.test(str)) {
							return '';
						}
						var src = str.match(/src=\s*"([^"]*)"/i)[1];
						return '<img' + src + '" />';
					} catch (e) {
						return '';
					}
				})
				//针对wps添加的多余标签处理
				.replace(/<\/?div[^>]*>/g, '')
				//去掉多余的属性
				.replace(/v:\w+=(["']?)[^'"]+\1/g, '')
				.replace(
					/<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|xml|meta|link|style|\w+:\w+)(?=[\s\/>]))[^>]*>/gi,
					''
				)
				.replace(
					/<p [^>]*class="?MsoHeading"?[^>]*>(.*?)<\/p>/gi,
					'<p><strong>$1</strong></p>'
				)
				//去掉多余的属性
				.replace(/\s+(class|lang|align)\s*=\s*(['"]?)([\w-]+)\2/gi, function(
					str,
					name,
					marks,
					val
				) {
					//保留list的标示
					return name == 'class' && val == 'MsoListParagraph' ? str : '';
				})
				//清除多余的font/span不能匹配&nbsp;有可能是空格
				.replace(/<(font|span)[^>]*>(\s*)<\/\1>/gi, function(a, b, c) {
					return c.replace(/[\t\r\n ]+/g, ' ');
				})
				//处理style的问题
				.replace(/(<[a-z][^>]*)\sstyle=(["'])([^\2]*?)\2/gi, function(
					str,
					tag,
					tmp,
					style
				) {
					var n = [],
						s = style
							.replace(/^\s+|\s+$/, '')
							.replace(/&#39;/g, "'")
							.replace(/&quot;/gi, "'")
							.split(/;\s*/g);

					for (var i = 0, v; (v = s[i]); i++) {
						var name,
							value,
							parts = v.split(':');

						if (parts.length == 2) {
							name = parts[0].toLowerCase();
							value = parts[1].toLowerCase();
							if (
								(/^(background)\w*/.test(name) &&
									value.replace(/(initial|\s)/g, '').length == 0) ||
								(/^(margin)\w*/.test(name) && /^0\w+$/.test(value))
							) {
								continue;
							}

							switch (name) {
								case 'horiz-align':
									n.push('text-align:' + value);
									continue;

								case 'vert-align':
									n.push('vertical-align:' + value);
									continue;

								case 'font-color':
								case 'mso-foreground':
									n.push('color:' + value);
									continue;

								case 'mso-background':
								case 'mso-highlight':
									n.push('background:' + value);
									continue;
								case 'text-line-through':
									if (value == 'single' || value == 'double') {
										n.push('text-decoration:line-through');
									}
									continue;
								case 'mso-zero-height':
									if (value == 'yes') {
										n.push('display:none');
									}
									continue;

								case 'color':
								case 'background':
								case 'text-align':
									n.push(name + ':' + value);
								case 'background':
									break;
							}
						}
					}
					return (
						tag +
						(n.length
							? ' style="' + n.join(';').replace(/;{2,}/g, ';') + '"'
							: '')
					);
				})
				// -------------------修改filterWord-------------------//
				// 清除html/body/head 标签
				// mso、font-family属性
				// 清除个别字体
				.replace(/<(html|body|\/body)[^>]*>/gi, '')
				.replace(/<head>.*<\/head>/gi, '')
				.replace(/(mso-|font-family)[^(;|"|')]*(;|[^"'>])/gi, '')
				.replace(/(YaHei|Microsoft YaHei|sans-serif)(;|,)*/gi, '')
		);
	}

	return function(html) {
		return isWordDocument(html) ? filterPasteWord(html) : html;
	};
})();

export default filterWord;
