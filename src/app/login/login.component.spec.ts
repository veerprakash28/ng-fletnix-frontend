import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Login');
  });

  it('should have email and password inputs', () => {
    const emailInput = fixture.debugElement.query(
      By.css('input[type="email"]')
    );
    const passwordInput = fixture.debugElement.query(
      By.css('input[type="password"]')
    );
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
  });

  it('should bind email and password to the component', async () => {
    const emailInput = fixture.debugElement.query(
      By.css('input[type="email"]')
    ).nativeElement;
    const passwordInput = fixture.debugElement.query(
      By.css('input[type="password"]')
    ).nativeElement;

    emailInput.value = 'test@example.com';
    passwordInput.value = 'password123';

    emailInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));

    fixture.whenStable().then(() => {
      expect(component.email).toBe('test@example.com');
      expect(component.password).toBe('password123');
    });
  });

  it('should display error message when errorMessage is set', () => {
    component.errorMessage = 'Invalid login credentials';
    fixture.detectChanges();

    const errorMessage = fixture.debugElement.query(
      By.css('.text-red-500')
    ).nativeElement;
    expect(errorMessage.textContent).toContain('Invalid login credentials');
  });

  it('should call onSubmit when form is submitted', () => {
    spyOn(component, 'onSubmit');
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should have a link to signup page', () => {
    const signupLink = fixture.debugElement.query(
      By.css('a[routerLink="/signup"]')
    );
    expect(signupLink).toBeTruthy();
    expect(signupLink.nativeElement.textContent).toContain(
      "Don't have an account? Sign up here."
    );
  });
});
