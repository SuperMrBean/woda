<template>
  <div>
    <div class="main" v-if="show">
      <div class="header">
        <div class="item">
          <div class="label">当前登录账号：</div>
          <div class="content">{{ shopInfo.phone }}</div>
        </div>
        <div class="item">
          <div class="label">绑定店铺：</div>
          <div class="content">
            <span class="type">{{ shopInfo.typeName }}</span>
            {{ shopInfo.shopName }}
          </div>
        </div>
        <div class="item">
          <div class="label">可用余额：</div>
          <div class="content">￥{{ balance }}</div>
        </div>
        <div class="item">
          <div class="label">推送后操作：</div>
          <div class="content">
            <el-select
              v-model="pushType"
              placeholder="请选择"
              size="mini"
              style="width:100px"
            >
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
              v-bind:class="{ trades: true, success: item.isPush }"
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
                        <el-button
                          type="primary"
                          size="mini"
                          :loading="pushLoading"
                          v-else
                          @click="onPush(item)"
                        >
                          推送
                        </el-button>
                      </div>
                      <div
                        style="text-align:center;margin-top:10px;"
                        v-if="tradeIndex === 0"
                      >
                        <el-button
                          type="text"
                          size="mini"
                          @click="onOpenModify(item)"
                          >修改订单</el-button
                        >
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
            <div
              class="orderError"
              v-for="(error, index) in item.orderErrorList"
              :key="index"
            >
              {{ error.errorText }}
            </div>
            <div class="skuError" v-if="item.isSkuError">sku错误</div>
          </div>
        </div>
      </div>
    </div>
    <el-button v-if="isLogin" class="loadBtn" @click="onOpen" type="primary">{{
      show ? "关闭推送脚本" : "开启推送脚本"
    }}</el-button>
    <el-button v-else class="loadBtn" @click="onLogin" type="primary"
      >登录</el-button
    >
    <dialog-flag
      :visible.sync="dialogFlag.visible"
      :data="dialogFlag.data"
      :shopId="userInfo.defaultShopId"
    />
    <dialog-modify
      :visible.sync="dialogModify.visible"
      :data="dialogModify.data"
      :userInfo="userInfo"
      :logistics="logistics"
      @refresh="onRefresh"
    />
    <dialog-login
      :visible.sync="dialogLogin.visible"
      :data="dialogLogin.data"
      @refresh="onUpdateShopInfo"
    />
  </div>
</template>
<script>
import "./app.less";
import dialogLogin from "./components/dialogLogin.vue";
import dialogFlag from "./components/dialogFlag.vue";
import dialogModify from "./components/dialogModify.vue";
import { proxy } from "ajax-hook";
import $ from "jquery";

