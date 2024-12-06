import { Component } from '@angular/core';
import { DashboardSales, DashboardSalesCommission, DashboardTopSelling, Result } from '@app/_models';
import { DashboardService } from '@app/_services/dashboard.service';
import { formatNumber } from '@angular/common';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loading = false;
  month = new Date().getMonth() + 1;
  itemsTopSelling: { ten_vt: string, ma_vt: string, sl_xuat: number }[] = [];
  salesData: DashboardSales | null = null;
  salesCommission: DashboardSalesCommission | null = null;
  username: any;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.loading = true;

    const userJson = localStorage.getItem('user');
    const userObj = userJson !== null && JSON.parse(userJson);
    this.username = userObj.username || '';

    this.getDashboardTopSelling();
    this.getDashboardSales();
    this.getDashboardSalesCommission();
  }

  //lấy top 5 sp
  getDashboardTopSelling() {
    this.dashboardService.getDashboardTopSelling().subscribe({
      next: (data: Result<DashboardTopSelling>) => {
        this.itemsTopSelling = data.result.items;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching dashboard data:', error);
        this.loading = false;
      }
    });
  }
  // end

  //lấy doanh thu
  getDashboardSales() {
    this.dashboardService.getDashboardSales().subscribe({
      next: (data: Result<DashboardSales>) => {
        if (data.result.items && data.result.items.length > 0) {
          this.salesData = data.result.items[0];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching dashboard data:', error);
        this.loading = false;
      }
    });
  }
  // end

  //lấy kết quả bán hàng => hoa hồng
  getDashboardSalesCommission() {
    this.dashboardService.getDashboardSalesCommission().subscribe({
      next: (data: Result<DashboardSalesCommission>) => {
        if (data.result.items && data.result.items.length > 0) {
          this.salesCommission = data.result.items[0];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching dashboard data:', error);
        this.loading = false;
      }
    });
  }
  // end

  onReload() {
    this.getDashboardTopSelling();
    this.getDashboardSales();
    this.getDashboardSalesCommission();
  }

  formatNumber(value: number | null): string {
    if (value === null || value === undefined) {
      return '0';
    }

    return value.toLocaleString('de-DE');
  }

  formatNumberPercentage(value: number | null): string {
    if (value === null || value === undefined) {
      return '0';
    }

    return value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatShortNumber(value: number): string {
    if (value === 0) return '0';

    const units = ['', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ', ' triệu tỷ', ' tỷ tỷ'];
    const unitIndex = Math.floor(Math.log10(value) / 3);
    const divisor = Math.pow(10, unitIndex * 3);

    // Lấy phần nguyên của giá trị sau khi chia, không lấy số thập phân
    const shortValue = Math.floor(value / divisor);

    return shortValue.toLocaleString('en-US') + units[unitIndex];
  }

}
