import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse as SwaggerApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiCodeResponse } from '../data/enum/api-code-response.enum';
import { ApiResponse } from '../data/model/api-response';
import { ApiValidationError } from '../data/model/api-validation-error';

// Documente dans Swagger le format d'une réponse API réussie.
export const ApiEnvelopeResponse = <TModel extends Type<unknown>>(
  model: TModel,
  options: {
    status?: HttpStatus;
    code?: string;
    description?: string;
  } = {},
): MethodDecorator =>
  applyDecorators(
    ApiExtraModels(ApiResponse, ApiValidationError, model),
    SwaggerApiResponse({
      status: options.status ?? HttpStatus.OK,
      description: options.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponse) },
          {
            properties: {
              code: {
                type: 'string',
                example: options.code ?? ApiCodeResponse.CommonSuccess,
              },
              result: { type: 'boolean', example: true },
              data: { $ref: getSchemaPath(model) },
              validationErrors: {
                type: 'array',
                items: { $ref: getSchemaPath(ApiValidationError) },
                example: [],
              },
            },
          },
        ],
      },
    }),
  );

// Documente dans Swagger le format d'une réponse API en erreur.
export const ApiErrorEnvelopeResponse = (
  options: {
    status?: HttpStatus;
    code?: string;
    description?: string;
  } = {},
): MethodDecorator =>
  applyDecorators(
    ApiExtraModels(ApiResponse, ApiValidationError),
    SwaggerApiResponse({
      status: options.status ?? HttpStatus.BAD_REQUEST,
      description: options.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponse) },
          {
            properties: {
              code: {
                type: 'string',
                example: options.code ?? ApiCodeResponse.CommonError,
              },
              result: { type: 'boolean', example: false },
              data: { nullable: true, example: null },
              validationErrors: {
                type: 'array',
                items: { $ref: getSchemaPath(ApiValidationError) },
                example: [],
              },
            },
          },
        ],
      },
    }),
  );
