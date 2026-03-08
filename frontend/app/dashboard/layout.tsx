// Dashboard has its own internal header/sidebar, so we suppress the global header
// by rendering children directly without the root Providers header.
// The root layout still applies global CSS and theme.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
