import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Brain, Home, LayoutDashboard, Trophy, Users, ListChecks, ListOrdered, Award } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole, signOut } = useAuth();

  const links = [
    // { to: "/", label: "Home", icon: Home },
    // Link all learning sections to the dashboard with a query param
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/dashboard?tab=lessons", label: "Lessons", icon: BookOpen },
    { to: "/dashboard?tab=quiz", label: "Quiz", icon: ListChecks },
    { to: "/dashboard?tab=leaderboard", label: "Leaderboard", icon: Award },
    { to: "/dashboard?tab=vocabulary", label: "Vocabulary", icon: ListOrdered },
    { to: "/achievements", label: "Achievements", icon: Trophy },
    // { to: "/community", label: "Community", icon: Users },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">NorthLing</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {links.map(({ to, label, icon: Icon }) => {
                  const isActive = location.pathname === to || location.pathname.startsWith(to + "/");
                  return (
                    <SidebarMenuItem key={to}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <NavLink to={to} className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
                {userRole === "admin" && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.startsWith("/admin")}>
                      <NavLink to="/admin" className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        <span>Admin</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          {!user ? (
            <Button size="sm" className="w-full" onClick={() => navigate("/auth")}>Get Started</Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
            >
              Sign Out
            </Button>
          )}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <div className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-12 items-center justify-between px-3 md:px-4">
            <div className="flex items-center gap-2 md:hidden">
              <SidebarTrigger />
            </div>
          </div>
        </div>
        <div className="container mx-auto w-full px-3 md:px-6 py-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;


