'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { SubmitButton } from '../forms/Buttons';
import FormContainer from '../forms/FormContainer';
import RatingInput from './RatingInput';
import TextAreaInput from '../forms/TextAreaInput';
import { createReviewAction } from '@/src/utils/action';
function SubmitReview({ productId }: { productId: string }) {
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  const { user } = useUser();
  return (
    <div>
      <Button
        size='lg'
        className='capitalize'
        onClick={() => setIsReviewFormVisible((prev) => !prev)}
      >
        leave review
      </Button>
      {isReviewFormVisible && (
        <Card className='p-8 mt-8'>
          <FormContainer action={createReviewAction}>
            <input type='hidden' name='productId' value={productId} />
            <input
              type='hidden'
              name='authorName'
              value={user?.firstName || 'user'}
            />
            <input
              type='hidden'
              name='authorImageUrl'
              value={user?.imageUrl || ''}
            />
            <RatingInput name='rating' />
            <TextAreaInput
              name='comment'
              labelText='feedback'
              defaultValue='Outstanding product!!!'
            />
            <SubmitButton className='mt-4' />
          </FormContainer>
        </Card>
      )}
    </div>
  );
}

export default SubmitReview;