import { Injectable } from '@angular/core';
import { ToastProvider } from './toast.provider';
import { BrowserTab } from '@ionic-native/browser-tab/ngx';

@Injectable({
    providedIn: 'root',
})
export class BrowserProvider {

    constructor(private toastProvider: ToastProvider,
                private browserTab: BrowserTab) {
    }

    open(url: string) {
        if (!url.includes('http')) {
            url = `http://${url}`;
        } else {
            this.browserTab.isAvailable()
                .then(isAvailable => {
                    if (isAvailable) {
                        this.browserTab.openUrl(url);
                    } else {
                        this.toastProvider.messageErrorWithoutTabs('Esta pagina web es incorrecta');
                    }
                });
        }
    }

    openWhatsApp(number: string) {
        this.browserTab.isAvailable()
            .then(isAvailable => {
                if (isAvailable) {
                    this.browserTab.openUrl(`https://api.whatsapp.com/send?phone=${number}`);
                } else {
                    this.toastProvider.messageErrorWithoutTabs('No se puede abrir WhatsApp');
                }
            });
    }

}
