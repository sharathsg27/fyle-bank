import {
  Component,
  OnInit,
} from '@angular/core';
import {AppService} from '../app.service';
import {IBank} from '../interfaces/IBank';
import {LIST_BANKS_API} from '../../constants/app.constants';

@Component({
  selector: 'app-list-banks',
  templateUrl: './list-banks.component.html',
  styleUrls: ['./list-banks.component.scss']
})
export class ListBanksComponent implements OnInit {
  banks: Array<IBank> = [];
  bankHeaders: any[] = [];
  favoriteItems: any[] = [];

  constructor(private appService: AppService) {
  }

  ngOnInit() {
    this.getBanks();
    this.setBankTableInfo();
  }

  /**
   * Get list of available banks
   */
  getBanks = () => {
    this.appService.getRecords(LIST_BANKS_API).subscribe(banks => {
      this.banks = banks.map(bank => {
        return {
          id: `${bank.bank_id}-${bank.ifsc}`,
          bank_name: bank.bank_name,
          bank_id: bank.bank_id,
          branch: bank.branch,
          ifsc: bank.ifsc,
          state: bank.state,
          district: bank.district,
          city: bank.city,
          address: bank.address
        };
      });
      if (this.appService.getItemInSessionStorage('fv-banks')) {
        this.favoriteItems = this.appService.getItemInSessionStorage('fv-banks');
        this.favoriteItems.forEach(favItemId => {
          const index = this.banks.findIndex(bank => bank.id === favItemId);
          if (index > -1) {
            this.banks[index].isFavorite = true;
          }
        });
      }
    }, error => console.log(error));
  };

  /**
   * Set bank table info
   */
  setBankTableInfo = () => {
    this.bankHeaders = ['', 'Bank Name', 'ID', 'Branch', 'IFSC', 'State', 'District', 'City', 'Address'];
  }

}
