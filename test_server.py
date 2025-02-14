import asyncio
import websockets

async def echo(websocket):
    async for message in websocket:
        print(f"Received message: {message}")
        await websocket.send(message)

async def send_periodic_messages(websocket):
    try:
        while True:
            await asyncio.sleep(2)  
            message = "Hello from server!"
            await websocket.send(message)
            print(f"Sent message: {message}")
    except websockets.ConnectionClosed:
        print("Connection closed")

async def handler(websocket):
    send_task = asyncio.create_task(send_periodic_messages(websocket))

    await echo(websocket)

    send_task.cancel()
    try:
        await send_task
    except asyncio.CancelledError:
        pass

async def main():
    async with websockets.serve(handler, "localhost", 8080):
        print("Server started on port 8080")
        await asyncio.Future() 

asyncio.run(main())
