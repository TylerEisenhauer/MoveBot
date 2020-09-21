import {Client, Message, MessageReaction, Permissions, User, WebhookClient} from 'discord.js'
import {commandHandler} from './handlers/command'
import {config} from 'dotenv-flow'
import {parseArgs} from './helpers/parsing'
import {initializeAPIClients} from './config/config'
import {novelkeysCheck} from "./page-watchers/novelkeys";
import {nvidiaCheck} from "./page-watchers/nvidia";

config()
const shrugWebhookClient = new WebhookClient(process.env.SHRUG_WEBHOOK_ID, process.env.SHRUG_WEBHOOK_TOKEN)
const client = new Client()
const prefix = '!'
let cache: string[] = []

novelkeysCheck(shrugWebhookClient)
nvidiaCheck(shrugWebhookClient)

client.on('ready', async () => {
    await initializeAPIClients()
    await client.user.setPresence({
        status: 'online',
        activity: {
            name: 'Kicking Doors and Slapping Whores',
            type: 'PLAYING'
        }
    })
    console.log('Bot Online')
})

client.on('message', async (message: Message) => {
    if (message.author.bot) return
    if (!message.guild) return
    let performGamaAlert: boolean = process.env.PERFORM_GAMA_ALERT === 'true'

    if (performGamaAlert && message.author.id === process.env.GAMA_ID && message.channel.id === process.env.ALERT_CHANNEL_ID) {
        await commandHandler('gamapost', null, message)
    }
    if (performGamaAlert && message.author.id === process.env.PWN_ID && message.channel.id === process.env.ALERT_CHANNEL_ID) {
        await commandHandler('pwnpost', null, message)
    }

    if (!message.content.startsWith(prefix)) return

    const args: string[] = parseArgs(prefix, message.content)
    const command: string = args.shift().toLowerCase()

    if (command.startsWith(prefix)) return

    return await commandHandler(command, args, message)
})

client.on('messageReactionAdd', async (reaction: MessageReaction, user: User) => {
    if (reaction.emoji.id !== process.env.WTF_ID || cache.includes(reaction.message.id)) return

    if (reaction.partial) {
        try {
            await reaction.fetch()
        } catch (e) {
            console.error('Error fetching reaction')
            return
        }
    }

    const originalNickname: string = reaction.message.member.nickname || reaction.message.member.user.username

    if (reaction.count === 5) {
        cache.push(reaction.message.id)
        try {
            if (reaction.message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR)) {
                return await reaction.message.channel.send(`${originalNickname} has been voted an idiot, unfortunately I can't change their name`)
            }

            await reaction.message.member.setNickname('KPS Student')
            await reaction.message.channel.send(`${originalNickname} has been voted an idiot, their name has been changed as such`)
        } catch (e) {
            console.error(e)
        } finally {
            setTimeout(async () => {
                await reaction.message.member.setNickname(originalNickname)
            }, 60 * 5 * 1000) //5 Minutes
        }
    }
})

client.login(process.env.DISCORD_TOKEN).then(() => {
    console.log('Login Success')
}).catch((e) => {
    console.log(e)
})

