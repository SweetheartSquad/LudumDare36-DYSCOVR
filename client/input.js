// setup inputs
var keys={
	down:[],
	justDown:[],
	justUp:[],

	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,

	W: 87,
	A: 65,
	S: 83,
	D: 68,

	SPACE: 32,

	capture:[],

	init:function(){
		$(document).on("keyup",keys.on_up.bind(keys));
		$(document).on("keydown",keys.on_down.bind(keys));
	},

	clear:function(){
		this.justDown=[];
		this.justUp=[];
	},


	on_down:function(event){
		if(this.down[event.keyCode]!==true){
			this.down[event.keyCode]=true;
			this.justDown[event.keyCode]=true;
		}
		console.log(event.keyCode, this.capture, this.capture.indexOf(event.keyCode));
		if(this.capture.indexOf(event.keyCode) != -1){
			event.preventDefault();
			return false;
		}
	},
	on_up:function(event){
		this.down[event.keyCode]=false;
		this.justDown[event.keyCode]=false;
		this.justUp[event.keyCode]=true;
		if(this.capture.indexOf(event.keyCode) != -1){
			event.preventDefault();
			return false;
		}
	},

	isDown:function(_key){
		return this.down[_key]===true;
	},
	isUp:function(_key){
		return !this.isDown(_key);
	},
	isJustDown:function(_key){
		return this.justDown[_key]===true;
	},
	isJustUp:function(_key){
		return this.up[_key]===true;
	}
};

var gamepads={
	available: function(){
		return "getGamepads" in navigator;
	},

	gamepad:null,

	connected:false,
	deadZone:0.25,

	down:[],
	justDown:[],
	justUp:[],

	init:function(){
		if(this.available()){
			// listen to connection events for firefox
	        $(window).on("gamepadconnected", function() {
	        	this.connected=true;
	        	this.gamepad = navigator.getGamepads()[0];
	            console.log("gamepad connection event");
	        }.bind(this));

	        $(window).on("gamepaddisconnected", function() {
	        	this.connected=false;
	        	this.gamepad=null;
	            console.log("gamepad disconnection event");
	        }.bind(this));

	        // poll for connections chrome
            var pollForPad = window.setInterval(function() {
                this.gamepad=navigator.getGamepads()[0];
                if(this.gamepad) {
                    if(!this.connected){
                    	$(window).trigger("gamepadconnected");
                    }
                    window.clearInterval(pollForPad);
                }
            }.bind(this), 1000);
		}
	},

	update:function(){
		if(this.gamepad!=null){
			for(var i=0; i < this.gamepad.buttons.length; ++i){
				if(this.gamepad.buttons[i].pressed){
					this.justDown[i]=!(this.down[i]===true);
					this.down[i]=true;
					this.justUp[i]=false;
				}else{
					this.justUp[i]=this.down[i]===true;
					this.down[i]=false;
					this.justDown[i]=false;
				}
			}
		}
	},

	getStick: function(){
		var stick=this.gamepad.axes.slice();

		for(var i=0;i<stick.length;++i){
			if(Math.abs(stick[i]) < this.deadZone){
				stick[i]=0;
			}
		}
		return stick;
	},

	getDpad: function(){
		var dpad=[0,0];
		if(this.gamepad.buttons[15].pressed){
			dpad[0]+=1;
		}if(this.gamepad.buttons[14].pressed){
			dpad[0]-=1;
		}
		if(this.gamepad.buttons[13].pressed){
			dpad[1]+=1;
		}if(this.gamepad.buttons[12].pressed){
			dpad[1]-=1;
		}
		return dpad;
	},

	isDown:function(_btn){
		return this.down[_btn]===true;
	},
	isUp:function(_btn){
		return !this.isDown(_btn);
	},
	isJustDown:function(_btn){
		return this.justDown[_btn]===true;
	},
	isJustUp:function(_btn){
		return this.justUp[_btn]===true;
	}
};