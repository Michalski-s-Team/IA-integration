import fs, { copyFileSync, readFile } from "fs";

class ChatController {
  static createId(arr) {
    if (arr.length === 0) return 1;
    return Math.max(...arr.map((obj) => obj.id)) + 1;
  }
  static async readDbChat(chatPath) {
    try {
      const data = await fs.promises.readFile(chatPath, "utf-8", 2);
      const chat = JSON.parse(data);
      return chat;
    } catch (error) {
      console.error(`Erro ao ler o arquivo: ${error}`);
    }
  }
  static async createChat({ ...chat }) {
    try {
      const jsonData = await this.readDbChat("./db/chat.json");
      const newChat = {
        id: this.createId(jsonData),
        ...chat,
        messages: [],
      };

      if (jsonData.some((chat) => chat.name === newChat.name)) {
        console.error(`Nome de chat já existente: ${JSON.stringify(newChat.name)}`);
        return null;
      } else if (jsonData.some((chat) => chat.id === newChat.id)) {
        console.error(`ID já existente.`);
        return null;
      }

      jsonData.push(newChat);
      fs.promises.writeFile("./db/chat.json", JSON.stringify(jsonData, null, 2), "utf8");

      console.log(`Chat adicionado com sucesso ${JSON.stringify(newChat)}`);
    } catch (error) {
      console.error("Erro ao analisar JSON:", error);
    }
  }

  static async updateChat(id, { ...newChat }) {
    const jsonData = await this.readDbChat("./db/chat.json");
    const indexChangedChat = jsonData.findIndex((chat) => chat.id == id);

    jsonData[indexChangedChat] = {
      id: id,
      ...newChat,
      messages: [],
    };
    console.log(jsonData[indexChangedChat]);

    fs.promises.writeFile("./db/chat.json", JSON.stringify(jsonData, null, 2), "utf8");
    console.log(`Chat de id ${id} alterado com sucesso`);
  }

  static async deleteChat({ id, name, all = false }) {
    try {
      let jsonData = await this.readDbChat("./db/chat.json");
      const indexChat = jsonData.findIndex(
        (chat) => chat.id === id || chat.name === name,
      );

      if (indexChat === -1 && all === false) {
        console.log("Chat não encontrado.");
        return null;
      }

      const deletedChat = all === false ? jsonData.splice(indexChat, 1) : (jsonData = []);

      await fs.promises.writeFile(
        "./db/chat.json",
        JSON.stringify(jsonData, null, 2),
        "utf8",
      );

      console.log(`Chat deletado com sucesso: ${JSON.stringify(deletedChat)}`);
    } catch (error) {
      console.error("Erro ao excluir o chat:", error);
    }
  }
}

export default ChatController;
