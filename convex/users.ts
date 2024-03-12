import {v} from "convex/values";
import {internalMutation} from "./_generated/server";
import {users} from "@clerk/clerk-sdk-node";

export const createUser = internalMutation({
	args: {tokenIdentifier: v.string()},
	async handler(ctx, args) {
		await ctx.db.insert("users", { 
			tokenIdentifier: args.tokenIdentifier,
			orgIds: []
		})	
	}
})

export const addOrgIdToUser = internalMutation({
	args: {
		tokenIdentifier: v.string(),
		orgId: v.string()
	},
	async handler(ctx, args) {
		const user = await ctx.db.query("users").withIndex(
			'by_tokenIdentifier', 
			q => q.eq('tokenIdentifier', args.tokenIdentifier)
		).first()
		
		if (!user) {
			throw new Error("User not found")
		}
		
		await ctx.db.patch(user._id, {
			orgIds: [...user.orgIds, args.orgId]
		})
	}
})
