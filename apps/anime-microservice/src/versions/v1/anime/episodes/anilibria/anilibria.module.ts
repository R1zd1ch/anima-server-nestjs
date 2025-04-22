import { Module } from '@nestjs/common';
import { AnilibriaService } from './anilibiria.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AnilibriaService],
  exports: [AnilibriaService],
})
export class AnilibriaModule {}
