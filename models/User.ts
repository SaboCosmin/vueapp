import { string } from "~/utils/form-fields/string.decorator";
import { select } from "~/utils/form-fields/select.decorator";
import { boolean } from "~/utils/form-fields/boolean.decorator";
import { Entity } from "~/utils/entity.decorator";

import * as yup from 'yup';
import { hasOne } from "~/utils/form-fields/hasOne.decorator";
import { hasMany } from "~/utils/form-fields/hasMany.decorator";
import Product from "~/models/Product";
import { descriptor, primaryKey } from "~/utils/entity-system";
import { disabled } from "~/utils/disabled.decorator";

@Entity({name: 'User'})
export default class User {
    @primaryKey()
    id: number;

    @descriptor()
    @string({
        name: 'Full Name',
        required: true,
    })
    name: string;

    @string({
        name: 'Email Address', required: true, validation: yup.string().email('Must be a valid email')
    })
    email: string;

    @select({name: 'User Role', options: ['Admin', 'Editor', 'Guest']})
    role: string;

    @boolean({name: 'Is Active'})
    isActive: boolean;

    @clear((formData) => formData.isActive === false)
    @disabled((formData) => formData.isActive === false)
    @hasOne({name: 'Product', type: () => Product, descriptor: 'name'})
    product: Product | null;

    @clear((formData) => formData.isActive === false)
    @disabled((formData) => formData.isActive === false)
    @hasMany({name: 'Products', type: () => Product, descriptor: 'name'})
    products: Product[];

    constructor(id: number = 0, name: string = '', email: string = '', role: string = 'Guest', isActive: boolean = false, product: Product | null = null, products: Product[] = []) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.isActive = isActive;
        this.product = product;
        this.products = products;
    }
}

export const userSampleData = [
    new User(1, 'Eleanor Vance', 'eleanor@example.com', 'Admin', true, new Product(2, 'Hyper-Drive Gadget', 59.95, false)),
    new User(2, 'Marcus Thorne', 'marcus@example.com', 'Editor', false),
    new User(3, 'Clara Oswald', 'clara@example.com', 'Guest', true),
    new User(4, 'Julian Chase', 'julian@example.com', 'Admin', true),
    new User(5, 'Seraphina Moon', 'seraphina@example.com', 'Editor', true),
    new User(6, 'Leo Gallagher', 'leo@example.com', 'Guest', false),
    new User(7, 'Aurora Chen', 'aurora@example.com', 'Admin', false),
    new User(8, 'Silas Blackwood', 'silas@example.com', 'Editor', true),
    new User(9, 'Penelope Cruz', 'penelope@example.com', 'Guest', true),
    new User(10, 'Ronan Petrova', 'ronan@example.com', 'Admin', true),
    new User(11, 'Isla Navarro', 'isla@example.com', 'Editor', false),
    new User(12, 'Jasper Knight', 'jasper@example.com', 'Guest', true),
    new User(13, 'Faye Valentine', 'faye@example.com', 'Admin', true),
    new User(14, 'Orion Pax', 'orion@example.com', 'Editor', true),
    new User(15, 'Willow Rosenberg', 'willow@example.com', 'Guest', false),
];
