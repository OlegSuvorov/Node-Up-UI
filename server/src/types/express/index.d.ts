import { User } from '../../entity/User'

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                email: string;
            }
        }
    }
}

export {} 
