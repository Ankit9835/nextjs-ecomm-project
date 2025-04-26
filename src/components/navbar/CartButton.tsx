import React from 'react'
import { Button } from '@/components/ui/button';
import { LuShoppingCart } from 'react-icons/lu';
import Link from 'next/link';
import { fetchCartItems } from '@/src/utils/action';

const CartButton = async () => {
    const result = await fetchCartItems();
   
  return (
    <Button asChild variant='outline' size='icon' className='flex justify-center items-center relative'>
        <Link href='/cart'>
            <LuShoppingCart />
            <span className='absolute -top-3 -right-3 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center text-xs'>
            {typeof result === 'number'
      ? result
      : 'numItemsInCart' in result
      ? result.numItemsInCart
      : 0}
            </span>
        </Link> 
    </Button>
  )
}

export default CartButton
