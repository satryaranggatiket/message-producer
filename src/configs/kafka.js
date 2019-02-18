const kafka = require("kafka-node");

const client = new kafka.KafkaClient("http://localhost:2181", "refund.queue", {
    sessionTimeout: 300,
    spinDelay: 100,
    retries: 2
});

module.exports = {
    client,
    topic:"refund.queue"
}