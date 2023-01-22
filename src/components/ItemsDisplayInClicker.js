import { useState, useEffect } from 'react';
import { API } from '../lib/api';
import ItemImage from './ItemImage';
import gardenBiscuits from '../assets/8-bit-garden-biscuits.png';
import '../styles/Items.scss';

export default function ItemsDisplayInClicker() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    API.GET(API.ENDPOINTS.allItems)
      .then(({ data }) => {
        setItems(data);
        console.log(data);
      })
      .catch(({ message, response }) => {
        console.error(message, response);
      });
  }, []);

  return (
    <>
      <h1>Items</h1>
      {items?.map((item) => (
        <>
          <div key={item.name}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <img src={gardenBiscuits} className='item-image'></img>
          </div>
        </>
      ))}
    </>
  );
}
