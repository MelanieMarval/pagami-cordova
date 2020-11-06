import { Plan } from '../plans/plan';
import { User } from '../users/user';
import { Place } from '../places/place';

export interface PaymentDetails {
    id?: string;
    photo?: string;
    amount?: number;
    date?: any;
    note?: string;
    type?: string;
    currency?: string;

    plan?: Plan,
    user?: User,
    place?: Place,
    status?: string
    createTime?: string;
}
