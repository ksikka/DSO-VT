/**
* Example external configuration file.
* You can freely categorize these nodes
*/


/* Adi : Use this block of code in HTML to initialize config */

/* $f("player", "http://releases.flowplayer.org/swf/flowplayer-3.2.7.swf",  {
		
	// default configuration for a clip
	clip: conf.defaults,
	
	// setup controlbar to use our "gray" skin
	plugins: {		
		controls: conf.skins.gray		
	}
	
}); */

/* End of code block */



var conf = {
// default clip configuration
defaults: {
autoPlay: false,
autoBuffering: true,
baseUrl: 'http://blip.tv/file/get',
// functions are also supported
onBeforeBegin: function() {
// make controlbar visible, fade lasts 4 seconds
//this.getControls().fadeIn(4000);
}
},
// my skins
skins: {
gray: {
backgroundColor: '#666666',
buttonColor: '#333333',
opacity: 0,
time: false,
autoHide: false
}
// setup additional skins here ...
}
}