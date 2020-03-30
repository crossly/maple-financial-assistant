async function onFriendship(friendship){
    const contact = await friendship.contact()
    try {
        console.log(`received friend event.`)
        switch (friendship.type()) {
            // 1. New Friend Request
            case this.Friendship.Type.Receive:
                await friendship.accept()
                await contact.sync()
                contact.say(require('../config').Message.Welcome)
                break
            // 2. Friend Ship Confirmed
            case this.Friendship.Type.Confirm:
                console.log(`friend ship confirmed`)
                break
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports = onFriendship