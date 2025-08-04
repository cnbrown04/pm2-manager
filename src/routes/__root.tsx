// src/routes/__root.tsx
/// <reference types="vite/client" />

import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import appCss from '@/styles/app.css?url';

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				title: 'TanStack Start Starter',
			},
		],
		links: [
			{
				rel: 'stylesheet',
				href: appCss,
			},
		],
	}),
	component: RootComponent,
	notFoundComponent: NotFound,
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

function NotFound() {
	return (
		<div>
			<h1>404 - Page Not Found</h1>
			<p>The page you're looking for doesn't exist.</p>
		</div>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			{/** biome-ignore lint/style/noHeadElement: Needed for hydration */}
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
				<Toaster richColors />
			</body>
		</html>
	);
}
