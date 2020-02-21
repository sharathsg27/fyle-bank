import {
  AfterContentChecked,
  AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output, SimpleChanges,
} from '@angular/core';
import {AppService} from '../app.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input('items') items: Array<any> = [];
  @Input('displayItems') displayItems: Array<any> = [];
  @Output('onPageChange') changePage = new EventEmitter<Array<any>>();
  @Output('onPageSizeChange') setPageSize = new EventEmitter<Array<any>>();
  @Output('hasRecords') hasRecords = new EventEmitter<boolean>();
  pageSizes: Array<number> = [10, 20, 30];
  currentArray: Array<any> = [];
  currentPageSize: any = 10;
  currentPage: number = 1;
  totalPages: number;
  searchTerm: string = '';

  constructor(private appService: AppService,
              private cdRef: ChangeDetectorRef) {
    this.appService.searchTermEntered$.subscribe(value => {
      this.filterSearchItems(value);
    });
  }

  ngOnInit() {
    this.initPageSizes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.displayItems &&  (!changes.displayItems.previousValue || changes.displayItems.previousValue.length < 1)) {
      this.changePageNumber('', this.items);
    }
  }

  /**
   * Initiate pagination settings with default values
   */
  initPageSizes = () => {
    if (this.items && this.items.length) {
      this.displayItems = this.items.slice(0, this.currentPageSize);
      this.totalPages = Math.ceil(this.items.length / this.currentPageSize);
      this.setPageSize.emit(this.displayItems);
    }
  };

  /**
   * Search & filter items
   * @param {string} searchTerm
   */
  filterSearchItems = (searchTerm: string) => {
    if (!searchTerm || searchTerm === '' || typeof searchTerm !== 'string') {
      this.changePageNumber('', this.items);
      return;
    }
    this.displayItems = this.appService.searchItems(searchTerm, this.items);
    this.changePageOnSearch(this.displayItems);
  };


  /**
   * Set pagination when searching is done
   * @param {Array} items
   */
  changePageOnSearch = (items: Array<any>) => {
    let outputArray: any[];
    this.currentPage = 1;
    // tslint:disable-next-line:radix
    this.currentPageSize = parseInt(this.currentPageSize);
    this.totalPages = Math.ceil(items.length / this.currentPageSize);

    const endIndex = this.currentPageSize * this.currentPage;
    this.currentArray = items;
    outputArray = items.slice(0, endIndex);
    this.setPageSize.emit(outputArray);
    outputArray.length ? this.hasRecords.emit(true) : this.hasRecords.emit(false);
  };

  /**
   * Set pagination when back/next is clicked
   * @param {string} type
   * @param {Array} items
   */
  changePageNumber = (type?: string, items?: Array<any>) => {
    let startIndex = 0;
    let outputArray = [];
    const lastPage = Math.ceil(items.length / this.currentPageSize);
    // tslint:disable-next-line:radix
    this.currentPageSize = parseInt(this.currentPageSize);
    this.totalPages = Math.ceil(items.length / this.currentPageSize);

    // set current page to min/max if it crosses over it
    if (this.currentPage > lastPage) {
      this.currentPage = lastPage;
      return;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
      return;
    }

    // set current page when user goes back/next
    if (this.currentPage > 1 && type === 'back') {
      this.currentPage -= 1;
    } else if ((this.currentPage >= 1 && this.currentPage < lastPage) && type === 'next') {
      this.currentPage += 1;
    }

    const endIndex = this.currentPageSize * this.currentPage;
    if (this.currentPage === 1) {
      outputArray = items.slice(0, endIndex);
    } else if (this.currentPage === 2) {
      startIndex = this.currentPageSize;
      outputArray = items.slice(startIndex, endIndex);
    } else if (this.currentPage > 2) {
      startIndex = (this.currentPageSize * this.currentPage) - this.currentPageSize;
      outputArray = items.slice(startIndex, endIndex);
    }
    this.setPageSize.emit(outputArray);
    outputArray.length ? this.hasRecords.emit(true) : this.hasRecords.emit(false);
  };

}
