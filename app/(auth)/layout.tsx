import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import { AppHeader } from "@/components/app-header"

import { ActivityTrackerContainer } from "@/components/layout/activity-tracker"

async function Layout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const initialRoleId = cookieStore.get("active_role")?.value || "employee"

    return (
        <SidebarProvider>
            <AppSidebar initialRoleId={initialRoleId} />
            <SidebarInset>
                <AppHeader />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
            <ActivityTrackerContainer />
        </SidebarProvider>
    )
}

export default Layout