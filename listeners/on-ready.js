/*
BOT启动时，加载定时任务。每天早上主动往管理的群推送打新内容。
 */
async function onReady(){
    try {
        const CronJob = require('cron').CronJob;
        const isHoliday = require("../functions/holiday")
        const moment = require('moment');
        const bot = this
        const job = new CronJob('15 9 * * *', async function() {
        // const job = new CronJob('*/1 * * * *', async function() {
          //  if (isHoliday(moment().format("YYYY-MM-DD"))){
            //    return
           // }
            const config = require('../config')
            console.log(new Date().toLocaleDateString()+'Tick Tick Tick');
            for (x in config.PushGroups){
                const room = await bot.Room.find({topic: config.PushGroups[x]})
                console.log("room name is " + config.DebtGroups[x] + ", raw data is " + room)
                await room.say(await require('../functions/stocks-debt').debts()) //推送打新资讯
                await room.say(config.Message.Tick)//推送打新提醒
            }
        }, null, true, 'Asia/Shanghai');
        await job.start();
    }catch (e) {
        console.log(e)
    }

}
module.exports = onReady