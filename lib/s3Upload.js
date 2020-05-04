const fs = require('fs')
// const path = require('path')
const AWS = require('aws-sdk')
// const mime = require('mime-types')

// Create S3 service object
const s3 = new AWS.S3()

const s3Upload = function (file) {
  // call S3 to retrieve upload file to specified bucket
  const uploadParams = {
    Bucket: 'talsgenericbucket',
    Key: file.originalname,
    Body: '',
    ACL: 'public-read',
    ContentType: file.mimetype
  }

  // take file and create a stream of that file
  const fileStream = fs.createReadStream(file.path)
  // if that stream errors then log
  fileStream.on('error', function (err) {
    console.log('File Error', err)
  })

  // add the fileStream as the Body key to the uploadParams
  uploadParams.Body = fileStream
  // get name of file and make it the Key key to the uploadParams
  // uploadParams.Key = title

  return new Promise((resolve, reject) => {
    // Send uploadParams to s3 to save
    // This is actually where we upload the file
    s3.upload(uploadParams, function (err, data) {
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

module.exports = s3Upload
