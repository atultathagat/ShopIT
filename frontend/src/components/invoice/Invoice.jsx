import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Invoice.css";
import { useParams } from "react-router-dom";
import { useOrderDetailsQuery } from "../../redux/api/orderApi";
import Loader from "../../components/layout/loader";
import MetaData from "../../components/layout/MetaData";
import toast from "react-hot-toast";
import { toPng} from "html-to-image";
import { jsPDF } from "jspdf";

export default function Invoice() {
  const ref = useRef(null);

  const params = useParams();
  const { data, isLoading, error, isError } = useOrderDetailsQuery(params?.id);
  const [pdfLoading, setPDFLoading] = useState(false);
  const order = data?.order || {};
  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [error]);
  if (isLoading) {
    return <Loader />;
  }
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    _id,
    createdAt,
    taxAmount,
    totalAmount,
    itemsPrice,
    shippingAmount,
  } = data.order;
  const handleDownloadClick = () => {
    if (ref.current === null) {
      return;
    }
    setPDFLoading(true);
    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          const doc = new jsPDF();
          const width = doc.internal.pageSize.getWidth();
          doc.addImage(img, "png", 0, 0, width, 0);
          doc.save(`invoice_${_id}.pdf`);
          setPDFLoading(false);
        };
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <MetaData title={"Order Invoice"} />
      <div className="order-invoice my-5">
        <div className="row d-flex justify-content-center mb-5">
          <button
            className="btn btn-success col-md-5"
            onClick={handleDownloadClick}
            disabled={pdfLoading}
          >
            <i className="fa fa-print"></i>{" "}
            {pdfLoading ? "Downloading Invoice..." : "Download Invoice"}
          </button>
        </div>
        <div
          id="order_invoice"
          ref={ref}
          className="p-3 border border-secondary"
        >
          <header className="clearfix">
            <div id="logo">
              <img src="/images/invoice-log.png" alt="Company Logo" />
            </div>
            <h1>INVOICE # ${_id}</h1>
            <div id="company" className="clearfix">
              <div>ShopIT</div>
              <div>
                455 Foggy Heights,
                <br />
                AZ 85004, US
              </div>
              <div>(602) 519-0450</div>
              <div>
                <a href="mailto:info@shopit.com">info@shopit.com</a>
              </div>
            </div>
            <div id="project">
              <div>
                <span>Name</span>
                {user?.name}
              </div>
              <div>
                <span>EMAIL</span> {user?.email}
              </div>
              <div>
                <span>PHONE</span>
                {shippingInfo.phoneNo}
              </div>
              <div>
                <span>ADDRESS</span>
                {shippingInfo?.address}, {shippingInfo?.city},
                {shippingInfo?.zipcode}, {shippingInfo?.country}
              </div>
              <div>
                <span>DATE</span>
                {new Date(createdAt).toLocaleString("en-US")}
              </div>
              <div>
                <span>Status</span> {paymentInfo?.status}
              </div>
            </div>
          </header>
          <main>
            <table className="mt-5">
              <thead>
                <tr>
                  <th className="service">ID</th>
                  <th className="desc">NAME</th>
                  <th>PRICE</th>
                  <th>QTY</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {orderItems?.map((orderItem) => (
                  <tr>
                    <td className="service">{orderItem?.product}</td>
                    <td className="desc">{orderItem?.name}</td>
                    <td className="unit">${orderItem?.price}</td>
                    <td className="qty">{orderItem?.quantity}</td>
                    <td className="total">
                      ${(orderItem?.quantity * orderItem?.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colspan="4">
                    <b>SUBTOTAL</b>
                  </td>
                  <td className="total">${itemsPrice}</td>
                </tr>

                <tr>
                  <td colspan="4">
                    <b>TAX 15%</b>
                  </td>
                  <td className="total">${taxAmount}</td>
                </tr>

                <tr>
                  <td colspan="4">
                    <b>SHIPPING</b>
                  </td>
                  <td className="total">${shippingAmount}</td>
                </tr>

                <tr>
                  <td colspan="4" className="grand total">
                    <b>GRAND TOTAL</b>
                  </td>
                  <td className="grand total">${totalAmount}</td>
                </tr>
              </tbody>
            </table>
            <div id="notices">
              <div>NOTICE:</div>
              <div className="notice">
                A finance charge of 1.5% will be made on unpaid balances after
                30 days.
              </div>
            </div>
          </main>
          <footer>
            Invoice was created on a computer and is valid without the
            signature.
          </footer>
        </div>
      </div>
    </div>
  );
}
