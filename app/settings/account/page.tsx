import { SessionProvider } from "next-auth/react";
import AccountForm from "@/app/components/settings/account-form";
import { auth } from "@/auth";

export default async function Page() {
    const session = await auth();
    return (
        <div>
            <h1>Account</h1>
            <SessionProvider session={session}>
                <AccountForm />
            </SessionProvider>
        </div>
    );
}