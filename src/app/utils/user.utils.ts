import { User } from '../core/api/users/user';

export class UserUtils {

    static getThumbnailPhoto(user: User) {
        if (!user.photoUrl) {
            return 'assets/img/no-user-image.png';
        } else {
            const arrayPhoto = user.photoUrl.split('?');
            return `${arrayPhoto[0]}_64x64?${arrayPhoto[1]}`;
        }
    }

    static getPhoto(user: User) {
        if (!user.photoUrl) {
            return 'assets/img/no-user-image.png';
        } else {
            return user.photoUrl;
        }
    }

}
