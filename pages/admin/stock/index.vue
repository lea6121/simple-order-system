<template lang="pug">
div
  el-container(style='border: 1px solid #eee')
    el-aside(width='15%' style='background-color: rgb(238, 241, 246)')
      el-menu(:default-openeds="['1', '2']")
        el-submenu(index='1')
          template(slot='title')
            i.el-icon-setting
          el-menu-item(index='1-1' @click='goToOrders') 訂單管理
          el-menu-item(index='1-2' @click='goToStock') 庫存管理
    el-container
      el-header
        h1 庫存管理
      el-button.add-btn(@click='dialogFormVisible = true') 新增項目
      el-main
        el-table(:data='setTableData')
          el-table-column(type='index' label='')
          el-table-column(prop='productId' label='商品編號')
          el-table-column(prop='productName' label='商品名稱')
          el-table-column(prop='price' label='商品價格')
          el-table-column(prop='stock' label='商品數量')
          el-table-column.btns(align='right' label='操作')
            template(slot-scope='scope')
              el-button(size='mini' @click='handleEdit(scope.$index, scope.row.id);dialogFormVisible = true;') 編輯
              el-button(size='mini' type='danger' @click='handleDelete(scope.$index)') 刪除
        el-dialog(width='60%' title='商品內容' :visible.sync='dialogFormVisible')
          table
            thead
              tr
                th 編號
                th 名稱
                th 價格（需大於 0 元）
                th 數量（需大於 0 筆）
            tbody
              tr
                td
                  el-input(type='number' placeholder='請輸入商品編號' v-model='productItem.productId' autofocus='autofocus')
                td
                  el-input(type='text' placeholder='請輸入商品名稱' v-model='productItem.productName')
                td
                  el-input(type='number' placeholder='請輸入商品金額' min='1' v-model='productItem.price')
                td
                  el-input(type='number' placeholder='請輸入商品數量' min='1' v-model='productItem.stock')
          .dialog-footer(slot='footer')
            el-button(@click='reset(); dialogFormVisible = false;') 取消
            el-button(type='primary' @click='handleConfirm();') 確認
</template>

<script>
/* eslint-disable */
import { mapActions, mapState } from 'vuex';

export default {
  name: 'StockPage',
  data () {
    return {
      dialogFormVisible: false,
      // 用來暫時存放新產品
      productItem: {
        productId: '',
        productName: '',
        stock: '',
        price: '',
      },
    };
  },
  computed: {
    setTableData () {
      return this.$store.state.stock;
    },
    ...mapState(['orders', 'stock']),
  },
  methods: {
    ...mapActions(['addNewProduct', 'deleteProduct', 'modifyProduct']),
    goToOrders () {
      this.$router.push('/admin/orders');
    },
    goToStock () {
      this.$router.push('/admin/stock');
    },
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
    handleEdit (index, id) {
      const productData = JSON.parse(JSON.stringify(this.stock[index]));
      this.productItem.productId = productData.productId;
      this.productItem.productName = productData.productName;
      this.productItem.stock = productData.stock;
      this.productItem.price = productData.price;
    },
    handleDelete (index) {
      this.deleteProduct(index);
    },
    async formValidation (item) {
      let formIsValid = true;
      const duplicateId = this.stock.some(
        (e) => e.productId === item.productId
      );
      const duplicateName = this.stock.some(
        (e) => e.productName === item.productName
      );
      if (duplicateId && duplicateName) {
        formIsValid = true;
        return formIsValid;
      }
      if (duplicateId) {
        formIsValid = false;
        this.openError('商品編號不可重複。');
        return formIsValid;
      } else if (duplicateName) {
          await this.$confirm('商品名稱重複，確定新增同名稱商品嗎？', '', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '新增成功。'
          });
          formIsValid = true;
          return formIsValid;
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消新增。'
          });
          formIsValid = false;
          return formIsValid;       
        });
      } 
      if (
        !item.productName.trim() ||
        Number(item.price.trim()) < 1 ||
        Number(item.stock.trim()) < 1
      ) {
        formIsValid = false;
        this.dialogFormVisible = true;
        return formIsValid;
      }
      return formIsValid;
    },
    reset () {
      this.productItem = {
        productId: '',
        productName: '',
        stock: '',
        price: '',
      };
    },
    editConfirmation (id) {
      const modifyProduct = JSON.parse(JSON.stringify(this.productItem));
      if (!this.formValidation(modifyProduct)) {
        return;
      }
      this.modifyProduct(modifyProduct);
      this.dialogFormVisible = false;
      this.reset();
    },
    async addProductConfirmation () {
      let result = await this.formValidation(this.productItem)
      if (!result) {
        this.openError('新增失敗，請填入應填資訊。');
        return;
      }
      const newProduct = Object.assign({}, this.productItem);
      this.addNewProduct(newProduct);
      this.dialogFormVisible = false;
      this.reset(newProduct);
    },
    handleConfirm () {
      const id = this.productItem.productId;
      //  編輯，判斷 tableData 有無這筆資料
      if (this.stock.find((x) => x.productId === id)) {
        this.editConfirmation(id);
        return;
      }
      // 新增商品
      this.addProductConfirmation();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-container {
  height: 100vh;
  .el-button.add-btn {
    width: 100px;
    height: 60px;
    margin: 20px 0 0 20px;
  }
  .el-submenu .el-menu-item {
    padding: 0;
    font-size: 16px;
  }
  .el-dialog {
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
      button {
        margin-bottom: 10px;
      }
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
  .cell {
    font-size: 15px;
    text-align: center;
    color: rgba(0, 0, 0, 0.8);
    white-space: break-spaces !important;
    word-break: break-word;
  }

  .is-right {
    .cell {
      display: flex;
      justify-content: center;
      button {
        margin: 2px;
      }
    }
  }
}
</style>
