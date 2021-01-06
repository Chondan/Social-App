const functions = require('firebase-functions');
const { db } = require('./firebase_services');

const createNotificationOnAction = (action) => {
	const actionToCollection = {
		like: "likes",
		comment: "comments"
	}
	return functions.firestore.document(`${actionToCollection[action]}/{id}`)
		.onCreate((snapshot) => {
			return db.doc(`/screams/${snapshot.data().screamId}`).get()
			.then(doc => {
				// Check whether the doc is exist and avoid alerting to the users who like their own posts
				if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
					return db.doc(`/notifications/${snapshot.id}`).set({
						createdAt: new Date().toISOString(),
						recipient: doc.data().userHandle,
						sender: snapshot.data().userHandle,
						type: action,
						read: false,
						screamId: doc.id
					});
				}
			})
			.catch(err => console.error(err));
		});
};

const deleteNotificationOnAction = (action) => {
	const actionToCollection = {
		unlike: "likes"
	}
	return functions.firestore.document(`${actionToCollection[action]}/{id}`)
		.onDelete((snapshot) => {
			return db.doc(`/notifications/${snapshot.id}`).delete()
			.catch(err => onsole.error(err));
		});
};

const createNotificationOnUserImageChange = () => {
	return functions.firestore.document(`/users/{userId}`)
			.onUpdate((change) => {
				const before = change.before.data();
				const after = change.after.data();
				// Update only when users changed their image' profile
				if (before.imageUrl !== after.imageUrl) {
					const batch = db.batch();
					// To update userImage of all screams of that user
					return db.collection('screams').where('userHandle', '==', change.before.data().handle).get()
						.then((data) => {
							data.forEach(doc => {
								const scream = db.doc(`/screams/${doc.id}`);
								batch.update(scream, { userImage: change.after.data().imageUrl });
							});
							return batch.commit();
						});
				} else return true;
			});
};

const createNotificationOnScreamDelete = () => {
	return functions.firestore.document(`/screams/{screamId}`)
		.onDelete((snapshot, context) => {
			const screamId = context.params.screamId;

			const batch = db.batch();
			return db.collection('comments').where('screamId', '==', screamId).get()
				.then(data => {
					data.forEach(doc => {
						batch.delete(doc.ref);
					});
					return db.collection('likes').where('screamId', '==', screamId).get();
				})
				.then(data => {
					data.forEach(doc => {
						batch.delete(doc.ref);
					})
					return db.collection('notifications').where('screamId', '==', screamId).get();
				})
				.then(data => {
					data.forEach(doc => {
						batch.delete(doc.ref);
					})
					return batch.commit();
				})
				.catch(err => console.error(err));
		});
};

module.exports = { createNotificationOnAction, deleteNotificationOnAction, createNotificationOnUserImageChange, createNotificationOnScreamDelete };