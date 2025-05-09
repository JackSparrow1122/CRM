import React, { useContext } from 'react'
import { User2 } from './ParentProvider';
const Child = () => {
const Myname2=useContext(User2);
  return (
    <div>
      <h1>My Name Is :{Myname2}</h1>
    </div>
  )
}
export default Child
