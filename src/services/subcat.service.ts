import { Category } from "../models/category.model";
import { SubCat } from "../models/subcat.model";

export class SubCatService {
    getSubCatList(catId?: string) {
        if (catId == null) {
            return SubCat.findAll({ include: Category })
        }
        return SubCat.findOne({ where: { catId }, include: Category })
    }
}