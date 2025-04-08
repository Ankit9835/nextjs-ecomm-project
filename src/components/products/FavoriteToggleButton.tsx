import React, { useState } from 'react'
import { Button } from '../ui/button'
import { FaHeart } from 'react-icons/fa'

const FavoriteToggleButton = ({productId}:{productId:string}) => {
  const [value,setValue] = useState(false)
  const id = productId
  if(id){
    setValue(true)
  }
  return (
    <Button size='icon' variant='outline' className='p-2 cursor-pointer'>

      <FaHeart />
    </Button>
  )
}

export default FavoriteToggleButton
