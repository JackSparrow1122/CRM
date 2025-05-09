import React from 'react';

const Navbar = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          {/* Navbar Brand/Logo */}
          <a className="navbar-brand" href="/home">Contact Manager</a>

          {/* Hamburger Icon to toggle menu on mobile */}
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarSupportedContent" // Correct ID reference for collapsible menu
            aria-controls="navbarSupportedContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          {/* Navbar links */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/home">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/Add">Add Contacts</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/User">Contacts</a>
              </li>
            </ul>

            {/* LogOut button positioned at the right */}
            <button style={{color:'white', width:"80px"}} className="btn btn-danger ms-auto">
              <a href="/login" style={{color:'white', textDecoration: 'none'}}>LogOut</a>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
