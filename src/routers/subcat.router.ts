import { Router } from "express";
import { SubCat } from "../models/subcat.model";
import { SubCatService } from "../services/subcat.service";

export const subCatRouter = Router()
const subCatService = new SubCatService()

subCatRouter.get('/subcat', async (req, res) => {
    try {
        const catId: any = req.query.catId
        const subcats = await subCatService.getSubCatList(catId)
        res.status(200).json({ message: 'success', data: subcats })
    } catch (e) {
        console.log('error: ' + e.message)
        res.status(500).json({ message: e.message })
    }
})
