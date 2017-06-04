// File used to initialize the facebook app

window.fbAsyncInit = function() {
  FB.init({
    appId      : '1489686947739416',
    cookie     : true,
    xfbml      : true,
    version    : 'v2.8'
  });
  FB.AppEvents.logPageView();
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

 function checkLogin() {
   FB.getLoginStatus(function(x){
     console.log(x.authResponse);
   });
 }
