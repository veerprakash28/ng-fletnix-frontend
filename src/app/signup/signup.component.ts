import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  age: number = 0;
  errorMessage: string = '';

  baseUrl = environment.apiBaseUrl || 'http://localhost:3000';
  private apiUrl = `${this.baseUrl}/user/signup`;

  constructor(private http: HttpClient, private router: Router) {}

  signup() {
    if (!this.email || !this.password || this.age <= 0) {
      this.errorMessage = 'Please fill in all fields correctly.';
      return;
    }

    const bodyData = {
      email: this.email,
      password: this.password,
      age: this.age,
    };

    this.http.post(this.apiUrl, bodyData).subscribe(
      (resultData: any) => {
        if (resultData.status) {
          console.log(resultData);
          alert('User Registered Successfully.');
          this.router.navigate(['/']);
          this.errorMessage = '';
        } else {
          this.errorMessage = resultData.message || 'Something went wrong!';
        }
      },
      (error) => {
        console.error('Error registering user:', error);
        this.errorMessage =
          error.error?.message || 'An unexpected error occurred.';
      }
    );
  }

  onSubmit() {
    this.signup();
  }
}
