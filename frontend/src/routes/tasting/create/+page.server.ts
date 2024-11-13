import type { Actions, PageServerLoad } from './$types'
import client from '$lib/server/api'


export const actions = {
	default: async ({request, fetch}) => {
		const formData = await request.formData()
		const title = formData.get('title')?.toString()
		await client.POST('/Tasting', {
			body: {
				title
			},
			fetch
		})
	},
} satisfies Actions