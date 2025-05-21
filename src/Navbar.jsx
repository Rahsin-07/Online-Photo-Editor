import React from 'react'

const Navbar = () => {
  return (
    <div>
       <div class="container">
  <nav 
  style={{
  height: "50px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" ,
  backgroundColor:"black",
 

}}
  class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a 
      style={{listStyle: "none", textDecoration: "none", color: "white",  fontSize: "24px",display: "flex", alignItems: "center", fontWeight: "bold",justifyContent: "center",paddingTop: "10px"}}
      class="navbar-brand" href="/">Online Image Editor</a>
    </div>
  </nav>
</div>
    </div>
  )
}

export default Navbar