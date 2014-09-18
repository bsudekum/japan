### Japan Trip 2014

![](https://i.cloudup.com/5QP8_ZJSbP.png)

[Map link](visuallybs.com/japan/map)

### Processing Images

Since all of my photos were geotagged, I created a little script that:
* resizes all images
* extracts metadata
* uploads all images to s3
* writes a geojson file containing all images and their location

Simple:
1. `git clone`
2. `npm install`
3. add aws keys
4. provide a folder
5. `node index.js`

Enjoy!
