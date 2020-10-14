import { Component, Input, OnInit } from '@angular/core';
import { ToastProvider } from '../../../../../providers/toast.provider';
import { Plan } from '../../../../../core/api/plans/plan';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { InputFilePage } from '../../../../parent/InputFilePage';
import { GeolocationService } from '../../../../../core/geolocation/geolocation.service';
import { ValidationUtils } from '../../../../../utils/validation.utils';

import { FireStorage } from '../../../../../core/fire-storage/fire.storage';
import { Payment } from '../../../../../core/api/payments/Payment';
import { MethodPayment } from '../../../../../core/api/payments/MethodPayment';
import { PaymentsService } from '../../../../../core/api/payments/payments.service';
import { UserIntentProvider } from '../../../../../providers/user-intent.provider';
import { PlatformUtils } from '../../../../../utils/platform.utils';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
    selector: 'page-transfer',
    templateUrl: 'transfer.html',
    styleUrls: ['./transfer.scss'],
})

export class TransferPage extends InputFilePage implements OnInit {

    @Input() planSelected: Plan;
    @Input() methodSelected: MethodPayment;
    @Input() placeId: string;
    payment: Payment;
    loading = false;
    isTest = false;

    constructor(private toast: ToastProvider,
                private modalController: ModalController,
                private paymentsService: PaymentsService,
                private router: Router,
                private alertController: AlertController,
                private clipboard: Clipboard,
                private camera: Camera,
                private actionSheetController: ActionSheetController,
                private fireStorage: FireStorage,
                private intentProvider: UserIntentProvider,
                protected geolocationService: GeolocationService) {
        super(geolocationService);
    }

    async ngOnInit() {
        this.isTest = PlatformUtils.isTest();
        this.payment = {
            type: this.methodSelected.id,
            planId: this.planSelected.id,
            placeId: this.placeId,
        };
    }

    closeModal() {
        const data = {};
        this.modalController.dismiss(data);
    }

    async validateMyPaymentPlan() {
        const alert = await this.alertController.create({
            header: '¿Estás seguro de haber realizado la transferencia?',
            message: 'Sólo debes rellenar y enviar este formulario cuando tu transferencia haya sido realizada',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Sí, la realice',
                    handler: () => {
                        if (this.payment.photo) {
                            this.saveImage();
                            console.log(this.payment);
                        } else {
                            this.toast.messageDefault('Necesita abjuntar la foto de la transferencia');
                        }
                    }
                }
            ]
        });

        await alert.present();
    }

    copyClipboard(numberAccount: string) {
        this.clipboard.copy(numberAccount).then(() =>
            this.toast.messageDefault('Numero de cuenta copiado en el portapapeles')
        );
    }

    async takeImage() {

        const self = this;
        const actionSheet = await this.actionSheetController.create({
            cssClass: 'action-sheet-custom-class',
            header: 'Seleccione una opción:',
            buttons: [{
                text: 'Tomar una Foto',
                icon: 'camera',
                handler: () => {
                    self.captureImage(this.camera.PictureSourceType.CAMERA);
                }
            }, {
                text: 'Buscar Foto en la Galeria',
                icon: 'image',
                handler: () => {
                    self.captureImage(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            }]
        });
        await actionSheet.present();
    }

    async captureImage(sourceType: any) {
        const options: CameraOptions = {
            quality: 80,
            sourceType,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.PNG,
            mediaType: this.camera.MediaType.PICTURE,
        };

        this.camera.getPicture(options).then(async image => {
            console.log('-> image', image);
            this.payment.photo = image;
            await this.chargeImage(this.isTest, image);
        }, error => {
            console.log('-> error', error);
        });

    }

    addPhoto(event: any) {
        if (!ValidationUtils.validateImage(event)) {
            this.toast.messageErrorWithoutTabs('Formato de imágen no válido, por favor seleccione otra.', 3000);
            return;
        }
        this.payment.photo = event.target.files[0].name;
        this.chargeImage(true, event);
    }

    async saveImage() {
        this.loading = true;
        const success = await this.fireStorage.savePaymentPhotoImage(this.fileData);
        if (success) {
            this.payment.photo = success;
            this.savePayment();
        } else {
            this.toast.messageErrorWithoutTabs('No se ha podido guardar su imagen. Intente de nuevo!');
            this.loading = false;
        }
    }

    savePayment() {
        this.loading = true;
        this.paymentsService.save(this.payment)
            .then(success => {
                this.loading = false;
                if (success.passed) {
                    this.toast.messageSuccessWithoutTabs('Su pago ha sido registrado, espere mientras es verificado');
                    this.intentProvider.updateMyBusiness = true;
                    this.router.navigateByUrl('/app/tabs/my-business');
                    this.closeModal();
                } else {
                    this.toast.messageErrorWithoutTabs('No se ha podido registrar su pago. Intente de nuevo!');
                }
            }, error => {
                this.loading = false;
                this.toast.messageErrorWithoutTabs('No se ha podido registrar su pago. Intente de nuevo!');
            });
    }

}

