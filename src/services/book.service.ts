import { SubCat } from '../models/subcat.model';
import { Book } from '../models/book.model';

export class BookService {
    async getBookList(id?: string) {
        if (!id) {
            return await Book.findAll({ include: SubCat })
        }
        return await Book.findAll({ include: SubCat, where: { id } })
    }

    async createBook(model: {
        name: string,
        subCatId: string,

    }) {
        const book = new Book(model)

        const result = await book.save({
            fields: ['name', 'subCatId', 'description', 'featureImage', 'coverImage', 'listenUrl']
        })

        return result
    }
}


