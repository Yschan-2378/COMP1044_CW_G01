"use client";

import {
    SquaresFour,
    Users,
    UserGear,
    Briefcase,
    ChartBar,
    UserCircle,
} from "@phosphor-icons/react/dist/ssr";

import {
    Sidebar,
    SidebarHeader,
    SidebarTitle,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarNav,
    SidebarItem,
    SidebarFooter,
} from "./sidebar";

function AdminSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarTitle>Admin Portal</SidebarTitle>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main</SidebarGroupLabel>
                    <SidebarNav>
                        <SidebarItem
                            href="/dashboard"
                            icon={SquaresFour}
                            label="Dashboard"
                        />
                        <SidebarItem
                            href="/students"
                            icon={Users}
                            label="Students"
                        />
                        <SidebarItem
                            href="/assessors"
                            icon={UserGear}
                            label="Assessors"
                        />
                        <SidebarItem
                            href="/internships"
                            icon={Briefcase}
                            label="Internships"
                        />
                        <SidebarItem
                            href="/results"
                            icon={ChartBar}
                            label="Results"
                        />
                    </SidebarNav>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarItem
                    href="/profile"
                    icon={UserCircle}
                    label="Profile"
                />
            </SidebarFooter>
        </Sidebar>
    );
}

export default AdminSidebar;
