import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('oldPassword', { static: false }) oldPassword!: ElementRef;
  actualOldPassword: string = '';

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

  onChangeOldPassword($event: Event) {
    const input = this.oldPassword.nativeElement;
    const value = input.value;

    // Kiểm tra nếu người dùng xóa toàn bộ văn bản hoặc bôi đen và nhập lại toàn bộ
    if (value.length === 0) {
      this.actualOldPassword = '';
    } else if (Math.abs(value.length - this.actualOldPassword.length) > 1) {
      // Trường hợp này xảy ra khi người dùng chọn toàn bộ văn bản và dán nội dung mới
      this.actualOldPassword = value;
    } else if (value.length < this.actualOldPassword.length - 1 || value.length > this.actualOldPassword.length + 1) {
      // Trường hợp này xảy ra khi người dùng chọn toàn bộ văn bản và nhập lại
      this.actualOldPassword = value;
    } else if (value.length < this.actualOldPassword.length) {
      // Nếu độ dài giảm, tức là người dùng đã xóa một ký tự
      this.actualOldPassword = this.actualOldPassword.slice(0, -1);
    } else {
      // Nếu độ dài tăng, tức là người dùng đã nhập thêm một ký tự
      const newChar = value[value.length - 1]; // Ký tự mới nhất
      this.actualOldPassword += newChar;
    }

    this.changePassForm.patchValue({ oldPassword: this.actualOldPassword });

    input.value = '•'.repeat(this.actualOldPassword.length);

    // Đặt con trỏ ở cuối văn bản
    this.setCaretToEnd(input);
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
        this.actualOldPassword = ''

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

  setCaretToEnd(el: HTMLTextAreaElement) {
    el.selectionStart = el.value.length; // Đặt con trỏ ở cuối
    el.selectionEnd = el.value.length;
    el.focus();
  }
}
