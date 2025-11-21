"use client";
import { Table, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useParams } from "next/navigation";
import * as db from "../../../../Database";
import * as client from "../../../client";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { FaPencil, FaPlus, FaTrash } from "react-icons/fa6";
export default function PeopleTable() {
    const { cid } = useParams();
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);
    const [users, setUsers] = useState<any[]>([]);

    const fetchUsers = async () => {
    const users = await client.findUsersByCourse(cid as string);
    setUsers(users);
  };

  useEffect(() => {
    if (cid) fetchUsers();
  }, [cid]);

  const createUser = async () => {
    const user = await client.createUser({
      firstName: "New",
      lastName: `User${users.length + 1}`,
      username: `newuser${Date.now()}`,
      password: "password123",
      section: "S101",
      role: "STUDENT",
    });
    setUsers([...users, user]);
  };

  const deleteUser = async (userId: string) => {
    await client.unenrollSpecificUserFromCourse(cid as string, userId);
    setUsers(users.filter((u) => u._id !== userId));
  };

return (
    <div id="wd-people-table">
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
            {currentUser?.role === "FACULTY" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <FaUserCircle className="me-2 fs-1 text-secondary" />
                <span className="wd-first-name">{user.firstName}</span>{" "}
                <span className="wd-last-name">{user.lastName}</span>
              </td>
              <td className="wd-login-id">{user.loginId}</td>
              <td className="wd-section">{user.section}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity}</td>
              <td className="wd-total-activity">{user.totalActivity}</td>
              {currentUser?.role === "FACULTY" && (
                <td className="text-nowrap">
                  <Button variant="danger" size="sm" onClick={() => deleteUser(user._id)} id="wd-delete-people">
                    <FaTrash />
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );}