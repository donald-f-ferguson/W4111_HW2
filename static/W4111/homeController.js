//var app = angular.module("CustomerApp", []);

CustomerApp.controller("homeController", function($scope, $http, $location, $window) {

    console.log("Loaded.")

    $scope.lemail = null;
    $scope.password = null;
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

    $scope.boo = function() {
        console.log("Boo")
    };

    $scope.buttonStates = {
        lookUp: { code: 0, msg: "Look it up dude!"},
        resetIt: { code: 1, msg: "Reset it dude."}
    };



    var urlBase = "http://127.0.0.1:5000";

    $scope.input = {}

    $scope.input.searchStates = {
        byId: 0,
        byName: 1
    };

    $scope.input.search_type = null;
    $scope.currentPeople = null;
    $scope.currentButtonState = $scope.buttonStates.lookUp;
    $scope.currentPage = null;
    $scope.battingInfo = null;
    $scope.showDetails = false;

    $scope.input.inputFirstName = null;
    $scope.input.inputLastName = null;
    $scope.input.playerId = null;
    $scope.inputMode = null;

    $scope.model = {};
    $scope.model.current_player = null;
    $scope.model.currentPeople = []

    $scope.model.havePaging = false;
    $scope.model.havePrev = false;
    $scope.model.haveNext = false;

    $scope.canLookup = function() {
        console.log("input.playerId = ", $scope.input.playerId)
        console.log("search_type = ", $scope.input.search_type)
        if ($scope.input.playerId && $scope.input.playerId.length > 0) {
            return true;
        }
        if ($scope.input.inputLastName && $scope.input.inputLastName.length > 0) {
            return true;
        }
        return false;
    };

    $scope.showPeople = function() {
        var result;

        if ($scope.model.currentPeople) {
            result = ($scope.model.currentPeople.length>0)&&$scope.showList;
        }
        else {
            result = false;
        }
        return result;
    };

    $scope.doCloseDetails = function() {
        $scope.showDetails = false;
        $scope.showList = true;
    };


    $scope.details = function(index) {
        console.log("Index = " + index);
        console.log("Name = " + $scope.model.currentPeople[index].nameFirst);
        doGetBatting($scope.model.currentPeople[index].playerID);
        //processBatting($scope.currentPeople[index]);
    };

    var doGetBatting = function(playerId) {
        /*
        I use a query here but we should follow a path.
         */
        var url = urlBase + "/api/lahman2017/batting?playerID=" + playerId;
        $http.get(url).then(
            function (data) {
                result = data.data;
                console.log("Data = " + JSON.stringify(result, null, 4));
                processBatting(result);
            },
            function (error) {
                console.log("Error = " + JSON.stringify(error, null, 4));
            }
        );
    };

    var goGetPerson = function(playerId) {
        var url = urlBase + "/api/lahman2017/people/" + playerId.value;
        $http.get(url).then(
            function (data) {
                result = data.data;
                console.log("doGetPerson result  = " + JSON.stringify(result, null, 4));
                processCurrentPerson(result);
            },
            function (error) {
                console.log("Error = " + JSON.stringify(error, null, 4));
            }
        );
    }
    var doGetPeople = function(url) {
        $http.get(url).then(
            function (data) {
                result = data.data;
                console.log("Data = " + JSON.stringify(result, null, 4));
                processPage(result);
            },
            function (error) {
                console.log("Error = " + JSON.stringify(error, null, 4));
            }
        );
    };
    $scope.doNext = function() {
        console.log("Next URL would be " + $scope.model.haveNext);
        doGetPeople($scope.model.haveNext);
    };
     $scope.doPrev = function() {
        console.log("Prev URL would be " + $scope.model.havePrev);
        doGetPeople($scope.model.havePrev);
    };

    var monthNoToStr = function(n) {
        var months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];
        var i = parseInt(n);
        if (i>=0 && i<=11) {
            return months[i];
        }
        else {
            return "???"
        }
    };
    var getDate = function(y, m, d) {
        var tmp = "";

        if (y) {
            tmp += "-" + y;
        }
        else {
            return "UNKNOWN";
        }
        if (m) {
            tmp = "-" + monthNoToStr(m) + tmp
        }
        else {
            return "UNKNOWN";
        }
        if (d) {
            tmp = d + tmp
        }
        else {
            return "UNKNOWN";
        }
        return tmp;
    };

    var safeFieldGet = function(f) {
        if (f && f.length>0) {
            return f
        }
        else {
            return "UNKNOW";
        }
    };

    var processBatting = function(result) {

        player_info=$scope.model.currentPeople[0];

        if (player_info.nameGiven &&
            player_info.nameGiven.length > 0){
            player_info.fullName = player_info.nameGiven + " " + player_info.nameLast;
        }
        else {
            player_info.fullName = player_info.nameFirst + " " + player_info.nameLast;
        }
        player_info.DOB = getDate(player_info.birthYear, player_info.birthMonth, player_info.birthDay);
        player_info.DOD = getDate(player_info.deathYear, player_info.deathMonth, player_info.deathDay);
        player_info.throws = safeFieldGet(player_info.throws);
        player_info.bats = safeFieldGet(player_info.bats);
        player_info.height = safeFieldGet(player_info.height);
        player_info.weight = safeFieldGet(player_info.weight);

        batting = result.sort(
            function(a,b) {
                return a.yearID > b.yearID
            });


        $scope.model.current_player = player_info;
        $scope.model.current_player.batting = batting;
        console.log("BattingInfo = " + JSON.stringify($scope.model.current_player, null, 4));
        $scope.showDetails = true;
        $scope.showList = false;
    };

    var processPage = function(result) {
        if (!result) {
            $("#exampleModal").modal();
        }
        else {
            if (!result.data) {
                result.data = result;
            }
            if (result.data) {
                if (! result.data.length) {
                    tmp = result.data;
                    result.data = [];
                    result.data.push(tmp)
                }

                if (result.data.length > 0) {
                    $scope.model.currentPeople = result.data;
                    $scope.showList = true;
                    if (result.links.length > 0) {
                        $scope.model.havePaging = true;
                        $scope.model.haveNext = false;
                        $scope.model.havePrev = false;
                        for (var i = 0; i < result.links.length; i++) {
                            if (result.links[i].rel == "next") {
                                $scope.model.haveNext = result.links[i].href;
                            }
                            if (result.links[i].rel == "previous") {
                                $scope.model.havePrev = result.links[i].href;
                            }
                        }
                    }
                }
                else {
                    $("#exampleModal").modal();
                }
            }
            else {
                $scope.model.currentPeople.push(result);
            };
            $scope.currentButtonState = $scope.buttonStates.resetIt;
            $scope.buttonmsg = $scope.currentButtonState.msg;
            $scope.showList = true;
            $scope.currentPage = result
        };
    };

    $scope.doButton = function() {
        if ($scope.currentButtonState === $scope.buttonStates.lookUp) {
            console.log("Looking it up!");
            var searchUrl = null;
            $scope.model.currentPeople = [];
            if ($scope.input.search_type == $scope.input.searchStates.byId) {
                console.log("playerid = " + $scope.input.playerId);
                searchUrl = urlBase + "/api/lahman2017/people/" + $scope.input.playerId;
            }
            else {
                console.log("nameLast = " + $scope.input.inputLastName);
                console.log("nameFirst = " + $scope.input.inputFirstName);
                searchUrl = urlBase + "/api/lahman2017/people?nameLast=" + $scope.input.inputLastName;
                if ($scope.input.inputFirstName != null) {
                    searchUrl += "&nameFirst=" + $scope.inputFirstName;
                };
            };


            doGetPeople(searchUrl)


        }
        else {
            $scope.model.currentPeople = [];
            $scope.battingInfo = null;
            $scope.showDetails = false;
            //$scope.showList = false;
            $scope.currentButtonState = $scope.buttonStates.lookUp
            $scope.input.inputFirstName = null;
            $scope.input.inputLastName = null;
            $scope.input.playerId = null;
        }
    };

    $scope.click = function() {
        console.log("Clicked.")
        console.log("Search type = " + $scope.input.search_type)
    }




});

