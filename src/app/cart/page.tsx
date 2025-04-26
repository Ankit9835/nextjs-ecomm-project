import React from 'react'
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CartItemsList from '@/src/components/cart/CartItemsList';
import CartTotals from '@/src/components/cart/CartTotals';
import SectionTitle from '@/src/components/global/SectionTitle';
import { fetchOrCreateCart, updateCart } from '@/src/utils/action';

const CartPage = async () => {
  const { userId } = auth();
  if (!userId) redirect('/');
  const cart = await fetchOrCreateCart({ userId });
  await updateCart(cart);

  if (cart.numItemsInCart === 0) {
    return <SectionTitle text='Empty cart' />;
  }
  return (
    <>
      <SectionTitle text='Shopping Cart' />
      <div className='mt-8 grid gap-4 lg:grid-cols-12'>
        <div className='lg:col-span-8'>
          <CartItemsList cartItems={cart.cartItems} />
        </div>
        <div className='lg:col-span-4 lg:pl-4'>
          <CartTotals cart={cart} />
        </div>
      </div>
    </>
  );
}

export default CartPage
