<template>
  <div>
    <vue-advanced-chat
      height="calc(100vh - 20px)"
      :current-user-id="currentUserId"
      :rooms="JSON.stringify(rooms)"
      :rooms-loaded="true"
      :messages="JSON.stringify(messages)"
      :messages-loaded="messagesLoaded"
      @send-message="sendMessage"
      @fetch-messages="fetchMessages"
      @open-file="openFile($event.detail[0])"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { register } from "vue-advanced-chat";
register();
// https://github.com/advanced-chat/vue-advanced-chat?tab=readme-ov-file
// https://github.com/advanced-chat/vue-advanced-chat-sandbox
// 定義響應式變數
const currentUserId = ref("1234");
const rooms = ref([
  {
    roomId: "1",
    roomName: "GeminiRoom",
    avatar:
      "https://fastly.picsum.photos/id/442/300/200.jpg?hmac=SkMgVWKoCjI_XAr2hj-_S-LAHQAqisJGmdlszEfjSE0",
    users: [
      { _id: "1234", username: "John Doe" },
      { _id: "4321", username: "John Snow" },
    ],
  },
]);
const messages = ref([]);
const messagesLoaded = ref(false);

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
  });
  return newMessages;
};
// 產生檔案
const openFile = ({ file }) => {
  window.open(file.file.localUrl, "_blank");
};

// 傳送訊息
const sendMessage = (event) => {
  console.log(import.meta.env.VITE_GEMINI);

  const message = event.detail[0];
  messages.value.push({
    _id: messages.value.length,
    content: message.content,
    senderId: currentUserId.value,
    timestamp: new Date().toString().substring(16, 21),
    date: new Date().toDateString(),
    files: message.files || [],
  });

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify({
    contents: [
      {
        parts: [
          {
            text: `【Reply in the same language】 ${message.content}`,
          },
        ],
      },
    ],
  });
  fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI}`,
    {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      messages.value = [
        ...messages.value,
        ...addMessages(result.candidates[0].content.parts[0].text),
      ];
      // console.log(result)
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {});
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
