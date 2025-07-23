import ColorChip from "~/components/cells/ColorChip.vue";
import ColorPicker from "~/components/form-fields/ColorPicker.vue";
import { Entity, primaryKey, descriptor } from '~/utils/entity-system';
import {
    string,
    boolean,
} from '~/utils/ui-metadata';

@Entity({name: 'Product'})
export default class Product {
    @primaryKey()
    id: number;

    @descriptor()
    @string({name: 'Product Name'})
    name: string;

    @number({name: 'Price', min: 0, max: 9999})
    price: number;

    @boolean({name: 'In Stock'})
    inStock: boolean;

    @custom({
        name: 'Label Color',
        formComponent: markRaw(ColorPicker),
        cellComponent: markRaw(ColorChip),
    })
    labelColor: string;

    constructor(id = 0, name = '', price = 0, inStock = false, labelColor = '#ff0000') {
        this.id = id;
        this.name = name;
        this.price = price;
        this.inStock = inStock;
        this.labelColor = '#ff0000';
    }
}

export const productSampleData = [
    new Product(1, 'Quantum Widget', 29.99, true),
    new Product(2, 'Hyper-Drive Gadget', 59.95, false),
    new Product(3, 'Nano-Sprocket', 9.50, true),
    new Product(4, 'Flux Capacitor XL', 1299.99, true),
    new Product(5, 'Omega Toolkit', 149.00, false),
    new Product(6, 'Giga-Wrench', 75.50, true),
    new Product(7, 'Micro-Converter', 22.45, true),
    new Product(8, 'Turbo Encabulator', 89.99, false),
    new Product(9, 'Photon Phaser', 199.95, true),
    new Product(10, 'Cryo-Canister', 45.00, true),
    new Product(11, 'Plasma Injector', 110.75, false),
    new Product(12, 'Singularity Sensor', 350.00, true),
    new Product(13, 'Gravity Anchor', 250.25, true),
    new Product(14, 'Warp Coil', 78.99, false),
    new Product(15, 'Subspace Scanner', 499.99, true),
];
