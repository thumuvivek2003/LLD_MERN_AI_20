import React,{ useEffect, useState } from "react";
import {
  getUsers,
  deleteUser,
  createUser,
  updateUser
} from "../services/userService";

import UserForm from "./UserForm";

const UserTable = () => {

  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    await deleteUser(id);
    fetchUsers();
  };

  const handleAdd = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleSubmit = async (form) => {

    if (editingUser) {
      await updateUser(editingUser._id, form);
    } else {
      await createUser(form);
    }

    setShowForm(false);
    fetchUsers();
  };

  return (
    <div>

      <h2>User Management</h2>

      <button onClick={handleAdd}>
        Add User
      </button>

      {showForm && (
        <UserForm
          user={editingUser}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}

      <table border="1">

        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {users.map((user) => (

            <tr key={user._id}>

              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>

              <td>

                <button
                  onClick={() => handleEdit(user)}
                >
                  ✏️
                </button>

                <button
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default UserTable;