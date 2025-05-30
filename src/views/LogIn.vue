<script setup>
import { reactive, ref, onMounted } from "vue";
import store from "@/stores/stores";
import AppFormFieId from "../components/AppFormFieId.vue";
import Modal from "../components/Teleport.vue";
import Loading from "../components/Loading.vue";

import { useRouter } from "vue-router";
const router = useRouter();

const logIn = async (data) => {
  try {
    isLoading.value = true;
    const success = await store.dispatch("logIn", {
      token: getGUID(),
      account: data["Account"],
      password: data["password"],
    });

    if (success) {
      router.push("/");
    } else {
      errorMsg.msg = "登入失敗";
      errorMsg.isShow = true;
    }
  } catch (error) {
    // alert("發生錯誤，請稍後再試！");
    errorMsg.msg = "發生錯誤，請稍後再試！";
    errorMsg.isShow = true;
  } finally {
    isLoading.value = false;
  }
};

const errorMsg = reactive({
  isShow: false,
  msg: "發生錯誤",
});

const errorMsgIsShowChenge = (isShow) => {
  errorMsg.isShow = isShow;
};

const test = (value) => {
  logIn(value);
  formRef1.value.resetForm();
};

const getGUID = () => {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
};

const formRef1 = ref(null);
const isLoading = ref(false);

onMounted(async () => {
  if (store.getters["isLogin"]) {
    await store.dispatch("logOut");
    if (window.confirm("登出成功")) {
      router.push("/");
    }
  }
});
</script>

<template>
  <VForm
    id="loginInForm"
    ref="formRef1"
    v-slot="{ errors, meta, resetForm }"
    @submit="test"
  >
    <AppFormFieId
      name="Account"
      label="帳號"
      rules="required"
      placeholder="任意輸入"
      :dynamicAttribute="{ autocomplete: 'current-account' }"
    ></AppFormFieId>
    <AppFormFieId
      name="password"
      label="密碼"
      rules="required"
      type="password"
      placeholder="請輸入密碼"
      :dynamicAttribute="{ autocomplete: 'current-password' }"
    ></AppFormFieId>
    <!-- <ErrorMessage name="password" /> -->
    <button type="submit">登入</button>
    <Loading v-show="isLoading" />
    <modal :show="errorMsg.isShow" @close="errorMsgIsShowChenge(false)">
      <template #header>
        <h3>系統提示</h3>
      </template>
      <template #body>
        <h3>{{ errorMsg.msg }}</h3>
      </template>
      <template #footer>
        <button @click="errorMsgIsShowChenge(false)">確認</button>
      </template>
    </modal>
  </VForm>
</template>

<style>
.main-content #loginInForm {
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  /* background: #1e1e1e; */
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  /* color: #fff; */
  font-family: "Segoe UI", sans-serif;
}

#loginInForm.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

#loginInForm label {
  margin-bottom: 0.4rem;
  font-weight: 600;
  /* color: #ccc; */
  font-size: 0.95rem;
}

#loginInForm input {
  width: 100%;
  padding: 0.6rem 0.9rem;
  border: 1px solid #444;
  border-radius: 6px;
  /* background: #2b2b2b; */
  /* color: #fff; */
  font-size: 1rem;
  transition: border-color 0.3s;
}

#loginInForm input:focus {
  border-color: #4db8ff;
  outline: none;
}

#loginInForm button[type="submit"] {
  width: 100%;
  padding: 0.8rem;
  background: #4db8ff;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 1rem;
}

#loginInForm button[type="submit"]:hover {
  background: #38a2e8;
}
</style>



