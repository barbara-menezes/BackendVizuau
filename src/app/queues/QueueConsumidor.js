import amqp from 'amqplib';

const host = process.env.RABBITMQ_HOST || 'amqp://localhost';

export class QueueConsumidor {

  constructor(exchange, topic){
    this.exchange = exchange;
    this.topic = topic;
  }

  async connect(){
    this.conn = await amqp.connect(host);
  }

  async consume(consumer) {
    const channel = await this.conn.createChannel();
    channel.assertExchange(this.exchange, "topic", { durable: true});
    const q = await channel.assertQueue(this.topic, { exclusive: false, maxPriority: 10});
    channel.bindQueue(q.queue, this.exchange, this.topic);
    channel.consume(q.queue, (msg) => {
      consumer(msg.fields.routingKey, JSON.parse(msg.content.toString()))
    }, { noAck: true });
  }
}