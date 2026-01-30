import axios from 'axios'
import { Product } from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface OrderItemDto {
  productId: string
  quantity: number
}

interface AddressDto {
  name: string
  address1: string
  address2?: string
  city: string
  postalCode: string
  country: string
  phone?: string
}

interface CreateOrderDto {
  items: OrderItemDto[]
  shippingAddress?: AddressDto
  billingAddress?: AddressDto
  customerNotes?: string
  paymentMethod?: string // New field for payment method
  shippingAmount?: number
  discountAmount?: number
  vatRatePercent?: number
  currency?: string
}

interface User {
  firstName: string
  lastName: string
}

export interface OrderResponse {
  id: string
  userId: string
  status: string
  paymentStatus: string
  subTotalAmount: number
  vatAmount: number
  vatRatePercent: number
  discountAmount: number
  shippingAmount: number
  grandTotalAmount: number
  currency: string
  shippingAddress: any
  billingAddress: any
  customerNotes: string | null
  paymentMethod?: string // New field for payment method
  createdAt: string
  updatedAt: string
  orderItems: Array<{
    id: string
    productId: string
    productNameSnapshot: string
    productSkuSnapshot: string
    quantity: number
    unitPriceSnapshot: number
    totalItemPrice: number
    itemVatAmount: number
  }>
  user: User
}

export const OrderService = {
  async createOrder(
    orderData: CreateOrderDto,
    token: string
  ): Promise<OrderResponse> {
    try {
      const response = await axios.post(`${API_URL}/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  },

  async getUserOrders(
    token: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: OrderResponse[]; total: number; pages: number }> {
    try {
      const response = await axios.get(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { page, limit },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching user orders:', error)
      throw error
    }
  },

  async getOrderById(orderId: string, token: string): Promise<OrderResponse> {
    try {
      const response = await axios.get(`${API_URL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error)
      throw error
    }
  },
}
