import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetWorkspaceId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const workspaceId = request.headers['x-workspace-id'];
    if (!workspaceId) {
      throw new Error('x-workspace-id header is required');
    }
    return workspaceId;
  },
);
