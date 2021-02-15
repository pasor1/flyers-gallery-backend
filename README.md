# Serverless Framework Node REST API on AWS

This is an example of an api endpoint build on AWS, using Lambda, API Gateway and S3.
The Lambda function read a stream from a .csv file on S3, transform it in JSON and finally output it.

**Usage and Query string parameters**

```
curl https://xxxxxxxxx.execute-api.eu-south-1.amazonaws.com/api/flyers?page=1&limit=20&expired=0&notpublished=0
```

- limit (int > 0, default 100) | Row limit
- page (int > 0, default 1) | Page, based on limit setting
- expired (0 or 1, default 0) | ouput expired (end_date < now)  records also
- notpublished (0 or 1, default 0) | ouput notpublished (is_published = 0) records also

## Setup

Install dependencies: `npm install`

## Deploy

You need an AWS account.

Install and configure [Serverless Framwork](https://www.serverless.com):
- [https://www.serverless.com/framework/docs/getting-started/](Get started with Serverless Framework)
- [https://www.serverless.com/framework/docs/providers/aws/cli-reference/config-credentials/](AWS - Config Credentials)

Set you preferred AWS region in "serverless.yml" (default eu-south-1)

Deploy on AWS `sls deploy`

## Remove

Remove from your AWS account: `sls remove`

