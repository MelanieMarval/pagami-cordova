import { User } from '../core/api/users/user';
import { Place } from '../core/api/places/place';

export class PhotoUtils {

    static getThumbnailPhoto(user: User) {
        if (!user.photoUrl) {
            return 'assets/img/no-user-image.png';
        } else {
            const arrayPhoto = user.photoUrl.split('?');
            return `${arrayPhoto[0]}_64x64?${arrayPhoto[1]}`;
        }
    }

    static getPhotoUser(user: User) {
        if (!user.photoUrl) {
            return 'assets/img/no-user-image.png';
        } else {
            return user.photoUrl;
        }
    }

    static getPhotoPlace(place: Place) {
        if (!place.photoUrl) {
            return 'assets/img/no-business-image.png';
        } else {
            return place.photoUrl;
        }
    }

    static getThumbnailPayment(payment: any) {
        if (!payment.photoUrlToShow) {
            return 'assets/img/no-business-image.png';
        } else {
            const arrayPhoto = payment.photoUrlToShow.split('?');
            return `${arrayPhoto[0]}_64x64?${arrayPhoto[1]}`;
        }
    }

}
