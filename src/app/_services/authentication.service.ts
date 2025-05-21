import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import * as forge from 'node-forge';
import { CryptoService } from '@app/_utils';
import { Shift, Shop, Unit, User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<User | null>;
    private shiftSubject: BehaviorSubject<Shift[] | null>;
    public user: Observable<User | null>;
    public shift: Observable<Shift[] | null>;
    public refreshTokenRequest: any = null;

    constructor(
        private router: Router,
        private http: HttpClient,
        private cryptoService: CryptoService
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.shiftSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('shift')!));
        this.user = this.userSubject.asObservable();
        this.shift = this.shiftSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    public get shiftValue() {
        return this.shiftSubject.value;
    }

    login(username: string, password: string, unit: string, shop: string, shift: string, abandon_tran: boolean) {
        //mã hóa mật khẩu sử dụng public key của người nhận
        const rsa_receiver = forge.pki.publicKeyFromPem(environment.receiverPublicKey);
        const pass_enc = rsa_receiver.encrypt(password);
        const encryptedPassword: string = window.btoa(pass_enc);

        //ký dữ liệu đã mã hóa bằng private key của người gửi
        const hash_for_sign = this.cryptoService.hashMD5(encryptedPassword);
        const sender_privateKey = forge.pki.privateKeyFromPem(environment.senderPrivateKey);
        const md = forge.md.sha1.create();
        md.update(hash_for_sign, 'utf8');
        const data_signed = sender_privateKey.sign(md);
        const signature: string = window.btoa(data_signed);

        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, {
            username: username,
            password: encryptedPassword,
            signature: signature,
            unit: unit,
            shop: shop,
            shift: shift,
            isLogoutLastTran: abandon_tran
        }, { withCredentials: true })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                this.startRefreshTokenTimer();
                return user;
            }));
    }

    logout() {
        if (!this.userValue) return;
        const apiUri = `${environment.apiUrl}/users/signout`;
        const params = new HttpParams()
            .set('user_name', this.userValue.username!);
        this.http.get<any>(apiUri, { params: params, withCredentials: true })
            .pipe(
                catchError((error: any) => {
                    // xử lý lỗi ở đây
                    return of({ success: false, message: error });
                }),
                map((res) => {
                    return res;
                }))
            .subscribe({
                next: () => {
                    localStorage.removeItem('menu');
                    localStorage.removeItem('user');
                    localStorage.removeItem('useGridCached');
                    this.userSubject.next(null);
                    this.stopRefreshTokenTimer();
                    // this.router.navigate(['/login']);
                    window.location.href = '/login';
                },
                error: (error) => {
                    localStorage.removeItem('menu');
                    localStorage.removeItem('user');
                    localStorage.removeItem('useGridCached');
                    this.stopRefreshTokenTimer();
                    // this.router.navigate(['/login']);
                    window.location.href = '/login';
                }
            });
        return;
    }

    refreshToken() {
        return this.http.post<any>(`${environment.apiUrl}/users/refresh-token`, {}, { withCredentials: true })
            .pipe(map((user) => {
                this.userSubject.next(user);
                this.startRefreshTokenTimer();
                return user;
            }));
    }

    getUnitRightOfUser(username: string) {
        const apiUri = `${environment.apiUrl}/users/user-right-units`;
        const params = new HttpParams()
            .set('userName', username);
        return this.http.get<Unit[]>(apiUri, { params });
    }

    getShopRightOfUser(username: string, unit: string) {
        const apiUri = `${environment.apiUrl}/users/user-right-shops`;
        const params = new HttpParams()
            .set('userName', username)
            .set('unit', unit);
        return this.http.get<Shop[]>(apiUri, { params });
    }

    getAllShopRightByUser(username: string) {
        const apiUri = `${environment.apiUrl}/users/all-shops-right`;
        const params = new HttpParams()
            .set('userName', username);
        return this.http.get<Shop[]>(apiUri, { params });
    }

    getShiftList() {
        const apiUri = `${environment.apiUrl}/users/shift`;
        return this.http.get<Shift[]>(apiUri).pipe(map(res => {
            localStorage.setItem('shift', JSON.stringify(res));
            return res;
        }));
    }

    // helper methods

    private refreshTokenTimeout?: NodeJS.Timeout;

    private startRefreshTokenTimer() {
        // parse json object from base64 encoded jwt token
        const jwtBase64 = this.userValue!.token!.split('.')[1];
        const jwtToken = JSON.parse(atob(jwtBase64));

        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }

}
