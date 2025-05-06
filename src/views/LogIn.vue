<script setup>
import { ref } from "vue";
import store from "@/stores/stores";
import AppFormFieId from "../components/AppFormFieId.vue";

import { useRouter } from "vue-router";
const router = useRouter();

const logIn = async (data) => {
  const success = await store.dispatch("logIn", {
    token: getGUID(),
    account: data["Account"],
    password: data["password"],
  });
  if (success) {
    router.push("/");
  } else {
    alert("登入失敗");
  }
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
      lable="帳號"
      rules="required"
      placeholder="任意輸入"
    ></AppFormFieId>
    <AppFormFieId
      name="password"
      lable="密碼"
      rules="required"
      type="password"
      placeholder="請輸入密碼"
    ></AppFormFieId>
    <!-- <ErrorMessage name="password" /> -->
    <button type="submit">登入</button>
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
  color: #fff;
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
  color: #fff;
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



