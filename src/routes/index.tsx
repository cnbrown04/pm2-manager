import { createFileRoute, redirect } from '@tanstack/react-router';
import { toast } from 'sonner';
import { AuthForm } from '@/components/custom/auth-form';
import { authClient } from '@/lib/auth/auth-client';

export const Route = createFileRoute('/')({
	component: Home,
});

const IconMail = (props: React.SVGProps<SVGSVGElement>) => (
	<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
		<title>Mail</title>
		<path
			d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"
			fill="currentColor"
		/>
	</svg>
);

const authFormProps = {
	title: 'Welcome Back',
	description: 'Sign in to your account',
	primaryAction: {
		label: 'Sign in with Email',
		icon: <IconMail className="mr-2 h-4 w-4" />,
		expandsTo: {
			title: 'Sign In',
			description: 'Enter your credentials below',
			fields: [
				{
					id: 'email',
					label: 'Email',
					type: 'email',
					placeholder: 'Enter your email',
					required: true,
				},
				{
					id: 'password',
					label: 'Password',
					type: 'password',
					placeholder: 'Enter your password',
					required: true,
				},
			],
			submitLabel: 'Sign In',
			loadingLabel: 'Signing in...',
			onSubmit: async (submitData: Record<string, string>) => {
				try {
					const { error: outerError } = await authClient.signIn.email(
						{
							email: submitData.email,
							password: submitData.password,
						},
						{
							onSuccess: () => {
								toast.success(
									'Logged in successfully! Redirecting...'
								);
								redirect({ to: '/dashboard' });
							},
							onError: () => {
								toast.error('Error logging in', {
									description:
										outerError?.message || 'Unknown error',
								});
							},
						}
					);

					if (outerError) {
						throw new Error(
							outerError.message || 'Failed to create account'
						);
					}
				} catch (error: unknown) {
					let errorMessage =
						'Failed to create account. Please try again.';
					if (
						typeof error === 'object' &&
						error !== null &&
						'message' in error &&
						typeof (error as { message: unknown }).message ===
							'string'
					) {
						errorMessage = (error as { message: string }).message;
					}
					toast.error(errorMessage);
					throw error; // Re-throw to keep the loading state and prevent form reset
				}
			},
		},
	},
	secondaryActions: [
		{
			label: 'Create Account',
			expandsTo: {
				title: 'Create Account',
				description: 'Join us today',
				fields: [
					{
						id: 'name',
						label: 'Full Name',
						placeholder: 'Enter your full name',
						required: true,
					},
					{
						id: 'email',
						label: 'Email',
						type: 'email',
						placeholder: 'Enter your email',
						required: true,
					},
					{
						id: 'password',
						label: 'Password',
						type: 'password',
						placeholder: 'Create a password',
						required: true,
					},
				],
				submitLabel: 'Create Account',
				loadingLabel: 'Creating account...',
				onSubmit: async (submitData: Record<string, string>) => {
					try {
						const { error: outerError } =
							await authClient.signUp.email(
								{
									email: submitData.email,
									password: submitData.password,
									name: submitData.name,
								},
								{
									onSuccess: () => {
										toast.success(
											'Account created successfully! Redirecting...'
										);
										redirect({ to: '/dashboard' });
									},
									onError: () => {
										toast.error('Error creating account', {
											description:
												outerError?.message ||
												'Unknown error',
										});
										// This will be handled by the catch block below
									},
								}
							);
						if (outerError) {
							throw new Error(
								outerError.message || 'Failed to create account'
							);
						}
					} catch (error: unknown) {
						const errorMessage =
							(error as { message?: string })?.message ||
							'Failed to create account. Please try again.';
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
		return redirect({ to: '/dashboard' });
	}

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
			<AuthForm className="w-full max-w-md" {...authFormProps} />
		</div>
	);
}
