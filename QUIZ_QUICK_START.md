# Quiz Feature - Quick Start Guide

## Prerequisites

- Both Node.js backend and Next.js frontend servers running
- Users created and database seeded with quizzes
- User logged in (faculty or student role)

## Testing Credentials

### Faculty User

- **Username:** iron_man
- **Password:** stark123
- **Role:** FACULTY

### Student User

- **Username:** dark_knight
- **Password:** wayne123
- **Role:** STUDENT

## Quick Test Flow

### For Faculty Users

1. **Login**

   - Go to Signin page
   - Enter: iron_man / stark123

2. **Navigate to Course**

   - Click on a course from Dashboard
   - Click "Quizzes" tab

3. **View Quiz Details**

   - Click on "Midterm: Propulsion Fundamentals" quiz
   - See quiz metadata (points, questions, time limit, etc.)
   - Note the "Preview" button

4. **Preview Quiz (Faculty Mode)**

   - Click "Preview" button
   - See message "Faculty Preview Mode"
   - Quiz info displays: 3 questions, 30 points, 20 minute limit
   - Click "Start Preview" to begin

5. **Take Quiz Preview**

   - Answer the 3 questions:
     - Q1 (MCQ): Select "Liquid Oxygen"
     - Q2 (T/F): Select "True"
     - Q3 (FIB): Type "Thrust" or "THRUST"
   - View timer countdown
   - Use Previous/Next buttons to navigate

6. **Submit and View Results**

   - Click "Submit Quiz" on last question
   - See score: "3/30 (10%)" or similar based on answers
   - Review each question with correctness indicators
   - See correct answers highlighted

7. **Back to Quiz List**
   - Click "Back to Quizzes"
   - Note: Answers were NOT saved (preview only)

### For Student Users

1. **Login**

   - Go to Signin page
   - Enter: dark_knight / wayne123

2. **Enroll in Course**

   - If not already enrolled, click enrollment link
   - Navigate to course

3. **Navigate to Quizzes**

   - From course, click "Quizzes" tab
   - See only published quizzes

4. **Check Quiz Availability**

   - Hover over or view quiz dates
   - "Available" - can take quiz
   - "Not available until..." - future quiz
   - "Closed" - past due date
   - Quiz marked as ✅ (published) or 🚫 (unpublished)

5. **View Quiz Details**

   - Click on published quiz title
   - See all quiz metadata
   - See "Start Quiz" button (not "Preview")

6. **Start Quiz**

   - Click "Start Quiz" button
   - If access code required, enter code and submit
   - Timer starts counting down
   - First question displays

7. **Complete Quiz**

   - Answer all 3 questions:
     - Q1 (MCQ): Select "Liquid Oxygen"
     - Q2 (T/F): Select "True"
     - Q3 (FIB): Type "Thrust"
   - Progress bar fills as you navigate
   - Use question navigator (1, 2, 3 buttons) to jump

8. **Submit**

   - On Q3, see "Submit Quiz" button instead of "Next"
   - Click "Submit Quiz"
   - See "Submitted" confirmation

9. **Review Results**

   - Score displays: e.g., "30/30 (100%)"
   - "Passed" message (if score ≥ 70%)
   - Question review:
     - ✅ Green for correct answers
     - ❌ Red for incorrect answers
     - Shows your answer and correct answer

10. **Retake (if enabled)**
    - If "Multiple Attempts: Yes", see "Retake Quiz" button
    - Click to start new attempt
    - Previous attempts saved in database

## Features Demonstrated

✅ Quiz availability checking (dates)
✅ Faculty preview mode
✅ Student quiz taking
✅ Multiple question types (MCQ, T/F, FIB)
✅ Timer countdown
✅ Question navigation
✅ Answer persistence
✅ Score calculation
✅ Results display with correct answers
✅ Attempt limiting
✅ Multiple attempts (if configured)
✅ Access code validation (if configured)

## Key Behaviors

- **Faculty Preview:** Can preview quiz but answers not saved
- **Student Taking:** Answers saved to database, score calculated, results stored
- **Multiple Attempts:** If enabled, student can retake quiz (attempt number increments)
- **Auto-Submit:** If time runs out, quiz auto-submits
- **Answer Review:** After submission, students see their answers and correct answers
- **One Question at a Time:** If enabled, only current question shows (navigate via number buttons)
- **Time Limit:** Configurable countdown timer in red header

## Data Persistence

All quiz attempts are stored in MongoDB:

- Student answers stored with question ID and selected answer
- Correctness calculated per question
- Overall score and percentage calculated
- Submission timestamp recorded
- Multiple attempts tracked separately

## Troubleshooting

| Issue                   | Solution                                          |
| ----------------------- | ------------------------------------------------- |
| Quiz not showing        | Verify quiz is published (✅ icon)                |
| Can't start quiz        | Check availability dates and attempt limits       |
| Access code required    | Enter code from quiz details page                 |
| Answers not saving      | Verify MongoDB connection and server is running   |
| Timer not counting down | Check browser console for errors                  |
| Score not calculating   | Verify question types match sample questions      |
| Can't retake quiz       | Check if multiple attempts enabled in quiz config |

## Next Steps

1. **Test all question types:** MCQ, True/False, Fill in Blank
2. **Test date restrictions:** Create quiz with future dates
3. **Test access codes:** Add code to quiz
4. **Test multiple attempts:** Enable and verify attempt tracking
5. **Test time limits:** Verify auto-submit on timeout
6. **Test permission checking:** Verify students can't see unpublished quizzes
7. **Test scoring:** Verify MCQ options, T/F logic, FIB case-insensitivity

## Sample Quiz Data

Two quizzes are pre-loaded:

1. **Midterm: Propulsion Fundamentals** (RS101)

   - 3 questions, 30 points, 20 minute limit
   - Published, available now

2. **Quiz 1: HTML Basics** (CS5610)
   - 2 questions, 20 points, 15 minute limit
   - Published, multiple attempts enabled (3 max)

Both have questions of each type for comprehensive testing.
