import { useNavigate } from "react-router-dom";
import { useTitle } from "../../utils/UseTitle";
import "./supplier-order-list.css";
import { useEffect, useState } from "react";

import { supplierOrderService } from "../../service/supplierOrderService";
import { notificationService } from "../../service/notificationService";
import type { SupplierOrderModel } from "../../models/supplierOrderModel";


export function SupplierOrderList() {

    useTitle("Supplier Orders")
    const navigate = useNavigate();

    const [orders, setOrders] = useState<SupplierOrderModel[]>([]);

    useEffect(() => {
        supplierOrderService.getAllSupplierOrders()
            .then(setOrders)
            .catch(err => {
                console.log(err);
                notificationService.error("Failed to load Supplier orders. ");

            })
    }, []);


    return (
        <div className="SupplierOrderList">

            <div className="header">
                <h1>Suppliers Orders</h1>
                <button onClick={() => {
                    navigate("/supplier-orders/add")
                }}>+ New Order
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>Supplier</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>total</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (<tr key={order.idOrder}>
                        <td>{order.orderNumber}</td>
                        <td>{order.supplierName}</td>
                        <td>{new Date(order.orderDate).toLocaleString("he-il", {dateStyle:"short"})}</td>
                        <td>{order.orderStatus}</td>
                        <td>₪{Number(order.totalCost).toFixed(2)}</td>
                        <td>
                            <button  type="button" onClick={() => { navigate(`/supplier-orders/${order.idOrder}`) }}
                            >Details</button>
                        </td>


                    </tr>))}
                </tbody>
            </table>

        </div>
    );
}
