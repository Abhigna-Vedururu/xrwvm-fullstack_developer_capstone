import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Dealers.css";
import "../assets/style.css";
import Header from "../Header/Header";

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  const root_url = window.location.origin + "/";
  const dealer_url = `${root_url}djangoapp/dealer/${id}`;
  const review_url = `${root_url}djangoapp/add_review`;
  const carmodels_url = `${root_url}djangoapp/get_cars`;

  // Submit review
  const postreview = async () => {
    let name =
      (sessionStorage.getItem("firstname") || "") +
      " " +
      (sessionStorage.getItem("lastname") || "");
    if (name.includes("null") || name.trim() === "") {
      name = sessionStorage.getItem("username");
    }

    if (!model || !review || !date || !year) {
      alert("⚠️ All details are mandatory");
      return;
    }

    const [make_chosen, model_chosen] = model.split(" ");

    const jsoninput = JSON.stringify({
      name,
      dealership: id,
      review,
      purchase: true,
      purchase_date: date,
      car_make: make_chosen,
      car_model: model_chosen,
      car_year: year,
    });

    try {
      const res = await fetch(review_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsoninput,
      });

      const json = await res.json();
      if (json.status === 200) {
        navigate(`/dealer/${id}`); // ✅ safer than window.location.href
      } else {
        alert("❌ Failed to post review. Try again.");
      }
    } catch (err) {
      console.error("Error posting review:", err);
      alert("❌ Network error.");
    }
  };

  // Get dealer info
  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url);
      const retobj = await res.json();

      if (retobj.status === 200 && retobj.dealer?.length > 0) {
        setDealer(retobj.dealer[0]);
      }
    } catch (err) {
      console.error("Error fetching dealer:", err);
    }
  };

  // Get car models
  const get_cars = async () => {
    try {
      const res = await fetch(carmodels_url);
      const retobj = await res.json();

      if (retobj.CarModels) {
        setCarmodels(Array.from(retobj.CarModels));
      }
    } catch (err) {
      console.error("Error fetching car models:", err);
    }
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>{dealer.full_name}</h1>

        <textarea
          id="review"
          cols="50"
          rows="7"
          placeholder="Write your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>

        <div className="input_field">
          Purchase Date{" "}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="input_field">
          Car Make & Model{" "}
          <select
            name="cars"
            id="cars"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="">Choose Car Make and Model</option>
            {carmodels.map((carmodel, idx) => (
              <option
                key={idx}
                value={`${carmodel.CarMake} ${carmodel.CarModel}`}
              >
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>
        </div>

        <div className="input_field">
          Car Year{" "}
          <input
            type="number"
            min="2015"
            max="2025"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>

        <div>
          <button className="postreview" onClick={postreview}>
            Post Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;
