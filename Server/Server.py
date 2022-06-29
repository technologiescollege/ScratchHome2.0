import asyncio
import websockets
import jpysocket
import socket
import unidecode 
import threading
 

async def servir(socketScratch):	
    HOST = "127.0.0.1"  # Standard loopback interface address (localhost)
    PORT = 2022  # Port to listen on (non-privileged ports are > 1023)

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((HOST, PORT))
        s.listen()
        while True:
            print('before accept')
            conn, addr = s.accept()
            with conn:
                print(f"Connected by {addr}")
                while True:
                    data = conn.recv(1024)
                    if not data:
                        break
                    msgrecv=jpysocket.jpydecode(data) #Decript msg
                    await socketScratch.send(msgrecv)
                    
def between_callback(args):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    loop.run_until_complete(servir(args))
    loop.close()
        
# create handler for each connection

async def handler(websocket, path):
    t1 = threading.Thread(target=between_callback,args=(websocket,))

	    # démarrer le thread t1
    t1.start()
    while True:
	    
	    data = await websocket.recv()
	    print(data)
	    host='localhost' #Host Name
	    port=2016    #Port Number
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

