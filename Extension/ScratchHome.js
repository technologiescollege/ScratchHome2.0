class ScratchHome {
    static message = "empty";
    static status = "empty";
    static x = 0;
    static y = 0;
    static agle = 0;
    static sprite = undefined;

    constructor(runtime) {
        this.runtime = runtime;
        this.socket = null;
        this.wsUrl = "ws://localhost:8000";
        ScratchHome.sprite = this.runtime.getSpriteTargetByName("Observer");
        if (ScratchHome.sprite){
            this.objectlist = ScratchHome.sprite.lookupVariableById("CNn7j*SP0QT%rN4=j[xz");
            this.lamplist = ScratchHome.sprite.lookupVariableById("GoN|030ruZ,{H+4$)C-$");
        }
    }

    getInfo() {
        return {
            "id": "scratchhome",
            "name": "ScratchHome",
            "blocks": this.getblocks(),
            "menus":this.getMenus()
        };
    }

    getBlocks(){
        var typeBlocks = "";
        var result =  [ {
          "opcode": "setColor",
          "blockType": "command",
          "text": "colorer [object] en [colorList] ",
          "arguments": {
              "object": {
                  "type": "string",
                  "defaultValue": ""
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
                  "defaultValue": ""
              },
          }
      }];
        if (ScratchHome.sprite){
          typeBlocks = ScratchHome.sprite.lookupVariableById("L^i{fNhE#uQ8.g=D;O~O");
          if (typeBlocks && typeBlocks.value.startsWith("m")){
            result = [];
            if (this.objectlist.value.length > 0){
            result.push({
              "opcode": "setColor",
              "blockType": "command",
              "text": "colorer [object] en [colorList] ",
              "arguments": {
                  "object": {
                      "type": "string",
                      "menu": "objectMenu"
                  },
                  "colorList": {
                      "type": "string",
                      "menu": "colorMenu"
                  }                                
              }
          });
            }
            if (this.lamplist.value.length > 0){  
          result.push({
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
                      "menu":  "lampMenu"
                  }
              }
          });
        } 
        }
      }  
      
          if (typeBlocks && typeBlocks.value.startsWith("b")){
            result = []; 
            for (let o of this.objectlist.value){
              result.push({
                "opcode": "setColor",
                "blockType": "command",
                "text": "colorer [object] en [colorList]",
                "arguments": {
                  "object": {
                  "type": "string",
                  "defaultValue": o
                  },
                    "colorList": {
                        "type": "string",
                        "menu": "colorMenu"
                    }                                
                }
              });
            }
            for (let l of this.lamplist.value){
              result.push({
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
                        "defaultValue": l
                    }
                }
            });
          }
        } 
      result.push(
        {
            "opcode": 'getMessage',
            "blockType": "reporter",
            "text": "message"
        });
      result.push(
        {
            "opcode": 'getStatus',
            "blockType": "reporter",
            "text": "status"
          });
        result.push(
            {
                "opcode": 'getX',
                "blockType": "reporter",
                "text": "x"
            });
          result.push(
            {
                "opcode": 'getY',
                "blockType": "reporter",
                "text": "y"
              });
          result.push(
                {
                    "opcode": 'getAngle',
                    "blockType": "reporter",
                    "text": "angle"
                  });
      
        return result;
      }
      getMenus(){
        var objectMenu = [];
        var lampMenu = [];
        var result =  {
          "colorMenu":{
              "items": ["noir", "bleu", "cyan", "gris", "vert", "magenta", "rouge", "blanc", "jaune"]
          },
          "switchMenu":{
              "items": ["Allumer", "Eteindre"]
          }
        };
        if (this.objectlist && this.objectlist.value.length > 0){ 
          result["objectMenu"] = {"items":this.objectlist.value}
        } 
        if (this.lamplist && this.lamplist.value.length > 0){
          result["lampMenu"] = {"items":this.lamplist.value}
        }
        return result;
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
            var msgrec = event.data
            if (msgrec.startsWith("position")){
                var pos = msgrec.split("/")
                ScratchHome.x = parseFloat(pos[1]);
                ScratchHome.y = parseFloat(pos[2]);
                ScratchHome.angle = parseFloat(pos[3]);
                if (ScratchHome.sprite){
                ScratchHome.sprite.setXY(ScratchHome.x,ScratchHome.y);
                ScratchHome.sprite.setDirection(ScratchHome.angle);
                } 
            } else{
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
        /**
         * Get the current message.
         * @return {string} - the current x.
         */
        getX () {
                return ScratchHome.x;
        }
  
        /**
         * Get the current status.
         * @return {string} - the current y.
         */
         getY () {
              return ScratchHome.y;
          }
          /**
           * Get the current status.
           * @return {string} - the current angle.
           */
           getAngle () {
                return ScratchHome.angle;
            }
}

(function() {
    var extensionClass = ScratchHome
    if (typeof window === "undefined" || !window.vm) {
        Scratch.extensions.register(new extensionClass())
    }
    else {
        var extensionInstance = new extensionClass(window.vm.extensionManager.runtime)
        var serviceName = window.vm.extensionManager._registerInternalExtension(extensionInstance)
        window.vm.extensionManager._loadedExtensions.set(extensionInstance.getInfo().id, serviceName)
    }
})()

