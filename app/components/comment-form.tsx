'use client'
import { useState, useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import { createComment } from '@/app/lib/post';
import { CommentBox } from './ui/post';

function VisbleCommentForm({ topic_id, parent_id, title_value } : { topic_id: number, parent_id: number | null, title_value: string}) {
    const ref = useRef<HTMLFormElement>(null);
    const initialState = { errors: {}, message: null, topic_id: topic_id, parent_id: parent_id };
    const [state, dispatch] = useFormState(createComment, initialState);

    const [titleState, setTitle] = useState(title_value);
    const [bodyState, setbody] = useState('');

    const initPreview = { visible: false, title: '', body: '' };
    const [preview, updatePreview] = useState(initPreview);
    const clickPreviewButton = () => {
        updatePreview({
            visible: true,
            title: titleState,
            body: bodyState
        });
    };

    useEffect(() => {
        if (ref.current && state.message === 'success') {
            setTitle(title_value);
            setbody('');
            updatePreview(initPreview)
            ref.current.reset();
        }
    }, [state.message])

    return (
        <form ref={ref} action={dispatch} className='px-2'>
            <div aria-describedby='title-error'>
                <div>
                    <label className='font-medium'>Title:</label>
                </div>
                <input name='title' type='text' placeholder='Title' value={titleState}
                    onChange={(e) => setTitle(e.target.value)} className='block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm'/>
                <div id='title-error'>
                    {state.errors?.title && state.errors?.title.map((error: string) => (
                        <p key={error} className='text-red-500'>{error}</p>
                    ))}
                </div>
            </div>
            <div>
                <div>
                    <label className='font-medium'>Comment:</label>
                </div>
                <textarea name='body' rows={5} value={bodyState}
                        onChange={(e) => setbody(e.target.value)} className='block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm'/>
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
                {preview.visible && <div className='mt-2 mb-1 border-2 border-[#AA9D80]'>
                    <CommentBox title={preview.title} sub='' body={preview.body}/>
                </div>}
                <button type='button' onClick={clickPreviewButton} className='mt-2 mr-2 pl-2 pr-2 rounded-md border-2 border-[#AA9D80] bg-[#E8D8B8]'>PREVIEW</button>
                {preview.visible && <button type='submit' className='mt-2 pl-2 pr-2 rounded-md border-2 border-[#AA9D80] bg-[#E8D8B8]'>POST</button>}
            </div>
        </form>
    );
}

export default function CommentForm({ topic_id, parent_id, title_value } : { topic_id: number, parent_id: number | null, title_value: string}) {
    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
        return setClicked(!clicked);
    };

    return (
        <div>
            <button type="button" onClick={handleClick} className='ml-1 mt-1 pl-2 pr-2 rounded-md border-2 border-[#AA9D80] bg-[#E8D8B8]'>Reply to this</button>
            { clicked === true ? <VisbleCommentForm topic_id={topic_id} parent_id={parent_id} title_value={title_value} /> : <></>}
        </div>
    );
}