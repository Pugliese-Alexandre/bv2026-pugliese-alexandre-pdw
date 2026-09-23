import { Global, Module, RequestMethod } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { EnvService } from '@common/config';
import { AppLogger } from './app-logger.service';
import { LogCategory } from './data/enum/log-category.enum';
import { resolveHttpLogLevel } from './http-log-level.util';
import { LOG_REDACTION_PATHS } from './logging-redaction';
import {
  REQUEST_ID_HEADER,
  REQUEST_ID_RESPONSE_HEADER,
  resolveRequestId,
} from './request-id.util';

@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        pinoHttp: {
          level: envService.logLevel,
          redact: {
            paths: LOG_REDACTION_PATHS,
            censor: '[REDACTED]',
          },
          autoLogging: !envService.isTest,
          genReqId: (request, response) => {
            const requestId = resolveRequestId(
              request.headers[REQUEST_ID_HEADER],
            );
            response.setHeader(REQUEST_ID_RESPONSE_HEADER, requestId);
            return requestId;
          },
          // Keeps app logs made mid-request lean (just the requestId
          // binding); the completion log below still gets the full req/res.
          quietReqLogger: true,
          customAttributeKeys: { reqId: 'requestId' },
          customProps: () => ({
            service: envService.appName,
            category: LogCategory.Http,
          }),
          customLogLevel: (request, response, error) =>
            resolveHttpLogLevel(
              request.url,
              response.statusCode,
              Boolean(error),
            ),
          customSuccessObject: (
            request,
            response,
            successObject: Record<string, unknown>,
          ) => ({
            ...successObject,
            event: 'http.request.completed',
          }),
          customErrorObject: (
            request,
            response,
            error,
            errorObject: Record<string, unknown>,
          ) => ({
            ...errorObject,
            event: 'http.request.failed',
          }),
        },
        // nestjs-pino defaults to the legacy Express "*" wildcard, which
        // NestJS 11 + global prefix converts (with a warning) to
        // "/api/{*path}". Using the modern named-wildcard syntax directly
        // avoids that LegacyRouteConverter warning entirely.
        forRoutes: [{ path: '{*path}', method: RequestMethod.ALL }],
      }),
    }),
  ],
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggingModule {}
