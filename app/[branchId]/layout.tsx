export default function BranchLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode, 
  params: { branchId: string } 
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar and Header would go here */}
      <main className="flex-1 overflow-y-auto">
        {children} {/* <--- THIS MUST BE HERE OR THE PAGE IS EMPTY */}
      </main>
    </div>
  );
}