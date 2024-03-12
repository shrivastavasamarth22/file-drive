import {ConvexError, v} from "convex/values";
import {MutationCtx, QueryCtx, internalMutation} from "./_generated/server";

export async function getUser(
	ctx: QueryCtx | MutationCtx, tokenIdentifier: string
) {
	return await ctx.db
		.query("users")
		.withIndex('by_tokenIdentifier', ( q ) => q.eq('tokenIdentifier', tokenIdentifier))
		.first()
}

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
		const user = await getUser(ctx, args.tokenIdentifier)
		
		if (!user) {
			throw new Error("User not found")
		}
		
		await ctx.db.patch(user._id, {
			orgIds: [...user.orgIds, args.orgId]
		})
	}
})
