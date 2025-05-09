import axios from 'axios';
import React, { useState } from 'react';
import Home from './Home'
const Add_User = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false); 

  const change = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const response = await axios.post('http://localhost:8080/auth', user);
      console.log('Response:', response.data);
     
      if(response.data=="ok"){
        alert('Login Successfully!');
      window.location.href = "/home"; 
      }else
      {
        alert(' Invalid Email OR Password ');
      }
      setUser({
        email: '',
        password: '',
      });
    } catch (error) {
      console.error('Error Login user:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to login. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false); 
    }
  };
  
  return (
    <div className="add-user-form">
      <div className="card p-4">
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={submit}>
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
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}           >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <h6 style={{marginLeft:"35%"}}>New_User <a href="/SignUp">SignUp</a></h6>
        </form>
       
      </div>
    </div>
  );
};

export default Add_User;
