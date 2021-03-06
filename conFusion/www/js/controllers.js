angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$localStorage,$cordovaCamera,$ionicPlatform,$cordovaImagePicker) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = $localStorage.getObject('userinfo', '{}');

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $localStorage.storeObject('userinfo',$scope.loginData);
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.reservation = {};

  $ionicModal.fromTemplateUrl('templates/reserve.html',{
    scope:$scope
  }).then(function(modal){
    $scope.reserveForm = modal;
  });

  $scope.closeReserve = function(){
    $scope.reserveForm.hide();
  };
  $scope.reserve = function(){
      $scope.reserveForm.show();
    };
  $scope.doReserve = function(){
    //$scope.reserveData.push($scope.reservation);
    console.log('Doing reserve', $scope.reservation);
    $timeout(function () {
      $scope.closeReserve();
    }, 10);
  };

  $scope.registration ={};

  $ionicModal.fromTemplateUrl('templates/register.html',{
     scope:$scope
  }).then(function(modal){
    $scope.registerForm = modal;
  });

  $scope.closeRegister = function(){
    $scope.registerForm.hide();
  }

  $scope.register = function(){
    $scope.registerForm.show();
  }

  $scope.doRegister = function(){
    console.log('Doing registeration, ' + $scope.registeration);
    $timeout(function() {
      $scope.closeRegister();
    }, 1000);
  }

  $ionicPlatform.ready(function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
         $scope.takePicture = function() {
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                console.log(err);
            });

            $scope.registerForm.show();

        };
    });

    $ionicPlatform.ready(function(){
      var options = {
 maximumImagesCount: 1,
 width: 100,
 height: 100,
 quality: 50
};
$scope.selectPicture = function(){
  $cordovaImagePicker.getPictures(options)
    .then(function (results) {

        console.log('Image URI: ' + results[0]);
        $scope.registration.imgSrc = results[0];

    }, function(error) {
      // error getting photos
      console.log(err);
    });
};

    });

})

.controller('MenuController', ['$scope', 'favoriteFactory', 'baseURL', '$ionicListDelegate','dishes','$ionicPlatform','$cordovaLocalNotification','$cordovaToast',
 function ($scope, favoriteFactory, baseURL, $ionicListDelegate, dishes, $ionicPlatform,$cordovaLocalNotification,$cordovaToast) {


            $scope.baseURL = baseURL;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading ...";

            $scope.dishes = dishes;
            /*menuFactory.query(
                function(response) {
                    $scope.dishes = response;
                    $scope.showMenu = true;
                  //  $timeout(function () {
              //  $ionicLoading.hide();
          //  }, 1000);
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                });
                */


            $scope.select = function(setTab) {
                $scope.tab = setTab;

                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };

            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };

            $scope.shouldShowDelete = false;
            $scope.toggleDelete = function(){
              $scope.shouldShowDelete = !$scope.shouldShowDelete;
            };

            $scope.addFavorite = function (index) {
      console.log("index is " + index);
      favoriteFactory.addToFavorites(index);
      $ionicListDelegate.closeOptionButtons();
      $ionicPlatform.ready(function(){
        $cordovaLocalNotification.schedule({
          id: 1,
          title:"Added Favorite",
          text: $scope.dishes[index].name
        }).then(function(){
          console.log('Added Favorite ' + $scope.dishes[index].name);
        }, function(){
          console.log('Failed to add Favorite');
        })
      });

      $cordovaToast
      .show('Added Favorite ' + $scope.dishes[index].name,'long','center')
      .then(function(){

      },function(){

      });
  };


        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

            $scope.channels = channels;
            $scope.invalidChannelSelection = false;

        }])

        .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {

            $scope.sendFeedback = function() {

                console.log($scope.feedback);

                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    feedbackFactory.save($scope.feedback);
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])

        .controller('DishDetailController', ['$scope', '$stateParams','baseURL','$ionicPopover', '$ionicModal','favoriteFactory','dish','$ionicPlatform','$cordovaLocalNotification',
        '$cordovaToast',
        function($scope, $stateParams, baseURL,$ionicPopover,$ionicModal,favoriteFactory, dish,$ionicPlatform,$cordovaLocalNotification,$cordovaToast) {

            $scope.baseURL = baseURL;
            $scope.dish = {};
            $scope.showDish = false;
            $scope.message="Loading ...";

            $scope.dish = dish;//menuFactory.get({id:parseInt($stateParams.id,10)});
            /*.$promise.then(
                            function(response){
                                $scope.dish = response;
                                $scope.showDish = true;
                            },
                            function(response) {
                                $scope.message = "Error: "+response.status + " " + response.statusText;
                            }
            );
            */

            $scope.popover = $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
              scope: $scope
            }).then(function(popover) {
              $scope.popover = popover;
            });

            $scope.showOptions = function($event){
               $scope.popover.show($event);
            };

            $scope.closeOptions = function(){
              $scope.popover.hide();
            };

            $scope.addFavorite = function(index){
            //  console.log(index);
              favoriteFactory.addToFavorites(index);
              $scope.closeOptions();
              $ionicPlatform.ready(function(){
                $cordovaLocalNotification.schedule({
                  id: 1,
                  title:"Added Favorite",
                  text: $scope.dish.name
                }).then(function(){
                  console.log('Added Favorite ' + $scope.dish.name);
                }, function(){
                  console.log('Failed to add Favorite');
                })
              });

              $cordovaToast
              .show('Added Favorite ' + $scope.dish.name,'long','bottom')
              .then(function(){

              },function(){

              });

            };

          //  $scope.addComment = function(){

            //};

            $scope.mycomment = {};

            $ionicModal.fromTemplateUrl('templates/dish-comment.html',{
              scope:$scope
            }).then(function(modal){
              $scope.commentForm = modal;
            });

            $scope.closeComment = function(){
              $scope.commentForm.hide();
            };
            $scope.comment = function(){
                $scope.commentForm.show();
              };
            $scope.addComment = function(){
              //$scope.reserveData.push($scope.reservation);
              //$timeout(function () {
                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);
                $scope.dish.comments.push($scope.mycomment);
                menuFactory.update({id:$scope.dish.id},$scope.dish);
              //  $scope.commentForm.$setPristine();
                $scope.mycomment = {rating:"", comment:"", author:"", date:""};
                $scope.closeComment();
                $scope.closeOptions();
              //}, 10);
            };


        }])

        .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {

            $scope.mycomment = {rating:5, comment:"", author:"", date:""};

            $scope.submitComment = function () {

                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);

                $scope.dish.comments.push($scope.mycomment);
        menuFactory.update({id:$scope.dish.id},$scope.dish);

                $scope.commentForm.$setPristine();

                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            }
        }])

