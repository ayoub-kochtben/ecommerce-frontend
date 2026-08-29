import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth/auth';

@Component({
  selector: 'app-signup',
  standalone: true,

  imports: [
    ReactiveFormsModule,CommonModule  ],

  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {

  signupForm!: FormGroup;

  hidePassword = true;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}


  ngOnInit(): void {

    this.signupForm = this.fb.group({

      name: [
        null,
        [Validators.required]
      ],

      email: [
        null,
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        null,
        [Validators.required]
      ],

      confirmPassword: [
        null,
        [Validators.required]
      ]

    });

  }


  togglePasswordVisibility(): void {

    this.hidePassword = !this.hidePassword;

  }


  onSubmit(): void {

    const password =
      this.signupForm.get('password')?.value;

    const confirmPassword =
      this.signupForm.get('confirmPassword')?.value;


    // Vérifier les deux mots de passe
    if (password !== confirmPassword) {

      alert('Passwords do not match.');

      return;
    }


    // Envoyer les données au backend
    this.authService
      .register(this.signupForm.value)
      .subscribe({

        next: (response) => {

          alert('Sign up successful!');

          this.router.navigateByUrl('/login');

        },

        error: (error) => {

          alert('Sign up failed. Please try again.');

        }

      });

  }

}