# Quiz API Reference

## Base URL

```
http://localhost:4000
```

## Authentication

All endpoints require:

- User to be logged in (session)
- `withCredentials: true` in Axios

## Quiz Attempt Endpoints

### 1. Start Quiz Attempt

**Endpoint:** `POST /api/quizzes/:quizId/courses/:courseId/attempts`

**Description:** Initiates a new quiz attempt for the current user

**Parameters:**

- `quizId` (path) - The quiz ID
- `courseId` (path) - The course ID

**Headers:**

```
Content-Type: application/json
Authorization: (session cookie)
```

**Request Body:** None

**Success Response (200):**

```json
{
  "_id": "550e8400-e29b-41d4-a716-446655440000",
  "quiz": "651a2b3c4d5e6f7a8b9c0d1e",
  "student": "123",
  "course": "RS101",
  "attemptNumber": 1,
  "answers": [],
  "status": "IN_PROGRESS",
  "startTime": "2024-12-06T15:30:00.000Z",
  "createdAt": "2024-12-06T15:30:00.000Z",
  "updatedAt": "2024-12-06T15:30:00.000Z"
}
```

**Error Responses:**

- `404` - Quiz not found
- `403` - Maximum attempts reached
- `403` - Quiz not published
- `500` - Server error

**Example:**

```typescript
const attempt = await client.startQuizAttempt(
  "651a2b3c4d5e6f7a8b9c0d1e", // quizId
  "RS101" // courseId
);
```

---

### 2. Get Attempt Details

**Endpoint:** `GET /api/attempts/:attemptId`

**Description:** Retrieves a specific quiz attempt with all answers

**Parameters:**

- `attemptId` (path) - The attempt ID

**Headers:**

```
Authorization: (session cookie)
```

**Success Response (200):**

```json
{
  "_id": "550e8400-e29b-41d4-a716-446655440000",
  "quiz": "651a2b3c4d5e6f7a8b9c0d1e",
  "student": "123",
  "course": "RS101",
  "attemptNumber": 1,
  "answers": [
    {
      "questionId": "651a2b3c4d5e6f7a8b9c0d1f",
      "questionType": "MULTIPLE_CHOICE",
      "selectedAnswer": "Liquid Oxygen",
      "isCorrect": true
    }
  ],
  "score": null,
  "totalPoints": null,
  "status": "IN_PROGRESS",
  "startTime": "2024-12-06T15:30:00.000Z"
}
```

**Error Responses:**

- `404` - Attempt not found
- `500` - Server error

**Example:**

```typescript
const attempt = await client.getAttempt("550e8400-e29b-41d4-a716-446655440000");
```

---

### 3. Update Attempt Answers (Auto-save)

**Endpoint:** `PUT /api/attempts/:attemptId/answers`

**Description:** Saves answers without submitting quiz

**Parameters:**

- `attemptId` (path) - The attempt ID

**Headers:**

```
Content-Type: application/json
Authorization: (session cookie)
```

**Request Body:**

```json
{
  "answers": [
    {
      "questionId": "651a2b3c4d5e6f7a8b9c0d1f",
      "selectedAnswer": "Liquid Oxygen"
    },
    {
      "questionId": "651a2b3c4d5e6f7a8b9c0d20",
      "selectedAnswer": true
    }
  ]
}
```

**Success Response (200):**

```json
{
  "message": "Answers saved"
}
```

**Error Responses:**

- `404` - Attempt not found
- `500` - Server error

**Example:**

```typescript
await client.updateAttemptAnswers("550e8400-e29b-41d4-a716-446655440000", [
  { questionId: "q1", selectedAnswer: "Liquid Oxygen" },
  { questionId: "q2", selectedAnswer: true },
]);
```

---

### 4. Submit Quiz Attempt

**Endpoint:** `POST /api/attempts/:attemptId/submit`

**Description:** Submits quiz answers for grading

**Parameters:**

