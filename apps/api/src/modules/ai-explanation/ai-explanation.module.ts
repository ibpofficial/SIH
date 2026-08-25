import { Module } from '@nestjs/common';
import { AiExplanationService } from './ai-explanation.service';

@Module({
  providers: [AiExplanationService],
  exports: [AiExplanationService]
})
export class AiExplanationModule {}
