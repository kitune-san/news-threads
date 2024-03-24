'use client'
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { createTopic } from '@/app/lib/post';
import { CategoriesField } from '@/app//lib/definitions';
import { TopicBox } from '@/app/components/ui/post';

export default function TopicForm({ categories }: { categories: CategoriesField[] })
{
    const initialState = { errors: {}, message: null };
    const [state, dispatch] = useFormState(createTopic, initialState);

    const [title, setTitle] = useState('');
    const [body,  setBody] = useState('');

    const initPreview = { visible: false, title: '', body: '' };
    const [preview, updatePreview] = useState(initPreview);
    const clickPreviewButton = () => {
        updatePreview({
            visible: true,
            title: title,
            body: body
        });
    };

    return (
        <form action={dispatch}>
            <div aria-describedby='title-error'>
                <div>
                    <label className='font-medium'>Title:</label>
                </div>
                <input name='title' type='text' placeholder='Title' className='block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm'
                        value={title} onChange={(e) => setTitle(e.target.value)}/>
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
                <textarea name='body' rows={10} className='block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm'
                            value={body} onChange={(e) => setBody(e.target.value)}/>
                <div id='body-error'>
                    {state.errors?.body && state.errors?.body.map((error: string) => (
                        <p key={error} className='text-red-500'>{error}</p>
                    ))}
                </div>
            </div>
            <div>
                <div>
                    <label className='font-medium'>Category:</label>
                </div>
                <select name='categoryId' defaultValue="" className='block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm'>
                    <option value="" disabled>
                        Select a category
                    </option>
                    {categories.map((category) => (
                        <option key={`category-${category?.id}`} value={category?.id}>
                            {category?.name}
                        </option>
                    ))}
                </select>
                <div id='category-error'>
                    {state.errors?.categoryId && state.errors?.categoryId.map((error: string) => (
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
                {preview.visible && <div className='mt-2'>
                    <TopicBox title={preview.title} href='' sub='' body={preview.body}/>
                </div>}
                <button type='button' onClick={clickPreviewButton} className='mt-2 mr-2 pl-2 pr-2 rounded-md border-2 border-[#AA9D80] bg-[#E8D8B8]'>PREVIEW</button>
                {preview.visible && <button type='submit' className='mt-2 pl-2 pr-2 rounded-md border-2 border-[#AA9D80] bg-[#E8D8B8]'>POST</button>}
            </div>
        </form>
    );
}