import axios from "axios";
import { CustomerModel } from "../models/customer-model";
import { appConfig } from "../utils/app-config";


class CustomerService {

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
    public async addCustomer(customer: CustomerModel): Promise<CustomerModel> {

        const response = await axios.post<CustomerModel>(appConfig.customersUrl, customer);

        return response.data;
    }

    //Update customer
    public async updateCustomer(id: number, customer: CustomerModel): Promise<CustomerModel> {

        const response = await axios.put<CustomerModel>(`${appConfig.customersUrl}/${id}`, customer)

        return response.data

    }



    //Delete customer
    public async deleteCustomer(id: number): Promise<void> {
        await axios.delete(`${appConfig.customersUrl}/${id}`)
    }
}

export const customerService = new CustomerService();