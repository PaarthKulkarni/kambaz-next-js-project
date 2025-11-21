"use client"
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { RootState } from "../store";
import * as client from "../Courses/client";
import { CardBody, Row, Col, Card, CardImg, CardTitle, CardText, Button, FormControl } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse, setCourses} from "../Courses/reducer";
import { addEnrollment, deleteEnrollment, setEnrollments } from "../enrollmentReducer";
export default function Dashboard() {
  const [showAllCourses, setShowAllCourses] = useState(false);
  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(setCourses([ ...courses, newCourse ]));
  };

  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(setCourses(courses.map((c) => {
        if (c._id === course._id) { return course; }
        else { return c; }
    })));};


  const onDeleteCourse = async (courseId: string) => {
    const status = await client.deleteCourse(courseId);
    dispatch(setCourses(courses.filter((course) => course._id !== courseId)));
  };


  const { courses } = useSelector(
    (state: RootState) => state.coursesReducer
  );
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector(
    (state: RootState) => state.enrollmentReducer
  );
  const [course, setCourse] = useState<any>({
    _id: "0", name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15",
    image: "/images/reactjs.jpg", description: "New Description"
  });

  const isEnrolled = (courseId: string) => {
    if (!currentUser) return false;
    return enrollments.some((e) => e.user === currentUser._id && e.course === courseId);
  };

  const dispatch = useDispatch();
  const isFaculty = currentUser?.role === "FACULTY";
  const fetchCourses = async () => {
    try {
      const fetchedCourses = showAllCourses 
        ? await client.fetchAllCourses() 
        : await client.findMyCourses(); 
      dispatch(setCourses(fetchedCourses));

      const myEnrollments = await client.findMyEnrollments();
      dispatch(setEnrollments(myEnrollments));

    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (currentUser) {
        fetchCourses();
    } else {
        dispatch(setCourses([])); 
    }
  }, [currentUser, showAllCourses]);
  const handleAddNewCourse = () => {
    dispatch(addNewCourse(course));
  };

  const handleDeleteCourse = (courseId: string) => {
    dispatch(deleteCourse(courseId));
  };
  const handleUpdateCourse = () => {
    dispatch(updateCourse(course));
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await client.enrollUserInCourse(courseId);
      const newEnrollment = { _id: Date.now().toString(), user: currentUser._id, course: courseId };
      dispatch(addEnrollment(newEnrollment));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnenroll = async (courseId: string) => {
    try {
      await client.unenrollUserFromCourse(courseId);
      dispatch(deleteEnrollment({ userId: currentUser._id, courseId }));
    } catch (error) {
      console.error(error);
    }
  };

  const coursesDisplay = showAllCourses ? courses : courses.filter((course) => isEnrolled(course._id));
  return (
    <div id="wd-dashboard" style={{ marginLeft: 130, marginRight: 20 }}>
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <button className="btn btn-primary float-end" id="wd-add-new-enrollment-click" onClick={() => setShowAllCourses(!showAllCourses)}>
        {showAllCourses ? "Enrollments" : "Available"}
      </button>
      {isFaculty && (
        <>
            <h5>New Course
          <button className="btn btn-primary float-end me-2"
                  id="wd-add-new-course-click"
                  onClick={onAddNewCourse} > Add </button>
                  <button className="btn btn-warning float-end me-2"
                onClick={onUpdateCourse} id="wd-update-course-click">
          Update </button>
      </h5>
      <br />
      <FormControl value={course.name} className="mb-2" onChange={(e) => setCourse({ ...course, name: e.target.value }) }/>
      <FormControl as = "textarea" value={course.description} rows={3} onChange={(e) => setCourse({ ...course, description: e.target.value }) } />
      <hr />
      </>)}
      <h2 id="wd-dashboard-published">{showAllCourses ? "Published Courses" : "Enrolled Courses"} ({coursesDisplay.length})</h2> <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
        {coursesDisplay.map((course) => (
        <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
        <Card>
          {!showAllCourses && (<>
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
                      onDeleteCourse(course._id);
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
          </>)}
          {showAllCourses && (
            <>
            <CardImg variant="top" src="/images/reactjs.jpg" alt="React JS" width="100%" height={160} />
            <CardBody>
              <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">{course.name}</CardTitle>
              <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                {course.description}
              </CardText>
              {isEnrolled(course._id) ? (
                          <button
                            onClick={(e) => handleUnenroll(course._id)}
                            className="btn btn-danger float-end"
                          >
                            Unenroll
                          </button>
                        ) : (
                          <button
                            onClick={(e) => handleEnroll(course._id)}
                            className="btn btn-success float-end"
                          >
                            Enroll
                          </button>
                        )}
              </CardBody>
              </>
          )}
          </Card>
        </Col>
        ))}
        </Row>
      </div>
    </div>
    
);}

