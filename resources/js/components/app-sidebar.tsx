import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, BookText, FolderOpen, BookOpenCheck, Users, BookType, UserCog } from 'lucide-react';
import AppLogo from './app-logo';
import { usePage } from '@inertiajs/react';

export function AppSidebar() {
    const { auth } = usePage().props as { auth?: { user?: { role?: string } } };

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Research',
            href: '/research',
            icon: BookText,

        },
        // Under construction
        {
            title: 'Research Proposals',
            href: '/proposals',
            icon: FolderOpen,
        },
        {
            title: 'Research Publications',
            href: '/publications',
            icon: BookOpenCheck,
        },


        // 
        {
            title: 'Research Members',
            href: '/members',
            icon: Users,
        },

        {
            title: 'Research Utilizations',
            href: '/utilizations',
            icon: BookType,
        },
        auth?.user?.role === 'admin' ? {
            title: 'User Management',
            href: '/admin/users',
            icon: UserCog,
        } : null
    ].filter(Boolean) as NavItem[]; // Filter out undefined items

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/alihupbeat/SE2_LE',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://docs.google.com/document/d/1zoKyjg35f2nMOaCLDkmgKsCEiFlogh4FMz8AC16FlcE/edit?fbclid=IwY2xjawOdCTtleHRuA2FlbQIxMQBzcnRjBmFwcF9pZAEwAAEeuOShEDnKrlihu6lYnseJF29ci7_jU3kr2IBn5DqUDa_2sdm2YO1H4mc1_p4_aem_CcSGBRuZsYgOTQllOWER7g&tab=t.0',
            icon: BookOpen,
        },
    ];


    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
