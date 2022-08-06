import { IsByteLength, IsString } from 'class-validator';

export class UserLogin {
  @IsString({ message: 'O valor deve ser uma string' })
  email: string;
  @IsString({ message: 'O valor deve ser uma string' })
  @IsByteLength(3, 6, {
    message: 'O tamanho da senha deve ser entre 3 e 6 caracteres',
  })
  password: string;
}
