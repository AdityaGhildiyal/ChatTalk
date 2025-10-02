import {Conversation, User , Message} from "@/app/generated/prisma";

export type FullMessageType = Message & {
    sender: User;
    seen: User[];
}

export type FullConversationType = Conversation & {
    users: User[];
    messages: FullMessageType[];
}
