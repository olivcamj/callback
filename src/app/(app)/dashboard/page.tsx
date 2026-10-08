import { getCurrentUser } from "@/lib/user";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-1 flex-col gap-2 p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground">Signed in as {user.email}</p>
    </div>
  );
}
