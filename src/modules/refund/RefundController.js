const Refund = require('./RefundModel');
const mqConfig = require('../../configs/amqp')
const kafkaConfig = require('../../configs/kafka')
const amqp = require('amqplib')

const kafka = require("kafka-node");

exports.create = function (req, res, next) {
	let param = req.body;
    amqp.connect(mqConfig.connectionString)
    .then(conn => {
        return conn.createChannel().then(ch => {
        const msg = JSON.stringify(param)

        const ok = ch.assertQueue(mqConfig.queueName, { durable: false })
        return ok.then(() => {
            ch.sendToQueue(mqConfig.queueName, Buffer.from(msg))
            console.log('- Sent', msg)
            return ch.close()
        })
        }).finally(() => conn.close())
    }).catch(console.warn);

    res.formatter.ok("Refund created successfully");
};

exports.update = function (req, res, next) {
    let param = req.body;
    let { id } = req.params;

    const producer = new kafka.HighLevelProducer(kafkaConfig.client);

    const event = {
        id,
        param
    };

    const buffer = new Buffer.from(JSON.stringify(event));
    const record = [
        {
            topic: kafkaConfig.topic,
            messages: buffer,
            attributes: 1
        }
    ];
    producer.send(record, function(error) {
        if(error) console.log("Error send data to kafka - ",error)
        console.log("Success to send data to kafka - ",record)
    });

    res.formatter.ok("Refund updated successfully");
};

exports.list = function (req, res, next) {
	Refund.find({},function(error, data) {
		if(error) return res.formatter.serverError(error);
		res.formatter.ok(data);
	});
};