"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {api} from "@/convex/_generated/api";
import {useOrganization, useUser} from "@clerk/nextjs";
import {useMutation, useQuery} from "convex/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";

import {Button} from "@/components/ui/button";
import {
	Dialog,
	DialogHeader,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";

import {Input} from "@/components/ui/input";

const formSchema = z.object({
	title: z.string().min(1).max(200),
	file: z.instanceof(FileList)
})

export default function Home() {
	const organization = useOrganization();
	const user = useUser();
	const generateUploadUrl = useMutation(api.files.generateUploadUrl)
	const createFile = useMutation(api.files.createFile)

	const { toast } = useToast();

	const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
	
	let orgId: string | undefined = undefined;
	if (organization.isLoaded && user.isLoaded) {
		orgId = organization.organization?.id ?? user.user?.id;
	}

	const files = useQuery(
		api.files.getFiles,
		orgId ? {orgId} : "skip"
	)
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			file: undefined
		}
	})

	const fileRef = form.register("file");

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (!orgId) return;
		const postUrl = await generateUploadUrl();
		const result = await fetch(postUrl, {
			method: "POST",
			headers: { "Content-Type": values.file[0]!.type },
			body: values.file[0]
		})

		const { storageId } = await result.json()

		try {
		await createFile({
			name: values.title,
			orgId,
			fileId: storageId
		})
		
		form.reset();
		setIsFileDialogOpen(false);

		toast({
			title: "File uploaded",
			description: "Now everyone can view your file",
			variant: "success",
		})

		} catch	(e) {
			toast({
				title: "Something went wrong",
				description: "There was an error uploading your file. Try again later",
				variant: "destructive",
			})
		}
	}

	return (
		<main className="container mx-auto pt-12">
			<div className="flex justify-between items-center">
				<h1 className="text-4xl font-bold">Your Files</h1>
				<Dialog open={isFileDialogOpen} onOpenChange={(isOpen) => { 
					setIsFileDialogOpen(isOpen)
					form.reset()
				}}>
					<DialogTrigger asChild>
						<Button
						>
							Upload File
						</Button>
					</DialogTrigger>
					<DialogContent>
					<DialogHeader>
						<DialogTitle className="mb-8">Upload your file here</DialogTitle>
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
										render={({field}) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input {...field}/>
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
													<Input
														type="file"
														{...fileRef}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button type="submit">Submit</Button>
								</form>
							</Form>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			{files?.map(file => (
				<div
					key={file._id}
				>
					{file.name}
				</div>
			))}
		</main>
	);
}
