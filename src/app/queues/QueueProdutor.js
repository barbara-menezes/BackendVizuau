import amqp from 'amqplib';

const host = process.env.RABBITMQ_HOST || 'amqp://localhost';

export class QueueProdutor {

  constructor(key, maxPriority){
    this.exchange = "vizuau";
    this.key = key;
    this.maxPriority = maxPriority;
  }

  async connect(){
    if(!this.conn)
      this.conn = await amqp.connect(host);
  }

  async publish(msg, priority) {
    await this.connect();
    const channel = await this.conn.createChannel();
    channel.assertExchange(this.exchange, "topic", { durable: true, arguments: {
      "x-max-priority": this.maxPriority
    }});
    channel.publish(this.exchange, this.key, Buffer.from(JSON.stringify(msg)), { priority });
  }
}