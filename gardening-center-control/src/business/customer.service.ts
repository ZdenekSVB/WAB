import { Customer } from "../persistence/models/customer.model";

export const customerService = {
    // Search customers by name (case-insensitive)
    async searchByName(name: string) {
        return Customer.find({ name: { $regex: name, $options: "i" } });
    },

    // Get a customer by their ID
    async getById(id: string) {
        return Customer.findById(id);
    },

    // Get a customer by their email
    async getByEmail(email: string) {
        return Customer.findOne({ email });
    },

    // Update a customer by ID
    async updateById(id: string, updateData: Partial<{ name: string; phone: string }>) {
        return Customer.findByIdAndUpdate(id, updateData, { new: true });
    },

    // Register a new customer
    async register(data: { name: string; email: string; phone: string }) {
        const existingCustomer = await Customer.findOne({ email: data.email });

        if (existingCustomer) {
            throw new Error("Customer with this email already exists.");
        }

        const newCustomer = new Customer(data);
        return newCustomer.save();
    },

    // Simulated login (token generation assumed handled externally)
    async login(email: string, password: string) {
        const customer = await Customer.findOne({ email });

        if (!customer) {
            throw new Error("Invalid email or password.");
        }

        // This assumes you have a token service to handle token generation
        return `token-for-${customer.id}`;
    },
};
