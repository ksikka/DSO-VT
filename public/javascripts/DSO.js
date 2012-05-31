var video = document.getElementsByTagName('video')[0];
var seekbar = document.getElementById('seekbar');
var mutebutton = document.getElementById('mutebutton');
var volumecontrol = document.getElementById('volumecontrol');
var review = false;	
var newCmd = false;
var reviewBar = document.getElementById('reviewSlider');
var sk = document.getElementById('reviewControl');

$(document).ready(function(){

/* Populating shortcuts in the right content area*/      
    populateAccessCommands(); 	
/* Setting up the table for transcription text area */      
    $(function() {
         $('.contenteditable')
            .attr('contenteditable','true')
            .live('focus',function() {
                $(this).addClass("selected");
            })
            .live('click',function() {
                if($(this).text()== "Start typing here...")
                {
                 	$(this).text("");
                 	$('tr[class="active"] td div[class="stamp"]').html(formatTime(video.currentTime));
                } 
            })
            .live('keypress',function(e) {
            
                var k=new String(e.which);
                if (!k.match(/^(0|13)$/)) {
                    if ($(this).hasClass("selected")) {
                        $(this).removeClass("selected");
                    }
                }
                
                if (k.match(/^(13)$/)){  
                	var ts = formatTime(video.currentTime);
                	$('tr[class="active"]').attr('endTime',ts);
                	e.preventDefault();                  	            	
                	$(this).closest('tr').removeClass('active');
                	$(this).closest('tbody').append('<tr class="active"> <td style="width:6%;"><div class="stamp"></div></td> <td style="width:94%;"><div class="contenteditable"></div></td></tr>');
                	$('tr[class="active"] td div[class="contenteditable"]').attr('contenteditable','true').focus();
                	$('tr[class="active"]').attr('startTime',ts);
                	$('tr[class="active"] td div[class="stamp"]').html(ts);
                }                
            });
        $('.contenteditable:first').focus();
    });


/* TimeStamp button - click event handler. Adds the current video timecode to the current row of text */
$('#timeStamp').click(function(){

		if(video.currentTime<=0)
		{
			alert("video not playing");		
		}
		else
		{
			var t = formatTime(video.currentTime);
			$('tr[class="active"] td div[class="stamp"]').html(t);
		}
	
	});
	
});


/* Populating shortcuts in the right content area. Checks the browser type and displays the access keys for the browser as a note at the top of the panel.*/   	
function populateAccessCommands()
{	
	if($.browser.safari || $.browser.webkit)
	{
		//$('#browserText').html('Press "Ctrl"+"Alt" (or "Ctrl"+"Option" if on MacOS) + [shortcut key] to activate an action from keyboard.');
		$('#browserText').html('To activate a command from keyboard, press - "Ctrl"+"Alt"(or Option)+[keyboard shortcut below]');
	}
	else if($.browser.mozilla)
	{
		$('#browserText').html('Press "Alt"+"Shift"+ (or "Ctrl" if on MacOS)+[shortcut key] to activate an action from keyboard.');
	}
	
   	$('.quickAccess').each(function(){

   			if($('#keyboardShortcuts td:contains('+$(this).html()+')').length)
   			{

   				$('#keyboardShortcuts td:contains('+$(this).html()+')').next().children('.command').html($(this).attr('accesskey'));
   			}
   			else
   			{
	    		$('#keyboardShortcuts').find('.last').find('.function').html($(this).html());
	    		$('#keyboardShortcuts').find('.last').find('.command').html($(this).attr('accesskey'));
	    		$('#keyboardShortcuts').find('.last').removeClass('last').closest('tbody').append('<tr class="last"> <td><div class="function"></div></td> <td><div class="command"></div></td></tr>');
	    	}
   		
   	});
};

/*To populate the dropdown when trying to add or edit a shortcut*/
function populateCmdOptions()
{
	if(newCmd==true)
	{
		$('button:not(:has(accesskey))').each(function(){
			$('#addButtons').append('<option>'+$(this).html()+'</option>');
		});
	}
	else
	{
		$('button:not(:has(accesskey))').each(function(){
			$('#editButtons').append('<option>'+$(this).html()+'</option>');
		});		
	}
}

