import axios from "axios";
import { AddCustomerDto, CustomerAuthResponseModel, CustomerLoginDto, CustomerModel, CustomerRegisterDto, updateCustomerDto } from "../models/customer-model";
import { appConfig } from "../utils/app-config";
import { customerLogin, customerLogout } from "../redux/customer-auth-slice";

import { store } from "../redux/inventory-store";


class CustomerService {


    //Customer Register
    public async registerCustomer(customer:CustomerRegisterDto):Promise<CustomerAuthResponseModel>{
        
        const response = await axios.post<CustomerAuthResponseModel>(`${appConfig.customerRegisterUrl}`,customer);
        
        store.dispatch(customerLogin(response.data))
        
        return response.data;
     
        
    }



    // Customer login
    public async loginCustomer(credentials:CustomerLoginDto):Promise<CustomerAuthResponseModel>{
        
        const response = await axios.post<CustomerAuthResponseModel>(`${appConfig.customerLoginUrl}`,credentials);
        
        store.dispatch(customerLogin(response.data))
        
        return response.data;

        
    }


    //logout
    public logoutCustomer():void{
        store.dispatch(customerLogout());
    }


    //Get All Customers
    public async getAllCustomers(): Promise<CustomerModel[]> {

        const response = await axios.get<CustomerModel[]>(appConfig.customersUrl);

        return response.data;
    }



    //Get One Customer
    public async getOneCustomer(id: number): Promise<CustomerModel> {

        const response = await axios.get<CustomerModel>(`${appConfig.customersUrl}/${id}`);

        return response.data;
    }



    //Get Search customer
    public async getSearchCustomer(text: string): Promise<CustomerModel[]> {

        const response = await axios.get<CustomerModel[]>(`${appConfig.customersUrl}/search`, {

            params: { text }
        })
        return response.data;
    }


    //Add customer
    public async addCustomer(customer: AddCustomerDto): Promise<CustomerModel> {

        const response = await axios.post<CustomerModel>(appConfig.customersUrl, customer);

        return response.data;
    }

    //Update customer
    public async updateCustomer(id: number, customer: updateCustomerDto): Promise<CustomerModel> {

        const response = await axios.put<CustomerModel>(`${appConfig.customersUrl}/${id}`, customer)

        return response.data

    }



    //Delete customer
    public async deleteCustomer(id: number): Promise<void> {
        await axios.delete(`${appConfig.customersUrl}/${id}`)
    }
}

export const customerService = new CustomerService();