import React from 'react'
import { Button } from '../ui/button'
import { FaHeart } from 'react-icons/fa'
import { auth } from '@clerk/nextjs/server'
import { CardSignInButton } from '../forms/Buttons'
import { fetchFavoriteId } from '@/src/utils/action'
import FavoriteToggleForm from './FavoriteToggleForm'

const FavoriteToggleButton = async ({productId}:{productId:string}) => {
  const {userId} = auth()
  if(!userId) return <CardSignInButton />
  const favoriteId = await fetchFavoriteId({productId})
 
  return (
      <FavoriteToggleForm productId={productId} favoriteId={favoriteId} />
  )
}

export default FavoriteToggleButton
