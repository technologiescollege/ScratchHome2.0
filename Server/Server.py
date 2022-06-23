import asyncio
import websockets
import jpysocket
import socket
import unidecode 
 
# create handler for each connection
 
async def handler(websocket, path):
    while True:
	    data = await websocket.recv()
	    print(data)
	    host='localhost' #Host Name
	    port=2022    #Port Number
	    s=socket.socket() #Create Socket
	    s.connect((host,port)) #Connect to socket
	    msgenv = f"GET /{data} HTTP/1"
	    msgenvsansaccent = unidecode.unidecode(msgenv) 
	    msgsend=jpysocket.jpyencode(msgenvsansaccent) #Encript The Msg
	    s.send(msgsend) #Send Msg
	    msgrecv=s.recv(1024) #Recieve msg
	    msgrecv=jpysocket.jpydecode(msgrecv) #Decript msg
		
	    reply = msgrecv
		
	    await websocket.send(reply)
 
 
 
start_server = websockets.serve(handler, "localhost", 8000)
 
asyncio.get_event_loop().run_until_complete(start_server)
 
asyncio.get_event_loop().run_forever()



