class ScratchHome {
    static message = "empty";
    static status = "empty";
    constructor() {
        this.socket = null;
        this.wsUrl = "ws://localhost:8000";
    }
    
    getblocks(){
        return [ 
            {
                "opcode": "setColor",
                "blockType": "command",
                "text": "colorer [object] en [colorList] ",
                "arguments": {
                    "object": {
                        "type": "string",
                        "defaultValue": "Lit bébé(827158385)"
                    },
                    "colorList": {
                        "type": "string",
                        "menu": "colorMenu"
                    }                                
                }
            },
            {
                "opcode": "switchOnOff",
                "blockType": "command",
                "text": "[switchList] le/la [lamp]",
                "arguments": {
                    "switchList": {
                        "type": "string",
                        "menu": "switchMenu"
                    },
                    "lamp": {
                        "type": "string",
                        "defaultValue":  "Suspension(296454286)"
                    },
                }
            },
            {
                "opcode": 'getMessage',
                "blockType": "reporter",
                "text": "message"
            },
            {
                "opcode": 'getStatus',
                "blockType": "reporter",
                "text": "status"
            }
        ];
    }
    
    getInfo() {
        return {
            "id": "scratchhome",
            "name": "ScratchHome",
            "blocks": this.getblocks(),
            "menus":{
                "colorMenu":{
                    "items": ["noir", "bleu", "cyan", "gris", "vert", "magenta", "rouge", "blanc", "jaune"]
                },
                "switchMenu":{
                    "items": ["Allumer", "Eteindre"]
                }
            }
        };
    }
    connect() {
        // open the connection if one does not exist
        if (this.socket !== null
          && this.socket.readyState !== WebSocket.CLOSED) {
          return;
        }
  
        //console.log("Trying to establish a WebSocket connection to <code>" + wsUrl + "</code>");
  
        // Create a websocket
        this.socket = new WebSocket(this.wsUrl);
  
        this.socket.onopen = function(event) {
          ScratchHome.status = "Connected!";
        };
  
        this.socket.onmessage = function(event) {
            if (event.data){
                ScratchHome.message = event.data;
            } 
        };
  
        this.socket.onclose = function(event) {
          ScratchHome.status = "Connection Closed";
        };
      }
  
      send(text) {
          this.socket.send(text);
      }
  
      closeSocket() {
          this.socket.close();
      }
  
      setColor({object,colorList}) {
          this.connect();
          this.send("setColor/"+object+"/"+colorList);
      }
      
      switchOnOff({switchList,lamp}) {
          this.connect();
          this.send("switchOnOff/"+switchList+"/"+lamp);
          
      }
      /**
       * Get the current message.
       * @return {string} - the current message.
       */
      getMessage () {
              this.connect();
              return ScratchHome.message;
      }

      /**
       * Get the current status.
       * @return {string} - the current status.
       */
       getStatus () {
		this.connect();
		return ScratchHome.status;
}
}

Scratch.extensions.register(new ScratchHome())

