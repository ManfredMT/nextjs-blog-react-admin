import React from 'react'

function Clickable({children}) {
  return (
    <button style={{ background: "none",
        color: "inherit",
        border: "none",
        padding: 0,
        font: "inherit",
      outline: "inherit",
      cursor: "pointer"}} >{children}</button>
  )
}

export default Clickable