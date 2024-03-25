<template>

  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script setup>
import { Client, LogLevel, Logger } from "@notionhq/client";

import { onMounted } from 'vue';
import axios from "axios";





const notion = new Client({
  auth: 'secret_9NejvGIL0JuF4W4DXFHjs6yHynP08jvfsmB31rCR4fs'//process.env.NOTION_TOKEN,
})


const getPage = async () => {
  const pageId = 'f6062a01fa4e49569080094fdff476f4'// process.env.NOTION_PAGE_ID; // 我們的 page ID
  const response = await notion.pages.retrieve({ page_id: pageId });
  console.log(response);
  // response 會是 page object
  return response;
};

const getBlocks = async () => {
  // page 也是一種 block
  const blockId = process.env.NOTION_PAGE_ID;
  // 我們想拿到 page 裡的 blocks，這裡 block_id 等於 page ID
  const response = await notion.blocks.children.list({ block_id: blockId });

  // response 為 list of blocks
  return response;
};


onMounted(async () => {
  // console.log(`The initial count is 123.`)
  // const page = await getPage();
  // const blocks = await getBlocks();
  // console.log(`${page}`)
  // console.log(`${blocks}`)

  // const notion = new Client({ auth: 'secret_9NejvGIL0JuF4W4DXFHjs6yHynP08jvfsmB31rCR4fs' });
  // const pages = await notion.databases.query({ database_id: 'f6062a01fa4e49569080094fdff476f4' });



  const headers = {
    'Authorization': 'Bearer secret_9NejvGIL0JuF4W4DXFHjs6yHynP08jvfsmB31rCR4fs',
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28',
  };

  const data = {
    "parent": {
      "database_id": "eb32b2cf9ef4475dbf809f641a81b940"
    },
    "icon": {
      "emoji": "🥬"
    },
    "cover": {
      "external": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/6/62/Tuscankale.jpg"
      }
    },
    "properties": {
      "Name": {
        "title": [
          {
            "text": {
              "content": "Tuscan Kale"
            }
          }
        ]
      }
    },
    "children": [
      {
        "object": "block",
        "type": "heading_2",
        "heading_2": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Lacinato kale"
              }
            }
          ]
        }
      },
      {
        "object": "block",
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Lacinato kale is a variety of kale with a long tradition in Italian cuisine, especially that of Tuscany. It is also known as Tuscan kale, Italian kale, dinosaur kale, kale, flat back kale, palm tree kale, or black Tuscan palm.",
                "link": {
                  "url": "https://en.wikipedia.org/wiki/Lacinato_kale"
                }
              }
            }
          ]
        }
      }
    ]
  };

  axios.post('/api', data, { headers })
    .then(response => console.log(response.data))
    .catch(error => console.error(error));


  // console.log(pages);

});

</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