.controller('IndexController', ['$scope','baseURL','dish', 'leader', 'promotion',function($scope,baseURL,dish, leader, promotion) {
                        $scope.baseURL = baseURL;
                        $scope.leader = leader;//corporateFactory.get({id:3});
                        $scope.showDish = false;
                        $scope.message="Loading ...";
                        $scope.dish = dish;/*menuFactory.get({id:0})
                        .$promise.then(
                            function(response){
                                $scope.dish = response;
                                $scope.showDish = true;
                            },
                            function(response) {
                                $scope.message = "Error: "+response.status + " " + response.statusText;
                            }
                        ); */
                        $scope.promotion = promotion;//promotionFactory.get({id:0});

                        $scope.onSwipeLeft = function(){
                          console.log("on swipe left")
                        };

                    }])

        .controller('AboutController', ['$scope','baseURL','leaders', function($scope, baseURL, leaders) {
                    $scope.baseURL = baseURL;
                    $scope.leaders = leaders; //corporateFactory.query();
                    console.log($scope.leaders);

                    }])
          /*.filter('favoriteFilter', function () {
              return function (dishes, favorites) {
                  var out = [];
                  console.log(dishes);
                  console.log(favorites);
                  for (var i = 0; i < dishes.length; i++) {
                      for (var j = 0; j < favorites.length; j++) {
                          if (dishes[i].id === favorites[j].id)
                              out.push(dishes[i]);
                      }
                  }
                  return out;

              }})*/
/*
        .filter('favoriteFilter', function () {
        return function (dishes, favorites) {
            //console.log(dishes);
            //console.log(favorites);
            var out = [];
            for (var i = 0; i < dishes.length; i++) {
                for (var j = 0; j < favorites.length; j++) {
                    if (dishes[i].id === favorites[j].id)
                        out.push(dishes[i]);
                }
            }
            return out;

        }})
        */


.controller('FavoritesController', ['$scope','favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout','dishes','favorites','$cordovaVibration',
      function ($scope,favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout,dishes,favorites,$cordovaVibration) {
    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;

  /*  $ionicLoading.show({
        template: '<ion-spinner></ion-spinner> Loading...'
    }); */

    $scope.favorites = favorites;//favoriteFactory.getFavorites();

    $scope.dishes = dishes;/*menuFactory.query(
        function (response) {
            $scope.dishes = response;
            $timeout(function () {
                $ionicLoading.hide();
            }, 1000);
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
            $timeout(function () {
                $ionicLoading.hide();
            }, 1000);
        }); */
    console.log($scope.dishes, $scope.favorites);

    $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        console.log($scope.shouldShowDelete);
    }

    $scope.deleteFavorite = function (index) {

          var confirmPopup = $ionicPopup.confirm({
              title: 'Confirm Delete',
              template: 'Are you sure you want to delete this item?'
          });

          confirmPopup.then(function (res) {
              if (res) {
                  console.log('Ok to delete');
                  favoriteFactory.deleteFromFavorites(index);

                  $ionicPlatform.ready(function(){
                      $cordovaVibration.vibrate(10000);
                  });

              } else {
                  console.log('Canceled delete');
              }
          });

          $scope.shouldShowDelete = false;

      }}])

    .filter('favoriteFilter', function () {
return function (dishes, favorites) {
    var out = [];
    for (var i = 0; i < favorites.length; i++) {
        for (var j = 0; j < dishes.length; j++) {
            if (dishes[j].id === favorites[i].id)
                out.push(dishes[j]);
        }
    }
    return out;

}});

;
