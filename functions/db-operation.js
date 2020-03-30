module.exports = {
    syncGroupMembers: async function(topic, members) {
        try {
            const low = require('lowdb')
            const FileSync = require('lowdb/adapters/FileSync')
            const adapter = new FileSync('./db/db.json')
            const db = low(adapter)
            if (db.get('groups')
                .find({ name: topic })
                .value()){
                db.get('servers')
                    .find({ name: topic })
                    .assign({ members: members})
                    .write()
            }else{
                db.get('groups')
                    .push({ name: topic, members: members})
                    .write()
            }
            return await db.get('groups')
                .find({ name: topic })
                .value()
        }catch (e) {
            console.error(e)
        }
    },
    getGroupMember: async function(topic) {
        try {
            const low = require('lowdb')
            const FileSync = require('lowdb/adapters/FileSync')
            const adapter = new FileSync('./db/db.json')
            const db = low(adapter)
            const data =  db.get('groups')
                .find({ name: topic })
                .value()
            console.debug("Member list as follow : "+data+", Member numbers is : " + data.members.length)
            if (data.members.length <=500){
                return true
            }else{
                return false
            }
        }
        catch (e) {
            console.error(e)
        }
    }
}