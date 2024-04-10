import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'role';
export const Roles = Reflector.createDecorator<string[]>();