import  express from "express";
import { eventInventoryController } from "./controllers/event-inventory-controller";
import cors from "cors";
import { appConfig } from "./utils/app-config";
import { userController } from "./controllers/users-controller";
import { eventController } from "./controllers/events-controller";
import { categoriesController } from "./controllers/categories-controller";
import { productController } from "./controllers/product-controller";




class App {

    public start():void {
        try{

            const server = express();
            server.use(cors())
            server.use(express.json());
            server.use(eventInventoryController.router)
            server.use(eventController.router);
            server.use(userController.router);
            server.use(categoriesController.router);
            server.use(productController.router);

            server.listen(appConfig.port, ()=> console.log("Listening on http://localhost:  " + appConfig.port));
    

        }catch(err:any){
            console.log(err);
            
        }
    }


}

const app = new App();
app.start();