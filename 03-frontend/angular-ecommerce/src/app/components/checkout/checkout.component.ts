import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormService } from '../../services/form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { EcommerceValidators } from '../../validators/ecommerce-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;

  cartTypes: { value: string }[] = [
    { value: 'type 1' },
    { value: 'type 2' },
    { value: 'type 3' },
  ];
  countries: Country[] = [];
  statesInShippingAddress: State[] = [];
  statesInBillingAddress: State[] = [];
  months: number[] = [];
  years: number[] = [];
  totalQuantity: number = 0;
  totalPrice: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private formService: FormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          EcommerceValidators.notOnlyWhiteSpace,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          EcommerceValidators.notOnlyWhiteSpace,
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[\\w\\-\\.]+@([\\w\\-]+\\.)+[\\w\\-]{2,4}$'),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required, EcommerceValidators.notOnlyWhiteSpace]),
        street: new FormControl('', [Validators.required, EcommerceValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        zipcode: new FormControl('', [Validators.required, EcommerceValidators.notOnlyWhiteSpace]),
      }),
      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required, EcommerceValidators.notOnlyWhiteSpace]),
        street: new FormControl('', [Validators.required, EcommerceValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        zipcode: new FormControl('', [Validators.required, EcommerceValidators.notOnlyWhiteSpace]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        cardName: new FormControl('', [Validators.required, EcommerceValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.pattern('[0-9]{3}')]),
        expMonth: [this.months[0]],
        expYear: [this.years[0]],
      }),
    });

    const startMonth = new Date().getMonth() + 1;
    this.formService
      .getMonth(startMonth)
      .subscribe((data) => (this.months = data));
    this.formService.getYear().subscribe((data) => (this.years = data));
    this.formService.getCountries().subscribe((data) => {
      this.countries = data;
      this.checkoutFormGroup
        .get('shippingAddress.country')
        ?.setValue(this.countries[0]);
      this.checkoutFormGroup
        .get('billingAddress.country')
        ?.setValue(this.countries[0]);
      this.handleStatesByCountryCode('shippingAddress');
      this.handleStatesByCountryCode('billingAddress');
    });
    this.formService.getStatesByCountryCode().subscribe((data) => {
      this.statesInShippingAddress = data;
      this.statesInBillingAddress = data;
    });

    this.reviewCartDetails();
  }

  reviewCartDetails() {
    this.cartService.totalPrice.subscribe((data) => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe((data) => this.totalQuantity = data);
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddresStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddresState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddresZipcode() { return this.checkoutFormGroup.get('shippingAddress.zipcode'); }

  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipcode() { return this.checkoutFormGroup.get('billingAddress.zipcode'); }

  get cardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get cardName() { return this.checkoutFormGroup.get('creditCard.cardName'); }
  get cardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get cardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
   
    // set up order
    let order = new Order(this.totalQuantity, this.totalPrice);

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(item => new OrderItem(item));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase with customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase with shippingAddress
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase with billingAddress
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purchase with order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call  rest api via the checkout service
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: res => {
          alert(`Your order has been receive. Order tracking number: ${res.orderTrackingNumber}`);

          //reset a cart
          this.resetCart();
        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    )
  }

  resetCart() {
    // reset cart data
    this.cartService.clearCartItem();

    // reset form 
    this.checkoutFormGroup.reset();

    //navigate to products
    this.router.navigateByUrl("/products");
  }

  handleMonthAndYear() {
    const creditCard = this.checkoutFormGroup.get('creditCard');
    const currentYear = new Date().getFullYear();
    let startMonth: number = 1;

    if (creditCard?.value.expYear == currentYear) {
      startMonth = new Date().getMonth() + 1;
    }

    this.formService
      .getMonth(startMonth)
      .subscribe((data) => (this.months = data));
  }

  handleStatesByCountryCode(formGroupName: string) {
    const checkoutForm = this.checkoutFormGroup.get(formGroupName);
    const countrySelected = checkoutForm?.value.country?.code;
  
    if (countrySelected) {
      this.formService.getStatesByCountryCode(countrySelected).subscribe((data) => {
        if (formGroupName === 'shippingAddress') {
          this.statesInShippingAddress = data;
          this.checkoutFormGroup.get(`${formGroupName}.state`)?.setValue(this.statesInShippingAddress[0]);
        } else if (formGroupName === 'billingAddress') {
          this.statesInBillingAddress = data;
          this.checkoutFormGroup.get(`${formGroupName}.state`)?.setValue(this.statesInBillingAddress[0]);
        }
      });
    }
  }

  onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      const shippingAddress = this.checkoutFormGroup.get('shippingAddress');
      const billingAddress = this.checkoutFormGroup.get('billingAddress');

      if (shippingAddress && billingAddress) {
        billingAddress.patchValue(shippingAddress.value);
        this.statesInBillingAddress = this.statesInShippingAddress;
      }
    } else {
      this.checkoutFormGroup.get('billingAddress')?.reset();
      this.statesInBillingAddress = [];
    }
  }
}
