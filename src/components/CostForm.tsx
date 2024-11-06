import { useState } from "react";

const CostForm = () => {
  const [costType, setCostType] = useState("Air Freight Cost");
  const [description, setDescription] = useState("");
  const [pricingType, setPricingType] = useState("Price per box");
  const [currency, setCurrency] = useState("EUR");
  const [price, setPrice] = useState(0);
  const [vatRate, setVatRate] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [costTotal, setCostTotal] = useState(0);
  const [costs, setCosts] = useState([]);
  const [boxCount, kgCount] = [800, 3200];
  const [priceError, setPriceError] = useState(false);
  const [formError, setFormError] = useState(false);

  const calculateCostTotal = (newPrice) => {
    let total = 0;
    if (pricingType === "Price per box") {
      total = newPrice * boxCount;
    } else if (pricingType === "Price per kilo") {
      total = newPrice * kgCount;
    } else if (pricingType === "Price per consignment") {
      total = newPrice;
    }
    setCostTotal(total);
  };

  const calculateVatAmount = (newVatRate, total) => {
    const vat = (newVatRate / 100) * total;
    setVatAmount(vat);
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPrice(newPrice);
    setFormError(false); // Kullanıcı alanı doldurunca hata kaybolsun
    if (newPrice !== "") {
      calculateCostTotal(parseFloat(newPrice));
    } else {
      setCostTotal(0);
    }
  };

  const handleVatRateChange = (e) => {
    const newVatRate = e.target.value;
    setVatRate(newVatRate);
    setFormError(false);
    if (newVatRate !== "") {
      calculateVatAmount(parseFloat(newVatRate), costTotal);
    } else {
      setVatAmount(0);
    }
  };

  const addCost = () => {
    // Tüm alanları kontrol et
    if (!costType || !price || !vatRate) {
      setFormError(true); // Eğer boş alan varsa genel hata göster
      return; // İşlemi durdur
    }

    const selectedCostType = costType || "Air Freight Cost";

    // Tüm alanlar doluysa yeni cost ekle
    const newCost = {
      costType: selectedCostType,
      description,
      pricingType,
      currency: "EUR",
      price,
      costTotal,
      vatRate,
      vatAmount,
    };
    setCosts([...costs, newCost]);

    // Hata mesajını kapat ve formu sıfırla
    setFormError(false);
    setCostType("");
    setDescription("");
    setPricingType("Price per box");
    setPrice("");
    setVatRate("");
    setVatAmount(0);
    setCostTotal(0);
    setCurrency("EUR");
  };

  return (
    <div className="p-4 space-y-4  bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">Add Cost</h2>
      <div className="flex flex-col space-y-4">
        <div className="w-80 flex justify-between">
          <label>Cost Type</label>
          <select
            value={costType}
            onChange={(e) => setCostType(e.target.value)}
            className="border-2 border-black pl-2"
          >
            <option>Air Freight Cost</option>
            <option>Clearance Cost</option>
            <option>Delivery Cost</option>
          </select>
        </div>

        <div className="w-80 flex justify-between">
          <label>Description</label>
          <input
            className="border-2 border-black pl-2"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="w-80 flex justify-between">
          <label>Pricing Type</label>
          <select
            className="border-2 border-black pl-2"
            value={pricingType}
            onChange={(e) => setPricingType(e.target.value)}
          >
            <option>Price per box</option>
            <option>Price per kilo</option>
            <option>Price per consignment</option>
          </select>
        </div>

        <div className="w-80 flex justify-between">
          <label>Currency</label>
          <div className="space-x-4">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="border-2 border-black pl-2 w-24"
            >
              <option>EUR</option>
              <option>USD</option>
              <option>GBP</option>
              <option>TRY</option>
            </select>
            <input className="border-2 border-black pl-2 w-20" type="number" />
          </div>
        </div>
        <div>
          <div className="w-80 flex justify-between">
            <label>Price</label>
            <input
              className="border-2 border-black pl-2"
              type="number"
              value={price}
              onChange={handlePriceChange} // Fiyat değiştiğinde otomatik Cost Total hesaplanacak
            />
          </div>
          {priceError && (
            <span className="text-red-500 text-sm">
              Price değeri boş bırakılamaz.
            </span>
          )}
        </div>

        <div className="w-80 flex justify-between">
          <label>VAT Rate %</label>
          <input
            className="border-2 border-black pl-2"
            type="number"
            value={vatRate}
            onChange={handleVatRateChange} // VAT Rate değiştiğinde otomatik VAT Amount hesaplanacak
          />
        </div>

        <div className="w-80 flex justify-between">
          <label>VAT Amount</label>
          <input
            className="border-2 border-black pl-2"
            type="number"
            value={vatAmount}
            readOnly // Bu alan sadece hesaplamaları göstermek için olacak
          />
        </div>

        <div className="w-80 flex justify-between">
          <label>Cost Total</label>
          <input
            className="border-2 border-black pl-2"
            type="number"
            value={costTotal}
            readOnly // Bu alan da sadece hesaplama gösterecek
          />
        </div>
      </div>

      <button onClick={addCost} className="px-4 py-2 bg-blue-500 text-white">
        Add Cost
      </button>

      {formError && (
        <p className="text-red-500 text-sm mt-2">
          Lütfen tüm zorunlu alanları doldurunuz.
        </p>
      )}

      {/* Costs Table */}
      <table className="w-full mt-4 border">
        <thead className="w-full bg-red-200">
          <tr>
            <th>Cost Type</th>
            <th>Description</th>
            <th>Pricing Type</th>
            <th>Price</th>
            <th>Cost Total</th>
            <th>VAT Rate %</th>
            <th>VAT Amount</th>
          </tr>
        </thead>
        <thead className="w-full bg-yellow-300">
          {costs.map((cost, index) => (
            <tr key={index}>
              <th>{cost.costType}</th>
              <th>{cost.description}</th>
              <th>{cost.pricingType}</th>
              <th>{cost.price}</th>
              <th>{cost.costTotal}</th>
              <th>{cost.vatRate}</th>
              <th>{cost.vatAmount}</th>
            </tr>
          ))}
        </thead>
      </table>
    </div>
  );
};

export default CostForm;