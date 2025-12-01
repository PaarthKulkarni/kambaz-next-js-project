
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../store";
export default function AccountNavigation() {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const path = usePathname();
  const links = currentUser ? [{ label: "Profile",  path: "Profile"}] : [
      { label: "Signin", path: `Signin`},
      { label: "Signup",   path: "Signup"},
    ];
  return (
    <ListGroup id="wd-courses-navigation"  className="wd list-group fs-5 rounded-0"> 
    {links.map((link) => {
    const fullPath = `/Account/${link.path}`;
    return(
    <ListGroupItem key = {link.path} as={Link} href={fullPath}
      className={`list-group-item border-0 ${path.includes(link.label) ? "active" : "text-danger"}`}>
        {link.label}
      </ListGroupItem>);})}
      {currentUser && currentUser.role === "ADMIN" && (
        <ListGroupItem as={Link} href="/Account/Users"
          className={`list-group-item border-0 ${path.endsWith('Users') ? "active" : "text-danger"}`}>
          Users
        </ListGroupItem>
      )}
    </ListGroup>
  );}