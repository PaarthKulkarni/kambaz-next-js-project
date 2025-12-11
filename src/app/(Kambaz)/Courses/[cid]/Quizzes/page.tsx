"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import * as db from "../../../Database";
import Link from "next/link";
import { FaSearch, FaPlus, FaCheckCircle, FaEllipsisV, FaRegFileAlt, FaCaretDown, FaTrash, FaBan } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { RootState } from "../../../store";
import { addQuiz, deleteQuiz, setQuizzes, updateQuiz } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import * as client from "../../client"
import { Dropdown } from "react-bootstrap";

export default function Quizzes() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const { quizzes } = useSelector(
    (state: RootState) => state.quizzesReducer
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  const [searchQuery, setSearchQuery] = useState("");

  const isFaculty = currentUser?.role === "FACULTY";

  const fetchQuizzes = async () => {
    if (!cid) return;
    const quizzes = await client.findQuizzesForCourse(cid as string);
    dispatch(setQuizzes(quizzes));
  };

  useEffect(() => {
    fetchQuizzes();
  }, [cid]);

  const handleDeleteQuiz = async (quizId: string) => {
      if (window.confirm("This will remove the quiz. Do you want to Continue?")) {
      await client.deleteQuiz(quizId);
      dispatch(deleteQuiz(quizId));
    }
  };

  const handlePublishToggle = async (quiz: any) => {
  const newPublishedState = !quiz.published;
  const updatedQuiz = { ...quiz, published: newPublishedState };
  
  await client.updateQuiz(updatedQuiz);
  
  dispatch(updateQuiz(updatedQuiz)); 
};
  return (
    <div id="wd-quizzes" className="p-4">
      <div className = "d-flex justify-content-between mb-3">
      <div className ="input-group me-2 w-50">
      <span className ="input-group-text">
            <FaSearch />
      </span>
      <input
            className="form-control"
            placeholder="Search for Quizzes"
            id="wd-search-quiz"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
      </div>
      {isFaculty && (
      <div className="d-flex">
          <Button variant="secondary" id="wd-add-quiz-group" className="me-1">
            <FaPlus /> Group
          </Button>
          <Link href={`/Courses/${cid}/Quizzes/new/Editor`} className="btn btn-danger me-1" id="wd-add-quiz">
          <FaPlus /> Quiz
          </Link>
        </div>
        )}
      </div>

      <ListGroup className="rounded-0">
        <ListGroupItem variant = "secondary" className="p-2">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 d-flex align-items-center">
              <BsGripVertical className="m-2 fs-4" /> 
              <span className="fw-bold text-uppercase m-2">QUIZZES</span>
              <FaCaretDown className="m-2" />
            </div>
            <div className="d-flex align-items-center">
              <span className="fw-bold align-items-center m-2">40% of Total</span>
              <FaPlus className="text-muted m-2" />
              <FaEllipsisV className="text-muted m-2" />
            </div>
          </div>
        </ListGroupItem>
        {isFaculty && (quizzes.filter((quiz: any) => quiz.course === cid && quiz.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a: any, b: any) => a.availDate.localeCompare(b.availDate))
        .map((quiz: any) => (
          <ListGroupItem
            key={quiz._id}
            className="wd-quiz-status-border p-2"
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center flex-grow-1">
              <BsGripVertical className="me-2 fs-2" />
              <FaRegFileAlt className="text-success me-3 fs-2" /> 
              <div>
                <Link href = {`/Courses/${cid}/Quizzes/${quiz._id}`}
                className="wd-quiz-link text-decoration-none text-dark fw-bold">
                  {quiz.title}
                </Link>
              <div className="text-secondary fs-5">
              {new Date() < new Date(`${quiz.availDate}T${quiz.availTime}:00`) ? (
              <>
              <span className="text-muted fw-bold">Not available until </span>
              {new Date(quiz.availDate + "T00:00:00").toDateString().split(' ').slice(1).join(' ')} at {" "}
              {new Date("2000-01-01 " + quiz.availTime).toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric", hour12: true })}
              </>
              ) : new Date() < new Date(`${quiz.dueDate}T${quiz.dueTime}:00`) ? (
              <span className="text-success fw-bold">Available</span>
              ) : (
              <span className="text-danger fw-bold">Closed</span>
              )} <span className="fw-bold"> | Due </span> 
              {new Date(quiz.dueDate + "T00:00:00").toDateString().split(' ').slice(1).join(' ')} at {" "}
              {new Date("2000-01-01 " + quiz.dueTime).toLocaleTimeString('en-US',{ hour: "numeric", minute : "numeric", hour12 : true})} | {quiz.points} pts | {quiz.questions.length} Questions
              </div>
            </div>
            </div>
              <div className="d-flex align-items-center ms-3">
              {quiz.published ? (
                <FaCheckCircle className="text-success me-3 fs-4" />
              ) : (
                <FaBan className="text-danger me-3 fs-4" />
              )}
              {isFaculty && (
                <Dropdown>
                  <Dropdown.Toggle variant="link" bsPrefix="p-0" className="text-decoration-none text-dark remove-caret">
                    <FaEllipsisV className="fs-4" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} href={`/Courses/${cid}/Quizzes/${quiz._id}/Editor`}>
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handlePublishToggle(quiz)}>
                      {quiz.published ? "Unpublish" : "Publish"}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDeleteQuiz(quiz._id)} className="text-danger">
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </div>
        </div>
        </ListGroupItem>
        )))}
        {!isFaculty && (quizzes.filter((quiz: any) => quiz.course === cid && quiz.published === true && quiz.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a: any, b: any) => a.availDate.localeCompare(b.availDate))
        .map((quiz: any) => (
          <ListGroupItem
            key={quiz._id}
            className="wd-quiz-status-border p-2"
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center flex-grow-1">
              <BsGripVertical className="me-2 fs-2" />
              <FaRegFileAlt className="text-success me-3 fs-2" /> 
              <div>
                <Link href = {`/Courses/${cid}/Quizzes/${quiz._id}`}
                className="wd-quiz-link text-decoration-none text-dark fw-bold">
                  {quiz.title}
                </Link>
              <div className="text-secondary fs-5">
              {new Date() < new Date(`${quiz.availDate}T${quiz.availTime}:00`) ? (
              <>
              <span className="text-muted fw-bold">Not available until </span>
              {new Date(quiz.availDate + "T00:00:00").toDateString().split(' ').slice(1).join(' ')} at {" "}
              {new Date("2000-01-01 " + quiz.availTime).toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric", hour12: true })}
              </>
              ) : new Date() < new Date(`${quiz.dueDate}T${quiz.dueTime}:00`) ? (
              <span className="text-success fw-bold">Available</span>
              ) : (
              <span className="text-danger fw-bold">Closed</span>
              )} <span className="fw-bold"> | Due </span> 
              {new Date(quiz.dueDate + "T00:00:00").toDateString().split(' ').slice(1).join(' ')} at {" "}
              {new Date("2000-01-01 " + quiz.dueTime).toLocaleTimeString('en-US',{ hour: "numeric", minute : "numeric", hour12 : true})} | {quiz.points} pts | {quiz.questions.length} Questions
              </div>
            </div>
            </div>
              <div className="d-flex align-items-center ms-3">
            </div>
        </div>
        </ListGroupItem>
        )))}
      </ListGroup>
    </div>
  );
}
