<p>{{ message }}</p>;
export default {
  data() {
    return {
      messag: 'zhangli', // 会触发get
      city: 'beijing' // 不会触发get 因为模板没用到，即和视图没关系
    };
  }
};
