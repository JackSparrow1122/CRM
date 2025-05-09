import React, {createContext } from 'react'
export const User2=createContext();
const ParentProvider = ({children}) => {
const Myname="DEEP MAHIRE"
  return (
    <div>
<User2.Provider value={Myname}>{children}</User2.Provider>
    </div>
  )
}

export default ParentProvider
