require("dotenv").config();
/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest, onCall } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const axios = require("axios");
const admin = require("firebase-admin");

admin.initializeApp();
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onCall((data, context) => {
  return { message: "Hello from Firebase!" };
});

// exports.setupUser = onCall(async (data, context) => {
//   return await exports.storeAndReturnToken(data, context);
// });

exports.setupUser = onCall(async (data) => {
  // will be used to store access token and refresh token
  // access token will be returned to the client
  const { user_id, code } = data.data;

  const db = admin.firestore();

  await db.collection("athletes").doc(user_id).set({ user_id });

  try {
    const url = "https://www.strava.com/oauth/token";
    const response = await axios.post(
      url,
      {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const { data } = response;
    logger.log(">>>data", response);

    // Ensure data is a plain JavaScript object
    const plainData = JSON.parse(JSON.stringify(data));
    logger.log(">>>plainData", plainData);

    const docRef = db.collection("athletes").doc(user_id);
    await docRef.set(plainData, { merge: true });
    logger.info(data);
    return true;
  } catch (error) {
    logger.error("Error setting up user:", error);
    return false;
  }
});

exports.refreshToken = onRequest(async (req, res) => {
  const { user_id } = req.query;

  const db = admin.firestore();
  const { refresh_token } = (
    await db.collection("athletes").doc(user_id).get()
  ).data();

  try {
    const url = "https://www.strava.com/oauth/token";
    const response = await axios.post(url, null, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        refresh_token,
        grant_type: "refresh_token",
      },
    });
    const { data } = response;
    await db.collection("athletes").doc(user_id).set(data);
    logger.info(data);
    res.status(200).send({ data });
  } catch (error) {
    logger.error("Error refreshing token:", error);
    res.status(500).send("Error refreshing token");
  }
});

exports.loadActivities = onRequest(async (req, res) => {
  const { user_id } = req.query;
  logger.log(">>> params", req.query);
  const db = admin.firestore();
  const { access_token } = (
    await db.collection("athletes").doc(user_id).get()
  ).data();

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const allActivities = [];
  let page = 1;
  let done = false;

  try {
    while (!done) {
      const url = `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=200`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const activities = response.data;

      if (activities.length === 0) {
        done = true;
      } else {
        for (const activity of activities) {
          const activityDate = new Date(activity.start_date);
          if (activityDate < oneYearAgo) {
            done = true;
            break;
          }
          allActivities.push(activity);
        }
        page++;
      }
    }

    const MAX_BATCH_SIZE = 500; // Firestore batch write limit

    // Helper function to chunk the data
    const chunkArray = (array, size) => {
      const result = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    };

    // Chunk activities into batches
    const activityChunks = chunkArray(allActivities, MAX_BATCH_SIZE);

    const commitBatches = async (chunks) => {
      for (const chunk of chunks) {
        const batch = db.batch(); // Create a new batch for each chunk
        chunk.forEach((activity) => {
          const activityRef = db
            .collection("athletes")
            .doc(user_id)
            .collection("activities")
            .doc(activity.id.toString());
          batch.set(activityRef, activity);
        });
        await batch.commit(); // Commit the batch
      }
    };

    // Commit all batches
    await commitBatches(activityChunks);
    res.status(200).send({ activities: allActivities });
  } catch (error) {
    logger.error("Error getting user activities:", error);
    res.status(500).send("Error getting user activities");
  }
});

exports.getUserName = onCall(async (data, context) => {
  const { user_id } = data.data;
  const db = admin.firestore();
  try {
    const doc = await db.collection("athletes").doc(user_id).get();
    if (!doc.exists) {
      return null;
    }
    const { firstname, lastname } = doc.data().athlete;
    logger.info("User document data:", firstname, lastname);
    return { firstname, lastname };
  } catch (error) {
    logger.error("Error getting user document:", error);
    throw new Error("Error getting user document");
  }
});

exports.getUserActivities = onCall(async (data) => {
  const { user_id } = data.data;
  let activities = [];
  const db = admin.firestore();
  const userDoc = await db.collection("athletes").doc(user_id).get();
  if (!userDoc.exists) {
    throw new Error("User not found");
  }
  const activitiesRef = db
    .collection("athletes")
    .doc(user_id)
    .collection("activities");

  try {
    const snapshot = await activitiesRef
      .orderBy("start_date_local", "desc")
      .get();
    if (snapshot.empty) {
      logger.info("No activities found for user");
      return { activities };
    }
    activities = snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    logger.error("Error getting user activities:", error);
  }

  return { activities };
});
