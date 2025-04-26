'use client';
import React from 'react'
import { Button } from '../ui/button'
import { useState } from 'react';
import SelectProductAmount from './SelectProductAmount';
import { Mode } from './SelectProductAmount';
import { useAuth } from '@clerk/nextjs';
import FormContainer from '../forms/FormContainer';
import { ProductSignInButton, SubmitButton } from '../forms/Buttons';
import { addToCartAction } from '@/src/utils/action';

const AddToCart = ({productId}:{productId:string}) => {
  const [amount,setAmount] = useState(1)
  const {userId} = useAuth()
  return (
    <div className='mt-4'>
      <SelectProductAmount mode={Mode.SingleProduct} amount={amount} setAmount={setAmount} />
      {userId ? (
        <FormContainer action={addToCartAction}>
            <input type='hidden' name='productId' value={productId} />
            <input type='hidden' name='amount' value={amount} />
            <SubmitButton text='add to cart' size='default' className='mt-8' />
        </FormContainer>
      ): <ProductSignInButton /> }
    </div>
  )
}

export default AddToCart
