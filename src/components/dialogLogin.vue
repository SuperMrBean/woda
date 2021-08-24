<template>
  <el-dialog
    width="500px"
    title=""
    custom-class="dialogLogin"
    :visible.sync="isVisible"
    @close="onClose"
    @open="onOpen"
  >
    <div class="loginBox">
      <div class="title">开放平台系统</div>
      <div class="inputBox">
        <el-input
          class="mgb22"
          :placeholder="`请输入手机号`"
          prefix-icon="el-icon-edit-outline"
          v-model="loginName"
          @keyup.enter.native="onSubmit"
        ></el-input>
        <el-input
          class="mgb22"
          placeholder="请输入密码"
          type="password"
          prefix-icon="el-icon-edit-outline"
          v-model="loginPwd"
          @keyup.enter.native="onSubmit"
        ></el-input>
        <div class="verifyBox">
          <el-input placeholder="请输入验证码" v-model="verifyCode"></el-input>
          <img @click="changeImgSrc" :src="imgSrc" style="cursor:pointer" />
        </div>
        <el-button
          type="primary"
          style="width:100%;"
          @click="onSubmit"
          @keyup.enter.native="onSubmit"
          >登录</el-button
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
  },
  data: function() {
    return {
      loginName: "",
      loginPwd: "",
      verifyCode: "",
      imgSrc: "",
      apiSrc: "http://47.110.83.17:8700/api/auth/getVerify",
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
      this.loginName = "";
      this.loginPwd = "";
      this.verifyCode = "";
      this.imgSrc = "";
    },
    onOpen() {
      this.changeImgSrc();
    },
    onSubmit() {
      let { loginName, loginPwd, verifyCode } = this;
      if (loginName == "") {
        this.$message.error(`手机号不可为空`);
      } else if (loginPwd == "") {
        this.$message.error("密码不可为空");
      } else if (verifyCode == "") {
        this.$message.error("验证码不可为空");
      } else {
        let data = {
          phone: loginName,
          password: loginPwd,
          verifyCode,
        };
        console.log(data);
        // this.$api.login(data, "/api/auth/login").then((res) => {
        //   if (res.data.status == 200) {
        //     window.localStorage.setItem("token", res.data.data);
        //     this.$router.push({ path: "/admin" });
        //   } else {
        //     this.changeImgSrc();
        //     this.$message.error(res.data.msg);
        //   }
        // });
      }
    },
    changeImgSrc() {
      this.imgSrc = `${this.apiSrc}?${Date.now()}`;
    },
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.dialogLogin {
  .loginBox {
    margin: 0 auto;
    border-radius: 6px;
    background: #fff;
    width: 365px;
    padding: 25px 25px 40px 25px;
    box-sizing: border-box;
    .title {
      width: 100%;
      font-size: 22px;
      text-align: center;
      color: #707070;
      padding-bottom: 40px;
    }
  }
  .inputBox {
    width: 315px;
    margin: auto;
  }
  .mgb22 {
    margin-bottom: 22px;
  }
  .verifyBox {
    display: flex;
    margin-bottom: 22px;
    img {
      margin-left: 10px;
    }
  }
}
</style>
