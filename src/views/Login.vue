<template>
  <a-form-model ref="form" :model="form">
    <a-form-model-item label="用户名" prop="account">
      <a-input v-model="form.account" placeholder="请输入用户名"></a-input>
    </a-form-model-item>
    <a-form-model-item label="密码" prop="password">
      <a-input
        v-model="form.password"
        placeholder="请输入密码"
        show-password
      ></a-input>
    </a-form-model-item>
    <a-form-model-item>
      <a-button
        type="primary"
        @click="login"
        :loading="submitting"
        autofocus
        style="width: 100%;"
        >登录
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>
<script>
import loginService from "../service/loginService";

export default {
  data: function() {
    return {
      form: {
        account: "joyce",
        password: "00000000"
      },
      submitting: false
    };
  },
  methods: {
    login: async function() {
      this.submitting = true;
      let resp = await loginService.login(
        this.form.account,
        this.form.password
      );
      this.submitting = false;
      if (!resp.data.success) {
        return;
      }

      this.$router.app.$emit("login");
    }
  }
};
</script>
