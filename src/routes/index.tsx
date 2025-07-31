import { AuthForm } from "@/components/custom/auth-form";
import { authClient } from "@/lib/auth/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
	component: Home,
});

const IconMail = (props: React.SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
		<title>Mail</title>
		<path
			d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"
			fill="currentColor"
		/>
	</svg>
);

const authFormProps = {
	title: "Welcome Back",
	description: "Sign in to your account",
	primaryAction: {
		label: "Sign in with Email",
		icon: <IconMail className="w-4 h-4 mr-2" />,
		expandsTo: {
			title: "Sign In",
			description: "Enter your credentials below",
			fields: [
				{
					id: "email",
					label: "Email",
					type: "email",
					placeholder: "Enter your email",
					required: true,
				},
				{
					id: "password",
					label: "Password",
					type: "password",
					placeholder: "Enter your password",
					required: true,
				},
			],
			submitLabel: "Sign In",
			loadingLabel: "Signing in...",
			onSubmit: async (data: Record<string, string>) => {
				try {
					// Implement sign in logic here
					console.log("Email login:", data);
					toast.success("Signed in successfully!");
				} catch (error) {
					toast.error("Failed to sign in. Please try again.");
					throw error;
				}
			},
		},
	},
	secondaryActions: [
		{
			label: "Create Account",
			expandsTo: {
				title: "Create Account",
				description: "Join us today",
				fields: [
					{
						id: "name",
						label: "Full Name",
						placeholder: "Enter your full name",
						required: true,
					},
					{
						id: "email",
						label: "Email",
						type: "email",
						placeholder: "Enter your email",
						required: true,
					},
					{
						id: "password",
						label: "Password",
						type: "password",
						placeholder: "Create a password",
						required: true,
					},
				],
				submitLabel: "Create Account",
				loadingLabel: "Creating account...",
				onSubmit: async (submitData: Record<string, string>) => {
					try {
						const { data, error } = await authClient.signUp.email(
							{
								email: submitData.email,
								password: submitData.password,
								name: submitData.name,
							},
							{
								onSuccess: () => {
									toast.success(
										"Account created successfully! Please check your email to verify your account."
									);
									console.log("Account created successfully");
								},
								onError: (error) => {
									console.error("Error creating account:", error);
									// This will be handled by the catch block below
								},
							}
						);

						if (error) {
							throw new Error(error.message || "Failed to create account");
						}
					} catch (error: any) {
						const errorMessage =
							error?.message || "Failed to create account. Please try again.";
						toast.error(errorMessage);
						throw error; // Re-throw to keep the loading state and prevent form reset
					}
				},
			},
		},
	],
};

function Home() {
	const session = authClient.useSession();

	if (session) {
		return redirect({ to: "/dashboard" });
	}

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
			<AuthForm className="w-full max-w-md" {...authFormProps} />
		</div>
	);
}
