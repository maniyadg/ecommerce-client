import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout'
import { useAuth } from '../context/auth';
import { useCart } from '../context/cart'
import axios from 'axios'
import toast from "react-hot-toast";

function CartPage() {

  const [accessToken, setaccessToken] = useAuth();
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return(total)

      // return total.toLocaleString("en-IN", {
      //   style: "currency",
      //   currency: "INR",
      // });
    } catch (error) {
      console.log(error);
    }
  };

const amount = totalPrice()


  //detele item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  const checkoutHandler = async (amount , cart) => {

    const { data: { key } } = await axios.get("http://www.localhost:4000/api/getkey")

    const { data: { order } } = await axios.post("http://localhost:4000/api/payment/checkout", {
        amount 
    })

    console.log(order)

    const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "6 Pack Programmer",
        description: "Tutorial of RazorPay",
        image: "https://avatars.githubusercontent.com/u/25058652?v=4",
        order_id: order.id,
        handler: async (response ) => {
          try {
            const verifyUrl = "http://localhost:4000/api/payment/paymentverification";
            const { data } = await axios.post(verifyUrl,  {response ,  cart });

          } catch (error) {
            console.log(error);
          }
        },
        prefill: {
            name: "Gaurav Kumar",
            email: "gaurav.kumar@example.com",
            contact: "9999999999"
        },
        notes: {
            "address": "Razorpay Corporate Office"
        },
        theme: {
            "color": "#121212"
        }
    };
    const razor = new window.Razorpay(options);
    razor.open();
}

  // payment checkout
  // const checkoutHandler = async (amount) => {

  //   try {

  //     setLoading(true);

  //     const { data: { key } } = await axios.get("http://www.localhost:4000/api/getkey")

  //     const { data: { order } } = await axios.post("http://localhost:4000/api/payment/checkout", {
  //       amount
  //   })


  //   const options = {
  //     key,
  //     amount: order.amount,
  //     currency: "INR",
  //     name: "6 Pack Programmer",
  //     description: "Tutorial of RazorPay",
  //     image: "https://avatars.githubusercontent.com/u/25058652?v=4",
  //     order_id: order.id,
  //     callback_url: "http://localhost:4000/api/paymentverification",
  //     prefill: {
  //         name: "Gaurav Kumar",
  //         email: "gaurav.kumar@example.com",
  //         contact: "9999999999"
  //     },
  //     notes: {
  //         "address": "Razorpay Corporate Office"
  //     },
  //     theme: {
  //         "color": "#121212"
  //     }
  // };
  // const razor = new window.Razorpay(options);
  // razor.open();

  //     setLoading(false);
  //     localStorage.removeItem("cart");
  //     setCart([]);
  //     navigate("/dashboard/user/orders");
  //     toast.success("Payment Completed Successfully ");

  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }

  // }


  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {`Hello ${accessToken?.token && accessToken?.user?.name}`}
            </h1>
            <h4 className="text-center">
              {cart?.length
                ? `You Have ${cart.length} items in your cart ${accessToken?.token ? "" : "please login to checkout"
                }`
                : " Your Cart Is Empty"}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            {cart?.map((p) => (
              <div className="row mb-2 p-3 card flex-row">
                <div className="col-md-4">
                  <img
                    src={`/api/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                    width="100px"
                    height={"100px"}
                  />
                </div>
                <div className="col-md-8">
                  <p>{p.name}</p>
                  <p>{p.description.substring(0, 30)}</p>
                  <p>Price : Rs.{p.price}.00</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCartItem(p._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4 text-center">
            <h2>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total : {totalPrice()} </h4>
            {accessToken?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{accessToken?.user?.address}</h5>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-3">
                {accessToken?.token ? (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() =>
                      navigate("/login", {
                        state: "/cart",
                      })
                    }
                  >
                    Plase Login to checkout
                  </button>
                )}
              </div>
            )}
            <div className="mt-2">
              {!cart?.length ? (
                ""
              ) : (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={() => checkoutHandler(amount , cart)}
                  >
                  {loading ? "Processing ...." : "Make Payment"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CartPage