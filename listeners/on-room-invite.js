async function onRoomInvite(roomInvitation){
    try {
        console.log(`received room-invite event.`)
        await roomInvitation.accept()
    } catch (e) {
        console.error(e)
    }
}
module.exports = onRoomInvite