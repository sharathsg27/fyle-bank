import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {AppService} from '../app.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input('items') items: Array<any> = [];
  @Input('displayItems') displayItems: Array<any> = [];
  @Output('onPageChange') changePage = new EventEmitter<Array<any>>();
  @Output('onPageSizeChange') setPageSize = new EventEmitter<Array<any>>();
  pageSizes: Array<number> = [10, 20, 30];
  currentArray: Array<any> = [];
  currentPageSize: any = 10;
  currentPage: number = 1;
  totalPages: number;
  searchTerm: string = '';

  constructor(private appService: AppService) {
    this.appService.searchTermEntered$.subscribe(value => {
      this.filterSearchItems(value);
    });
  }

  ngOnInit() {
    this.initPageSizes();
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
    if (!searchTerm || typeof searchTerm !== 'string') {
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
    let outputArray = [];
    this.currentPage = 1;
    // tslint:disable-next-line:radix
    this.currentPageSize = parseInt(this.currentPageSize);
    this.totalPages = Math.ceil(items.length / this.currentPageSize);

    const endIndex = this.currentPageSize * this.currentPage;
    this.currentArray = items;
    outputArray = items.slice(0, endIndex);
    this.setPageSize.emit(outputArray);
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
  };

}
