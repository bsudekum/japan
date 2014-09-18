var ExifImage = require('exif').ExifImage;
var path = require('path');
var imagePath = 'japan/'
var fs = require('fs');
var gpsUtil = require('gps-util');
var s3 = require('s3');
var im = require('imagemagick');

var client = s3.createClient({
    maxAsyncS3: 20,
    s3RetryCount: 3,
    s3RetryDelay: 1000,
    multipartUploadThreshold: 20971520,
    multipartUploadSize: 15728640,
    s3Options: {
        accessKeyId: 'key',
        secretAccessKey: 'key',
    }
});

var geojson = {
    'type': 'FeatureCollection',
    'features': []
}

fs.readdir(imagePath, function(err, files) {
    if (err) throw err;

    files.forEach(function(file, key) {

        if (file.indexOf('.jpg') > -1) {

            resizeImage(imagePath + file, 1000, function(error, resized) {
                if (error) return false;

                inspectImage(imagePath + file, function(error, imageMeta) {

                    if (error) {
                        // Upload thumbs
                        uploadTos3(imagePath + file, function(error, response) {
                            console.log(response);
                        });
                    }

                    if (imageMeta) {
                        var lng = gpsUtil.toDD(imageMeta.gps.GPSLatitude[0], imageMeta.gps.GPSLatitude[1], imageMeta.gps.GPSLatitude[2]);
                        var lat = gpsUtil.toDD(imageMeta.gps.GPSLongitude[0], imageMeta.gps.GPSLongitude[1], imageMeta.gps.GPSLongitude[2]);

                        uploadTos3(imagePath + file, function(error, response) {
                            console.log(response)

                            var feature = {
                                'type': 'Feature',
                                'properties': {
                                    'image': imageMeta.gps,
                                    'url': response

                                },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [lat, lng]
                                }
                            };

                            geojson.features.push(feature);
                            fs.writeFile('file.geojson', JSON.stringify(geojson), function(err) {
                                if (err) throw err;
                                console.log('file saved');
                            });
                        });
                    }
                });
            });
        }
    });

});

function resizeImage(image, newWidth, callback) {
    im.resize({
        srcPath: image,
        dstPath: image.split('.jpg')[0] + '.thumb.jpg',
        width: newWidth
    }, function(err, stdout, stderr) {
        if (err) throw err;
        return callback(null, image.split('.jpg')[0] + '.thumb.jpg');
    });
};

function uploadTos3(image, callback) {

    var params = {
        localFile: image,
        s3Params: {
            Bucket: 'picture-story-bobby',
            Key: image,
            ACL: 'public-read'
        },
    };

    var uploader = client.uploadFile(params);

    uploader.on('end', function(e) {
        return callback(null, 'https://s3.amazonaws.com/picture-story-bobby/' + image);
    });

};

function inspectImage(image, callback) {
    new ExifImage({
        image: image
    }, function(error, exifData) {
        if (error) return callback(error, null);

        if (exifData) {
            return callback(null, exifData);
        }
    });
};


function uploadImage(image, callback) {
    imgur.upload(image, function(error, response) {
        if (error) return console.log(error)
        console.log(response)

        if (response.status === 200) {
            return callback(null, response);
        }

    });
}
