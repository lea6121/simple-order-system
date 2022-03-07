const moduleStock = {
  state: [
    {
      productId: '211201',
      productName: '鹿谷綠茶',
      stock: '20',
      price: '300',
    },
    {
      productId: '211202',
      productName: '東方美人',
      stock: '20',
      price: '400',
    },
    {
      productId: '211203',
      productName: '閃亮的日子',
      stock: '20',
      price: '500',
    },
    {
      productId: '211204',
      productName: '阿里山烏龍',
      stock: '20',
      price: '600',
    },
    {
      productId: '211205',
      productName: '擂茶',
      stock: '20',
      price: '200',
    },
    {
      productId: '211206',
      productName: '月朦朧鳥朦朧',
      stock: '20',
      price: '230',
    },
    {
      productId: '211207',
      productName: '紅茶',
      stock: '20',
      price: '120',
    },
    {
      productId: '211208',
      productName: '英倫伯爵',
      stock: '20',
      price: '130',
    },
    {
      productId: '211209',
      productName: '麥茶',
      stock: '20',
      price: '100',
    },
    {
      productId: '211210',
      productName: '黑茶',
      stock: '20',
      price: '110',
    },
  ],
  actions: {
    addNewProduct (context, data) {
      context.commit('ADD_NEW_PRODUCT', data);
    },
    deleteProduct (context, index) {
      context.commit('DELETE_PRODUCT', index);
    },
    modifyProduct (context, data) {
      context.commit('MODIFY_PRODUCT', data);
    },
  },
  mutations: {
    ADD_NEW_PRODUCT (state, payload) {
      state.push(payload);
    },
    DELETE_PRODUCT (state, payload) {
      state.splice(payload, 1);
    },
    MODIFY_PRODUCT (state, payload) {
      const index = state.findIndex((x) => x.productId === payload.productId);
      state.splice(index, 1, payload);
    },
  },
};

export default moduleStock;
