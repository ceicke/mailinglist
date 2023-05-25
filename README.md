= MailingList

MailingList is an AWS Lambda function designed for managing small mailing lists. 

== Functionality

The main functionality of the MailingList Lambda function is to send emails to a list of recipients.

Here's a brief overview of what the Lambda function does:

# It is triggered by the creation of an S3 object, where the email content is stored.
# The function retrieves the S3 object and prepares to send it as an email.
# The function verifies the email addresses of the recipients.
# If a recipient's email address is not verified, the function initiates the verification process.
# After the verification process is completed, the function sends the email to all verified recipients.
# Once the email has been sent successfully, the function deletes the S3 object to ensure that the same email is not sent multiple times​.

== Setup and Deployment

To set up and deploy the MailingList Lambda function, follow these steps:

# Update the sourceEmail and listRecipients variables in index.js file with your desired source email and list of recipients respectively.
# Make sure that you have AWS CLI installed and configured on your system.
# Update the FUNCTION_NAME, HANDLER_NAME, ROLE_ARN, and REGION variables in the deploy.sh file to match your AWS Lambda function's name, the handler name, the role ARN, and the region where your Lambda function is deployed respectively​3​.
# Run the deploy.sh script by executing the command ./deploy.sh in your terminal.

== Note

This project uses AWS Simple Email Service (SES) for sending emails, and it requires the email addresses to be verified in SES. If an email address is not verified, the function initiates the verification process. However, the function will not send an email to the unverified email address until it's verified by the user.

== Contributing

As this project is in its early stages, any contributions or suggestions are welcome. Please feel free to open an issue or submit a pull request.

== License

This project is open-sourced under the MIT license.