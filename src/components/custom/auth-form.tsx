import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Props for expandable form fields
 */
interface ExpandableFormField {
	id: string;
	label: string;
	type?: string;
	placeholder?: string;
	required?: boolean;
}

/**
 * Props for expandable actions
 */
interface ExpandableAction {
	label: string;
	icon?: React.ReactNode;
	onClick?: () => void;
	expandsTo?: {
		title: string;
		description?: string;
		fields: ExpandableFormField[];
		submitLabel: string;
		onSubmit: (data: Record<string, string>) => Promise<void> | void;
		backLabel?: string;
		loadingLabel?: string;
	};
}

/**
 * Props for the AuthForm component.
 */
interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * The source URL or base64 string for the company logo.
	 */
	logoSrc?: string;
	/**
	 * Alt text for the company logo for accessibility.
	 */
	logoAlt?: string;
	/**
	 * The main title of the form.
	 */
	title: string;
	/**
	 * A short description or subtitle displayed below the title.
	 */
	description?: string;
	/**
	 * The primary call-to-action button with optional expandable form.
	 */
	primaryAction: ExpandableAction;
	/**
	 * An array of secondary action buttons with optional expandable forms.
	 */
	secondaryActions?: ExpandableAction[];
	/**
	 * An optional action for skipping the login process.
	 */
	skipAction?: {
		label: string;
		onClick: () => void;
	};
	/**
	 * Custom content to be displayed in the footer area.
	 */
	footerContent?: React.ReactNode;
}

/**
 * A reusable authentication form component with expandable actions.
 * Built with shadcn/ui and Framer Motion for smooth animations.
 */
