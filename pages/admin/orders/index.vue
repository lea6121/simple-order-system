<template lang="pug">
div
  el-container(style='border: 1px solid #eee')
    el-aside(width='15%' style='background-color: rgb(238, 241, 246)')
      el-menu(:default-openeds="['1', '2']")
        el-submenu(index='1')
          template(slot='title')
            i.el-icon-setting
          el-menu-item(index='1-1') 訂單管理
          el-menu-item(index='1-2' @click='goToStock') 庫存管理
    el-container
      el-header
        h1 訂單管理
      el-container.btn-container
        el-button.add-btn(@click='dialogFormVisible = true') 新增訂單
        el-select(v-model="userFilter" @change='filterUserOrders' placeholder="篩選使用者訂單")
          el-option(v-for='(item, index) in users' :key='index' :label='item.username' :value='item.userId')
      el-main
        el-table(:data='setOrdersData')
          el-table-column(type='index' label='')
          el-table-column(prop='id' label='編號' @click='openDetails(scope.row.id)')
          el-table-column(prop='username' label='會員')
          el-table-column(prop='' label='商品')
            el-table-column(prop='products' label='名稱' :formatter='(row, column, cv) => renderTitles(cv)')
            el-table-column(prop='products' label='價格' :formatter='(row, column, cv) => renderPrices(cv)')
            el-table-column(prop='products' label='數量' :formatter='(row, column, cv) => renderQuantities(cv)')
          el-table-column(prop='remark' label='備註')
          el-table-column.btns(align='right' label='操作')
            template(slot-scope='scope')
              el-button(size='mini' type='info' @click='openDetails(scope.row.id)') 詳情
              el-button(size='mini' @click='handleEdit(scope.$index, scope.row.id);dialogFormVisible = true;') 編輯
              el-button(size='mini' type='danger' @click='handleDelete(scope.$index)') 刪除
        el-dialog(title='訂單內容' :visible.sync='dialogFormVisible' width='60%')
          el-container.dialog-btn-container
            el-button.add-product-btn(@click='handleAddProduct') 新增項目
            el-select(v-model="orderItems.userId" @change='findUser(orderItems.userId)' placeholder="請選擇使用者新增訂單")
              el-option(v-for='(item, index) in users' :key='index' :label='item.username' :value='item.userId')
          table
            thead
              tr
                th 名稱
                th 價格
                th 數量（需大於 0 筆）
                th 操作
            tbody
              tr(v-for='(item, index) in orderItems.products' :key='index')
                td
                  el-select(v-model='item.id' @change='findData(item.id, index)'
                  placeholder="請選擇商品")
                    el-option(v-for='(item, index) in stock' :key='index' :label='item.productName' :value='item.productId')
                td
                  el-input(type='number' v-model='item.price' :placeholder='item.price' disabled='')
                td
                  el-input(type='number' v-model='item.quantity' placeholder='請輸入商品數量' min='1' :max='item.stock')
                td
                  el-button.btn(@click='handleDeleteProduct(index)') 刪除
          el-input(type='textarea' :rows='2' placeholder='備註' v-model='orderItems.remark')
          .dialog-footer(slot='footer')
            el-button(@click='reset(); dialogFormVisible = false;') 取消
            el-button(type='primary' @click='handleConfirm();') 確定
</template>

<script>
/* eslint-disable */
import { mapActions, mapState } from 'vuex';

