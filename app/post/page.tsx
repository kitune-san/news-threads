import TopicForm from "@/app/components/topic/newtopic-form";
import { fetchCategories } from "@/app/lib/category";

export default async function Page() {
    const categories = await fetchCategories();

    return (
        <div>
            <TopicForm categories={categories}/>
        </div>
    );
}
