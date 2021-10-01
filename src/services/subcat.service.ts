import { Category } from "../models/category.model";
import { SubCat } from "../models/subcat.model";

export class SubCatService {
    getSubCatList(catId?: string) {
        if (catId == null) {
            return SubCat.findAll({ include: Category })
        }
        return SubCat.findOne({ where: { catId }, include: Category })
    }

    async createSubCat(name: string, catId: string, description: string, slug: string) {
        const subcat = new SubCat({ name, catId, description, slug })

        const result = await subcat.save({ fields: ['name', 'catId', 'description', 'slug'] });

        return result
    }
}