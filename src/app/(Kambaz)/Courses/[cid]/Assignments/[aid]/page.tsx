"use client";
import { useParams } from "next/navigation";
import React from 'react';
import { Row, Col, Button, Form,FormGroup,FormLabel,FormControl,FormSelect,FormCheck }from 'react-bootstrap';
import * as db from "../../../../Database";
import {FaTimes} from 'react-icons/fa'; 
import Link from "next/link";
import { RootState } from "../../../../store";
import { updateAssignment, addAssignment } from "../reducer";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AssignmentEditor() {
const { cid, aid } = useParams();
const dispatch = useDispatch();
const router = useRouter();
const isNew = aid === "new";
const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const isFaculty = currentUser?.role === "FACULTY";
const existingassignment = useSelector((state: RootState) =>
  state.assignmentsReducer.assignments.find((a: any) => aid === a._id));
const [assignment, setAssignment] = useState<any>(isNew ? {
      _id: "0", title: "New Assignment", "course": cid, "marks" : 100,
      "availDate" : "2024-05-06", "availTime": "00:00", "dueDate" : "2024-05-13", "dueTime" : "23:59", "desc" : "Description"
      , "display" : "Percentage", "submission" : "Online", "assign" : "Everyone", "group" : "ASSIGNMENT"
  } : existingassignment);
  if (!isNew && !assignment) {
        return <div className="text-danger">Assignment with ID **{aid}** not found in the database.</div>;
    }

    const handleSave = () => {
      if (isNew) {
        dispatch(addAssignment(assignment));
      }
      else {
        dispatch(updateAssignment(assignment));
      }
      router.push(`/Courses/${cid}/Assignments`);
    }

    const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setAssignment({
      ...assignment,
      [e.target.id]: e.target.value,
    });
  };
  return (
    <div id="wd-assignments-editor">
      <FormGroup className="mb-3">
        <FormLabel htmlFor="title" className="fw-bold">Assignment Name</FormLabel>
        <FormControl 
          id="title" 
          type="text" 
          value={assignment.title}
          placeholder="Enter Assignment Name"
          onChange={handleChange}
          readOnly = {!isFaculty}
        />
      </FormGroup>

      <FormGroup>
        <FormControl 
          as="textarea" 
          id="desc" 
          rows={5} 
          cols={50}
          value={assignment.desc}
          onChange={handleChange}
          readOnly = {!isFaculty}
          className="border"/>
        </FormGroup>

      <br />
      <Form>
        <FormGroup as={Row} className="align-items-center">
          <FormLabel column sm="3" className="text-end fw-bold">Points</FormLabel>
          <Col>
            <FormControl id="marks" type="number" value={assignment.marks} onChange={handleChange} readOnly = {!isFaculty}/>
          </Col>
        </FormGroup>
        <FormGroup as={Row} className="align-items-center">
          <FormLabel column sm="3" className="text-end fw-bold">Assignment Group</FormLabel>
          <Col>
            <FormSelect id="group" value={assignment.group} onChange = {handleChange} disabled = {!isFaculty}>
              <option>ASSIGNMENTS</option>
              <option>QUIZZES</option>
              <option>EXAMS</option>
              <option>PROJECT</option>
            </FormSelect>
          </Col>
        </FormGroup>

        <FormGroup as={Row} className="align-items-center">
          <FormLabel column sm="3" className="text-end fw-bold">Display Grade as</FormLabel>
          <Col>
            <FormSelect id="display" value={assignment.display} onChange={handleChange} disabled = {!isFaculty}>
              <option>Percentage</option>
              <option>Marks</option>
              <option>Grades</option>
            </FormSelect>
          </Col>
        </FormGroup>

        <FormGroup as={Row}>
          <FormLabel column sm="3" className="text-end fw-bold">Submission Type</FormLabel>
          <Col>
            <div className="border p-3">
              <FormSelect id="submission" value={assignment.submission} onChange = {handleChange} className="mb-3" disabled = {!isFaculty}>
                <option>Online</option>
                <option>OnSite</option>
              </FormSelect>
              {isFaculty && assignment.submission === "Online" && (
                <>
              <FormLabel className="fw-bold">Online Entry Options</FormLabel>
              <FormCheck id="wd-text-entry" type="checkbox" label="Text Entry" disabled = {!isFaculty}/>
              <FormCheck id="wd-website-url" type="checkbox" label="Website URL" disabled = {!isFaculty}/>
              <FormCheck id="wd-media-recordings" type="checkbox" label="Media Recordings" disabled = {!isFaculty} />
              <FormCheck id="wd-student-annotation" type="checkbox" label="Student Annotation" disabled = {!isFaculty} />
              <FormCheck id="wd-file-upload" type="checkbox" label="File Uploads" disabled = {!isFaculty}/>
              </>
              )}
            </div>
          </Col>
        </FormGroup>

        <br/>
        <FormGroup as={Row}>
          <FormLabel column sm="3" className="text-end fw-bold">Assign</FormLabel>
          <Col>
            <div className="border p-3 rounded">
              
              <FormGroup className="mb-2">
                <FormLabel htmlFor="assign" className="fw-bold">Assign to</FormLabel>
                <div className="d-flex border rounded p-2 bg-light align-items-center justify-content-between">
                    <FormControl id="assign" type="text" value={assignment.assign} onChange={handleChange} className="border-0 p-0 bg-light shadow-none"/>
                    <FaTimes className="text-muted" role="button" />
                </div>
              </FormGroup>

              <FormGroup className="mb-2">
                <FormLabel htmlFor="wd-due-date" className="fw-bold">Due</FormLabel>
                <div className="d-flex align-items-center position-relative">
                  <FormControl 
                    type="date" 
                    id="wd-due-date" 
                    value={assignment.dueDate}
                    onChange={handleChange}
                    readOnly = {!isFaculty}
                  />
                </div>
              </FormGroup>

              <Row>
                <Col sm={6}>
                  <FormGroup className="mb-2">
                    <FormLabel htmlFor="availDate" className="fw-bold">Available from</FormLabel>
                    <div className="d-flex align-items-center position-relative">
                      <FormControl 
                        type="date" 
                        id="availDate" 
                        value={assignment.availDate}
                        onChange={handleChange}
                        readOnly = {!isFaculty}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col sm={6}>
                  <FormGroup className="mb-3">
                    <FormLabel htmlFor="dueDate" className="fw-bold">Until</FormLabel>
                    <div className="d-flex align-items-center position-relative">
                      <FormControl 
                        type="date" 
                        id="dueDate" 
                        value={assignment.dueDate}
                        onChange={handleChange}
                        readOnly = {!isFaculty}
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </div>
          </Col>
        </FormGroup>

      </Form>
      <hr/>

      <div className="d-flex justify-content-end">
        {isFaculty && (
          <>
        <Link href={`/Courses/${cid}/Assignments`}>
        <Button id="wd-cancel-btn" variant="light" className="border me-2">Cancel</Button>
        </Link>
        <Button id="wd-save-btn" variant="danger" onClick={handleSave}>Save</Button>
        </>
        )}
        {!isFaculty && (
          <Link href={`/Courses/${cid}/Assignments`}>
        <Button id="wd-cancel-btn" variant="light" className="border me-2">Back</Button>
        </Link>
        )}
      </div>
    </div>
  );
}
