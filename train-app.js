$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyCqR70MCikov5OiB4kdGir6iSMWcnJTMQ0",
        authDomain: "train-sark.firebaseapp.com",
        databaseURL: "https://train-sark.firebaseio.com",
        projectId: "train-sark",
        storageBucket: "train-sark.appspot.com",
        messagingSenderId: "317089221137"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    // Shows the current time
    $("#time").append(moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));

    // Sets up the variables
    var train = "";
    var destination = "";
    var frequency = "";
    var nextArrival = "";

    // Submit button
    $('#submit-btn').on('click', function (event) {
        event.preventDefault();

        // Takes the user inputs from the specified IDs
        train = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        frequency = $("#frequency").val().trim();
        nextArrival = $("#next-arrival").val().trim();

        // Sends the values to Firebase
        database.ref("/trainInfo").push({
            train: train,
            destination: destination,
            frequency: frequency,
            arrival: nextArrival,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        // Clears the values inputed once submit is clicked
        $("#train-name").val("");
        $("#destination").val("");
        $("#frequency").val("");
        $("#next-arrival").val("");

        return false;
    })

    // Firebase watcher + initial loader
    database.ref("/trainInfo").on("child_added", function (childSnapshot) {

        let value = childSnapshot.val();

        let name = value.train;
        let destination = value.destination;
        let frequency = value.frequency;
        let nextArrival = value.arrival;

        var timeArr = nextArrival.split(":");
        var trainTime = moment()
            .hours(timeArr[0])
            .minutes(timeArr[1]);
        var maxMoment = moment.max(moment(), trainTime);
        var tMinutes;
        var tArrival;

        // If the first train is later than the current time, sent arrival to the first train time
        if (maxMoment === trainTime) {
            tArrival = trainTime.format("hh:mm A");
            tMinutes = trainTime.diff(moment(), "minutes");
        } else {
            // Calculate the minutes until arrival using hardcore math
            // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
            // and find the modulus between the difference and the frequency.
            var differenceTimes = moment().diff(trainTime, "minutes");
            var tRemainder = differenceTimes % frequency;
            tMinutes = frequency - tRemainder;
            // To calculate the arrival time, add the tMinutes to the current time
            tArrival = moment()
                .add(tMinutes, "m")
                .format("hh:mm A");
        }
        console.log("tMinutes:", tMinutes);
        console.log("tArrival:", tArrival);



        // let remainder = moment(nextArrival, "hh:mm").diff(moment(), "minutes") % frequency;
        // let minsAway = frequency - remainder;



        // console.log(remainder);

        // Adds new  rows and table data below the original table headings at the top
        var newRow = $("<tr>").append(
            $("<td>").text(name),
            $("<td>").text(destination),
            $("<td>").text(frequency),
            $("<td>").text(tArrival),
            $("<td>").text(tMinutes),
        );

        // Sends the data above to the table id fromDatabase
        $("#fromDatabase").append(newRow);
    });

    // Deletes the last row of data when clicked
    $('#delete-btn').on('click', function () {
        document.getElementById("fromDatabase").deleteRow(-1);
    });

})