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
      <div class="title">登录</div>
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
          :loading="loading"
          >登录</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>
<script>
import md5 from "md5";
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object,
    },
  },
  data: function() {
    return {
      loginName: "",
      loginPwd: "",
      verifyCode: "",
      imgSrc: "",
      apiSrc: "http:https://ryanopen.prprp.com/api/auth/getVerify",
      captchaId: "",
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
    onGetShopInfo(token) {
      $.ajax({
        url: "https://ryanopen.prprp.com/api/user/my_info",
        type: "GET",
        headers: {
          token,
        },
      })
        .then((response) => {
          const { status = null, msg = "", data = "" } = response || {};
          if (status == 200) {
            this.onCheckName(this.data, data, token);
          } else {
            sessionStorage.removeItem("token");
            this.$root.token = "";
            this.$message.error(msg);
            this.changeImgSrc();
          }
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          const { responseJSON = {} } = error || {};
          const { msg = "" } = responseJSON || {};
          this.$message.error(msg);
        });
    },
    // 检测店铺名称是否相同
    onCheckName(userInfo, shopInfo, token) {
      const { defaultShopName = "" } = userInfo;
      const { nickName = "", typeName = "" } = shopInfo;
      if (typeName !== "淘宝") {
        this.$message.error("店铺类型不正确");
        sessionStorage.removeItem("token");
        this.$root.token = "";
        this.changeImgSrc();
        return;
      }
      if (defaultShopName === nickName) {
        this.$message.success("登录成功");
        sessionStorage.setItem("token", token);
        this.$root.token = token;
        this.$emit("refresh", shopInfo);
        this.isVisible = false;
      } else {
        this.$message.error("店铺信息不符");
        sessionStorage.removeItem("token");
        this.$root.token = "";
        this.changeImgSrc();
      }
    },
    onClose() {
      this.isVisible = false;
      this.loginName = "";
      this.loginPwd = "";
      this.verifyCode = "";
      this.imgSrc = "";
      this.captchaId = "";
      this.loading = false;
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
        this.loading = true;
        let data = {
          phone: loginName,
          password: md5(loginPwd),
          verifyCode,
          captchaId: this.captchaId,
        };
        $.ajax({
          url: "https://ryanopen.prprp.com/api/auth/login",
          type: "POST",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          data: JSON.stringify(data),
        })
          .then((response) => {
            const { status = null, msg = "", data = "" } = response || {};
            if (status == 200) {
              this.onGetShopInfo(data);
            } else {
              this.loading = false;
              this.changeImgSrc();
              this.$message.error(msg);
            }
          })
          .catch((error) => {
            this.loading = false;
            const { responseJSON = {} } = error || {};
            const { msg = "" } = responseJSON || {};
            this.$message.error(msg);
          });
      }
    },
    changeImgSrc() {
      $.ajax({
        url: "https://ryanopen.prprp.com/api/auth/getBase64Verify",
        type: "GET",
      })
        .then((response) => {
          const { status = null, msg = "", data = {} } = response || {};
          if (status == 200) {
            const { captcha = "", captchaId = "" } = data || {};
            this.imgSrc = captcha;
            this.captchaId = captchaId;
          } else {
            this.changeImgSrc();
            this.$message.error(msg);
          }
        })
        .catch((error) => {
          const { responseJSON = {} } = error || {};
          const { msg = "" } = responseJSON || {};
          this.$message.error(msg);
        });
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
