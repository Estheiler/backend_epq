import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
export declare class UsersService {
    private usersRepository;
    private auditoriaService;
    constructor(usersRepository: Repository<User>, auditoriaService: AuditoriaService);
    findOneByUsername(username: string): Promise<User | null>;
    findOneById(id: number): Promise<User | null>;
    private validateHierarchy;
    create(createUserDto: CreateUserDto, executor: User): Promise<User>;
    update(id: number, data: {
        username?: string;
    }, executor: User): Promise<User>;
    activate(id: number, executor: User): Promise<User>;
    deactivate(id: number, executor: User): Promise<User>;
    updateRole(id: number, newRole: UserRole, executor: User): Promise<User>;
    resetPassword(id: number, newPass: string, executor: User): Promise<User>;
    softDelete(id: number, executor: User): Promise<void>;
    listAll(executor: User): Promise<User[]>;
    count(): Promise<number>;
    seed(createUserDto: CreateUserDto): Promise<User>;
}
