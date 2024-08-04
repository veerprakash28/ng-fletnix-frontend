import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ShowDetailComponent } from './show-detail.component';

describe('ShowDetailComponent', () => {
  let component: ShowDetailComponent;
  let fixture: ComponentFixture<ShowDetailComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ShowDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => '1',
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowDetailComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    // Ensure no requests are pending after creation
    httpTestingController.verify();
  });

  it('should fetch show details on initialization', () => {
    const mockShow = { title: 'Test Show' };
    component.ngOnInit(); // Ensure ngOnInit is called

    const req = httpTestingController.expectOne(`${component.baseUrl}/shows/1`);
    expect(req.request.method).toEqual('GET');
    req.flush({ data: mockShow });

    expect(component.show).toEqual(mockShow);
    httpTestingController.verify(); // Ensure no additional requests
  });

  it('should display an error message if fetching show details fails', () => {
    component.ngOnInit(); // Ensure ngOnInit is called

    const req = httpTestingController.expectOne(`${component.baseUrl}/shows/1`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(component.errorMessage).toContain('Failed to load show details');
    httpTestingController.verify(); // Ensure no additional requests
  });

  it('should navigate to login page if not logged in', () => {
    spyOn(component['router'], 'navigate');
    localStorage.setItem('isLoggedIn', 'false');

    component.ngOnInit();

    expect(component['router'].navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should call loadShows and fetch other shows on successful show detail fetch', () => {
    spyOn(component, 'loadShows').and.callThrough();
    const mockShow = { show_id: 's1' };
    component.ngOnInit(); // Ensure ngOnInit is called

    const req = httpTestingController.expectOne(`${component.baseUrl}/shows/1`);
    req.flush({ data: mockShow });

    expect(component.loadShows).toHaveBeenCalled();
    httpTestingController.verify(); // Ensure no additional requests
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure no open requests
  });
});
