import { IsByteLength, IsEmail, IsString } from 'class-validator';

export class UserLogin {
  @IsString({ message: 'O valor deve ser uma string' })
  @IsEmail({ message: 'O valor deve ser um email valido' })
  email: string;

  @IsString({ message: 'O valor deve ser uma string' })
  @IsByteLength(3, 12, {
    message: 'O tamanho da senha deve ser entre 3 e 12 caracteres',
  })
  password: string;
}
