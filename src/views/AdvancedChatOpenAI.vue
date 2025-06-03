<template>
  <!-- <div :style="backgroundStyle">歡迎使用...</div> -->
  <div style="width: 80%; margin: auto; padding-top: 3em">
    <!-- <a href="https://ai.google.dev/gemini-api/docs">gemini-api</a> -->
    <p>
      歡迎使用 AI 聊天室 【測試功能，資料僅供參考】
      <!-- {{ sUserName }} -->
    </p>
    <!-- {{ sOnlineUser }} -->

    <label for="aimodel">使用模型：</label>
    <select v-model="selectModel" id="aimodel" @change="GetAIModelLog">
      <option :value="item.key" :key="item.key" v-for="item of aiModel">
        {{ item.value }}
      </option>
    </select>
    <div>
      <vue-advanced-chat
        v-if="isShow"
        :theme="'dark'"
        height="calc(80vh - 20px)"
        w="calc(80vh - 20px)"
        :current-user-id="currentUserId"
        :rooms="JSON.stringify(rooms)"
        :rooms-loaded="false"
        :single-room="true"
        :messages="JSON.stringify(messages)"
        :messages-loaded="messagesLoaded"
        :show-files="isShowFiles"
        :show-audio="false"
        :show-emojis="false"
        :show-reaction-emojis="false"
        :emojis-suggestion-enabled="false"
        @send-message="sendMessage"
        @fetch-messages="fetchMessages"
        @open-file="openFile($event.detail[0])"
        @send-message-reaction="sendMessageReaction($event.detail[0])"
        @edit-message="editMessage($event.detail[0])"
        accepted-files="image/png, image/jpeg"
      />
    </div>
  </div>
</template>



<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  nextTick,
  defineOptions,
} from "vue";

// https://github.com/advanced-chat/vue-advanced-chat?tab=readme-ov-file
// https://github.com/advanced-chat/vue-advanced-chat-sandbox
import { register } from "vue-advanced-chat";
import { GoogleGenerativeAI } from "@google/generative-ai";
// https://www.npmjs.com/package/openai
import OpenAI from "openai";
import common from "@/components/common";
import { AIService } from "@/services/AIService";
const aIService = new AIService();
// import { useAuthStore } from "@/store/modules/useAuth";
// const { semployeeNo, sUserName, sOnlineUser } = useAuthStore();
register();
defineOptions({
  name: "userIndex",
  components: {},
});

// 定義響應式變數
const currentUserId = ref("1234");
const isShow = ref(true);

// const rooms = ref([
//   {
//     roomId: "1",
//     roomName: "AI-Room",
//     avatar:
//       "https://fastly.picsum.photos/id/442/300/200.jpg?hmac=SkMgVWKoCjI_XAr2hj-_S-LAHQAqisJGmdlszEfjSE0",
//     users: [
//       { _id: "1234", username: sUserName },
//       { _id: "4321", username: "Gemini" },
//     ],
//     typingUsers: [],
//   },
// ]);

const rooms = ref([]);

const messages = ref([]);
const messagesLoaded = ref(false);
const selectModel = ref("gemini-2.5-flash-preview-04-17");

const aiModel = reactive([
  { key: "gemini-2.5-flash-preview-04-17", value: "2.5 flash-04-17-preview" },
  { key: "gemini-2.5-pro-exp-03-25", value: "2.5 Pro-03-25-preview" },
  { key: "gemini-2.0-flash", value: "2.0-flash" },
  {
    key: "gemini-2.0-flash-exp-image-generation",
    value: "2.0-flash-image",
  },
  { key: "gemini-1.5-flash", value: "1.5-flash" },
  { key: "gpt-4o-mini", value: "gpt-4o-mini" },
]);
const isShowFiles = computed(() => {
  return false; // selectModel.value == "gemini-2.0-flash-exp-image-generation";
});

// 模擬獲取資訊
const fetchMessages = (event) => {
  GetAIModelLog()
    .then(() => {})
    .catch(() => {})
    .finally(() => {
      messagesLoaded.value = true;
    });
};

