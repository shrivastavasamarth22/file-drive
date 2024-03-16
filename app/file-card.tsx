import {Button} from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {Doc} from "@/convex/_generated/dataModel"
import {EllipsisVertical, TrashIcon} from "lucide-react"

function FileCardActions() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<EllipsisVertical 
					className="w-4 h-4"
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem className="flex gap-1 items-center text-red-600 cursor-pointer">
					<TrashIcon 
						className="w-4 h-4"
					/>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export function FileCard ({ file }: { file:  Doc<"files"> }) {
	return (
		<Card>
			<CardHeader className="relative">
				<CardTitle className="truncate">
					{file.name}
				</CardTitle>
				<div className="absolute top-2 right-2">
					<FileCardActions />
				</div>
			</CardHeader>
			<CardContent>
				<p>Card Content</p>
			</CardContent>
			<CardFooter>
				<Button>Download</Button>
			</CardFooter>
		</Card>
	)
}
