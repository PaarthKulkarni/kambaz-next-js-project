"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import * as db from "../../../Database";
import Link from "next/link";
import { FaSearch, FaPlus, FaCheckCircle, FaEllipsisV, FaRegFileAlt, FaCaretDown, FaTrash } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { RootState } from "../../../store";
import { addAssignment, deleteAssignment } from "./reducer";
import { useSelector, useDispatch } from "react-redux";

export default function Assignments() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  const isFaculty = currentUser?.role === "FACULTY";

  const handleDeleteAssignment = (assignmentId: string) => {
      if (window.confirm("This will remove the assignment. Do you want to Continue?")) {
      dispatch(deleteAssignment(assignmentId));
    }
  };
  return (
    <div id="wd-assignments" className="p-4">
      <div className = "d-flex justify-content-between mb-3">
      <div className ="input-group me-2 w-50">
      <span className ="input-group-text">
            <FaSearch />
      </span>
      <input
        className="form-control"
        placeholder="Search for Assignments"
        id="wd-search-assignment"
      />
      </div>
      {isFaculty && (
      <div className="d-flex">
          <Button variant="secondary" id="wd-add-assignment-group" className="me-1">
            <FaPlus /> Group
          </Button>
          <Link href={`/Courses/${cid}/Assignments/new`} className="btn btn-danger me-1" id="wd-add-assignment">
          <FaPlus /> Assignment
          </Link>
        </div>
        )}
      </div>

      <ListGroup className="rounded-0">
        <ListGroupItem variant = "secondary" className="p-2">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 d-flex align-items-center">
              <BsGripVertical className="m-2 fs-4" /> 
              <span className="fw-bold text-uppercase m-2">ASSIGNMENTS</span>
              <FaCaretDown className="m-2" />
            </div>
            <div className="d-flex align-items-center">
              <span className="fw-bold align-items-center m-2">40% of Total</span>
              <FaPlus className="text-muted m-2" />
              <FaEllipsisV className="text-muted m-2" />
            </div>
          </div>
        </ListGroupItem>
        {assignments.filter((assignment: any) => assignment.course === cid)
        .map((assignment: any) => (
          <ListGroupItem
            key={assignment._id}
            className="wd-assignment-status-border p-2"
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center flex-grow-1">
              <BsGripVertical className="me-2 fs-2" />
              <FaRegFileAlt className="text-success me-3 fs-2" /> 
              <div>
                <Link href = {`/Courses/${cid}/Assignments/${assignment._id}`}
                className="wd-assignment-link text-decoration-none text-dark fw-bold">
                  {assignment.title}
                </Link>
              <div className="text-secondary fs-5">
              <span className = "text-danger">Multiple Modules </span>| <span className = "text-muted fw-bold">Not available until </span> 
              {new Date(assignment.availDate + "T00:00:00").toDateString().split(' ').slice(1).join(' ')} at {" "}
              {new Date("2000-01-01 " + assignment.availTime).toLocaleTimeString('en-US',{ hour: "numeric", minute : "numeric", hour12 : true})} <span className="fw-bold">Due </span> 
              {new Date(assignment.dueDate + "T00:00:00").toDateString().split(' ').slice(1).join(' ')} at {" "}
              {new Date("2000-01-01 " + assignment.dueTime).toLocaleTimeString('en-US',{ hour: "numeric", minute : "numeric", hour12 : true})} | {assignment.marks} pts
              </div>
            </div>
            </div>
              <div className="d-flex align-items-center ms-3">
                {isFaculty && (
                    <Button
                      variant="link"
                      onClick={() => handleDeleteAssignment(assignment._id)}
                      className="text-danger p-0 me-3"
                    >
                      <FaTrash />
                    </Button>
                  )}
          <FaCheckCircle className="text-success me-3 fs-4" />
          <FaEllipsisV className="text-muted me-3 fs-4" />
        </div>
        </div>
        </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}
