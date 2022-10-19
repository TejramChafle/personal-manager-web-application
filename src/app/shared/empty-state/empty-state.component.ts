import { Component, Input } from '@angular/core';

@Component({
    selector:  'personal-manager-empty-state',
    templateUrl: './empty-state.component.html'
})

export class EmptyStateComponent {
    @Input('record') record: any;
    @Input('records') records: any;
    
    constructor () {
    }
}