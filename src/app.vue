<template>
  <div class="table" v-if="show">
    <span class="close" @click="onClose">x</span>
    <div>{{ list.length }}</div>
  </div>
  <el-button class="btnHide" @click="onOpen" v-else type="primary"
    >open</el-button
  >
</template>
<script>
import "./app.less";
import { proxy, unProxy } from "ajax-hook";
import $ from "jquery";

export default {
  data: function() {
    return {
      show: false,
      list: [],
    };
  },
  methods: {
    onInitProxy() {
      // ajaxhook钩子，拦截请求数据
      proxy({
        //请求发起前进入
        onRequest: (config, handler) => {
          handler.next(config);
        },
        //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
        onError: (err, handler) => {
          handler.next(err);
        },
        //请求成功后进入
        onResponse: (response, handler) => {
          const { config = {}, response: data = {} } = response || {};
          const { url = "" } = config || {};
          if (url.indexOf("/trade-pack/find-pack-list") > -1) {
            const { content = [] } = JSON.parse(data) || {};
            this.list = content;
          }
          handler.next(response);
        },
      });
    },
    onOpen() {
      this.show = true;
    },
    onClose() {
      this.show = false;
    },
  },
  mounted() {
    setTimeout(() => {
      // $.get("http://8.134.72.1/testCORS.php", (res) => {
      //   console.log(res);
      // });
      // $.post(
      //   "http://tc1.woda.com/printSend.do?m=batchSaveOutsid",
      //   {
      //     expressId: "50",
      //     tableType: "0",
      //     keyTidCtids: JSON.stringify({
      //       "1345442199065381079": ["1345442199065381079"],
      //     }),
      //     expressTemplateId: "934771",
      //     expressTemplateName: "韵达手动填单号",
      //     expressTemplateKind: "0",
      //     keyTidOutsid: JSON.stringify({
      //       "1345442199065381079": "4315697655846",
      //     }),
      //     tidSelectedOids: JSON.stringify({
      //       "1345442199065381079": [
      //         "1345442199066381079",
      //         "1345442199067381079",
      //       ],
      //     }),
      //   },
      //   (res) => {
      //     let originData = list.find((item) => item.keyTid === id);
      //     const { data = {} } = JSON.parse(res) || {};
      //     Object.assign(originData, { ...data[id] });
      //     ids.shift();
      //     getItemData(ids);
      //   }
      // );
      // const data = {
      //   encryptedAddressList: [
      //     {
      //       objectId: "0",
      //       tidList: ["1375708800108342399"],
      //       receiverName: "陆**",
      //       receiverMobile: "*******2559",
      //       receiverAddress: "兰*街道**小区*区**号楼",
      //       oaid:
      //         "1fIsMXCesa3podkGKmoaG551FoRlPHBwzojw57icDxxf6D1Rr369f7H98aj0ezpfNpYg6Q7m",
      //     },
      //   ],
      //   decryptAuthType: "SHOP",
      //   targetId: 1820,
      // };
      // $.ajax({
      //   url: "https://zft.topchitu.com/api/security/batch-decrypt-address",
      //   type: "POST",
      //   contentType: "application/json; charset=utf-8",
      //   dataType: "json",
      //   data: JSON.stringify(data),
      // });
    }, 10000);
    this.onInitProxy();
  },
};
</script>
<style scoped lang="less">
.table {
  position: fixed;
  text-align: center;
  width: 100%;
  height: 400px;
  top: 0;
  right: 0;
  z-index: 99999;
  background: #fc2;
  .close {
    position: absolute;
    right: 0px;
    top: 0px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.btnHide {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 99999;
}
</style>
