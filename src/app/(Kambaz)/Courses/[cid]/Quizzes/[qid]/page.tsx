"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { Button, Row, Col, Modal, Form, FormControl } from "react-bootstrap";
import Link from "next/link";
import { FaPencilAlt } from "react-icons/fa";
import { FaSearch, FaPlus, FaCheckCircle, FaEllipsisV, FaRegFileAlt, FaCaretDown, FaTrash, FaBan } from "react-icons/fa";
import { useState } from "react";
import * as client from "../../../client";
import { updateQuiz } from "../reducer";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";

  const quiz = useSelector((state: RootState) =>
    state.quizzesReducer.quizzes.find((q: any) => q._id === qid)
  ) as any;

  if (!quiz) return <div>Some Error occured. I have no idea how you managed this, you are on your own, good luck.</div>;

  const navigateToPreview = () => {
    router.push(`/Courses/${cid}/Quizzes/${qid}/preview`);
  };

  const [showModal, setShowModal] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");

  const handlePreviewClick = () => {
    if (quiz.accessCode && quiz.accessCode.trim().length > 0) {
      setEnteredCode("");
      setShowModal(true);
    } else {
      navigateToPreview();
    }
  };

  const handleAccessCodeSubmit = () => {
    if (enteredCode === quiz.accessCode) {
      setShowModal(false);
      navigateToPreview();
    } else {
      alert("Incorrect Access Code");
    }
  };

  const handlePublish = async () => {
    const newPublishedState = !quiz.published;
    const updatedQuiz = { ...quiz, published: newPublishedState };

    await client.updateQuiz(updatedQuiz);

    dispatch(updateQuiz(updatedQuiz));
  }

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex gap-2 ms-auto">
            {isFaculty && (
                <>
                <Link href={`/Courses/${cid}/Quizzes/${qid}/Editor`}>
                    <Button variant="secondary" className="btn-sm">
                        <FaPencilAlt className="me-1" /> Edit
                    </Button>
                </Link>
                <Button variant="secondary" className="btn-sm" onClick={handlePreviewClick}>Preview</Button>
                <Button 
                    variant={quiz.published ? "danger" : "success"} 
                    className="btn-sm"
                    onClick={() => handlePublish()}
                >
                    {quiz.published ? "Unpublish" : "Publish"}
                </Button>
                </>
            )}
        </div>
      </div>
        
      <hr />

      <h2 className="mb-4">{quiz.title} </h2>

      {isFaculty && (
        <h2 className="mb-4">{quiz.published ? <><FaCheckCircle className="text-success mb-4" />Published</> : <><FaBan className="text-danger mb-4" />Unpublished</>}</h2>
      )}

      <div className="d-flex justify-content-center mb-5">
          <div className="w-75"> 
            <Row className="mb-2">
                <Col xs={4} className="text-end fw-bold">Quiz Type</Col>
                <Col xs={8}>{quiz.quizType}</Col>
            </Row>
            <Row className="mb-2">
                <Col xs={4} className="text-end fw-bold">Points</Col>
                <Col xs={8}>{quiz.points}</Col>
            </Row>
            <Row className="mb-2">
                <Col xs={4} className="text-end fw-bold">Assignment Group</Col>
                <Col xs={8}>{quiz.assignmentGroup}</Col>
            </Row>
            <Row className="mb-2">
                <Col xs={4} className="text-end fw-bold">Shuffle Answers</Col>
                <Col xs={8}>{quiz.shuffleAnswers ? "Yes" : "No"}</Col>
            </Row>
            <Row className="mb-2">
                <Col xs={4} className="text-end fw-bold">Time Limit</Col>
                <Col xs={8}>{quiz.timeLimit} Minutes</Col>
            </Row>
            <Row className="mb-2">
                <Col xs={4} className="text-end fw-bold">Multiple Attempts</Col>
                <Col xs={8}>{quiz.multipleAttempts ? "Yes" : "No"}</Col>
            </Row>
            { quiz.multipleAttempts && (
                <Row className="mb-2">
                <Col xs={4} className="text-end fw-bold">Number of Attempts</Col>
                <Col xs={8}>{quiz.howManyAttempts}</Col>
            </Row>
            )
            }
            <Row className="mb-2">
                <Col xs={4} className="text-end fw-bold">Show Correct Answers</Col>
                <Col xs={8}>{quiz.showCorrectAnswers}</Col>
            </Row>
            <Row className="mb-2">
                <Col xs={4} className="text-end fw-bold">One Question at a Time</Col>
                <Col xs={8}>{quiz.oneQuestionAtTime ? "Yes" : "No"}</Col>
            </Row>
            <Row className="mb-2">
                <Col xs={4} className="text-end fw-bold">WebCam Required</Col>
                <Col xs={8}>{quiz.webCamRequired ? "Yes" : "No"}</Col>
            </Row>
            <Row className="mb-2">
                <Col xs={4} className="text-end fw-bold">Lock Questions After Answering</Col>
                <Col xs={8}>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</Col>
            </Row>
            <Row className="mb-2">
                <Col xs={4} className="text-end fw-bold">Access Code</Col>
                <Col xs={8}>{quiz.accessCode ? "Yes" : "No"}</Col>
            </Row>
            <Row className="mb-2">
                <Col xs={4} className="text-end fw-bold">Number of Questions</Col>
                <Col xs={8}>{quiz.questions.length}</Col>
            </Row>
          </div>
      </div>
      <table className="table text-center">
        <thead>
          <tr>
            <th>Due</th>
            <th>Available from</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{quiz.dueDate}</td>
            <td>{quiz.availDate}</td>
          </tr>
        </tbody>
      </table>
      {!isFaculty && (
                <div className="d-flex justify-content-center mt-4">
                 <Button variant="danger" onClick={handlePreviewClick}>Start Quiz</Button>
                </div>
            )}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Quiz Access Code Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Enter Access Code</Form.Label>
            <FormControl
              type="test"
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value)}
              placeholder="Code"
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAccessCodeSubmit} disabled={!enteredCode}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>      
    </div>
  );
}