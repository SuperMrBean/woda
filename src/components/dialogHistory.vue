<template>
  <el-dialog
    width="1240px"
    title="历史订单查询"
    :visible.sync="isVisible"
    custom-class="dialogHistory"
    @close="onClose"
    @open="onOpen"
  >
    <div class="wrap">
      <el-form class="form" label-width="140px" label-position="left">
        <el-row>
          <el-col :span="12">
            <el-form-item label="推送时间">
              <el-date-picker
                v-model="date"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd hh:mm:ss"
                size="small"
                @change="changeSearch('date')"
                style="width:370px"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="填写或扫描订单编号">
              <el-input
                v-model="search.orderId"
                @change="changeSearch('orderId')"
                size="small"
                placeholder="同时支持订单号和二维码"
                style="width:370px"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row v-show="isMore">
          <el-col :span="12">
            <el-form-item label="填写扫描货物上的二维码或商家编码">
              <el-input
                v-model="search.skuCode"
                @change="changeSearch('skuCode')"
                size="small"
                placeholder="同时支持x开头和3段sku码和2段pack码"
                style="width:370px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="填入买家昵称">
              <el-input
                v-model="search.buyerNickname"
                @change="changeSearch('buyerNickname')"
                size="small"
                placeholder="买家昵称"
                style="width:370px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="isMore">
          <el-col :span="12">
            <el-form-item label="填入下单手机号码">
              <el-input
                v-model="search.phoneNumber"
                @change="changeSearch('phoneNumber')"
                size="small"
                placeholder="手机号码"
                style="width:370px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="填入快递单号">
              <el-input
                v-model="search.logisticsNumber"
                @change="changeSearch('logisticsNumber')"
                size="small"
                placeholder="快递单号"
                style="width:370px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="text" @click="handleShowMore">{{
            isMore ? "折叠查询条件" : "更多查询条件"
          }}</el-button>
          <el-button
            type="primary"
            size="small"
            @click="() => handlePageChange(1)"
            >查 询</el-button
          >
        </el-form-item>
      </el-form>

      <el-tabs v-model="search.tab" @tab-click="() => handlePageChange(1)">
        <el-tab-pane
          v-for="(val, key) in tabTypes"
          :label="val"
          :key="key"
          :name="key"
        ></el-tab-pane>
      </el-tabs>

      <div
        v-for="(list, index) in tableData"
        :key="index"
        class="listItem"
        v-loading="loading"
      >
        <p class="topline">
          <span>
            订单号：{{ list.orderId }}
            <el-tag
              :type="
                `${
                  list.orderState === 11
                    ? 'warning'
                    : list.orderState === 17
                    ? 'danger'
                    : 'primary'
                }`
              "
              size="mini"
              >{{ list.orderStateName }}</el-tag
            >
          </span>
          <span>推送时间： {{ list.createTime | formatTime }}</span>
        </p>
        <div class="orders">
          <el-table
            :data="list.skuGroupList"
            class="table-list"
            style="width: 600px"
            align="center"
          >
            <el-table-column prop="date" label="图片" width="80">
              <template slot-scope="scope">
                <img
                  style="width: 50px; height: 50px"
                  :src="scope.row.tumPath"
                />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="Sku属性" width="140">
              <template slot-scope="scope">
                <p>{{ scope.row.skuName }}</p>
                <el-tag type="warning">{{ scope.row.skuCode }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价" width="80">
              <template slot-scope="scope">￥{{ scope.row.price }}</template>
            </el-table-column>
            <el-table-column
              prop="skuNum"
              label="数量"
              width="80"
            ></el-table-column>
          </el-table>
          <div class="content mid">
            <p>
              共 {{ list.goodsCount }} 件货物，重量 {{ list.weight }}kg &nbsp;
              &nbsp; &nbsp; &nbsp;
              <b>￥{{ list.totalPrice }}</b>
              <span style="color: #909399; margin-left: 10px;"
                >含快递（￥{{ list.freight }}）</span
              >
            </p>
            <div>
              <p>
                收件人: {{ list.receiver }} &nbsp; &nbsp; &nbsp;
                &nbsp;手机号码:{{ list.phoneNumber }}
              </p>
              <p>收件地址:{{ list.fullAddress }}</p>
            </div>
            <div>
              <p>快递公司：{{ list.logistics }}</p>
              <p>快递单号：{{ list.logisticsNumber }}</p>
            </div>
            <p>
              买家昵称：{{ list.buyerNickName }} 买家UID：{{ list.buyerUid }}
            </p>
          </div>
          <div class="content right">
            <div>
              <el-button
                size="mini"
                type="text"
                @click="() => toggleTimeLine(index)"
                >{{ list.timeLine ? "折叠" : "展开" }}时间轴</el-button
              >
              <el-button
                type="primary"
                size="mini"
                style="position: relative;"
                @click="getDetail(list)"
                >详细</el-button
              >
            </div>
            <el-timeline
              class="timeline-wrap"
              :style="`position: ${list.timeLine ? 'relative' : 'absolute'}`"
            >
              <el-timeline-item
                v-for="(a, index) in list.logs"
                :key="index"
                :timestamp="`${a.time}`"
                >{{ a.type }}</el-timeline-item
              >
            </el-timeline>
          </div>
        </div>
      </div>
      <el-pagination
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
        :current-page="pageNo"
        :page-size="size"
        :total="total"
      ></el-pagination>

      <el-dialog
        title="货物详情"
        :visible.sync="dialog"
        width="800px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
      >
        <p class="topline">
          <span>
            订单号：{{ currentData.orderId }}
            <el-tag type="primary" size="mini" style="margin-left: 10px;">{{
              currentData.orderStateName
            }}</el-tag>
          </span>
          <span>共{{ currentData.goodsCount }}件货物</span>
        </p>
        <el-table
          :data="currentData.orderDetailSkuList"
          @expand-change="getChildTimeLine"
          style="width: 100%"
          ref="table"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-timeline>
                <el-timeline-item
                  v-for="(a, index) in scope.row.timeLine"
                  :key="index"
                  :timestamp="`${a.time}`"
                  >{{ a.type }}</el-timeline-item
                >
              </el-timeline>
            </template>
          </el-table-column>
          <el-table-column label="子订单号" prop="seq"></el-table-column>
          <el-table-column
            label="销售属性"
            prop="skuName"
            min-width="450"
          ></el-table-column>
          <el-table-column label="商家编码" prop="skuCode"></el-table-column>
          <el-table-column label="状态" prop="skuState">
            <template slot-scope="scope">
              <el-tag
                size="mini"
                :type="
                  statesColor[scope.row.skuState]
                    ? statesColor[scope.row.skuState]
                    : 'primary'
                "
                >{{ scope.row.skuState }}</el-tag
              >
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
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
    data: {
      type: Object || null,
      require: true,
    },
  },
  data: function() {
    return {
      tableData: [],
      pageNo: 1,
      total: 1,
      size: 1,
      date: [],
      loading: false,
      search: {
        beginTime: null,
        endTime: null,
        buyerNickname: null,
        logisticsNumber: null,
        orderId: null,
        phoneNumber: null,
        skuCode: null,
        tab: "all", // ALL全部，UNDONE未完成，FINISH已完成，INTERCEPTED已拦截
      },
      tabTypes: {
        all: "全部",
        undone: "未完成",
        finish: "已完成",
        intercepted: "已拦截",
      },
      currentData: {},
      dialog: false,
      statesColor: {
        待补货: "warning",
        已拦截: "danger",
        已完成: "success",
      },
      $refs: {},
      isMore: false,
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
  filters: {
    formatTime(date) {
      let fmt = "yyyy-MM-dd hh:mm:ss";
      date = typeof date === "string" ? new Date(Number(date)) : date;
      let o = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "h+": date.getHours(), // 小时
        "m+": date.getMinutes(), // 分
        "s+": date.getSeconds(), // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        ["S"]: date.getMilliseconds(), // 毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
      return fmt;
    },
  },
  methods: {
    getHistoryList() {
      this.loading = true;
      let [beginTime, endTime] = this.date || [];
      const params = {
        pageNo: this.pageNo,
        beginTime,
        endTime,
        ...this.search,
      };
      $.ajax({
        url: "https://ryanopen.prprp.com/api/order/shop_order/page",
        type: "GET",
        headers: {
          token: this.$root.token,
        },
        data: params,
      })
        .then(({ data: { records, total, size }, status, msg }) => {
          if (status === 200) {
            this.tableData = records;
            this.total = Number(total);
            this.size = Number(size);
          } else {
            this.$message.error(msg);
          }
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
        });
    },
    onClose() {
      this.isVisible = false;
    },
    onOpen() {
      this.getHistoryList();
    },
    changeSearch(type) {
      let orderId = null;
      if (type === "date") {
        let [beginTime, endTime] = this.date || [];
        this.search.beginTime = beginTime;
        this.search.endTime = endTime;
      }
      if (type === "orderId") {
        if (
          this.search.orderId.match(/@/g) &&
          this.search.orderId.match(/@/g).length >= 2
        ) {
          let splits = this.search.orderId.split(/@/g);
          orderId = splits[splits.length - 1];
        }
      }
    },
    handlePageChange(val) {
      this.pageNo = val;
      this.getHistoryList();
    },
    getDetail(data) {
      this.currentData = data;
      this.dialog = true;
    },
    getChildTimeLine(expandedRows) {
      // 存在timeLine直接返回，不进行操作
      if (expandedRows.timeLine) return;
      const { id, skuCode } = expandedRows || {};
      $.ajax({
        url: "https://ryanopen.prprp.com/api/order/sub_order/opLog/list",
        type: "GET",
        headers: {
          token: this.$root.token,
        },
        data: { orderId: id, skuCode },
      }).then(({ data, status, msg }) => {
        if (status === 200) {
          this.$set(expandedRows, "timeLine", data);
          setTimeout(() => {
            this.$refs.table.toggleRowExpansion(expandedRows);
          }, 100);
        } else {
          this.$message(msg);
        }
      });
    },

    toggleTimeLine(index) {
      this.$set(
        this.tableData[index],
        "timeLine",
        !this.tableData[index].timeLine
      );
    },
    handleShowMore() {
      this.isMore = !this.isMore;
    },
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.dialogHistory {
  .wrap {
    .form {
      border: 1px solid #ebebeb;
      border-radius: 3px;
      width: 1200px;
      padding: 20px;
      padding-bottom: 0;
    }
    .topline {
      flex: 1;
      padding: 5px 10px;
      background: #e4e7ed;
      align-items: center;
      color: #303133;
      display: flex;
      justify-content: space-between;
    }
    .listItem {
      border: 1px solid #dcdfe6;
      width: 1200px;
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;
      .orders {
        display: flex;
        padding: 0 20px;
        .content {
          margin-left: 10px;
        }
        .mid {
          width: 550px;
          border: 1px solid #eeeeee;
          > * {
            padding: 10px 0 10px 10px;
            border-bottom: 1px solid #eeeeee;
          }
        }
      }
      .right {
        max-height: 100%;
        margin: 10px;
        width: 180px;
        position: relative;
        overflow: hidden;
      }
    }
    .timeline-wrap {
      margin-top: 6px;
      height: 100%;
      overflow: scroll;
      position: absolute;
      width: 100%;
      padding-left: 10px;
      height: 100%;
      overflow: scroll;
    }
  }
}
</style>
