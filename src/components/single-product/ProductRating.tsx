import { fetchProductRating } from '@/src/utils/action';
import React from 'react'
import { FaStar } from 'react-icons/fa';

const ProductRating = async({productId}:{productId:string}) => {
    const result = await fetchProductRating(productId)
    const count = result?.count ?? 0
    const rating = result?.rating ?? 0
    const id = productId
    const className = `flex gap-1 items-center text-md mt-1 mb-4`;
    const countValue = `(${count}) reviews`;
    return (
      <span className={className}>
        
        <FaStar className='w-3 h-3' />
        {rating} {countValue}
      </span>
    );
}

export default ProductRating
