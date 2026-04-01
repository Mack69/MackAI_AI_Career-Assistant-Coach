import React, { Children } from 'react'

const MainLayout = ({children}) => {
// redirect user after onboarding to dashboard

  return (
    <div className='mx-auto container mt-28 mb-20'>{children}</div>
  )
}

export default MainLayout