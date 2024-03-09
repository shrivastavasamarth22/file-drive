import {OrganizationSwitcher, UserButton} from "@clerk/nextjs";

export function Header() {
  return (
	<div className="border-b py-4 bg-gray-50">
		<div className="container mx-auto flex items-center justify-between">
			<div>
				FileDrive
			</div>
			<div className="flex gap-2">
				<OrganizationSwitcher />
				<UserButton />
			</div>
		</div>
	</div>
  );
}