import React from 'react'

const NoDataMessage = ({ message }) => {
  return (
    <div className='w-full p-4 rounded-full bg-grey/50 mt-4 text-center '>
      <h1>{message}</h1>
    </div>
  )
}

export default NoDataMessage
