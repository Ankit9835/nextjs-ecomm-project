import { Cart } from '@prisma/client'
import React from 'react'
import { Card, CardTitle } from '../ui/card';
import FormContainer from '../forms/FormContainer';
import { SubmitButton } from '../forms/Buttons';
import { formatCurrency } from '@/src/utils/format';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { createOrderAction } from '@/src/utils/action';

const CartTotals = ({cart}: {cart:Cart}) => {
const { cartTotal, shipping, tax, orderTotal } = cart;
  return (
    <div>
    <Card className='p-8 '>
        <CartTotalRow label='Subtotal' amount={cartTotal} />
        <CartTotalRow label='Shipping' amount={shipping} />
        <CartTotalRow label='Tax' amount={tax} />
        <CardTitle className='mt-8'>
          <CartTotalRow label='Order Total' amount={orderTotal} lastRow />
        </CardTitle>
      </Card>
      <FormContainer action={createOrderAction}>
        <SubmitButton text='Place Order' className='w-full mt-8' />
      </FormContainer>
    </div>
  )
}

function CartTotalRow ({label,amount,lastRow}: {label:string,amount:number,lastRow?:boolean}) {
    return (
        <>
             <p className='flex justify-between text-sm'>
        <span>{label}</span>
        <span>{formatCurrency(amount)}</span>
    </p>
    {lastRow ? null : <Separator className='my-2' />}
        </>
    )
}

export default CartTotals
