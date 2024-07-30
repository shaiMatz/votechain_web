/* eslint-disable react/prop-types */
import { createContext, useState, useContext } from 'react';
import addressData from '../addresses.json';  // Make sure to place addresses.json in the src directory

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState(addressData);

  const addAddress = (type, value, parent) => {
    setAddresses((prev) => {
      const updatedAddresses = { ...prev };
      if (type === 'country' && !prev.countries.includes(value)) {
        updatedAddresses.countries.push(value);
        updatedAddresses.states[value] = [];
      } else if (type === 'state' && parent && !prev.states[parent].includes(value)) {
        updatedAddresses.states[parent].push(value);
        updatedAddresses.cities[parent] = [];
      } else if (type === 'city' && parent && !prev.cities[parent].includes(value)) {
        updatedAddresses.cities[parent].push(value);
        updatedAddresses.streets[parent] = [];
      } else if (type === 'street' && parent && !prev.streets[parent].includes(value)) {
        updatedAddresses.streets[parent].push(value);
      }
      return updatedAddresses;
    });
  };

  return (
    <AddressContext.Provider value={{ addresses, addAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => useContext(AddressContext);
