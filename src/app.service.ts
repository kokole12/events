import { Injectable, Logger } from '@nestjs/common';
import { CreatUserDto } from './dto/crreateUser.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './events/userCreated.event';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createUser(body: CreatUserDto) {
    this.logger.log('creating user....', body);
    const userId: string = '123';
    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent(userId, body.email),
    );
    const establishWebsocketTtl = setTimeout(
      () => this.establishWebsocketConn(userId),
      5000,
    );

    this.schedulerRegistry.addTimeout(
      `${userId}_establish_ws`,
      establishWebsocketTtl,
    );
  }

  private establishWebsocketConn(userId: string) {
    this.logger.log('establishing websocket connection with user ', userId);
  }

  @OnEvent('user.created')
  welcomeUser(payload: UserCreatedEvent) {
    this.logger.log('Welcoming new user...', payload.email);
  }

  @OnEvent('user.created', { async: true })
  async sendWelcome(payload: UserCreatedEvent) {
    this.logger.log('sending welcome gift', payload.email);
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 3000));
    this.logger.log('Welcome gift sent');
  }

  /**scheduling taks */
  @Cron(CronExpression.EVERY_10_SECONDS, { name: 'deleting_expired_users' })
  deleteExpiredUsers() {
    this.logger.log('deleting expired users');
  }
}
