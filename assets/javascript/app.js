console.log("༼ つ ◕_◕ ༽つ app.js is linked");

// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyC8IGzKaXb7Hh79HYCy2Iflqc_U2JJBQi8",
    authDomain: "prime-time-train-time.firebaseapp.com",
    databaseURL: "https://prime-time-train-time.firebaseio.com",
    projectId: "prime-time-train-time",
    storageBucket: "",
    messagingSenderId: "842630192991",
    appId: "1:842630192991:web:1d18a71940f00da0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

//   Add train event listener
$("#addTrain").on("click", function(event) {
    event.preventDefault();
    console.log("༼ つ ◕_◕ ༽つ addTrain button was clicked!")

    // Form input stored into variables
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstDeparture = $("#firstDeparture").val().trim();
    var frequency = $("#frequency").val().trim();

    // Object to push to Firebase
    var newTrain = {
        name : trainName,
        dest : destination,
        first : firstDeparture,
        freq : frequency,
    };
    console.log (newTrain);

    database.ref().push(newTrain);
    console.log(newTrain.name);
    console.log(newTrain.dest);
    console.log(newTrain.first);
    console.log(newTrain.freq);

    // Erases all user input so duplicate trains aren't pushed
    $("#trainName").val("");
    $("#destination").val("");
    $("#firstDeparture").val("");
    $("#frequency").val("");
});

database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().dest;
    var firstDeparture = childSnapshot.val().first;
    var frequency = childSnapshot.val().freq;

    // Using moment to convert firstDeparture time & push back 1 year to avoid conflict
    var convertedTime = moment(firstDeparture, "hh:mm").subtract(1, "years");

    // difference in minutes between current time and convertedTime
    var diffTime = moment().diff(moment(convertedTime), "minutes");

    var remainder = diffTime % frequency;

    // Minutues until next departure
    var departureMinutes = frequency - remainder;

    // Next train departure time calculation
    var nextDeparture = moment().add(departureMinutes, "minutes");
    var departureTime = moment(nextDeparture).format("HH:mm")

    // Using jQuery to create new row & append to trainTable
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(departureTime),
        $("<td>").text(departureMinutes),
    );
    $("#trainTable > tbody").append(newRow);
});