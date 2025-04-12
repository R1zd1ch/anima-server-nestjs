import { Controller } from '@nestjs/common';
import { UpdateDbService } from './update-db.service';

@Controller('update-db')
export class UpdateDbController {
  constructor(private readonly updateDbService: UpdateDbService) {}
}
