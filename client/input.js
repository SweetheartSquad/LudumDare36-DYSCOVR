// setup inputs
var keys={
	down:[],
	justDown:[],
	up:[],

	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,

	clear:function(){
		this.justDown=[];
		this.up=[];
	},


	on_down:function(event){
		if(this.down[event.keyCode]!==true){
			this.down[event.keyCode]=true;
			this.justDown[event.keyCode]=true;
		}
	},
	on_up:function(event){
		this.down[event.keyCode]=false;
		this.justDown[event.keyCode]=false;
		this.up[event.keyCode]=true;
	},

	isDown:function(_key){
		return this.down[_key]===true;
	},
	isJustDown:function(_key){
		return this.justDown[_key]===true;
	},
	isUp:function(_key){
		return this.up[_key]===true;
	}
};

var gamepads={
	available: function(){
		return "getGamepads" in navigator;
	},

	connected:false,
	deadZone:0.25,

	init:function(){
		if(this.available()){
			// listen to connection events for firefox
	        $(window).on("gamepadconnected", function() {
	        	this.connected=true;
	            console.log("gamepad connection event");
	        }.bind(this));

	        $(window).on("gamepaddisconnected", function() {
	        	this.connected=false;
	            console.log("gamepad disconnection event");
	        }.bind(this));

	        // poll for connections chrome
            var pollForPad = window.setInterval(function() {
                if(navigator.getGamepads()[0]) {
                    if(!this.connected){
                    	$(window).trigger("gamepadconnected");
                    }
                    window.clearInterval(pollForPad);
                }
            }.bind(this), 1000);
		}
	},

	update:function(){

	},

	getStick: function(){
		var gamepad=navigator.getGamepads()[0];
		var stick=gamepad.axes.slice();
		if(Math.abs(stick[0]) < this.deadZone){
			stick[0]=0;
		}if(Math.abs(stick[1]) < this.deadZone){
			stick[1]=0;
		}
		return stick;
	},

	getDpad: function(){
		var gamepad=navigator.getGamepads()[0];
		var dpad=[0,0];
		if(gamepad.buttons[15].pressed){
			dpad[0]+=1;
		}if(gamepad.buttons[14].pressed){
			dpad[0]-=1;
		}
		if(gamepad.buttons[13].pressed){
			dpad[1]+=1;
		}if(gamepad.buttons[12].pressed){
			dpad[1]-=1;
		}
		return dpad;
	}
};