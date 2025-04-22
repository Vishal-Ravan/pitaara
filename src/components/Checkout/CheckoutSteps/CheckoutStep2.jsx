import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";


function getGuestIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('guestId');
}

// Example usage:
// This will log '38f40d1d-4c96-4ee2-a79e-1863e82ceec7'




export const  CheckoutStep2=()=>{
  
// Generate or retrieve guest ID
const getGuestId = async () => {
  debugger
  const guestIdtemp = getGuestIdFromURL();
  debugger
console.log("000000000000000000000000000",guestIdtemp); 
  let guestId = await Promise.resolve(localStorage.getItem("guestId"));
  if (!guestId) {
    guestId = `guest_${Math.random().toString(36).substring(2, 15)}`;
    await Promise.resolve(localStorage.setItem("guestId", guestId));
  }
  return guestId;
};

// Check if the token is a guest ID (or simply if no token exists)

useEffect(()=>{
  getGuestId()

},[])
return(
  <></>
)

}