const GetAIModelLog = () => {
  messages.value = [];
  return new Promise(async (resolve, reject) => {
    aIService
      .GetAIModelLog(selectModel.value)
      .then(async (res) => {
        if (res.result.success) {
          JSON.parse(res.data).forEach((f) => {
            const context = {
              _id: f.ID,
              content: `${f.Text}`,
              senderId: f.Person == "AI" ? "4321" : "1234",
              username: f.Person,
              date: new Date(f.Date).toDateString(),
              timestamp: new Date(f.Date).toString().substring(16, 21),
              reactions: {},
              files: [],
            };
            messages.value = [...messages.value, context];
          });
          resolve(true);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// 產生訊息
const addMessages = async (
  data = { text: "預設訊息", image: [] },
  reset = false
) => {
  const newMessages = [];
  const uploadedFiles = await Promise.all(
    (data.image || []).map(async (f) => ({
      // localUrl: base64ToBlobUrl(data.image.url, data.image.type),
      name: f.name,
      type: f.type,
      url: await UploadImage(base64ToBlobUrl(f.url)),
    }))
  );

  newMessages.push({
    _id: messages.value.length + 1,
    content: `${data.text}`,
    senderId: "4321",
    username: "AI",
    date: new Date().toDateString(),
    timestamp: new Date().toString().substring(16, 21),
    reactions: {}, // 預設無表情符號
    files: uploadedFiles,
  });
  await aIService
    .MessageSave({
      Model: selectModel.value,
      Person: "AI",
      Text: data.text,
      Files: "",
    })
    .then(async (res) => {})
    .catch((error) => {
      console.error("Error：", error);
    });

  return newMessages;
};
// 產生檔案
const openFile = ({ file }) => {
  window.open(file.file.localUrl, "_blank");
};

watch(selectModel, (newVal) => {
  history.value = [];
});

const sendMessageReaction = async ({ reaction, remove, messageId, roomId }) => {
  // const message = messages.value.find((msg) => msg._id === messageId);
};
const useTime = ref(null);
// 傳送訊息
const sendMessage = async (event) => {
  // console.log("sendMessage", event);

  const message = event.detail[0];

  const uploadedFiles = await Promise.all(
    (message.files || []).map(async (f) => ({
      ...f,
      url: await UploadImage(f.localUrl),
    }))
  );
  messages.value.push({
    _id: messages.value.length + 1,
    content: message.content,
    senderId: currentUserId.value,
    timestamp: new Date().toString().substring(16, 21),
    date: new Date().toDateString(),
    files: uploadedFiles,
    reactions: {}, // 預設無表情符號
  });

  aIService
    .MessageSave({
      Model: selectModel.value,
      Person: "USER",
      Text: message.content,
      Files: "",
    })
    .then(async (res) => {})
    .catch((error) => {
      console.error("Error：", error);
    });

  rooms.value[0].typingUsers.push("4321");
  useTime.value = new Date().getTime();

  if (selectModel.value === "gpt-4o-mini") {
    OpenAIModel(message, uploadedFiles);
  } else {
    GeminiAIModel(message, uploadedFiles);
  }
};

const OpenAIModel = async (message, uploadedFiles) => {
  const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI,
    dangerouslyAllowBrowser: true,
  });

  try {
    let inputList = [];
    inputList.push({ role: "user", content: `${message.content}` });

    if (uploadedFiles?.length > 0) {
      uploadedFiles.forEach((file) => {
        inputList.push({
          role: "user",
          content: [
            {
              type: "input_image",
              image_url: file.url,
            },
          ],
        });
      });
    }

    const response = await client.responses.create({
      model: selectModel.value,
      instructions: `You are a very creative writer. 【UserID:${"semployeeNo"}】`,
      input: inputList,
    });
    const context = {
      text: `${`${response.output_text} \n\n【使用:${
        (new Date().getTime() - useTime.value) / 1000
      }s】`}`,
      image: [],
    };
    messages.value = [...messages.value, ...(await addMessages(context))];
  } catch (error) {
    let errMsg = "";
    if (
      error.status == 400 ||
      error.status == 401 ||
      error.status == 402 ||
      error.status == 403 ||
      error.status == 404
    ) {
      errMsg = `請檢查輸入內容是否正確，${error.message}`;
    } else if (
      error.status == 500 ||
      error.status == 501 ||
      error.status == 502 ||
      error.status == 503
    ) {
      errMsg = "伺服器忙碌，請稍後再試";
    }
    messages.value = [
      ...messages.value,
      ...(await addMessages({
        text: `${`${errMsg}，狀態碼:${error.status} \n\n【使用:${
          (new Date().getTime() - useTime.value) / 1000
        }s】`}`,
        image: [],
      })),
    ];
  } finally {
    rooms.value[0].typingUsers = rooms.value[0].typingUsers.filter(
      (f) => f != "4321"
    );
  }
};

const history = ref([]);

const GeminiAIModel = async (message, uploadedFiles = []) => {
  const raw = JSON.stringify({
    contents: [
      {
        // 【Reply in the same language, except for the translation. If the reply language is Chinese, please use Traditional Chinese.】
        parts:
          uploadedFiles.length > 0
            ? [
                {
                  text: `${message.content}`,
                },
                {
                  inlineData: {
                    mimeType: "image/png",
                    data: await blobUrlToBase64(uploadedFiles[0].localUrl),
                  },
                },
              ]
            : [
                {
                  text: `${message.content}`,
                },
              ],
      },
    ],
    history: history,
  });
  if (message.content != "") {
    history.value.push({
      role: "user",
      parts: [{ text: message.content }],
    });
  }

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI);

  const model = genAI.getGenerativeModel({
    model: selectModel.value,
    generationConfig: {
      responseModalities:
        selectModel.value == "gemini-2.0-flash-exp-image-generation"
          ? ["Text", "Image"]
          : "Text",
    },
  });
  try {
    const result = await model.generateContent(raw);

    const images =
      result.response.candidates[0]?.content?.parts
        .filter((p) => p.inlineData?.data) // 只取有圖片的部分
        .map((p, index) => ({
          url: `data:${p.inlineData.mimeType};base64,${p.inlineData.data}`,
          name: `回應圖片${index + 1}`,
          type: p.inlineData.mimeType,
        })) || [];

    const context = {
      text: `${`${result.response.text()} \n\n【回應秒數:${
        (new Date().getTime() - useTime.value) / 1000
      }】`}`,
      image: images,
    };

    if (result.response?.text()) {
      history.value.push({
        role: "model",
        parts: [{ text: result.response.text() }],
      });
    }
    messages.value = [...messages.value, ...(await addMessages(context))];
    // rooms.value[0].typingUsers = rooms.value[0].typingUsers.filter(
    //   (f) => f != "4321"
    // );
  } catch (error) {
    let errMsg = "";
    if (
      error.status == 400 ||
      error.status == 401 ||
      error.status == 402 ||
      error.status == 403 ||
      error.status == 404 ||
      error.status == 429 //超過使用量
    ) {
      errMsg = `請檢查輸入內容是否正確，${error.message}`;
    } else if (
      error.status == 500 ||
      error.status == 501 ||
      error.status == 502 ||
      error.status == 503
    ) {
      errMsg = "伺服器忙碌，請稍後再試";
    } else {
      errMsg = `其他問題，${error.message}`;
    }

    messages.value = [
      ...messages.value,
      ...(await addMessages({
        text: `${`${errMsg}，狀態碼:${error.status} \n\n【回應秒數:${
          (new Date().getTime() - useTime.value) / 1000
        }】`}`,
        image: [],
      })),
    ];
  } finally {
    rooms.value[0].typingUsers = rooms.value[0].typingUsers.filter(
      (f) => f != "4321"
    );
  }
};

const UploadImage = (localUrl) => {
  return new Promise(async (resolve, reject) => {
    try {
      let base64Image = await blobUrlToBase64(localUrl);
      const getGUID = common.generateGUID();
      const file = base64ToFile(base64Image, getGUID);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("album", "zoDJLqZ");
      formData.append("type", file.name?.split(".").pop() || "");
      formData.append("description", "semployeeNo");
      formData.append("title", "title");
      formData.append("name", file.name);
      fetch(
        "http://192.168.0.167:8789/api/EIP/SetOrderTable?url=https://api.imgur.com/3/image",
        {
          method: "POST",
          headers: {},
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((res) => resolve(res.data.link));
    } catch (err) {
      reject(err);
    }
  });
};

const base64ToFile = (base64, filename) => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);

  const mimeTypes = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "image/bmp": "bmp",
  };
  filename = `${filename}.${mimeTypes[mime]}` || `${filename}.txt`;

  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};
const blobUrlToBase64 = async (blobUrl) => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); // result 是 base64
    reader.onerror = reject;
    reader.readAsDataURL(blob); // 轉 base64
  });
};

