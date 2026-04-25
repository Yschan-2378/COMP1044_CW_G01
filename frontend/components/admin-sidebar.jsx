"use client";

import { SquaresFour } from "@phosphor-icons/react/dist/icons/SquaresFour";
import { Users } from "@phosphor-icons/react/dist/icons/Users";
import { UserGear } from "@phosphor-icons/react/dist/icons/UserGear";
import { Briefcase } from "@phosphor-icons/react/dist/icons/Briefcase";
import { ChartBar } from "@phosphor-icons/react/dist/icons/ChartBar";

import {
    Sidebar,
    SidebarHeader,
    SidebarTitle,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarNav,
    SidebarItem,
} from "./sidebar";
import SidebarLogout from "./sidebar-logout";

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
                <SidebarLogout />
            </SidebarFooter>
        </Sidebar>
    );
}

export default AdminSidebar;
