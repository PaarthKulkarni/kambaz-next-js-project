import { createSlice } from "@reduxjs/toolkit";
import { enrollments } from "./Database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  enrollments: enrollments,
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    addEnrollment: (state, { payload }) => {
      const newEnrollment = {
        _id: uuidv4(),
        user: payload.userId,
        course: payload.courseId,
      };
      state.enrollments.push(newEnrollment as any);
    },

    deleteEnrollment: (state, { payload }) => {
      state.enrollments = state.enrollments.filter(
        (e: any) =>
          !(e.user === payload.userId && e.course === payload.courseId)
      );
    },
  },
});

export const { addEnrollment, deleteEnrollment } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;