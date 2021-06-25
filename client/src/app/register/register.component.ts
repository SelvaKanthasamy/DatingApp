import { AccountService } from './../_services/account.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // @Input() usersFromHomeComponent: any;
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup;
  maxDate: Date;
  validationErrors: string[] = [];
  // model: any = {};


  constructor(private accountService: AccountService, private toastr: ToastrService,
    private fb: FormBuilder,private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)
      ,Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
      gender: ['male'],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    })
    this.registerForm.controls.password.valueChanges.subscribe(() =>{
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  // initializeForm(){
  //   this.registerForm = new FormGroup({
  //     username: new FormControl('', Validators.required),
  //     password: new FormControl('', [Validators.required, Validators.minLength(4)
  //     ,Validators.maxLength(8)]),
  //     confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')])
  //   })
  //   this.registerForm.controls.password.valueChanges.subscribe(() =>{
  //     this.registerForm.controls.confirmPassword.updateValueAndValidity();
  //   })
  // }

  matchValues(matchTo: string): ValidatorFn{
    return(control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value 
      ? null : {isMatching: true}
    }
  }

  register(){
    console.log(this.registerForm.value);
   this.accountService.register(this.registerForm.value).subscribe(response => {     
     this.router.navigateByUrl('/members')     
     },error => {       
       this.validationErrors = error;
     })
  }

  cancel(){
    this.cancelRegister.emit(false);
  }

}
