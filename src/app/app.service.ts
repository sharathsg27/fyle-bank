import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, publishReplay, refCount, shareReplay, switchMap, take} from 'rxjs/operators';
import {Observable, Subject, throwError, timer} from 'rxjs';
import {LIST_BANKS_API} from '../constants/app.constants';

const CACHE_SIZE = 1;
const REFRESH_INTERVAL = 10000;

@Injectable({
  providedIn: 'root'
})

export class AppService {
  private cache$: Observable<Array<any>>;

  // Observable string sources
  private searchTermSource = new Subject<string>();

  // Observable string streams
  searchTermEntered$ = this.searchTermSource.asObservable();

  constructor(private http: HttpClient) {
  }


  /**
   * Get records
   */
  getRecords = (apiURL: string) => {
    return this.http.get<any>(apiURL).pipe(
      publishReplay(1),
      refCount(),
      take(1),
      catchError(err => {
        console.log(err);
        return throwError(err);
      })
    );
  };


  /**
   * Emit search value for all the subscribers
   * @param {string} value
   */
  searchValue = (value: string) => {
    this.searchTermSource.next(value);
  };

  /**
   * Search items based on multiple key parameters
   * @param {string} searchTerm
   * @param {Array} items
   */
  searchItems = (searchTerm: string, items: any[]) => {
    const keys = Object.keys(items[0]).join(',');

    searchTerm = searchTerm.trim().toUpperCase();
    return (items || []).filter(item => keys.split(',')
      .some(key => item.hasOwnProperty(key) && new RegExp(searchTerm, 'gi').test(item[key])));
  };

  getItemInSessionStorage = (key) => {
    if (sessionStorage.getItem(key) === '' || sessionStorage.getItem(key) == null) {
      return null;
    } else {
      return JSON.parse(sessionStorage.getItem('favorites'));
    }
  };

  setItemInSessionStorage = (key, items) => {
    sessionStorage.setItem(key, JSON.stringify(items));
  };
}
