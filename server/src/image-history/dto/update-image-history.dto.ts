import { PartialType } from '@nestjs/mapped-types';
import { CreateImageHistoryDto } from './create-image-history.dto';

export class UpdateImageHistoryDto extends PartialType(CreateImageHistoryDto) {}
