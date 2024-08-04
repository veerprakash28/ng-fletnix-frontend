import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-show-detail',
  templateUrl: './show-detail.component.html',
  styleUrls: ['./show-detail.component.css'],
})
export class ShowDetailComponent implements OnInit {
  baseUrl = environment.apiBaseUrl || 'http://localhost:3000';

  show: any = null;
  errorMessage: string = '';
  private apiUrl = `${this.baseUrl}/shows`;
  private fetchShowsURL = `${this.baseUrl}/shows/fetchShows`;
  isLoggedIn: boolean = false;
  user: any = {}; // User data
  shows: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

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

    // Subscribe to route changes to fetch new show details
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.fetchShowDetails(id);
      }
    });
  }

  fetchShowDetails(id: string) {
    this.http.get(`${this.apiUrl}/${id}`).subscribe(
      (response: any) => {
        this.show = response.data;
        this.loadShows(); // Load other shows once the show details are fetched
        this.errorMessage = '';
      },
      (error) => {
        console.error('Error fetching show details:', error);
        this.errorMessage =
          'Failed to load show details. Please try again later.';
      }
    );
  }

  logout(): void {
    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');

    // Redirect to login page
    this.router.navigate(['/']);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  fetchShows(page: number) {
    const bodyData = {
      page: page,
      limit: 4,
    };
    return this.http.post(this.fetchShowsURL, bodyData);
  }

  loadShows(): void {
    if (this.show && this.show.show_id) {
      const showIdNumber = parseInt(this.show.show_id.replace('s', ''), 10);
      this.fetchShows(showIdNumber).subscribe(
        (response: any) => {
          this.shows = response.data;
          this.errorMessage = '';
        },
        (error) => {
          console.error('Error fetching shows:', error);
          this.errorMessage = 'Failed to load shows. Please try again later.';
        }
      );
    }
  }
}
