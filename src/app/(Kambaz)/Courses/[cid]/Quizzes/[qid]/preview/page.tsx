"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../store";
import {
  Button,
  Alert,
  Container,
  Spinner,
  Card,
  Form,
  ListGroup,
} from "react-bootstrap";
import Link from "next/link";
import { useState, useEffect } from "react";
import * as client from "../../../../client";
import {
  setCurrentAttempt,
  updateAnswer,
  setAnswers,
  submitAttempt as submitAttemptAction,
  clearAttempt,
} from "../attemptReducer";
import { FaCheckCircle, FaTimes, FaArrowLeft } from "react-icons/fa";
import "./preview.css";

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const isFaculty = currentUser?.role === "FACULTY";

  const quiz = useSelector((state: RootState) =>
    state.quizzesReducer.quizzes.find((q: any) => q._id === qid)
  ) as any;

  const { currentAttempt, answers, submitted, results } = useSelector(
    (state: RootState) => state.quizAttemptsReducer
  ) as any;

  const [loading, setLoading] = useState(false);
  const [attempting, setAttempting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  // Calculate if quiz is available
  const now = new Date();
  const availableDate = new Date(`${quiz?.availDate}T${quiz?.availTime}:00`);
  const dueDate = new Date(`${quiz?.dueDate}T${quiz?.dueTime}:00`);
  const isAvailable = now >= availableDate && now <= dueDate && quiz?.published;

  // Clear attempt state when navigating to a new quiz
  useEffect(() => {
    dispatch(clearAttempt());
    setAttempting(false);
    setCurrentQuestionIndex(0);
    setTimeRemaining(null);
    setTimerActive(false);
  }, [qid, dispatch]);

  // Timer effect
  useEffect(() => {
    if (!timerActive || !timeRemaining) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev && prev <= 1) {
          setTimerActive(false);
          handleSubmitQuiz();
          return 0;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, timeRemaining]);

  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      const attempt = await client.startQuizAttempt(
        qid as string,
        cid as string
      );
      dispatch(setCurrentAttempt(attempt));
      setAttempting(true);
      setTimeRemaining(quiz.timeLimit * 60); // Convert minutes to seconds
      setTimerActive(true);
    } catch (error: any) {
      alert(error.response?.data?.message || "Error starting quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, selectedAnswer: any) => {
    dispatch(updateAnswer({ questionId, selectedAnswer }));
  };

  const handleSubmitQuiz = async () => {
    setLoading(true);
    try {
      setTimerActive(false);
      const result = await client.submitQuizAttempt(
        currentAttempt._id,
        answers
      );
      dispatch(submitAttemptAction(result));
    } catch (error: any) {
      alert(error.response?.data?.message || "Error submitting quiz");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!quiz) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Quiz not found</Alert>
        <Link href={`/Courses/${cid}/Quizzes`}>
          <Button variant="secondary">Back to Quizzes</Button>
        </Link>
      </Container>
    );
  }

  // Faculty preview mode - can see quiz and take it
  if (isFaculty) {
    if (!attempting && !submitted) {
      return (
        <Container className="mt-5 mb-5">
          <div className="mb-4">
            <Link href={`/Courses/${cid}/Quizzes/${qid}`}>
              <Button variant="link" className="p-0">
                <FaArrowLeft /> Back to Quiz Details
              </Button>
            </Link>
          </div>
          <h2 className="mb-4">{quiz.title}</h2>
          <Alert variant="info">
            <strong>Faculty Preview Mode</strong> - You can preview this quiz as
            students would see it. Your answers will not be saved.
          </Alert>

          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Quiz Information</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Questions:</strong> {quiz.questions?.length || 0}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Points:</strong> {quiz.points}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Time Limit:</strong> {quiz.timeLimit} minutes
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>One Question at a Time:</strong>{" "}
                  {quiz.oneQuestionAtTime ? "Yes" : "No"}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          {quiz.description && (
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Instructions</Card.Title>
                <div dangerouslySetInnerHTML={{ __html: quiz.description }} />
              </Card.Body>
            </Card>
          )}

          <div className="d-flex gap-2">
            <Button
              variant="danger"
              size="lg"
              onClick={handleStartQuiz}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" className="me-2" /> : null}
              Start Preview
            </Button>
            <Link href={`/Courses/${cid}/Quizzes/${qid}/Editor`}>
              <Button variant="secondary" size="lg">
                Edit Quiz
              </Button>
            </Link>
          </div>
        </Container>
      );
    }
  } else {
    // Student mode - can only take quiz if available
    if (!isAvailable) {
      return (
        <Container className="mt-5">
          <Alert variant="warning">
            <strong>Quiz Not Available</strong>
            <br />
            {now < availableDate
              ? `This quiz will be available on ${availableDate.toLocaleString()}`
              : `This quiz is no longer available. Due date: ${dueDate.toLocaleString()}`}
          </Alert>
          <Link href={`/Courses/${cid}/Quizzes`}>
            <Button variant="secondary">Back to Quizzes</Button>
          </Link>
        </Container>
      );
    }

    if (!attempting && !submitted) {
      return (
        <Container className="mt-5 mb-5">
          <div className="mb-4">
            <Link href={`/Courses/${cid}/Quizzes/${qid}`}>
              <Button variant="link" className="p-0">
                <FaArrowLeft /> Back to Quiz Details
              </Button>
            </Link>
          </div>
          <h2 className="mb-4">{quiz.title}</h2>

          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Quiz Information</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Questions:</strong> {quiz.questions?.length || 0}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Points:</strong> {quiz.points}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Time Limit:</strong> {quiz.timeLimit} minutes
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>One Question at a Time:</strong>{" "}
                  {quiz.oneQuestionAtTime ? "Yes" : "No"}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          {quiz.description && (
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Instructions</Card.Title>
                <div dangerouslySetInnerHTML={{ __html: quiz.description }} />
              </Card.Body>
            </Card>
          )}

          <Alert variant="info">
            <strong>Important:</strong> Once you start this quiz, you will have{" "}
            {quiz.timeLimit} minutes to complete it. Make sure you are ready
            before clicking Start Quiz.
          </Alert>

          <Button
            variant="danger"
            size="lg"
            onClick={handleStartQuiz}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" className="me-2" /> : null}
            Start Quiz
          </Button>
        </Container>
      );
    }
  }

  // Quiz taking interface
  if (attempting && !submitted) {
    if (!quiz.questions || quiz.questions.length === 0) {
      return (
        <Container className="mt-5">
          <Alert variant="warning">No questions in this quiz</Alert>
        </Container>
      );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const currentAnswer = answers.find(
      (a: any) => a.questionId === currentQuestion._id
    );

    return (
      <div className="quiz-taker-container">
        <div className="quiz-timer-bar">
          <div className="timer-info">
            <strong>Time Remaining:</strong>
            <span
              className={
                timeRemaining && timeRemaining < 300 ? "text-danger" : ""
              }
            >
              {formatTime(timeRemaining || 0)}
            </span>
          </div>
          <div className="progress-info">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
        </div>

        <Container className="mt-4 mb-4">
          <div className="progress mb-4">
            <div
              className="progress-bar"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / quiz.questions.length) * 100
                }%`,
              }}
            />
          </div>

          <Card className="question-card">
            <Card.Body>
              <h5 className="mb-3">
                <strong>{currentQuestion.title}</strong> (
                {currentQuestion.points} points)
              </h5>

              <div
                className="question-content mb-4"
                dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
              />

              {(currentQuestion.type === "SINGLE_CHOICE" || currentQuestion.type === "MULTIPLE_CHOICE") && (
                <div className="choices">
                  {currentQuestion.choices.map((choice: any, idx: number) => (
                    <Form.Check
                      key={idx}
                      type={currentQuestion.type === "SINGLE_CHOICE" ? "radio" : "checkbox"}
                      id={`choice-${idx}`}
                      name={`question-${currentQuestion._id}`}
                      label={choice.text}
                      value={choice.text}
                      checked={currentAnswer?.selectedAnswer === choice.text}
                      onChange={() =>
                        handleAnswerChange(currentQuestion._id, choice.text)
                      }
                      className="mb-2"
                    />
                  ))}
                </div>
              )}

              {currentQuestion.type === "TRUE_FALSE" && (
                <div className="choices">
                  <Form.Check
                    type="radio"
                    id="true-choice"
                    name={`question-${currentQuestion._id}`}
                    label="True"
                    value="true"
                    checked={currentAnswer?.selectedAnswer === true}
                    onChange={() =>
                      handleAnswerChange(currentQuestion._id, true)
                    }
                    className="mb-2"
                  />
                  <Form.Check
                    type="radio"
                    id="false-choice"
                    name={`question-${currentQuestion._id}`}
                    label="False"
                    value="false"
                    checked={currentAnswer?.selectedAnswer === false}
                    onChange={() =>
                      handleAnswerChange(currentQuestion._id, false)
                    }
                    className="mb-2"
                  />
                </div>
              )}

              {currentQuestion.type === "FILL_IN_BLANK" && (
                <Form.Group>
                  <Form.Label>Your Answer:</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentAnswer?.selectedAnswer || ""}
                    onChange={(e) =>
                      handleAnswerChange(currentQuestion._id, e.target.value)
                    }
                    placeholder="Enter your answer"
                  />
                </Form.Group>
              )}
            </Card.Body>
          </Card>

          <div className="mt-4 d-flex justify-content-between">
            <Button
              variant="secondary"
              onClick={() =>
                setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
              }
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            {quiz.oneQuestionAtTime && (
              <div className="question-navigator">
                {quiz.questions.map((_: any, idx: number) => (
                  <Button
                    key={idx}
                    variant={
                      idx === currentQuestionIndex
                        ? "danger"
                        : answers.find((a: any) => a.questionId === _.id)
                        ? "warning"
                        : "light"
                    }
                    size="sm"
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className="mx-1"
                  >
                    {idx + 1}
                  </Button>
                ))}
              </div>
            )}

            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <Button
                variant="success"
                onClick={handleSubmitQuiz}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" className="me-2" /> : null}
                Submit Quiz
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() =>
                  setCurrentQuestionIndex(
                    Math.min(
                      quiz.questions.length - 1,
                      currentQuestionIndex + 1
                    )
                  )
                }
              >
                Next
              </Button>
            )}
          </div>
        </Container>
      </div>
    );
  }

  // Results view after submission
  if (submitted && results) {
    const percentage = ((results.score / results.totalPoints) * 100).toFixed(1);
    const rawPercentage = (results.score / results.totalPoints) * 100;
    const passedThreshold = rawPercentage >= 70;

    return (
      <Container className="mt-5 mb-5">
        <h2 className="mb-4">Quiz Results</h2>

        <Alert
          variant={passedThreshold ? "success" : "warning"}
          className="mb-4"
        >
          <div className="text-center">
            <h3 className="mb-3">
              {passedThreshold ? (
                <FaCheckCircle className="me-2" />
              ) : (
                <FaTimes className="me-2" />
              )}
              {passedThreshold ? "Passed" : "Did Not Pass"}
            </h3>
            <h4 className="mb-2">
              Score: {results.score} / {results.totalPoints} ({percentage}%)
            </h4>
          </div>
        </Alert>

        <Card className="mb-4">
          <Card.Title className="p-3">Question Review</Card.Title>
          <ListGroup variant="flush">
            {results.answers.map((answer: any, idx: number) => {
              const question = quiz.questions.find(
                (q: any) => q._id === answer.questionId
              );
              return (
                <ListGroup.Item
                  key={idx}
                  className={
                    answer.isCorrect
                      ? "list-group-item-success"
                      : "list-group-item-danger"
                  }
                >
                  <div className="d-flex align-items-start">
                    <div className="me-3">
                      {answer.isCorrect ? (
                        <FaCheckCircle className="text-success" size={20} />
                      ) : (
                        <FaTimes className="text-danger" size={20} />
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{question?.title}</h6>
                      <p className="mb-1">
                        <strong>Your Answer:</strong>{" "}
                        {String(answer.selectedAnswer)}
                      </p>
                      <p className="mb-0 text-success">
                        <strong>Correct Answer:</strong>{" "}
                        {(question?.type === "SINGLE_CHOICE" || question?.type === "MULTIPLE_CHOICE")
                          ? question?.choices.find((c: any) => c.isCorrect)
                              ?.text
                          : question?.type === "TRUE_FALSE"
                          ? String(question?.correctAnswer)
                          : question?.blanks
                          ? question?.blanks
                              .map((b: any) => b.possibleAnswers?.join(", "))
                              .join(" | ")
                          : question?.possibleAnswers?.join(", ")}
                      </p>
                      <small className="text-muted">
                        {answer.isCorrect ? "Correct" : "Incorrect"} -{" "}
                        {question?.points} points
                      </small>
                    </div>
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Card>

        <div className="d-flex gap-2">
          <Link href={`/Courses/${cid}/Quizzes`}>
            <Button variant="secondary">Back to Quizzes</Button>
          </Link>
          {!isFaculty && quiz.multipleAttempts && (
            <Button
              variant="primary"
              onClick={() => {
                dispatch(clearAttempt());
                setAttempting(false);
                handleStartQuiz();
              }}
            >
              Retake Quiz
            </Button>
          )}
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Alert variant="danger">An error occurred. Please try again.</Alert>
    </Container>
  );
}
