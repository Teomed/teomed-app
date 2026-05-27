import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Permite que a requisição continue mesmo sem token válido
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // Retorna o usuário se existir, caso contrário retorna null
    // Não lança erro se não houver token
    return user;
  }
}