/*Tooltip and click event handler when adding a new shortcut. Checks if a shortcut already exists for the selected action, and adds one otherwise. In case of an existing shortcut, redirects the user to edit it*/
$('#addShortcut').hover(function(){
	$(this).tooltip();
});

$('#addShortcut').click(function(){

	newCmd=true;
	populateCmdOptions();
	$('#addButtons').show();
	$('#cmdEditPanel').show();
});

$('#cancel').click(function(){
	$('#addButtons').hide();
	$('#cmdEditPanel').hide();
	newCmd=false;
});

$('#ok').click(function(){
	if(newCmd==true)
	{
		var btn = $('#addButtons').val();
		var cmd = $('#accessVal').val();
		if($('#keyboardShortcuts td:contains('+btn+')').length)
		{
			alert("A shortcut already exists for this command. Please edit if you wish to change it.");
			$('#cmdEditPanel').hide();
		}
		else
		{
			if(cmd != '')
			{
				$('button').each(function(){
					if($.trim($(this).html()) == $.trim(btn))
					{
						var id = $(this).attr('id');
						$('button[id='+id+']').attr('accesskey',cmd);
						$('button[id='+id+']').addClass('quickAccess');
						return false;
					}
				});
				populateAccessCommands();
				$('#addButtons').hide();
				$('#cmdEditPanel').hide();
				newCmd = false;
			}
		}
	}
	else
	{
		var btn = $('#editButtons').val();
		var cmd = $('#accessVal').val();
		if(cmd != '')
		{
			$('button').each(function(){
				if($(this).html() == btn)
				{
					var id = $(this).attr('id');
					$('button[id='+id+']').attr('accesskey',cmd);
					return false;
				}
			});
			populateAccessCommands();
			$('#editButtons').hide();
			$('#cmdEditPanel').hide();
		}
	}
});

/*Tooltip and event handler when editing an existing shortcut. Tooltip uses a jQuery plugin */
$('#editShortcut').hover(function(){
	$(this).tooltip();
});

$('#editShortcut').click(function(){
		var fn = $('table[id="keyboardShortcuts"] tr[class="selected"] td div[class="function"]').html();		
		var c = $('table[id="keyboardShortcuts"] tr[class="selected"] td div[class="command"]').html();
		newCmd = false;
		$('#editButtons').show();
		populateCmdOptions();		
		$('#editButtons').val(fn);
		$('#accessVal').val(c);
		$('#cmdEditPanel').show();
});

/*Tooltip and event handler when deleting a shortcut*/
/*Need to add a confirmation box to confirm the delete before the action takes place */
$('#deleteShortcut').hover(function(){
	$(this).tooltip();
});

$('#deleteShortcut').click(function(){
	if($('table[id="keyboardShortcuts"] tr[class="selected"]').length)
	{
		var fn = $('table[id="keyboardShortcuts"] tr[class="selected"] td div[class="function"]').html();		
		var c = $('table[id="keyboardShortcuts"] tr[class="selected"] td div[class="command"]').html();
		
		$('button').each(function(){
			if(($.trim($(this).html()) == $.trim(fn)) && ($(this).hasClass('quickAccess')))
			{
				var id = $(this).attr('id');
				$('button[id='+id+']').removeAttr('accesskey');
				$('button[id='+id+']').removeClass('quickAccess');
				$('table[id="keyboardShortcuts"] tr[class="selected"]').remove();
				return false;
			}
		});
		populateAccessCommands();
	}
});

/* Handling the selection of an entry in the shortcuts panel */
$('table[id="keyboardShortcuts"] tr').live("click",function(){

	if($(this).attr('class')=='selected')
	{
		$(this).removeClass('selected');
		$('#editShortcut').attr('disabled','disabled');
	}
	else
	{
		if($(this).siblings('.selected').length)
		{
			$(this).siblings('.selected').removeClass('selected');
		}
		$(this).addClass('selected');
		$('#editShortcut').removeAttr('disabled');
	}
	
});


