<template>
  <div>
    <div class="main" v-if="show">
      <div class="header">
        <div class="item">
          <div class="label">当前登录账号：</div>
          <div class="content">159****4223</div>
        </div>
        <div class="item">
          <div class="label">绑定店铺：</div>
          <div class="content">我的小店</div>
        </div>
        <div class="item">
          <div class="label">可用余额：</div>
          <div class="content">￥999.99</div>
        </div>
        <div class="item">
          <div class="label">推送后操作：</div>
          <div class="content">
            <el-select v-model="pushType" placeholder="请选择" size="mini">
              <el-option label="直接发货" value="send"> </el-option>
              <el-option label="保存运单" value="save"> </el-option>
            </el-select>
          </div>
        </div>
        <el-button size="mini" style="margin-left:10px" type="primary"
          >查看回调记录</el-button
        >
        <el-button size="mini" type="primary">历史订单查询</el-button>
        <el-button size="mini" type="primary">添加自由订单</el-button>
      </div>
      <div class="table">
        <div class="head">
          <el-row>
            <el-col :span="11"><div class="item">商品</div></el-col>
            <el-col :span="2"><div class="item">数量</div></el-col>
            <el-col :span="5"><div class="item">地址</div></el-col>
            <el-col :span="6"><div class="item">操作</div></el-col>
          </el-row>
        </div>
        <div class="body">
          <div class="line" v-for="(item, index) in list" :key="index">
            <div
              class="statusBar"
              v-bind:class="{
                statusGrey: item.trades[0].sellerFlag === 0,
                statusRed: item.trades[0].sellerFlag === 1,
                statusYellow: item.trades[0].sellerFlag === 2,
                statusGreen: item.trades[0].sellerFlag === 3,
                statusBlue: item.trades[0].sellerFlag === 4,
                statusPurple: item.trades[0].sellerFlag === 5,
              }"
            >
              <div class="left">
                <div class="orderId">订单号：{{ item.trades[0].tid }}</div>
                <div class="ali"><i class="icon" />{{ item.buyerNick }}</div>
                <div class="time">{{ item.minPayTime }}</div>
                <div class="merge" v-if="item.isPacked">
                  有合并订单
                </div>
              </div>
              <div class="right">
                <i
                  @click="onOpenFlag(item.trades[0])"
                  v-bind:class="{
                    flagGrey: item.trades[0].sellerFlag === 0,
                    flagRed: item.trades[0].sellerFlag === 1,
                    flagYellow: item.trades[0].sellerFlag === 2,
                    flagGreen: item.trades[0].sellerFlag === 3,
                    flagBlue: item.trades[0].sellerFlag === 4,
                    flagPurple: item.trades[0].sellerFlag === 5,
                  }"
                />

                <el-tooltip
                  v-if="item.trades[0].sellerMemo"
                  class="item"
                  effect="dark"
                  :content="item.trades[0].sellerMemo"
                  placement="top-end"
                >
                  <i class="remark" />
                </el-tooltip>
              </div>
            </div>
            <div
              class="message"
              v-if="
                item.trades
                  .map((trade) => trade.buyerMessage)
                  .filter((text) => text)
                  .join('，')
              "
            >
              <div>此订单有买家留言，请注意处理：</div>
              <div>
                {{
                  item.trades
                    .map((trade) => trade.buyerMessage)
                    .filter((text) => text)
                    .join("，")
                }}
              </div>
            </div>
            <div
              class="trades"
              v-for="(tradeItem, tradeIndex) in item.trades"
              :key="tradeIndex"
            >
              <div
                class="subOrderId"
                v-bind:class="{
                  statusGrey: tradeItem.sellerFlag === 0,
                  statusRed: tradeItem.sellerFlag === 1,
                  statusYellow: tradeItem.sellerFlag === 2,
                  statusGreen: tradeItem.sellerFlag === 3,
                  statusBlue: tradeItem.sellerFlag === 4,
                  statusPurple: tradeItem.sellerFlag === 5,
                }"
                v-if="tradeIndex > 0"
              >
                <div class="left">子订单号：{{ tradeItem.tid }}</div>
                <div class="right">
                  <i
                    @click="onOpenFlag(tradeItem)"
                    v-bind:class="{
                      flagGrey: tradeItem.sellerFlag === 0,
                      flagRed: tradeItem.sellerFlag === 1,
                      flagYellow: tradeItem.sellerFlag === 2,
                      flagGreen: tradeItem.sellerFlag === 3,
                      flagBlue: tradeItem.sellerFlag === 4,
                      flagPurple: tradeItem.sellerFlag === 5,
                    }"
                  />
                  <el-tooltip
                    v-if="tradeItem.sellerMemo"
                    class="item"
                    effect="dark"
                    :content="tradeItem.sellerMemo"
                    placement="top-end"
                  >
                    <i class="remark" />
                  </el-tooltip>
                </div>
              </div>
              <div class="orders">
                <el-row style="display:flex;align-items:center">
                  <el-col :span="11">
                    <div
                      class="shop"
                      v-for="(orderItem, orderIndex) in tradeItem.orders"
                      :key="orderIndex"
                    >
                      <div class="pic">
                        <img :src="orderItem.picPath" alt="" />
                      </div>
                      <div class="right">
                        <div class="title">{{ orderItem.title }}</div>
                        <div class="desc ">
                          {{
                            orderItem.skuPropertiesName
                              ? orderItem.skuPropertiesName
                              : "无"
                          }}
                        </div>
                        <div>
                          商家编码：
                          <div class="sku">
                            {{
                              orderItem.outerSkuId
                                ? orderItem.outerSkuId
                                : orderItem.outerIid
                            }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="2"
                    ><div
                      class="amount"
                      v-for="(orderItem, orderIndex) in tradeItem.orders"
                      :key="orderIndex"
                    >
                      x {{ orderItem.num }}
                    </div></el-col
                  >
                  <el-col :span="5">
                    <div class="address" v-if="tradeIndex === 0">
                      <div>{{ item.encryptReceiverInfo.receiverName }}</div>
                      <div>{{ item.encryptReceiverInfo.receiverMobile }}</div>
                      <div>
                        {{
                          `${item.encryptReceiverInfo.receiverCountry ||
                            ""} ${item.encryptReceiverInfo.receiverState ||
                            ""} ${item.encryptReceiverInfo.receiverCity ||
                            ""} ${item.encryptReceiverInfo.receiverTown ||
                            ""} ${item.encryptReceiverInfo.receiverDistrict ||
                            ""} ${item.encryptReceiverInfo.receiverAddress ||
                            ""}`
                        }}
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="operation">
                      <div style="text-align:center" v-if="tradeIndex === 0">
                        <el-button
                          type="primary"
                          size="mini"
                          v-if="tradeItem.sellerFlag === 2"
                          style="background:#FFAB00;border-color:#FFAB00"
                        >
                          异常
                        </el-button>
                        <el-button type="primary" size="mini" v-else>
                          推送
                        </el-button>
                      </div>
                      <div
                        style="text-align:center;margin-top:10px;"
                        v-if="tradeIndex === 0"
                      >
                        <el-button type="text" size="mini">修改订单</el-button>
                      </div>
                      <div class="tipsYellow" v-if="tradeItem.sellerFlag === 2">
                        <div class="attention">
                          黄旗备注，请按要求修改订单后再推送
                        </div>
                        <div class="memo">{{ tradeItem.sellerMemo }}</div>
                      </div>
                      <div class="tipsRed" v-if="tradeItem.sellerFlag === 1">
                        <div class="attention">
                          红旗备注，用以下货物替代原本订单货物进行推送
                        </div>
                        <div class="memo">{{ tradeItem.sellerMemo }}</div>
                      </div>
                      <div class="tipsGreen" v-if="tradeItem.sellerFlag === 3">
                        <div class="attention">
                          绿旗备注，以下货物会追加到订单货物一起推送
                        </div>
                        <div class="memo">{{ tradeItem.sellerMemo }}</div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-button class="loadBtn" @click="onLoad" type="primary">{{
      show ? "关闭推送脚本" : "加载推送脚本"
    }}</el-button>
    <el-dialog
      width="600px"
      title="修改旗帜"
      :visible.sync="dialogFlag.visible"
      custom-class="dialogFlag"
      @close="onCloseFlag"
    >
      <div class="flag">
        <el-radio-group v-model="dialogFlag.data.sellerFlag">
          <el-radio :label="0"><div class="flagGrey"/></el-radio>
          <el-radio :label="1"><div class="flagRed"/></el-radio>
          <el-radio :label="2"><div class="flagYellow"/></el-radio>
          <el-radio :label="3"><div class="flagGreen"/></el-radio>
          <el-radio :label="4"><div class="flagBlue"/></el-radio>
          <el-radio :label="5"><div class="flagPurple"/></el-radio>
        </el-radio-group>
        <el-input
          style="margin-top:20px;"
          v-model="dialogFlag.data.sellerMemo"
          type="textarea"
          placeholder="请输入留言信息"
          rows="6"
        />
        <div slot="footer" class="footer">
          <el-button @click="onCloseFlag">取 消</el-button>
          <el-button
            type="primary"
            :loading="flagLoading"
            @click="onFlagConfirm(dialogFlag.data)"
            >确 定</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import "./app.less";
import { proxy, unProxy } from "ajax-hook";
import $ from "jquery";

export default {
  data: function() {
    return {
      show: true,
      list: [],
      pushType: null,
      flagLoading: false,
      dialogFlag: {
        visible: false,
        data: {},
      },
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
            console.log(this.list);
          }
          if (url.indexOf("/user/login-user") > -1) {
            const userInfo = JSON.parse(data) || {};
            this.userInfo = userInfo;
          }
          handler.next(response);
        },
      });
    },
    onLoad() {
      this.show = !this.show;
    },
    onRefresh() {
      $(".ant-btn")
        .find("span:contains('搜索')")
        .parent()[0]
        .click();
    },
    onOpenFlag(data) {
      this.dialogFlag.visible = true;
      this.dialogFlag.data = JSON.parse(JSON.stringify(data));
    },
    onCloseFlag() {
      this.dialogFlag.visible = false;
      this.dialogFlag.data = {};
    },
    onFlagConfirm(dialogFlagData) {
      const { tid = "", sellerMemo = "", sellerFlag = null } =
        dialogFlagData || {};
      const { defaultShopId = null } = this.userInfo || {};
      const data = {
        apiMethodName: "taobao.trade.memo.update",
        textParams: {
          tid,
          memo: sellerMemo,
          flag: sellerFlag,
          reset: false,
        },
        shopId: defaultShopId,
      };
      this.flagLoading = true;
      $.ajax({
        url: "https://zft.topchitu.com/api/taobao",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
      })
        .then(() => {
          setTimeout(() => {
            this.flagLoading = false;
            this.onRefresh();
            this.onCloseFlag();
          }, 2000);
        })
        .catch((error) => {
          const { responseJSON = {} } = error || {};
          const { subMsg = "" } = responseJSON || {};
          this.$message.error(subMsg);
          this.flagLoading = false;
        });
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
    }, 6000);
    this.onInitProxy();
  },
};
</script>
<style lang="less" scoped></style>