const base64ToBlobUrl = (base64, mimeType = "application/octet-stream") => {
  const byteCharacters = atob(base64.split(",")[1]); // 去掉 data:<type>;base64, 的前綴
  const byteNumbers = new Array(byteCharacters.length)
    .fill()
    .map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  const blobUrl = URL.createObjectURL(blob);
  // console.log("blobUrl", blobUrl);
  return blobUrl;
};

onMounted(() => {
  // sOnlineUser.forEach((element, index) => {
  //   rooms.value.push({
  //     roomId: (index + 2).toString(),
  //     roomName: `${element}-Room`,
  //     avatar:
  //       "https://fastly.picsum.photos/id/442/300/200.jpg?hmac=SkMgVWKoCjI_XAr2hj-_S-LAHQAqisJGmdlszEfjSE0",
  //     users: [
  //       { _id: "1234", username: sUserName },
  //       { _id: "5555", username: element },
  //     ],
  //     typingUsers: [],
  //   });
  // });
  rooms.value.push({
    roomId: "1",
    roomName: "AI-Room",
    avatar:
      "https://fastly.picsum.photos/id/442/300/200.jpg?hmac=SkMgVWKoCjI_XAr2hj-_S-LAHQAqisJGmdlszEfjSE0",
    users: [
      { _id: "1234", username: "USER" },
      { _id: "4321", username: "AI" },
    ],
    typingUsers: [],
  });
});
onUnmounted(() => {});

onActivated(() => {
  isShow.value = true;
});

onDeactivated(() => {
  isShow.value = false;
});
// 新訊息測試
// const addNewMessage = () => {
//   setTimeout(() => {
//     messages.value.push({
//       _id: messages.value.length,
//       content: "NEW MESSAGE",
//       senderId: "1234",
//       timestamp: new Date().toString().substring(16, 21),
//       date: new Date().toDateString(),
//     });
//   }, 2000);
// };
</script>

<style lang="scss">
</style>