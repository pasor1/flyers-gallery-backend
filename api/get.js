'use strict';
const fs = require('fs');
const csv = require('@fast-csv/parse');
const aws = require('aws-sdk');
const s3 = new aws.S3();

module.exports.get = (event, context, callback) => {
  const s3Params = {
    Bucket: 'shopfully-test-backend-csv',
    Key: 'flyers_data.csv',
  };
  const output = [];
  let counter = 0;
  let start = 0;
  let limit = 20;

  // eval query param
  if (event.queryStringParameters) {
    if (event.queryStringParameters.limit) {
      limit = +event.queryStringParameters.limit;
    }
    if (event.queryStringParameters.page) {
      start = (+event.queryStringParameters.page - 1) * limit;
    }
  }

  //read stream, convert and output
  const readStream = s3.getObject(s3Params).createReadStream()
    .pipe(csv.parse({ headers: true }))
    .on('error', error => {
      const response = {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'System error...',
      };
      callback(null, response);
    })
    .on('data', row => {
      if (counter >= start && counter < start + limit) {
        output.push(row);
      } else if (counter >= start + limit) {
        readStream.destroy();
      }
      counter++;
    })
    .on('close', () => {
      const response = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(output),
      };
      callback(null, response);
    })
    .on('finish', () => {
      const response = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(output),
      };
      callback(null, response);
    })
};
