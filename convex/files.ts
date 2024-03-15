import {ConvexError, v} from 'convex/values'
import { mutation, query } from './_generated/server'
import {getUser} from './users';

export const createFile = mutation({
	args: {
		name: v.string(),
		orgId: v.string(),
	},
	async handler(ctx, args) {
	const identity = await ctx.auth.getUserIdentity();

	if (!identity) throw new ConvexError('unauthorized')

	const user = await getUser(ctx, identity.tokenIdentifier)
	const hasAccess = user.orgIds.includes(args.orgId) || user.tokenIdentifier === args.orgId
	
	if (!hasAccess) {
		throw new ConvexError('You do not have access to this org')
	}
	
	await ctx.db.insert('files', {
		name: args.name,
		orgId: args.orgId,
	})
	}
})

export const getFiles = query({
	args: {
		orgId: v.string(),
	},
	async handler(ctx, args) {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];
		return ctx.db.query('files').withIndex("by_orgId", q => (
			q.eq('orgId', args.orgId)
		)).collect()
	}
})
