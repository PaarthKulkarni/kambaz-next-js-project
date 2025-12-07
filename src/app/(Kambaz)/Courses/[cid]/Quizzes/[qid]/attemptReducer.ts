import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentAttempt: null,
  answers: [],
  submitted: false,
  results: null,
};

const quizAttemptsSlice = createSlice({
  name: "quizAttempts",
  initialState,
  reducers: {
    setCurrentAttempt: (state, { payload }) => {
      state.currentAttempt = payload;
      state.submitted = false;
    },
    updateAnswer: (state, { payload }) => {
      const { questionId, selectedAnswer } = payload;
      const existingAnswer = state.answers.find(
        (a) => a.questionId === questionId
      );

      if (existingAnswer) {
        existingAnswer.selectedAnswer = selectedAnswer;
      } else {
        state.answers.push({ questionId, selectedAnswer });
      }
    },
    setAnswers: (state, { payload }) => {
      state.answers = payload;
    },
    submitAttempt: (state, { payload }) => {
      state.submitted = true;
      state.results = payload;
    },
    clearAttempt: (state) => {
      state.currentAttempt = null;
      state.answers = [];
      state.submitted = false;
      state.results = null;
    },
  },
});

export const {
  setCurrentAttempt,
  updateAnswer,
  setAnswers,
  submitAttempt,
  clearAttempt,
} = quizAttemptsSlice.actions;
export default quizAttemptsSlice.reducer;
