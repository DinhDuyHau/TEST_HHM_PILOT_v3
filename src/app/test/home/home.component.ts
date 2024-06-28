import { Component } from '@angular/core';
import { ScannerService } from '../service/scanner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class Home2Component {

  constructor(public scanner: ScannerService) {
  }

}
