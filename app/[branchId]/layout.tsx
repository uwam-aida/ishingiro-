export default function BranchLayout({ children }: { children: React.ReactNode }) {
  // This removes the extra divs that are blocking your shop-manager layout
  return <>{children}</>;
}