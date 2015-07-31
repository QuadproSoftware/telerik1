var observable = require("data/observable");
var imageSourceModule = require("image-source");
var fileSystemModule = require("file-system");
var observableArrayModule = require("data/observable-array");
var enums = require("ui/enums");
//var connectivity = require("connectivity");

var localImagesArray = new observableArrayModule.ObservableArray();
var directory = "/res/";

var cameraModule = require("camera");

var Everlive = require('./everlive.all.min');
var everlive = new Everlive({
								apiKey: "SqKHwhKASv1vzs7h",
								offlineStorage: false
							});

function imageFromSource(imageName) {
	return imageSourceModule.fromFile(fileSystemModule.path.join(__dirname, directory + imageName));
};

var item1 = {
	itemImage: imageFromSource("01.jpg")
};
var item2 = {
	itemImage: imageFromSource("02.jpg")
};
var item3 = {
	itemImage: imageFromSource("03.jpg")
};
var item4 = {
	itemImage: imageFromSource("04.jpg")
};
var item5 = {
	itemImage: imageFromSource("05.jpg")
};
var item6 = {
	itemImage: imageFromSource("06.jpg")
};

localImagesArray.push([item1, item2, item3, item4, item5, item6]);

var item7 = {
	itemImage: imageFromSource("07.jpg")
};
var item8 = {
	itemImage: imageFromSource("08.jpg")
};

var photoAlbumModel = new observable.Observable();

photoAlbumModel.set("message", "Add new photos");
photoAlbumModel.set("connectedText", "Connected");

var backendArray = new observableArrayModule.ObservableArray();

Object.defineProperty(photoAlbumModel, "photoItems", {
						  get: function () {
							  everlive.Files.get().then(function (data) {
								  data.result.forEach(function (fileMetadata) {
									  imageSourceModule.fromUrl(fileMetadata.Uri).then(function (result) {
										  var item = {
											  itemImage: result
										  };
										  backendArray.push(item);
									  });
								  });
							  },
														function (error) {
														});

							  return backendArray;
						  },
						  enumerable: true,
						  configurable: true
					  });

photoAlbumModel.tapAction = function () {
	cameraModule.takePicture({
								 width: 300,
								 height: 300,
								 keepAspectRatio: true
							 }).then(function (picture) {
								 var item = {
									 itemImage: picture
								 };
								 backendArray.push(item);

								 var file = {
									 "Filename": Math.random().toString(36).substring(2, 15) + ".jpg",
									 "ContentType": "image/jpeg",
									 "base64": picture.toBase64String(enums.ImageFormat.jpeg, 100)
								 };
								 console.log(file);
								 console.log("next line is: everlive.offline;");
								 everlive.offline();
								 everlive.Files.create(file,
													   function (data) {
													   },
													   function (error) {
													   });
							 });
}

photoAlbumModel.goOffline = function () {
	console.log("next line is: console.log(everlive);");
	//console.log("next line is: everlive.offline();");
	console.log(everlive);
	
	everlive.offline();
}

photoAlbumModel.connectivityAction = function () {
	//Toggle Connected states
	if (global.connectedState == "true") {
		photoAlbumModel.set("connectedText", "Offline");
		global.connectedState = "false";
		photoAlbumModel.goOffline();
	} else {
		photoAlbumModel.set("connectedText", "Connected");
		global.connectedState = "true";
		//everlive.online2();		
	}
}

exports.photoAlbumModel = photoAlbumModel;