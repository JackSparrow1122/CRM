import axios from 'axios';
import React, { useState } from 'react'
import './AddUser.css'; 
const SingUp = () => {
    const [user, setUser] = useState({
        fname: '',
        lname: '',
        email: '',
        dob: '',
        password: '',
      });
    
      const change = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
      };
    
      const submit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('api/user', user);
          console.log('Response:', response.data);
          window.location.href = '/login';
          alert('User Added Successfully!');
          setUser({
            fname: '',
            lname: '',
            email: '',
            dob: '',
            password: '',
          });
        } catch (error) {
          console.error('Error adding user:', error);
          alert('Failed to add user. Please try again.');
        }
      };
    
      return (
        <div className="add-user-form">
          <div className="card p-4">
            <h3 className="text-center mb-4">SignUp</h3>
            <form onSubmit={submit}>
              <div className="form-group">
                <label htmlFor="fname">First Name</label>
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  value={user.fname}
                  onChange={change}
                  required
                  placeholder="Enter First Name"
                />
              </div>
    
              <div className="form-group">
                <label htmlFor="lname">Last Name</label>
                <input
                  type="text"
                  id="lname"
                  name="lname"
                  value={user.lname}
                  onChange={change}
                  required
                  placeholder="Enter Last Name"
                />
              </div>
    
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={change}
                  required
                  placeholder="Enter Email Address"
                />
              </div>
    
              <div className="form-group">
                <label htmlFor="dob">DOB</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={user.dob}
                  onChange={change}
                  required
                />
              </div>
    
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={user.password}
                  onChange={change}
                  required
                  placeholder="Enter Password"
                />
              </div>
    
              <button type="submit" className="btn-submit">SignUp</button>
              <h6 style={{marginLeft:"35%"}}>New_User <a href="/login">Login</a></h6>
            </form>
          </div>
        </div>
      );
}

export default SingUp
