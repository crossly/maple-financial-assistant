async function onRoomJoin(room, inviteeList, inviter){
    try {
        const nameList = inviteeList.map(c => c.name()).join(',')
        const topic = await room.topic()
        const memberList = await room.memberAll()
        console.log(`Room ${topic} got new member ${nameList}, invited by ${inviter}`)
        // room.say("T:欢迎小伙伴 "+nameList+ " 加入我们！")
        await require('../functions/db-operation').syncGroupMembers(topic, memberList)
    } catch (e) {
        console.error(e)
    }
}


module.exports = onRoomJoin