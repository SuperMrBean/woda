<template>
  <el-dialog
    width="900px"
    title="修改订单"
    :visible.sync="isVisible"
    custom-class="dialogModify"
    @close="onClose"
    @open="onOpen"
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
                placeholder="选填，留空则随机生成"
                size="mini"
                v-model="order.orderNo"
                style="width:200px"
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
                placeholder="选填，留空则随机生成"
                size="mini"
                v-model="order.buyerNickname"
                style="width:200px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="买家UID">
              <el-input
                placeholder="选填，留空则随机生成"
                size="mini"
                v-model="order.buyerUid"
                style="width:200px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="line" />
        <div class="title">
          <div class="text">收件信息</div>
          <div>
            <el-checkbox
              v-model="isInner"
              v-if="shopInfo && shopInfo.permissionInnerOrder"
              >内部订单</el-checkbox
            >
            <el-checkbox
              v-model="isUrgent"
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
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="城市" label-width="70px" required prop="city">
              <el-select
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
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="行政区"
              label-width="70px"
              required
              prop="district"
            >
              <el-select
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
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="24">
          <el-col :span="10">
            <el-form-item
              label="街道/乡镇"
              prop="street"
              required
              label-width="90px"
            >
              <el-select
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
              </el-select>
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
      <el-table
        v-if="orderSkuList.length"
        :data="orderSkuList"
        style="width: 100%"
      >
        <el-table-column label="子订单号">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="skuCode" label="商家编码">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.skuCode"
              size="mini"
              placeholder="商家编码"
              @blur="onCheckSkuList"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="skuNum" label="数量">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.skuNum"
              size="mini"
              placeholder="数量"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="信息">
          <template slot-scope="scope">
            <span class="sku-error">{{ scope.row.errorInfo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
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
        <el-button size="mini" type="success" @click="onAddSkus"
          >快速添加</el-button
        >
        <el-button size="mini" type="primary" @click="onPush" :loading="loading"
          >推送</el-button
        >
      </div>
    </div>
    <el-dialog title="快速添加" :visible.sync="isMore" append-to-body>
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
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
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
    balance: {
      type: Number || null,
      require: true,
    },
  },
  data: function() {
    return {
      loading: false,
      province: [],
      cityList: [],
      districtList: [],
      streetList: [],
      order: {
        orderNo: "",
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
      },
      orderSkuList: [],
      detailAddress: "",
      isUrgent: false,
      isInner: false,
      systemError: "",
      errorStatus: false,
      error: {
        orderId: null,
        orderError: [],
        skuError: [],
      },
      isMore: false,
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
    // 获取省市区数据
    onGetProvinceList() {
      $.ajax({
        url: "https://ryanopen.prprp.com/api/common/cascadingStreets",
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
        url: "https://ryanopen.prprp.com/api/product/parsePushSkuList",
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
            this.pushLoading = false;
          }
        })
        .catch((error) => {
          this.pushLoading = false;
          const { responseJSON = {} } = error || {};
          const { msg = "" } = responseJSON || {};
          this.$message.error(msg);
        });
    },
    // 检查skuList
    onCheckSkuList() {
      $.ajax({
        url: "https://ryanopen.prprp.com/api/product/parsePushSkuList",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
          token: this.$root.token,
        },
        data: JSON.stringify(
          this.orderSkuList.map((item) => {
            return { skuCode: item.skuCode, skuNum: item.skuNum };
          })
        ),
      })
        .then((response) => {
          const { status = null, msg = "", data: skuList = [] } = response;
          if (status === 200) {
            this.orderSkuList = skuList;
          } else {
            this.$message.error(`sku列表解析失败：${msg}`);
            this.pushLoading = false;
          }
        })
        .catch((error) => {
          this.pushLoading = false;
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
            orderId: this.order.orderId
              ? this.order.orderId
              : new Date().getTime(),
            cpCode: this.order.cpCode,
            buyerNickname: this.order.buyerNickname
              ? this.order.buyerNickname
              : new Date().getTime(),
            buyerUid: this.order.buyerUid
              ? this.order.buyerUid
              : new Date().getTime(),
            receiver: this.order.receiver,
            phoneNumber: this.order.phoneNumber,
            province: this.order.province,
            city: this.order.city,
            district: this.order.district,
            street: this.order.street,
            address: this.order.address,
            fullAddress: `${this.order.province}${this.order.city}${this.order.district}${this.order.street}${this.order.address}`,
            flag: 4,
            interceptReason: "",
            orderTime: this.order.orderTime,
            innerOrder: this.isInner ? 1 : 0,
            isUrgent: this.isUrgent ? 1 : 0,
            orderSkuList: this.orderSkuList,
          },
        ],
      };
      $.ajax({
        url: "https://ryanopen.prprp.com/api/order/json",
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
              const { orderError = [] } = error[0];
              if (orderError.length > 0) {
                this.error.orderError = orderError;
              }
              this.loading = false;
              this.$message.error("推送失败");
            } else {
              this.error = [];
              this.$emit("refresh", balance);
              this.$message.success("推送成功");
              this.isVisible = false;
              this.loading = false;
            }
          } else {
            this.loading = false;
            this.$message.error(`推送失败：${msg}`);
          }
        })
        .catch((error) => {
          const { responseJSON = {} } = error || {};
          const { msg = "" } = responseJSON || {};
          this.$message.error(msg);
          this.loading = false;
        });
    },
    onClose() {
      this.isVisible = false;
      this.loading = false;
      this.order = {
        orderNo: "",
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
      };
      this.orderSkuList = [];
      this.detailAddress = "";
      this.isUrgent = false;
      this.isInner = false;
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
    },
    onOpen() {
      this.onGetProvinceList();
      this.order.cpCode = this.logistics[0].cpCode;
    },
    onPush() {
      if (this.orderSkuList.length === 0) {
        this.$message.error("请至少添加一个子订单");
        return;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
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
        url: "https://ryanopen.prprp.com/api/common/address/parse",
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
        let citys = this.province.filter((item) => {
          return item.value == addressDTO.provId;
        });

        this.cityList = citys[0].children;
        let districts = this.cityList.filter((item) => {
          return item.value == addressDTO.cityId;
        });
        this.districtList = districts[0].children;
        let streets = this.districtList.filter((item) => {
          return item.value == addressDTO.areaId;
        });
        this.streetList = streets[0].children;

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
    onChangeValue(val, key) {
      if (key === "province") {
        let citys = this.province.filter((item) => {
          return item.text == val;
        });
        this.cityList = citys[0].children;
        this.districtList = [];
        this.streetList = [];
        this.order.city = "";
        this.order.district = "";
        this.order.street = "";
      }
      if (key === "city") {
        let districts = this.cityList.filter((item) => {
          return item.text == val;
        });
        this.districtList = districts[0].children;
        this.streetList = [];
        this.order.district = "";
        this.order.street = "";
      }
      if (key === "district") {
        let streets = this.districtList.filter((item) => {
          return item.text == val;
        });
        this.streetList = streets[0].children;
        this.order.street = "";
      }
    },
    onAddOrder() {
      this.orderSkuList.push({
        skuCode: null,
        skuNum: 1,
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
          });
        }
        return acc;
      }, oldList);
      this.orderSkuList = list;
      this.onCheckSkuList();
      this.moreRemarks = "";
      this.isMore = false;
    },
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.dialogModify {
  .wrapper {
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
