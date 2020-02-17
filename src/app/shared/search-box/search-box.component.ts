import {Component, Input, OnInit} from '@angular/core';
import {AppService} from '../../app.service';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {
  @Input('items') items: any[] = [];
  searchTerm: string;
  searchTermChanged: Subject<string> = new Subject<string>();

  constructor(private appService: AppService) {
    this.searchTermChanged.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      console.log(value);
      this.appService.searchValue(value);
    });
  }

  ngOnInit() {

  }

  searchValues = () => {
    this.searchTermChanged.next(this.searchTerm);
  };

}

