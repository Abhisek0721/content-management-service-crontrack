import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class WorkspaceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const workspaceId = request.headers['x-workspace-id'];

    if (!workspaceId) {
      throw new BadRequestException('x-workspace-id header is required');
    }

    // Attach the workspaceId to the request object for further use if needed
    request.workspaceId = workspaceId;
    return next.handle();
  }
}
