import { ApiProperty } from '@nestjs/swagger';

// Représente les erreurs de validation retournées par l'API.

export class ApiValidationError {
  @ApiProperty({ example: 'email' })
  property!: string;

  @ApiProperty({
    example: ['api.auth.register.error.email.invalid'],
    type: [String],
  })
  messages!: string[];

  @ApiProperty({ required: false, type: () => [ApiValidationError] })
  children?: ApiValidationError[];
}
