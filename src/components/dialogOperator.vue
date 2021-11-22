<template>
  <el-dialog
    width="500px"
    title="修改操作人"
    custom-class="dialogLogin"
    :visible.sync="isVisible"
    @close="onClose"
    @open="onOpen"
    :close-on-click-modal="false"
  >
    <el-form :model="formData" :rules="rules" label-width="80px" ref="form">
      <el-form-item label="操作人" prop="operator">
        <el-input v-model="formData.operator" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="修改密码" prop="password">
        <el-input
          type="password"
          v-model="formData.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
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
      adminPass: "778151897598445727047",
      formData: {
        operator: "",
        password: "",
      },
      rules: {
        operator: [
          { required: true, message: "请输入操作人", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入修改密码", trigger: "blur" },
        ],
      },
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
      this.$refs["form"].resetFields();
      this.isVisible = false;
      this.formData.operator = "";
      this.formData.password = "";
    },
    onOpen() {
      if (this.$root.operator) {
        this.formData.operator = this.$root.operator;
      } else {
        this.formData.operator = "";
      }
    },
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.formData.password === this.adminPass) {
            this.$root.operator = this.formData.operator;
            localStorage.setItem("operator", this.formData.operator);
            this.$message.success("修改成功");
            this.onClose();
          } else {
            this.$message.error("修改密码错误");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.dialogLogin {
  label {
    margin-right: 0px;
  }
}
</style>
