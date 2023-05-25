import AWS from 'aws-sdk';

const sourceEmail = 'test@example.com';

const listRecipients = [
  'one@example.com',
  'two@example.com'
]

AWS.config.update({region: 'eu-west-1'});

export const handler = async (event) => {
  const s3 = new AWS.S3();
  const ses = new AWS.SES({apiVersion: '2010-12-01'});

  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

  const s3Params = {
    Bucket: bucket,
    Key: key
  };

  console.log("found new S3 object: " + s3Params.Key);

  const data = await s3.getObject(s3Params).promise();
  const rawEmail = data.Body;

  const params = {
    IdentityType: "EmailAddress", 
    MaxItems: 100, 
    NextToken: ""
  };

  const identityData = await ses.listIdentities(params).promise();
  const verifiedIdentities = identityData.Identities;

  const unverifiedIdentities = listRecipients.filter(x => !verifiedIdentities.includes(x));

  await Promise.all(unverifiedIdentities.map(async (unverifiedEmail) => {
    try {
      const data = await ses.verifyEmailIdentity({EmailAddress: unverifiedEmail}).promise();
      console.log("waiting for user to verify: " + unverifiedEmail);
    } catch (err) {
      console.error(err, err.stack);
    }
  }));

  const rawEmailParams = {
    RawMessage: {
      Data: rawEmail
    },
    Destinations: listRecipients,
    Source: sourceEmail
  };

  try {
    const sendRawResult = await ses.sendRawEmail(rawEmailParams).promise();

    try {
      await s3.deleteObject(s3Params).promise();
      console.log("deleted S3 object: " + s3Params.Key);
    } catch (err) {
      console.error(err, err.stack);
    }

    console.log("sending success. MessageId: " + sendRawResult.MessageId);
    return sendRawResult.MessageId;

  } catch (err) {
    console.error(err, err.stack);
    throw err;
  }
}
