const Discord = require("discord.js");
import { Channel, Client, MessageEmbed, TextChannel } from "discord.js";
import { v4 as uuidv4 } from "uuid";
// var prettifyHtml = require("prettify-html");
var fs = require("fs");

export class DiscordBot {
  client: Client;

  constructor() {
    this.client = new Discord.Client();
  }

  async logIn() {
    await this.client.login(process.env.DISCORD_BOT_TOKEN);
    this.client.once("ready", () => {
      console.log("Discord Bot ready!");
    });
  }

  sendMessageToChannel(channelId: string, message: string) {
    const channel: Channel = this.client.channels.cache.get(channelId);
    (channel as TextChannel).send(message);
  }

  sendEmbeddedWithImageAndText(
    channelId: string,
    message: string,
    html: string,
    image: string | Buffer | (string | Buffer)[]
  ) {
    let uuid: string = uuidv4();
    const exampleEmbed: MessageEmbed = new Discord.MessageEmbed()
      .attachFiles([
        { name: uuid + ".png", attachment: image },
        {
          name: uuid + ".txt",
          attachment: Buffer.from(html),
        },
      ])
      .setImage(`attachment://${uuid}.png`)
      .setTitle(message)
      .setTimestamp();

    const channel: Channel = this.client.channels.cache.get(channelId);
    (channel as TextChannel).send(exampleEmbed);
  }
}
