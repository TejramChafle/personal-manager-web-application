import { Component, Input } from '@angular/core';

@Component({
    selector:  'personal-manager-error-handler',
    templateUrl: './error.component.html'
})

export class ErrorComponent {
    @Input('isError') isError: boolean;
    constructor () {
        console.log('ErrorComponent:', this.isError);
    }
}