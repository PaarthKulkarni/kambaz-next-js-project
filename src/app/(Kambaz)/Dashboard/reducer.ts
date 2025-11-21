import { createSlice } from "@reduxjs/toolkit";

import { v4 as uuidv4 } from "uuid";
export type Enrollment = {
  _id: string;
  user: string;
  course: string;
};
export type Courses = {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  department: string;
  description: string;
  credits: number;
  src: string;
};

const initialState = {
  courses: [] as Courses[],
  enrollments: [] as Enrollment[],
  showCourseNav: true,
};
const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    addCourse: (state, { payload: course }) => {
      const newCourse = {
        ...course,
        _id: uuidv4(),
        name: course.name,
        number: course.number,
        startDate: course.startDate,
        endDate: course.endDate,
        department: course.department,
        credits: course.credits,
        description: course.description,
        src: course.src,
      };
      state.courses = [...state.courses, newCourse];
    },
    deleteCourse: (state, { payload: courseId }) => {
      state.courses = state.courses.filter((course) => course._id !== courseId);
    },
    updateCourse: (state, { payload: course }) => {
      state.courses = state.courses.map((c) =>
        course._id === c._id ? course : c
      );
    },
    enrollCourse: (state, { payload: enrollment }) => {
      state.enrollments = [...state.enrollments, enrollment];
    },
    unenrollCourse: (state, { payload: courseId }) => {
      state.enrollments = state.enrollments.filter(
        (enrollment) => enrollment.course !== courseId
      );
    },
    toggleCourse: (state, { payload: toggle }) => {
      state.showCourseNav = toggle;
    },
    setCourses: (state, { payload: courses }) => {
      state.courses = courses;
    },
    setEnrollments: (state, { payload: enrollments }) => {
      state.enrollments = enrollments;
    },
  },
});
export const {
  addCourse,
  deleteCourse,
  updateCourse,
  enrollCourse,
  unenrollCourse,
  toggleCourse,
  setCourses,
  setEnrollments
} = coursesSlice.actions;
export default coursesSlice.reducer;
