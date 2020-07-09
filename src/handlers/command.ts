import {Message} from 'discord.js'
import {move} from '../commands/move'
import {lookup} from "../commands/lookup"
import {gamapost} from "../commands/gamapost"
import {clear} from "../commands/clear"
import {pwnpost} from "../commands/pwnpost"

export async function commandHandler(command: string, args: string[], message: Message) {
    switch (command) {
        case 'move':
            return await move(args, message)
        case 'lookup':
            return await lookup(args, message)
        case 'clear':
            return await clear(args, message)
        case 'gamapost':
            return await gamapost(message)
        case 'pwnpost':
            return await pwnpost(message)
        default:
            return await message.channel.send('I have no idea what the FUCK you\'re talking about')
    }
}