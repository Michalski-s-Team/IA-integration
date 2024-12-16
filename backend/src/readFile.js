import ChatController from "./services/ChatController.js";

const chat = ChatController.readDbChat("./db/chat.json");
console.log(chat);
