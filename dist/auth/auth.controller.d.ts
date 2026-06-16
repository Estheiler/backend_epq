import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(loginDto: LoginDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            access_token: string;
            user: {
                id: any;
                username: any;
                role: any;
            };
        };
    }>;
    getProfile(req: any): {
        success: boolean;
        data: any;
    };
    logout(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    seedFirstAdmin(): Promise<{
        success: boolean;
        message: string;
        data: {
            username: string;
            role: UserRole;
            temp_password: string;
            warning: string;
        };
    }>;
}
