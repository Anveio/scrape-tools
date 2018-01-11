export const validateImgurSubreddit = (url: string) =>
  /imgur/.test(url) && /\/r\//.test(url);

export const validate4ChanThread = (url: string) => /4chan/.test(url);
