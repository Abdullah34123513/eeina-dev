import { model, Schema } from 'mongoose';

const CategoriesSchema = new Schema({
    name: {
        en: {
            type: String
        },
        ar: {
            type: String
        }
    },
    image: {
        key: {
            type: String,
            default: 'default-image',
        },
        url: {
            type: String,
            default: '/default-category.jpg',
        },
    }
});

const Categories = model('Categories', CategoriesSchema);

export default Categories