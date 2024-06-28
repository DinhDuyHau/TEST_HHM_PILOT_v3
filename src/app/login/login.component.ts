import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import {
  faAngleRight,
  faUser,
  faLock,
  faBuilding,
  faXmark,
  faBars,
} from '@fortawesome/free-solid-svg-icons';

import { AuthenticationService, LoadingService, NotificationService } from '@app/_services';
import { Shift, Shop, Unit } from '@app/_models';
import { MessagingService } from '@app/_services/message.service';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  isLogin = false;
  progressValue = 0;
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  showTranCancel = false;
  error = '';
  overlay = false;
  unit_data: { value: string; label: string; selected: boolean }[] = [
    { value: '', label: 'Đơn vị', selected: true },
  ];
  shop_data: { value: string; label: string; selected: boolean }[] = [
    { value: '', label: 'Cửa hàng', selected: true },
  ];
  shift_data: { value: string; label: string; selected: boolean }[] = [
    { value: '', label: 'Ca bán hàng', selected: true },
  ];

  @ViewChild('txtUser') txtUser!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private loadingService: LoadingService,
    private titleService: Title,
    private messagingService: MessagingService,
    private notificationService: NotificationService,
    library: FaIconLibrary
  ) {
    this.titleService.setTitle('Đăng nhập');
    library.addIcons(faAngleRight, faUser, faLock, faBuilding, faXmark, faBars);
    library.addIconPacks(fas, far);
    // redirect to home if already logged in
    if (this.authenticationService.userValue) {
      this.router.navigate(['/']);
    }

  }

  ngAfterViewInit(): void {
    this.txtUser.nativeElement.focus();
  }


  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      unit: [null, Validators.required],
      shop: [null, Validators.required],
      shift: [null, Validators.required],
    });
    this.f['unit'].setValue(this.unit_data[0].value);
    this.f['shop'].setValue(this.shop_data[0].value);
    this.f['shift'].setValue(this.shift_data[0].value);
    this.getAllShift();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  moveToNext(next: any, event: KeyboardEvent) {
    if (event.key === 'Enter' && next) {
      next.focus();
      return false;
    }
    return;
  }

  changeUser(user_name: string) {
    if (!user_name || user_name === '') return;
    this.authenticationService
      .getUnitRightOfUser(user_name)
      .pipe(first())
      .subscribe({
        next: (x: Unit[]) => {
          if (x && x.length > 0) {
            this.unit_data = [];
            for (const item of x) {
              this.unit_data.push({
                value: item.ma_dvcs!,
                label: item.ten_dvcs!,
                selected: false,
              });
            }
            this.f['unit'].setValue(this.unit_data[0].value);
            this.getShopInfo(this.f['username'].value, this.f['unit'].value);
            // this.getAllShift();
          }
        },
        error: (err: any) => {
          this.convertToErrorMessage(err);
        },
      });
  }
  changeUnit(user_name: string, unit: string) {
    if (!user_name || user_name === '' || !unit || unit === '') return;
    this.getShopInfo(user_name, unit);
  }

  getShopInfo(user_name: string, unit: string) {
    this.shop_data = [];
    if (!user_name || user_name === '' || !unit || unit === '') return;
    this.authenticationService
      .getShopRightOfUser(user_name, unit)
      .pipe(first())
      .subscribe({
        next: (x: Shop[]) => {
          if (x && x.length > 0) {
            for (const item of x) {
              this.shop_data.push({
                value: item.ma_cuahang!,
                label: item.ten_cuahang!,
                selected: false,
              });
            }
            this.f['shop'].setValue(this.shop_data[0].value);
          }
        },
        error: (err: any) => {
          this.convertToErrorMessage(err);
        },
      });
  }

  getAllShift() {
    this.authenticationService
      .getShiftList()
      .pipe(first())
      .subscribe({
        next: (x: Shift[]) => {
          this.shift_data = [];
          if (x && x.length > 0) {
            for (const item of x) {
              this.shift_data.push({
                value: item.ma_ca!,
                label: item.ten_ca!,
                selected: false,
              });
            }
            this.f['shift'].setValue(this.shift_data[0].value);
          }
        },
        error: (err: any) => {
          this.convertToErrorMessage(err);
        },
      });
  }

  convertToErrorMessage(err: any) {
    if (err === 'Input_data_invalid') this.error = 'Dữ liệu nhập không hợp lệ';
    if (err === 'invalid_user_password') this.error = 'Sai tên đăng nhập hoặc mật khẩu';
    if (err === 'Runtime_err')
      this.error = 'Có sự cố khi thực hiện, vui lòng thử lại';

    if (err === 'Transaction_in_use') {
      this.error = 'Đã đăng nhập.';
      this.showTranCancel = true;
    }
  }

  onSubmit(txtUser: HTMLInputElement, abandon_tran = false) {
    this.submitted = true;
    this.showTranCancel = false;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      txtUser.focus();
      return;
    }

    this.error = '';
    this.loading = true;
    this.authenticationService
      .login(
        this.f['username'].value,
        this.f['password'].value,
        this.f['unit'].value,
        this.f['shop'].value,
        this.f['shift'].value,
        abandon_tran
      )
      .pipe(first())
      .subscribe({
        next: async () => {
          this.loading = false;
          // get return url from route parameters or default to '/'
          this.isLogin = true;
          const myInterval = setInterval(() => {
            if (this.progressValue < 75) {
              this.progressValue = this.progressValue + Math.ceil(Math.random() * 3);
            }
            else if (this.progressValue < 99) {
              this.progressValue = this.progressValue + Math.floor(Math.random() * 3);
            }
            else { clearInterval(myInterval); }
          }, 200);

          this.loadingService.Loading().subscribe({
            next: (results: any[]) => {
              this.progressValue = 100;
              clearInterval(myInterval);
              setTimeout(() => {
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                this.router.navigate([returnUrl]);
              }, 200);
            },
            error: (error) => {
              clearInterval(myInterval);
              console.error('An error occurred while loading resources', error);
              this.isLogin = false;
            }
          });
          this.messagingService.requestPermission((token: string) => {
            this.notificationService.updateToken(token);
          });
          // const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          // this.router.navigate([returnUrl]);
        },
        error: error => {
          this.convertToErrorMessage(error);
          this.loading = false;
        },
      });
  }
}
