import axios from "axios";
import { appConfig } from "../utils/app-config";
import type { InventoryModel } from "../models/inventory-model";




class InventoryService {

    public async getLiveInventory():Promise<InventoryModel[]>{
         const response = await axios.get<InventoryModel[]>(appConfig.inventoryUrl);
         return response.data;
    }      

}

export const inventoryService = new InventoryService();