import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid,
  MessageCircle,
  Mail,
  NotebookPen,
  ListChecks,
  Code2,
  Waves,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "AI Directory", url: "/", icon: LayoutGrid },
  { title: "Chatbot", url: "/chat", icon: MessageCircle },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Meeting Notes", url: "/notes", icon: NotebookPen },
  { title: "Task Planner", url: "/tasks", icon: ListChecks },
  { title: "Python Reviewer", url: "/python", icon: Code2 },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/50">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-turquoise/90 text-primary shadow-md shrink-0">
            <Waves className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-base text-sidebar-foreground">AI Router</span>
              <span className="text-[10px] text-sidebar-foreground/70 uppercase tracking-wider">
                Beach mode ☀️
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = currentPath === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
