
<template>
  <div>
    設定
    <button
      @click="GetRegisterChallenge"
      v-text="isOpenFidoText"
      :style="{ backgroundColor: isOpenFido ? 'red' : '' }"
    ></button>
  </div>
</template>




<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { LoginService } from "@/services/LoginService";
const loginService = new LoginService();
import store from "@/stores/stores";

const isOpenFido = computed(() => {
  return store.getters["getFido2User"] || false;
});

const getAccount = computed(() => {
  return store.getters["getAccount"];
});

const isOpenFidoText = computed(() => {
  return isOpenFido.value ? "關閉無密碼登入功能" : "開啟無密碼登入功能";
});

const GetRegisterChallenge = async () => {
  try {
    if (isOpenFido.value) {
      const result = await store.dispatch("fidoUser", false);
      alert(`${result.message}`);
      return;
    }

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
      // string  credential 的唯一標識符，通常由 authenticator（安全金鑰或裝置）生成，用於後端辨識這個憑證。
      id: credential.id,
      // Base64Url 編碼的 ArrayBuffer  credential 的原始二進位資料，與 id 對應。前端需要轉成 Base64Url 才能傳到後端。
      rawId: arrayBufferToBase64Url(credential.rawId),
      //credential 類型，通常是 "public-key"，表示這是一個公鑰憑證。
      type: credential.type,
      response: {
        //rrayBuffer → Base64Url 包含前端產生的 challenge、origin 等資料，用來防止重放攻擊。
        clientDataJSON: arrayBufferToBase64Url(
          credential.response.clientDataJSON
        ),
        //公鑰資訊 & 憑證資料（attestation）& 生成時間
        attestationObject: arrayBufferToBase64Url(
          credential.response.attestationObject
        ),
        //告訴後端此 credential 支援的傳輸方式
        transports: credential.response.getTransports?.() || [],
      },
      clientExtensionResults: {
        "example.extension.bool": true,
        //如果有使用 FIDO AppID extension，回傳結果
        appid: true,
        //其他自訂 extension 的回傳資料
        exts: ["string"],
      },
    };
    const resVerify = await loginService.VerifyRegister(attestationResponse);
    if (!resVerify.result.success) {
      throw new Error(resVerify.result.message);
    } else {
      const result = await store.dispatch("fidoUser", true);
      if (result.success) {
        const userData = {
          name: getAccount.value,
          fido2User: isOpenFido.value ?? null,
        };
        localStorage.setItem("FidoUser", JSON.stringify(userData));
        alert(`${result.message}`);
      } else {
        throw new Error(result.message);
      }
    }
  } catch (err) {
    console.log("註冊失敗:", err);
    alert(`註冊失敗:${err.message}`);
  }
};

const Log = (context) => {
  context = typeof context === "object" ? context : { data: context };

  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "secret_9NejvGIL0JuF4W4DXFHjs6yHynP08jvfsmB31rCR4fs"
  );
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Notion-Version", "2022-06-28");
  myHeaders.append(
    "Cookie",
    "__cf_bm=rz3pMeF1XDHnR16z.fa1YXuD5WF_9ILdjZ_P0_dnW6E-1758674431-1.0.1.1-R6ve2RsU7fLT6BkFCCIaWrQZvUogvffKSLukGIvguFgGMsUyZ7wx3_gKxCq_WwQywt22sJqrnflOdsZjkPzpcWzckq3aTA36KGh67fIdtr0; _cfuvid=o16W6IVBfzEhqOnM0DqCyPqUCt96yxdtAgMaeHsm5zg-1758674431053-0.0.1.1-604800000"
  );

  const raw = JSON.stringify({
    parent: {
      database_id: "1fc6e8820960808db9e2cb83cb19e0c5",
    },
    icon: {
      emoji: "🥬",
    },
    cover: {
      external: {
        url: "https://upload.wikimedia.org/wikipedia/commons/6/62/Tuscankale.jpg",
      },
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: "C",
            },
          },
        ],
      },
      ENDPOINT: {
        rich_text: [
          {
            text: {
              content: JSON.stringify(context),
            },
          },
        ],
      },
    },
    children: [
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "Lacinato kale",
              },
            },
          ],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content:
                  "Lacinato kale is a variety of kale with a long tradition in Italian cuisine, especially that of Tuscany. It is also known as Tuscan kale, Italian kale, dinosaur kale, kale, flat back kale, palm tree kale, or black Tuscan palm.",
                link: {
                  url: "https://en.wikipedia.org/wiki/Lacinato_kale",
                },
              },
            },
          ],
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(
    "https://h-web-api-a2gvavdbg9dggxa3.canadacentral-01.azurewebsites.net/api/Toolbox/ProxyAPI?Url=https://api.notion.com/v1/pages",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
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
