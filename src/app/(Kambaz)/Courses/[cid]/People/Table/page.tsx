"use client";
import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import * as client from "../../../../Account/client";
import { findUsersByCourse } from "../../../client";
import PeopleDetails from "../Details";

export default function PeopleTable({ 
  users = [], 
  fetchUsers 
}: { 
  users?: any[]; 
  fetchUsers?: () => void; 
}) {
  const { cid } = useParams();
  const [showDetails, setShowDetails] = useState(false);
  const [showUserId, setShowUserId] = useState<string | null>(null);
  
  // Local state for when we are viewing this as a standalone Page
  const [localUsers, setLocalUsers] = useState<any[]>([]);

  // 1. Determine which users to show: Props (Admin) vs Local (Course Page)
  const usersToDisplay = users.length > 0 ? users : localUsers;

  // 2. Helper to fetch data safely if props aren't provided
  const autoFetch = async () => {

    if(!cid) return;
    try {
      // For Section 6.2, we fetch ALL users since Enrollments aren't ready yet.
      const data = await findUsersByCourse(cid as string);
      if (Array.isArray(data)) {
        setLocalUsers(data);
      } else {
        setLocalUsers([]); // Safety: server returned object or error
      }
    } catch (err) {
      console.error(err);
      setLocalUsers([]); // Safety: network error
    }
  };

  useEffect(() => {
    // If no users provided via props, fetch them ourselves
    if (users.length === 0) {
      autoFetch();
    }
  }, [users.length, cid]);

  return (
    <div id="wd-people-table">
      {showDetails && (
        <PeopleDetails
          uid={showUserId}
          onClose={() => {
            setShowDetails(false);
            if (fetchUsers) fetchUsers();
            else autoFetch();
          }}
        />
      )}
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {usersToDisplay.map((user: any) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <span className="text-decoration-none"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShowDetails(true);
                    setShowUserId(user._id);
                  }} >
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  <span className="wd-first-name">{user.firstName}</span>{" "}
                  <span className="wd-last-name">{user.lastName}</span>
                </span>
              </td>
              <td className="wd-login-id">{user.loginId}</td>
              <td className="wd-section">{user.section}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity}</td>
              <td className="wd-total-activity">{user.totalActivity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}