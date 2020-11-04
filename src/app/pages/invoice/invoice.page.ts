import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.page.html',
    styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit {

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        const paymentId = this.route.snapshot.params;
        console.log('-> paymentId', paymentId);
    }

}
