# Quiz Taking Flow Diagram

## Overall Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        KAMBAZ QUIZ SYSTEM                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────┐                            ┌──────────────────┐ │
│  │   FRONTEND    │                            │    BACKEND       │ │
│  │  (Next.js +   │◄────────API────────────►  │  (Express +      │ │
│  │   React +     │                            │  MongoDB)        │ │
│  │   Redux)      │                            │                  │ │
│  │               │                            │  • Quiz Attempt  │ │
│  │ • Quiz List   │                            │    Model         │ │
│  │ • Quiz Detail │                            │  • DAO Methods   │ │
│  │ • Quiz Taking │                            │  • Scoring Logic │ │
│  │ • Results     │                            │  • API Routes    │ │
│  └───────────────┘                            └──────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                         ┌──────────────┐
                         │  MongoDB     │
                         │ • Quizzes    │
                         │ • Attempts   │
                         │ • Answers    │
                         └──────────────┘
```

## Student Quiz Taking Flow

```
┌─────────────────┐
│   Login Page    │
│ (Signin)        │
└────────┬────────┘
         │ (username/password)
         ▼
┌─────────────────────────────────────┐
│   Dashboard - Enrolled Courses      │
└────────┬────────────────────────────┘
         │ (click course)
         ▼
┌─────────────────────────────────────┐
│   Course Home - Navigation Menu     │
│   • Home • Modules • Assignments    │
│   • Quizzes • People • Piazza       │
└────────┬────────────────────────────┘
         │ (click Quizzes)
         ▼
┌─────────────────────────────────────┐
│   Quizzes List Screen               │
│   ✅ Midterm: Propulsions Fundamentals
│   🚫 Unpublished Quiz               │
│   ⏱️  Future Quiz (not available)   │
└────────┬────────────────────────────┘
         │ (click published quiz)
         ▼
┌─────────────────────────────────────┐
│   Quiz Details Screen               │
│   • Title, Description              │
│   • Points, Questions, Time Limit   │
│   • Availability Status             │
│   [START QUIZ] Button               │
└────────┬────────────────────────────┘
         │ (click START QUIZ)
         ▼
┌─────────────────────────────────────┐
│   Access Code Modal (if required)   │
│   "Enter Access Code: [_______]"    │
│   [Cancel] [Submit]                 │
└────────┬────────────────────────────┘
         │ (submit or skip)
         ▼
  API CALL: startQuizAttempt()
  ──────────────────────────
  Backend:
  ✓ Check if quiz published
  ✓ Check dates (available)
  ✓ Check attempt limits
  ✓ Create QuizAttempt record
  ✓ Return with attempt ID

         ▼
┌─────────────────────────────────────┐
│   QUIZ TAKING INTERFACE             │
│                                     │
│  [RED TIMER BAR]                    │
│  ⏱️ Time: 19:45  Q1 of 3            │
│                                     │
│  ┌─ Question 1 (MCQ) [10 pts] ────┐ │
│  │                                 │ │
│  │ Which is commonly used as       │ │
│  │ oxidizer in rocket engines?     │ │
│  │                                 │ │
│  │ ○ Liquid Oxygen    (SELECTED)   │ │
│  │ ○ Kerosene                      │ │
│  │ ○ Liquid Hydrogen               │ │
│  │ ○ Nitrogen                      │ │
│  └─────────────────────────────────┘ │
│                                     │
│  [Progress: ████░░░]                │
│                                     │
│  [Previous] [1] [2] [3] [Next]     │
└────────┬────────────────────────────┘
         │ (click Next)
         ▼
  Redux: updateAnswer()
  ──────────────────
  • Store answer locally
  • Mark Q1 complete
         │
         ▼
┌─────────────────────────────────────┐
│   Question 2 (T/F) [10 pts]         │
│                                     │
│ "Newton's 3rd Law: action has       │
│  equal, opposite reaction"          │
│                                     │
│ ○ True   (SELECTED)                 │
│ ○ False                             │
│                                     │
│ [Progress: ████████░]               │
│                                     │
│ [Previous] [1] [2] [3] [Next]       │
└────────┬────────────────────────────┘
         │ (click Next)
         ▼
