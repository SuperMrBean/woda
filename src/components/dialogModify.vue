<template>
  <el-dialog
    width="800px"
    title="修改订单"
    :visible.sync="isVisible"
    custom-class="dialogModify"
    @close="onClose"
    @open="onOpen"
  >
    <div class="flag">
      <div>aaaa</div>
      <div slot="footer" class="footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="onConfirm"
          >确 定</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object || null,
      require: true,
    },
  },
  data: function() {
    return {
      loading: false,
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
    onClose() {
      this.isVisible = false;
      this.loading = false;
    },
    onOpen() {
      console.log(this.data);
    },
    onConfirm() {
      console.log("confirm");
    },
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.dialogModify {
}
</style>