- `attemptId` (path) - The attempt ID

**Headers:**

```
Content-Type: application/json
Authorization: (session cookie)
```

**Request Body:**

```json
{
  "answers": [
    {
      "questionId": "651a2b3c4d5e6f7a8b9c0d1f",
      "selectedAnswer": "Liquid Oxygen"
    },
    {
      "questionId": "651a2b3c4d5e6f7a8b9c0d20",
      "selectedAnswer": true
    },
    {
      "questionId": "651a2b3c4d5e6f7a8b9c0d21",
      "selectedAnswer": "Thrust"
    }
  ]
}
```

**Success Response (200):**

```json
{
  "score": 30,
  "totalPoints": 30,
  "percentage": 100,
  "answers": [
    {
      "questionId": "651a2b3c4d5e6f7a8b9c0d1f",
      "selectedAnswer": "Liquid Oxygen",
      "isCorrect": true
    },
    {
      "questionId": "651a2b3c4d5e6f7a8b9c0d20",
      "selectedAnswer": true,
      "isCorrect": true
    },
    {
      "questionId": "651a2b3c4d5e6f7a8b9c0d21",
      "selectedAnswer": "Thrust",
      "isCorrect": true
    }
  ]
}
```

**Error Responses:**

- `404` - Attempt not found
- `404` - Quiz not found
- `500` - Server error

**Grading Logic:**

- **Multiple Choice**: Compares selectedAnswer with choice text where isCorrect=true
- **True/False**: Compares selectedAnswer (boolean) with question.correctAnswer
- **Fill in Blank**: Case-insensitive comparison with any string in possibleAnswers[]

**Example:**

```typescript
const results = await client.submitQuizAttempt(
  "550e8400-e29b-41d4-a716-446655440000",
  answers
);
// results.score = 30
// results.percentage = 100
```

---

### 5. Get Student's Attempts

**Endpoint:** `GET /api/quizzes/:quizId/attempts`

**Description:** Lists all attempts by current student for a specific quiz

**Parameters:**

- `quizId` (path) - The quiz ID

**Headers:**

```
Authorization: (session cookie)
```

**Success Response (200):**

```json
[
  {
    "_id": "550e8400-e29b-41d4-a716-446655440000",
    "quiz": "651a2b3c4d5e6f7a8b9c0d1e",
    "student": "123",
    "course": "RS101",
    "attemptNumber": 1,
    "score": 30,
    "totalPoints": 30,
    "percentage": 100,
    "status": "SUBMITTED",
    "submittedTime": "2024-12-06T15:45:00.000Z"
  },
  {
    "_id": "550e8400-e29b-41d4-a716-446655440001",
    "quiz": "651a2b3c4d5e6f7a8b9c0d1e",
    "student": "123",
    "course": "RS101",
    "attemptNumber": 2,
    "score": 25,
    "totalPoints": 30,
    "percentage": 83,
    "status": "SUBMITTED",
    "submittedTime": "2024-12-07T15:45:00.000Z"
  }
]
```

**Error Responses:**

- `500` - Server error

**Example:**

```typescript
const attempts = await client.getStudentAttempts("651a2b3c4d5e6f7a8b9c0d1e");
```

---

### 6. Get All Attempts for Quiz (Instructor)

**Endpoint:** `GET /api/quizzes/:quizId/attempts/all`

**Description:** Lists all attempts for a quiz by all students

**Parameters:**

- `quizId` (path) - The quiz ID

**Headers:**

```
Authorization: (session cookie - instructor only)
```

**Success Response (200):**

```json
[
  {
    "_id": "550e8400...",
    "quiz": "651a2b3c...",
    "student": "123",
    "attemptNumber": 1,
    "score": 30,
    "percentage": 100,
    "status": "SUBMITTED"
  },
  {
    "_id": "550e8400...",
    "quiz": "651a2b3c...",
    "student": "234",
    "attemptNumber": 1,
    "score": 20,
    "percentage": 67,
    "status": "SUBMITTED"
  }
]
```

