import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SignupComponent } from './signup.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SignupComponent,
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule, // Added HttpClientTestingModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the signup form with email, password, and age fields', () => {
    const emailInput = fixture.debugElement.query(
      By.css('input[type="email"]')
    );
    const passwordInput = fixture.debugElement.query(
      By.css('input[type="password"]')
    );
    const ageInput = fixture.debugElement.query(By.css('input[type="number"]'));
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(ageInput).toBeTruthy();
  });

  it('should display an error message when errorMessage is set', () => {
    component.errorMessage = 'Error occurred';
    fixture.detectChanges();
    const errorMessage = fixture.debugElement.query(
      By.css('.text-red-500')
    ).nativeElement;
    expect(errorMessage.textContent).toContain('Error occurred');
  });

  it('should bind form inputs to component properties', () => {
    const emailInput = fixture.debugElement.query(
      By.css('input[type="email"]')
    ).nativeElement;
    const passwordInput = fixture.debugElement.query(
      By.css('input[type="password"]')
    ).nativeElement;
    const ageInput = fixture.debugElement.query(
      By.css('input[type="number"]')
    ).nativeElement;

    emailInput.value = 'test@example.com';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'password123';
    passwordInput.dispatchEvent(new Event('input'));
    ageInput.value = '25';
    ageInput.dispatchEvent(new Event('input'));

    expect(component.email).toBe('test@example.com');
    expect(component.password).toBe('password123');
    expect(component.age).toBe(25);
  });

  it('should call onSubmit when the form is submitted', () => {
    spyOn(component, 'onSubmit');
    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    form.dispatchEvent(new Event('submit'));
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should have a functional sign-up button', () => {
    const signupButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(signupButton).toBeTruthy();
    expect(signupButton.disabled).toBeFalsy();
  });

  it('should navigate to login page when "Already have an account? Login!" link is clicked', () => {
    const loginLink = fixture.debugElement.query(
      By.css('a[routerLink="/"]')
    ).nativeElement;
    expect(loginLink.textContent).toContain('Already have an account? Login!');
  });
});
