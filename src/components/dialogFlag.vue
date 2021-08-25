<template>
  <el-dialog
    width="600px"
    title="修改旗帜"
    :visible.sync="isVisible"
    custom-class="dialogFlag"
    @close="onClose"
    @open="onOpen"
  >
    <div class="flag">
      <el-radio-group v-model="sellerFlag">
        <el-radio :label="0"><div class="flagGrey"/></el-radio>
        <el-radio :label="1"><div class="flagRed"/></el-radio>
        <el-radio :label="2"><div class="flagYellow"/></el-radio>
        <el-radio :label="3"><div class="flagGreen"/></el-radio>
        <el-radio :label="4"><div class="flagBlue"/></el-radio>
        <el-radio :label="5"><div class="flagPurple"/></el-radio>
      </el-radio-group>
      <el-input
        style="margin-top:20px;"
        v-model="sellerMemo"
        type="textarea"
        placeholder="请输入留言信息"
        rows="6"
      />
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
    shopId: {
      type: Number,
    },
  },
  data: function() {
    return {
      loading: false,
      sellerFlag: null,
      sellerMemo: "",
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
      this.loading = false;
      this.sellerFlag = null;
      this.sellerMemo = "";
      this.isVisible = false;
    },
    onOpen() {
      const { sellerFlag, sellerMemo } = this.data;
      this.sellerFlag = sellerFlag;
      this.sellerMemo = sellerMemo;
    },
    onConfirm() {
      const { tid = "" } = this.data || {};
      const data = {
        apiMethodName: "taobao.trade.memo.update",
        textParams: {
          tid,
          memo: this.sellerMemo,
          flag: this.sellerFlag,
          reset: false,
        },
        shopId: this.shopId,
      };
      this.loading = true;
      $.ajax({
        url: "//zft.topchitu.com/api/taobao",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
      })
        .then(() => {
          setTimeout(() => {
            this.loading = false;
            this.$emit("refresh");
            this.isVisible = false;
          }, 2000);
        })
        .catch((error) => {
          const { responseJSON = {} } = error || {};
          const { subMsg = "" } = responseJSON || {};
          this.$message.error(subMsg);
          this.loading = false;
        });
    },
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.dialogFlag {
  .el-dialog__body {
    padding: 20px 20px;
  }
  .flag {
    display: flex;
    flex-direction: column;
    .el-radio-group {
      display: flex;
      align-items: center;
    }
    .el-radio {
      display: flex;
      align-items: center;
    }
    .flagGrey {
      display: inline-block;
      cursor: pointer;
      width: 14px;
      height: 14px;
      background: url("../assets/img/flag_grey.png") 0 0 no-repeat;
      background-size: 100%;
    }
    .flagYellow {
      display: inline-block;
      cursor: pointer;
      width: 14px;
      height: 14px;
      background: url("../assets/img/flag_yellow.png") 0 0 no-repeat;
      background-size: 100%;
    }
    .flagRed {
      display: inline-block;
      cursor: pointer;
      width: 14px;
      height: 14px;
      background: url("../assets/img/flag_red.png") 0 0 no-repeat;
      background-size: 100%;
    }
    .flagBlue {
      display: inline-block;
      cursor: pointer;
      width: 14px;
      height: 14px;
      background: url("../assets/img/flag_blue.png") 0 0 no-repeat;
      background-size: 100%;
    }
    .flagGreen {
      display: inline-block;
      cursor: pointer;
      width: 14px;
      height: 14px;
      background: url("../assets/img/flag_green.png") 0 0 no-repeat;
      background-size: 100%;
    }
    .flagPurple {
      display: inline-block;
      cursor: pointer;
      width: 14px;
      height: 14px;
      background: url("../assets/img/flag_purple.png") 0 0 no-repeat;
      background-size: 100%;
    }
    .footer {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
