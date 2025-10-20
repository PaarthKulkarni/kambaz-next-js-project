"use client";
import Link from "next/link";
import { FormControl, FormSelect } from "react-bootstrap";
export default function Profile() {
  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>
      <FormControl id="wd-username" placeholder="username" defaultValue="alice" className="mb-2"/>
      <FormControl id="wd-password" placeholder="password" defaultValue="password" type="password" className="mb-2"/>
      <FormControl id="wd-firstname" placeholder="First Name" defaultValue="Alice" className="mb-2"/>
      <FormControl id="wd-lastname" placeholder="Last Name" defaultValue="alice" className="mb-2"/>
      <FormControl id="wd-dob" type="date" defaultValue="2000-01-01" className="mb-2"/>
      <FormControl id="wd-email" placeholder="Email" defaultValue="alice@wonderland" className="mb-2"/>
      <FormSelect id="wd-role" defaultValue="FACULTY" className="mb-2">
      <option value="USER">User</option>
      <option value="ADMIN">Admin</option>
      <option value="FACULTY">Faculty</option>
      <option value="STUDENT">Student</option>
      </FormSelect>
      <Link id="wd-signin-btn" href="Signin" className="btn btn-primary bg-danger w-100 mb-2"> Sign out </Link>
    </div>
);}

