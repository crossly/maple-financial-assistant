const { Wechaty, Message } = require('wechaty') // import { Wechaty } from 'wechaty'
const { PuppetPadplus } = require('wechaty-puppet-padplus')
const token = 'token here'
const puppet = new PuppetPadplus({
  token,
})
const name  = 'stock-helper'
const bot = new Wechaty({
  puppet,
  name, // generate xxxx.memory-card.json and save login data for the next login
})

bot
    .on('scan', './listeners/on-scan')
    .on('message', './listeners/on-message')
    .on('onLogin', './listeners/on-login')
    .on('friendship', './listeners/on-friendship')
    .on('room-join', './listeners/on-room-join')
    .on('room-topic', './listeners/on-room-topic')
    .on('room-invite', './listeners/on-room-invite')
    .on('room-leave', './listeners/on-room-leave')
    .on('ready', './listeners/on-ready')
    .start()
