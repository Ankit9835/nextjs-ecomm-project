import React from 'react'
import Image from 'next/image';
import { formatCurrency } from '@/src/utils/format';
import FavoriteToggleButton from '@/src/components/products/FavoriteToggleButton';
import AddToCart from '@/src/components/single-product/AddToCart';
import ProductRating from '@/src/components/single-product/ProductRating';
import { fetchSingleProduct } from '@/src/utils/action';
import BreadCrumbs from '@/src/components/single-product/BreadCrumbs';

const SingleProduct = async ({params}:{params:{id:string}}) => {
    const singleProduct = await fetchSingleProduct(params.id)
    const {image,name,price,description,company} = singleProduct
    const dollarAmounts = formatCurrency(price)
  return (
    <section>
        <BreadCrumbs name={name} />
        <div className='mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16'>
            {/* IMAGE FIRST COL */}
        <div className='relative h-full'>
          <Image
            src={image}
            alt={name}
            fill
            sizes='(max-width:768px) 100vw,(max-width:1200px) 50vw,33vw'
            priority
            className='w-full rounded-md object-cover'
          />
        </div>
        <div>
            <div className='flex gap-x-8 items-center'>
                <h1 className='capitalize text-3xl font-bold'>{name}</h1>
                <FavoriteToggleButton productId={params.id} />
            </div>
            <ProductRating productId={params.id} />
            <h4 className='text-xl mt-2'>{company}</h4>
          <p className='mt-3 text-md bg-muted inline-block p-2 rounded-md'>
            {dollarAmounts}
          </p>
          <p className='mt-6 leading-8 text-muted-foreground'>{description}</p>
          <AddToCart productId={params.id} />
        </div>
        </div>
    </section>
  )
}

export default SingleProduct
