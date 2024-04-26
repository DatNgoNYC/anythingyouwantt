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

        if (!orders) {
          setError('Could not get user data.')
        } else {
          setOrderList(orders)
        }

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

async function fetchOrders(userId: string): Promise<Array<Order> | void> {
  const url = '/api/user/orders'
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Id': userId,
    },
  }

  const orders = await fetch(url, options)
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error)
      } else {
        return response.json()
      }
    })
    .then((data: { orders: Order[] }) => {
      return data.orders
    })
    .catch((error) => {
      console.error(`Error while trying to fetch orders: ${error}.`)
    })

  return orders
}
