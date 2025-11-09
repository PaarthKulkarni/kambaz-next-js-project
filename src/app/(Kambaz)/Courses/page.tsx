"use client"
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import * as db from "../Database";
import { RootState } from "../store";
import { CardBody, Row, Col, Card, CardImg, CardTitle, CardText, Button, FormControl } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse } from "../Courses/reducer";
export default function Courses() {
  const { courses } = useSelector(
    (state: RootState) => state.coursesReducer
  );
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = db;
  const [course, setCourse] = useState<any>({
    _id: "0", name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15",
    image: "/images/reactjs.jpg", description: "New Description"
  });

  const dispatch = useDispatch();
  const isFaculty = currentUser?.role === "FACULTY";
  const handleAddNewCourse = () => {
    dispatch(addNewCourse(course));
  };

  const handleDeleteCourse = (courseId: string) => {
    dispatch(deleteCourse(courseId));
  };
  const handleUpdateCourse = () => {
    dispatch(updateCourse(course));
  };



  return (
    <div id="wd-dashboard" style={{ marginLeft: 130, marginRight: 20 }}>
      <h1 id="wd-dashboard-title">Courses</h1> <hr />
      {isFaculty && (
        <>
            <h5>New Course
          <button className="btn btn-primary float-end"
                  id="wd-add-new-course-click"
                  onClick={handleAddNewCourse} > Add </button>
                  <button className="btn btn-warning float-end me-2"
                onClick={handleUpdateCourse} id="wd-update-course-click">
          Update </button>
      </h5>
      <br />
      <FormControl value={course.name} className="mb-2" onChange={(e) => setCourse({ ...course, name: e.target.value }) }/>
      <FormControl as = "textarea" value={course.description} rows={3} onChange={(e) => setCourse({ ...course, description: e.target.value }) } />
      <hr />
      </>)}
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
        {courses.filter((course) => currentUser &&
      enrollments.some(
        (enrollment) =>
          enrollment.user === currentUser._id &&
          enrollment.course === course._id
         ))
        .map((course) => (
        <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
        <Card>
          <Link href={`/Courses/${course._id}/Home`} className="wd-dashboard-course-link text-decoration-none text-dark">
            <CardImg variant="top" src="/images/reactjs.jpg" alt="React JS" width="100%" height={160} />
            <CardBody>
              <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">{course.name}</CardTitle>
              <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                {course.description}
              </CardText>
              <Button variant="primary">Go</Button>
              {isFaculty && (
                <>
              <button onClick={(event) => {
                      event.preventDefault();
                      handleDeleteCourse(course._id);
                    }} className="btn btn-danger float-end"
                    id="wd-delete-course-click">
                    Delete
            </button>
            <button onClick={(event) => {
        event.preventDefault(); 
        setCourse(course); 
    }} className="btn btn-warning float-end me-2"
        id="wd-edit-course-click">
        Edit
    </button>
    </>)}
            </CardBody>
          </Link>
          </Card>
        </Col>
        ))}
        </Row>
      </div>
    </div>
    
);}

