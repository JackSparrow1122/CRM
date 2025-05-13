import axios from 'axios';
import React, { useEffect, useState } from 'react';

const User = () => {
  const [users, setUsers] = useState([]); // All users from the API
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered users for display
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState(""); // Search input value
  const [error, setError] = useState(""); // Error message state
  const [editingUser, setEditingUser] = useState(null); // User being edited
  const [updatedUser, setUpdatedUser] = useState({}); // Updated user data

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const baseUrl = `contactmbackend-production.up.railway.app/contacts/${1}`;
      const resp = await axios.get(baseUrl);
      setUsers(resp.data);
      setFilteredUsers(resp.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSortedUsers = async (order) => {
    try {
      const baseUrl = `contactmbackend-production.up.railway.app/contacts${order}`;
      const resp = await axios.get(baseUrl);
      setUsers(resp.data);
      setFilteredUsers(resp.data);
    } catch (error) {
      console.error(`Error fetching ${order} users:`, error);
      setError(`Failed to sort users ${order}.`);
    }
  };

  const handleSort = (event) => {
    const value = event.target.value;
    if (value === "reset") {
      fetchData(); // Reset to default data
    } else {
      fetchSortedUsers(value === "AtoZ" ? "AtoZ" : "ZtoA");
    }
  };

  // Handle search input change
  const handleSearchInput = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const baseUrl = `contactmbackend-production.up.railway.app/serch?query=${searchQuery}`;
      const resp = await axios.get(baseUrl);
      setUsers(resp.data);
      setFilteredUsers(resp.data);
    } catch (error) {
      console.error('Error searching users:', error);
      setError("Failed to search users. Please try again later.");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user); // Set user to edit
    setUpdatedUser({ ...user }); // Pre-fill the form with user data
  };

  // Handle form input change for editing
  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Save the updated user
  const handleSaveEdit = async () => {
    try {
      const resp = await axios.put(`contactmbackend-production.up.railway.app/update/${updatedUser.id}`, updatedUser);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? resp.data : user))
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? resp.data : user))
      );
      setEditingUser(null); // Close the edit form
    } catch (error) {
      console.error('Error updating user:', error);
      setError("Failed to update user. Please try again later.");
    }
  };

  // Handle Delete User
  const handleDelete = async (id) => {
    try {
      await axios.delete(`contactmbackend-production.up.railway.app/delete/1 ${id}`);
      setUsers(users.filter((user) => user.id !== id)); // Remove deleted user from the list
      setFilteredUsers(filteredUsers.filter((user) => user.id !== id)); // Update filtered list
    } catch (error) {
      console.error('Error deleting user:', error);
      setError("Failed to delete user. Please try again later.");
    }
  };

  return (
    <div>
      {/* Sorting and Search Section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          width: 300,
          marginTop: '5px'
        }}
      >
        <select
          name="sort"
          id="sort"
          onChange={handleSort}
          defaultValue=""
          style={{ width: 150 }}
        >
          <option value="" disabled>
            Sort
          </option>
          <option value="AtoZ">A to Z</option>
          <option value="ZtoA">Z to A</option>
          <option value="reset">Reset</option>
        </select>

        <form onSubmit={handleSearch} style={{ display: 'flex',  gap: '10px' ,width:100}}>
          <input
            type="text"
            placeholder="Search contacts"
            value={searchQuery}
            onChange={handleSearchInput}
            style={{ padding: '5px', width: '300px' }}
          />
          <button type="submit" style={{ padding: '5px 10px',width:70 }}>
            Search
          </button>
        </form>
      </div>

      {error && <p className="text-danger text-center">{error}</p>}

      {editingUser && (
        <div>
          <h3>Edit User</h3>
          <input
            type="text"
            name="firstName"
            value={updatedUser.firstName}
            onChange={handleEditChange}
            placeholder="First Name"
          />
          <input
            type="text"
            name="lastName"
            value={updatedUser.lastName}
            onChange={handleEditChange}
            placeholder="Last Name"
          />
          <input
            type="email"
            name="email"
            value={updatedUser.email}
            onChange={handleEditChange}
            placeholder="Email"
          />
          <button onClick={handleSaveEdit}>Save</button>
          <button onClick={() => setEditingUser(null)}>Cancel</button>
        </div>
      )}

      {loading ? (
        <p className="text-center">Loading users...</p>
      ) : filteredUsers.length > 0 ? (
        <table className="table table-bordered table-striped table-hover m-3 p-3">
          <thead className="table-dark">
            <tr>
              <th>Id</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>Actions</th> {/* Add Actions Column */}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.gender}</td>
                <td>{user.mobileNumber}</td>
                <td>{user.address}</td>
                <td>
                  {/* Edit and Delete buttons in one row */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className='btn btn-warning' onClick={() => handleEdit(user)}>Edit</button>
                    <button className='btn btn-danger' onClick={() => handleDelete(user.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="m-3 text-center">No users found.</p>
      )}
    </div>
  );
};

export default User;
