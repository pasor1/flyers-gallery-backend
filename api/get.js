'use strict';
const fs = require('fs');
const csv = require('@fast-csv/parse');
const aws = require('aws-sdk');
const s3 = new aws.S3();
const moment = require('moment-timezone');
const timeZone = 'Europe/Rome';
const s3Params = {
  Bucket: 'shopfully-test-backend-csv',
  Key: 'flyers_data.csv',
};

module.exports.get = (event, context, callback) => {
  const output = [];
  let outputNotPublished = false; // output also record with is_published = 0
  let outputExpired = false; // output also record with end_date < now
  let counter = 0;
  let start = 0;
  let limit = 100;
  const dateNow = new Date();

  // eval query param
  if (event.queryStringParameters) {
    if (event.queryStringParameters.limit) {
      limit = +event.queryStringParameters.limit;
    }
    if (event.queryStringParameters.page) {
      start = (+event.queryStringParameters.page - 1) * limit;
    }
    if (event.queryStringParameters.notpublished === '1') {
      outputNotPublished = true;
    }
    if (event.queryStringParameters.expired === '1') {
      outputExpired = true;
    }
  }

  //read stream, convert and output
  const readStream = s3.getObject(s3Params).createReadStream()
    .pipe(csv.parse({ headers: true }))
    .on('error', error => {
      const response = {
        statusCode: error.statusCode || 501,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: 'System error...',
      };
      callback(null, response);
    })
    .on('data', row => {
      const endDate = moment.tz(row.end_date, timeZone);
      if ((outputNotPublished || row.is_published === '1') && (outputExpired || endDate > dateNow)) {
        if (counter >= start && counter < start + limit) {
          output.push(row);
        } else if (counter >= start + limit) {
          readStream.destroy(); // destroy before cosuming all stream
        }
        counter++;
      }
    })
    .on('close', () => {
      const response = {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(output),
      };
      callback(null, response);
    })
    .on('finish', () => {
      const response = {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(output),
      };
      callback(null, response);
    })
}
