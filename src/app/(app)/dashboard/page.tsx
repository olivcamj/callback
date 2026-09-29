import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth.protect();

  return (
    <main className="flex flex-1 flex-col gap-2 p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground">Signed in as {userId}</p>
    </main>
  );
}
