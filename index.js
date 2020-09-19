const express = require('express');
const app = express()
const cors = require('./cors');
const { Telegraf, Telegram } = require('telegraf');
const mongoose = require('mongoose');
const { Order } = require("./order");

app.use(cors);
app.use(express.json({limit: "50mb"}));
app.use(express.raw())
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost/agent', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

const bot = new Telegraf("1049497121:AAH2KQyeNSMw0dtSXWS1yiEfinJboA6WMpU")

bot.use(async (ctx, next) => {
    let orders = await Order.find();
    const message = orders.map(o=>`Имя: ${o.name}, Сообщение: ${o.message}, Почта: ${o.email}, Дата: ${o.date.toLocaleDateString()}`)
    console.log(ctx.update.message.from);
    return ctx.reply(message.join('\n'))
})

app.post('/api/create', async (req, res) => {
    req.body.date = new Date();
    const order = new Order(req.body);
    await order.save();

    try {
        const telegram = new Telegram('1049497121:AAH2KQyeNSMw0dtSXWS1yiEfinJboA6WMpU');
        await telegram.sendMessage(993849117, `Коля, новая заявка тебе пришла!!! \nОт:${order.name},\nЕго почта: ${order.email}.\nСообщение: ${order.message}`)
    }catch (e) {
        console.log(e);
    }

    return res.status(200).send(`<script>alert('Ваша заявка успешно отправлена, ожилайте ответа!')</script>`);
})

app.get('/api/get', async (req, res) => {
    const orders = await Order.find();
    const ord = orders.map((o)=> `<div>Имя: ${o.name}, Сообщение:${o.message}, Почта:${o.email} Дата: ${o.date.toLocaleDateString()}</div>`)
    return res.status(200).send(ord.join('\n'));
})

bot.launch().then(()=>console.log('bot started'))
app.listen(3000, ()=>console.log('server started'));
