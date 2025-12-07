# Quiz Preview/Start Quiz Implementation Guide

## Overview

This document outlines the complete implementation of the Quiz Preview and Quiz Taking functionality for the Kambaz Learning Management System.

## Architecture

### Backend Components

#### 1. Quiz Attempts Model & Schema

**File:** `Kambaz/QuizAttempts/schema.js`

Defines the data structure for tracking student quiz attempts:

- `_id`: Unique identifier
- `quiz`: Reference to the quiz being attempted
- `student`: Reference to the student taking the quiz
- `course`: Reference to the course
- `attemptNumber`: Tracks multiple attempts
- `answers`: Array of answered questions with correctness
- `score`: Points earned
- `totalPoints`: Total possible points
- `percentage`: Percentage score
- `status`: IN_PROGRESS or SUBMITTED
- Timestamps for start and submission times

#### 2. Quiz Attempts DAO

**File:** `Kambaz/QuizAttempts/dao.js`

Provides database operations:

- `createAttempt()`: Initialize new quiz attempt
- `getAttemptById()`: Retrieve specific attempt
- `getAttemptsByStudentAndQuiz()`: Get all attempts by a student
- `getLastAttemptByStudentAndQuiz()`: Get most recent attempt
- `updateAttemptAnswers()`: Auto-save answers
- `submitAttempt()`: Calculate score and mark as submitted
- `canStudentAttempt()`: Check if more attempts allowed
- `getNextAttemptNumber()`: Track attempt sequencing

#### 3. Quiz Attempts Routes

**File:** `Kambaz/QuizAttempts/routes.js`

API endpoints:

- `POST /api/quizzes/:quizId/courses/:courseId/attempts` - Start attempt
- `GET /api/attempts/:attemptId` - Get attempt details
- `PUT /api/attempts/:attemptId/answers` - Auto-save answers
- `POST /api/attempts/:attemptId/submit` - Submit and score quiz
- `GET /api/quizzes/:quizId/attempts` - Get student's attempts
- `GET /api/quizzes/:quizId/attempts/all` - Get all attempts (instructor)

**Key Features:**

- Validates quiz availability and attempt limits
- Automatically scores submitted answers based on question type
- Supports multiple attempts when configured
- Prevents attempts when not allowed

#### 4. Enhanced Quizzes Routes

**File:** `Kambaz/Quizzes/routes.js`

Added:

- `GET /api/quizzes/:quizId` - Retrieve specific quiz with all details

#### 5. Database Seeding

**File:** `index.js`

Updated to seed sample quizzes:

- Initializes QuizModel with sample questions
- Supports multiple question types (MCQ, T/F, FIB)
- Runs only if database is empty

### Frontend Components

#### 1. Quiz Attempts Reducer

**File:** `Courses/[cid]/Quizzes/[qid]/attemptReducer.ts`

Redux state management:

- `currentAttempt`: Active quiz attempt object
- `answers`: Array of selected answers
- `submitted`: Tracks submission status
- `results`: Final scores and answer review

**Actions:**

- `setCurrentAttempt()`: Initialize attempt
- `updateAnswer()`: Update individual answer
- `setAnswers()`: Batch set answers
- `submitAttempt()`: Record results
- `clearAttempt()`: Reset state

#### 2. Quiz Preview/Taking Page

**File:** `Courses/[cid]/Quizzes/[qid]/preview/page.tsx`

Comprehensive component handling:

**Faculty Features:**

- See preview message indicating faculty mode
- Take quiz and see scoring
- Answers not persisted (preview only)
- Button to edit quiz

**Student Features:**

- Check quiz availability based on dates
- Timer countdown (auto-submit on timeout)
- One question at a time navigation (if configured)
- Answer validation and storage
- View final results with correct answers shown

**Quiz Taking UI:**

- Sticky timer bar showing time remaining
- Progress bar showing question progress
- Question navigator (numbered buttons)
- Question display with type-specific input
- Previous/Next navigation
- Submit button on last question

**Question Type Handling:**

- **Multiple Choice**: Radio buttons for single answer
- **True/False**: Radio buttons for boolean
- **Fill in Blank**: Text input with case-insensitive matching

**Results Screen:**

- Score display with percentage
- Pass/Fail indication
- Question-by-question review
- Correct answers highlighted in green
- Incorrect answers highlighted in red
- Retake option if multiple attempts allowed

#### 3. API Client Functions

**File:** `Courses/client.ts`

New functions:

- `startQuizAttempt()`: Begin new attempt
- `getAttempt()`: Retrieve attempt data
- `updateAttemptAnswers()`: Save answers
- `submitQuizAttempt()`: Submit answers for scoring
- `getStudentAttempts()`: List all attempts

#### 4. Styling

**File:** `Courses/[cid]/Quizzes/[qid]/preview/preview.css`

- Sticky timer bar with red background
- Question card styling
- Progress indicator
- Responsive design for mobile
- Color-coded results (green for correct, red for incorrect)

#### 5. Updated Redux Store

**File:** `store.ts`

Added `quizAttemptsReducer` to central state management

## How It Works

### 1. Starting a Quiz (Student)

```
1. Student clicks "Start Quiz" button on quiz details
2. accessCode modal appears if required, captures input
3. Frontend calls startQuizAttempt() API
4. Backend creates QuizAttempt record with IN_PROGRESS status
5. Timer starts for configured timeLimit
6. Quiz taking interface displays first question
```

### 2. Answering Questions

```
1. Student selects/enters answer for question
2. Answer stored in Redux state (local)
3. On Next/Previous click, answer saved via updateAttemptAnswers()
4. Auto-save implements periodically (optional enhancement)
5. State updates to reflect current answer
```

### 3. Submitting Quiz

