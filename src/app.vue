<template>
  <div class="table" v-if="show">
    <span class="close" @click="handleClose">x</span>
    <div>{{ tradeList.length }}</div>
  </div>
  <el-button class="btnHide" @click="handleOpen" v-else type="primary"
    >open</el-button
  >
</template>
<script>
import "./app.less";
import { proxy } from "ajax-hook";
import $ from "jquery";

export default {
  data: function() {
    return {
      show: false,
      tradeList: [],
    };
  },
  methods: {
    handleOpen() {
      this.show = true;
    },
    handleClose() {
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
      const data = {
        params: {
          keyTidOutsid: { "1345442199065381079": "4315697655846" },
          tidSelectedOids: {
            "1345442199065381079": [
              "1345442199066381079",
              "1345442199067381079",
            ],
          },
          keyTidCtids: { "1345442199065381079": ["1345442199065381079"] },
          tableType: 0,
          templateId: 925325,
          templateName: "韵达_一联_2",
          templateType: 1,
          templateKind: 1,
          expressId: 50,
          expressName: "韵达",
          packageType: 0,
          tidRowIndex: { "1345442199065381079": 1 },
          tidJiazhuangMap: { "1345442199065381079": "" },
          tidThreeplMap: { "1345442199065381079": {} },
          sendType: "offline",
        },
        bodyRequest: 1,
      };
      $.ajax({
        url: "http://tc1.woda.com/printSend.do?m=send",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
      });
    }, 5000);

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
        if (url.indexOf("/printSend.do?m=queryTrades") > -1) {
          const { tradeList = [] } = JSON.parse(data).data || {};
          this.tradeList = tradeList;
        }
        handler.next(response);
      },
    });
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
