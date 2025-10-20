import Link from "next/link";
import { FormControl } from "react-bootstrap";
export default function Signup() {
  return (
    <div id="wd-signup-screen">
      <h3>Sign up</h3>
      <FormControl id="wd-username" placeholder="username" className="mb-2"/>
      <FormControl id="wd-password" placeholder="password" type="password" className="mb-2"/> 
      <FormControl id="wd-password-verify" placeholder="verify password" type="password" className="mb-2"/> 
      <Link id="wd-signin-btn" href="Profile" className="btn btn-primary w-100 mb-2"> Sign up </Link>
      <Link  href="Signin" > Sign in </Link>
    </div>
);}