export default {
  name: 'OrdersPage',
  data () {
    return {
      dialogFormVisible: false,
      userFilter: '1640433987122',
      // 用來暫時存放新的訂單的地方
      orderItems: {
        id: Date.now().toString(),
        userId: '',
        username: '',
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
      oldOrderProducts: [],
    };
  },
  computed: {
    setOrdersData () {
      const data = this.filterUserOrders();
      return data;
    },
    ...mapState(['orders', 'stock', 'users']),
  },
  methods: {
    ...mapActions([
      'addNewOrder',
      'deleteOrder',
      'modifyOrder',
      'modifyProduct',
    ]),
    openError(msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'error',
      });
    },
    openSuccess(msg){
      this.$message({
        showClose: true,
        message: msg,
        type: 'success',
      });
    },
    goToStock () {
      this.$router.push('/admin/stock');
    },
    filterUserOrders () {
      const id = this.userFilter;
      const result = this.orders.filter((x) => x.userId === id);
      if (!id || id !== '1640433987122') {
        return result;
      } else {
        return this.$store.state.orders;
      }
    },
    findData (id, index) {
      const foundData = this.stock.find((x) => x.productId === id);
      if (foundData) {
        this.orderItems.products[index].name = foundData.productName;
        this.orderItems.products[index].price = foundData.price;
        this.orderItems.products[index].stock = foundData.stock;
      }
    },
    findUser (id) {
      const foundUser = this.users.find((x) => x.userId === id);
      this.orderItems.username = foundUser.username;
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
      const quantities = cv.reduce((str, item) => str + `${item.quantity}\n`, '');
      return quantities;
    },
    openDetails (id) {
      this.$router.push(`/admin/orders/${id}`);
    },
    handleDelete (index) {
      const productData = JSON.parse(
        JSON.stringify(this.orders[index].products)
      );
      for (let i = 0; i < productData.length; i++) {
        const result = this.stock.filter(
          (x) => x.productId === productData[i].id
        );
        if (result.length === 0) {
          this.deleteOrder(index);
          return;
        }
        const value = Number(productData[i].quantity);
        const newQuantity = Number(result[0].stock) + value;
        const stockIndex = this.stock.findIndex(
          (x) => x.productId === productData[i].id
        );
        this.stock[stockIndex].stock = newQuantity.toString();
      }
      this.deleteOrder(index);
    },
    handleEdit (index, id) {
      const productData = JSON.parse(
        JSON.stringify(this.orders[index].products)
      );
      const orderRemark = this.orders[index].remark;
      this.orderItems.id = id;
      this.orderItems.userId = this.orders[index].userId;
      this.orderItems.username = this.orders[index].username;
      this.orderItems.products = productData;
      this.orderItems.remark = orderRemark;
      this.oldOrderProducts = JSON.parse(
        JSON.stringify(this.orderItems.products)
      );
    },
    handleAddProduct () {
      this.orderItems.products.push({
        id: '',
        name: '',
        price: '',
        quantity: '',
        stock: '',
      });
    },
    handleDeleteProduct (index) {
      this.orderItems.products.splice(index, 1);
    },
    formValidation (item) {
      let formIsValid = true;
      if (
        !item.name.trim() ||
        Number(item.price.trim()) < 1 ||
        Number(item.quantity.trim()) < 1
      ) {
        formIsValid = false;
        this.dialogFormVisible = true;
        return formIsValid;
      }
      return formIsValid;
    },
    reset() {
      this.orderItems = {
        id: Date.now().toString(),
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
      };
      this.oldOrderProducts = [];
    },
    calculateAddStock (data) {
      let isValid = true;
      for (let i = 0; i < data.length; i++) {
        const result = this.stock.filter((x) => x.productId === data[i].id);
        const newQuantity = Number(result[0].stock) - Number(data[i].quantity);
        if (newQuantity < 0) {
          let msg = `${result[0].productName}現有庫存為 ${result[0].stock}，請重新訂購。` 
          this.openError(msg)
          isValid = false;
        } else {
          const index = this.stock.findIndex((x) => x.productId === data[i].id);
          this.stock[index].stock = newQuantity.toString();
        }
      }
      return isValid;
    },
    findDuplicateProduct (data) {
      const valueArr = data.map((item) => {
        return item.id;
      });
      const duplicateData = data.filter((x) => x.id === valueArr[0]);
      function getAddNum (arr) {
        let number = 0;
        for (let i = 0; i < arr.length; i++) {
          number += Number(arr[i].quantity);
        }
        return number;
      }
      let l;
      const result = data.reduce((r, e, i) => {
        if (!r[e.id]) {
          l = e.id;
          r[e.id] = {
            count: 1,
            index: [i],
          };
        } else if ((data[i + 1] && data[i + 1].name !== l) || !data[i + 1]) {
          r[e.id].index.push(i);
          r[e.id].count++;
        }
        return r;
      }, {});
      data[result[valueArr[0]].index[0]].quantity =
        getAddNum(duplicateData).toString();
      for (let i = 1; i < result[valueArr[0]].index.length; i++) {
        data.splice(result[valueArr[0]].index[i], 1);
      }
    },
    addOrderConfirmation () {
      if (this.orderItems.products.length === 0) {
        this.reset();
        return;
      }
      if (!this.orderItems.userId || !this.orderItems.username) {
        const msg = '請選擇使用者下單。';
        this.openError(msg);
        return;
      }
      this.findDuplicateProduct(this.orderItems.products);
      for (let i = 0; i < this.orderItems.products.length; i++) {
        const product = this.orderItems.products[i];
        if (!this.formValidation (product)) {
          const msg = '新增失敗，請填入應填資訊。';
          this.openError(msg);
          return;
        }
      }
      const newOrders = JSON.parse(JSON.stringify(this.orderItems));
      if (this.calculateAddStock(newOrders.products)) {
        this.addNewOrder(newOrders);
        this.dialogFormVisible = false;
        this.reset();
        this.openSuccess('訂單新增成功。')
      }
    },
    removeDuplicates(arr) {
      const ids = arr.map((o) => o.id);
      const filtered = arr.filter(
        ({ id }, index) => !ids.includes(id, index + 1)
      );
      return filtered;
    },
    calculateUpdateStock(data) {
      const arr = data.concat(this.oldOrderProducts);
      const unionArr = this.removeDuplicates(arr);
      let isValid = true;
      for (let i = 0; i < unionArr.length; i++) {
        const result = this.stock.filter((x) => x.productId === unionArr[i].id);
        let oldValue = 0;
        let value = 0;
        let newQuantity = 0;
        const foundValue = data.some((e) => e.id === unionArr[i].id);
        const foundOldValue = this.oldOrderProducts.some(
          (e) => e.id === unionArr[i].id
        );
        if (foundOldValue && foundValue) {
          const index = this.oldOrderProducts.findIndex(
            (x) => x.id === unionArr[i].id
          );
          const newIndex = data.findIndex((x) => x.id === unionArr[i].id);
          oldValue = Number(this.oldOrderProducts[index].quantity);
          value = Number(data[newIndex].quantity);
          if (result.length === 0) {
            newQuantity = oldValue;
          } else {
            newQuantity = Number(result[0].stock) + oldValue - value;
            if (newQuantity < 0) {
              const msg = `${result[0].productName}現有庫存為 ${result[0].stock}，請更改下訂數量。`;
              this.openError(msg);
              isValid = false;
              return;
            }
            const stockIndex = this.stock.findIndex(
              (x) => x.productId === unionArr[i].id
            );
            this.stock[stockIndex].stock = newQuantity.toString();
          }
        }
        if (foundOldValue && !foundValue) {
          const index = this.oldOrderProducts.findIndex(
            (x) => x.id === unionArr[i].id
          );
          oldValue = Number(this.oldOrderProducts[index].quantity);
          let newQuantity = 0;
          if (result.length === 0) {
            newQuantity = oldValue;
          } else {
            newQuantity = Number(result[0].stock) + oldValue;
            if (newQuantity < 0) {
              const msg = `${result[0].productName}現有庫存為 ${result[0].stock}，請更改下訂數量。`;
              this.openError(msg);
              isValid = false;
              return;
            }
            const stockIndex = this.stock.findIndex(
              (x) => x.productId === unionArr[i].id
            );
            this.stock[stockIndex].stock = newQuantity.toString();
          }
        }
        if (!foundOldValue && foundValue) {
          const newIndex = data.findIndex((x) => x.id === unionArr[i].id);
          value = Number(data[newIndex].quantity);
          const newQuantity = Number(result[0].stock) - value;
          if (newQuantity < 0) {
            const msg = `${result[0].productName}現有庫存為 ${result[0].stock}，請更改下訂數量。`;
            this.openError(msg);
            isValid = false;
            return;
          }
          const stockIndex = this.stock.findIndex(
            (x) => x.productId === unionArr[i].id
          );
          this.stock[stockIndex].stock = newQuantity.toString();
        }
      }
      return isValid;
    },
    editConfirmation (id) {
      if (this.orderItems.products.length === 0) {
        return;
      }
      this.findDuplicateProduct(this.orderItems.products);
      for (let i = 0; i < this.orderItems.products.length; i++) {
        if (!this.orderItems.userId || !this.orderItems.username) {
          return;
        }
        const product = this.orderItems.products[i];
        if (!this.formValidation(product)) {
          const msg = '更新失敗，請填入應填資訊。';
          this.openError(msg);
          return;
        }
      }
      if (this.calculateUpdateStock(this.orderItems.products)) {
        this.modifyOrder(this.orderItems);
        this.dialogFormVisible = false;
        this.reset();
        this.openSuccess('訂單更新成功！')
      }
    },
    handleConfirm () {
      const id = this.orderItems.id;
      if (this.orders.find((x) => x.id === id)) {
        this.editConfirmation(id);
        return;
      }
      this.addOrderConfirmation();
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
  .el-container.btn-container {
    width: 100%;
    border: none;
    display: flex;
    justify-content: space-between;
    max-height: 80px;
    padding: 20px;
    .el-button.add-btn {
      height: 50px;
    }
  }
  .el-dialog {
    .dialog-btn-container {
      border: none;
      display: flex;
      justify-content: space-between;
      height: 5em;
      align-items: center;
      .add-product-btn {
        margin-button: 0px;
      }
    }
    &__header {
      text-align: center;
      padding: 20px;
    }
    &__title {
      font-size: 26px;
      display: block;
      padding: 10px;
    }
    &__headerbtn {
      display: none;
    }
    &__body {
      table {
        width: 100%;
        margin: 0 auto 10px;
        thead {
          width: 100%;
          background: rgba(0, 0, 0, 0.2);
          tr {
            height: 40px;
            line-height: 40px;
            text-align: center;
          }
          th {
            border: 2px solid white;
          }
        }
        tbody {
          width: 100%;
          background: rgba(0, 0, 0, 0.1);
          td {
            padding: 10px;
            border: 2px solid white;
          }
          .el-select {
            padding: 4px;
          }
          .btn {
            padding: 10px;
          }
          .el-select,
          .btn {
            margin: 0 auto;
            display: block;
            width: -webkit-fill-available;
            font-size: 16px;
          }
        }
      }
    }
  }
  .el-header {
    background-color: rgba(0, 0, 0, 0.1);
    color: #333;
    line-height: 60px;
    font-size: 20px;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-button {
      padding: 13px;
    }
  }
  .el-aside {
    color: #333;
  }
  .el-table {
    margin-bottom: 10px;
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
  .is-right {
    .cell {
      display: grid;
      justify-content: center;
      button {
        margin: 2px;
      }
    }
  }
}
</style>
