import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import {
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { ChangepassService } from './changepass.service';

@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.component.html',
  styleUrls: ['./changepass.component.scss']
})
export class ChangepassComponent implements OnInit {
  submitted = false;
  changePassForm!: FormGroup;
  loading = false;

  constructor(
    private changePassService: ChangepassService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    library: FaIconLibrary
  ) {
    library.addIcons(faAngleRight, faUser, faLock, faBuilding, faXmark, faBars);
    library.addIconPacks(fas, far);
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.changePassForm.controls;
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const username = user.username || 'Không xác định';

    this.changePassForm = this.formBuilder.group({
      username: [''],
      oldPassword: ['', Validators.required],
      newPassword: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, Validators.required],
    });

    // gán username cho input
    this.changePassForm.patchValue({ username: username });
  }

  onChangeOldPassword($event: any) {
    this.changePassForm.patchValue({ oldPassword: $event });
  }

  onChangeNewPassword($event: any) {
    this.changePassForm.patchValue({ newPassword: $event });
  }

  onChangeConfirmPassword($event: any) {
    this.changePassForm.patchValue({ confirmPassword: $event });
  }

  onSubmit() {
    this.submitted = true;

    // Kiểm tra hợp lệ form
    if (this.changePassForm.invalid) {
      return;
    }
    if (!this.validatePasswords()) {
      return;
    }

    this.loading = true;

    // call api
    const username = this.changePassForm.value.username;
    const oldPassword = this.changePassForm.value.oldPassword;
    const newPassword = this.changePassForm.value.newPassword;

    this.changePassService.changePass(username, oldPassword, newPassword).subscribe((res: any) => {
      if (!res.success) {
        this.commonService.showMessageByName(res.message ? res.message : 'change_pwd_exception ');

        this.submitted = true;
        this.loading = true;
      } else {
        // hiển thị thông báo khi thành công
        this.commonService.showMessage("Đổi mật khẩu thành công");

        // clear form khi thành công
        this.changePassForm.patchValue({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        this.submitted = false;
        this.loading = false;
      }
    });
  }

  validatePasswords(): boolean {
    return this.changePassForm.value.newPassword === this.changePassForm.value.confirmPassword &&
      this.changePassForm.value.newPassword?.length >= 6;
  }

  moveToNext(next: any, event: KeyboardEvent) {
    if (event.key === 'Enter' && next) {
      next.focus();
      return false;
    }
    return;
  }
}
