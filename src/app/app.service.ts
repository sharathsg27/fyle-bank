import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, publishReplay, refCount, take} from 'rxjs/operators';
import {Observable, of, Subject, throwError} from 'rxjs';
import {IBank} from './interfaces/IBank';

@Injectable({
  providedIn: 'root'
})

export class AppService {

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

  /**
   * Get data from session storage based on key
   * @param {string} key
   */
  getItemInSessionStorage = (key) => {
    if (sessionStorage.getItem(key) === '' || sessionStorage.getItem(key) == null) {
      return null;
    } else {
      return JSON.parse(sessionStorage.getItem(key));
    }
  };

  /**
   * Set items in session storage
   * @param {string} key
   * @param {Array} items
   */
  setItemInSessionStorage = (key, items) => {
    sessionStorage.setItem(key, JSON.stringify(items));
  };
}
