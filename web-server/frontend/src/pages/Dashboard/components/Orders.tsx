import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { Order } from '../../../types'
import styles from '../Dashboard.module.scss'

export { Orders }

const Orders = (): React.JSX.Element => {
  const { userId } = useContext(AuthContext)
  const [orderList, setOrderList] = useState<Array<Order>>([
    {
      orderId: '0',
      title: 'test',
      orderDate: 'June 12, 2024',
    },
    {
      orderId: '1',
      title: 'test2',
      orderDate: 'June 15, 2024',
    },
  ])
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

  // if (loading) return <div>Loading...</div>
  // if (error) return <div>{`Error: ${error}`}</div>

  return (
    <div className={styles.Orders}>
      <ul>
        {orderList.map((order) => {
          return (
            <li key={order.orderId}>
              <p>
                <b>Title: </b> {order.title}
              </p>
              <p>
                <b>Date: </b> {order.orderDate}
              </p>
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
