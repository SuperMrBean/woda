<template>
  <el-dialog
    width="900px"
    title="修改订单"
    :visible.sync="isVisible"
    custom-class="dialogModify"
    @close="onClose"
    @open="onOpen"
    :close-on-click-modal="false"
  >
    <div class="wrapper">
      <el-form
        inline
        label-width="80px"
        :model="order"
        :rules="rules"
        ref="form"
      >
        <el-row :span="24">
          <el-col :span="12">
            <el-form-item label="订单编号">
              <el-input
                placeholder="订单编号"
                size="mini"
                v-model="order.orderId"
                style="width:200px"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="快递公司">
              <el-select
                style="width:200px"
                v-model="order.cpCode"
                placeholder="快递公司"
                size="mini"
              >
                <el-option
                  v-for="item in logistics"
                  :key="item.cpCode"
                  :label="item.cpName"
                  :value="item.cpCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="24">
          <el-col :span="12">
            <el-form-item label="买家昵称">
              <el-input
                placeholder="买家昵称"
                size="mini"
                v-model="order.buyerNickname"
                style="width:200px"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="买家UID">
              <el-input
                placeholder="买家UID"
                size="mini"
                v-model="order.buyerUid"
                style="width:200px"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="line" />
        <div class="title">
          <div class="text">收件信息</div>
          <div>
            <el-checkbox
              v-model="order.isUrgent"
              v-if="shopInfo && shopInfo.permissionUrgentOrder"
              >加急订单</el-checkbox
            >
          </div>
        </div>
        <el-row :span="16">
          <el-col :span="8">
            <el-form-item label="联系人" required prop="receiver">
              <el-input
                placeholder="联系人"
                size="mini"
                v-model="order.receiver"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机" required prop="phoneNumber">
              <el-input
                placeholder="手机"
                size="mini"
                v-model="order.phoneNumber"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="24">
          <el-col :span="8">
            <el-form-item
              label="省份"
              label-width="70px"
              required
              prop="province"
            >
              <el-select
                v-model="order.province"
                filterable
                placeholder="省份"
                size="mini"
              >
                <el-option
                  v-for="item in province"
                  :key="item.text"
                  :label="item.text"
                  :value="item.text"
                ></el-option>
              </el-select>
              <!-- <el-select
                v-model="order.province"
                filterable
                placeholder="省份"
                size="mini"
                @change="
                  (val) => {
                    onChangeValue(val, 'province');
                  }
                "
              >
                <el-option
                  v-for="item in province"
                  :key="item.text"
                  :label="item.text"
                  :value="item.text"
                ></el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="城市" label-width="70px" required prop="city">
              <el-input
                placeholder="城市"
                size="mini"
                v-model="order.city"
              ></el-input>
              <!-- <el-select
                v-model="order.city"
                filterable
                placeholder="城市"
                size="mini"
                @change="
                  (val) => {
                    onChangeValue(val, 'city');
                  }
                "
              >
                <el-option
                  v-for="item in cityList"
                  :key="item.text"
                  :label="item.text"
                  :value="item.text"
                ></el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="行政区"
              label-width="70px"
              required
              prop="district"
            >
              <el-input
                placeholder="行政区"
                size="mini"
                v-model="order.district"
              ></el-input>
              <!-- <el-select
                v-model="order.district"
                filterable
                placeholder="行政区"
                size="mini"
                @change="
                  (val) => {
                    onChangeValue(val, 'district');
                  }
                "
              >
                <el-option
                  v-for="item in districtList"
                  :key="item.text"
                  :label="item.text"
                  :value="item.text"
                ></el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="24">
          <el-col :span="10">
            <el-form-item
              label="街道/乡镇"
              prop="street"
              label-width="90px"
              required
            >
              <el-input
                placeholder="街道/乡镇"
                size="mini"
                v-model="order.street"
              ></el-input>
              <!-- <el-select
                v-model="order.street"
                filterable
                placeholder="街道/乡镇"
                size="mini"
                @change="
                  (val) => {
                    onChangeValue(val, 'street');
                  }
                "
              >
                <el-option
                  v-for="item in streetList"
                  :key="item.text"
                  :label="item.text"
                  :value="item.text"
                ></el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="详细地址" required prop="address">
              <el-input
                placeholder="详细地址"
                size="mini"
                style="width: 300px"
                v-model="order.address"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-input
        v-model="detailAddress"
        style="margin-bottom: 20px"
        @blur="onChangeAddress"
        rows="4"
        placeholder="粘贴文本，可自动识别姓名、电话和地址。如：北京市朝阳区XX街道XX大厦XX楼XX室，张三，139****8888"
        type="textarea"
      ></el-input>
      <div
        class="editor-title"
        v-if="shopInfo && shopInfo.permissionInterceptOrder"
      >
        <span class="sync">同步添加订单拦截信息</span>
        <el-button type="text" @click="isShowEditor = !isShowEditor">{{
          isShowEditor ? "隐藏" : "显示"
        }}</el-button>
      </div>
      <Editor v-show="isShowEditor" ref="editor"></Editor>
      <el-table
        v-if="orderSkuList.length"
        :data="orderSkuList"
        style="width: 100%"
      >
        <el-table-column label="序号" width="80">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="picUrl" label="图片" width="100">
          <template slot-scope="scope" v-if="scope.row.picUrl">
            <el-popover placement="top-start" trigger="hover">
              <img :src="scope.row.picUrl" style="width:400px;height:400px" />
              <div style="text-align:center;width:100%;margin-top:10px;">
                图片名称：{{ scope.row.picName }}
              </div>
              <div style="text-align:center;width:100%;margin-top:10px;">
                类目：{{ scope.row.categoryName }}
              </div>
              <div style="text-align:center;width:100%;margin-top:10px;">
                型号：{{ scope.row.modelName }}
              </div>
              <div slot="reference">
                <img :src="scope.row.picUrl" style="width:60px;height:60px" />
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="skuCode" label="商家编码">
          <template slot-scope="scope">
            <el-input
              :class="scope.row.isSpecial ? 'special' : null"
              v-model="scope.row.skuCode"
              size="mini"
              placeholder="商家编码"
              @blur="onCheckSkuItem(scope.$index, scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="skuNum" label="数量">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.skuNum"
              size="mini"
              placeholder="数量"
              @input="onChangeSkuNum(scope.$index, scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="信息">
          <template slot-scope="scope">
            <span class="sku-error">{{ scope.row.errorInfo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="mini"
              @click="orderSkuList.splice(scope.$index, 1)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer">
      <div class="error system-error" v-if="systemError">{{ systemError }}</div>
      <div
        class="error order-error"
        v-for="(orderError, index) in error.orderError"
        :key="index"
      >
        {{ orderError.errorText }}
      </div>
      <div class="footer-btn">
        <el-button size="mini" type="primary" @click="onAddOrder"
          >添加子订单</el-button
        >
        <el-button size="mini" type="warning" @click="onAddSpecialOrder"
          >添加特殊子订单</el-button
        >
        <el-button size="mini" type="success" @click="onAddSkus"
          >快速添加</el-button
        >
        <el-button size="mini" type="primary" @click="onPush" :loading="loading"
          >推送</el-button
        >
      </div>
    </div>
    <el-dialog
      title="快速添加"
      :visible.sync="isMore"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-input type="textarea" :rows="12" v-model="moreRemarks"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="onMoreCencel">取 消</el-button>
        <el-button size="mini" type="primary" @click="onMoreSubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </el-dialog>
</template>
<script>
import Editor from "./editor.vue";
export default {
  components: {
    Editor,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object || null,
      require: true,
    },
    userInfo: {
      type: Object || null,
      require: true,
    },
    shopInfo: {
      type: Object || null,
      require: true,
    },
    logistics: {
      type: Array || null,
      require: true,
    },
    pushType: {
      type: String,
      require: true,
    },
    defAddress: {
      type: Object || null,
      require: true,
    },
    balance: {
      type: Number || null,
      require: true,
    },
    globalTime: {
      type: Number || null,
      require: true,
    },
  },
  data: function() {
    return {
      loading: false,
      province: [],
      // cityList: [],
      // districtList: [],
      // streetList: [],
      order: {
        orderId: "",
        cpCode: "",
        buyerNickname: "",
        buyerUid: "",
        receiver: "",
        phoneNumber: "",
        province: "",
        city: "",
        district: "",
        street: "",
        address: "",
        fullAddress: "",
        orderTime: "",
        interceptReason: null, // 截单信息 - 输入文本框内容
        isUrgent: false,
      },
      orderSkuList: [],
      detailAddress: "",
      systemError: "",
      errorStatus: false,
      error: {
        orderId: null,
        orderError: [],
        skuError: [],
      },
      isMore: false,
      isShowEditor: false,
      moreRemarks: "",
      rules: {
        receiver: [
          {
            required: true,
            message: "请输入联系人",
            trigger: ["blur", "change"],
          },
        ],
        phoneNumber: [
          {
            required: true,
            message: "请输入手机",
            trigger: ["blur", "change"],
          },
        ],
        province: [
          { required: true, message: "请选择省份", trigger: "change" },
        ],
        city: [{ required: true, message: "请选择城市", trigger: "change" }],
        district: [
          { required: true, message: "请选择行政区", trigger: "change" },
        ],
        street: [
          { required: true, message: "请选择街道/乡镇", trigger: "change" },
        ],
        address: [
          {
            required: true,
            message: "请输入详细地址",
            trigger: ["blur", "change"],
          },
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
    // 获取明文信息
    onGetItemDetail(listData) {
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
            this.order.phoneNumber = receiverMobile;
            this.order.receiver = receiverName;
            this.order.address = receiverAddress;
          } else {
            this.$message.error("获取明文信息失败");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 获取省市区数据
    onGetProvinceList() {
      $.ajax({
        url: `https://${this.$root.env}.prprp.com/api/common/cascadingStreets`,
        type: "GET",
        headers: {
          token: this.$root.token,
        },
      })
        .then((response) => {
          const { data = [] } = response || {};
          this.province = data;
          // let citys = this.province.filter((item) => {
          //   return item.text == this.order.province;
          // });
          // this.cityList = citys[0].children;
          // let districts = this.cityList.filter((item) => {
          //   return item.text == this.order.city;
          // });
          // this.districtList = districts[0].children;
          // let streets = this.districtList.filter((item) => {
          //   return item.text == this.order.district;
          // });
          // this.streetList = streets[0].children;
        })
        .catch((error) => {
          const { responseJSON = {} } = error || {};
          const { msg = "" } = responseJSON || {};
          this.$message.error(msg);
        });
    },
    // 获取skuList
    onGetSkuList(listData) {
      const { trades = [] } = listData || {};
      let totalOrders = [];
      trades.forEach((trade) => {
        const { orders = [], sellerFlag = null, sellerMemo = "" } = trade || {};
        // 对红旗进行处理
        if (sellerFlag === 1) {
          let list = this.onHandleRemarkSkuList(sellerMemo);
          if (!list) {
            totalOrders = false;
            return;
          } else {
            list.forEach((redOrder) => {
              totalOrders.push(redOrder);
            });
          }
          // 对绿旗进行处理
        } else if (sellerFlag === 3) {
          let list = this.onHandleRemarkSkuList(sellerMemo);
          if (!list) {
            totalOrders = false;
            return;
          } else {
            orders.forEach((order) => {
              const { refundStatus = "", status = "" } = order || {};
              if (refundStatus !== "SUCCESS" && status !== "TRADE_CLOSED") {
                totalOrders.push(order);
              }
            });
            list.forEach((redOrder) => {
              totalOrders.push(redOrder);
            });
          }
        } else {
          orders.forEach((order) => {
            const { refundStatus = "", status = "" } = order || {};
            if (refundStatus !== "SUCCESS" && status !== "TRADE_CLOSED") {
              totalOrders.push(order);
            }
          });
        }
      });
      if (!totalOrders) {
        this.loading = false;
        return;
      }
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
            totalSku.push({
              skuCode: sku,
              skuNum: num,
              errorInfo: "",
              picUrl: "",
              picName: "",
              categoryName: "",
              modelName: "",
            });
          }
        } else {
          totalSku.push({
            skuCode: "",
            skuNum: num,
            picUrl: "",
            picName: "",
            categoryName: "",
            modelName: "",
            errorInfo: "",
          });
        }
      });
      totalSku = totalSku.map((sku) => {
        return {
          skuCode: sku.skuCode,
          skuNum: sku.skuNum,
          isSpecial: sku.isSpecial ? true : false,
        };
      });
      $.ajax({
        url: `https://${this.$root.env}.prprp.com/api/product/parsePushSkuList`,
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
            this.orderSkuList = skuList;
          } else {
            this.$message.error(`sku列表解析失败：${msg}`);
            this.loading = false;
          }
        })
        .catch((error) => {
          this.loading = false;
          const { responseJSON = {} } = error || {};
          const { msg = "" } = responseJSON || {};
          this.$message.error(msg);
        });
    },
    // 检查skuList
    onCheckSkuList() {
      $.ajax({
        url: `https://${this.$root.env}.prprp.com/api/product/parsePushSkuList`,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
          token: this.$root.token,
        },
        data: JSON.stringify(
          this.orderSkuList.map((item) => {
            return {
              skuCode: item.skuCode,
              skuNum: item.skuNum,
              isSpecial: item.isSpecial ? true : false,
            };
          })
        ),
      })
        .then((response) => {
          const { status = null, msg = "", data: skuList = [] } = response;
          if (status === 200) {
            this.orderSkuList = skuList;
          } else {
            this.$message.error(`sku列表解析失败：${msg}`);
            this.loading = false;
          }
        })
        .catch((error) => {
          this.loading = false;
          const { responseJSON = {} } = error || {};
          const { msg = "" } = responseJSON || {};
          this.$message.error(msg);
        });
    },
    // 推送到开放平台
    onPushOrderJson(listData) {
      const data = {
        list: [
          {
            orderId: this.order.orderId,
            cpCode: this.order.cpCode,
            buyerNickname: this.order.buyerNickname,
            buyerUid: this.order.buyerUid,
            receiver: this.order.receiver,
            phoneNumber: this.order.phoneNumber,
            province: this.order.province,
            city: this.order.city,
            district: this.order.district,
            street: this.order.street,
            address: this.order.address,
            fullAddress: `${this.order.province}${this.order.city}${this.order.district}${this.order.street}${this.order.address}`,
            flag: 4,
            interceptReason:
              this.$refs.editor.getContent() === "<p><br></p>"
                ? ""
                : this.$refs.editor.getContent(),
            orderTime: this.order.orderTime,
            innerOrder: false,
            isUrgent: this.order.isUrgent ? 1 : 0,
            orderSkuList: this.orderSkuList,
          },
        ],
      };
      $.ajax({
        url: `https://${this.$root.env}.prprp.com/api/order/json`,
        type: "POST",
        headers: {
          token: this.$root.token,
          appid: this.shopInfo.appId,
          operator: encodeURIComponent(this.$root.operator),
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
                this.error.orderError = orderError;
              }
              if (skuError.length > 0) {
                skuError.forEach((error) => {
                  const { errorSku = "", errorText = "" } = error || {};
                  this.orderSkuList.forEach((sku) => {
                    const { skuCode = "" } = sku || {};
                    if (errorSku === skuCode) {
                      sku.errorInfo = errorText;
                    }
                  });
                });
              }
              this.loading = false;
              this.$message.error("推送失败");
            } else {
              this.error = [];
              this.$emit("refresh", balance);
              const { logisticsNumber = "" } = ok[0];
              if (this.pushType === "send") {
                this.onDelivery({ listData, logisticsNumber });
              } else {
                this.onSaveRecord({ listData, logisticsNumber });
              }
            }
          } else {
            this.loading = false;
            this.$message.error(`推送失败：${msg}`);
          }
        })
        .catch((error) => {
          this.loading = false;
          const { responseJSON = {} } = error || {};
          const { msg = "" } = responseJSON || {};
          this.$message.error(msg);
        });
    },
    // 发货
    onDelivery({ listData, logisticsNumber }) {
      const { defaultShopId = null } = this.userInfo || {};
      const { contact_id = null } = this.defAddress || {};
      // const { cpCode = "" } = this.logistics[0] || {};
      const { trades = [] } = listData || {};
      const logisticsSendList = trades.map((trade) => {
        const { tid = "", orders = [] } = trade || {};
        return {
          cancelId: contact_id,
          companyCode: this.order.cpCode,
          isSplit: 1,
          outSid: logisticsNumber,
          senderId: contact_id,
          tid,
          subTid: orders.map((order) => order.oid).join(","),
        };
      });
      const data = {
        logisticsSendList,
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
          if (response.every((item) => item.success)) {
            listData.isPush = true;
            this.$message.success("推送成功");
            this.isVisible = false;
          } else {
            this.$message.error(`发货失败`);
          }
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
        });
    },
    // 保存推送记录
    onSaveRecord({ listData, logisticsNumber }) {
      const { trades = [] } = listData || {};
      const { tid: parentOrderId = "" } = trades[0];
      const list = trades.map((trade) => {
        const { tid = "" } = trade || {};
        return {
          logistics: this.order.cpCode,
          logisticsNumber,
          orderId: tid,
          parentOrderId,
        };
      });
      $.ajax({
        url: `https://${this.$root.env}.prprp.com/api/callbackRecord/savePushOrder`,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        headers: {
          token: this.$root.token,
        },
        data: JSON.stringify(list),
      })
        .then((response) => {
          const { status = null, msg = "" } = response || {};
          if (status === 200) {
            this.onSaveRemark(listData);
          } else {
            this.$message.error(msg);
            this.loading = false;
          }
        })
        .catch((error) => {
          this.loading = false;
          const { responseJSON = {} } = error || {};
          const { msg = "" } = responseJSON || {};
          this.$message.error(msg);
        });
    },
    // 修改备注
    onSaveRemark(listData) {
      const { trades = [] } = listData || {};
      const tradeList = JSON.parse(JSON.stringify(trades));
      this.onChangeRemark({ listData, tradeList });
    },
    // 修改备注api
    onChangeRemark({ listData, tradeList }) {
      if (tradeList.length === 0) {
        this.onSplit(listData);
      } else {
        const { defaultShopId = null } = this.userInfo || {};
        const { tid = "", sellerMemo = "", sellerFlag = "" } =
          tradeList[0] || {};
        const data = {
          apiMethodName: "taobao.trade.memo.update",
          textParams: {
            tid,
            memo: `#已推送#\n${sellerMemo}`,
            flag: sellerFlag,
            reset: false,
          },
          shopId: defaultShopId,
        };
        $.ajax({
          url: "//zft.topchitu.com/api/taobao",
          type: "POST",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          data: JSON.stringify(data),
        })
          .then((response) => {
            const { trade_memo_update_response = null } = response || {};
            if (trade_memo_update_response) {
              if (tradeList.length === 1) {
                const { trades = [] } = listData || {};
                trades[0].sellerMemo = `#已推送#\n${sellerMemo}`;
                trades[0].sellerFlag = sellerFlag;
              }
              tradeList.splice(0, 1);
              setTimeout(() => {
                this.onChangeRemark({ listData, tradeList });
              }, 1500);
            } else {
              this.loading = false;
              this.$message.error(`推送失败`);
            }
          })
          .catch((error) => {
            const { responseJSON = {} } = error || {};
            const { subMsg = "", subCode = "" } = responseJSON || {};
            this.$message.error(subMsg || subCode);
            this.loading = false;
          });
      }
    },
    // 拆单
    onSplit(listData) {
      const { defaultShopId = null } = this.userInfo || {};
      const { packId = "", trades = [] } = listData || {};
      // 如果只有一个订单，不需要进行拆单
      if (trades.length === 1) {
        this.$message.success("推送成功");
        listData.isPush = true;
        this.loading = false;
        this.isVisible = false;
        return;
      }
      const data = {
        packId,
        oidList: trades.map((item) => item.tid),
        tidList: trades.map((item) => item.tid),
      };
      $.ajax({
        url: "//zft.topchitu.com/api/trade-pack/cancel-pack",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
        headers: {
          shopid: defaultShopId,
        },
      })
        .then((response) => {
          if (response.length && response.length > 0) {
            this.$message.success("推送成功");
            this.isVisible = false;
          }
          this.loading = false;
        })
        .catch((error) => {
          this.$message.error("拆单失败");
          this.loading = false;
          console.log(error);
        });
    },
    onClose() {
      this.isVisible = false;
      this.loading = false;
      this.order = {
        orderId: "",
        cpCode: "",
        buyerNickname: "",
        buyerUid: "",
        receiver: "",
        phoneNumber: "",
        province: "",
        city: "",
        district: "",
        street: "",
        address: "",
        fullAddress: "",
        orderTime: "",
        interceptReason: null, // 截单信息 - 输入文本框内容
        isUrgent: false,
      };
      this.orderSkuList = [];
      this.detailAddress = "";
      this.systemError = "";
      this.errorStatus = false;
      this.error = {
        orderId: null,
        orderError: [],
        skuError: [],
      };
      this.isMore = false;
      this.moreRemarks = "";
      this.province = [];
      this.cityList = [];
      this.districtList = [];
      this.streetList = [];
      this.$refs["form"].resetFields();
      this.isShowEditor = false;
      this.$refs.editor.setContent("");
    },
    onOpen() {
      this.onGetProvinceList();
      this.onGetItemDetail(this.data);
      this.onGetSkuList(this.data);
      const _data = JSON.parse(JSON.stringify(this.data));
      const {
        trades = [],
        receiverInfo = {},
        buyerNick = "",
        minPayTime = "",
      } = _data || {};
      const { tid = "", oaid = "" } = trades[0];
      const {
        receiverState = "",
        receiverCity = "",
        receiverDistrict = "",
        receiverTown = "",
      } = receiverInfo || {};
      this.order.orderId = tid;
      this.order.buyerNickname = buyerNick;
      this.order.province = receiverState;
      this.order.city = receiverCity;
      this.order.district = receiverDistrict;
      this.order.street = receiverTown;
      this.order.buyerUid = oaid.substr(0, 10);
      this.order.orderTime = minPayTime;
      this.order.cpCode = this.logistics[0].cpCode;
    },
    onPush() {
      if (this.orderSkuList.length === 0) {
        this.$message.error("请至少添加一个子订单");
        return;
      }
      if (this.globalTime !== 0) {
        this.$message.error("3秒延迟中，请勿频繁操作");
        return;
      }
      if (this.loading) {
        return;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$emit("lock");
          this.onPushOrderJson(this.data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onChangeAddress() {
      if (!this.detailAddress) return;
      const data = {
        address: this.detailAddress,
      };
      $.ajax({
        url: `https://${this.$root.env}.prprp.com/api/common/address/parse`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
          token: this.$root.token,
        },
        data: {
          address: this.detailAddress,
        },
      }).then((res) => {
        let { addressDTO, personDTO } = res.data;
        // let citys = this.province.filter((item) => {
        //   return item.value == addressDTO.provId;
        // });

        // this.cityList = citys[0].children;
        // let districts = this.cityList.filter((item) => {
        //   return item.value == addressDTO.cityId;
        // });
        // this.districtList = districts[0].children;
        // let streets = this.districtList.filter((item) => {
        //   return item.value == addressDTO.areaId;
        // });
        // this.streetList = streets[0].children;

        this.order.province = `${addressDTO.provName}`;
        this.order.city = `${addressDTO.cityName}`;
        this.order.district = `${addressDTO.areaName}`;
        this.order.street = `${addressDTO.townName}`;
        this.order.address = addressDTO.address;
        this.order.receiver = personDTO.userName;
        this.order.phoneNumber = personDTO.mobilePhone;
        this.detailAddress = "";
      });
    },
    // onChangeValue(val, key) {
    //   if (key === "province") {
    //     let citys = this.province.filter((item) => {
    //       return item.text == val;
    //     });
    //     this.cityList = citys[0].children;
    //     this.districtList = [];
    //     this.streetList = [];
    //     this.order.city = "";
    //     this.order.district = "";
    //     this.order.street = "";
    //   }
    //   if (key === "city") {
    //     let districts = this.cityList.filter((item) => {
    //       return item.text == val;
    //     });
    //     this.districtList = districts[0].children;
    //     this.streetList = [];
    //     this.order.district = "";
    //     this.order.street = "";
    //   }
    //   if (key === "district") {
    //     let streets = this.districtList.filter((item) => {
    //       return item.text == val;
    //     });
    //     this.streetList = streets[0].children;
    //     this.order.street = "";
    //   }
    // },
    onAddOrder() {
      this.orderSkuList.push({
        skuCode: null,
        skuNum: 1,
        errorInfo: "",
        picUrl: "",
        picName: "",
        categoryName: "",
        modelName: "",
      });
    },
    onAddSpecialOrder() {
      this.orderSkuList.push({
        skuCode: null,
        skuNum: 1,
        errorInfo: "",
        picUrl: "",
        picName: "",
        categoryName: "",
        modelName: "",
        isSpecial: true,
      });
    },
    onAddSkus() {
      this.$confirm("是否需要清空默认数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.orderSkuList = [];
          this.isMore = true;
        })
        .catch(() => {
          this.isMore = true;
        });
    },
    onMoreCencel() {
      this.moreRemarks = "";
      this.isMore = false;
    },
    onMoreSubmit() {
      if (this.moreRemarks == "") {
        this.$message.error("信息为空");
        return;
      }
      let text = this.moreRemarks;
      let regList = /(?<=\【)[^\【\】]+(?=\】)/g;
      let list = text.match(regList);
      if (!list) {
        this.$message.error("格式不对");
        return;
      }
      for (var i = 0; i < list.length; i++) {
        if (list[i] == "" || list[i] == null || typeof list[i] == undefined) {
          list.splice(i, 1);
          i = i - 1;
        }
      }
      let oldList = JSON.parse(JSON.stringify(this.orderSkuList));
      // 去重
      list = list.reduce((acc, cur) => {
        const index = acc.findIndex((item) => item.skuCode === cur);
        if (index > -1) {
          acc[index].skuNum += 1;
        } else {
          acc.push({
            skuCode: cur,
            skuNum: 1,
            errorInfo: "",
            picUrl: "",
            picName: "",
            categoryName: "",
            modelName: "",
          });
        }
        return acc;
      }, oldList);
      this.orderSkuList = list;
      this.onCheckSkuList();
      this.moreRemarks = "";
      this.isMore = false;
    },
    onHandleRemarkSkuList(moreRemarks) {
      if (moreRemarks == "") {
        this.$message.error("红旗备注信息为空");
        return false;
      }
      let text = moreRemarks;
      let regList = /(?<=\【)[^\【\】]+(?=\】)/g;
      let list = text.match(regList);
      if (!list) {
        this.$message.error("红旗备注格式不对");
        return false;
      }
      for (var i = 0; i < list.length; i++) {
        if (list[i] == "" || list[i] == null || typeof list[i] == undefined) {
          list.splice(i, 1);
          i = i - 1;
        }
      }
      // 去重
      list = list.reduce((acc, cur) => {
        const index = acc.findIndex((item) => item.outerSkuId === cur);
        if (index > -1) {
          acc[index].num += 1;
        } else {
          acc.push({
            outerSkuId: cur,
            num: 1,
            errorInfo: "",
            picUrl: "",
          });
        }
        return acc;
      }, []);
      return list;
    },
    onChangeSkuNum(index, row) {
      const num = Number(row.skuNum.replace(/[^\d]/g, ""));
      if (num > 99999) {
        row.skuNum = 99999;
        return;
      }
      if (num <= 0) {
        row.skuNum = 1;
        return;
      }
      row.skuNum = num;
    },
    onLockPush() {
      if (this.globalTimer) {
        return;
      }
      this.globalTime = 3;
      this.globalTimer = setInterval(() => {
        if (this.globalTime === 0) {
          clearInterval(this.globalTimer);
          this.globalTimer = null;
        } else {
          this.globalTime--;
        }
      }, 1000);
    },
    // 检查skuItem
    onCheckSkuItem(index, item) {
      if (!item.skuCode) {
        return;
      }
      $.ajax({
        url: `https://${this.$root.env}.prprp.com/api/product/parsePushSkuList`,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
          token: this.$root.token,
        },
        data: JSON.stringify([
          {
            skuCode: item.skuCode,
            skuNum: item.skuNum,
            isSpecial: item.isSpecial ? true : false,
          },
        ]),
      })
        .then((response) => {
          const { status = null, msg = "", data: skuList = [] } = response;
          if (status === 200) {
            const {
              skuCode = "",
              skuNum = null,
              errorInfo = "",
              picUrl = "",
              picName = "",
              categoryName = "",
              modelName = "",
            } = skuList[0] || {};
            this.orderSkuList[index].skuCode = skuCode;
            this.orderSkuList[index].skuNum = skuNum;
            this.orderSkuList[index].errorInfo = errorInfo;
            this.orderSkuList[index].picUrl = picUrl;
            this.orderSkuList[index].picName = picName;
            this.orderSkuList[index].categoryName = categoryName;
            this.orderSkuList[index].modelName = modelName;
          } else {
            this.$message.error(`sku列表解析失败：${msg}`);
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
.dialogModify {
  .wrapper {
    .editor-title {
      display: flex;
      justify-content: space-between;
    }
    .sync {
      color: red;
    }
    .line {
      margin-bottom: 20px;
      width: 100%;
      height: 1px;
      background: #eee;
    }
    .title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      .text {
        font-size: 18px;
      }
    }
    .sku-error {
      color: red;
    }
  }
  .footer {
    .footer-btn {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
    .error {
      color: red;
      width: 100%;
      height: 50px;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #dcdfe6;
      margin-bottom: 10px;
      margin-top: 10px;
    }
  }
}
</style>