const AuthForm = forwardRef<HTMLDivElement, AuthFormProps>(
	(
		{
			className,
			logoSrc,
			logoAlt = 'Company Logo',
			title,
			description,
			primaryAction,
			secondaryActions,
			skipAction,
			footerContent,
			...props
		},
		ref
	) => {
		const [expandedAction, setExpandedAction] = useState<number | null>(
			null
		);
		const [formData, setFormData] = useState<Record<string, string>>({});
		const [isSubmitting, setIsSubmitting] = useState(false);

		const handleExpandAction = (index: number, isPrimary = false) => {
			const action = isPrimary
				? primaryAction
				: secondaryActions?.[index];
			if (action?.expandsTo) {
				setExpandedAction(isPrimary ? -1 : index); // Use -1 for primary action
				// Reset form data when expanding
				setFormData({});
			} else {
				action?.onClick?.();
			}
		};

		const handleBackToMain = () => {
			setExpandedAction(null);
			setFormData({});
			setIsSubmitting(false);
		};

		const handleInputChange = (fieldId: string, value: string) => {
			setFormData((prev) => ({
				...prev,
				[fieldId]: value,
			}));
		};

		const handleFormSubmit = async (e: React.FormEvent) => {
			e.preventDefault();
			if (isSubmitting) {
				return;
			}

			setIsSubmitting(true);
			try {
				if (expandedAction === -1 && primaryAction?.expandsTo) {
					await primaryAction.expandsTo.onSubmit(formData);
				} else if (
					expandedAction !== null &&
					expandedAction >= 0 &&
					secondaryActions?.[expandedAction]?.expandsTo
				) {
					await secondaryActions[expandedAction].expandsTo?.onSubmit(
						formData
					);
				}
			} catch (_error) {
				// Error handling is done in the onSubmit function
			} finally {
				setIsSubmitting(false);
			}
		};

		let currentExpandedAction: ExpandableAction | undefined | null;
		if (expandedAction === -1) {
			currentExpandedAction = primaryAction;
		} else if (expandedAction !== null && expandedAction >= 0) {
			currentExpandedAction = secondaryActions?.[expandedAction];
		} else {
			currentExpandedAction = null;
		}

		return (
			<div
				className={cn(
					'flex flex-col items-center justify-center',
					className
				)}
			>
				<Card
					className={cn(
						'w-full max-w-md overflow-hidden',
						// Entrance Animation
						'fade-in-0 zoom-in-95 slide-in-from-bottom-4 animate-in duration-150'
					)}
					ref={ref}
					{...props}
				>
					<AnimatePresence mode="wait">
						{expandedAction === null ? (
							// Main authentication view
							<motion.div
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								initial={{ opacity: 0, y: 20 }}
								key="main-view"
								transition={{ duration: 0.1 }}
							>
								<CardHeader className="mb-4 px-4 text-center">
									{/* Logo */}
									{logoSrc && (
										<motion.div
											animate={{ scale: 1, opacity: 1 }}
											className="mb-4 flex justify-center"
											initial={{ scale: 0.8, opacity: 0 }}
											transition={{
												delay: 0.1,
												duration: 0.3,
											}}
										>
											<img
												alt={logoAlt}
												className="h-12 w-12 rounded-[4px] object-contain"
												src={logoSrc}
											/>
										</motion.div>
									)}
									<CardTitle className="-mb-1 font-semibold text-2xl tracking-tight">
										{title}
									</CardTitle>
									{description && (
										<CardDescription>
											{description}
										</CardDescription>
									)}
								</CardHeader>
								<CardContent className="space-y-4 px-4">
									{/* Primary Action Button */}
									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<Button
											className="w-full"
											onClick={() =>
												handleExpandAction(0, true)
											}
										>
											{primaryAction.icon}
											{primaryAction.label}
										</Button>
									</motion.div>

									{/* "OR" separator */}
									{secondaryActions &&
										secondaryActions.length > 0 && (
											<motion.div
												animate={{ opacity: 1 }}
												className="relative"
												initial={{ opacity: 0 }}
												transition={{ delay: 0.2 }}
											>
												<div className="absolute inset-0 flex items-center">
													<span className="w-full border-t" />
												</div>
												<div className="relative flex justify-center text-xs uppercase">
													<span className="bg-background px-2 text-muted-foreground">
														or
													</span>
												</div>
											</motion.div>
										)}

									{/* Secondary Action Buttons */}
									<div className="space-y-2">
										{secondaryActions?.map(
											(action, index) => (
												<motion.div
													animate={{
														opacity: 1,
														y: 0,
													}}
													initial={{
														opacity: 0,
														y: 10,
													}}
													key={action.label}
													transition={{
														delay:
															0.1 * (index + 1),
													}}
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
												>
													<Button
														className="w-full"
														onClick={() =>
															handleExpandAction(
																index
															)
														}
														variant="secondary"
													>
														{action.icon}
														{action.label}
													</Button>
												</motion.div>
											)
										)}
									</div>
								</CardContent>

								{/* Skip Action Button */}
								{skipAction && (
									<CardFooter className="px-4 pb-4">
										<motion.div
											animate={{ opacity: 1 }}
											className="w-full"
											initial={{ opacity: 0 }}
											transition={{ delay: 0.3 }}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
										>
											<Button
												className="w-full"
												onClick={skipAction.onClick}
												variant="outline"
											>
												{skipAction.label}
											</Button>
										</motion.div>
									</CardFooter>
								)}
							</motion.div>
						) : (
							// Expanded form view
							<motion.div
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								initial={{ opacity: 0, y: 20 }}
								key="expanded-view"
								transition={{ duration: 0.1 }}
							>
								<CardHeader className="mb-4 px-4 text-center">
									{/* Logo (smaller in expanded view) */}
									{logoSrc && (
										<motion.div
											animate={{ scale: 1 }}
											className="mb-2 flex justify-center"
											initial={{ scale: 1.2 }}
											transition={{ duration: 0.1 }}
										>
											<img
												alt={logoAlt}
												className="h-8 w-8 rounded-[4px] object-contain"
												src={logoSrc}
											/>
										</motion.div>
									)}
									<CardTitle className="-mb-1 font-semibold text-xl tracking-tight">
										{
											currentExpandedAction?.expandsTo
												?.title
										}
									</CardTitle>
									{currentExpandedAction?.expandsTo
										?.description && (
										<CardDescription>
											{
												currentExpandedAction.expandsTo
													.description
											}
										</CardDescription>
									)}
								</CardHeader>
								<CardContent className="px-4">
									<form
										className="space-y-4"
										onSubmit={handleFormSubmit}
									>
										{currentExpandedAction?.expandsTo?.fields.map(
											(field, index) => (
												<motion.div
													animate={{
														opacity: 1,
														x: 0,
													}}
													className="space-y-2"
													initial={{
														opacity: 0,
														x: -20,
													}}
													key={field.id}
													transition={{
														delay: 0.1 * index,
														duration: 0.3,
													}}
												>
													<Label htmlFor={field.id}>
														{field.label}
													</Label>
													<Input
														className="transition-all duration-75 focus:scale-[1.01]"
														id={field.id}
														onChange={(e) =>
															handleInputChange(
																field.id,
																e.target.value
															)
														}
														placeholder={
															field.placeholder
														}
														required={
															field.required
														}
														type={
															field.type || 'text'
														}
														value={
															formData[
																field.id
															] || ''
														}
													/>
												</motion.div>
											)
										)}

										<div className="space-y-2 pt-2">
											<motion.div
												whileHover={{
													scale: isSubmitting
														? 1
														: 1.02,
												}}
												whileTap={{
													scale: isSubmitting
														? 1
														: 0.98,
												}}
											>
												<Button
													className="w-full"
													disabled={isSubmitting}
													type="submit"
												>
													{isSubmitting ? (
														<>
															<Loader2 className="mr-2 h-4 w-4 animate-spin" />
															{currentExpandedAction
																?.expandsTo
																?.loadingLabel ||
																'Loading...'}
														</>
													) : (
														currentExpandedAction
															?.expandsTo
															?.submitLabel
													)}
												</Button>
											</motion.div>
											<motion.div
												whileHover={{
													scale: isSubmitting
														? 1
														: 1.02,
												}}
												whileTap={{
													scale: isSubmitting
														? 1
														: 0.98,
												}}
											>
												<Button
													className="w-full"
													disabled={isSubmitting}
													onClick={handleBackToMain}
													type="button"
													variant="outline"
												>
													{currentExpandedAction
														?.expandsTo
														?.backLabel || 'Back'}
												</Button>
											</motion.div>
										</div>
									</form>
								</CardContent>
							</motion.div>
						)}
					</AnimatePresence>
				</Card>

				{/* Footer */}
				<AnimatePresence>
					{footerContent && expandedAction === null && (
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							className="mt-6 w-full max-w-md px-8 text-center text-muted-foreground text-sm"
							exit={{ opacity: 0, y: 10 }}
							initial={{ opacity: 0, y: 10 }}
							transition={{ delay: 0.4, duration: 0.3 }}
						>
							{footerContent}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		);
	}
);
AuthForm.displayName = 'AuthForm';

export { AuthForm };
export type { AuthFormProps, ExpandableAction, ExpandableFormField };
