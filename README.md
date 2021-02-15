# Serverless Framework Node REST API on AWS

This is an example of an api endpoint build on AWS, using Lambda, API Gateway and S3.
The Lambda function read a stream from a .csv file on S3, transform it in JSON and finally output it.

## Setup

Dependencies installation: `npm install`

## Deploy

Youn need an AWS account.

Install and configure [Serverless Framwork](https://www.serverless.com/framework/docs/getting-started/) (If you don't have it): `npm install -g serverless` 

Set you favotite AWS region in "serverless.yml"

Deploy on AWS `sls deploy`

**Test**

```
curl https://xxxxxxxxx.execute-api.eu-south-1.amazonaws.com/api/flyers?page=1&limit=20
```

## Remove

Remove from your AWS account: `sls remove`

