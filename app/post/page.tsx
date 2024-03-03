'use client'
import { newPost } from "@/app/lib/post";
import { useFormState } from 'react-dom';

export default function Page() {
    const initialState = { errors: {}, message: null };
    const [state, dispatch] = useFormState(newPost, initialState);
    
    return (
        <>
            <form action={dispatch}>
                <div aria-describedby='title-error'>
                    <label>Title:</label>
                    <input name="title" type="text" placeholder="Title" />
                    <div id='title-error'>
                        {state.errors?.title && state.errors?.title.map((error: string) => (
                            <p key={error} className="text-red-500">{error}</p>
                        ))}
                    </div>
                </div>
                <div>
                    <label>Text:</label>
                    <textarea name="body" type="text" rows="10" />
                    <div id='body-error'>
                        {state.errors?.body && state.errors?.body.map((error: string) => (
                            <p key={error} className="text-red-500">{error}</p>
                        ))}
                    </div>
                </div>
                <div>
                    <button type="submit">[POST]</button>
                    <div id='authorId-error'>
                        {state.errors?.authorId && state.errors?.authorId.map((error: string) => (
                            <p key={error} className="text-red-500">{error}</p>
                        ))}
                    </div>
                    <div id="missing-fields">
                    {
                        <p className="text-red-500" key={state.message}>
                        {state.message}
                        </p>
                    }
                    </div>
                </div>
            </form>
        </>
    );
}
