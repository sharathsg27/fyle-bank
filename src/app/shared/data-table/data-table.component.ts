import {AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, Input, OnInit} from '@angular/core';
import {AppService} from '../../app.service';
import {faHeart} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent implements OnInit, AfterContentChecked {
  @Input('items') items: Array<any>;
  @Input('displayItems') displayItems: Array<any>;
  @Input('headers') headers: any[] = [];
  @Input('size') size: number;
  favoriteItems: any[] = [];
  faHeart = faHeart;
  prevLength;

  constructor(private appService: AppService,
              private cdRef: ChangeDetectorRef) {
    this.appService.searchTermEntered$.subscribe(value => {
      if (value === '') {
        this.displayItems = this.items;
      }
    });
  }

  ngOnInit() {
    this.favoriteItems = this.appService.getItemInSessionStorage('fv-banks');
  }

  ngAfterContentChecked() {
    this.cdRef.detectChanges();
  }

  /**
   * Keep item (key, value) order as it is
   * @param a
   * @param b
   */
  keepOrder = (a, b) => a;

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

}
