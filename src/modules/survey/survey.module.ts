import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveyController } from './controllers/survey.controller';
import { Survey, SurveySchema } from './schemas/survey-schema';
import { SurveyService } from './services/survey.service';

@Module({
  controllers: [SurveyController],
  providers: [SurveyService],
  imports: [
    MongooseModule.forFeature([{ name: Survey.name, schema: SurveySchema }]),
  ],
})
export class SurveyModule {}
