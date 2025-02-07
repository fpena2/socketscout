use kameo::actor::ActorRef;
use kameo::message::{Context, Message};
use kameo::Actor;

use super::state::{AppState, MMessage, StoreMessage};

// Implement the actor
#[derive(Actor)]
pub struct Reader {
    pub receiver: ActorRef<AppState>,
}

// Define message
pub struct Tell {
    pub address: String,
    pub message: MMessage,
}

// Implement message handler
impl Message<Tell> for Reader {
    type Reply = ();

    async fn handle(&mut self, msg: Tell, _ctx: Context<'_, Self, Self::Reply>) -> Self::Reply {
        //
        self.receiver
            .tell(StoreMessage {
                address: msg.address,
                message: msg.message,
            })
            .await
            .unwrap();
    }
}