/* Handling video controls - mute/unmute button, seekbar*/
function muteOrUnmute() {
  video.muted = !video.muted;
  mutebutton.value = video.muted ? 'Unmute' : 'Mute';
}

video.onvolumechange = function(e) {
  mutebutton.value = video.muted ? 'Muted' : 'Unmuted';
  volumecontrol.value = video.volume;
}

function updateVolume() {
  video.volume = volumecontrol.value;
}

function setupSeekbar() {
  if(review != true)
	  seekbar.max = video.duration;
  else
  	  sk.max = video.duration;
}


function seekVideo() {
  if(review != true)
	  video.currentTime = seekbar.value;
  else
  {
  	  video.currentTime = sk.value;
  	  //reviewText();
  }
}


/* Highlight the row of text corresponding to the current video frame. Checks if the current time of the video lies within the start and end times of the text */

function reviewText(){
	
	$('#transcript tr').each(function(){
		if($(this).attr('endtime')>=formatTime(video.currentTime) && $(this).attr('starttime')<=formatTime(video.currentTime) )
			$(this).css('background-color','lightblue');
		else
			$(this).css('background-color','white');
	});

}

video.ondurationchange = setupSeekbar;
seekbar.onchange = seekVideo;
video.addEventListener('timeupdate', timeupdate, false);
sk.onchange = seekVideo;


/* Updates the seekbar controls based on the current video frame */
function timeupdate() {
  var lastBuffered = video.buffered.end(video.buffered.length-1);
  seekbar.min = video.startTime;
  seekbar.max = lastBuffered;
  seekbar.value = video.currentTime;
  $('#timer').html(formatTime(video.currentTime));
  if(review == true)
  {
	  sk.min = video.startTime;
	  sk.max = lastBuffered;
	  sk.value = video.currentTime;
	  reviewText();
  }
}


/*Displaying the 'play'/'pause' button*/
$('#play').live('click',function(){			
	  if (video.ended || video.paused) {
	    video.play();
	    $(this).html('Pause');
	  } else {
	    video.pause();
	    $(this).html('Play');
	  }
});


/* Handling the click of the Review button and invokes reviewText() */

$('#review').click(function(){
	review = true;
	$(this).html('Transcribe');
	if (video.paused || video.ended)	
	{ //alert("not playing");	

	}
	else
	{
		//alert('playing');
		video.pause();
		sk.value=0;
		$('#play').html('Play');
	}
	$('#reviewSlider').show();

});


$('#startReview').click(function(){
	//if($(this).html() == "Play")
	//{
		if (video.ended || video.paused) {
		  video.play();	  
		  $(this).html('Pause');
		  //reviewText();	  
		}
		else {
		  video.pause();
		  $(this).html('Play');
		}
//	}
//	else if($(this).html() == "Pause")
//	{
		//else {
//		  video.play();
//		  $(this).html('Play');
		//}
//	}
});

$('#closeReview').click(function(){
	review=false;
	video.pause();
	$('#startReview').html('Play');
	$('#review').html('Review');
	$('#reviewSlider').hide();
	
});

/*Video playback controls*/
$('#20back').live('click',function(){
	video.currentTime = video.currentTime-20;
});

$('#10back').live('click',function(){
	video.currentTime = video.currentTime-10;
});

$('#10fwd').live('click',function(){
	video.currentTime = video.currentTime+10;
});

$('#20fwd').live('click',function(){
	video.currentTime = video.currentTime+20;
});


/*Function to convert the time returned from the video into a proper format. Video.currentTime returns the number of seconds */
function formatTime(seconds) {
   minutes = Math.floor(seconds / 60);
   minutes = (minutes >= 10) ? minutes : "0" + minutes;
   seconds = Math.floor(seconds % 60);
   seconds = (seconds >= 10) ? seconds : "0" + seconds;
   return minutes + ":" + seconds;
 }
	