```
1. On last question, "Submit" button appears
2. Student clicks Submit or time expires
3. Frontend sends all answers to submitQuizAttempt() API
4. Backend iterates through answers and checks correctness:
   - MCQ: Compares selected to isCorrect flag
   - T/F: Compares boolean to correctAnswer field
   - FIB: Case-insensitive comparison with possibleAnswers
5. Calculates score and percentage
6. Updates attempt with SUBMITTED status and results
7. Frontend displays results screen with score breakdown
```

### 4. Viewing Results

```
1. Results screen shows:
   - Total score and percentage
   - Pass/Fail status (default: 70% threshold)
   - Each question with:
     - Student's answer
     - Correct answer
     - Points awarded
     - Visual indicator (green/red)
2. Student can retake if multiple attempts allowed
3. Navigate back to quiz list or view previous attempts
```

## Question Type Specifications

### Multiple Choice

- `choices`: Array of {text, isCorrect}
- Student selects ONE option
- Comparison: exact text match

### True/False

- `correctAnswer`: Boolean (true/false)
- Student selects True or False
- Comparison: boolean equality

### Fill in Blank

- `possibleAnswers`: Array of correct answers
- Student types response
- Comparison: case-insensitive substring or exact match

## Quiz Configuration Options Used

- `oneQuestionAtTime`: Show one question per screen (true/false)
- `timeLimit`: Minutes available (countdown timer)
- `multipleAttempts`: Allow retakes (true/false)
- `howManyAttempts`: Max attempts if multipleAttempts enabled
- `showCorrectAnswers`: When to reveal answers
- `accessCode`: Optional passcode requirement
- `published`: Whether students can see/take quiz

## Data Flow

```
Quiz List Screen
    ↓
Quiz Details Screen (with Start Quiz button)
    ↓
Access Code Modal (if required)
    ↓
Quiz Preview/Taking Interface
    ├→ For Faculty: Preview mode
    └→ For Students:
        ├→ Check availability dates
        ├→ Verify attempt limits
        ├→ Display questions one by one
        ├→ Store answers locally + in DB
        └→ Submit when complete or time expires
    ↓
Results Screen
    ├→ Score summary
    ├→ Question review
    └→ Retake option (if allowed)
```

## Error Handling

- Quiz not found: 404 error displayed
- Quiz not available: Warning message with dates
- Max attempts exceeded: 403 error with limit message
- Session expiration: User redirected to login
- Answer submission errors: Alert notification

## Testing the Implementation

### 1. Test as Faculty

- Login with faculty credentials (e.g., iron_man/stark123)
- Navigate to a course
- Click on a published quiz
- Click "Preview" button
- See preview mode message
- Take the quiz and see scoring

### 2. Test as Student

- Login with student credentials (e.g., dark_knight/wayne123)
- Enroll in a course
- View available quizzes
- Verify quiz dates are checking correctly
- Start quiz and complete it
- Verify score calculation
- View results with correct answer review
- Retake if configured for multiple attempts

### 3. Edge Cases

- Quiz not published: Students shouldn't see it
- Before availability date: Show "Not available until" message
- After due date: Show "Closed" message
- Maximum attempts reached: Disable attempt button
- Time expires: Auto-submit quiz
- Access code mismatch: Show error and prevent access

## Future Enhancements

1. **Auto-save**: Implement periodic saving of answers while in progress
2. **Partial credit**: Support weighted scoring for complex questions
3. **Question shuffling**: Randomize question order if enabled
4. **Answer shuffling**: Randomize MCQ options if enabled
5. **Analytics**: Show student performance trends
6. **Grading**: Allow instructors to review and modify scores
7. **Question banking**: Create questions from a pool
8. **Conditional logic**: Show different questions based on answers

## API Endpoints Summary

| Method | Endpoint                                          | Purpose              |
| ------ | ------------------------------------------------- | -------------------- |
| POST   | `/api/quizzes/:quizId/courses/:courseId/attempts` | Start new attempt    |
| GET    | `/api/attempts/:attemptId`                        | Get attempt details  |
| PUT    | `/api/attempts/:attemptId/answers`                | Save answers         |
| POST   | `/api/attempts/:attemptId/submit`                 | Submit and score     |
| GET    | `/api/quizzes/:quizId/attempts`                   | Get student attempts |
| GET    | `/api/quizzes/:quizId/attempts/all`               | Get all attempts     |
| GET    | `/api/quizzes/:quizId`                            | Get quiz details     |

## Files Modified/Created

**Backend:**

- ✅ Created: `Kambaz/QuizAttempts/schema.js`
- ✅ Created: `Kambaz/QuizAttempts/model.js`
- ✅ Created: `Kambaz/QuizAttempts/dao.js`
- ✅ Created: `Kambaz/QuizAttempts/routes.js`
- ✅ Created: `Kambaz/Database/quizzes.js`
- ✅ Modified: `Kambaz/Database/index.js`
- ✅ Modified: `Kambaz/Quizzes/dao.js` (added findQuizById)
- ✅ Modified: `Kambaz/Quizzes/routes.js` (added GET /api/quizzes/:quizId)
- ✅ Modified: `index.js` (added quiz seeding)

**Frontend:**

- ✅ Created: `Courses/[cid]/Quizzes/[qid]/attemptReducer.ts`
- ✅ Modified: `Courses/[cid]/Quizzes/[qid]/preview/page.tsx`
- ✅ Created: `Courses/[cid]/Quizzes/[qid]/preview/preview.css`
- ✅ Modified: `Courses/client.ts` (added attempt API functions)
- ✅ Modified: `store.ts` (added quizAttemptsReducer)
- ✅ Modified: `Database/index.ts` (exported quizzes)
