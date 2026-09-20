import { Module, Global } from '@nestjs/common';
import { configProvider } from './app.config.provider';

@Global()
@Module({
  providers: [configProvider],
  exports: [configProvider],
})
export class AppConfigModule {}
