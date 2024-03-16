import {Button} from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import {Doc} from "@/convex/_generated/dataModel"


export function FileCard ({ file }: { file:  Doc<"files"> }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="truncate">
					{file.name}
				</CardTitle>
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
