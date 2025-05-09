import React, { useRef, useState } from 'react'

const ControllComponent = () => {
  const [user,setUser]=useState
 
const abc=useRef();
  const handleSubmit = () => {
    alert(`Submitted value: ${abc.current.value}`); // Access DOM value via ref
  };    

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          ref={abc} // Uncontrolled: DOM controls the input
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
export default ControllComponent
