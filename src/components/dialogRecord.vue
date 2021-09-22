<template>
  <el-dialog
    width="1000px"
    title="回调记录"
    :visible.sync="isVisible"
    custom-class="dialogRecord"
    @close="onClose"
    @open="onOpen"
  >
    <div class="wrap">
      aaa
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
  },
  data: function() {
    return {
      pageNo: 1,
      total: 0,
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
    getRecordList() {
      this.loading = true;
      const params = {
        pageNo: this.pageNo,
      };
      $.ajax({
        url: "//47.110.83.17:8700/api/callbackRecord/page",
        type: "GET",
        headers: {
          token: this.$root.token,
        },
        data: params,
      })
        .then(({ data: { records, total, size }, status, msg }) => {
          if (status === 200) {
            console.log(records);
            console.log(total);
            console.log(size);
          } else {
            this.$message.error(msg);
          }
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
        });
    },
    onClose() {
      this.pageNo = 1;
      this.total = 0;
      this.isVisible = false;
    },
    onOpen() {
      this.getRecordList();
    },
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.dialogFlag {
  .wrap {
    width: 100%;
  }
}
</style>
