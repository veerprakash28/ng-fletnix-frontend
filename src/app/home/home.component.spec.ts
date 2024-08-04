import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, FormsModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user email and age when logged in', () => {
    component.isLoggedIn = true;
    component.user = { email: 'test@example.com', age: 25 };
    fixture.detectChanges();

    const email = fixture.debugElement.query(
      By.css('.font-semibold')
    ).nativeElement;
    const age = fixture.debugElement.query(
      By.css('.text-gray-500')
    ).nativeElement;
    expect(email.textContent).toContain('test@example.com');
    expect(age.textContent).toContain('25 years old');
  });

  it('should display NA for email and age when user details are not available', () => {
    component.isLoggedIn = true;
    component.user = { email: '', age: null };
    fixture.detectChanges();

    const email = fixture.debugElement.query(
      By.css('.font-semibold')
    ).nativeElement;
    const age = fixture.debugElement.query(
      By.css('.text-gray-500')
    ).nativeElement;
    expect(email.textContent).toContain('NA');
    expect(age.textContent).toContain('NA');
  });

  it('should display filter and search controls', () => {
    const filterControl = fixture.debugElement.query(By.css('#type'));
    const searchInput = fixture.debugElement.query(
      By.css('input[type="text"]')
    );
    expect(filterControl).toBeTruthy();
    expect(searchInput).toBeTruthy();
  });

  it('should call searchShows method when filter or search term changes', () => {
    spyOn(component, 'searchShows');

    const filterControl = fixture.debugElement.query(
      By.css('#type')
    ).nativeElement;
    filterControl.value = 'Movie';
    filterControl.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.searchShows).toHaveBeenCalled();

    const searchInput = fixture.debugElement.query(
      By.css('input[type="text"]')
    ).nativeElement;
    searchInput.value = 'Test';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.searchShows).toHaveBeenCalled();
  });

  it('should display shows when shows array is not empty', () => {
    component.shows = [
      {
        _id: '1',
        title: 'Show 1',
        type: 'Movie',
        rating: 'PG',
        description: 'Description 1',
      },
      {
        _id: '2',
        title: 'Show 2',
        type: 'TV Show',
        rating: 'R',
        description: 'Description 2',
      },
    ];
    component.isLoggedIn = true;
    component.user = { age: 20 };
    fixture.detectChanges();

    const showElements = fixture.debugElement.queryAll(
      By.css('.relative.border.p-4.rounded-md.shadow-sm')
    );
    expect(showElements.length).toBe(2);
  });

  it('should display "No shows available" when shows array is empty', () => {
    component.shows = [];
    fixture.detectChanges();

    const noShowsMessage = fixture.debugElement.query(
      By.css('.text-center.text-gray-500')
    ).nativeElement;
    expect(noShowsMessage.textContent).toContain('No shows available.');
  });

  it('should display rating badge for R rated shows', () => {
    component.shows = [
      {
        _id: '1',
        title: 'Show 1',
        type: 'Movie',
        rating: 'R',
        description: 'Description 1',
      },
    ];
    component.isLoggedIn = true;
    component.user = { age: 20 };
    fixture.detectChanges();

    const ratingBadge = fixture.debugElement.query(
      By.css('.absolute.top-2.right-2')
    ).nativeElement;
    expect(ratingBadge.textContent).toContain('R');
  });

  it('should disable interaction for R rated shows if user age is under 18', () => {
    component.shows = [
      {
        _id: '1',
        title: 'Show 1',
        type: 'Movie',
        rating: 'R',
        description: 'Description 1',
      },
    ];
    component.isLoggedIn = true;
    component.user = { age: 17 };
    fixture.detectChanges();

    const showElement = fixture.debugElement.query(
      By.css('.relative.border.p-4.rounded-md.shadow-sm')
    );
    expect(showElement.classes['pointer-events-none']).toBeTruthy();
  });

  it('should enable interaction for R rated shows if user age is 18 or above', () => {
    component.shows = [
      {
        _id: '1',
        title: 'Show 1',
        type: 'Movie',
        rating: 'R',
        description: 'Description 1',
      },
    ];
    component.isLoggedIn = true;
    component.user = { age: 18 };
    fixture.detectChanges();

    const showElement = fixture.debugElement.query(
      By.css('.relative.border.p-4.rounded-md.shadow-sm')
    );
    expect(showElement.classes['pointer-events-none']).toBeFalsy();
  });

  it('should navigate to show details if user is logged in and of age for R rated shows', () => {
    component.shows = [
      {
        _id: '1',
        title: 'Show 1',
        type: 'Movie',
        rating: 'R',
        description: 'Description 1',
      },
    ];
    component.isLoggedIn = true;
    component.user = { age: 18 };
    fixture.detectChanges();

    const showLink = fixture.debugElement.query(
      By.css('a[routerLink="/show/1"]')
    );
    expect(showLink).toBeTruthy();
  });

  it('should display pagination controls when there are shows', () => {
    component.shows = [
      {
        _id: '1',
        title: 'Show 1',
        type: 'Movie',
        rating: 'PG',
        description: 'Description 1',
      },
    ];
    component.currentPage = 1;
    component.totalPages = 5;
    fixture.detectChanges();

    const prevButton = fixture.debugElement.query(By.css('button[disabled]'));
    const nextButton = fixture.debugElement.query(
      By.css('button:not([disabled])')
    );
    const pageInfo = fixture.debugElement.query(By.css('span.text-lg'));

    expect(prevButton).toBeTruthy();
    expect(nextButton).toBeTruthy();
    expect(pageInfo.nativeElement.textContent).toContain('Page 1 of 5');
  });
});
