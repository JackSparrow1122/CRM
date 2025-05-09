import axios from 'axios';
import React, { useState } from 'react';
import './Add.css'; // Ensure the correct styling
const Add_User = (userId) => {
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    mobileNumber: '',
    address: '',
  });
  const [contacts, setContacts] = useState([]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setContacts([...contacts, contact]);
      const response = await axios.post(`http://localhost:9091/contact/${userId=1}`, contact); 
      console.log('Response:', response.data);
      alert('User Added Successfully!');
      setContact({
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        mobileNumber: '',
        address: '',
      });
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user. Please try again.');
    }
  };

  return (
    <div className="contact-manager">
      <form onSubmit={handleSubmit} className="contact-form card my-6">
        <h4 style={{ marginLeft: '35%' }}>Add Contacts</h4>
        <br />
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={contact.firstName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={contact.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={contact.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select
            name="gender"
            value={contact.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="text"
            name="mobileNumber"
            value={contact.mobileNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={contact.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn-submit">
          Add Contact
        </button>
      </form>
    </div>
  );
};

export default Add_User;
