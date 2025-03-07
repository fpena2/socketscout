import asyncio
import websockets
import functools

clients = {}


async def echo(websocket, client_id):
    async for message in websocket:
        print(f"Received from {client_id}: {message}")
        await websocket.send(f"Echo from {client_id}: {message}")


async def send_periodic_messages(websocket, client_id):
    try:
        counter = 0
        while True:
            await asyncio.sleep(5)
            message = f"Message {counter} from server to {client_id}"
            await websocket.send(message)
            print(f"Sent to {client_id}: {message}")
            counter += 1
    except websockets.ConnectionClosed:
        print(f"Connection with {client_id} closed")


async def handler(websocket):
    client_id = id(websocket)
    clients[websocket] = client_id
    print(f"Client {client_id} connected")

    send_task = asyncio.create_task(send_periodic_messages(websocket, client_id))

    try:
        await echo(websocket, client_id)
    finally:
        send_task.cancel()
        try:
            await send_task
        except asyncio.CancelledError:
            pass
        del clients[websocket]
        print(f"Client {client_id} disconnected")


async def main():
    server = await websockets.serve(handler, "localhost", 8080)
    print("Server started on port 8080")
    await server.wait_closed()


asyncio.run(main())
