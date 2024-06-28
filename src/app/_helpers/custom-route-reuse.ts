import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    DetachedRouteHandle,
    Route,
    RouteReuseStrategy,
} from '@angular/router';
import { LogoutComponent } from '@app/login';

@Injectable()
export class CustomRouteReuseStrategy extends RouteReuseStrategy {
    private pool = new WeakMap<Route, DetachedRouteHandle>();

    /**
     * STEP 1: Angular sẽ sử dụng lại component nếu như chỉ có các params thay đổi (sử dụng cài đặt mặc định của Angular)
     *      true: bỏ qua 4 hàm còn lại
     */
    public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }

    /**
     * STEP 2: return true/false => có/không lưu lại route
     *      Lưu lại các route có khai báo data: { reuse: true }
     */
    public shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return (
            route.routeConfig!.data?.['reuse'] && !this.pool.get(route.routeConfig!)
        );
    }

    /**
     * STEP 3: step2 = true -> Xử lý lưu lại component tương ứng với route, khi cần khôi phục component sẽ lấy từ đây
     */
    public store(
        route: ActivatedRouteSnapshot,
        handle: DetachedRouteHandle | null
    ) {
        this.pool.set(route.routeConfig!, handle!);
    }

    /**
     * STEP 4: Xử lý logic -> tình huống nào sẽ sử dụng lại component đã lưu
     */
    public shouldAttach(route: ActivatedRouteSnapshot): boolean {
        //log out: không sử dụng lại component
        if (route.component == LogoutComponent) {
            return false;
        }

        //sử dụng lại component khi có khai báo reuse = true tại app.routing và tham số trong localStorage useGridCached = 1
        return !!this.pool.get(route.routeConfig!) && !!localStorage.getItem('useGridCached');
    }

    /**
     * STEP 5: step 4 = true -> lấy lại component đã lưu ở step 3
     */
    public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        return this.pool.get(route.routeConfig!)!;
    }

}