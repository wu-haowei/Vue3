
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
    const resVerify = await loginService.VerifyRegister(attestationResponse);
    if (!resVerify.result.success) {
      throw new Error(resVerify.result.message);
    } else {
      alert("註冊結果:", resVerify.data);
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
