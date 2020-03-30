'use strict'
const request = require('request-promise');
const moment = require('moment');


const options = {
    url: 'data_source_url',
    headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
    }
};


exports.debts = async function () {
    const result = await request(options)
        .then(async function (body) {
            const bodyParsed = await parseRawData(body)
            let returnString = ""
            let currentDate = moment().format("YYYY-MM-DD")
            returnString = "🍁可转债小助手给您带来的信息如下：\n\n"
            returnString +=  await parseArrayToString(bodyParsed['needApply'], currentDate, "申购清单如下：")
            returnString +=  await parseArrayToString(bodyParsed['needPay'], currentDate, "中签公布清单如下，请及时检查并缴款：")
            returnString +=  await parseArrayToString(bodyParsed['shouldSell'], currentDate, "可以卖掉这些债啦，请遵守交易原则进行卖出：")
            returnString +=  await parseArrayToString(bodyParsed['nextNeedApply'], '明', "申购清单如下：")
            return await returnString
        })
        .catch(async function (err) {
            console.error(err)
            return await err
        });
    return await result
}
/*
解析json内容，并返回整理后的数组
 */
async function parseRawData(body) {
    let currentDate = moment().format("YYYY-MM-DD")
    let tomorrowDate = moment().add(1,'days').format("YYYY-MM-DD")
    let stockDebtData = []
    stockDebtData['needApply'] = []
    stockDebtData['needPay'] = []
    stockDebtData['shouldSell'] = []
    stockDebtData['nextNeedApply'] = []
    const data = JSON.parse(body);
    for (var index in data.list){
        // console.debug(data.list[index].bond_name)
        if (currentDate == data.list[index].sub_date){//今日需要申购
            stockDebtData['needApply'].push(data.list[index])
        }
        if (currentDate == data.list[index].sign_date){//中签日
            stockDebtData['needPay'].push(data.list[index])
        }
        if (currentDate == data.list[index].listing_date){//上市日
            stockDebtData['shouldSell'].push(data.list[index])
        }
        if (tomorrowDate == data.list[index].sub_date){//明日上市
            stockDebtData['nextNeedApply'].push(data.list[index])
        }
    }
    return await stockDebtData;
}
/*
* 检查股票代码是否为两个特殊类型
* */
async function checkStockCode(stockCode) {
    if (stockCode.startsWith('300')) {
        return await "创业板"
    }
    else if(stockCode.startsWith('688')){
        return await "科创板"
    }else{
        return await 0
    }
}
/*
将数组子循环并拼装成带格式的字符串
 */
async function parseArrayToString(subArray, date, title) {
    if (subArray.length != 0){
        let s = date + "日" + title + " \n\n"
        for (var index in subArray){
            let listing_data = subArray[index].listing_date == 0 ? '未定' : subArray[index].listing_date
            s += subArray[index].bond_name + "\t" + subArray[index].bond_code + "\n"
            s += "计划发行量：" + Math.round(subArray[index].plan_total  * 100) / 100+ "亿\n"
            s += "申购代码：" + subArray[index].sub_code + "\n"
            s += "配售代码：" + subArray[index].share_code + "\n"
            s += "股票名称：" + subArray[index].name + "\n"
            s += "股票代码：" + subArray[index].code + "\n"
            s += "中签公布日：" + subArray[index].sign_date + "\n"
            s += "转股价格：" + subArray[index].price + "\n"
            s += "上市日期：" + listing_data + "\n"
            if (await checkStockCode(subArray[index].code) != 0){
                s += "该股票为：【" + await checkStockCode(subArray[index].code) + "】，您可能会因证券账户权限问题无法申购。\n"
            }
            s += "\n"
            return await s
        }
    }else{
        let s = date + "日" + title + " \n\n"
        s += "无"
        s += "\n\n"
        return await s
    }
}