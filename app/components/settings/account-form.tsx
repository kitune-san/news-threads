'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import { setNewUserName } from '@/app/lib/user';

export default function AccountForm() {
    const ref = useRef<HTMLFormElement>(null);
    const router = useRouter();
    const [userNameState, setUserName] = useState('');

    const { data: session, status, update } = useSession();

    const initialState = { errors: {}, message: null };
    const [state, dispatch] = useFormState(setNewUserName, initialState);

    useEffect(() => {
        if (ref.current && status === 'authenticated') {
            setUserName((session.user.userName != null) ? session.user.userName: '');
         }
    }, [status]);

    useEffect(() => {
        if (ref.current && state.message === 'success') {
            update({ userName: '' });
            router.refresh();
        }
    }, [state.message])

    if (status === 'loading') return (<p>Loading</p>);
    if (status !== 'authenticated') return (<p>Error</p>)

    return (
        <form ref={ref} action={dispatch} className='px-2'>
            <div aria-describedby='username-error'>
                <div>
                    <label className='font-medium'>User Name:</label>
                </div>
                { session.user.userName ? 
                <div>
                    <input name='userName' type='text' placeholder='UserName' value={userNameState}
                        onChange={(e) => setUserName(e.target.value)} className='block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm' disabled/>
                </div>
                :
                <div>
                    <input name='userName' type='text' placeholder='UserName' value={userNameState}
                        onChange={(e) => setUserName(e.target.value)} className='block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm'/>
                    <div id='username-error'>
                        {state.errors?.userName && state.errors?.userName.map((error: string) => (
                            <p key={error} className='text-red-500'>{error}</p>
                        ))}
                    </div>
                    <button type='submit' className='mt-2 pl-2 pr-2 rounded-md border-2 border-[#AA9D80] bg-[#E8D8B8]'>Set user name</button>
                </div>}
            </div>
            <div id='missing-fields'>
                {
                    <p className='text-red-500' key={state.message}>
                    {state.message}
                    </p>
                }
            </div>
        </form>
    );
}