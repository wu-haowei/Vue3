<template>
  <div>
    <a href="https://ai.google.dev/gemini-api/docs">gemini-api</a>
    <select v-model="selectModel">
      <option :value="item.key" :key="item.key" v-for="item of aiModel">
        {{ item.value }}
      </option>
    </select>
    <vue-advanced-chat
      height="calc(80vh - 20px)"
      :current-user-id="currentUserId"
      :rooms="JSON.stringify(rooms)"
      :rooms-loaded="true"
      :messages="JSON.stringify(messages)"
      :messages-loaded="messagesLoaded"
      @send-message="sendMessage"
      @fetch-messages="fetchMessages"
      @open-file="openFile($event.detail[0])"
      @send-message-reaction="sendMessageReaction($event.detail[0])"
      @edit-message="editMessage($event.detail[0])"
    />
  </div>
</template>

<script setup>
import { ref, defineOptions, reactive } from "vue";
// https://github.com/advanced-chat/vue-advanced-chat?tab=readme-ov-file
// https://github.com/advanced-chat/vue-advanced-chat-sandbox
import { register } from "vue-advanced-chat";
import { GoogleGenerativeAI } from "@google/generative-ai";
register();

defineOptions({
  name: "AdvancedChat",
  components: {},
});

// 定義響應式變數
const currentUserId = ref("1234");
const rooms = ref([
  {
    roomId: "1",
    roomName: "Gemini-Room",
    avatar:
      "https://fastly.picsum.photos/id/442/300/200.jpg?hmac=SkMgVWKoCjI_XAr2hj-_S-LAHQAqisJGmdlszEfjSE0",
    users: [
      { _id: "1234", username: "User" },
      { _id: "4321", username: "Gemini" },
    ],
    typingUsers: [],
  },
]);
const messages = ref([]);
const messagesLoaded = ref(false);
const selectModel = ref("gemini-2.5-pro-exp-03-25");

const aiModel = reactive([
  { key: "gemini-2.5-pro-exp-03-25", value: "gemini-2.5" },
  { key: "gemini-2.0-flash", value: "gemini-2.0-flash" },
  { key: "gemini-1.5-flash", value: "gemini-1.5-flash" },
]);

// 模擬獲取資訊
const fetchMessages = (event) => {
  // const { options = {} } = event.detail[0];

  // setTimeout(() => {
  //   if (options.reset) {
  //     messages.value = addMessages(true);
  //   } else {
  //     messages.value = [...addMessages(), ...messages.value];
  messagesLoaded.value = true;
  //   }
  // }, 500);
};

// 產生訊息
const addMessages = (data = "預設訊息", reset = false) => {
  const newMessages = [];
  newMessages.push({
    _id: messages.value.length + 1,
    content: `${data}`,
    senderId: "4321",
    username: "Gemini",
    date: new Date().toDateString(),
    timestamp: new Date().toString().substring(16, 21),
    reactions: {}, // 預設無表情符號
  });
  return newMessages;
};
// 產生檔案
const openFile = ({ file }) => {
  window.open(file.file.localUrl, "_blank");
};

const sendMessageReaction = async ({ reaction, remove, messageId, roomId }) => {
  console.log("reaction", reaction);
  console.log("remove", remove);
  console.log("messageId", messageId);
  console.log("roomId", roomId);
  // const message = messages.value.find((msg) => msg._id === messageId);
};
const useTime = ref(null);
// 傳送訊息
const sendMessage = async (event) => {
  const message = event.detail[0];
  messages.value.push({
    _id: messages.value.length + 1,
    content: message.content,
    senderId: currentUserId.value,
    timestamp: new Date().toString().substring(16, 21),
    date: new Date().toDateString(),
    files: message.files || [],
    reactions: {}, // 預設無表情符號
  });
  rooms.value[0].typingUsers.push("4321");
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify({
    contents: [
      {
        parts: [
          {
            text: `【Reply in the same language, except for the translation. If the reply language is Chinese, please use Traditional Chinese.】 ${message.content}`,
          },
        ],
      },
    ],
  });

  useTime.value = new Date().getTime();

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI);
  const model = genAI.getGenerativeModel({ model: selectModel.value });

  const result = await model.generateContent(raw);
  messages.value = [
    ...messages.value,
    ...addMessages(
      `${result.response.text()} \n\n【回應秒數:${
        (new Date().getTime() - useTime.value) / 1000
      }】`
    ),
  ];
  rooms.value[0].typingUsers = rooms.value[0].typingUsers.filter(
    (f) => f != "4321"
  );
};

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
body {
  font-family: "Quicksand", sans-serif;
}
</style>
