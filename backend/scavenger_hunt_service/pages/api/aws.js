const AWS = require("aws-sdk");
const { ACCESS_KEY, KEY_SECRET } = require("./secrets");

AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: KEY_SECRET,
});

const s3 = new AWS.S3({params: {Bucket: 'cdn-bucket-scavenger-hunt'}})

const aws_upload = (params) => {
    return new Promise((resolve, reject) => {
        const { filename, file } = params;

        const buf = Buffer.from(file.replace(/^data:.+;base64,/, ""), "base64");

        const data = {
            Key: `${filename}`,
            Body: buf,
            ContentEncoding: 'base64',
            ACL:'public-read'
        }

        s3.putObject(data, (err, data) => {
            if(err) {
                console.log(`Error uploading file: ${err}`);
                reject(err);
            } else {
                const url = `https://cdn-bucket-scavenger-hunt.s3.us-east-2.amazonaws.com/${filename}`;

                resolve({ url });

                console.log(`File uploaded succesfully: ${url}`);
            }
        });
    });
};

export { aws_upload }


