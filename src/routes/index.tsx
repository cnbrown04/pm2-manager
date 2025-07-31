import { Button } from "@/components/ui/button";
import { createFileRoute, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const router = useRouter();
	const state = Route.useLoaderData();

	return (
		<div>
			<Button>Click me</Button>
		</div>
	);
}
