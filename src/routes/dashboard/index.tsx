import { createFileRoute, redirect } from '@tanstack/react-router';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { authClient } from '@/lib/auth/auth-client';

export const Route = createFileRoute('/dashboard/')({
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (!session) {
			throw redirect({ to: '/' });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const session = authClient.useSession();

	return (
		<DashboardLayout>
			<div>
				<h2 className="mb-4 font-bold text-2xl">
					Welcome to the Dashboard
				</h2>
				<p>Hello {session.data?.user.name}!</p>
			</div>
		</DashboardLayout>
	);
}
