import Vue from 'vue';
import Vuex from 'vuex';
import moduleUsers from './modules/moduleUsers';
import moduleOrders from './modules/moduleOrders';
import moduleStock from './modules/moduleStock';

Vue.use(Vuex);

const createStore = () => {
  return new Vuex.Store({
    modules: {
      orders: moduleOrders,
      stock: moduleStock,
      users: moduleUsers,
    },
  });
};

export default createStore;
