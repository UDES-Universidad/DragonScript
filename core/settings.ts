namespace SETTINGS {

    // Attributes types are: item, submenu, separator. But item is, for now,
    // the only option.

    // "standalone" or "container_bound" by defaul is embebed (Container-bound)
    export const Project_type = 'container_bound'

    export const Project_name: string = 'DragonScript Project';

    export const Menu_name: string = '';

    type menu_options_type = {
        name: string,
        fn: string,
        type: string
    };

    export const Menu_options: menu_options_type[] = [];

    export const DataBases: {} = {};

    export const Apps: {} = {};

    export const Urlpatterns: [] = [];
}
