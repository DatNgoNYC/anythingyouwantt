import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { Order } from '../../../types'

export { Orders }

const Orders = (): React.JSX.Element => {
  const { userId } = useContext(AuthContext)
  const [orderList, setOrderList] = useState<Array<Order>>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    async function loadPage() {
      if (!userId) return

      try {
        setLoading(true)

        const orders = await fetchOrders(userId)

        setOrderList(orders)
        setLoading(false)
      } catch (error) {
        setError('Error while trying to fetch user info.')
        setLoading(false)
      }
    }

    loadPage()
  }, [userId])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{`Error: ${error}`}</div>

  return (
    <div>
      <h2>Order List</h2>
      <ul>
        {orderList.map((order) => {
          return (
            <li key={order.orderId}>
              <strong>{order.title}</strong> \n
              <em>{order.orderDate}</em>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

async function fetchOrders(userId: string): Promise<Array<Order>> {
  try {
    const response = await fetch('/api/user/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        userId: userId as string,
      },
    })

    if (!response.ok) {
      console.error(`Failed to get order history for user: ${userId}`)
      throw Error()
    } else {
      const data: Array<Order> = await response.json()
      data.forEach((order) => {
        console.log(
          `Order Title: ${order.title}, Order ID: ${order.orderId}, Order Date: ${order.orderDate}`,
        )
      })

      // Assuming you want to return something specific after logging the orders
      return data
    }
  } catch (error) {
    console.error(`Could not get user information.`)
    throw Error()
  }
}
