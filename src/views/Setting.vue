
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
    // 1. 向後端要註冊挑戰 (options)
    const resRegister = await loginService.GetRegisterChallenge();

    // 2. 將 Base64Url 轉換成 ArrayBuffer (因為 navigator.credentials 需要)
    if (!resRegister.data.result.success) {
      throw new Error(resRegister.data.result.message);
    }
    const options =
      typeof resRegister.data.data === "object"
        ? resRegister.data.data
        : JSON.parse(resRegister.data.data);

    options.challenge = base64urlToArrayBuffer(options.challenge);
    options.user.id = new TextEncoder().encode(options.user.id);

    // 3. 呼叫 WebAuthn API (瀏覽器處理金鑰建立)
    const credential = await navigator.credentials.create({
      publicKey: options,
    });

    if (!credential) {
      throw new Error("憑證建立失敗");
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
        transports: ["usb"],
      },
      clientExtensionResults: {
        "example.extension.bool": true,
        appid: true,
        exts: ["string"],
      },
    };
    alert("憑證已建立", JSON.stringify(attestationResponse));
    const resVerify = await loginService.VerifyRegister(attestationResponse);

    if (!resVerify.data.result.success) {
      throw new Error(resVerify.data.result.message);
    } else {
      alert("註冊結果:", resVerify.data.data);
    }
  } catch (err) {
    console.log("註冊失敗:", err);
    alert(`註冊失敗:${err.message}`);
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
