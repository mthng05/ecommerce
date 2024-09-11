import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ProductCategory } from '../../common/product-category';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{
  product: Product | undefined;
  productCategory!: ProductCategory;

  constructor (
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.handleRouteParameters();
    });

    console.log('productCategory: ' + this.productCategory);
  }

  handleRouteParameters() {
    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      this.productService.getProductDetails(+productId)
        .subscribe((data) => {
          this.product = data;
          console.log(data);
        });
    }
  }

  handleAddToCart(product: Product | undefined) {
    console.log(`Adding to cart: ${product?.name}, ${product?.unitPrice}`);
    const cartItem = new CartItem(product?.id, product?.name, product?.imageUrl, product?.unitPrice, 1, product?.unitsInStock);
    this.cartService.addToCart(cartItem);
  }
}
