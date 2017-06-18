import { Component, OnInit } from '@angular/core';
import { Customer } from './customer';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

import 'rxjs/add/operator/debounceTime';

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
    emailMessage: string;

    private validationMesages = {
        required: 'Please enter your email address.',
        pattern: 'Please enter a valid email address.'
    };

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
            sendCatalog: true,
            addresses: this.fb.group({
                addressType: 'home',
                street1: '',
                street2: '',
                city: '',
                state: '',
                zip: ''
            })
        });

        this.customerForm.get('notification').valueChanges
                         .subscribe(value => this.setNotification(value));

        const emailControl = this.customerForm.get('emailGroup.email');
        emailControl.valueChanges.debounceTime(1000).subscribe(value => this.setMessage(emailControl));
    }

    setMessage(c: AbstractControl): void {
        this.emailMessage = '';
        if ((c.touched || c.dirty) && c.errors) {
            this.emailMessage = Object.keys(c.errors).map(key => this.validationMesages[key]).join(' ');
        }
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
