import  express from "express";
import { eventInventoryController } from "./controllers/event-inventory-controller";
import cors from "cors";
import { appConfig } from "./utils/app-config";
import { userController } from "./controllers/users-controller";
import { eventController } from "./controllers/events-controller";
import { categoriesController } from "./controllers/categories-controller";
import { productController } from "./controllers/product-controller";
import { supplierController } from "./controllers/supplier-controller";
import { productSupplierController } from "./controllers/product-supplier-controller";
import { supplierOrderController } from "./controllers/supplier-orders-controller";
import { errorMiddleware } from "./middleware/errors-middleware";

import fileUpload from "express-fileupload";



class App {

    public start():void {
        try{

            const server = express();

            server.use("/api/products/images", express.static("src/assets/images/products"));

            server.use(fileUpload());
            server.use(cors());
            server.use(express.json());
            server.use(eventInventoryController.router)
            server.use(eventController.router);
            server.use(userController.router);
            server.use(categoriesController.router);
            server.use(productController.router);
            server.use(supplierController.router);
            server.use(productSupplierController.router);
            server.use(supplierOrderController.router);


            server.use(errorMiddleware.routeNotFound);
            server.use(errorMiddleware.catchAll);

            server.listen(appConfig.port, ()=> console.log("Listening on http://localhost:  " + appConfig.port));
    

        }catch(err:any){
            console.log(err);
            
        }
    }


}

const app = new App();
app.start();