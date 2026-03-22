import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import postReducer from "../features/post/postSlice";
import profileReducer from "../features/profile/profileSlice";
import searchReducer from "../features/search/searchSlice";
import notificationReducer from "../features/notification/notificationSlice";
import savedReducer from "../features/saved/savedSlice";
import suggestionReducer from "../features/suggestion/suggestionSlice";
import storyReducer from "../features/story/storySlice";
import messageReducer from "../features/message/messageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    profile: profileReducer,
    search: searchReducer,
    notifications: notificationReducer,
    saved: savedReducer,
    suggestions: suggestionReducer,
    stories: storyReducer,
    messages: messageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;