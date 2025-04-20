'use client'
import React from 'react'
import { CardSubmitButton } from '../forms/Buttons';
import FormContainer from '../forms/FormContainer';
import { toggleFavoriteAction } from '@/src/utils/action';
import { usePathname } from 'next/navigation';

type FavoriteToggleFormProps = {
  productId: string;
  favoriteId: string | null;
};



const FavoriteToggleForm = ({productId,favoriteId}: FavoriteToggleFormProps) => {
  const pathName = usePathname();
  const toggleAction = toggleFavoriteAction.bind(null, {
    productId,
    favoriteId,
    pathName,
  });
  return (
  <FormContainer action={toggleAction}>
    <CardSubmitButton isFavorite={favoriteId ? true : false}/>
   </FormContainer>
  )
}

export default FavoriteToggleForm
