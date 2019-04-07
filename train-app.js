

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

    var train = "";
    var destination = "";
    var frequency = "";
    var nextArrival = "";
    var minsAway = "";

    // Capture Button Submit
    $('#submit-btn').on('click', function (event) {
        event.preventDefault();

        train = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        frequency = $("#frequency").val().trim();
        nextArrival = $("#next-arrival").val().trim();
        minsAway = $("#mins-away").val().trim();

        database.ref("/trainInfo").push({
            train: train,
            destination: destination,
            frequency: frequency,
            arrival: nextArrival,
            minutes: minsAway,

            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        // Clears the values inputed once submit is clicked
        $("#train-name").val("");
        $("#destination").val("");
        $("#frequency").val("");
        $("#next-arrival").val("");
        $("#mins-away").val("");
    })

    // Firebase watcher + initial loader
    database.ref("/trainInfo").on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());

        var train = childSnapshot.val().train;
        var destination = childSnapshot.val().destination;
        var frequency = childSnapshot.val().frequency;
        var nextArrival = childSnapshot.val().arrival;
        var minsAway = childSnapshot.val().minutes;
    
        // Log the value of the various properties
        console.log(train);
        console.log(destination);
        console.log(frequency);
        console.log(nextArrival);
        console.log(minsAway);


        // // snapshot.forEach(element => {

            // newRow.append('<td>' + snapshot.val().train + '</td>')
            // newRow.append('<td>' + snapshot.val().destination + '</td>')
            // newRow.append('<td>' + snapshot.val().frequency + '</td>')
            // newRow.append('<td>' + snapshot.val().nextArrival + '</td></tr>')
            // newRow.append('<td>' + snapshot.val().minsAway + '</td></tr>')
            // $("#fromDatabase").append(newRow);
            // console.log("for loop running");

        // // });

        // Adds new  rows and table data below the original table headings at the top
        var newRow = $("<tr>").append(
            $("<td>").text(train),
            $("<td>").text(destination),
            $("<td>").text(frequency),
            $("<td>").text(nextArrival),
            $("<td>").text(minsAway),
        );

        $("#fromDatabase").append(newRow);
    });


})