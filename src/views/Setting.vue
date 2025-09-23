
<template>
  <div>
    設定 <button @click="GetRegisterChallenge">開啟無密碼登入功能</button>
  </div>
</template>




<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { LoginService } from "@/services/LoginService";
const loginService = new LoginService();

const GetRegisterChallenge = async () => {
  try {
    console.log("開始註冊無密碼登入");

    // 1. 向後端要註冊挑戰 (options)
    const res1 = await loginService.GetRegisterChallenge();

    // 2. 將 Base64Url 轉換成 ArrayBuffer (因為 navigator.credentials 需要)

    const options = JSON.parse(res1.data);

    options.challenge = base64urlToArrayBuffer(options.challenge);
    options.user.id = new TextEncoder().encode(options.user.id);

    // 3. 呼叫 WebAuthn API (瀏覽器處理金鑰建立)
    const credential = await navigator.credentials.create({
      publicKey: options,
    });

    if (!credential) {
      alert("憑證建立失敗");
      return;
    }

    // 4. 打包 credential 傳回後端
    const attestationResponse = {
      id: credential.id,
      rawId: arrayBufferToBase64Url(credential.rawId),
      type: credential.type,
      response: {
        clientDataJSON: arrayBufferToBase64Url(
          credential.response.clientDataJSON
        ),
        attestationObject: arrayBufferToBase64Url(
          credential.response.attestationObject
        ),
      },
    };

    const res = await loginService.VerifyRegister(attestationResponse);
    console.alert("註冊結果:", res);
  } catch (err) {
    console.alert("註冊失敗:", err);
  }
};

const base64urlToArrayBuffer = (base64url) => {
  const padding = "=".repeat((4 - (base64url.length % 4)) % 4);
  const base64 = (base64url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) {
    view[i] = raw.charCodeAt(i);
  }
  return buffer;
};

const arrayBufferToBase64Url = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = window.btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
};
</script>
