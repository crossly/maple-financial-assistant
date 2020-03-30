async function onMessage(msg){
    const { FileBox } = require('file-box')
    const stockDebt = require('../functions/stocks-debt')
    const config = require('../config')
    const isHoliday = require("../functions/holiday")
    const moment = require('moment');
    console.log(`msg : ${msg}`)
    const contact = msg.from()
    const text = msg.text()
    const room = msg.room()
    const msgDate = msg.date()
    console.debug("Sender: " + contact + " Text: " + text + " Date: " + msgDate)
    if (!contact) {
        return
    }
    if (msg.self()) {
        return // skip self
    }
    if (room){
        if (await msg.mentionSelf()) {
            console.info('this message were mentioned me! [You were mentioned] tip ([有人@我]的提示)')
            const topic = await room.topic()
            console.info(`Room: ${topic} Contact: ${contact.name()} Text: ${text}`)
            switch (text.split(/\s+/)[1]) {
                case '可转债':
                case '打新':
                    console.debug("Request from : " + contact.name() + "; Check Mod Permission result："+config.Mod.indexOf(contact.name())+"； Check Admin Permission result: "+ config.Admin.indexOf(contact.name()))
                    if (config.Mod.indexOf(contact.name()) || config.Admin.indexOf(contact.name())){
                        // console.debug(await stockDebt.debts())
                        /*
                            await room.say("今日休息，不开盘。")
                            return
                        }*/
                        await room.say(await stockDebt.debts())
                    }
                    break
                case '开户':
                    await room.say("请长按识别以下二维码开户", contact)
                    const fileBox = FileBox.fromUrl('http://falcon.applinzi.com/my/kh_qrcode.png')
                    await room.say(fileBox)
                    break
                default:
                    break
            }
        }
    } else {
        switch (text) {
            case '可转债':
            case '打新':
                // console.debug(await stockDebt.debts())
                /*if (isHoliday(moment().format("YYYY-MM-DD"))){
                    await contact.say("今日休息，不开盘。")
                    return
                }*/
                contact.say(await stockDebt.debts())
                break
            case '开户':
                await contact.say("请长按识别以下二维码开户")
                const fileBox = FileBox.fromUrl('http://falcon.applinzi.com/my/kh_qrcode.png')
                await contact.say(fileBox)
                break
            case '可转债群':
                const room = await this.Room.find({topic: config.DebtGroups[0]})        // change 'wechat' to any room topic in your wechat
                if (room) {
                    try {
                        if (require('../functions/db-operation').getGroupMember(config.DebtGroups[0])){//判断群成员是否上限500
                            await room.add(contact)
                            contact.say("已将您添加到群<"+config.DebtGroups[0]+">中。");
                        }else{
                            contact.say("群成员已满，暂时不可加入，您可稍后再试。")
                        }
                        // console.debug(re)
                    } catch(e) {
                        console.error(e)
                    }
                }
                break
            default:
                await contact.say("您好，我尚在学习中，可做的事情有限。")
                await contact.say("那么，还是请跟随我来吧。")
                let returnString = "- 发送[可转债]了解转债信息。\n" +
                    "- 发送[可转债群]加入转债交流群\n" +
                    "- 发送[开户]一键开户，高效。\n" +
                    "- 发送[大宗交易]勾兑业务。\n"
                await contact.say(returnString)
        }
    }
}
module.exports = onMessage