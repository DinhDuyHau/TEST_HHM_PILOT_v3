export interface MenuItem {
    wmenu_id: string;
    wmenu_id0: string;
    menu_id: string;
    bar: string;
    bar2: string;
    link: string;
    filterMode: boolean;
    icon: string;
    sysid: string;
    extend: boolean;
    type: string;
    children: MenuItem[];
}

export interface MenuItemApi {
    message: string,
    success: boolean,
    result: MenuItem[]
}