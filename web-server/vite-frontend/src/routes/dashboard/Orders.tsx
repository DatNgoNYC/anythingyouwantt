import { Outlet } from 'react-router-dom';

function Orders() {
  return (
    <div>
      <div>list of products</div>
      <Outlet />
    </div>
  );
}

export default Orders;
