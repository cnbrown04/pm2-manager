import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

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
const AuthForm = React.forwardRef<HTMLDivElement, AuthFormProps>(
	(
		{
			className,
			logoSrc,
			logoAlt = "Company Logo",
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
		const [expandedAction, setExpandedAction] = React.useState<number | null>(
			null
		);
		const [formData, setFormData] = React.useState<Record<string, string>>({});
		const [isSubmitting, setIsSubmitting] = React.useState(false);

		const handleExpandAction = (index: number, isPrimary = false) => {
			const action = isPrimary ? primaryAction : secondaryActions?.[index];
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
			if (isSubmitting) return;

			setIsSubmitting(true);
			try {
				if (expandedAction === -1 && primaryAction?.expandsTo) {
					await primaryAction.expandsTo.onSubmit(formData);
				} else if (
					expandedAction !== null &&
					expandedAction >= 0 &&
					secondaryActions?.[expandedAction]?.expandsTo
				) {
					await secondaryActions[expandedAction].expandsTo!.onSubmit(formData);
				}
			} catch (error) {
				// Error handling is done in the onSubmit function
			} finally {
				setIsSubmitting(false);
			}
		};

		const currentExpandedAction =
			expandedAction === -1
				? primaryAction
				: expandedAction !== null && expandedAction >= 0
					? secondaryActions?.[expandedAction]
					: null;

		return (
			<div
				className={cn("flex flex-col items-center justify-center", className)}
			>
				<Card
					ref={ref}
					className={cn(
						"w-full max-w-md overflow-hidden",
						// Entrance Animation
						"animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-500"
					)}
					{...props}
				>
					<AnimatePresence mode="wait">
						{expandedAction === null ? (
							// Main authentication view
							<motion.div
								key="main-view"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3 }}
							>
								<CardHeader className="text-center px-4 mb-4">
									{/* Logo */}
									{logoSrc && (
										<motion.div
											className="mb-4 flex justify-center"
											initial={{ scale: 0.8, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											transition={{ delay: 0.1, duration: 0.3 }}
										>
											<img
												src={logoSrc}
												alt={logoAlt}
												className="h-12 w-12 object-contain rounded-[4px]"
											/>
										</motion.div>
									)}
									<CardTitle className="text-2xl font-semibold tracking-tight -mb-1">
										{title}
									</CardTitle>
									{description && (
										<CardDescription>{description}</CardDescription>
									)}
								</CardHeader>
								<CardContent className="px-4 space-y-4">
									{/* Primary Action Button */}
									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<Button
											onClick={() => handleExpandAction(0, true)}
											className="w-full"
										>
											{primaryAction.icon}
											{primaryAction.label}
										</Button>
									</motion.div>

									{/* "OR" separator */}
									{secondaryActions && secondaryActions.length > 0 && (
										<motion.div
											className="relative"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
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
										{secondaryActions?.map((action, index) => (
											<motion.div
												key={index}
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.1 * (index + 1) }}
											>
												<Button
													variant="secondary"
													className="w-full"
													onClick={() => handleExpandAction(index)}
												>
													{action.icon}
													{action.label}
												</Button>
											</motion.div>
										))}
									</div>
								</CardContent>

								{/* Skip Action Button */}
								{skipAction && (
									<CardFooter className="px-4 pb-4">
										<motion.div
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.3 }}
											className="w-full"
										>
											<Button
												variant="outline"
												className="w-full"
												onClick={skipAction.onClick}
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
								key="expanded-view"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3 }}
							>
								<CardHeader className="text-center px-4 mb-4">
									{/* Logo (smaller in expanded view) */}
									{logoSrc && (
										<motion.div
											className="mb-2 flex justify-center"
											initial={{ scale: 1.2 }}
											animate={{ scale: 1 }}
											transition={{ duration: 0.3 }}
										>
											<img
												src={logoSrc}
												alt={logoAlt}
												className="h-8 w-8 object-contain rounded-[4px]"
											/>
										</motion.div>
									)}
									<CardTitle className="text-xl font-semibold tracking-tight -mb-1">
										{currentExpandedAction?.expandsTo?.title}
									</CardTitle>
									{currentExpandedAction?.expandsTo?.description && (
										<CardDescription>
											{currentExpandedAction.expandsTo.description}
										</CardDescription>
									)}
								</CardHeader>
								<CardContent className="px-4">
									<form onSubmit={handleFormSubmit} className="space-y-4">
										{currentExpandedAction?.expandsTo?.fields.map(
											(field, index) => (
												<motion.div
													key={field.id}
													className="space-y-2"
													initial={{ opacity: 0, x: -20 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ delay: 0.1 * index, duration: 0.3 }}
												>
													<Label htmlFor={field.id}>{field.label}</Label>
													<Input
														id={field.id}
														type={field.type || "text"}
														placeholder={field.placeholder}
														required={field.required}
														value={formData[field.id] || ""}
														onChange={(e) =>
															handleInputChange(field.id, e.target.value)
														}
														className="transition-all duration-200 focus:scale-[1.01]"
													/>
												</motion.div>
											)
										)}

										<div className="space-y-2 pt-2">
											<motion.div
												whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
												whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
											>
												<Button
													type="submit"
													className="w-full"
													disabled={isSubmitting}
												>
													{isSubmitting ? (
														<>
															<Loader2 className="mr-2 h-4 w-4 animate-spin" />
															{currentExpandedAction?.expandsTo?.loadingLabel ||
																"Loading..."}
														</>
													) : (
														currentExpandedAction?.expandsTo?.submitLabel
													)}
												</Button>
											</motion.div>
											<motion.div
												whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
												whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
											>
												<Button
													type="button"
													variant="outline"
													className="w-full"
													onClick={handleBackToMain}
													disabled={isSubmitting}
												>
													{currentExpandedAction?.expandsTo?.backLabel ||
														"Back"}
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
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 10 }}
							transition={{ delay: 0.4, duration: 0.3 }}
							className="mt-6 w-full max-w-md px-8 text-center text-sm text-muted-foreground"
						>
							{footerContent}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		);
	}
);
AuthForm.displayName = "AuthForm";

export { AuthForm };
export type { AuthFormProps, ExpandableAction, ExpandableFormField };
