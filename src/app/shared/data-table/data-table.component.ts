import {
  AfterContentChecked,
  AfterContentInit, AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {AppService} from '../../app.service';
import {faExternalLinkAlt, faHeart} from '@fortawesome/free-solid-svg-icons';
import {NavigationExtras, Router} from '@angular/router';
import has = Reflect.has;
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent implements OnInit {
  @Input('items') items: Array<any>;
  @Input('displayItems') displayItems: Array<any>;
  @Input('headers') headers: any[] = [];
  @Input('size') size: number;
  @Input('loading') loading: boolean;
  @Input('hasRecords') hasRecords: boolean;
  favoriteItems: any[] = [];
  faHeart = faHeart;
  faExternalLink = faExternalLinkAlt;

  constructor(private appService: AppService,
              private cdRef: ChangeDetectorRef,
              private toastr: ToastrService,
              private router: Router) {
  }

  ngOnInit() {
    this.favoriteItems = this.appService.getItemInSessionStorage('fv-banks');
  }

  /**
   * Keep item (key, value) order as it is
   * @param a
   * @param b
   */
  keepOrder = (a, b) => a;

  checkRecords = (hasRecords) => {
    this.hasRecords = hasRecords;
    if (!this.hasRecords) this.toastr.error('No bank records found!');
  }

  /**
   * update items on change
   * @param {Array} items
   */
  updateItems = (items: any[]) => {
    this.displayItems = items;
  };

  /**
   * Mark items as favorite & set in session storage
   * @param event
   * @param itemDetail
   * @param item
   */
  markFavorite = (event, itemDetail, item) => {
    let index: number;
    event.stopPropagation();
    if (this.favoriteItems == null) {
      this.favoriteItems = [];
    }

    if (this.favoriteItems && this.favoriteItems.length) {
      index = this.favoriteItems.findIndex(favItemId => favItemId === itemDetail.value);
      if (index === -1) {
        item.isFavorite = true;
        this.favoriteItems.push(itemDetail.value);
        this.appService.setItemInSessionStorage('fv-banks', this.favoriteItems);
      } else {
        item.isFavorite = false;
        this.favoriteItems.splice(index, 1);
        this.appService.setItemInSessionStorage('fv-banks', this.favoriteItems);
      }
    } else {
      item.isFavorite = true;
      this.favoriteItems.push(itemDetail.value);
      this.appService.setItemInSessionStorage('fv-banks', this.favoriteItems);
    }
  }

  /**
   * View bank details by id
   * @param event
   * @param {Object} item
   */
  goToBank = (event, item) => {
    event.stopPropagation();
    const navigationExtras: NavigationExtras = {
      queryParams: {
        ...item
      }
    };
    this.router.navigate([`/banks/${item.bank_id}`], navigationExtras);
  }

}
