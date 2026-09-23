import { ApiProperty } from '@nestjs/swagger';

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
