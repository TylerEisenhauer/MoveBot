import {Message} from 'discord.js'
import {move} from '../commands/move'
import {lookup} from '../commands/lookup'
import {gamapost} from '../commands/gamapost'
import {clear} from '../commands/clear'
import {pwnpost} from '../commands/pwnpost'
import {startraffle} from '../commands/startraffle'
import {enter} from '../commands/enter'
import {pickwinner} from '../commands/pickwinner'
import {endraffle} from '../commands/endraffle'
import {sales} from '../commands/sales'
import {userinfo} from "../commands/userinfo";

export async function commandHandler(command: string, args: string[], message: Message) {
    switch (command) {
        case 'move':
            return await move(args, message)
        case 'lookup':
            return await lookup(args, message)
        case 'clear':
            return await clear(args, message)
        case 'startraffle':
            return await startraffle(args, message)
        case 'enter':
            return await enter(args, message)
        case 'pickwinner':
            return await pickwinner(args, message)
        case 'endraffle':
            return await endraffle(args, message)
        case 'gamapost':
            return await gamapost(message)
        case 'pwnpost':
            return await pwnpost(message)
        case 'sales':
            return await sales(args, message)
        case 'userinfo':
            return await userinfo(args, message)
        default:
            return
    }
}