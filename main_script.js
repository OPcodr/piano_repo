jQuery(document).ready(function($){
  // console.log('hello world');
  //this array is for ordering the piano keys correctly so that the padding can correct it due to the overlap or buttons
  var speed = 1;

  var keys = [
    [1, "wkey"],
    [3, "wkey"],
    [2, "bkey"],
    [5, "reset"],
    [4, "bkey"],
    [6, "reset"],
    [8, "wkey"],
    [7, "bkey"],
    [10, "reset"],
    [9, "bkey"],
    [12, "reset"],
    [11, "bkey"],
    [13, "reset"],
    [15, "wkey"],
    [14, "bkey"],
    [17, "reset"],
    [16, "bkey"],
  ];
  
  //this array is for ordering the piano roll rows
  var roll_keys = [
    [1, "wkey", "#EFEFEF"],
    [2, "bkey", "#282828"],
    [3, "wkey", "#EFEFEF"],
    [4, "bkey", "#282828"],
    [5, "reset", "#EFEFEF"],
    [6, "reset", "#EFEFEF"],
    [7, "bkey", "#282828"],
    [8, "wkey", "#EFEFEF"],
    [9, "bkey", "#282828"],
    [10, "reset", "#EFEFEF"],
    [11, "bkey", "#282828"],
    [12, "reset", "#EFEFEF"],
    [13, "reset", "#EFEFEF"],
    [14, "bkey", "#282828"],
    [15, "wkey", "#EFEFEF"],
    [16, "bkey", "#282828"],
    [17, "reset", "#EFEFEF"]
  ];
  
  //for mapping keys to the piano, not done yet.
  var mapping = [
    [1,"a",65],
    [2,"w",87],
    [3,"s",83],
    [4,"e",69],
    [5,"d",68],
    [6,"f",70],
    [7,"t",84],
    [8,"g",71],
    [9,"y",89],
    [10,"h",72],
    [11,"u",85],
    [12,"j",74],
    [13,"k",75],
    [14,"o",79],
    [15,"l",76],
    [16,"p",80],
    [17,";",186]
  ];
  //piano roll notes array
  var recording = [
    ["o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o"],
    ["o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o"],
    ["o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o"]
  ];
  
  // prints out the keyboard
  for (i=0; i< keys.length;i++) {

    button = '<button data-key="'+keys[i][0]+'" class="'+keys[i][1]+'">4</button>';

    $("#piano_keys").append(button);
  }

  // prints out the piano roll
  function make_piano_roll(){
    $("#piano_roll").empty();
    for(row=0; row< recording.length;row++){
      //creates a div which acts as a row for the buttons to live
      section = '<div id="'+row+'" class="gooddiv"></div>';
      $("#piano_roll").append(section);
      //populates the div with buttons with an id that matches the row, and data-key that matches the note
      for (i=0; i< keys.length;i++) {
        if(recording[row][i] == "a"){
          var hit = "hit";
        }else{
          var hit = "";
        }
        button = '<button data-time = "'+row+'" data-key="'+roll_keys[i][0]+'" class="'+roll_keys[i][1]+'-roll piano_roll_keys '+hit+'" style="padding:10px 10px 10px 10px"></button>';
        $("#"+row).append(button);
      }
    }
  }
  make_piano_roll();
  
  //triggers the click function when a key with a specific data type is pressed.
  $(document).on('mousedown', "button", function() {
    key = $(this).data('key');
    note = $(this).data('time');
    click(key);
    lastnote(note);
    $('[data-key="'+(key)+'"]').addClass("pressdown");
  });

  $(document).on('mouseup', "button", function() {
    key = $(this).data('key');
    $('[data-key="'+(key)+'"]').removeClass("pressdown");
  });

  $(document).off('keyup');
  $(document).on('keydown', function(event) {
    for(mapper=0;mapper<mapping.length;mapper++){
      function logit(){
        if (event.keyCode == mapping[mapper][2]) {
          click(mapper+1);
          $('[data-key="'+(mapper+1)+'"]').addClass("pressdown");
        }
      };
      logit();
    }
  });

  $(document).on('keyup', function(event) {
    for(mapper=0;mapper<mapping.length;mapper++){
      function logit(){
        if (event.keyCode == mapping[mapper][2]) {
          $('[data-key="'+(mapper+1)+'"]').removeClass("pressdown");
        }
      };
      logit();
    }
  });



  //when called by the jquery function, plays an audio file based on the param that it was given.
  function click(key) {
    console.log(key);
    var audio  = new Audio();
    file = owen_plugin_path+"/assets/key"+key+".mp3";
    audio.src = file;
    audio.play();
  }
  
  function lastnote(note){
    if(note == (recording.length-1)){
      addrow();
      scrollToBottom();
    }
  }

  scrollingElement = (document.scrollingElement || document.body);
  function scrollToBottom () {
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
  }

  // $(".header-footer-group").remove();

  //calls the select function when a button with the class .piano_roll_keys is clicked. the select function changes the values in the "recording" array.
  $(document).on('mousedown', '.piano_roll_keys', function() {
    console.log("class is working");
    note = parseInt($(this).data('key'));
    time = parseInt($(this).data('time'));
    if(recording[time][note-1] == "o"){
      $(this).addClass("hit");
    } else {
      $(this).removeClass("hit");
      // $(this).css('background-color', roll_keys[note-1][2]);
    }
    select(note,time);
  });
  
  
  //the function to be called when the specific note is clicked. changes the note to be on.
  function select(note,time){
    if(recording[time][note-1] == "o"){
      recording[time][note-1] = "a";
    } else {
      recording[time][note-1] = "o";
    };
    console.log(recording);
  }
  
  //triggers addrow when button with id #addrow is clicked
  $("#addrow").on('mousedown', function() {
    addrow();
  });
  
  //this function pushes an array of "o"s to recording. it also reprints the piano roll
  function addrow(){
    console.log(recording);
    recording.push(["o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o"]);
    newrow = recording.length-1;
    //this is basically a repeat of the orignal code that prints out the piano roll in the first place.
    function printpianoroll(){
      section = '<div id="'+newrow+'" class="gooddiv"></div>';
      $("#piano_roll").append(section);
      //populates the div with buttons with an id that matches the row, and data-key that matches the note
      for (i=0; i< keys.length;i++) {
        newbutton = '<button data-time = "'+newrow+'" data-key="'+roll_keys[i][0]+'" class="'+roll_keys[i][1]+'-roll piano_roll_keys" style="padding:10px 10px 10px 10px"></button>';
        $("#"+newrow).append(newbutton);
      }
    }
    printpianoroll();
  }

  //triggers playsong when button with id #playsong is clicked
  $("#playsong").on('mousedown', function() {
    playsong();
  });

  // $("#faster").on('mousedown', function(){
  //   speed -= .05;
  //   console.log(speed);
  //   $('#speed').html(speed);
  // });
  // $("#slower").on('mousedown', function(){
  //   speed += .05;
  //   console.log(speed);
  //   $('#speed').html(speed);
  // });
  var slider = document.getElementById("myrange");
  var output = document.getElementById("output");
  output.innerHTML = slider.value;
  var speed = 50;

  slider.oninput = function(){
    output.innerHTML = slider.value;
    speed = slider.value;
  }



  //plays the song based on the "recording" 2d array
  function playsong(){
    console.log(recording.length);
    for(t=0;t<=recording.length; t++){
      function inside(t){
        setTimeout(function(){
          $("#"+t+" button").addClass("played");
          if(t!==0){
            last = t-1;
            $("#"+last+" button").removeClass("played");
            console.log($("#"+last+" button ").data("key"));
            for(revertColumn=0;revertColumn<recording[0].length;revertColumn++){
              console.log(revertColumn);
            }
          }
          for(n=0;n<=16; n++){
            if(recording[t][n] == "a"){
              var audio  = new Audio();
              file = owen_plugin_path+"/assets/key"+(n+1)+".mp3";
              audio.src = file;
              audio.play();
            };
          };
        }, ((101-speed)*10)*t);
      }
      inside(t);
    };
  };

  var songloadindex = 0;
  var songstoload = songloadindex+100;
  
  function fillwithsongs(){
    $.ajax({
      type: 'POST',
      dataType:'JSON',
      url: 'https://owenpalmer.com/wp-content/plugins/owen-plugin/loadsongs.php',
      data: {test:songstoload}
    }).done(function(response) {
      console.log(response);
      console.log(songloadindex+"yoooaaaa");
      console.log(songstoload+"yo");
      for(let i=songloadindex;i<songstoload;i++){
        $("#songs_list").prepend("<div class='loaded_blocks' id='"+response[i].ID+"'><span class='title'>"+response[i].title+"</spand><span> by </span><span class='name'>"+response[i].name+"</span><button id='load' data-song='"+response[i].ID+"'>Load</button></div>");
      }
    })
    // $("#songs_list").append("<button id='showmore'>Show More</button>");
  }
  fillwithsongs();
  
  // $(document).on('click', '#showmore', function(){
  //   $('#showmore').remove();
  //   songloadindex += 5;
  //   fillwithsongs();
  // });


  var saveopen = 0;
  $(document).on('click', '#save', function(e) {
    if(saveopen == 0){
      $("#songs_list").prepend("<div id='save-window'><label for='yourname'>Your Name</label><input type='text' id='yourname' name='yourname'><label for='title'>Song Name</label><input type='text' id='title' name='title'><br><button id='uploadtodb'>Upload To Database</button></div><br>");
      saveopen = 1;
      console.log(saveopen);
    };
  });
  
  $(document).on('click', '#uploadtodb', function(e) {
    saveopen = 0;
    console.log(saveopen);
    var yourname = document.getElementById("yourname").value;
    var title = document.getElementById("title").value;
    console.log(yourname+title);
    $.ajax({
      type: 'POST',
      dataType: 'JSON',
      url: 'https://owenpalmer.com/wp-content/plugins/owen-plugin/addstuff.php',
      data: {song: recording, name:yourname, title:title},
    }).done(function(response) {
      console.log(response);
    })
    $("#songs_list").empty();
    fillwithsongs();
  });

  $(document).on('click', '#load', function(e) {
    console.log($(this).data("song"));
    $.ajax({
      type: 'POST',
      dataType: 'JSON',
      url: 'https://owenpalmer.com/wp-content/plugins/owen-plugin/takestuff.php',
      data: {load: $(this).data("song")}
    }).done(function(response) {
      console.log(response);
      recording = response;
      make_piano_roll();
    })
  });

});
