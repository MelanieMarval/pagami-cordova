import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-modal-banks',
    templateUrl: './modal-selectable.component.html',
    styleUrls: ['./modal-selectable.component.scss'],
})
export class ModalSelectableComponent {

    @Input() items: any[] = [];
    @Input() item: any;
    textToSearch: string;

    constructor(private modalController: ModalController) {
    }

    dismissModal(item?: any) {
        if (item) {
            this.modalController.dismiss(item);
        } else {
            this.modalController.dismiss();
        }
    }

    selectBank(event: any) {
        this.dismissModal(event.target.value);
    }


}
