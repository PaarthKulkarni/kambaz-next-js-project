"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Nav, Card, Badge, Table, Alert, Container, Spinner } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import * as client from "../../../client";
import { useRouter } from "next/navigation";

export default function GradeDetails() {
  const router = useRouter();
  const { cid, qid } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [activeAttempt, setActiveAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        try {
            const q = await client.findQuizzesForCourse(cid as string).then((qs: any[]) => qs.find((x) => x._id === qid));
            setQuiz(q);

            const att = await client.getStudentAttempts(qid as string);
            setAttempts(att);
            
            if (att && att.length > 0) {
                setActiveAttempt(att[0]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, [cid, qid]);

  if (loading) return <Container className="p-5 text-center"><Spinner animation="border" /></Container>;
  if (!quiz) return <Container className="p-5"><Alert variant="danger">Quiz not found</Alert></Container>;

  const getUserAnswer = (questionId: string) => {
    return activeAttempt?.answers.find((a: any) => a.questionId === questionId);
  };

  const getCorrectAnswerText = (question: any) => {
    switch (question.type) {
        case "TRUE_FALSE":
            return question.correctAnswer ? "True" : "False";
        case "MULTIPLE_CHOICE":
        case "SINGLE_CHOICE":
            return question.choices.filter((c: any) => c.isCorrect).map((c: any) => c.text).join(", ");
        case "FILL_IN_BLANK":
            return question.possibleAnswers.join(", ");
        default:
            return "";
    }
  };

  return (
    <div className="p-4 container">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Results: {quiz.title}</h2>
        {activeAttempt && (
            <h3 className={activeAttempt.score >= (quiz.points * 0.7) ? "text-success" : "text-danger"}>
                Score: {activeAttempt.score} / {quiz.points}
            </h3>
        )}
      </div>

      {attempts.length === 0 ? (
        <Alert variant="warning">Quiz not attempted yet.</Alert>
      ) : (
        <>
            {attempts.length > 1 && (
                <Nav variant="tabs" className="mb-3">
                    {attempts.map((attempt: any, index: number) => (
                        <Nav.Item key={attempt._id}>
                            <Nav.Link 
                                active={activeAttempt?._id === attempt._id}
                                onClick={() => setActiveAttempt(attempt)}
                            >
                                Attempt {attempts.length - index} 
                                <span className="ms-2 badge bg-secondary">{attempt.score} pts</span>
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
            )}

            {activeAttempt && (
                <div className="d-flex flex-column gap-3">

                    {quiz.questions.map((question: any, idx: number) => {
                        const userAnswer = getUserAnswer(question._id);
                        const isCorrect = userAnswer?.isCorrect;
                        const userResponse = userAnswer ? String(userAnswer.selectedAnswer) : "Not Attempted";

                        return (
                            <Card key={question._id} className={`border-${isCorrect ? "success" : "danger"} mb-3`}>
                                <Card.Header className={`d-flex justify-content-between align-items-center ${isCorrect ? "bg-success" : "bg-danger"} text-white`}>
                                    <span className="fw-bold">Question {idx + 1}</span>
                                    <span>{question.points} pts</span>
                                </Card.Header>
                                <Card.Body>
                                    <div className="mb-3 lead fs-6">{question.question}</div>
                                    
                                    <Table bordered size="sm">
                                        <tbody>
                                            <tr className={isCorrect ? "table-success" : "table-danger"}>
                                                <td className="fw-bold w-25">Your Answer:</td>
                                                <td>
                                                    {isCorrect ? <FaCheckCircle className="text-success me-2"/> : <FaTimesCircle className="text-danger me-2"/>}
                                                    {userResponse}
                                                </td>
                                            </tr>
                                            {!isCorrect && (
                                                <tr className="table-light">
                                                    <td className="fw-bold text-muted">Correct Answer:</td>
                                                    <td className="text-muted">{getCorrectAnswerText(question)}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        );
                    })}
                </div>
            )}
        </>
      )}
      <button 
            onClick={() => router.push(`/Courses/${cid}/Grades`)} 
            className="btn btn-secondary me-2"> Back </button>
    </div>
  );
}