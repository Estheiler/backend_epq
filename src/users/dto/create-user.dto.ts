import { IsString, IsNotEmpty, IsEnum, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' })
  @MinLength(4, { message: 'El nombre de usuario debe tener al menos 4 caracteres.' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;

  @IsEnum(UserRole, { message: 'El rol debe ser superadmin, admin, operario o hidraulico.' })
  @IsNotEmpty({ message: 'El rol es obligatorio.' })
  role: UserRole;
}
