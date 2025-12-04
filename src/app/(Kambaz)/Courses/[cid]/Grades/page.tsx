"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import * as db from "../../../Database";
import Link from "next/link";
import { FaSearch, FaPlus, FaCheckCircle, FaEllipsisV, FaRegFileAlt, FaCaretDown, FaTrash, FaBan } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { RootState } from "../../../store";
import { useSelector, useDispatch } from "react-redux";
import * as client from "../../client"
import { Dropdown } from "react-bootstrap";
import { setQuizzes } from "../Quizzes/reducer";

export default function Grades() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const { quizzes } = useSelector(
    (state: RootState) => state.quizzesReducer
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  const isFaculty = currentUser?.role === "FACULTY";

  const fetchQuizzes = async () => {
    if (!cid) return;
    const quizzes = await client.findQuizzesForCourse(cid as string);
    dispatch(setQuizzes(quizzes));
  };

  useEffect(() => {
    fetchQuizzes();
  }, [cid]);


  const handlePublishToggle = async (quiz: any) => {
  const newPublishedState = !quiz.published;
  const updatedQuiz = { ...quiz, published: newPublishedState };
  
  await client.updateQuiz(updatedQuiz);
  
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
      />
      </div>
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
        {isFaculty && (quizzes.filter((quiz: any) => quiz.course === cid)
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
            </div>
        </div>
        </ListGroupItem>
        )))}
        {!isFaculty && (quizzes.filter((quiz: any) => quiz.course === cid && quiz.published === true)
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
