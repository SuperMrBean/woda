<template>
  <div id="editor">
    <div id="editorElem"></div>
  </div>
</template>
<script>
import E from "./wangEditor/src/js/index";
export default {
  props: {
    apiUrl: {
      type: String,
      default: "/api/upload/files",
    },
  },
  data: function() {
    return {
      // 富文本
      editor: null,
      // 文本html
      html: "",
      content: "",
      $refs: {},
    };
  },
  computed: {
    isVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        if (!val) {
          this.$emit("update:visible", false);
        }
      },
    },
  },
  methods: {
    setContent(content) {
      this.html = content;
      this.editor.txt.html(this.html);
    },
    // 获取内容
    getContent() {
      return this.replaceTextDecoration(this.editor.txt.html());
    },

    // https://github.com/wangfupeng1988/wangEditor/issues/1405
    // 替换成text-decoration
    replaceTextDecoration(content) {
      return content.replace(/text-decoration-line/g, "text-decoration");
    },
  },
  mounted() {
    this.editor = new E("#editorElem");
    this.editor.customConfig.onchange = (html) => {
      this.content = html;
    };
    this.editor.customConfig.menus = [];
    this.editor.customConfig.zIndex = 0;
    this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024; // 将图片大小限制为 3M
    this.editor.customConfig.uploadImgTimeout = 50000;
    // wangEditor必须传递字符串参数，所以重写这个request
    this.editor.customConfig.customUploadImg = (files, insert) => {
      let formatForm = Axios.formatForm({
        file: files[0],
      });
      Axios.formAjax({
        url: this.apiUrl,
        method: "post",
        data: formatForm,
      }).then(({ data }) => {
        insert(data.data);
      });
    };
    this.editor.create();
  },
};
</script>
<style lang="less" scoped>
#editorElem {
  max-width: 100%;
  background: #fed7d8;
  margin-bottom: 20px;
}
.default-text {
  position: relative;
  bottom: -36px;
}
</style>
