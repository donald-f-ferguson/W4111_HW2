//var app = angular.module("CustomerApp", []);

CustomerApp.controller("homeController", function($scope, $http, $location, $window) {


    (function(d, s, id) {
        let js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2&appId=340974923143746&autoLogAppEvents=1';
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    FB.Event.subscribe('auth.login', function() {
        console.log("Hello.")
    });

    $scope.lemail = null;
    $scope.password = null;
    $scope.password2 = null;
    $scope.firstName = null;
    $scope.lastName = null;
    $scope.register = false;
    $scope.loginRegisterResult = false;
    $scope.useEmailLogin = false;
    $scope.menuSelection = 'home';

    console.log("Controller loaded.");
    console.log("Base URL = " + $location.absUrl());
    console.log("Host = " + $location.host());
    console.log("Port = " + $location.port());
    console.log("Protocol = " + $location.protocol());

    $scope.navMenu = function(selection) {
        console.log("Selection = " + selection);
        $scope.menuSelection = selection;
    };

    $scope.getNavClass = function(selection) {
        if (selection == $scope.menuSelection) {
            return "nav-item active";
        }
        else {
            return "nav-item";
        }
    };

    let getApiURL = function() {
        let host = $location.host();
        let port = $location.port();
        let protocol = $location.protocol();
        let apiUrl = protocol + "://" + host + ":" + port + "/api";
        return apiUrl;
    };

    $scope.doFacebook = function() {
        console.log("Facebook Login.")
        FB.login(function(response) {
            if (response.authResponse) {
                $("#loginModal").modal("hide");
                console.log("Login response = " + JSON.stringify(response))
                console.log('Welcome!  Fetching your information.... ');
                FB.api('/me', function(response) {
                    console.log('Good to see you, ' + response.name + '.');
                    console.log("Full FB response is ...")
                    console.log(JSON.stringify(response))
                })
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        });
    };



    console.log("API URL = " + getApiURL());

    $scope.loginOK = function() {
        let result = false;

        // Check to see if already logged on
        let claim = $window.sessionStorage.getItem("credentials");
        if (claim) {
            $scope.loginRegisterResult=true;
            return true;
        }
        if ($scope.register) {
            result =
                ($scope.lemail && $scope.password && $scope.password2 && $scope.firstName && $scope.lastName) &&
                ($scope.password == $scope.password2);
        }
        else {
            result = ($scope.lemail && $scope.password);
        }
        return result;
    };

    $scope.doLogin = function() {
        $("#loginModal").modal("show");
    };
    $scope.doAddressModal = function() {
        $("#addressModal").modal("show");
    };

    let getCustomerInfo=function(data) {
        let url = getApiURL() + data.links[0].href;
        let claim = $window.sessionStorage.getItem("credentials");
        let config = {}
        config.headers = { "authorization": claim }
        $http.get(url, config).then(
            function(result) {
                console.log("Result = " + JSON.stringify(result));
                $scope.customerInfo = result.data;
            },
            function(error) {
                console.log("Result = " + JSON.stringify(result));
            });
    }


    $scope.driveLogin = function() {
        let req = null;
        let url = null;
        let op = null;

        if ($scope.register) {
            req = {
                lastName: $scope.lastName,
                firstName: $scope.firstName,
                email: $scope.lemail,
                pw: $scope.password
            };
            op = "register";
            url = getApiURL() + "/register";
        }
        else {
            req = {
                email: $scope.lemail,
                pw: $scope.password
            };
            op = "login";
            url = getApiURL() + "/login";
        };

        $http.post(url, req).then(
            function(result) {
                console.log("Result = " + JSON.stringify(result));
                let authorization = result.headers('authorization');
                $window.sessionStorage.setItem("credentials", authorization);
                $scope.loginRegisterResult = true;
                $scope.loginRegisterMessage = "Success. Registered/Logged on. Click close";
                getCustomerInfo(result.data)
            },
            function(error) {
                console.log("Result = " + JSON.stringify(error));
                $scope.loginRegisterMessage = "Failed. Close and try again."
                $scope.loginRegisterResult = true;
            }
        );

    };


});

