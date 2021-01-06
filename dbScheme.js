// showing how our database look like
const db = {
	screams: [
		{ 
			userHandle: 'user', 
			body: 'body', 
			createdAt: "2020-12-24T11:05:13.489Z",
			userImage: 'https://storage.cloud.google.com/social-app-892a4.appspot.com/4518911405.jpeg'
			likeCount: 5, 
			commentCount: 2
		}
	],
	users: [
		{
			userId: '5DH9O5S1j0SQuwZT8Gp0y6m0Ja43',
			handle: 'chondan',
			email: 'chondan@example.com',
			createdAt: '2020-12-24T11:05:13.489Z',
			imageUrl: 'https://storage.cloud.google.com/social-app-892a4.appspot.com/4518911405.jpeg',
			bio: 'Hello, My name is Chondan.',
			website: 'https://chondan.com',
			location: 'Thailand, Bangkok.'
		}
	],
	comments: [
		{
			userHandle: 'user',
			screamId: 'mmIsLNZkhrkOwKIxGRpX',
			body: 'nice one mate!',
			createdAt: '2020-12-24T11:05:13.489Z',
			userImage: 'https://storage.cloud.google.com/social-app-892a4.appspot.com/4518911405.jpeg'
		}
	],
	likes: [
		{
			userHandle: 'user',
			screamId: 'mmIsLNZkhrkOwKIxGRpX'
		}
	],
	notifications: [
		{
			recipient: 'user',
			sender: 'john',
			read: 'true | false',
			screamId: 'lasfsadjfasfjlasf',
			type: 'like | comment',
			createdAt: '2020-12-24T11:05:13.489Z'
		}
	]
};

// User information
const userDetails = {
	credentials: {
		userId: '5DH9O5S1j0SQuwZT8Gp0y6m0Ja43',
		handle: 'chondan',
		email: 'chondan@example.com',
		createdAt: '2020-12-24T11:05:13.489Z',
		imageUrl: 'https://storage.cloud.google.com/social-app-892a4.appspot.com/4518911405.jpeg',
		bio: 'Hello, My name is Chondan.',
		website: 'https://chondan.com',
		location: 'Thailand, Bangkok.'
	},
	likes: [
		{
			userHandle: 'user',
			screamId: 'mmIsLNZkhrkOwKIxGRpX'
		},
		{
			userHandle: 'user',
			screamId: 'mmIsLNZkhrkOwKIxGRpX'
		}
	]
}