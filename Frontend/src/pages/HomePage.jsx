import React from 'react'
import { Link } from 'react-router-dom'
export default function HomePage() {
  return (
    <div>
      Hi these is Home Page
      <Link className='spacing' to="/selection-sort">Go to Selection Sort Page</Link>
    </div>
  )
}
