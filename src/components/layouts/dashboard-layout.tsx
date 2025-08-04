import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import {
	BadgeCheck,
	Bell,
	Bot,
	ChevronRight,
	ChevronsUpDown,
	CreditCard,
	Folder,
	Forward,
	Frame,
	GalleryVerticalEnd,
	LogOut,
	MoreHorizontal,
	PieChart,
	Settings2,
	Sparkles,
	SquareTerminal,
	Trash2,
} from 'lucide-react';
import type { ReactNode } from 'react';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/animate-ui/radix/collapsible';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/animate-ui/radix/dropdown-menu';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
} from '@/components/animate-ui/radix/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar } from '../ui/avatar';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { Separator } from '../ui/separator';

interface DashboardLayoutProps {
	children: ReactNode;
}

const DATA = {
	user: {
		name: 'Skyleen',
		email: 'skyleen@example.com',
		avatar: 'https://pbs.twimg.com/profile_images/1909615404789506048/MTqvRsjo_400x400.jpg',
	},
	navMain: [
		{
			title: 'Dashboard',
			url: '/dashboard',
			icon: SquareTerminal,
			isActive: true,
		},
		{
			title: 'Processes',
			url: '/dashboard/processes',
			icon: Bot,
			items: [
				{
					title: 'Running',
					url: '/dashboard/processes/running',
				},
				{
					title: 'Stopped',
					url: '/dashboard/processes/stopped',
				},
				{
					title: 'Logs',
					url: '/dashboard/processes/logs',
				},
			],
		},
		{
			title: 'Monitoring',
			url: '/dashboard/monitoring',
			icon: PieChart,
			items: [
				{
					title: 'CPU Usage',
					url: '/dashboard/monitoring/cpu',
				},
				{
					title: 'Memory',
					url: '/dashboard/monitoring/memory',
				},
				{
					title: 'Uptime',
					url: '/dashboard/monitoring/uptime',
				},
			],
		},
		{
			title: 'Settings',
			url: '/dashboard/settings',
			icon: Settings2,
			items: [
				{
					title: 'General',
					url: '/dashboard/settings/general',
				},
				{
					title: 'Notifications',
					url: '/dashboard/settings/notifications',
				},
				{
					title: 'Security',
					url: '/dashboard/settings/security',
				},
			],
		},
	],
	projects: [
		{
			name: 'Web Server',
			url: '/dashboard/processes/web-server',
			icon: Frame,
		},
		{
			name: 'API Service',
			url: '/dashboard/processes/api-service',
			icon: Bot,
		},
		{
			name: 'Background Jobs',
			url: '/dashboard/processes/background-jobs',
			icon: SquareTerminal,
		},
	],
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
	const isMobile = useIsMobile();

	return (
		<SidebarProvider>
			<Sidebar collapsible="icon">
				<SidebarHeader>
					<div className="flex w-full justify-center">
						<SidebarMenuButton size="lg" asChild>
							<a href="/dashboard">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<GalleryVerticalEnd className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										PM2 Manager
									</span>
									<span className="truncate text-xs">
										Process Management
									</span>
								</div>
							</a>
						</SidebarMenuButton>
					</div>
				</SidebarHeader>
				<SidebarContent>
					{/* Nav Main */}
					<SidebarGroup>
						<SidebarGroupLabel>Platform</SidebarGroupLabel>
						<SidebarMenu>
							{DATA.navMain.map((item) => (
								<Collapsible
									asChild
									className="group/collapsible"
									defaultOpen={item.isActive}
									key={item.title}
								>
									<SidebarMenuItem>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton
												tooltip={item.title}
											>
												{item.icon && <item.icon />}
												<span>{item.title}</span>
												<ChevronRight className="ml-auto transition-transform duration-75 group-data-[state=open]/collapsible:rotate-90" />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.items?.map((subItem) => (
													<SidebarMenuSubItem
														key={subItem.title}
													>
														<SidebarMenuSubButton
															asChild
														>
															<a
																href={
																	subItem.url
																}
															>
																<span>
																	{
																		subItem.title
																	}
																</span>
															</a>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									</SidebarMenuItem>
								</Collapsible>
							))}
						</SidebarMenu>
					</SidebarGroup>
					{/* Nav Main */}

					{/* Nav Project */}
					<SidebarGroup className="group-data-[collapsible=icon]:hidden">
						<SidebarGroupLabel>Active Processes</SidebarGroupLabel>
						<SidebarMenu>
							{DATA.projects.map((item) => (
								<SidebarMenuItem key={item.name}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.name}</span>
										</a>
									</SidebarMenuButton>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<SidebarMenuAction showOnHover>
												<MoreHorizontal />
												<span className="sr-only">
													More
												</span>
											</SidebarMenuAction>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align={isMobile ? 'end' : 'start'}
											className="w-48 rounded-lg"
											side={isMobile ? 'bottom' : 'right'}
										>
											<DropdownMenuItem>
												<Folder className="text-muted-foreground" />
												<span>View Project</span>
											</DropdownMenuItem>
											<DropdownMenuItem>
												<Forward className="text-muted-foreground" />
												<span>Share Project</span>
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem>
												<Trash2 className="text-muted-foreground" />
												<span>Delete Project</span>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</SidebarMenuItem>
							))}
							<SidebarMenuItem>
								<SidebarMenuButton className="text-sidebar-foreground/70">
									<MoreHorizontal className="text-sidebar-foreground/70" />
									<span>More</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroup>
					{/* Nav Project */}
				</SidebarContent>
				<SidebarFooter>
					{/* Nav User */}
					<SidebarMenu>
						<SidebarMenuItem>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<SidebarMenuButton
										className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
										size="lg"
									>
										<Avatar className="h-8 w-8 rounded-lg">
											<AvatarImage
												alt={DATA.user.name}
												src={DATA.user.avatar}
											/>
											<AvatarFallback className="rounded-lg">
												CN
											</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-semibold">
												{DATA.user.name}
											</span>
											<span className="truncate text-xs">
												{DATA.user.email}
											</span>
										</div>
										<ChevronsUpDown className="ml-auto size-4" />
									</SidebarMenuButton>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
									side={isMobile ? 'bottom' : 'right'}
									sideOffset={4}
								>
									<DropdownMenuLabel className="p-0 font-normal">
										<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
											<Avatar className="h-8 w-8 rounded-lg">
												<AvatarImage
													alt={DATA.user.name}
													src={DATA.user.avatar}
												/>
												<AvatarFallback className="rounded-lg">
													CN
												</AvatarFallback>
											</Avatar>
											<div className="grid flex-1 text-left text-sm leading-tight">
												<span className="truncate font-semibold">
													{DATA.user.name}
												</span>
												<span className="truncate text-xs">
													{DATA.user.email}
												</span>
											</div>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuItem>
											<Sparkles />
											Upgrade to Pro
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuItem>
											<BadgeCheck />
											Account
										</DropdownMenuItem>
										<DropdownMenuItem>
											<CreditCard />
											Billing
										</DropdownMenuItem>
										<DropdownMenuItem>
											<Bell />
											Notifications
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<LogOut />
										Log out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					</SidebarMenu>
					{/* Nav User */}
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>

			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] duration-75 ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							className="mr-2 h-4"
							orientation="vertical"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="/dashboard">
										PM2 Manager
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>Dashboard</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}