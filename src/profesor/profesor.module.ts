import { Module } from '@nestjs/common';
import { ProfesorService } from './profesor/profesor.service';

@Module({
  providers: [ProfesorService]
})
export class ProfesorModule {}
