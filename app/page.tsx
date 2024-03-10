"use client";
import {Button} from "@/components/ui/button";
import {api} from "@/convex/_generated/api";
import {useOrganization} from "@clerk/nextjs";
import {useMutation, useQuery} from "convex/react";

export default function Home() {
	const { organization } = useOrganization();
	const files = useQuery(
		api.files.getFiles,
		organization?.id ? {orgId: organization.id } : "skip"
	)
	const createFile = useMutation(api.files.createFile) 

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			{files?.map(file => (
				<div
					key={file._id}
				>
					{file.name}
				</div>
			))}


			<Button
				onClick={() => {
					if (!organization) return;
					createFile({
						name: "New File",
						orgId: organization.id
					})
				}}
			>
				Create File
			</Button>
		</main>
	);
}
