import express from "express";
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
import { saleOrderController } from "./controllers/sale-order-controller";

import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import { Socket } from "dgram";
import { initSocket } from "./utils/socket";
import helmet from "helmet";
import { apiLimiter } from "./middleware/rate-limit-middleware";
import { customerController } from "./controllers/customers-controller";
import { vipCardController } from "./controllers/vip-card-controller";
import { vipCardTransactionsController } from "./controllers/vip-card-transactions-controller";




class App {

    public start(): void {
        try {

            const app = express();
            app.use(
                helmet({
                    crossOriginResourcePolicy: {
                        policy: "cross-origin"
                    }
                })
            );
            // app.use(apiLimiter)

            process.env.JWT_SECRET

            app.use("/api/products/images", express.static("storage/products"));
            app.use("/api/events/media", express.static("storage/events"));
            app.use("/api/customers/images", express.static("storage/customers"));
            app.use("/api/videos", express.static("storage/videos"));

            
            app.use(fileUpload());
            app.use(cors());
            app.use(express.json());
            app.use(eventInventoryController.router)
            app.use(eventController.router);
            app.use(userController.router);
            app.use(categoriesController.router);
            app.use(productController.router);
            app.use(supplierController.router);
            app.use(productSupplierController.router);
            app.use(supplierOrderController.router);
            app.use(saleOrderController.router);
            app.use(customerController.router);
            app.use(vipCardController.router);
            app.use(vipCardTransactionsController.router);

            app.use(errorMiddleware.routeNotFound);
            app.use(errorMiddleware.catchAll);

            const httpServer = createServer(app);

            initSocket(httpServer);


            httpServer.listen(appConfig.port, () => {
                console.log("Listening on http://localhost:" + appConfig.port);

            })


        } catch (err: any) {
            console.log(err);

        }
    }


}

const app = new App();
app.start();