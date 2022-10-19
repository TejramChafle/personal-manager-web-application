import { Component, Input } from '@angular/core';

@Component({
    selector:  'personal-manager-loader',
    templateUrl: './loader.component.html'
})

export class LoaderComponent {
    @Input('isError') isError: boolean;
    @Input('records') records: boolean;
    constructor () {
        console.log('LoaderComponent: ', this.records, this.isError);
    }
}