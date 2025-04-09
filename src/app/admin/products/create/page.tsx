import React from 'react'
import { Input } from '@/src/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { faker } from '@faker-js/faker';
import FormContainer from '@/src/components/forms/FormContainer';
import FormInput from '@/src/components/forms/FormInput';
import PriceInput from '@/src/components/forms/PriceInput';
import ImageInput from '@/src/components/forms/ImageInput';
import TextAreaInput from '@/src/components/forms/TextAreaInput';
import CheckboxInput from '@/src/components/forms/CheckBoxInput';
import { SubmitButton } from '@/src/components/forms/Buttons';
import { createProductAction } from '@/src/utils/action';



const CreateProduct = () => {
  const name = faker.commerce.productName();
  const company = faker.company.name();
  const description = faker.lorem.paragraph({ min: 10, max: 12 });
  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>
        create product
      </h1>
      <FormContainer action={createProductAction}>
          <div className='grid gap-4 md:grid-cols-2 my-4'>
            <FormInput
              type='text'
              name='name'
              label='product name'
              defaultValue={name}
            />
            <FormInput
              type='text'
              name='company'
              label='company'
              defaultValue={company}
            />
            <PriceInput />
            <ImageInput />
          </div>
          <TextAreaInput
            name='description'
            labelText='product description'
            defaultValue={description}
          />
          <div className='mt-6'>
            <CheckboxInput name='featured' label='featured' />
          </div>

          <SubmitButton text='Create Product' className='mt-8' />
        </FormContainer>
    </section>

  )
}

export default CreateProduct
