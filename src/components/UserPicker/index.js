import UserPickerVue from './index.vue';

const UserPicker = {};
UserPicker.install = function (Vue, options) {
  const UserPickerInstance = Vue.extend(UserPickerVue);
  let instance;
  Vue.prototype.$userPicker = {
    show () {
      if (!instance) {
        instance = new UserPickerInstance();
        let msgBoxEl = instance.$mount().$el;
        document.body.appendChild(msgBoxEl);
      }
      return instance.show();
    }
  };
};
export default UserPicker;