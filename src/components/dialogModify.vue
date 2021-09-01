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
      <el-form inline label-width="80px">
        <el-row :span="24">
          <el-col :span="12">
            <el-form-item label="订单编号">
              <el-input
                placeholder="订单编号"
                size="mini"
                v-model="order.orderNo"
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
                disabled
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
          <el-checkbox v-model="checked">加急订单</el-checkbox>
        </div>
        <el-row :span="16">
          <el-col :span="8">
            <el-form-item label="联系人" required>
              <el-input
                placeholder="联系人"
                size="mini"
                v-model="order.receiver"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机" required>
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
            <el-form-item label="省份" label-width="70px" required>
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
            <el-form-item label="城市" label-width="70px" required>
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
            <el-form-item label="行政区" label-width="70px" required>
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
            <el-form-item label="街道/乡镇">
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
            <el-form-item label="详细地址" required>
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
            <span class="order-error">{{ scope.row.errorInfo }}</span>
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
        <el-button
          size="mini"
          type="primary"
          @click="onPostOrder"
          :loading="loading"
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
    data: {
      type: Object || null,
      require: true,
    },
    userInfo: {
      type: Object || null,
      require: true,
    },
    logistics: {
      type: Array || null,
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
      checked: false,
      systemError: "",
      errorStatus: false,
      error: {
        orderId: null,
        orderError: [],
        skuError: [],
      },
      isMore: false,
      moreRemarks: "",
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
      console.log(this.userInfo);
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
        url: "//47.110.83.17:8700/api/common/cascadingStreets",
        type: "GET",
        headers: {
          token: this.$root.token,
        },
      })
        .then((response) => {
          const { data = [] } = response || {};
          this.province = data;
          let citys = this.province.filter((item) => {
            return item.text == this.order.province;
          });
          this.cityList = citys[0].children;
          let districts = this.cityList.filter((item) => {
            return item.text == this.order.city;
          });
          this.districtList = districts[0].children;
          let streets = this.districtList.filter((item) => {
            return item.text == this.order.district;
          });
          this.streetList = streets[0].children;
        })
        .catch((error) => {
          console.log(error);
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
            this.orderSkuList = skuList;
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
    onPostOrder() {},
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
      this.checked = false;
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
    },
    onOpen() {
      this.onGetProvinceList();
      this.onGetItemDetail(this.data);
      this.onGetSkuList(this.data);
      const _data = JSON.parse(JSON.stringify(this.data));
      const { trades = [], receiverInfo = {}, buyerNick = "" } = _data || {};
      const { tid = "", oaid = "" } = trades[0];
      const {
        receiverState = "",
        receiverCity = "",
        receiverDistrict = "",
        receiverTown = "",
      } = receiverInfo || {};
      this.order.orderNo = tid;
      this.order.buyerNickname = buyerNick;
      this.order.province = receiverState;
      this.order.city = receiverCity;
      this.order.district = receiverDistrict;
      this.order.street = receiverTown;
      this.order.buyerUid = oaid.substr(0, 10);
    },
    onChangeAddress() {
      if (!this.detailAddress) return;
      const data = {
        address: this.detailAddress,
      };
      $.ajax({
        url: "//47.110.83.17:8700/api/common/address/parse",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
      }).then((res) => {
        let { addressDTO, personDTO } = res.data.data;
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

        this.order.province = `${addressDTO.provId}`;
        this.order.city = `${addressDTO.cityId}`;
        this.order.district = `${addressDTO.areaId}`;
        this.order.street = `${addressDTO.townId}`;
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
        count: 1,
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
      list.map((item) => {
        let data = {
          skuCode: item,
          count: 1,
        };
        this.orderSkuList.push(data);
      });
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
    .order-error {
      color: #f56c6c;
    }
    .footer-btn {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
    .order-error {
      color: red;
    }
    .error {
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
  .footer {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
