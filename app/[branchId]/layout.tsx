// app/[branchId]/layout.tsx (The simple one)
export default function RootBranchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      {children}
    </div>
  );
}