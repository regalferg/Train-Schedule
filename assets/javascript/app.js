   // Initialize Firebase
   var config = {
       apiKey: "AIzaSyDzpTJV5yDvBW1LTJDjoYCD7rvigowhEtY",
       authDomain: "week-4-project-25645.firebaseapp.com",
       databaseURL: "https://week-4-project-25645.firebaseio.com",
       projectId: "week-4-project-25645",
       storageBucket: "week-4-project-25645.appspot.com",
       messagingSenderId: "1014346966018"


   };

   firebase.initializeApp(config);



   //Create References

   var dataRef = firebase.database().ref().child('trainSchedules');



   //Initial Values


   // Capture Button Click

   $("#add-schedule").on("click", function(event) {
       

       // Input Values to Variables



       var name = $("#name-input").val().trim();

       var destination = $("#destination-input").val().trim();

       var firstTime = $("#first-time-input").val().trim();

       var frequency = $("#frequency-input").val().trim();



       //Code for the push

       dataRef.push({

           name: name,
           destination: destination,
           frequency: frequency,
           firstTime: firstTime,
           dateAdded: firebase.database.ServerValue.TIMESTAMP

       });

   });


   dataRef.on("child_added", function(snapshot) {

       var trainFrequency = snapshot.val().frequency;
       console.log("Frequency :" + trainFrequency);
       var convertedDate = moment(snapshot.val().firstTime, "HH:mm").subtract(1, "years");
       var newTime = moment(convertedDate).format('HH:mm');
       var currentTime = moment();
       console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
       // First Time (pushed back 1 year to make sure it comes before current time)
       var firstTimeConverted = moment(newTime, "hh:mm").subtract(1, "years");
       console.log(firstTimeConverted);

       // Difference between the times
       var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
       console.log("DIFFERENCE IN TIME: " + diffTime);

       // Time apart (remainder)
       var tRemainder = diffTime % trainFrequency;
       console.log(tRemainder);


       // Minute Until Train
       var minsaway = trainFrequency - tRemainder;
       console.log("MINUTES TILL TRAIN: " + minsaway);

       // Next Train
       var nextTrain = moment().add(minsaway, "minutes").format('HH:mm');
       console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


       // Change the HTML to reflect


       $("table tbody").append("<tr><td id ='train-name'>" + snapshot.val().name +
           "</td><td id='train-destination'>" + snapshot.val().destination + "</td><td id='frequency'>" +
           snapshot.val().frequency + "</td><td id='first-time'>" + nextTrain + "</td><td id='mins-away'>" + minsaway +
           "</td></tr>");



       // Handle the errors

   }, function(errorObject) {

       console.log("Errors handled: " + errorObject.code);

   });