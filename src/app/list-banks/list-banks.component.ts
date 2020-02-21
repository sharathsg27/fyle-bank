import {
  Component,
  OnInit,
} from '@angular/core';
import {AppService} from '../app.service';
import {IBank} from '../interfaces/IBank';
import {LIST_BANKS_API} from '../../constants/app.constants';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-list-banks',
  templateUrl: './list-banks.component.html',
  styleUrls: ['./list-banks.component.scss']
})
export class ListBanksComponent implements OnInit {
  banks: Array<IBank> = [];
  displayBanks: Array<IBank> = [];
  bankHeaders: any[] = [];
  favoriteItems: any[] = [];
  loading: boolean = false;
  hasRecords: boolean = false;

  constructor(private appService: AppService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    if (this.banks.length < 1) this.getBanks();
    this.bankHeaders = ['', 'Bank Name', 'ID', 'Branch', 'IFSC', 'State', 'District', 'City', 'Address'];
  }

  /**
   * Get list of available banks
   */
  getBanks = () => {
    if (this.appService.getItemInSessionStorage('banks')) {
      this.banks = this.appService.getItemInSessionStorage('banks');
      this.setBankTableInfo(this.banks);
    } else {
      this.loading = true;
      this.appService.getRecords(LIST_BANKS_API).subscribe(banks => {
        this.appService.setItemInSessionStorage('banks', banks);
        this.setBankTableInfo(banks);
        this.loading = false;
        this.toastr.success('Bank records retrieved successfully!');
      }, error => console.log(error));
    }
  };

  /**
   * Set bank table info
   * @param {Array} banks
   */
  setBankTableInfo = (banks: Array<IBank>) => {
    banks.length ? this.hasRecords = true : this.hasRecords = false;
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
    // showing only 10 records per page initially to reduce page rendering load
    this.displayBanks = this.banks.slice(0, 10);
  }

}
