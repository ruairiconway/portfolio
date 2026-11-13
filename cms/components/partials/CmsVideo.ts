// Shared field: an embedded video, hosted elsewhere (YouTube, Vimeo, Mux,
// Cloudflare Stream, Bunny Stream…). Add it to any block's fields:
//
//   import video from '../partials/CmsVideo'
//   fields: [..., video]
//
// and render it with <CmsVideo :video="block.video">.
// Type: CmsVideoField from '#cms'. Mirrors app/components/partials/CmsVideo.vue.
//
// It's also a rich text embed (the `embed` export below): editors can insert a
// video into rich text (Insert → Video), rendered with <CmsVideo>.
//
// Videos aren't uploaded: video files in git bloat the repo forever and can't
// stream at the right quality for each viewer.
import { defineEmbed, defineField } from '../../../modules/cms/define'

const video = defineField({
  name: 'video',
  label: 'Video',
  widget: 'object',
  required: false,
  collapsed: true,
  summary: '{{title}}',
  hint: 'Optional. Paste a link to show a video.',
  fields: [
    {
      name: 'url',
      label: 'Video link',
      widget: 'string',
      required: false,
      hint: 'A YouTube or Vimeo link, or the embed URL from your video host (Mux, Cloudflare Stream, Bunny Stream).',
      pattern: ['^https://', 'Must be a full https:// link.'],
    },
    {
      name: 'title',
      label: 'Title',
      widget: 'string',
      required: false,
      hint: 'Describes the video for screen readers. Not shown on the page.',
    },
    {
      name: 'poster',
      label: 'Poster image',
      widget: 'image',
      required: false,
      hint: 'Shown until the video is played. YouTube videos use their own thumbnail if this is empty.',
    },
    {
      name: 'aspectRatio',
      label: 'Shape',
      widget: 'select',
      default: '16/9',
      options: [
        { label: 'Widescreen (16:9)', value: '16/9' },
        { label: 'Standard (4:3)', value: '4/3' },
        { label: 'Square (1:1)', value: '1/1' },
        { label: 'Vertical (9:16)', value: '9/16' },
      ],
    },
    { name: 'caption', label: 'Caption', widget: 'string', required: false },
  ],
})

export default video

// In rich text, the video is the whole point, so its fields start open.
export const embed = defineEmbed({
  label: 'Video',
  icon: 'smart_display',
  mode: 'dialog',
  summary: '{{video.title}}',
  fields: [{ ...video, label: 'Video', required: true, collapsed: false, hint: undefined }],
})
