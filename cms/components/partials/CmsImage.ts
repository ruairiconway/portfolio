// Shared field: an image with its description. Add it to any block's fields:
//
//   import image from '../partials/CmsImage'
//   fields: [..., image]
//
// and render it with <CmsImage v-bind="block.image" /> (its fields are
// CmsImage's props, so v-bind passes them straight through). It's resized,
// lazy-loaded and has its dimensions, like any CMS image.
// Type: CmsImageField from '#cms'. Mirrors app/components/partials/CmsImage.vue.
//
// It's also a rich text embed (the `embed` export below): editors can insert an
// image into rich text (Insert → Image), rendered with <CmsImage>.
import { defineEmbed, defineField } from "../../../modules/cms/define";

// The image and its description, named after CmsImage's props.
const fields = [
  defineField({ name: "image", label: "Image", widget: "image" }),
  defineField({
    name: "alt",
    label: "Description",
    widget: "string",
    required: false,
    hint: "Describe the image for screen readers and search engines. Leave empty if it's purely decorative.",
  }),
];

const image = defineField({
  name: "image",
  label: "Image",
  widget: "object",
  required: false,
  summary: "{{alt}}",
  fields,
});

export default image;

export const embed = defineEmbed({
  label: "Image",
  icon: "image",
  mode: "dialog",
  thumbnail: "image",
  summary: "{{alt}}",
  fields,
});
