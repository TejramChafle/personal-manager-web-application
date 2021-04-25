import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[isautofocused]'
})

export class IsautofocusedDirective implements OnInit {
  @Input('isautofocused') isautofocused: boolean;
  
  constructor(private _elementRef: ElementRef) {
  }

  ngOnInit(): void {
    if (this.isautofocused) {
      this._elementRef.nativeElement.focus();
    }
  }
}
