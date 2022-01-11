import * as t from "../type";

export const setHeader = (payload) => ({
  type: t.SET_HEADER,
  payload,
});

export const setFooter = (payload) => ({
  type: t.SET_FOOTER,
  payload,
});

export const setPage = (payload) => ({
  type: t.SET_PAGE,
  payload,
});

export const setBlogPost = (payload) => ({
  type: t.SET_BLOG_POST,
  payload,
});

export const setLivePreview = () => ({
  type: t.SET_LIVE_PREVIEW,
});

export const setLiveEdit = () => ({
  type: t.SET_LIVE_EDIT,
});
