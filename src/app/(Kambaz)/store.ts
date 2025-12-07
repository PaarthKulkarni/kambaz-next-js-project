import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./Courses/reducer";
import modulesReducer from "./Courses/[cid]/Modules/reducer";
import accountReducer from "./Account/reducer";
import assignmentsReducer from "./Courses/[cid]/Assignments/reducer";
import quizzesReducer from "./Courses/[cid]/Quizzes/reducer";
import quizAttemptsReducer from "./Courses/[cid]/Quizzes/[qid]/attemptReducer";
import enrollmentReducer from "./enrollmentReducer";
const store = configureStore({
  reducer: {
    coursesReducer,
    modulesReducer,
    accountReducer,
    assignmentsReducer,
    enrollmentReducer,
    quizzesReducer,
    quizAttemptsReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
