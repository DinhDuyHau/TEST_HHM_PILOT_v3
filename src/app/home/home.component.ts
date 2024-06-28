import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    loading = false;
    users?: User[];
    month = new Date().getMonth() + 1;
    public customer = '';
    constructor(private userService: UserService) { }

    ngOnInit() {
        this.loading = true;
    }
}