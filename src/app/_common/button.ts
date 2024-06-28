import { Button } from '@app/_components/gridV2/grid.model';
import { Resource } from '@app/_models';
const resources: Resource[] = JSON.parse(localStorage.getItem('resources') || '[]');

const AddButton: Button = {
    id: 'Add',
    name: resources.find(x => x.name == 'btnAdd')?.message || 'Thêm',
    icon: 'circle-plus',
    buttonColor: '#005447',
    iconColor: '#fff',
    activeColor: '#fff'
};
const EditButton: Button = {
    id: 'Update',
    name: resources.find(x => x.name == 'btnEdit')?.message || 'Sửa',
    icon: 'edit',
    buttonColor: '#f3f3f3',
    iconColor: 'var(--neutrals03)',
    activeColor: 'var(--neutrals03)'
};
const DeleteButton: Button = {
    id: 'Delete',
    name: resources.find(x => x.name == 'btnDelete')?.message || 'Xóa',
    icon: 'trash-can',
    buttonColor: '#f3f3f3',
    iconColor: 'red',
    activeColor: 'red'
};
const ViewButton: Button = {
    id: 'View',
    name: resources.find(x => x.name == 'btnView')?.message || 'Xem',
    icon: 'eye',
    buttonColor: '#f3f3f3',
    iconColor: 'var(--neutrals03)',
    activeColor: 'var(--neutrals03)'
};
const RefreshButton: Button = {
    id: 'Refresh',
    name: resources.find(x => x.name == 'btnRefresh')?.message || 'Làm tươi',
    icon: 'refresh',
    buttonColor: '#3e93a6',
    iconColor: '#fff',
    activeColor: 'var(--neutrals03)'
};
const LockingColumnButton: Button = {
    id: 'LockingColumn',
    name: resources.find(x => x.name == 'btnLockingColumn')?.message || 'Khóa cột',
    icon: 'lock',
    buttonColor: 'var(--neutrals08)',
    iconColor: 'var(--neutrals03)',
    activeColor: 'var(--primary02)'
};
const ExportButton: Button = {
    id: 'Export',
    name: resources.find(x => x.name == 'btnExport')?.message || 'Kết xuất',
    icon: 'fa-file-excel',
    buttonColor: 'var(--neutrals08)',
    iconColor: 'var(--neutrals03)',
    activeColor: 'var(--primary02)'
};

const PrintButton: Button = {
    id: 'Print',
    name: resources.find(x => x.name == 'btnPrint')?.message || 'In',
    icon: 'print',
    buttonColor: '#069981',
    iconColor: '#fff',
    activeColor: '#fff'
};
const EditIMEIButton: Button = {
    id: 'EditIMEI',
    name: resources.find(x => x.name == 'btnEditIMEI')?.message || 'Sửa IMEI',
    icon: 'edit',
    buttonColor: '#f3f3f3',
    iconColor: 'blue',
    activeColor: 'blue'
};
const EditSiteButton: Button = {
    id: 'EditSiteButton',
    name: resources.find(x => x.name == 'btnEditSite')?.message || 'Sửa kho',
    icon: 'edit',
    buttonColor: '#f3f3f3',
    iconColor: 'lightblue',
    activeColor: 'lightblue'
};
const DebtButton: Button = {
    id: 'Debt',
    icon: '',
    name: resources.find(x => x.name == 'btnDebt')?.message || 'Lấy công nợ',
    buttonColor: '#005447',
    iconColor: '#fff',
    activeColor: '#fff'
};
const AllotmentButton: Button = {
    id: 'Allotment',
    name: resources.find(x => x.name == 'btnAllotment')?.message || 'Phân bổ',
    icon: '',
    buttonColor: 'white',
    iconColor: 'var(--primary_color)',
    activeColor: 'var(--primary_color)',
    class: 'border-0.5 border-solid border-primary '
};
const EditPriceButton: Button = {
    id: 'EditPrice',
    name: resources.find(x => x.name == 'btnEditPrice')?.message || 'Sửa tiền',
    icon: 'edit',
    buttonColor: '#f3f3f3',
    iconColor: 'var(--neutrals03)',
    activeColor: 'var(--neutrals03)'
};
const EditQuantityButton: Button = {
    id: 'EditPrice',
    name: resources.find(x => x.name == 'btnEditQuantity')?.message || 'Sửa tiền',
    icon: 'edit',
    buttonColor: '#f3f3f3',
    iconColor: 'var(--neutrals03)',
    activeColor: 'var(--neutrals03)'
};
const DeleteGridButton: Button = {
    id: 'DeleteGrid',
    name: resources.find(x => x.name == 'btnDeleteGrid')?.message || 'Xóa',
    icon: 'trash-can',
    buttonColor: '#f3f3f3',
    iconColor: 'red',
    activeColor: 'red'
};
const ProgramerButton: Button = {
    id: 'Programer',
    icon: '',
    name: resources.find(x => x.name == 'btnProgramer')?.message || 'Lấy hàng đặt cọc',
    buttonColor: '#005447',
    iconColor: '#fff',
    activeColor: '#fff'
};
const FilterButton: Button = {
    id: 'Filter',
    icon: 'search',
    name: resources.find(x => x.name == 'btnFilter')?.message || 'Lọc',
    buttonColor: '#005447',
    iconColor: '#fff',
    activeColor: '#fff'
};
const CameraButton: Button = {
    id: 'Camera',
    icon: 'add_a_photo',
    name: resources.find(x => x.name == 'btnCamera')?.message || '',
    buttonColor: '#005447',
    iconColor: '#fff',
    activeColor: '#fff'
};
const ViewImageButton: Button = {
    id: 'ViewImage',
    icon: 'remove_red_eye',
    name: resources.find(x => x.name == 'btnViewImage')?.message || '',
    buttonColor: '#005447',
    iconColor: '#fff',
    activeColor: '#fff'
};
export default {
    AddButton, EditButton, DeleteButton, LockingColumnButton, PrintButton, RefreshButton, ExportButton, EditIMEIButton, EditSiteButton,
    ViewButton, DebtButton, AllotmentButton, EditPriceButton, EditQuantityButton, DeleteGridButton, ProgramerButton, FilterButton, CameraButton, ViewImageButton
};