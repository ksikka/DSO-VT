    /**************************** Transcription related code *******************************/
    
  var review = false; /* Indicates the current mode of interaction*/
  var spCharFlag = false;
  var spkr = []; // speaker object array
  var rNo; // random number to choose a color for a speaker
  var colorArray = ['red','green','blue','lightBlue', 'lightGreen','yellow','pink','violet','purple','brown','orange','darkBlue','indigo','olive','fuchsia','lime','navy'];
  var currTime;
  var cuepointArray = [];
  var spcur = null;
  
  
/*Create the first speaker object and add it to the object array. Associate a random color with it */
  rNo = Math.floor(Math.random()*18); // generate a random number for the color index.
  spkr[0]= {'key':'1', 'name':'s1','color':colorArray[rNo],'origname':'Speaker1','colorIndex':rNo};
  spkr['s_'+spkr[0].name] = spkr[0];
  $('.segment.active .timestamp.active .start').html("0:00")
  $('.segment.active .speaker')
    .css('background-color',spkr[0].color)
    .addClass('s1')
    .html('s1');


  loadSpeakers();
/* Setting up the table for transcription text area */
  $('.txt.active')
    .live('click',function(e) {
        if($(this).val()== "Start typing here ... ")
        {
          $(this).val("");
        }
    })
       


    .live('keyup',function(e) {
      //For keyup and keydown, '\' is 220. For keypress, '\' is 92. up/down:16 = @; press:64 = @
    if(e.which == 16)
    {
      spCharFlag = true;
    }
    if((spCharFlag==true)) // && (e.which != 32)) // 32 = space
    {
      var term = $(this).val();
      if(term.indexOf('@')>=0)
      {
        var str = term.substring(term.indexOf('@'));
        var reg = /^@s[0-9]+$/, reg1 = /^@s/;
        
        if(e.which == 32)
        {
          if(reg1.test(str))
          {
          	var curSpkr = $(this).parents('.segment').find('.speaker').html();
            var s = speakerExists(curSpkr);
            
            if(s.found == true)
            {
              addRow($(this),curSpkr,colorArray[s.rNo]);
            }
          }
        }
              
        else if(reg.test(str))
        {
          var se = speakerExists(str.substring(1));
          if(se.found == true)
          {
            addRow($(this),se.name,se.color);
          }
          else
          {
            addSpeaker(str.substring(2),str.substring(1),se.rNo);
            addRow($(this),str.substring(1),colorArray[se.rNo]);
          }
                              
          spCharFlag = false;
        }
      }
    }

    });

  function speakerExists(spstr)
  {
    var found = false, name, color;
    $.each(spkr, function(i,s){
      if(s.name == spstr)
      {
        found = true;
        name = s.name;
        color = s.color;
        rNo = s.colorIndex;
      }
    });
    
    if(found == false)
    {
      var temp = [];
      $.each(spkr,function(i,s){
        temp.push(colorArray[s.colorIndex]);
      });
      do
      {
        rNo = Math.floor(Math.random()*18);
      }while($.inArray(colorArray[rNo],temp) != -1);
      color = colorArray[rNo];
    }
  

    return {
      found: found,
      name: name,
      color: color,
      rNo: rNo
    }
  }

  function addSpeaker(spkey,spname,rnum)
  {
    spkr.push({'key':spkey,'name':spname,'color':colorArray[rnum],'origname':'speaker'+spkey,'colorIndex':rnum});
    spkr['s_'+spkr[spkr.length - 1].name]=spkr[spkr.length - 1];
    loadSpeakers();
  }
                    
  function addRow(currentItem, spkrName, spkrColor)
  {
  
  	  var str = currentItem.val();
	  currentItem.val(str.substring(0,str.indexOf('@')));
	  currTime = formatTime($f().getTime());
	  currentItem.removeClass('active').addClass('inactive').attr('contenteditable','false');
	  currentItem.parents('.segment').find('.timestamp').removeClass('active').addClass('inactive');
	  currentItem.closest('.segment').removeClass('active').addClass('inactive');
	  currentItem.parents('.segment').find('.timestamp .end').html(currTime);
  
    currentItem.closest('table').append('<tr class="segment active"> <td class="seg_left"> <div class="timestamp active"><div class="start">'+currTime+'</div><div class="separator"> - </div><div class="end"></div></div><p class="speaker ui-corner-top ui-corner-bottom" style="background-color:'+spkrColor+'">'+spkrName+'</p></td> <td class="seg_right"> <textarea class="txt active"></textarea><div class="reviewWrapper ui-state-highlight ui-corner-all" style="float:right;display:none"><button class="rEdit ui-icon ui-icon-pencil"></button><button class="rSave ui-icon ui-icon-disk" style="display:none"></button><button class="rDel ui-icon ui-icon-trash"></button></div> </td> </tr>');
    $('.active').focus();
  }
  

      
  $('.segment').live('keydown',function(e){

    //Handle special commands
    if(e.which == 32 && e.ctrlKey) //keyCode = 32 for space bar
    {
      // For video Play/Pause
      var state = $f().getState();
      switch(state)
      {
        case -1: alert('not loaded'); break;
        case 0,2: alert('just getting ready to play');break;
        case 3: $f().pause();break;
        case 4: $f().resume();break;
        case 1,5: $f().play();break;
        default: alert(state);break;
        
      }
            
    }
    
    else if(e.ctrlKey && e.altKey && e.which == 78 ) // keyCode = 78 for n
    {
      //To add new segment
      currTime = formatTime($f().getTime());
      $(this).find('.txt').removeClass('active').addClass('inactive');
      $(this).find('.timestamp').removeClass('active').addClass('inactive');
      $(this).removeClass('active').addClass('inactive');
      $(this).find('.timestamp .end').html(formatTime($f().getTime()));
      addRow($(this), $(this).find('p.speaker').html(), $(this).find('p.speaker').css('background-color'));
      
    }
    
    else if(e.ctrlKey && e.altKey && e.which == 38) //keyCode = 38 for up arrow
    {
      // Move to previous segment
      if($(this).prev('.segment').length > 0)
      {
        $(this).removeClass('active').find('.txt').removeClass('active');
        $(this).addClass('inactive').find('.txt').addClass('inactive');
        $(this).prev('.segment').removeClass('inactive').find('.txt').removeClass('inactive');
        $(this).prev('.segment').addClass('active').find('.txt').addClass('active');
        $('.active').focus();
      }
      else
        alert('no more prev segments');
    }
    
    else if(e.ctrlKey && e.altKey && e.which == 40) //keyCode = 40 for down arrow
    {
      // Move to next segment
      if($(this).next('.segment').length > 0)
      {
        $(this).removeClass('active').find('.txt').removeClass('active');
        $(this).addClass('inactive').find('.txt').addClass('inactive');
        $(this).next('.segment').removeClass('inactive').find('.txt').removeClass('inactive');
        $(this).next('.segment').addClass('active').find('.txt').addClass('active');
        $('.active').focus();
      }
      else
        alert('no more next segments');
    }
    
    else if(e.ctrlKey && e.altKey && e.which == 37) //keyCode = 37 for left arrow (188 for ',')
    {
      // Go back 10s in the video
      if($f().isPlaying()==true)
      {
        $f().seek($f().getTime() - 10);
      }
    }
    
    else if(e.ctrlKey && e.altKey && e.which == 39) // keyCode = 39 for right arrow (190 for '.')
    {
      // Go forward 10s in the video
      $f().seek($f().getTime() + 10); // might need additional error handling depending on buffer value
    }
    
    else if(e.altKey && e.which == 83) // keyCode = 83 for s
    {
      // To change speaker
      e.preventDefault();
      var newSp;
      var curSp = $(this).closest('.segment').find('.speaker').html();
      var index = parseInt(curSp.substring(1),10);
      if(index < spkr.length)
      {
        newSp = spkr[index]; //actual array index has an offset of 1. So, no need to add 1.
      }
      else
      {
        newSp = spkr[0];
      }
      $(this).closest('.segment').find('.speaker').html(newSp.name);
      $(this).closest('.segment').find('.speaker').css('background-color',newSp.color);
      
    }
    
  })
  .live('keypress',function(e){
    if(e.altKey && e.which == 115)
    {
      e.stopPropagation();
    }
  });

  $('#review').click(function(){
	    review = true;
	    $f().seek(0);
	    $(this).addClass('restart');
	    $('#export').hide();
	    $('#done').show();
	
		/* Before starting review, ensure that any active segment has been updated to an inactive state - i.e., it is not being currently edited and it's end timestamp has been captured. */
	    $('.segment').each(function(index,value){
	      if($(this).is('.active'))
	      {
	        $(this).find('.timestamp .end').html(formatTime($f().getTime()));
	        $(this).removeClass('active').addClass('inactive');
	        $(this).find('.active').addClass('inactive').removeClass('active');
	      }
	     
	      var c = $(this).find('.timestamp .start').html();          
	      cuepointArray[index]={"time":parseInt(c.substring(0,c.indexOf(':')),10)*60 +parseInt(c.substring(c.indexOf(':')+1,c.length),10)*1000, "segment":index,};
	      
	    });
	                  
	    for(var i = 0; i<cuepointArray.length; i++)
	    {
	      cuepointArray['segment_'+cuepointArray[i].segment]=cuepointArray[i];
	    }
	    
	    loadCuePoints();
  });
  
  $('#done').live('click',function(){
	    review=false;
	    /* code edit */
	    $('tr.segment').show();
	    /*code edit end */
	    
	    $('.reviewActive').find('.timestamp .start').attr('contenteditable','false');
	    $('.reviewActive').find('.timestamp .end').attr('contenteditable','false');
	    $('.reviewActive').find('.txt').attr('contenteditable','false').addClass('inactive');
	    $('.reviewActive div.reviewWrapper').hide();
	    $('.reviewActive').find('.timestamp').addClass('inactive')
	    $('.reviewActive').removeClass('reviewActive').addClass('inactive');
	    $('#review').html(' ');
	    $(this).hide();
	    $('#review').removeClass('restart');
	    $('#export').show();
  });
  
  
  function loadCuePoints()
  {
      
    $f().onCuepoint(cuepointArray,function (clip,cuepoint){    	
      reviewHighlight(cuepoint.segment);
    });

  }
  
  function reviewHighlight(segment)
  {
    $('.reviewActive').find('.timestamp .start').attr('contenteditable','false');
    $('.reviewActive').find('.timestamp .end').attr('contenteditable','false');
    $('.reviewActive').find('.txt').attr('contenteditable','false');
    $('.reviewActive div.reviewWrapper').hide();
    $('.reviewActive').removeClass('reviewActive');
    $('tr.segment:eq('+segment+')').addClass('reviewActive');
    $('tr.segment:eq('+segment+')').find('.reviewWrapper').show();
    
    /* code edited from here */
    $('tr.segment').fadeOut();
    $('tr.reviewActive').fadeIn();
    /* end of code edit */
  }
  
  $('.rEdit').live('click', function(){
    if($f().isPlaying()==true)
    {
      $f().pause();
    }
    $(this).closest('.segment').find('.timestamp .start').attr('contenteditable','true');
    $(this).closest('.segment').find('.timestamp .end').attr('contenteditable','true');
    $(this).closest('.segment').find('.txt').attr('contenteditable','true');
    $(this).siblings('.rSave').show();
    $(this).hide();
    
  });
  $('.rSave').live('click', function(){
    var c = $(this).closest('.segment');
    var segIndex = $('#transcriptionPanel table tr').index(c);
    var startTimeStr = c.find('.timestamp .start').html();
    var endTimeStr = c.find('.timestamp .end').html();
    
    c.prev('.segment').find('.timestamp .end').html(startTimeStr);
    c.next('.segment').find('.timestamp .start').html(endTimeStr);
    
    cuepointArray['segment_'+segIndex].time = parseInt(startTimeStr.substring(0,startTimeStr.indexOf(':')),10)*60 +parseInt(startTimeStr.substring(startTimeStr.indexOf(':')+1,startTimeStr.length),10)*1000;
    cuepointArray['segment_'+(segIndex+1)].time = parseInt(endTimeStr.substring(0,endTimeStr.indexOf(':')),10)*60 +parseInt(endTimeStr.substring(endTimeStr.indexOf(':')+1,endTimeStr.length),10)*1000;    
    loadCuePoints();
    
    $(this).siblings('.rEdit').show();
    $(this).hide();
    
  });
  
  $('.rDel').live('click', function(){
    var c = $(this).closest('.segment');
    var segIndex = $('#transcriptionPanel table tr').index(c);
    cuepointArray.splice(segIndex,1);
    loadCuePoints();
    $(this).closest('.segment').remove();
            
  });
  
  $('#newSpAdd').click(function(){

    var newSpkr = 's'+(spkr.length+1);
    var s = speakerExists(newSpkr);
    $('#speakerInfo > tbody:last').append('<tr><td>s'+(spkr.length+1)+'</td><td><p class="speaker" style="background-color:'+colorArray[s.rNo]+'"></p></td><td contenteditable="true"></td></tr>');
    $('#speakerInfo tr:last td[contenteditable="true"]').focus();
    
    var i = $('#speakerInfo tr:last').children('td:eq(0)').html().substring(1);
    var c = $('#speakerInfo tr:last').children('td:eq(1)').children('p').css('background-color');
    spkr.push({'key':i,'name':'s'+i,'color':c,'origname':$('#speakerInfo tr:last').children('td:eq(2)').html(),'colorIndex':s.rNo});
    spkr['s_s'+i] = spkr[spkr.length-1];//hash table entries are of the form s_s1.
    
    loadSpeakers();
    $('#speakerInfo tr:last td[contenteditable="true"]').addClass("spname");
  });
  
  
  
  $('.spname').live('click', function(){
    $(this).attr('contenteditable','true').focus();
  });
  
  $('.spname').live('focusout', function(){
    spkr['s_'+$(this).closest('tr').children('td:eq(0)').html()].origname = $(this).closest('tr').children('td:eq(2)').html();
    $(this).closest('tr').children('td:eq(2)').attr('contenteditable','false');
    loadSpeakers();
  });
 
  $('.spname').live({mouseenter:function(){ $(this).css('border','#d3d3d3 solid 0.15px');}, mouseleave:function(){$(this).css('border','none');}});
  
  
  
   $('.spnum').live('click', function(){
     $(this).attr('contenteditable','true').focus();
     $(this).addClass('nowEditing');
     if(spcur == null)
	 {
	     spcur = $(this).html();
	 }
   });
  
   
   $('.spnum').live({mouseenter:function(){ $(this).css('border','#d3d3d3 solid 0.15px');}, mouseleave:function(){$(this).css('border','none');}});
    
   $('.spnum').live('focusout', function(){
	 
	   	var regex = /^s[0-9]+$/; 
	   	var spnum = $(this).html();
	   	// Format validation passed. Next, check if that speaker already exists.
	   	if(regex.test(spnum))
	   	{
	   		var s = speakerExists(spnum);
	   		//Alert!Speaker exists. You must choose another value.
	   		if(s.found == true)
	   		{       			
				$('#spValidationMsg').removeClass().addClass('ui-state-error ui-corner-all');
				//$('#spValidationMsg p>span.ui-icon').removeClass().addClass('ui-icon-alert ui-icon');  		   		 
				$('#spValidationMsg p').html('<span class="ui-icon-alert ui-icon" style="float: left; margin-right: .3em;" /> This speaker already exists. Please change.');
				$('#spValidationMsg').show();
				$('#speakerInfo').find('.nowEditing').focus();
			   	}
			   	//Speaker doesn't exist. Successfully saved now. You are good to go.
			   	else
			   	{
			   		$('#spValidationMsg').removeClass().addClass('ui-state-highlight ui-corner-all');
			   		//$('#spValidationMsg p>span.ui-icon').removeClass().addClass('ui-icon-info ui-icon');  
			   		//addSpeaker(spnum.substring(1),spnum,s.rNo);
			   		//spkr['s_'+spcur].origname = $(this).closest('tr').children('td:eq(0)').html();
			   		spkr['s_'+spcur].name = $(this).closest('tr').children('td:eq(0)').html();
			   		spkr['s_'+spcur].origname = $(this).closest('tr').children('td:eq(2)').html();
			   		$(this).closest('tr').children('td:eq(0)').attr('contenteditable','false');		   		 
			   		$('#spValidationMsg p').html('<span class="ui-icon-info ui-icon" style="float: left; margin-right: .3em;" /> Your change has been saved.');	
					$('#spValidationMsg').show();		   			   		
			   		loadSpeakers();
			   	}
	   	}
	   	//Alert!Format violated. Correct it before you can proceed further.
	   	else
	   	{
			$('#spValidationMsg').removeClass().addClass('ui-state-error ui-corner-all');
			//$('#spValidationMsg p>span.ui-icon').removeClass().addClass('ui-icon-alert ui-icon');  		   		 
			$('#spValidationMsg p').html('<span class="ui-icon-alert ui-icon" style="float: left; margin-right: .3em;" /> Invalid speaker format.');
			$('#spValidationMsg').show();			
			$('#speakerInfo').find('.nowEditing').focus();
	   	}	
   
   });
  
   	
  
  function loadSpeakers()
  {
  	spcur = null;
    $.each($('#speakerInfo tbody').children('tr'),function(){
      $(this).remove();
    });
    $.each(spkr,function(i,s){
      $('#speakerInfo tbody').append('<tr><td class="spnum" contenteditable="false">'+s.name+'</td><td contenteditable="false"><p class="speaker" style="background-color:'+s.color+'"></p></td><td contenteditable="false" class="spname">'+s.origname+'</td></tr>');
    });
  }
  
  /*Function to convert the time returned from the video into a proper format. Video.currentTime returns the number of seconds */
  function formatTime(seconds) {
    minutes = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
   }
  
  function parseFormattedTime(str) {
        var mins = parseInt(str.substr(0,2),10);
        var secs = parseInt(str.substr(3,2),10);
        var totalSecs = mins*60 + secs;
        return totalSecs;
   }
  
  /**************************** Right content area accordion effect - etli *******************************/
 
//  ACCORDION BUTTON ACTION
  $('div.title').click(function() {
    $(this).next().slideToggle('normal');
        
    if($(this).children('.ui-icon').attr('class') == 'inact')
    {
      $(this).children('.ui-icon').addClass('act ui-icon-triangle-1-s').removeClass('inact ui-icon-triangle-1-e');
    }
    else
    {
      $(this).children('.ui-icon').addClass('inact ui-icon-triangle-1-e').removeClass('act ui-icon-triangle-1-s');
    }
  });
 
//  HIDE THE DIVS ON PAGE LOAD
  $('div.content').hide();
  $('div.content').eq(0).show();
  $('div.content').eq(1).show();
  

});
