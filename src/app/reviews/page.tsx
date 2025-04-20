import { deleteReviewAction, fetchProductReviews, fetchProductReviewsByUser } from '@/src/utils/action'
import ReviewCard from '@/src/components/reviews/ReviewCard';
import SectionTitle from '@/src/components/global/SectionTitle';
import FormContainer from '@/src/components/forms/FormContainer';
import { IconButton } from '@/src/components/forms/Buttons';




const ReviewsPage = async () => {
  const reviews = await fetchProductReviewsByUser();
  if (Array.isArray(reviews)) {
  if (reviews.length === 0)
    return <SectionTitle text='you have no reviews yet' />;
  return (
   <>
     <SectionTitle text='Your Reviews' />
      <section className='grid md:grid-cols-2 gap-8 mt-4 '>
        {reviews.map((review) => {
          const { comment, rating } = review;
          const { name, image } = review.product;
          const reviewInfo = {
            comment,
            rating,
            name,
            image,
          };
          return (
            <ReviewCard key={review.id} reviewInfo={reviewInfo}>
              <DeleteReview reviewId={review.id} />
            </ReviewCard>
          );
        })}
      </section>
   </>
  )
  }
}

const DeleteReview = ({reviewId}:{reviewId:string}) => {
  const deleteReview = deleteReviewAction.bind(null, { reviewId });
  return (
    <FormContainer action={deleteReview}>
      <IconButton actionType='delete' />
    </FormContainer>
  );
}

export default ReviewsPage
