import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  ngOnInit(): void {
  }

  constructor(private router: Router) { }

  handleSearchByKeyword(keyword: string) {
    console.log(`hihi: ${keyword}`);
    this.router.navigateByUrl(`/search/${keyword}`);
  }
}
