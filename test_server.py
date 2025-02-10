import asyncio
import websockets


async def echo(websocket):
    async for message in websocket:
        print(f"Received message: {message}")
        await websocket.send(message)


async def main():
    async with websockets.serve(echo, "localhost", 8080):
        print("Server started on port 8080")
        await asyncio.Future()  # run forever


asyncio.run(main())
