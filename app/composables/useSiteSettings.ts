/** Site settings singleton (content/settings/site.json). Shared, so it's fetched once. */
export const useSiteSettings = () =>
  useAsyncData('site', () => queryCollection('site').first())
