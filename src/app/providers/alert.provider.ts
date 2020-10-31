import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { GoogleAuthService } from '../core/google-auth/google-auth.service';
import { StorageProvider } from './storage.provider';

@Injectable({
    providedIn: 'root',
})
export class AlertProvider {

    constructor(private alertController: AlertController,
                private googleAuthService: GoogleAuthService,
                private router: Router,
                private splashScreen: SplashScreen,
                private storageService: StorageProvider) {
    }

    async alertComingSoon() {
        const alert = await this.alertController.create({
            header: 'Proximamente...',
            message: 'Esta opcion no esta disponible actualmente. <br> Estara habilitada en proximas versiones.',
            buttons: ['Entendido'],
        });

        await alert.present();
    }

    async alertChangedUserStatus(status) {
        let message = 'Ya no tendra acceso al panel administrativo, ni a las estadisticas mostradas en este. Ahora es un usuario normal';
        if (status === 'deshabilitado') {
            message = 'Lamentablemente ya no tiene permitido acceder a la aplicacion. Lamentamos las molestias.';
        }
        if (status === 'ascendido') {
            message = 'Ahora tendra acceso al panel administrativo y tendra control sobre los diferentes lugares y usuario registrados';
        }

        const alert = await this.alertController.create({
            header: 'Su usuario ha sido ' + status,
            message,
            buttons: ['Aceptar'],
        });
        await alert.present();
    }

    async alertConfirmDelete(header = '¿Esta seguro de que desea eliminarlo?', message = 'Esta opcion no podra ser regresada'): Promise<boolean> {
        return new Promise(async (resolve) => {

            const alert = await this.alertController.create({
                header,
                message,
                buttons: [{
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'alert-button-cancel',
                }, {
                    text: 'Si, eliminar',
                    handler: () => {
                        resolve();
                    },
                }],
            });
            await alert.present();
        });
    }

    async alertConfirmExit(): Promise<boolean> {
        return new Promise(async (resolve) => {
            const header = '¿Esta seguro que desea salir de la Pagami?';
            const message = '';
            const alert = await this.alertController.create({
                header,
                message,
                buttons: [
                    {
                        text: 'Cancelar',
                        role: 'cancel',
                        cssClass: 'alert-button-cancel',
                    }, {
                        text: 'Si, Salir',
                        handler: () => {
                            resolve();
                        },
                    },
                ],
            });
            await alert.present();
        });
    }

    /**
     * If profile is incomplete that is, without location.address and phone
     */
    async alertCompleteProfile() {
        const header = 'Completa tu perfil';
        const message = 'Para poder realizar esta acción necesita completar su perfil (ubicacion y telefono)';
        const alert = await this.alertController.create({
            header,
            message,
            buttons: [{
                text: 'Más tarde',
                role: 'cancel',
                cssClass: 'alert-button-cancel',
            }, {
                text: 'Ir ahora',
                handler: () => {
                    this.router.navigateByUrl('/app/settings/profile');
                },
            }],
        });
        await alert.present();
    }

    /**
     * To exit confirm
     */
    async alertCloseSessionConfirm() {
        const alert = await this.alertController.create({
            header: 'Cerrar Sesión',
            message: '¿Seguro que desea cerrar su sesión?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'alert-button-cancel',
                    handler: () => {
                        // close
                    },
                }, {
                    text: 'Si, Cerrar',
                    cssClass: 'alert-confirm',
                    handler: () => {
                        this.closeSession();
                    },
                },
            ],
            cssClass: 'ion-color-pagami-surface',
        });

        await alert.present();
    }

    async closeSession() {
        this.googleAuthService.singOut()
            .finally(async () => {
                await this.storageService.setPagamiUser(null);
                await this.storageService.setBusinessVerifiedByUser(null);
                await this.storageService.setLogged(false);
                await this.router.navigateByUrl('/tutorial');
                window.location.reload();
                await this.splashScreen.show();
            });
    }
}
