import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Location} from '@angular/common';
import {IBank} from '../interfaces/IBank';

@Component({
  selector: 'app-bank-detail',
  templateUrl: './bank-detail.component.html',
  styleUrls: ['./bank-detail.component.scss']
})
export class BankDetailComponent implements OnInit {
  bank: IBank;

  constructor(private route: ActivatedRoute,
              private location: Location) { }

  ngOnInit() {
    this.getBank();
  }

  /**
   * Get selected bank dettails
   */
  getBank = () => {
    this.route.queryParams.subscribe(
      (bank: IBank) => {
        this.bank = bank;
      }
    );
  }

  /**
   * Go back to list page
   */
  goBack() {
    this.location.back();
  }

}
