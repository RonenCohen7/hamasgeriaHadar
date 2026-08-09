
import express, { Request, Response, NextFunction, response } from "express"
import { customerService } from "../services/customer-service";
import { verifyToken } from "../middleware/verify-token";
import { allowRoles } from "../middleware/role-middleware";
import { AddCustomerDto, CustomerRegisterDto, UpdateCustomerDto, CustomerAuthResponseModel   } from "../models/customer-model";
import { authLimiter } from "../middleware/rate-limit-middleware";



class CustomerController {

    public readonly router = express.Router();


    public constructor() {

        this.router.post("/api/customers/register", authLimiter, this.registerCustomer);
        this.router.post("/api/customers/login", authLimiter, this.loginCustomer);

        this.router.get("/api/customers", verifyToken, this.getAllCustomers);

        this.router.get("/api/customers/search", verifyToken, this.searchCustomer);

        this.router.get("/api/customers/:id", verifyToken, this.getOneCustomer);

        this.router.post("/api/customers", verifyToken, this.addCustomer);

        this.router.put("/api/customers/:id", verifyToken, this.updateCustomer);

        this.router.delete("/api/customers/:id", verifyToken, allowRoles("admin"), this.deleteCustomer);

    }


    //Customer Register
    private async registerCustomer(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const customer: CustomerRegisterDto = request.body;

            const auth: CustomerAuthResponseModel = await customerService.registerCustomer(customer);

            response.status(201).json(auth);

        } catch (err: any) {
            next(err);
        }
    }




    //Customer Login
    private async loginCustomer(request:Request, response:Response, next:NextFunction):Promise<void>{
        try{
            console.log("===CUSTOMER LOGIN ===");
            
            const credentials = request.body;
            
            console.log(request.body);
            
            const auth = await customerService.loginCustomer(credentials);

            response.json(auth);


        }
        catch(err: any){
            next:err
        }
    }


    //Get all customers
    private async getAllCustomers(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const customers = await customerService.getAllCustomers()
            response.json(customers);
        } catch (err: any) {
            next(err)
        }
    }


    //Get One customer
    private async getOneCustomer(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const id = Number(request.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                response.status(400).json({
                    message: "Event must be a positive number"

                });
                return;
            }
            const customer = await customerService.getOneCustomer(id);
            response.json(customer);

        } catch (err: any) {
            next(err)
        }
    }


    //Search Customer 
    private async searchCustomer(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const text = String(request.query.text ?? "").trim();
            if (!text) {
                response.status(400).json({
                    message: "Search text is required"
                });
                return;
            }
            console.log("Search text:", text);
            const customers = await customerService.searchCustomers(text);
            console.log("Search results:", customers);

            response.json(customers);

        } catch (err: any) {
            next(err)
        }
    }


    //Add customer
    private async addCustomer(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const customer: AddCustomerDto = request.body;

            const addCustomer = await customerService.addCustomer(customer)
            response.sendStatus(201).json(addCustomer)
        } catch (err: any) {
            next(err)
        }
    }



    //Update customer 
    private async updateCustomer(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(request.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                response.status(400).json({ message: "Id Must be a positive number" })
                return;
            }
            const customer: UpdateCustomerDto = request.body;

            const updatedCustomer = await customerService.updateCustomer(id, customer);
            response.sendStatus(204).json(updatedCustomer);

        } catch (err: any) {
            next(err)
        }
    }


    //soft delete
    private async deleteCustomer(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const id = Number(request.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                response.status(400).json({
                    message: "Customer id Must be a positive number"
                })
                return;
            }

            await customerService.deleteCustomer(id)

            response.sendStatus(204);

        } catch (err: any) {
            next(err)
        }
    }

}


export const customerController = new CustomerController();