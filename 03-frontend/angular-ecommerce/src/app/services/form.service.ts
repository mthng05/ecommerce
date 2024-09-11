import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { HttpClient } from '@angular/common/http';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private httpClient: HttpClient) {}

  getMonth(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    for (let iMonth = startMonth; iMonth <= 12; iMonth++) {
      data.push(iMonth);
    }

    return of(data);
  }

  getYear(): Observable<number[]>{
    let data: number[] = [];
    const startYear = new Date().getFullYear();

    for (let iYear = startYear; iYear <= startYear + 10; iYear++) {
      data.push(iYear);
    }

    return of(data);
  }

  getCountries(): Observable<Country[]> {
    const url = 'http://localhost:8080/api/countries';

    return this.httpClient.get<GetResponseCountries>(url).pipe(
      map(res => res._embedded.countries)
    );
  }

  getStatesByCountryCode(countryCode?: number): Observable<State[]> {
    const baseUrl = 'http://localhost:8080/api/states';
    const url = countryCode 
              ? `${baseUrl}/search/findByCountryCode?code=${countryCode}` 
              : baseUrl;

    return this.httpClient.get<GetResponseStates>(url).pipe(
      map(res => res._embedded.states)
    );
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}
