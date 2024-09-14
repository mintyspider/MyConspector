import React from 'react'

const InPageNavigation = ({ routes }) => {
  return (
    <>
        <div className='md:hidden relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto'>
            {
                routes.map((route, i) => {
                    return (
                        <button key={i} className='p-4 px-5 capitalize rounded-full hover:bg-grey'>
                            {route}
                        </button>
                    );
                })
            }
        </div>
    </>
  )
}

export default InPageNavigation
