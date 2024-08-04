import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule], // Import RouterModule here
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  shows: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  errorMessage: string = '';
  user: any = {}; // User data
  isLoggedIn: boolean = false;
  selectedType: string = '';

  baseUrl = environment.apiBaseUrl || 'http://localhost:3000';

  private apiUrl = `${this.baseUrl}/shows/fetchShows`;
  private searchSubject = new Subject<string>();

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    }

    this.loadShows();

    // Retrieve user data from local storage
    const storedUser = localStorage.getItem('user');
    const loggedInStatus = localStorage.getItem('isLoggedIn');

    if (storedUser && loggedInStatus === 'true') {
      this.user = JSON.parse(storedUser);
      this.isLoggedIn = true;
    }

    // Setup debouncing for search input
    this.searchSubject
      .pipe(
        debounceTime(300), // Adjust the debounce time as needed
        switchMap((search) =>
          this.fetchShows(search, this.currentPage, this.selectedType)
        )
      )
      .subscribe(
        (response: any) => {
          this.shows = response.data;
          this.currentPage = response.pagination.currentPage;
          this.totalPages = response.pagination.totalPages;
          this.errorMessage = '';
        },
        (error) => {
          console.error('Error fetching shows:', error);
          this.errorMessage = 'Failed to load shows. Please try again later.';
        }
      );
  }

  fetchShows(
    search: string,
    page: number = this.currentPage,
    type: string = ''
  ) {
    const bodyData = {
      page,
      search,
      type,
    };
    return this.http.post(this.apiUrl, bodyData);
  }

  loadShows(page: number = 1): void {
    this.fetchShows(this.searchTerm, page, this.selectedType).subscribe(
      (response: any) => {
        this.shows = response.data;
        this.currentPage = response.pagination.currentPage;
        this.totalPages = response.pagination.totalPages;
        this.errorMessage = '';
      },
      (error) => {
        console.error('Error fetching shows:', error);
        this.errorMessage = 'Failed to load shows. Please try again later.';
      }
    );
  }

  searchShows() {
    this.currentPage = 1;
    this.searchSubject.next(this.searchTerm);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadShows(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadShows(this.currentPage + 1);
    }
  }

  logout(): void {
    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');

    // Redirect to login page
    this.router.navigate(['/']);
  }
}
