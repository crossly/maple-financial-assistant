async function onRoomLeave(room, leaverList, remover){
    try {
        const nameList = leaverList.map(c => c.name()).join(',')
        const topic = await room.topic()
        const memberList = await room.memberAll()
        console.log(`Room ${await room.topic()} lost member ${nameList}, the remover is: ${remover}`)
        await require('../functions/db-operation').syncGroupMembers(topic, memberList)
    } catch (e) {
        console.error(e)
    }
}
module.exports = onRoomLeave