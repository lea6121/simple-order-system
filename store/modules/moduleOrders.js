const moduleOrders = {
  state: [
    {
      id: '1345939751756',
      userId: '1634610239468',
      username: 'nana0503',
      products: [
        {
          id: '211201',
          name: '鹿谷綠茶',
          price: '300',
          quantity: '10',
        },
        {
          id: '211205',
          name: '擂茶',
          price: '200',
          quantity: '20',
        },
      ],
      remark: '我是備註 1',
    },
    {
      id: '1345939751044',
      userId: '1636439154865',
      username: 'eren3003',
      products: [
        {
          id: '211204',
          name: '阿里山烏龍',
          price: '600',
          quantity: '10',
        },
      ],
      remark: '我是備註 2',
    },
    {
      id: '1309939751044',
      userId: '1632981454063',
      username: 'cici2512',
      products: [
        {
          id: '211208',
          name: '英倫伯爵',
          price: '130',
          quantity: '5',
        },
        {
          id: '211210',
          name: '黑茶',
          price: '110',
          quantity: '10',
        },
      ],
      remark: '我是備註 3',
    },
  ],
  actions: {
    addNewOrder (context, data) {
      context.commit('ADD_NEW_ORDER', data);
    },
    deleteOrder (context, index) {
      context.commit('DELETE_ORDER', index);
    },
    modifyOrder (context, data) {
      context.commit('MODIFY_ORDER', data);
    },
  },
  mutations: {
    ADD_NEW_ORDER (state, payload) {
      state.push(payload);
    },
    DELETE_ORDER (state, payload) {
      state.splice(payload, 1);
    },
    MODIFY_ORDER (state, payload) {
      const index = state.findIndex((x) => x.id === payload.id);
      state.splice(index, 1, payload);
    },
  },
};

export default moduleOrders;
