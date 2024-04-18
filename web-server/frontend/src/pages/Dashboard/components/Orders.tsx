import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { Order } from '../../../types';

export { Orders };

const Orders = (): React.JSX.Element => {
  const { userId } = useContext(AuthContext);
  const [orderList, setOrderList] = useState<Array<Order>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function loadPage() {
      if (!userId) return;

      try {
        setLoading(true);

        const orders = await fetchOrders(userId);

        setOrderList(orders);
        setLoading(false);
      } catch (error) {
        setError('Error while trying to fetch user info.');
        setLoading(false);
      }
    }

    loadPage();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{`Error: ${error}`}</div>;

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
          );
        })}
      </ul>
    </div>
  );
};

async function fetchOrders(userId: string): Promise<Array<Order>> {
  console.log(`user ${userId} is fetching Orders`);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return [
    { orderId: '0000', title: 'job', orderDate: 'April 11 2024 1:11am' },
    { orderId: '0001', title: 'thingsss', orderDate: 'April 11 2024 1:12am' },
  ];
}
