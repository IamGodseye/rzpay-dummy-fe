import TshirtImg from "./tshirt.svg";
import { useState } from "react";

function Product() {
  const [amount, setAmount] = useState(500);
  const [inputAmount, setInputAmount] = useState(amount);

  const handleAmountChange = (e) => {
    setInputAmount(e.target.value);
  };

  const handleSubmit = () => {
    setAmount(Number(inputAmount));
  };
  const currency = "INR";
  const receiptId = "qwsaq1";

  const paymentHandler = async (e) => {
    // TODO: change to backend endpoint with orgId 
    const response = await fetch("http://localhost:3000/wallets/d7cb832c-3971-4188-981d-f752dd17c91b/create-order", {
      method: "POST",
      body: JSON.stringify({
        amount,
        currency,
        // receipt: receiptId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data } = await response.json();
    const { order } = data;
    console.log(order);

    var options = {
      // TODO: change this key to the one from the backend
      key: "rzp_test_UAqm8vLyBahjzw", // Enter the Key ID generated from the Dashboard
      amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency,
      name: "Acme Corp", //your business name
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        console.log(response);
        const body = {
          ...response,
        };

        const validateRes = await fetch(
          // TODO: check this endpoint with backend
          "http://localhost:3000/wallets/verify-payment",
          {
            method: "POST",
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const jsonRes = await validateRes.json();
        console.log(jsonRes);
      },
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        name: "Web Dev Matrix", //your customer's name
        email: "webdevmatrix@example.com",
        contact: "9000000000", //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    e.preventDefault();
  };

  return (
    <div className="product">
      <h2>Tshirt</h2>
      <p>Solid blue cotton Tshirt</p>
      <img src={TshirtImg} alt="Tshirt" />
      <br />
      <div>
        <label htmlFor="amount">Enter Amount: </label>
        <input
          type="number"
          id="amount"
          name="amount"
          min="1"
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <br />
      <button onClick={paymentHandler}>Pay</button>
    </div>
  );
}

export default Product;
