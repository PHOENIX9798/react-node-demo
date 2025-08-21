import { configureStore } from '@reduxjs/toolkit';
import userSlice, { type userType } from './user.ts';

export interface rootStore {
  user: userType;
}
// 总状态库
const store = configureStore({
  reducer: {
    user: userSlice
  }
});
export default store;
