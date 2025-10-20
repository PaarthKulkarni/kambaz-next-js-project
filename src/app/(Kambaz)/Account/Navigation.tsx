
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListGroup, ListGroupItem } from "react-bootstrap";
export default function AccountNavigation() {
  const path = usePathname();
  const links = [
      { label: "Signin", path: `Signin`},
      { label: "Signup",   path: "Signup"},
      { label: "Profile",  path: "Profile"},
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
    </ListGroup>
  );}