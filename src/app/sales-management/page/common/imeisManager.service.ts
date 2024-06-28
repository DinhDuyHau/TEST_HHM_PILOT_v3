import { Inject, Injectable } from "@angular/core";
import { ImeiApiService } from "@app/sales-management/api/imei-api.service";

@Injectable({
  providedIn: 'root',
})
export class ImeisManagerService {
  constructor(private imeiApiService: ImeiApiService) {
  }

  addImei(imei: string) {
    let imeis = sessionStorage.getItem('imeis');
    if (!imeis) {
      sessionStorage.setItem('imeis', '');
    }
    let rs = imeis?.concat(imei, ";");
    sessionStorage.setItem('imeis', rs || '');
  }

  addToImeisInVoucher(imeis: string[]) {
    sessionStorage.setItem('imeisInVoucher', imeis.join(";"));
  }

  removeImei(imei: string) {
    let imeis = sessionStorage.getItem('imeis')
    imeis = imeis?.replace(`${imei};`, '') || '';
    sessionStorage.setItem('imeis', imeis);
  }

  clear() {
    sessionStorage.setItem('imeis', '');
    sessionStorage.setItem('imeisInVoucher', '');
  }

  resetImeisState() {
    const imeis = sessionStorage.getItem('imeis');
    if (imeis) {
      const imeisArr = imeis?.split(";");
      imeisArr.splice(imeisArr.length - 1, 1);

      if (imeisArr.length > 0) {
        this.imeiApiService.updateImeiState(imeisArr, false).subscribe((result) => {
          if (result.success) {
            this.clear();
          }
        });
      }
    }
  }

  resetImeisStateOfVoucher() {
    const imeis = sessionStorage.getItem('imeisInVoucher');
    if (imeis) {
      const imeisArr = imeis?.split(";");
      imeisArr.splice(imeisArr.length - 1, 1);

      if (imeisArr.length > 0) {
        this.imeiApiService.updateImeiState(imeisArr, true).subscribe((result) => {
          if (result.success) {
            this.clear();
          }
        });
      }
    }
  }

}


