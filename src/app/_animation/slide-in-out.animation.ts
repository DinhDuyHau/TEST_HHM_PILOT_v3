import { trigger, state, style, transition, animate } from '@angular/animations';

export const slideInOutAnimation = trigger('slideInOutAnimation', [
    state('in', style({
        transform: 'translateX(0)', // Phần tử ở vị trí ban đầu (trái)
    })),
    state('out', style({
        transform: 'translateX(-100%)', // Phần tử ở vị trí bên phải (ẩn)
    })),
    transition('in => out', [
        animate('500ms ease-out', style({
            transform: 'translateX(-100%)', // Thực hiện animation từ trái sang phải
        })),
    ]),
    transition('out => in', [
        animate('500ms ease-in', style({
            transform: 'translateX(0)', // Thực hiện animation từ phải sang trái
        })),
    ]),
]);