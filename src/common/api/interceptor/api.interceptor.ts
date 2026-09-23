import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { ApiCodeResponse } from '../data/enum/api-code-response.enum';
import { ApiResponse } from '../data/model/api-response';
import { API_SUCCESS_CODE_METADATA_KEY } from '../decorator/api-success-code.decorator';
import { SKIP_API_TRANSFORM_METADATA_KEY } from '../decorator/skip-api-transform.decorator';

@Injectable()
export class ApiInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const skipTransform = this.reflector.getAllAndOverride<boolean>(
      SKIP_API_TRANSFORM_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (skipTransform) {
      return next.handle();
    }

    const code =
      this.reflector.getAllAndOverride<string>(API_SUCCESS_CODE_METADATA_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? ApiCodeResponse.CommonSuccess;

    return next.handle().pipe(map((data) => ApiResponse.success(data, code)));
  }
}
