import asyncio
import websockets
import jpysocket
import socket
import unidecode 
import threading

# This program allow to launch WebSocket Server receiving Connections from Scratch Extension (ScratchHome), 
# and connect to Server Socket created by the Sweethome3D plugin,
# and also it creates its own Server Socket to receive connections from the same plugin


# Create an async function that launch Server Socket on port 2022 to receive messages from SweetHome3D
# it takes in parameter the WebSocket got from the connection of Scratch Extension to this WebSocket Server
async def serve(socketScratch):	
    HOST = "localhost"  # Standard loopback interface address (localhost)
    PORT = 2022  # Port to listen on (non-privileged ports are > 1023)

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((HOST, PORT))
        s.listen()
        while True:
            conn, addr = s.accept()
            with conn:
                while True:
                    data = conn.recv(1024)
                    if not data:
                        break
                    msgrecv=jpysocket.jpydecode(data) #Decript msg

                    # send data to Scratch
                    await socketScratch.send(msgrecv)

# define a function that run the async function serve with a new event loop
def between_callback(args):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    loop.run_until_complete(serve(args))
    loop.close()
        
# create handler for each WebSocket connection
async def handler(websocket, path):

    # Launch the thread of this Server Socket
    t1 = threading.Thread(target=between_callback,args=(websocket,))
    t1.start()

    while True:
        # receive data from Scratch
	    data = await websocket.recv()

        # Create connection with SH3D plugin's Server Socket on port 2016
	    host='localhost' #Host Name
	    port=2016    #Port Number
	    s=socket.socket() #Create Socket
	    s.connect((host,port)) #Connect to socket
	    msgenv = f"GET /{data} HTTP/1"
	    msgenvsansaccent = unidecode.unidecode(msgenv) 
	    msgsend=jpysocket.jpyencode(msgenvsansaccent) #Encript The Msg

        #Send Msg to SweetHome3D
	    s.send(msgsend)

        #Recieve msg from SH3D
	    msgrecv=s.recv(1024) 
	    msgrecv=jpysocket.jpydecode(msgrecv) #Decript msg

		# Respond to Scratch
	    await websocket.send(msgrecv)
 
# Launch the WebSocket Server on port 8000
start_server = websockets.serve(handler, "localhost", 8000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()