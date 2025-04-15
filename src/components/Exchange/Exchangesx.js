import Link from "next/link";

export const Exchange = () => {
  return (
    <>
      {/* <!-- BEGIN 404 --> */}
      <div className="exchanges-page">
        <div className="wrapper">
          <div className="exchanges">
            <p>
              We want you to fall in love with every piece you order! However,
              if you wish to return or exchange a product, we’ve made the
              process simple and quick— <b><a href="https://api.whatsapp.com/send?phone=919220557803&text=Hello!%F0%9F%A4%A9%20I%20want%20to%20place%20an%20order%20%26%20know%20about%20any%20exclusive%20deals%20or%20discounts%F0%9F%98%8D" title="+919220557803" target="_blank">via WhatsApp only.</a></b>
            </p>

            <ul>
              Eligibility for Return/Exchange:
              <li>
              •  Returns or exchanges must be initiated within 3 days of receiving the order.
              </li>
              <li>
              •  The product must be unused, unworn, and in its original
                packaging with tags intact.
              </li>
              <li>
              •  Customised or personalised products are not eligible for
                return/exchange.
              </li>
            </ul>
            <h3>How to Initiate a Return or Exchange?</h3>
            <h6>
              {" "}
              1. Send Us a Message on <a href="">Whatsapp</a>
            </h6>

            <ul>
              {" "}
              Drop a message with the following details:
              <li> • Order ID</li>
              <li> • Reason for Return/Exchange</li>
              <li> • Clear Photos of the Product (if damaged or incorrect)</li>
            </ul>
            <h6>2. Wait for Confirmation</h6>
            <p>
              Our team will verify the details and respond within 24 hours with
              further instructions.
            </p>

            <h6>3. Ship the Product</h6>

            <ul>
              <li>
              •  Once approved, you'll be asked to ship the product back to our
                address (shared on WhatsApp).
              </li>
              <li>
              •   Please ensure it is securely packed to avoid damage in transit.
              </li>
              <li>
              •   Return shipping charges are to be borne by the customer unless
                the product was incorrect or damaged.
              </li>
            </ul>

            <h6>4. Exchange or Refund Processed</h6>
            <ul>
              <li>
              •  For exchanges, we’ll dispatch the replacement once the returned
                product is received and inspected.
              </li>
              <li>
              •  For returns, the refund will be processed to your original payment method within 5–7 working days on the original source of payment.
              </li>
            </ul>

            <h6>Please Note:</h6>
            <ul>
              <li>• Returns without WhatsApp initiation will not be accepted.</li>
              <li>
              • COD orders are eligible for any product
              </li>
              <li>
              • We reserve the right to reject returns if the product doesn't
                meet the eligibility criteria.
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* <!-- 404 EOF   --> */}
    </>
  );
};
