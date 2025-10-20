"use client";
import { useParams } from "next/navigation";
import React from 'react';
import { Row, Col, Button, Form,FormGroup,FormLabel,FormControl,FormSelect,FormCheck }from 'react-bootstrap';
import * as db from "../../../../Database";
import {FaTimes} from 'react-icons/fa'; 
import Link from "next/link";

export default function AssignmentEditor() {
const { cid, aid } = useParams();
  const assignment = db.assignments.find(a => aid === a._id)
  if (!assignment) {
        return <div className="text-danger">Assignment with ID **{aid}** not found in the database.</div>;
    }
  return (
    <div id="wd-assignments-editor">
      <FormGroup className="mb-3">
        <FormLabel htmlFor="wd-assignment-name" className="fw-bold">Assignment Name</FormLabel>
        <FormControl 
          id="wd-assignment-name" 
          type="text" 
          defaultValue={assignment.title}
          placeholder="Enter Assignment Name"
        />
      </FormGroup>

      <FormGroup>
        <FormControl 
          as="textarea" 
          id="wd-assignment-description" 
          rows={5} 
          cols={50}
          placeholder={assignment.desc}
          className="border"/>
        </FormGroup>

      <br />
      <Form>
        <FormGroup as={Row} className="align-items-center">
          <FormLabel column sm="3" className="text-end fw-bold">Points</FormLabel>
          <Col>
            <FormControl id="wd-points" type="number" defaultValue={assignment.marks}/>
          </Col>
        </FormGroup>

        <FormGroup as={Row} className="align-items-center">
          <FormLabel column sm="3" className="text-end fw-bold">Assignment Group</FormLabel>
          <Col>
            <FormSelect id="wd-group" defaultValue="ASSIGNMENTS">
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
            <FormSelect id="wd-display-grade-as" defaultValue="Percentage">
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
              <FormSelect id="wd-submission-type" defaultValue="Online" className="mb-3">
                <option>Online</option>
                <option>OnSite</option>
              </FormSelect>

              <FormLabel className="fw-bold">Online Entry Options</FormLabel>
              <FormCheck id="wd-text-entry" type="checkbox" label="Text Entry" />
              <FormCheck id="wd-website-url" type="checkbox" label="Website URL" />
              <FormCheck id="wd-media-recordings" type="checkbox" label="Media Recordings" />
              <FormCheck id="wd-student-annotation" type="checkbox" label="Student Annotation" />
              <FormCheck id="wd-file-upload" type="checkbox" label="File Uploads" />
            </div>
          </Col>
        </FormGroup>

        <br/>
        <FormGroup as={Row}>
          <FormLabel column sm="3" className="text-end fw-bold">Assign</FormLabel>
          <Col>
            <div className="border p-3 rounded">
              
              <FormGroup className="mb-2">
                <FormLabel htmlFor="wd-assign-to" className="fw-bold">Assign to</FormLabel>
                <div className="d-flex border rounded p-2 bg-light align-items-center justify-content-between">
                    <FormControl id="wd-assign-to" type="text" defaultValue="Everyone" className="border-0 p-0 bg-light shadow-none"/>
                    <FaTimes className="text-muted" role="button" />
                </div>
              </FormGroup>

              <FormGroup className="mb-2">
                <FormLabel htmlFor="wd-due-date" className="fw-bold">Due</FormLabel>
                <div className="d-flex align-items-center position-relative">
                  <FormControl 
                    type="date" 
                    id="wd-due-date" 
                    defaultValue={assignment.dueDate}
                  />
                </div>
              </FormGroup>

              <Row>
                <Col sm={6}>
                  <FormGroup className="mb-2">
                    <FormLabel htmlFor="wd-available-from" className="fw-bold">Available from</FormLabel>
                    <div className="d-flex align-items-center position-relative">
                      <FormControl 
                        type="date" 
                        id="wd-available-from" 
                        defaultValue={assignment.availDate}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col sm={6}>
                  <FormGroup className="mb-3">
                    <FormLabel htmlFor="wd-available-until" className="fw-bold">Until</FormLabel>
                    <div className="d-flex align-items-center position-relative">
                      <FormControl 
                        type="date" 
                        id="wd-available-until" 
                        defaultValue={assignment.dueDate}
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
        <Link href={`/Courses/${cid}/Assignments`}>
        <Button id="wd-cancel-btn" variant="light" className="border me-2">Cancel</Button>
        </Link>
        <Link href={`/Courses/${cid}/Assignments`}>
        <Button id="wd-save-btn" variant="danger">Save</Button>
        </Link>
      </div>
    </div>
  );
}
