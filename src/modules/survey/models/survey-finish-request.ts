/* eslint-disable prettier/prettier */
import { QuestionResponse } from './question-response';

export class SurveyFinishRequest {
  _id: string;
  orderId: string;
  questions: QuestionResponse[];
  feedback: string;
}
