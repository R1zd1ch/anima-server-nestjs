import { PartialType } from '@nestjs/mapped-types';
import { ProgressCreateDto } from './create-progress.dto';

export class ProgressUpdateDto extends PartialType(ProgressCreateDto) {}