┌─────────────────────────────────────┐
│   Question 3 (Fill Blank) [10 pts]  │
│                                     │
│ "The force propelling a rocket     │
│  upward is called ______"           │
│                                     │
│ [Thrust________________]             │
│                                     │
│ [Progress: ███████████]             │
│                                     │
│ [Previous] [1] [2] [3] [SUBMIT]    │
└────────┬────────────────────────────┘
         │ (click SUBMIT or timer=0)
         ▼
  API CALL: submitQuizAttempt()
  ────────────────────────────
  Backend:
  1️⃣ Check Q1 (MCQ):
     "Liquid Oxygen" == "Liquid Oxygen"
     ✓ CORRECT → +10 points

  2️⃣ Check Q2 (T/F):
     true == true
     ✓ CORRECT → +10 points

  3️⃣ Check Q3 (Fill Blank):
     "Thrust".toLowerCase() == "thrust"
     ✓ CORRECT → +10 points

  Final Score: 30/30 (100%)
  Mark attempt as: SUBMITTED
  Return results

         ▼
┌─────────────────────────────────────┐
│   RESULTS SCREEN                    │
│                                     │
│   ✅ PASSED                          │
│   Score: 30 / 30                    │
│   Percentage: 100%                  │
│                                     │
│  Question Review:                   │
│  ├─ ✅ Q1: Oxidizers                │
│  │  Your answer: Liquid Oxygen      │
│  │  Correct! (+10 points)           │
│  │                                 │
│  ├─ ✅ Q2: Newton's Third Law       │
│  │  Your answer: True               │
│  │  Correct! (+10 points)           │
│  │                                 │
│  └─ ✅ Q3: Thrust Definition        │
│     Your answer: Thrust             │
│     Correct! (+10 points)           │
│                                     │
│  [Back to Quizzes] [Retake Quiz]   │
└────────┬────────────────────────────┘
         │
         └─→ Back to Quiz List or Dashboard
```

## Faculty Preview Flow

```
Faculty Same as Student UNTIL:

Quiz Details Screen
    ▼
[PREVIEW] [EDIT] [PUBLISH]
    ▼
    Preview starts quiz...
    ▼
┌─────────────────────────────────────┐
│   QUIZ PREVIEW (Faculty Only)       │
│                                     │
│   ⓘ Faculty Preview Mode            │
│   You can preview this quiz as      │
│   students would see it. Answers    │
│   will not be saved.                │
│                                     │
│  [Answers Not Saved to DB]          │
│  [Only Local Display]               │
│  [Useful for Testing]               │
│                                     │
│  [Start Preview] [Edit Quiz]        │
└────────┬────────────────────────────┘
         │
         ▼
    Quiz takes same as student...
         │
         ▼
    Results displayed same as student...
         │
         ▼
    BUT: [No data saved to database]
         [Can retake immediately]
         [Back to Quiz Details]
```

## Data Flow Diagram

```
┌──────────────┐
│   Browser    │
│   (Redux)    │
└──────┬───────┘
       │
       │ startQuizAttempt(quizId, courseId)
       ▼
   ┌────────────────┐
   │   API Route    │
   │   POST /...    │
   └────────┬───────┘
            │
            ▼
   ┌──────────────────────┐
   │ Backend Validation   │
   │ • Quiz exists?       │
   │ • Published?         │
   │ • Available dates?   │
   │ • Attempt limit?     │
   └────────┬─────────────┘
            │
            ▼
   ┌──────────────────────┐
   │ Create QuizAttempt   │
   │ • _id: UUID          │
   │ • status: IN_PROGRESS
   │ • answers: []        │
   └────────┬─────────────┘
            │
            ▼
   ┌──────────────────────┐
   │ Save to MongoDB      │
   └────────┬─────────────┘
            │
            ▼
   ┌──────────────────────┐
   │ Return attempt obj   │
   └────────┬─────────────┘
            │
            ▼
   ┌──────────────────────┐
   │ Redux Update         │
   │ setCurrentAttempt()  │
   └────────┬─────────────┘
            │
            ▼
   ┌──────────────────────┐
   │ Quiz UI Rendered     │
   │ • Timer started      │
   │ • Q1 displayed       │
   └──────────────────────┘


