import Link from 'next/link'

export default function Footer() {
    return (
        <footer className='justify-center border-b mt-2'>
            <div className='flex justify-between text-white bg-amber-950'>
                <p>Footer menu</p>
            </div>
            <div className='flex bg-amber-800 text-white'>
                <p>Footer area</p>
            </div>            
        </footer>
    )
}