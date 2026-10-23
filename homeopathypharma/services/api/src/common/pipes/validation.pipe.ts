import {
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

export const globalValidationPipeOptions: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: { enableImplicitConversion: true },
};

export const GlobalValidationPipe = new ValidationPipe(globalValidationPipeOptions);
