import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ExternalLink, LogOut, Users } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { supabase } from '@/integrations/supabase/client';
import logoSand from '@/assets/s0ar-horizontal-sand.svg';
import mantaSand from '@/assets/sand-manta-ray.svg';

const items = [{ title: 'Pre-registrations', url: '/admin', icon: Users }] as const;

function AdminSidebar() {
 const { state } = useSidebar();
 const collapsed = state === 'collapsed';
 return <Sidebar collapsible="icon" variant="floating">
  <SidebarContent className="gap-0">
   <div className={collapsed ? 'px-3 pt-5 pb-4' : 'px-5 pt-5 pb-4'}>
    {collapsed ? <img src={mantaSand} alt="S0AR" className="block mx-auto h-10 w-10"/> : <img src={logoSand} alt="S0AR" className="h-[34px] w-auto"/>}
   </div>
   <SidebarGroup className={collapsed ? 'pt-1 px-0' : 'pt-1'}><SidebarGroupContent><SidebarMenu>
    {items.map(item => <SidebarMenuItem key={item.url}><SidebarMenuButton asChild isActive tooltip={item.title} className={collapsed ? 'justify-center' : ''}>
     <Link to={item.url} className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}><item.icon className={collapsed ? '!h-5 !w-5' : 'h-4 w-4'} strokeWidth={1.5}/>{!collapsed && <span className="text-sm tracking-wide">{item.title}</span>}</Link>
    </SidebarMenuButton></SidebarMenuItem>)}
   </SidebarMenu></SidebarGroupContent></SidebarGroup>
  </SidebarContent>
  <SidebarFooter className="px-3 pb-4">
   <a href="/" target="_blank" rel="noreferrer" className={`admin-live-link ${collapsed ? 'justify-center' : 'gap-2'}`}><ExternalLink className={collapsed ? 'h-5 w-5' : 'h-3.5 w-3.5'} strokeWidth={1.5}/>{!collapsed && <span>View live page</span>}</a>
  </SidebarFooter>
 </Sidebar>;
}

export function AdminShell({ children }: { children: ReactNode }) {
 const navigate = useNavigate();
 const [state, setState] = useState<{ loading: boolean; email: string; admin: boolean }>({ loading: true, email: '', admin: false });
 useEffect(() => {
  (async () => {
   const { data } = await supabase.auth.getUser();
   const user = data.user;
   if (!user) return;
   const { data: admin } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
   setState({ loading: false, email: user.email ?? '', admin: admin === true });
  })();
 }, []);
 async function signOut() { await supabase.auth.signOut(); navigate({ to: '/auth', search: { next: undefined }, replace: true }); }

 if (state.loading) return <div className="min-h-screen flex items-center justify-center"><p className="admin-label text-muted-foreground">Loading admin…</p></div>;
 if (!state.admin) return <div className="admin-scope min-h-screen flex items-center justify-center px-6"><div className="text-center max-w-sm space-y-3">
  <p className="admin-label text-primary">/ Confirm your email</p><h1 className="text-3xl">Almost there</h1>
  <p className="text-sm text-muted-foreground">{state.email} needs a confirmed email before the hub opens. Check your inbox, then sign in again.</p>
  <button onClick={signOut} className="admin-label hover:text-destructive">Sign out</button>
 </div></div>;

 return <SidebarProvider style={{ '--sidebar-width-icon': '4.5rem' } as CSSProperties}>
  <div className="admin-scope h-screen overflow-hidden flex w-full">
   <AdminSidebar/>
   <div className="flex-1 flex flex-col min-w-0">
    <header className="admin-topbar">
     <SidebarTrigger/><div className="h-5 w-px bg-border"/>
     <nav aria-label="Breadcrumb" className="admin-label text-muted-foreground">Admin <span aria-hidden>/</span> <span className="text-foreground">Pre-registrations</span></nav>
     <div className="ml-auto flex items-center gap-3">
      <span className="hidden sm:inline-flex items-center gap-2 admin-label text-muted-foreground"><span className="admin-pill">Admin</span>{state.email}</span>
      <button onClick={signOut} className="inline-flex items-center gap-1.5 admin-label text-muted-foreground hover:text-destructive"><LogOut className="w-3.5 h-3.5" strokeWidth={1.5}/>Sign out</button>
     </div>
    </header>
    <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">{children}</main>
   </div>
  </div>
 </SidebarProvider>;
}
