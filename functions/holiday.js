/*
判断是否为节假日
 */
const holiday_list = require("../db/holiday")
async function isHoliday(date){
    try {
        const res = holiday_list.indexOf(date)
        console.log(res)
        if (!res){
            return await false
        }
        return await true
    }catch (e) {
        console.log(e)
    }

}
module.exports = isHoliday