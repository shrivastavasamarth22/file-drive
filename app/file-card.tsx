import { ReactNode, useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
	EllipsisVertical,
	ImageIcon,
	TrashIcon,
	GanttChartIcon,
	FileTextIcon,
} from "lucide-react";

function FileCardActions({ file }: { file: Doc<"files"> }) {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const deleteFile = useMutation(api.files.deleteFile);
	const { toast } = useToast();

	const onDelete = async () => {
		try {
			await deleteFile({ fileId: file._id });
			toast({
				title: "File Deleted",
				description: "The file has been deleted successfully!",
				variant: "success",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "An error occurred while deleting the file",
				variant: "destructive",
			});
		}
	};

	return (
		<>
			<AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							account and remove your data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<DropdownMenu>
				<DropdownMenuTrigger>
					<EllipsisVertical className="w-4 h-4" />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem
						className="flex gap-1 items-center text-red-600 cursor-pointer"
						onClick={() => setIsConfirmOpen(true)}
					>
						<TrashIcon className="w-4 h-4" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}

export function FileCard({ file }: { file: Doc<"files"> }) {
	const typeIcons = {
		image: <ImageIcon />,
		pdf: <FileTextIcon />,
		csv: <GanttChartIcon />,
	} as Record<Doc<"files">["type"], ReactNode>;

	return (
		<Card>
			<CardHeader className="relative">
				<CardTitle className="flex gap-2 text-base font-normal">
					<div className="flex justify-center">{typeIcons[file.type]}</div>{" "}
					{file.name}
				</CardTitle>
				<div className="absolute top-2 right-2">
					<FileCardActions file={file} />
				</div>
			</CardHeader>
			<CardContent className="h-[200px] flex justify-center items-center">
				{file.type === "csv" && <GanttChartIcon className="w-20 h-20" />}
				{file.type === "pdf" && <FileTextIcon className="w-20 h-20" />}
			</CardContent>
			<CardFooter>
				<Button>Download</Button>
			</CardFooter>
		</Card>
	);
}
