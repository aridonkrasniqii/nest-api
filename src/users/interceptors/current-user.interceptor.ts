import { UsersService } from './../users.service';
import { NestInterceptor, ExecutionContext, CallHandler, Injectable, UseInterceptors } from '@nestjs/common';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    if (userId) {
      const user = await this.usersService.findOne(userId);
      request.currentUser = user;
    }
    return handler.handle(); // just go ahead and run the route handler
  }
}

export const SessionDecorator = (usersService: UsersService) => {
  return UseInterceptors(new CurrentUserInterceptor(usersService));
};
