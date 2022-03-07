<template lang="pug">
div
  el-container
    el-aside(width='15%' style='background-color: rgb(238, 241, 246)')
      el-menu(:default-openeds="['1', '2']")
        el-submenu(index='1')
          template(slot='title')
            i.el-icon-setting
          el-menu-item(index='1-1' @click='goToOrders') 訂單管理
          el-menu-item(index='1-2' @click='goToStock') 庫存管理
    el-container(style='display:block;')
      el-header
        h1 訂單管理
        el-button 登出
      el-main
        el-table(:data='setTableData')
          el-table-column(prop='id' label='編號' @click='openDetails(scope.$index)')
          el-table-column(prop='username' label='會員')
          el-table-column(prop='' label='商品')
            el-table-column(prop='products' label='名稱' :formatter='(row, column, cv) => renderTitles(cv)')
            el-table-column(prop='products' label='價格' :formatter='(row, column, cv) => renderPrices(cv)')
            el-table-column(prop='products' label='數量' :formatter='(row, column, cv) => renderQuantities(cv)')
          el-table-column(prop='remark' label='備註')
      el-button.last-step(style='margin:0 0 20px 20px; display:block; text-align:right' @click='backToList') 回訂單列表
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'SingleOrderPage',
  data () {
    return {
      dialogFormVisible: false,
      orderItems: {
        id: Date.now(),
        products: [
          {
            id: '',
            name: '',
            price: '',
            quantity: '',
            stock: '',
          },
        ],
        remark: '',
      },
    };
  },
  computed: {
    ...mapState(['stock', 'orders']),
    setTableData () {
      const id = this.$route.params.id;
      if (!this.orders.find((x) => x.id === id)) {
        this.$router.go(-1);
      }
      const singleOrder = [];
      singleOrder.push(this.orders.find((x) => x.id === id));
      return singleOrder;
    },
  },
  methods: {
    ...mapActions(['deleteOrder', 'modifyOrder']),
    backToList () {
      this.$router.push('/admin/orders');
    },
    goToOrders () {
      this.$router.push('/admin/orders');
    },
    goToStock () {
      this.$router.push('/admin/stock');
    },
    renderTitles (cv) {
      const titles = cv.reduce((str, item) => str + `${item.name}\n`, '');
      return titles;
    },
    renderPrices (cv) {
      const prices = cv.reduce((str, item) => str + `$ ${item.price}\n`, '');
      return prices;
    },
    renderQuantities (cv) {
      const quantities = cv.reduce(
        (str, item) => str + `${item.quantity}\n`, '');
      return quantities;
    },
  },
};
</script>
<style lang="scss">
.el-container {
  height: 100vh;
  .el-submenu .el-menu-item {
    padding: 0;
    font-size: 16px;
  }
  h1 {
    font-size: 24px;
    letter-spacing: 0.05rem;
  }
  .el-container {
    margin: 0 auto;
    max-width: 1480px;
    height: auto;
    border: 1px solid #eee;
    .el-header {
      padding: 0 22px;
      background-color: rgba(0, 0, 0, 0.1);
      color: rgba(0, 0, 0, 0.8);
      line-height: 60px;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .el-table thead.is-group th.el-table__cell {
      background: rgba(0, 0, 0, 0.2);
    }
    .cell {
      font-size: 15px;
      text-align: center;
      color: rgba(0, 0, 0, 0.8);
      white-space: break-spaces !important;
      word-break: break-word;
    }
  }
}
</style>
