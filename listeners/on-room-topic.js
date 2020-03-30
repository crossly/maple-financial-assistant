async function onRoomTopic(room, topic, oldTopic, changer){
    try {
        console.log(`Room ${await room.topic()} topic changed from ${oldTopic} to ${topic} by ${changer.name()}`)
        const config = require('../config')
        console.log(config.Admin.indexOf(changer.name()))
        console.log(config.Mod.indexOf(changer.name()))
        if (config.Admin.indexOf(changer.name()) && config.Mod.indexOf(changer.name())){
            room.say("W:🈲️禁止修改群名，点名 "+changer.name()+" 批评")
            await room.topic(oldTopic)
        }
    }catch (e) {
        console.error(e)
    }
}
module.exports = onRoomTopic