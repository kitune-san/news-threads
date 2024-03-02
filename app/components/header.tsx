import { auth } from "@/auth";
import { SignIn, SignOut } from "@/app/components/user-button"

const User = async () => {
  const session = await auth();
  if (!session?.user) return <SignIn />
  return (
    <>
      <p>{session.user.name} ({session.user.id})</p>
      <SignOut />
    </>
  );
}

export default async function Header() {
  return (
    <header className="sticky flex justify-center border-b">
      <div className="flex items-center justify-between w-full h-16 max-w-3xl px-4 mx-auto sm:px-6">
        <User />
      </div>
    </header>
  );
}