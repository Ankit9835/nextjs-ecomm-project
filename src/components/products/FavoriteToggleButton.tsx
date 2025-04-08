import React, { useState } from 'react'
import { Button } from '../ui/button'
import { FaHeart } from 'react-icons/fa'

const FavoriteToggleButton = ({productId}:{productId:string}) => {
  return (
    <Button size='icon' variant='outline' className='p-2 cursor-pointer'>
      {productId}
      <FaHeart />
    </Button>
  )
}

export default FavoriteToggleButton