DURING TAKING:
   ┌──────────────┐
   │ User selects │
   │ answer       │
   └──────┬───────┘
          │
          ▼
   ┌──────────────────────┐
   │ Redux updateAnswer   │
   │ • questionId: X      │
   │ • selectedAnswer: Y  │
   └──────────────────────┘


ON SUBMIT:
   ┌──────────────┐
   │   Browser    │
   │  [answers]   │
   └──────┬───────┘
          │
          │ submitQuizAttempt(attemptId, answers[])
          ▼
   ┌────────────────────────────┐
   │ Backend Scoring Algorithm  │
   │                            │
   │ for each answer {          │
   │   get question by ID       │
   │   check type:              │
   │   • MCQ: text match?       │
   │   • T/F: boolean match?    │
   │   • FIB: case-insensitive? │
   │   if correct: score += pts │
   │ }                          │
   │                            │
   │ Calculate:                 │
   │ percentage = score/total   │
   └────────┬───────────────────┘
            │
            ▼
   ┌──────────────────────┐
   │ Update attempt:      │
   │ • status: SUBMITTED  │
   │ • score: X           │
   │ • percentage: Y      │
   │ • answers: []        │
   │   (with isCorrect)   │
   └────────┬─────────────┘
            │
            ▼
   ┌──────────────────────┐
   │ Save to MongoDB      │
   └────────┬─────────────┘
            │
            ▼
   ┌──────────────────────┐
   │ Return results       │
   └────────┬─────────────┘
            │
            ▼
   ┌──────────────────────┐
   │ Redux submitAttempt  │
   │ Store results in     │
   │ state.quizAttempts   │
   └────────┬─────────────┘
            │
            ▼
   ┌──────────────────────┐
   │ Display results UI   │
   │ • Score: X/Y        │
   │ • Questions reviewed │
   │ • Retake option      │
   └──────────────────────┘
```

## State Management

```
Redux Store:
└── quizAttemptsReducer
    ├── currentAttempt: {
    │   _id: "...",
    │   quiz: "...",
    │   student: "...",
    │   status: "IN_PROGRESS",
    │   answers: []
    │ }
    ├── answers: [
    │   {
    │     questionId: "...",
    │     selectedAnswer: "..."
    │   },
    │   ...
    │ ]
    ├── submitted: false
    └── results: null
         (until submitted, then contains scores)
```

## Component Hierarchy

```
QuizPreview (Page Component)
├── Faculty Conditions
│   ├── Not Attempting
│   │   ├── Preview Mode Alert
│   │   ├── Quiz Info Card
│   │   ├── Instructions
│   │   └── [Start Preview] [Edit Quiz]
│   └── Attempting
│       └── Quiz Taker Interface
├── Student Conditions
│   ├── Not Available
│   │   ├── Availability Alert
│   │   └── [Back to Quizzes]
│   ├── Not Attempting
│   │   ├── Quiz Info Card
│   │   ├── Instructions
│   │   └── [Start Quiz]
│   └── Attempting
│       └── Quiz Taker Interface
└── Results View (Both)
    ├── Score Display
    ├── Question Review List
    │   ├── Question Title
    │   ├── Student Answer
    │   ├── Correct Answer
    │   ├── Points
    │   └── Visual Indicator
    ├── [Back to Quizzes]
    └── [Retake Quiz] (if allowed)

Quiz Taker Interface:
├── Timer Bar (Sticky)
│   ├── Time Remaining
│   └── Question Progress
├── Progress Bar
├── Question Card
│   ├── Question Title & Points
│   ├── Question Text
│   └── Input Component
│       ├── Multiple Choice (Radio buttons)
│       ├── True/False (Radio buttons)
│       └── Fill in Blank (Text input)
└── Navigation
    ├── Previous Button
    ├── Question Navigator
    └── Next/Submit Button
```

This visual representation shows:

1. **Overall System Architecture** - How frontend, backend, and database interact
2. **Student Flow** - Step-by-step quiz taking process
3. **Faculty Preview Flow** - How faculty preview quizzes
4. **Data Flow** - How data moves through the system
5. **State Management** - Redux state structure
6. **Component Hierarchy** - UI component organization
