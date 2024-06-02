import { Inject, Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @Inject(AwsS3Service) private readonly awsS3Service: AwsS3Service,
  ) {}

  public async create(createImageDto: CreateImageDto) {
    try {
      const { file: imageFile } = createImageDto;
      await this.awsS3Service.uploadFile(imageFile);

      const partialImage = {
        imageS3Id: imageFile.originalname,
        userId: 1,
        caption: createImageDto.caption,
        tags: createImageDto.tags,
        date: new Date('2024-05-01'),
        location: 'Lviv',
      } as Partial<Image>;

      return await this.imageRepository.save(partialImage);
    } catch (error) {
      console.error('Error creating image:', error);
      throw error;
    }
  }

  public async findAll() {
    const images = await this.imageRepository.find({
      where: {
        user: {
          id: 1,
        },
      },
    });

    return images.slice(0, 10);
  }
}
