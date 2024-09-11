import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productUrl = 'http://localhost:8080/api/products';
  private productCategoryUrl = 'http://localhost:8080/api/product-category';
  // private productSearchByKeywordUrl = 'http://localhost:8080/api/products/search/findByNameContaining?name=';

  constructor(private httpClient: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(this.productUrl).pipe(
      map(res => res._embedded.products)
    );
  }

  getProductsByCategoryIdPaginate(
    categoryId: number, pageNumber: number, pageSize: number
  ): Observable<GetResponseProducts> {
    const productByCategoryIdUrl = `http://localhost:8080/api/products/search/findByCategoryId?id=${categoryId}&page=${pageNumber}&size=${pageSize}`;
   
    return this.httpClient.get<GetResponseProducts>(productByCategoryIdUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategories>(this.productCategoryUrl).pipe(
      map(res => res._embedded.productCategory)
    );
  }

  handleSearchByKeywordPaginate(
    keyword: string, pageNumber: number, pageSize: number
  ): Observable<GetResponseProducts> {
    const productSearchByKeywordUrl = `http://localhost:8080/api/products/search/findByNameContaining?name=${keyword}&page=${pageNumber}&size=${pageSize}`;
    
    return this.httpClient.get<GetResponseProducts>(productSearchByKeywordUrl);
  }

  getProductDetails(id: number) {
    return this.httpClient.get<Product>(`${this.productUrl}/${id}`);
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[]
  }, 
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategories {
  _embedded: {
    productCategory: ProductCategory[];
  }
}