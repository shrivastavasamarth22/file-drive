"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogHeader,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

const formSchema = z.object({
	title: z.string().min(1).max(200),
	file: z.instanceof(FileList),
});

export function UploadButton() {
	const organization = useOrganization();
	const user = useUser();
	const generateUploadUrl = useMutation(api.files.generateUploadUrl);
	const createFile = useMutation(api.files.createFile);

	const { toast } = useToast();

	const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

	let orgId: string | undefined = undefined;
	if (organization.isLoaded && user.isLoaded) {
		orgId = organization.organization?.id ?? user.user?.id;
	}

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			file: undefined,
		},
	});

	const fileRef = form.register("file");

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (!orgId) return;

		const fileType = values.file[0].type;
		const postUrl = await generateUploadUrl();
		const result = await fetch(postUrl, {
			method: "POST",
			headers: { "Content-Type": fileType },
			body: values.file[0],
		});
		const { storageId } = await result.json();

		const types = {
			"image/png": "image",
			"image/jpeg": "image",
			"image/gif": "image",
			"application/pdf": "pdf",
			"text/csv": "csv",
		} as Record<string, Doc<"files">["type"]>;

		try {
			await createFile({
				name: values.title,
				orgId,
				fileId: storageId,
				type: types[fileType],
			});

			form.reset();
			setIsFileDialogOpen(false);

			toast({
				title: "File uploaded",
				description: "Now everyone can view your file",
				variant: "success",
			});
		} catch (e) {
			toast({
				title: "Something went wrong",
				description: "There was an error uploading your file. Try again later",
				variant: "destructive",
			});
		}
	}

	return (
		<Dialog
			open={isFileDialogOpen}
			onOpenChange={(isOpen) => {
				setIsFileDialogOpen(isOpen);
				form.reset();
			}}
		>
			<DialogTrigger asChild>
				<Button>Upload File</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="mb-2">Upload your file here</DialogTitle>
					<DialogDescription>
						This file will be accessible to all members of your organization
					</DialogDescription>
				</DialogHeader>
				<div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="file"
								render={() => (
									<FormItem>
										<FormLabel>File</FormLabel>
										<FormControl>
											<Input type="file" {...fileRef} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								disabled={form.formState.isSubmitting}
								className="flex gap-1 items-center justify-center"
							>
								{form.formState.isSubmitting && (
									<Loader2 className="h-4 w-4 animate-spin" />
								)}
								Submit
							</Button>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
}
