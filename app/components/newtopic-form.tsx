'use client'
import { useFormState } from 'react-dom';
import { createTopic } from '@/app/lib/post';

export default function TopicForm()
{
    const initialState = { errors: {}, message: null };
    const [state, dispatch] = useFormState(createTopic, initialState);

    return (
        <form action={dispatch}>
            <div aria-describedby='title-error'>
                <div>
                    <label className='font-medium'>Title:</label>
                </div>
                <input name='title' type='text' placeholder='Title' className='block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm'/>
                <div id='title-error'>
                    {state.errors?.title && state.errors?.title.map((error: string) => (
                        <p key={error} className='text-red-500'>{error}</p>
                    ))}
                </div>
            </div>
            <div>
                <div>
                    <label className='font-medium'>Text:</label>
                </div>
                <textarea name='body' rows={10} className='block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm'/>
                <div id='body-error'>
                    {state.errors?.body && state.errors?.body.map((error: string) => (
                        <p key={error} className='text-red-500'>{error}</p>
                    ))}
                </div>
            </div>
            <div>
                <div id='authorId-error'>
                    {state.errors?.authorId && state.errors?.authorId.map((error: string) => (
                        <p key={error} className='text-red-500'>{error}</p>
                    ))}
                </div>
                <div id='missing-fields'>
                {
                    <p className='text-red-500' key={state.message}>
                    {state.message}
                    </p>
                }
                </div>
                <button type='submit' className='mt-2 pl-2 pr-2 rounded-md border-2 border-[#AA9D80] bg-[#E8D8B8]'>POST</button>
            </div>
        </form>
    );
}