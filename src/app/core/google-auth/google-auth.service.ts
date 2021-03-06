import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { auth } from 'firebase/app';
import { StorageProvider } from '../../providers/storage.provider';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class GoogleAuthService {

    constructor(private angularFireAuth: AngularFireAuth,
                private storageService: StorageProvider,
                private googlePlus: GooglePlus,
                public toastController: ToastController) {
    }

    async singIn(): Promise<any> {
        const googleUser = await this.googlePlus.login({});
        const credential = auth.GoogleAuthProvider.credential(null, googleUser.accessToken);
        const fireCredential = await this.angularFireAuth.signInWithCredential(credential);
        await this.saveGoogleUser(googleUser);
        return await fireCredential.user.getIdToken();
    }

    async saveGoogleUser(googleUser: any) {
        await this.storageService.setGoogleUser({
            name: googleUser.givenName,
            lastname: googleUser.familyName,
            email: googleUser.email,
            photoUrl: googleUser.imageUrl,
            terms: false,
        });
    }

    async singOut() {
        await this.angularFireAuth.signOut();
        await this.googlePlus.logout();
        return true;
    }

    async removeStorage() {
        await this.storageService.setPagamiUser(null);
        await this.storageService.setBusinessVerifiedByUser(null);
        await this.storageService.setLogged(false);
    }

    async getToken(): Promise<string> {
        return new Promise(async resolve => {
            try {
                const firebaseUser = await this.angularFireAuth.currentUser;
                if (firebaseUser) {
                    const sessionToken = await firebaseUser.getIdToken();
                    resolve(sessionToken);
                } else {
                    resolve(await this.refreshSession());
                }
            } catch (err) {
                await this.wait();
                const token: any = await this.callRefreshSessionAgain();
                resolve(token);
            }
        });
    }

    async refreshSession() {
        const response = await this.googlePlus.trySilentLogin({});
        const credential = auth.GoogleAuthProvider.credential(null, response.accessToken);
        const fireCredential = await this.angularFireAuth.signInWithCredential(credential);
        return await fireCredential.user.getIdToken();
    }


    private async callRefreshSessionAgain() {
        try {
            return await this.refreshSession();
        } catch (err) {
            return await this.toastTokenError();
        }
    }

    async toastTokenError() {
        return new Promise(async resolve => {
            const toast = await this.toastController.create({
                color: 'pagami-surface',
                cssClass: 'toast-bottom-custom',
                message: 'Error al intentar conectarse con Google',
                position: 'bottom',
                buttons: [
                    {
                        text: 'REINTENTAR',
                        role: 'cancel',
                        handler: () => {
                            this.callRefreshSessionAgain()
                                .then(token => {
                                    resolve(token);
                                });
                        },
                    },
                ],
            });

            await toast.present();
        });
    }

    /**
     * Wait 5 seconds for call
     */
    private async wait() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 5000);
        });
    }
}
