// netlify/functions/generateUploadUrl.js

const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

// Assuming AWS credentials are set up in environment variables or via AWS config
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});
const bucketName = process.env.S3_BUCKET_NAME;

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    const uploadUuid = uuidv4();
    const fileName = `uploads/${uploadUuid}.jpeg`;

    const signedUrl = await s3.getSignedUrlPromise("putObject", {
      Bucket: bucketName,
      Key: fileName,
      ContentType: "image/jpeg",
      Expires: 3600, // 1 hour
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        uuid: uploadUuid,
        url: signedUrl,
        file_name: fileName,
      }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
