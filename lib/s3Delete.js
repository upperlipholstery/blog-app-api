
const AWS = require('aws-sdk')

// Create S3 service object
const s3 = new AWS.S3()

const s3Delete = function (title) {
  // call S3 to delete a file in a specified bucket
  const deleteParams = {
    Bucket: 'talsgenericbucket',
    Key: title
  }

  return new Promise((resolve, reject) => {
    // Send uploadParams to s3 to save
    // This is actually where we upload the file
    s3.deleteObject(deleteParams, function (err, data) {
      // if error then log the error
      if (err) {
        reject(err)
      // if successfull then print the response data
      } else {
        resolve(data)
      }
    })
  })
}

module.exports = s3Delete
