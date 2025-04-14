
import PriceInput from '@/src/components/forms/PriceInput';
import TextAreaInput from '@/src/components/forms/TextAreaInput';
import { SubmitButton } from '@/src/components/forms/Buttons';
import FormContainer from '@/src/components/forms/FormContainer';
import { fetchAdminProductDetails, updateProductAction, updateProductImageAction } from '@/src/utils/action';
import FormInput from '@/src/components/forms/FormInput';
import CheckboxInput from '@/src/components/forms/CheckBoxInput';
import ImageInputContainer from '@/src/components/forms/ImageInputContainer';
async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = await fetchAdminProductDetails(id);
  const { name, company, description, featured, price } = product;
  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>update product</h1>
      <div className='border p-8 rounded-md'>
        {/* Image Input Container */}
        <div className='border p-8 rounded-md'>
    {/* Image Input Container */}
    <ImageInputContainer
      action={updateProductImageAction}
      name={name}
      image={product.image}
      text='update image'
    >
      <input type='hidden' name='id' value={id} />
      <input type='hidden' name='url' value={product.image} />
    </ImageInputContainer>
  </div>
        <FormContainer action={updateProductAction}>
          <div className='grid gap-4 md:grid-cols-2 my-4'>
            <input type='hidden' name='id' value={id} />
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

            <PriceInput defaultValue={price} />
          </div>
          <TextAreaInput
            name='description'
            labelText='product description'
            defaultValue={description}
          />
          <div className='mt-6'>
            <CheckboxInput
              name='featured'
              label='featured'
              defaultChecked={featured}
            />
          </div>
          <SubmitButton text='update product' className='mt-8' />
        </FormContainer>
      </div>
    </section>
  );
}
export default EditProductPage;