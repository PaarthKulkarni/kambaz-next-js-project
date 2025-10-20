"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { RxDividerVertical } from "react-icons/rx";
export default function AccountNavigation() {
  const path = usePathname();
 return (
      <ListGroup className="rounded-0 d-none d-md-block bg-white z-2" style={{ width: 110 }}
              id="wd-account-navigation">
      <ListGroupItem className={`border-0 text-center bg-white`}>
       <Link href="Signin" id="wd-account-link" className={`${path.includes("Signin") ? "text-black" : "text-danger"} text-decoration-none`}>
       
         {path.includes("Signin") && <RxDividerVertical size={24} className="me-1 fs-1 text-black"/>}
         Signin
       </Link>
     </ListGroupItem>
     <ListGroupItem className={`border-0 text-center bg-white`}>
       <Link href="Signup" id="wd-account-link" className={`${path.includes("Signup") ? "text-black" : "text-danger"} text-decoration-none`}>
         
         {path.includes("Signup") && <RxDividerVertical size={24} className="me-1 fs-1 text-black"/>}
         Signup
       </Link>
     </ListGroupItem>
     <ListGroupItem className={`border-0 text-center bg-white`}>
       <Link href="Profile" id="wd-account-link" className={`${path.includes("Profile") ? "text-black" : "text-danger"} text-decoration-none`}>
         
         {path.includes("Profile") && <RxDividerVertical size={24} className="me-1 fs-1 text-black"/>}
         Profile
       </Link>
     </ListGroupItem>
   </ListGroup>
);}