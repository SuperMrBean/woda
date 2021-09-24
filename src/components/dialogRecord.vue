<template>
  <el-dialog
    width="1100px"
    title="回调记录"
    :visible.sync="isVisible"
    custom-class="dialogRecord"
    @close="onClose"
    @open="onOpen"
  >
    <div class="wrap">
      <el-table :data="list" align="center" v-loading="loading">
        <!-- <el-table-column prop="date" label="图片" width="80">
          <template slot-scope="scope">
            <img style="width: 50px; height: 50px" :src="scope.row.tumPath" />
          </template>
        </el-table-column> -->
        <el-table-column prop="orderId" label="订单号" width="200">
        </el-table-column>
        <el-table-column prop="logistics" label="快递公司">
          <template slot-scope="scope">
            <span>{{ scope.row.logistics }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="logisticsNumber"
          label="快递单号"
          width="180"
        ></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === 1">{{
              scope.row.status | formatStatus
            }}</el-tag>
            <el-tag type="warning" v-else-if="scope.row.status === 3">{{
              scope.row.status | formatStatus
            }}</el-tag>
            <el-tag v-else>{{ scope.row.status | formatStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="modifyTime" label="更新时间" width="180">
        </el-table-column>
        <el-table-column prop="" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 1"
              type="primary"
              size="mini"
              @click="onDelivery(scope.row)"
              :loading="sendLoading"
              >发货</el-button
            >
            <el-button
              type="warning"
              size="mini"
              v-if="scope.row.status === 3"
              @click="onDelivery(scope.row)"
              :loading="sendLoading"
              >重试</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="onChangeStatus(scope.row.id, 4)"
              >忽略</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:10px"
        layout="total, prev, pager, next"
        @current-change="onChangePage"
        :current-page="pageNo"
        :page-size="50"
        :total="total"
      ></el-pagination>
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
    logistics: {
      type: Array || null,
      require: true,
    },
    defAddress: {
      type: Object || null,
      require: true,
    },
    userInfo: {
      type: Object || null,
      require: true,
    },
  },
  data: function() {
    return {
      pageNo: 1,
      total: 0,
      list: [],
      loading: false,
      sendLoading: false,
    };
  },
  filters: {
    formatStatus(value) {
      switch (value) {
        case 0:
          return "等待回调";
        case 1:
          return "等待发货";
        case 2:
          return "发货成功";
        case 3:
          return "发货失败";
        case 4:
          return "忽略";
        default:
          return "-";
      }
    },
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
    getRecordList() {
      this.loading = true;
      const params = {
        pageNo: this.pageNo,
      };
      $.ajax({
        url: "https://ryanopen.prprp.com/api/callbackRecord/page",
        type: "GET",
        headers: {
          token: this.$root.token,
        },
        data: params,
      })
        .then(({ data: { records, total }, status, msg }) => {
          if (status === 200) {
            this.list = records;
            this.total = Number(total);
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
    // 发货
    onDelivery(listData) {
      this.sendLoading = true;
      const { defaultShopId = null } = this.userInfo || {};
      const { contact_id = null } = this.defAddress || {};
      const { logistics = "", logisticsNumber = "", orderId = "", id = "" } =
        listData || {};
      const logisticsSendList = [
        {
          cancelId: contact_id,
          companyCode: logistics,
          isSplit: 1,
          outSid: logisticsNumber,
          senderId: contact_id,
          tid: orderId,
          subTid: orderId,
        },
      ];
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
            this.onChangeStatus(id, 2);
          } else {
            this.onChangeStatus(id, 3);
            this.$message.error(`发货失败`);
          }
          this.sendLoading = false;
        })
        .catch((error) => {
          this.sendLoading = false;
          console.log(error);
        });
    },
    onChangeStatus(id, status) {
      const params = {
        id,
        status,
      };
      $.ajax({
        url: "https://ryanopen.prprp.com/api/callbackRecord/updateStatus",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        headers: {
          token: this.$root.token,
        },
        data: JSON.stringify(params),
      })
        .then((response) => {
          const { status: code = null } = response || {};
          if (code === 200) {
            if (status === 4) {
              this.$message.success("操作成功");
            } else {
              this.$message.success("发货成功");
            }
            this.getRecordList();
          } else {
            this.$message.error("修改回调失败");
          }
          this.sendLoading = false;
        })
        .catch((error) => {
          this.sendLoading = false;
          console.log(error);
        });
    },
    onClose() {
      this.pageNo = 1;
      this.total = 0;
      this.list = [];
      this.isVisible = false;
      this.sendLoading = false;
    },
    onOpen() {
      this.getRecordList();
    },
    onChangePage(page) {
      this.pageNo = page;
      this.getRecordList();
    },
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.dialogFlag {
  .wrap {
    width: 100%;
  }
}
</style>
