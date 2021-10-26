import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const accessToken = this.firebaseService.extractToken(request);
      request.user = await this.firebaseService.decodeToken(accessToken);
      return request.user != null;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