**Error Responses:**

- `500` - Server error

**Example:**

```typescript
const allAttempts = await client.getStudentAttempts("651a2b3c4d5e6f7a8b9c0d1e");
```

---

## Quiz Endpoints

### 7. Get Quiz by ID

**Endpoint:** `GET /api/quizzes/:quizId`

**Description:** Retrieves complete quiz with all questions and metadata

**Parameters:**

- `quizId` (path) - The quiz ID

**Headers:**

```
Authorization: (session cookie)
```

**Success Response (200):**

```json
{
  "_id": "651a2b3c4d5e6f7a8b9c0d1e",
  "title": "Midterm: Propulsion Fundamentals",
  "course": "RS101",
  "description": "This quiz covers rocket propulsion basics",
  "quizType": "GRADED_QUIZ",
  "points": 30,
  "assignmentGroup": "QUIZZES",
  "shuffleAnswers": true,
  "timeLimit": 20,
  "multipleAttempts": false,
  "howManyAttempts": 1,
  "showCorrectAnswers": "IMMEDIATELY",
  "accessCode": "",
  "oneQuestionAtTime": true,
  "webcamRequired": false,
  "lockQuestionsAfterAnswering": false,
  "dueDate": "2024-12-15",
  "dueTime": "23:59",
  "availDate": "2024-12-01",
  "availTime": "09:00",
  "published": true,
  "questions": [
    {
      "_id": "651a2b3c4d5e6f7a8b9c0d1f",
      "type": "MULTIPLE_CHOICE",
      "title": "Oxidizers",
      "points": 10,
      "question": "Which is commonly used as oxidizer?",
      "choices": [
        { "text": "Liquid Oxygen", "isCorrect": true },
        { "text": "Kerosene", "isCorrect": false },
        { "text": "Liquid Hydrogen", "isCorrect": false },
        { "text": "Nitrogen", "isCorrect": false }
      ]
    },
    {
      "_id": "651a2b3c4d5e6f7a8b9c0d20",
      "type": "TRUE_FALSE",
      "title": "Newton's Third Law",
      "points": 10,
      "question": "Newton's 3rd Law: action = opposite reaction",
      "correctAnswer": true
    },
    {
      "_id": "651a2b3c4d5e6f7a8b9c0d21",
      "type": "FILL_IN_BLANK",
      "title": "Thrust Definition",
      "points": 10,
      "question": "Force that propels rocket up is _____",
      "possibleAnswers": ["Thrust", "thrust", "THRUST"]
    }
  ]
}
```

**Error Responses:**

- `404` - Quiz not found
- `500` - Server error

**Example:**

```typescript
const quiz = await axiosWithCredentials.get(
  `${HTTP_SERVER}/api/quizzes/651a2b3c4d5e6f7a8b9c0d1e`
);
```

---

## Question Type Specifications

### Multiple Choice Question

```json
{
  "_id": "string",
  "type": "MULTIPLE_CHOICE",
  "title": "Question Title",
  "points": 10,
  "question": "Question text in HTML",
  "choices": [
    { "text": "Option A", "isCorrect": true },
    { "text": "Option B", "isCorrect": false },
    { "text": "Option C", "isCorrect": false },
    { "text": "Option D", "isCorrect": false }
  ]
}
```

**Answer Format:**

```json
{
  "questionId": "...",
  "selectedAnswer": "Option A"
}
```

---

### True/False Question

```json
{
  "_id": "string",
  "type": "TRUE_FALSE",
  "title": "Question Title",
  "points": 10,
  "question": "Question statement in HTML",
  "correctAnswer": true // or false
}
```

**Answer Format:**

```json
{
  "questionId": "...",
  "selectedAnswer": true // or false
}
```

---

### Fill in Blank Question

