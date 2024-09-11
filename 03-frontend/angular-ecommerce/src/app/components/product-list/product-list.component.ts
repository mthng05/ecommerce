import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 0;
  currentPageNumber:number = 0;
  totalElements: number = 0;
  pageSizes: number[] = [5, 10, 15, 20, 25];
  currentPageSize: number = this.pageSizes[0];
  isDropdownChangePageSizeOpen = false;
  theKeyword: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.handleRouteParameters();
    });
  }

  handleRouteParameters() {
    this.theKeyword = this.route.snapshot.paramMap.get('keyword');

    if (this.theKeyword) {
      this.listProductsBySearchKeyword(this.theKeyword);
    } else {
      this.currentCategoryId = +(this.route.snapshot.paramMap.get('id') ?? 0);

      if (this.currentCategoryId !== 0) {
        this.listProductByCategoryID(this.currentCategoryId);
      } else {
        this.listProducts();
      }
    }
  }

  listProducts() {
    this.productService
      .getProducts()
      .subscribe((data) => (this.products = data));
  }

  listProductByCategoryID(currentCategoryId: number) {
    console.log('call a');
    this.productService
      .getProductsByCategoryIdPaginate(currentCategoryId, this.currentPageNumber - 1, this.currentPageSize)
      .subscribe(data => {
        this.products = data._embedded.products;
        this.currentPageNumber = data.page.number + 1;
        this.currentPageSize = data.page.size;
        this.totalElements = data.page.totalElements;
      });
  }

  listProductsBySearchKeyword(keyword: string) {
    console.log('call b');

    this.productService
      .handleSearchByKeywordPaginate(keyword, this.currentPageNumber - 1, this.currentPageSize)
      .subscribe(data => {
        this.products = data._embedded.products;
        this.currentPageNumber = data.page.number + 1;
        this.currentPageSize = data.page.size;
        this.totalElements = data.page.totalElements;
      });
  }

  updatePageSize(pageSize: number) {
    this.currentPageSize = pageSize;
    this.currentPageNumber = 1;
    this.isDropdownChangePageSizeOpen = false;
    this.handleRouteParameters();
  }

  toggleDropdown() {
    this.isDropdownChangePageSizeOpen = !this.isDropdownChangePageSizeOpen;
  }
}
