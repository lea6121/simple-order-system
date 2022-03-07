<template lang="pug">
div
  .home
    .wrapper
      img(alt='Vue logo' src='../assets/logo.png')
      h1 簡易訂單系統
      el-button(plain='' @click='goToList') 進入後台
</template>
<script>
export default {
  name: 'IndexPage',
  methods: {
    goToList() {
      this.$router.push('/admin/orders');
    },
  },
};
</script>
<style lang="scss">
.home {
  background: rgba(0, 0, 0, 0.9);
  height: 100vh;
  position: relative;

  .wrapper {
    width: 100%;
    text-align: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    img {
      display: block;
      margin: 0 auto;
    }
    h1 {
      font-size: 36px;
      padding: 30px 0 40px;
      color: white;
    }
    .el-button {
      font-size: 22px;
      padding: 22px;
      display: block;
      margin: 0 auto;
    }
  }
}
</style>
