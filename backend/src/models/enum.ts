export enum UserRole {
    Admin = "admin",
    Manager = "manager",
    Employee = "employee"
}


export enum UnitType {
    Unit = "unit",
    Bottle = "bottle",
    Liter = "liter",
    Milliliter = "milliliter",
    Kilogram = "kilogram",
    Gram = "gram"
}


export enum SupplierOrderStatus {
    Draft ="draft",
    Ordered = "ordered",
    PartiallyReceived = "partially_received",
    Received = "received",
    Cancelled = "cancelled"
}

export enum EventStatus {
    Planned = "planned",
    Active = "active",
    Completed = "completed",
    Cancelled = "cancelled"
}

export enum SaleStatus {
    Open ="open",
    Paid = "paid",
    Cancelled = "cancelled",
    Refunded = "refunded"
}


export enum PaymentMethod {
    Cash = "cash",
    CreditCard = "credit_card",
    Bit = "bit",
    PayBox = "paybox",
    Other = "other"
}


export enum InventoryMovementType {
    Purchase = "purchase",
    Sale = "sale",
    EventAllocation = "event_allocation",
    EventReturn = "event_return",
    Damage = "damage",
    Waste = "waste",
    Refound = "refound",
    ManualAddition = "manual_addition",
    ManualReduction = "manual_reduction"
}

export enum InventoryReferenceType {
    SupplierOrder = "supplier_order",
    Sale = "sale",
    Event = "event",
    Manual = "manual"
}

export enum StatusCode {
    OK = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Conflict = 409,
    InternalServerError = 500
}
