import './Orders.scss'
import { useEffect, useRef, useState } from 'react'
import useIsDashboardActiveContext from '../../../hooks/DashboardActiveContext'
import { Order } from '../../../types/types'
import { useCurrentUserContext } from '../../../hooks/CurrentUserContext'

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const { currentUser } = useCurrentUserContext()
  const { isDashboardActive } = useIsDashboardActiveContext() // TODO: use in a useEffect to rerender

  useEffect(() => {
    if (!currentUser) {
      return
    }

    if (isDashboardActive) {
      fetchOrders(currentUser.userId).then(
        (orders) => {
          if (orders) {
            setOrders(orders)
          }
        },
        () => {
          return
        }
      )
    }
  }, [currentUser, isDashboardActive])

  const handleDelete = (orderId: string) => {
    if (!currentUser) {
      return
    }
    // Filter out the order with the matching ID
    delOrderApiRequest(orderId, currentUser.userId).then(
      () => {
        return
      },
      () => {
        return
      }
    )
    setOrders((prevOrders) => prevOrders.filter((order) => order.orderId !== orderId))
  }

  return (
    <div className="orders">
      {orders.length > 0 ? (
        orders.map((order) => (
          <OrderCard
            key={order.orderId}
            id={order.orderId}
            title={order.title}
            dateOrdered={order.createdAt}
            dateDelivered={order.deliveredAt}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  )
}

interface OrderCardProps {
  id: string
  title: string
  dateOrdered: string
  dateDelivered: string
  onDelete: (id: string) => void
}

function OrderCard({ id, title, dateOrdered, dateDelivered, onDelete }: OrderCardProps) {
  const [isActive, setIsActive] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  /* feature: 'active' effect is removed on scroll. */
  useEffect(() => {
    const handleScroll = () => {
      setIsActive(false) // Deactivate the card on scroll
    }

    const parentScrollable = cardRef.current?.closest('.orders')
    if (isActive && parentScrollable) {
      // Attach the scroll listener to the parent scrollable container
      parentScrollable.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (parentScrollable) {
        // Cleanup the scroll listener when the card is inactive
        parentScrollable.removeEventListener('scroll', handleScroll)
      }
    }
  }, [isActive])

  return (
    <div
      ref={cardRef}
      className={`order-card ${isActive ? 'active' : ''}`}
      tabIndex={0} // enables focus/blur
      onClick={() => {
        setIsActive(!isActive)
      }}
      onBlur={() => {
        setIsActive(false)
      }}
    >
      <p className="title">
        <strong>Title: </strong> {title}
      </p>
      <p className="dates">
        <span>
          <strong>Date Ordered:</strong> {dateOrdered}
        </span>
        <span>
          <strong>Date Delivered:</strong> {dateDelivered}
        </span>
      </p>
      <button
        className={`delete ${isActive ? 'active' : ''}`}
        onClick={() => {
          onDelete(id)
          // function to delete api request the order and update the orderlist with setOrders
        }}
      >
        ❌
      </button>
    </div>
  )
}

// Helper Functions

// This function will be called in the effect to fetch orders from your backend
async function fetchOrders(userId: string) {
  try {
    const url = '/api/orders'
    const options = {
      method: 'GET',
      headers: {
        Authorization: userId,
        'Content-Type': 'application/json',
      },
    }

    console.log('sending GET /api/orders request...')

    // Replace '/api/orders' with your real endpoint
    const res = await fetch(url, options)

    if (!res.ok) {
      console.error('Unexpected error:', res)
      return
    }

    const orders = (await res.json()) as unknown as Order[]
    console.log('Orders retrieved successfully:', res)

    return orders
  } catch (error) {
    console.error('Error fetching orders:', error)
  }
}

async function delOrderApiRequest(orderId: string, userId: string) {
  const url = `/api/orders/${orderId}`
  const options = {
    method: 'DELETE',
    headers: {
      Authorization: userId,
      'Content-Type': 'application/json',
    },
  }

  try {
    console.log(`Sending request to delete order with orderId: ${orderId}`)
    const res = await fetch(url, options)

    if (!res.ok) {
      console.error('Unexpected error:', res)
      return
    }

    console.log('Order successfully deleted:', res)
  } catch (error) {
    console.error('Error deleting order:', error)
  }
}