export default {
  components: {
    dialogLogin,
    dialogFlag,
    dialogModify,
  },
  data: function() {
    return {
      show: false,
      userInfo: {},
      shopInfo: {},
      balance: null,
      logistics: [],
      list: [],
      addresses: [],
      defAddress: {},
      pushType: null,
      isLogin: false,
      pushLoading: false,
      dialogFlag: {
        visible: false,
        data: null,
      },
      dialogLogin: {
        visible: false,
        data: null,
      },
      dialogModify: {
        visible: false,
        data: null,
      },
    };
  },
  methods: {
    // 初始化接口信息，重新调取所需接口
    onInit() {
      this.onGetLogistics();
      this.onGetBalance();
    },
    // ajaxhook钩子，拦截请求数据
    onInitProxy() {
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
          // 拦截列表信息
          if (url.indexOf("/trade-pack/find-pack-list") > -1) {
            const { content = [] } = JSON.parse(data) || {};
            this.list = content.map((item) => {
              return {
                ...item,
                isSkuError: false,
                isPush: false,
                orderErrorList: [],
              };
            });
            console.log(this.list);
          }
          // 拦截用户信息
          if (url.indexOf("/user/login-user") > -1) {
            const userInfo = JSON.parse(data) || {};
            this.userInfo = userInfo;
          }
          // 拦截发货地址列表以及默认发货地址信息
          if (url.indexOf("/api/taobao") > -1) {
            const { logistics_address_search_response = {} } =
              JSON.parse(data) || {};
            const { addresses = {} } = logistics_address_search_response || {};
            const { address_result = [] } = addresses || {};
            if (address_result.length > 0) {
              this.addresses = address_result;
              this.defAddress = this.addresses.find((item) => item.get_def);
            }
          }
          handler.next(response);
        },
      });
    },
    // 请求店铺信息并做店铺名字校验
    onGetShopInfo(token) {
      $.ajax({
        url: "//47.110.83.17:8700/api/user/my_info",
        type: "GET",
        headers: {
          token,
        },
      })
        .then((response) => {
          const { status = null, msg = "", data = "" } = response || {};
          if (status == 200) {
            this.onCheckName(this.userInfo, data, token);
          } else {
            this.$message.error(msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 获取商家余额
    onGetBalance() {
      $.ajax({
        url: "//47.110.83.17:8700/api/user/my_account",
        type: "GET",
        headers: {
          token: this.$root.token,
        },
      })
        .then((response) => {
          const { status = null, msg = "", data = "" } = response || {};
          if (status == 200) {
            const { amount = null } = data || {};
            this.balance = amount;
          } else {
            this.$message.error(msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 请求快递列表
    onGetLogistics() {
      $.ajax({
        url: "//47.110.83.17:8700/api/common/logistics/all",
        type: "GET",
        headers: {
          token: this.$root.token,
        },
      })
        .then((response) => {
          const { status = null, msg = "", data = [] } = response || {};
          if (status == 200) {
            this.logistics = data;
          } else {
            this.$message.error(msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 检测店铺名称是否相同
    onCheckName(userInfo, shopInfo, token) {
      const { defaultShopName = "" } = userInfo;
      const { nickName = "" } = shopInfo;
      if (defaultShopName === nickName) {
        sessionStorage.setItem("token", token);
        this.$root.token = token;
        this.shopInfo = shopInfo;
        this.isLogin = true;
      } else {
        this.$message.error("店铺信息不符");
        sessionStorage.removeItem("token");
        this.$root.token = "";
        this.shopInfo = {};
        this.isLogin = false;
      }
    },
    // 获取skuList
    onGetSkuList(listData) {
      const { trades = [] } = listData || {};
      let totalOrders = [];
      trades.forEach((trade) => {
        const { orders = [] } = trade || {};
        orders.forEach((order) => {
          totalOrders.push(order);
        });
      });
      let totalSku = [];
      totalOrders.forEach((order) => {
        const { outerSkuId = "", outerIid = "", num = null } = order || {};
        const sku = outerSkuId || outerIid || null;
        if (sku) {
          if (/\+/g.test(sku)) {
            let outerSkuIdArr = sku.split("+").map((item) => {
              return {
                skuCode: item,
                skuNum: num,
              };
            });
            outerSkuIdArr.forEach((item) => {
              totalSku.push(item);
            });
          } else {
            totalSku.push({ skuCode: sku, skuNum: num });
          }
        } else {
          totalSku.push({ skuCode: "", skuNum: num });
        }
      });
      $.ajax({
        url: "//47.110.83.17:8700/api/product/parsePushSkuList",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
          token: this.$root.token,
        },
        data: JSON.stringify(totalSku),
      })
        .then((response) => {
          const { status = null, msg = "", data: skuList = [] } = response;
          if (status === 200) {
            this.onGetItemDetail(listData, skuList);
          } else {
            this.$message.error(`sku列表解析失败：${msg}`);
            this.pushLoading = false;
          }
        })
        .catch((error) => {
          this.pushLoading = false;
          console.log(error);
        });
    },
    // 获取明文信息
    onGetItemDetail(listData, skuList) {
      const { defaultShopId = null } = this.userInfo || {};
      const { trades = [], receiverInfo = {} } = listData || {};
      const tidList = trades.map((item) => item.tid);
      const {
        receiverName = "",
        receiverAddress = "",
        receiverMobile = "",
        oaid = "",
      } = receiverInfo || {};
      const data = {
        encryptedAddressList: [
          {
            objectId: "0",
            tidList: tidList,
            receiverName,
            receiverMobile,
            receiverAddress,
            oaid,
          },
        ],
        decryptAuthType: "SHOP",
        targetId: defaultShopId,
      };
      $.ajax({
        url: "//zft.topchitu.com/api/security/batch-decrypt-address",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
      })
        .then((response) => {
          const {
            receiverName = "",
            receiverMobile = "",
            receiverAddress = "",
          } = response[0];
          if (receiverName && receiverMobile && receiverAddress) {
            this.onPushOrderJson(
              receiverName,
              receiverMobile,
              receiverAddress,
              listData,
              skuList
            );
          } else {
            this.pushLoading = false;
            this.$message.error("获取明文信息失败");
          }
        })
        .catch((error) => {
          this.pushLoading = false;
          console.log(error);
        });
    },
    // 推送
    onPushOrderJson(name, mobile, address, listData, skuList) {
      const { trades = [], minPayTime = "" } = listData || {};
      if (trades.length === 0) {
        this.$message.error("推送信息有误");
        return;
      }
      const { cpCode = "" } = this.logistics[0];
      const { tid = "", buyerNick = "", oaid = "" } = trades[0] || {};
      const { receiverInfo = {} } = listData || {};
      const {
        receiverCity = "",
        receiverState = "",
        receiverDistrict = "",
        receiverTown = "",
      } = receiverInfo || {};
      const data = {
        list: [
          {
            orderId: tid,
            cpCode,
            buyerNickname: buyerNick,
            buyerUid: oaid.substr(0, 10),
            receiver: name,
            phoneNumber: mobile,
            province: receiverState,
            city: receiverCity,
            district: receiverDistrict,
            street: receiverTown,
            address,
            fullAddress: `${receiverState}${receiverCity}${receiverDistrict}${receiverTown}${address}`,
            flag: 4,
            interceptReason: "",
            orderTime: minPayTime,
            innerOrder: false,
            isUrgent: 0,
            orderSkuList: skuList,
          },
        ],
      };
      $.ajax({
        url: "//47.110.83.17:8700/api/order/json",
        type: "POST",
        headers: {
          token: this.$root.token,
          appid: this.shopInfo.appId,
        },
        data: { orderJson: JSON.stringify(data) },
      })
        .then((response) => {
          const { status = null, msg = "", data = {} } = response || {};
          const { error = [], ok = [], balance = null } = data || {};
          if (status === 200) {
            if (error.length > 0) {
              const { orderError = [], skuError = [] } = error[0];
              if (orderError.length > 0) {
                listData.orderErrorList = orderError;
              }
              if (skuError.length > 0) {
                listData.isSkuError = true;
              }
              this.pushLoading = false;
              this.$message.error("推送失败");
            } else {
              listData.isSkuError = false;
              listData.orderErrorList = [];
              this.balance = balance;
              const { logisticsNumber = "" } = ok[0];
              if (this.pushType === "send") {
                this.onDelivery(listData, logisticsNumber);
              } else {
                alert(`保存单号：${logisticsNumber}`);
              }
            }
          } else {
            this.pushLoading = false;
            this.$message.error(`推送失败：${msg}`);
          }
        })
        .catch((error) => {
          this.pushLoading = false;
          console.log(error);
        });
    },
    // 发货
    onDelivery(listData, logisticsNumber) {
      const { defaultShopId = null } = this.userInfo || {};
      const { contact_id = null } = this.defAddress || {};
      const { cpCode = "" } = this.logistics[0] || {};
      const data = {
        logisticsSendList: [
          {
            cancelId: contact_id,
            companyCode: cpCode,
            isSplit: 1,
            outSid: logisticsNumber,
            senderId: contact_id,
            tid: listData.trades[0].tid,
            subTid: listData.trades[0].tid,
          },
        ],
        sendType: "offline",
        shopId: defaultShopId,
      };
      $.ajax({
        url: "//zft.topchitu.com/api/taobao/logistics-send",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
      })
        .then((response) => {
          const { success = null, msg = "" } = response[0] || {};
          if (success) {
            this.$message.success("推送成功");
            listData.isPush = true;
          } else {
            this.$message.error(`发货失败：${msg}`);
          }
          this.pushLoading = false;
        })
        .catch((error) => {
          this.pushLoading = false;
          console.log(error);
        });
    },
    onLogin() {
      if (!this.userInfo) {
        this.$message.warning("用户数据加载中，请稍后");
        return;
      }
      this.dialogLogin.visible = true;
      this.dialogLogin.data = this.userInfo;
    },
    onOpen() {
      this.show = !this.show;
    },
    // 模拟点击搜索按钮，达到刷新列表效果
    onRefresh() {
      $(".ant-btn")
        .find("span:contains('搜索')")
        .parent()[0]
        .click();
    },
    // 登录成功后更新店铺信息，并请求快递列表
    onUpdateShopInfo(data) {
      this.shopInfo = data;
      this.isLogin = true;
      this.show = true;
    },
    onOpenFlag(data) {
      this.dialogFlag.visible = true;
      this.dialogFlag.data = data;
    },
    onOpenModify(data) {
      if (!this.pushType) {
        this.$message.error("请选择推送后操作");
        return;
      }
      this.dialogModify.visible = true;
      this.dialogModify.data = JSON.parse(JSON.stringify(data));
    },
    // 点击推送，开始一些列推送请求
    onPush(listData) {
      if (!this.pushType) {
        this.$message.error("请选择推送后操作");
        return;
      }
      this.pushLoading = true;
      this.onGetSkuList(listData);
    },
  },
  watch: {
    userInfo(pre, cur) {
      if (JSON.stringify(pre) !== JSON.stringify(cur)) {
        if (this.$root.token) {
          this.onGetShopInfo(this.$root.token);
        }
      }
    },
    show(value) {
      if (value) {
        this.onInit();
      }
    },
  },
  mounted() {
    // setTimeout(() => {
    // $.ajax({
    //   url: "http://47.110.83.17:8700/api/auth/login",
    //   type: "POST",
    //   contentType: "application/json; charset=utf-8",
    //   dataType: "json",
    //   data: JSON.stringify({
    //     password: "123",
    //     phone: "123",
    //     verifyCode: "123",
    //   }),
    // })
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
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
    // }, 6000);
    this.onInitProxy();
  },
};
</script>
<style lang="less" scoped></style>
