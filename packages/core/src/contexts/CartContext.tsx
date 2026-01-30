// frontend/contexts/CartContext.tsx
'use client'
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import { CartItem, Product, CartContextType } from '../lib/types'

const CartContext = createContext<CartContextType | undefined>(undefined)

const LOCAL_STORAGE_CART_KEY = 'subred_ecommerce_cart'

// Mock de servicio de instalación (esto vendría de tu base de datos de productos/servicios)
const MOCK_INSTALLATION_SERVICE_PRODUCT: Product = {
  id: 'serv-install-001',
  name: 'Servicio de Instalación Profesional',
  productType: 'SERVICE',
  price: 50000, // Precio base de instalación
  isPublished: true,
  // ...otros campos necesarios si es un producto completo
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY)
        return storedCart ? JSON.parse(storedCart) : []
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
    return []
  })

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [items])

  const addItem = (
    product: Product,
    quantity: number,
    includeInstallation: boolean = false
  ) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.productId === product.id
      )
      let newItems = [...prevItems]

      // Define installationServiceDetails only if includeInstallation is true AND it's a 'Producto'
      const installationServiceDetails =
        includeInstallation && product.productType === 'PRODUCT'
          ? {
              id: MOCK_INSTALLATION_SERVICE_PRODUCT.id,
              name: MOCK_INSTALLATION_SERVICE_PRODUCT.name,
              price: MOCK_INSTALLATION_SERVICE_PRODUCT.price, // This is the price of the service itself
            }
          : null

      if (existingItemIndex > -1) {
        const updatedItem = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
          // Update installation service if it's explicitly being changed or added with this "addItem" call.
          // If includeInstallation is false in this call, it could mean removing it, or just adding more product units without changing service status.
          // For simplicity: if includeInstallation is specified, set it, otherwise keep existing.
          // A more robust logic might need separate addService/removeService functions or clearer intent.
          installationService:
            installationServiceDetails !== undefined
              ? installationServiceDetails
              : newItems[existingItemIndex].installationService,
        }
        newItems[existingItemIndex] = updatedItem
      } else {
        newItems.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image:
            product.images && product.images.length > 0
              ? product.images[0]
              : undefined,
          installationService: installationServiceDetails,
        })
      }
      console.log(`Cart items after adding ${product.name}:`, newItems)
      return newItems
    })
  }

  const removeItem = (productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    )
    console.log(`PRODUCT with ID ${productId} removed from cart.`)
  }

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )
    console.log(
      `Quantity of PRODUCT with ID ${productId} updated to ${quantity}.`
    )
  }

  const clearCart = () => {
    setItems([])
    console.log('Carrito limpiado.')
  }

  const cartTotal = items.reduce((total, item) => {
    let itemTotal = item.price * item.quantity
    if (item.installationService) {
      // Add installation price multiplied by quantity of the main product item
      itemTotal += item.installationService.price * item.quantity
    }
    return total + itemTotal
  }, 0)

  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        cartTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
