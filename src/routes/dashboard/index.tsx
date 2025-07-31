import { authClient } from "@/lib/auth/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	const session = authClient.useSession();

	if (!session) {
		return redirect({ to: "/" });
	}

	return <div>Hello "/dashboard/"! Hello {session.data?.user.name}</div>;
}
