import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../decorator/role.decorator';
import { Role } from 'src/libs/database/entities';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {

    constructor(private reflector: Reflector) { super() }
    async canActivate(context: ExecutionContext): Promise<boolean> {

        // call AuthGuard in order to ensure user is injected in request
        const role = this.reflector.get(Roles, context.getHandler()) || null;
        if (!role) {
            return true;
        }

        // successfull authentication, user is injected
        const { user } = context.switchToHttp().getRequest();
        if(!user){
            return true;
        }
        
        if (user.role.length > 0) {
            const hasMatchingRole: boolean = user.role.some((userRole: Role) => {
                return role.some((item: string) => userRole.name === item);
            });

            if (hasMatchingRole) {
                return true;
            }
        }
        return false;
    }
}