```json
{
  "_id": "string",
  "type": "FILL_IN_BLANK",
  "title": "Question Title",
  "points": 10,
  "question": "Complete the sentence: _____",
  "possibleAnswers": [
    "Answer 1",
    "answer 1", // case variations
    "ANSWER 1"
  ]
}
```

**Answer Format:**

```json
{
  "questionId": "...",
  "selectedAnswer": "Answer 1"
}
```

---

## Error Responses

### Common Error Codes

```json
{
  "404": {
    "message": "Quiz not found"
  },
  "403": {
    "message": "Quiz already submitted. No more attempts allowed."
  },
  "403": {
    "message": "Maximum attempts (3) reached."
  },
  "500": {
    "message": "Error starting quiz attempt",
    "error": "..."
  }
}
```

---

## Rate Limiting & Throttling

- No rate limiting implemented
- Auto-save can be called frequently (recommended: every 30 seconds)
- Final submit should be called once when student clicks Submit

---

## Data Types

### Answer Object

```typescript
interface Answer {
  questionId: string;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";
  selectedAnswer: string | boolean;
  isCorrect?: boolean; // Added after grading
}
```

### QuizAttempt Object

```typescript
interface QuizAttempt {
  _id: string;
  quiz: string;
  student: string;
  course: string;
  attemptNumber: number;
  answers: Answer[];
  score?: number;
  totalPoints?: number;
  percentage?: number;
  startTime: Date;
  submittedTime?: Date;
  status: "IN_PROGRESS" | "SUBMITTED";
}
```

### SubmitResponse

```typescript
interface SubmitResponse {
  score: number;
  totalPoints: number;
  percentage: number;
  answers: Answer[]; // With isCorrect populated
}
```

---

## Usage Examples

### Complete Quiz Taking Flow

```typescript
// 1. Start attempt
const attempt = await startQuizAttempt(quizId, courseId);
// Returns: { _id: "...", status: "IN_PROGRESS", answers: [] }

// 2. Get quiz details
const quiz = await getQuiz(quizId);
// Returns: { questions: [...], timeLimit: 20, ... }

// 3. Answer questions (as user fills out)
dispatch(updateAnswer({ questionId: "q1", selectedAnswer: "Answer" }));
// Stored in Redux state

// 4. Optional: Auto-save periodically
await updateAttemptAnswers(attempt._id, answers);

// 5. Submit quiz
const results = await submitQuizAttempt(attempt._id, answers);
// Returns: { score: 30, percentage: 100, answers: [...] }

// 6. Get previous attempts
const previousAttempts = await getStudentAttempts(quizId);
// Returns: [{ attemptNumber: 1, score: 30, ... }]
```

---

## Security Considerations

1. **Authentication Required**: All endpoints require logged-in user
2. **Student Isolation**: Students can only access their own attempts
3. **Attempt Limits**: Enforced server-side, not client-side
4. **Date Validation**: Done server-side
5. **Scoring**: Always calculated server-side, never by client
6. **Answer Validation**: All answers validated against quiz structure

---

## Testing API with cURL

```bash
# Start attempt
curl -X POST http://localhost:4000/api/quizzes/QUIZ_ID/courses/COURSE_ID/attempts \
  -H "Content-Type: application/json" \
  -b "connect.sid=SESSION_COOKIE"

# Get attempt
curl http://localhost:4000/api/attempts/ATTEMPT_ID \
  -b "connect.sid=SESSION_COOKIE"

# Submit quiz
curl -X POST http://localhost:4000/api/attempts/ATTEMPT_ID/submit \
  -H "Content-Type: application/json" \
  -d '{"answers":[{"questionId":"Q1","selectedAnswer":"Liquid Oxygen"}]}' \
  -b "connect.sid=SESSION_COOKIE"
```

---

## Implementation Status

✅ All 7 endpoints implemented
✅ All question types supported
✅ Full scoring engine
✅ Error handling
✅ Attempt limiting
✅ Date validation
✅ Session-based authentication
