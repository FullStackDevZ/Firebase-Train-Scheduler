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
    $("#time").append(moment().format("hh:mm A"));

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
        
        var value = childSnapshot.val();

        var train = value.train;
        var destination = value.destination;
        var frequency = value.frequency;
        var nextArrival = value.arrival;

        var remainder = moment().diff(moment.unix(nextArrival), "minutes") % frequency;
        console.log(remainder);
        
        var minsAway = nextArrival - remainder;
        console.log(minsAway);

        // // Creates a var to store the current time
        // var tArrival = moment().add(minsAway, "m").format("hh:mm A");
        // console.log(tArrival);

        // Adds new  rows and table data below the original table headings at the top
        var newRow = $("<tr>").append(
            $("<td>").text(train),
            $("<td>").text(destination),
            $("<td>").text(frequency),
            $("<td>").text(nextArrival),
            $("<td>").text(remainder),
        );

        // Sends the data above to the table id fromDatabase
        $("#fromDatabase").append(newRow);
    });

    // Deletes the last row of data when clicked
    $('#delete-btn').on('click', function () {
        document.getElementById("fromDatabase").deleteRow(-1);
    });

})