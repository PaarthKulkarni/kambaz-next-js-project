"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./styles.css";
import { ListGroup, ListGroupItem } from "react-bootstrap";
export default function CourseNavigation() {
  const path = usePathname();
  const pathSegments = path.split('/');
  const courseId = pathSegments[pathSegments.indexOf('Courses') + 1];
  const links = [
      { label: "Home", path: `Home`},
      { label: "Modules",   path: "Modules"},
      { label: "Piazza",  path: "Piazza"},
      { label: "Zoom",     path: "Zoom"},
      { label: "Assignments",      path: "Assignments"},
      { label: "Quizzes",      path: "Quizzes"},
      { label: "Grades",      path: "Grades"},
      { label: "People",      path: "People/Table"},
    ];
  return (
    <ListGroup id="wd-courses-navigation"  className="wd list-group fs-5 rounded-0"> 
    {links.map((link) => {
    const fullPath = `/Courses/${courseId}/${link.path}`;
    return(
    <ListGroupItem key = {link.path} as={Link} href={fullPath}
      className={`list-group-item border-0 ${path.includes(link.label) ? "active" : "text-danger"}`}>
        {link.label}
      </ListGroupItem>);})}
    </ListGroup>
  );}