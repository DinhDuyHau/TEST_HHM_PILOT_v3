import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '@environments/environment';
import * as forge from 'node-forge';
import { CryptoService } from '@app/_utils';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChangepassService {

  constructor(
    private http: HttpClient,
    private cryptoService: CryptoService
  ) {

  }

  changePass(username: string, oldPassword: string, newPassword: string) {
    //mã hóa mật khẩu sử dụng public key của người nhận
    const rsa_receiver = forge.pki.publicKeyFromPem(environment.receiverPublicKey);
    // old pass
    const old_pass_enc = rsa_receiver.encrypt(oldPassword);
    const encryptedOldPassword: string = window.btoa(old_pass_enc);
    // new pass
    const new_pass_enc = rsa_receiver.encrypt(newPassword);
    const encryptedNewPassword: string = window.btoa(new_pass_enc);

    //ký dữ liệu đã mã hóa bằng private key của người gửi
    const sender_privateKey = forge.pki.privateKeyFromPem(environment.senderPrivateKey);
    // old pass
    const hash_for_sign_old_pass = this.cryptoService.hashMD5(encryptedOldPassword);
    const mdOldPass = forge.md.sha1.create();
    mdOldPass.update(hash_for_sign_old_pass, 'utf8');
    const data_signed_oldPass = sender_privateKey.sign(mdOldPass);
    const signature_oldPass: string = window.btoa(data_signed_oldPass);
    // new pass
    const hash_for_sign_new_pass = this.cryptoService.hashMD5(encryptedNewPassword);
    const mdNewPass = forge.md.sha1.create();
    mdNewPass.update(hash_for_sign_new_pass, 'utf8');
    const data_signed_newPass = sender_privateKey.sign(mdNewPass);
    const signature_newPass: string = window.btoa(data_signed_newPass);

    return this.http.post<any>(`${environment.apiUrl}/users/changepwd`, {
      Username: username,
      OldPassword: encryptedOldPassword,
      OldPwdSign: signature_oldPass,
      NewPassword: encryptedNewPassword,
      NewPwdSign: signature_newPass
    }, { withCredentials: true })
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: any) => {
          return of({ success: false, message: error });
        })
      );
  }
}
