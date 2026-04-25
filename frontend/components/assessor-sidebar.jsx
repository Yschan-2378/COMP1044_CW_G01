"use client";

import { SquaresFour } from "@phosphor-icons/react/dist/icons/SquaresFour";
import { Users } from "@phosphor-icons/react/dist/icons/Users";
import { ClipboardText } from "@phosphor-icons/react/dist/icons/ClipboardText";
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

function AssessorSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarTitle>Assessor Portal</SidebarTitle>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main</SidebarGroupLabel>
                    <SidebarNav>
                        <SidebarItem
                            href="/assessor"
                            icon={SquaresFour}
                            label="Dashboard"
                            exact
                        />
                        <SidebarItem
                            href="/assessor/students"
                            icon={Users}
                            label="My Students"
                        />
                        <SidebarItem
                            href="/assessor/grade"
                            icon={ClipboardText}
                            label="Enter Marks"
                        />
                        <SidebarItem
                            href="/assessor/results"
                            icon={ChartBar}
                            label="My Results"
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

export default AssessorSidebar;
