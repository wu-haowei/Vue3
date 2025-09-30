
<template>
  <div>
    <button @click="isSignUp = !isSignUp">
      <span v-text="getIsSignUpText"></span>
    </button>
    <VForm
      id="loginInForm"
      ref="loginInRef"
      v-slot="{ errors, meta, resetForm }"
      @submit="test"
    >
      <AppFormFieId
        name="Account"
        label="帳號"
        errLabel="帳號"
        rules="required"
        placeholder="請輸入 帳號"
        :dynamicAttribute="{ autocomplete: 'current-account' }"
      ></AppFormFieId>
      <AppFormFieId
        v-if="!isSignUp"
        name="password"
        label="密碼"
        errLabel="密碼"
        rules="required"
        type="password"
        placeholder="請輸入 密碼"
        :dynamicAttribute="{ autocomplete: 'current-password' }"
      >
      </AppFormFieId>

      <div style="text-align: right">
        <a
          v-show="!isSignUp"
          href="javascript:void(0);"
          @click.prevent="forgetPassword.isShow = true"
          >忘記密碼</a
        >
      </div>

      <AppFormFieId
        v-if="isSignUp"
        name="email"
        label="Email"
        errLabel="Email"
        rules="required"
        placeholder="請輸入 Email"
        :dynamicAttribute="{ autocomplete: 'current-email' }"
      ></AppFormFieId>

      <button type="submit" v-text="getIsSignUpText"></button>
      <button @click.stop.prevent="loginWithFido">Fido登入</button>
    </VForm>

    <!-- <button @click="getSession">GET Session</button> -->
    <!-- <button @click="setSession">SET Session</button> -->

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

    <modal :show="isValidEmail.isShow">
      <template #header>
        <h3>QRCode</h3>
      </template>
      <template #body>
        <!-- <h3>{{ errorMsg.msg }}</h3> -->
        <img
          :src="isValidEmail.image"
          v-if="isValidEmail.image"
          width="100%"
          alt="2FA image"
        />
        <h3 v-else>{{ isValidEmail.msg }}</h3>
      </template>
      <template #footer>
        <button @click="isValidEmail.isShow = false">確認</button>
      </template>
    </modal>

    <modal :show="forgetPassword.isShow" :width="'200px'" :height="'20vh'">
      <template #header>
        <h3>忘記密碼</h3>
      </template>
      <template #body>
        <VForm
          id="forgetPassworForm"
          ref="forgetPasswordRef"
          v-slot="{ errors, meta, resetForm }"
          @submit="forgetPasswordTest"
        >
          <AppFormFieId
            name="ForgetAccount"
            label="帳號"
            errLabel="帳號"
            rules="required"
            placeholder="請輸入 帳號"
            :dynamicAttribute="{ autocomplete: 'current-forgetaccount' }"
          ></AppFormFieId>

          <button type="submit" v-show="false" ref="forgetPasswordSubmitRef">
            確認
          </button>
        </VForm>
      </template>
      <template #footer>
        <div style="display: flex; justify-content: flex-end; flex-wrap: wrap">
          <button @click="forgetPasswordSubmitRefClick">確認</button>
          <button @click="forgetPassword.isShow = false">關閉</button>
        </div>
      </template>
    </modal>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
import axios from "axios";
import store from "@/stores/stores";
import AppFormFieId from "../components/AppFormFieId.vue";
import Modal from "../components/Teleport.vue";
import Loading from "../components/Loading.vue";
import { useRouter, useRoute } from "vue-router";
import { LoginService } from "@/services/LoginService";
const loginService = new LoginService();
import common from "@/components/common";

const route = useRoute();
const router = useRouter();

const errorMsg = reactive({
  isShow: false,
  msg: "發生錯誤",
});
const isSignUp = ref(false);
const isValidEmail = reactive({
  isShow: false,
  image: "",
  msg: "錯誤",
});

const forgetPassword = reactive({
  isShow: false,
  msg: "錯誤",
});
const loginInRef = ref(null);
const forgetPasswordRef = ref(null);
const forgetPasswordSubmitRef = ref(null);

const isLoading = ref(false);

const getIsSignUpText = computed(() => {
  return isSignUp.value ? "註冊" : "登入";
});

const getSession = async (data) => {
  const A = await loginService.getSession();
  alert(JSON.stringify(A));
};

const setSession = async (data) => {
  const B = await loginService.setSession();
  alert(JSON.stringify(B));
};

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

