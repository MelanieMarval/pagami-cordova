import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';

import { StorageProvider } from './providers/storage.provider';
import { AlertProvider } from './providers/alert.provider';

import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Environment } from '@ionic-native/google-maps';

import { USER } from './utils/Const';
import { User } from './core/api/users/user';
import { AuthService } from './core/api/auth/auth.service';
import { GoogleAuthService } from './core/google-auth/google-auth.service';
import { DrawerState } from './shared/ion-bottom-drawer/drawer-state';
import { MapProvider } from './providers/map.provider';
import { VerifyAndroidPermissionsService } from './core/permissions/verify-android-permissions.service';
import { PlatformUtils } from './utils/platform.utils';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BrowserProvider } from './providers/browser.provider';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent {
    constructor(private router: Router,
                private platform: Platform,
                private authService: AuthService,
                private googleAuthService: GoogleAuthService,
                private storageService: StorageProvider,
                private mapProvider: MapProvider,
                private alert: AlertProvider,
                private appMinimize: AppMinimize,
                private splashScreen: SplashScreen,
                private navController: NavController,
                private statusBar: StatusBar,
                public browser: BrowserProvider,
                private verifyAndroidPermissions: VerifyAndroidPermissionsService) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(async () => this.checkPermissions());
        this.platform.backButton.subscribeWithPriority(10, () => {
          // tslint:disable-next-line:max-line-length
            if (this.router.url === '/app/tabs/map/search' && (this.mapProvider.currentNearbyStatus === DrawerState.Top || this.mapProvider.currentNearbyStatus === DrawerState.Docked)) {
                this.mapProvider.hideNearby.emit();
            } else {
                if (this.verifyIfCanCloseApp(this.router.url)) {
                    // this.alert.alertConfirmExit().then(() => {
                        this.appMinimize.minimize();
                        // navigator['app'].exitApp();
                    // });
                } else {
                    this.navController.back();
                }
            }
        });
    }

    async checkPermissions() {
        if (PlatformUtils.isTest()) {
            this.start();
        } else {
            const response = await this.verifyAndroidPermissions.need();
            console.log('-> response', response);
            if (response) {
                await this.verifyAndroidPermissions.alertOpenSettings(response, () => {
                    this.checkPermissions();
                });
            } else {
                this.start();
            }
        }
    }

    private async start() {
        const isLogged = await this.storageService.isLogged();
        const user = await this.storageService.getPagamiUser();

        Environment.setEnv({
            API_KEY_FOR_BROWSER_RELEASE: 'AIzaSyD3t5VAdEBMdICcY9FyVcgBHlkeu72OI4s',
            API_KEY_FOR_BROWSER_DEBUG: 'AIzaSyD3t5VAdEBMdICcY9FyVcgBHlkeu72OI4s'
        });

        const lastUserVerification = await this.storageService.getLastUserVerification();
        if (isLogged && user) {
            await this.refreshToken();
            if (user.type && user.type === USER.TYPE.ADMIN) {
                this.openAdminPanel();
            } else {
                this.openHome();
            }
            setTimeout(() => {
                this.verifyUser(user);
            }, 2000);
        } else {
            await this.openTutorial();
        }
        await setTimeout(async () => {
            await this.splashScreen.hide();
            this.statusBar.backgroundColorByHexString('#1a202c');
        }, 1000);
    }

    private verifyUser(lastUser: User) {
        let user: User;
        this.authService.verify()
            .then(success => {
                user = success.response;
                this.storageService.setPagamiUser(user);
                this.storageService.setLastUserVerification(new Date());
                if (user.status !== USER.STATUS.DISABLED) {
                    if (lastUser.type === USER.TYPE.NORMAL) {
                        if (user.type === USER.TYPE.ADMIN) {
                            this.alert.alertChangedUserStatus('ascendido');
                            this.openAdminPanel();
                        }
                    } else {
                        if (user.type === USER.TYPE.NORMAL) {
                            this.alert.alertChangedUserStatus('descendido');
                            this.openHome();
                        }
                    }
                } else {
                    this.googleAuthService.singOut();
                    this.alert.alertChangedUserStatus('deshabilitado');
                    this.router.navigateByUrl('/tutorial');
                }
            });
    }

    private openTutorial(): Promise<boolean> {
        return this.router.navigateByUrl('/tutorial', {replaceUrl: true});
    }

    private openHome(): Promise<boolean> {
        return this.router.navigateByUrl('/app/tabs/map/search', {replaceUrl: true});
    }

    private openAdminPanel(): Promise<boolean> {
        return this.router.navigateByUrl('/admin/tabs/activity', {replaceUrl: true});
    }

    private verifyIfCanCloseApp(currentUrl: string): boolean {
        return currentUrl === '/admin/tabs/activity'
            || currentUrl === '/admin/tabs/businesses'
            || currentUrl === '/admin/tabs/records'
            || currentUrl === '/admin/tabs/users'
            || currentUrl === '/app/tabs/map/search'
            // || currentUrl === '/app/tabs/map/searching'
            || currentUrl === '/app/tabs/building'
            // || currentUrl === '/app/tabs/map/register-business'
            || currentUrl === '/app/tabs/wallet';
    }

    private async refreshToken() {
        return await this.googleAuthService.refreshSession();
    }
}
