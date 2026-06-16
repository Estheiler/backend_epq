import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private auditoriaService;
    constructor(usersService: UsersService, jwtService: JwtService, auditoriaService: AuditoriaService);
    validateUser(username: string, pass: string): Promise<any>;
    login(loginDto: LoginDto, ip: string, userAgent: string): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            role: any;
        };
    }>;
    logout(username: string, ip: string, userAgent: string): Promise<void>;
}
