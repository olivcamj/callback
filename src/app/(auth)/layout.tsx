export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1">
      <aside className="hidden flex-1 flex-col justify-end bg-muted p-10 md:flex">
        <p className="text-2xl font-semibold tracking-tight">Callback</p>
      </aside>
      <main className="flex w-full flex-col items-center justify-center bg-background p-6 md:w-[480px] md:border-l">
        {children}
      </main>
    </div>
  );
}
