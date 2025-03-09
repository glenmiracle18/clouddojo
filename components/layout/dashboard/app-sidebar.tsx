"use client";

import * as React from "react";
import { useEffect } from "react";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  LoaderIcon,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { auth } from "@clerk/nextjs/server";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { TeamSwitcher } from "./team-switcher";
import { SearchForm } from "./search-form";
import { RiLogoutBoxLine } from "@remixicon/react";
import { SignOutButton } from "@clerk/nextjs";

const data = {
  teams: [
    {
      name: "Clouddojo",
      logo: "/team-logo.webp",
    },
    {
      name: "Acme Corp.",
      logo: "/team-logo.webp",
    },
    {
      name: "Evil Corp.",
      logo: "/team-logo.webp",
    },
  ],
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {title: "Sections",
      url: "#",
      items: [
        {
          title: "Home",
          url: "/dashboard",
          icon: SquareTerminal,
          isActive: true,
        },
        {
          title: "Practice Tests",
          url: "/dashboard/practice",
          icon: Bot,
        },
        {
          title: "Flashcards",
          url: "/dashboard/flashcards",
          icon: BookOpen,
        },
        {
          title: "Leaderboard",
          url: "/dashboard/leaderboard",
          icon: Settings2,
        },
      ]

  
}]}

// const user = auth()

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
    <SidebarHeader>
      <TeamSwitcher teams={data.teams} />
      <hr className="border-t border-border mx-2 -mt-px" />
      <SearchForm className="mt-3" />
    </SidebarHeader>
    <SidebarContent>
      {/* We create a SidebarGroup for each parent. */}
      {data.navMain.map((item) => (
        <SidebarGroup key={item.title}>
          <SidebarGroupLabel className="uppercase text-muted-foreground/60">
            {item.title}
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {item.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="group/menu-button font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
                    isActive={item.isActive}
                  >
                    <a href={item.url}>
                      {item.icon && (
                        <item.icon
                          className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                          size={22}
                          aria-hidden="true"
                        />
                      )}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
    <SidebarFooter>
      <hr className="border-t border-border mx-2 -mt-px" />
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton className="font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto">
            <RiLogoutBoxLine
              className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
              size={22}
              aria-hidden="true"
            />
            {/* <span>Sign Out</span> */}
            <SignOutButton />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
  );
}
