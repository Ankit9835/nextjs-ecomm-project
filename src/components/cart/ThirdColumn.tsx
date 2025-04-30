'use client';
import { useState } from 'react';
import SelectProductAmount from '../single-product/SelectProductAmount';
import { Mode } from '../single-product/SelectProductAmount';
import FormContainer from '../forms/FormContainer';
import { SubmitButton } from '../forms/Buttons';
import { useToast } from '@/hooks/use-toast';
import { removeCartItemAction, updateCartItemAction } from '@/src/utils/action';

const ThirdColumn = ({id,quantity}:{id:string,quantity:number}) => {
    const [amount,setAmount] = useState(quantity)
    const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
    const handleAmountChange = async (value: number) => {
        setIsLoading(true);
        toast({ description: 'Calculating...' });
        const result = await updateCartItemAction({
        amount: value,
        cartItemId: id,
        });
        setAmount(value);
        toast({ description: result.message });
        setIsLoading(false);
      };
    
  return (
    <div className='md:ml-8'>
    <SelectProductAmount
      amount={amount}
      setAmount={handleAmountChange}
      mode={Mode.CartItem}
      isLoading={isLoading}
    />
    <FormContainer action={removeCartItemAction}>
      <input type='hidden' name='id' value={id} />
      <SubmitButton size='sm' className='mt-4' text='remove' />
    </FormContainer>
  </div>
  )
}

export default ThirdColumn
