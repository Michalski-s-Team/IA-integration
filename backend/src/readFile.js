import ChatController from "./services/ChatController.js";

const chat = await ChatController.readDbChat("./db/chat.json");
console.log(chat);
