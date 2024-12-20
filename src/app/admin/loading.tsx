import { Loader } from 'lucide-react';
import React from 'react'

const Loading = () => {
  return (
    <div className='flex justify-center items-center'>
      <Loader className='size-24 animate-spin'/>
    </div>
  )
}

export default Loading