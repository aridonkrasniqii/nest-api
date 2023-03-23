import { createParamDecorator, ExecutionContext, Session } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: never, context: ExecutionContext) => {
  /*  
  In this function we will inspect the incoming request.
  We gonna produce some amount of data and we're gonna return it.
  */
  /*  
    Never type tells that this data will never gonna be used or accessed. 
  */
  const request = context.switchToHttp().getRequest();
  // console.log(request.session.userId); // the request.currentUser is set to Intercptor
  return request.currentUser;
  /*
  In this case to get use of the usersService we need to make an interceptor  to get the current user, then use the value to produced by it in the decorator.
  */
});
