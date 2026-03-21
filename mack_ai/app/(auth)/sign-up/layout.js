import { Chilanka } from 'next/font/google'
import React, { Children } from 'react'

const Authlayout = ({Children}) => {
  return (
    <div className='flex justify-center pt-40'>{Children}</div>
  )
}

export default Authlayout