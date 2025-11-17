import { SetMetadata } from '@nestjs/common';

export const SuperAdmin = () => SetMetadata('superAdmin', true);
