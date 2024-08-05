import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLogin: boolean = false;

  baseUrl = environment.apiBaseUrl || 'http://localhost:3000';
  private apiUrl = `${this.baseUrl}/user/login`;

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    // Reset error message
    this.errorMessage = '';

    // Validate form input
    if (this.email.trim() === '' || this.password.trim() === '') {
      this.errorMessage = 'Please enter Credentials';
      return; // Exit if validation fails
    }

    // Set `isLogin` to true to show the loading text
    this.isLogin = true;

    // Prepare the request payload
    const bodyData = {
      email: this.email,
      password: this.password,
    };

    // Make the HTTP POST request to login
    this.http
      .post<{ status: boolean; message?: string; user?: any }>(
        this.apiUrl,
        bodyData
      )
      .subscribe(
        (resultData) => {
          if (resultData.status) {
            // Successful login
            this.isLogin = false;

            // Store user data in local storage
            localStorage.setItem('user', JSON.stringify(resultData.user));
            localStorage.setItem('isLoggedIn', 'true');

            // Navigate to the home page on successful login
            this.router.navigate(['/home']);
          } else {
            // Login failed
            this.isLogin = false;

            // Display the error message returned from the server
            this.errorMessage = resultData.message || 'Something went wrong!';
          }
        },
        (error) => {
          // Error during request
          this.isLogin = false;

          console.error('Error during login:', error);
          // Display the error message from the server or a generic message
          this.errorMessage =
            error.error?.message ||
            'An error occurred. Please try again later.';
        }
      );
  }

  onSubmit() {
    this.login();
  }
}
