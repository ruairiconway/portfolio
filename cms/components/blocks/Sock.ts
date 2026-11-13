// Mirrors app/components/blocks/Sock.vue.
// Type: "sock" -> <BlockSock>. Types: import type { SockBlock } from '#cms'
import { defineBlock } from "../../../modules/cms/define";
import button from "../partials/CmsButton";

export default defineBlock({
  label: "Sock",
  fields: [
    button,
    {
      name: "ticker",
      label: "Ticker",
      widget: "list",
      required: true,
    },
  ],
});
