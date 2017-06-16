import { Component, OnInit } from '@angular/core';
import { Customer } from './customer';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

function ratingRange(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): {[key: string]: boolean} | null => {
        if (c.value && isNaN(c.value) || c.value < min || c.value > max) {
            return { 'range': true };
        }
        return null;
    };
};

function emailMatcher(c: AbstractControl): {[key: string]: boolean} | null  {
        const emailControl = c.get('email');
        const confirmControl = c.get('confirmEmail');
        if (emailControl.pristine || confirmControl.pristine) {
            return null;
        }
        if (emailControl.value === confirmControl.value) {
            return null;
        }
        return { 'match': true };
};


@Component({
    selector: 'my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit {
    customerForm: FormGroup;
    customer: Customer= new Customer();

    constructor(private fb: FormBuilder) {

    }

    ngOnInit(): void {
        this.customerForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(3)] ],
            lastName: ['', [Validators.required, Validators.maxLength(50)] ],
            emailGroup: this.fb.group({
                email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
                confirmEmail: ['', [Validators.required]],
            }, { validator: emailMatcher }),
            phone: '',
            rating: ['', ratingRange(1, 5)],
            notification: 'email',
            sendCatalog: true
        });
    }

    save() {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm.value));
    }

    setNotification(notifyVia: string): void {
        const phoneControl = this.customerForm.get('phone');
        notifyVia === 'text' ? phoneControl.setValidators(Validators.required) : phoneControl.clearValidators();
        phoneControl.updateValueAndValidity();

    }
 }
