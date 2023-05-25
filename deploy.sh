#!/bin/bash

FUNCTION_NAME="emailFanout"
HANDLER_NAME="index.handler"
ROLE_ARN="arn:aws:iam::554920200432:role/service-role/emailFanout-role-e50sr0ak"
REGION="eu-west-1"

echo "Creating zip..."
zip -q -r emailFanout.zip . -x .gitignore -x deploy.sh -x ".git/*"

echo "Updating function..."
aws lambda update-function-code \
    --function-name $FUNCTION_NAME \
    --zip-file fileb://emailFanout.zip \
    --region $REGION

rm emailFanout.zip

echo "All done!"
