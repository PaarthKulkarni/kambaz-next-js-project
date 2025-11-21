import { createSlice } from "@reduxjs/toolkit";
import { enrollments } from "./Database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  enrollments: [],
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    addEnrollment: (state, { payload: newEnrollment }) => {
      const exists = state.enrollments.some((e: any) => e._id === newEnrollment._id);
      if (!exists) {
        state.enrollments.push(newEnrollment as any);
      }
    },
    deleteEnrollment: (state, { payload }) => {
      state.enrollments = state.enrollments.filter(
        (e: any) =>
          !(e.user === payload.userId && e.course === payload.courseId)
      );
    },
    setEnrollments: (state, { payload: enrollments }) => {
      state.enrollments = enrollments;
    },
  },
});

export const { addEnrollment, deleteEnrollment, setEnrollments } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;