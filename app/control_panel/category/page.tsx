import Link from 'next/link';
import { fetchCategories } from '@/app/lib/category'

export default async function Page() {
    const categories = await fetchCategories();

    return (
        <div>
            <Link className='mt-2 pl-2 pr-2 rounded-md border-2 border-[#AA9D80] bg-[#E8D8B8]' href='/control_panel/category/create'>Add Category</Link>
            <table className="min-w-full text-gray-900">
                <thead className="rounded-lg text-left text-sm font-normal">
                    <tr>
                        <th scope="col" className="px-3 py-3 font-medium">Category</th>
                        <th scope="col" className="px-3 py-3 font-medium">Description</th>
                        <th scope="col" className="px-3 py-3 font-medium">Image</th>
                        <th scope="col" className="px-3 py-3 font-medium">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {categories?.map((category) => (
                        <tr key={category?.name}
                        className="w-full border-b py-3 text-sm last-of-type:border-none">
                            <td className="whitespace-nowrap px-3 py-1">{category?.name}</td>
                            <td className="whitespace-nowrap px-3 py-1">{category?.description}</td>
                            <td className="whitespace-nowrap px-3 py-1">{category?.image}</td>
                            <td className="whitespace-nowrap px-3 py-1">
                                <Link href={`/control_panel/category/${category?.id}/edit`}>[Edit]</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}