import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto, executor: User): Promise<{
        success: boolean;
        message: string;
        data: User;
    }>;
    listAll(executor: User): Promise<{
        success: boolean;
        data: User[];
    }>;
    update(id: number, body: {
        username?: string;
    }, executor: User): Promise<{
        success: boolean;
        message: string;
        data: User;
    }>;
    activate(id: number, executor: User): Promise<{
        success: boolean;
        message: string;
        data: User;
    }>;
    deactivate(id: number, executor: User): Promise<{
        success: boolean;
        message: string;
        data: User;
    }>;
    updateRole(id: number, role: UserRole, executor: User): Promise<{
        success: boolean;
        message: string;
        data: User;
    }>;
    resetPassword(id: number, password: string, executor: User): Promise<{
        success: boolean;
        message: string;
        data: User;
    }>;
    remove(id: number, executor: User): Promise<{
        success: boolean;
        message: string;
    }>;
}
