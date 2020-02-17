import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dot-spinner',
  templateUrl: './dot-spinner.component.html',
  styleUrls: ['./dot-spinner.component.scss']
})
export class DotSpinnerComponent implements OnInit {
  @Input('loaderStyles') loaderStyles: any;

  constructor() {
  }

  ngOnInit(): void {
  }

}
