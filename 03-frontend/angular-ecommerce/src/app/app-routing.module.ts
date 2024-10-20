import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component';
import { OktaCallbackComponent } from '@okta/okta-angular';

const routes: Routes = [
  {path:'login/callback', component: OktaCallbackComponent},
  {path:'login', component: LoginComponent},
  {path: 'products', component: ProductListComponent},
  {path: 'category/:id', component: ProductListComponent}, 
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'cart', component: CartDetailsComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: '**', redirectTo: '/products', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
