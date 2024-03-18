'use client'
import { useFormState } from 'react-dom';
import { createCategory } from '@/app/lib/category';

export default function CategoryForm()
{
    const initialState = { errors: {}, message: null };
    const [state, dispatch] = useFormState(createCategory, initialState);

    return (
        <form action={dispatch}>
            <div aria-describedby='name-error'>
                <div>
                    <label className='font-medium'>Name:</label>
                </div>
                <input name='name' type='text' placeholder='Name' className='block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm'/>
                <div id='name-error'>
                    {state.errors?.name && state.errors?.name.map((error: string) => (
                        <p key={error} className='text-red-500'>{error}</p>
                    ))}
                </div>
            </div>
            <div aria-describedby='description-error'>
                <div>
                    <label className='font-medium'>Description:</label>
                </div>
                <input name='description' type='text' placeholder='Description' className='block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm'/>
                <div id='description-error'>
                    {state.errors?.description && state.errors?.description.map((error: string) => (
                        <p key={error} className='text-red-500'>{error}</p>
                    ))}
                </div>
            </div>
            <div aria-describedby='image-error'>
                <div>
                    <label className='font-medium'>Image-Path:</label>
                </div>
                <input name='image' type='text' placeholder='Image-Path:' className='block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm'/>
                <div id='image-error'>
                    {state.errors?.image && state.errors?.image.map((error: string) => (
                        <p key={error} className='text-red-500'>{error}</p>
                    ))}
                </div>
            </div>
            <div>
                <div id='missing-fields'>
                {
                    <p className='text-red-500' key={state.message}>
                    {state.message}
                    </p>
                }
                </div>
                <button type='submit' className='mt-2 pl-2 pr-2 rounded-md border-2 border-[#AA9D80] bg-[#E8D8B8]'>New Category</button>
            </div>
        </form>
    )
}