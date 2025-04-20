import { fetchProductReviews } from '@/src/utils/action'
import React from 'react'
import SectionTitle from '../global/SectionTitle'
import ReviewCard from './ReviewCard'

const ProductReviews = async({productId}: {productId:string}) => {
  const reviews = await fetchProductReviews(productId)
  console.log('reviews',reviews)
  return (
    <div className='mt-16'>
      <SectionTitle text='product reviews'/>
      <div className='grid grid-cols-2 gap-8 my-8'>
      {Array.isArray(reviews) &&
  reviews.map((review) => {
    const { comment, rating, authorImageUrl, authorName } = review;
    const reviewInfo = {
      comment,
      rating,
      image: authorImageUrl,
      name: authorName,
    };
    return <ReviewCard key={review.id} reviewInfo={reviewInfo} />;
  })}

      </div>
    </div>
  )
}

export default ProductReviews