const setLog = (context) => {
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

const arrayBufferToBase64Url = (buffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const loginWithFido = async (data) => {
  try {
    isLoading.value = true;

    if (store.getters["getFido2User"]) {
      throw new Error("尚未設定Fido2使用者");
    }

    const resLogin = await loginService.GetLoginChallenge(
      store.getters["getFido2User"]
    );

    if (!resLogin.data.result.success) {
      throw new Error(resLogin.data.result.message);
    }

    const challengeData =
      typeof resLogin.data.data === "object"
        ? resLogin.data.data
        : JSON.parse(resLogin.data.data);
    // 2️⃣ 呼叫 WebAuthn API
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge: base64UrlToBytes(challengeData.challenge),
        allowCredentials: challengeData.allowCredentials.map((cred) => ({
          id: base64UrlToBytes(cred.id),
          type: "public-key",
        })),
        userVerification: "required",
      },
    });

    const attestationResponse = {
      id: credential.id,
      rawId: arrayBufferToBase64Url(credential.rawId), // ✅ Base64Url string
      type: credential.type,
      response: {
        clientDataJSON: arrayBufferToBase64Url(
          credential.response.clientDataJSON
        ),
        authenticatorData: arrayBufferToBase64Url(
          credential.response.authenticatorData
        ),
        signature: arrayBufferToBase64Url(credential.response.signature),
        userHandle: credential.response.userHandle
          ? arrayBufferToBase64Url(credential.response.userHandle)
          : null,
        attestationObject: credential.response.attestationObject
          ? arrayBufferToBase64Url(credential.response.attestationObject)
          : null,
      },
      extensions: credential.getClientExtensionResults?.() || {},
    };

    const resVerify = await loginService.VerifyLogin(attestationResponse);
    if (!resVerify.result.success) {
      throw new Error(resVerify.result.message);
    } else {
      const success = await store.dispatch("logInToFido", {
        ...resVerify,
        account: store.getters["getFido2User"],
      });
      if (success) {
        router.push("/");
      } else {
        errorMsg.msg = "Fido 登入失敗";
        errorMsg.isShow = true;
      }
    }
  } catch (err) {
    if (err instanceof DOMException) {
      console.log("WebAuthn 錯誤:", err.message);
      alert(`WebAuthn 錯誤:${err.message}`);
    } else if (err.response) {
      console.log("API 錯誤:", err.message);
      alert(`API 錯誤:${err.message}`);
    } else {
      console.log("錯誤:", err.message);
      alert(`錯誤:${err.message}`);
    }
  } finally {
    isLoading.value = false;
  }
};

const base64UrlToBytes = (base64url) => {
  base64url = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64url.length % 4) base64url += "=";
  return Uint8Array.from(atob(base64url), (c) => c.charCodeAt(0));
};

const signUp = async (data) => {
  try {
    isLoading.value = true;

    loginService
      .SignUp({
        token: getGUID(),
        account: data["Account"],
        password: getGUID(),
        email: data["email"],
      })
      .then(async (res) => {
        errorMsg.msg = res.result.message;
        errorMsg.isShow = true;
      })
      .catch((error) => {
        errorMsg.msg = "發生錯誤，請稍後再試！";
        errorMsg.isShow = true;
      })
      .finally(() => {
        isLoading.value = false;
      });
  } catch (error) {
    // alert("發生錯誤，請稍後再試！");
    errorMsg.msg = "發生錯誤，請稍後再試！";
    errorMsg.isShow = true;
  } finally {
    isLoading.value = false;
  }
};

const forgetPasswordSubmitRefClick = async () => {
  forgetPasswordSubmitRef.value.click();
};

const forgetPasswordTest = async (value) => {
  isLoading.value = true;
  loginService
    .ForgetPassword(value["ForgetAccount"])
    .then(async (res) => {
      if (res.result.success) {
        forgetPassword.isShow = false;
        proxy.$toast.success(`${res.result.message}`, 1500);
      } else {
        proxy.$toast.warning(`${res.result.message}`, 3000);
      }
    })
    .catch((error) => {
      proxy.$toast.error(`${error.response.data.message}`, 4500);
    })
    .finally(() => {
      forgetPasswordRef.value.resetForm();
      isLoading.value = false;
    });
};
const errorMsgIsShowChenge = (isShow) => {
  errorMsg.isShow = isShow;
};
const test = (value) => {
  if (!isSignUp.value) {
    logIn(value);
  } else {
    signUp(value);
  }
  loginInRef.value.resetForm();
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

onMounted(async () => {
  if (store.getters["isLogin"]) {
    await store.dispatch("logOut");
    if (window.confirm("登出成功")) {
      router.push("/");
    }
  }
  if (route.query.user && route.query.passcode) {
    loginService
      .ValidEmail({ user: route.query.user, passcode: route.query.passcode })
      .then(async (res) => {
        isValidEmail.isShow = true;
        if (res.result.success) {
          isValidEmail.image = res.data.isTwoFactorImg;
        } else {
          isValidEmail.msg = res.result.message;
        }
      })
      .catch((error) => {});
  } else {
    isValidEmail.isShow = false;
    isValidEmail.image = "";
    isValidEmail.msg = "";
  }
});
</script>


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



