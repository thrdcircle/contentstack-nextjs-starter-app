import * as t from "../type";

const reducer = (state = {
  header: null, footer: null, page: null, blogPost: null, liveEdit: false, livePreview: false,
}, action) => {
  switch (action.type) {
    case t.SET_HEADER:
      return { ...state, header: action.payload };
    case t.SET_FOOTER:
      return { ...state, footer: action.payload };
    case t.SET_PAGE:
      return { ...state, page: action.payload };
    case t.SET_LIVE_PREVIEW:
      return { ...state, livePreview: !state.livePreview };
    case t.SET_LIVE_EDIT:
      return { ...state, liveEdit: !state.liveEdit };
    default:
      return { ...state };
  }
};

export default reducer;
